"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isAllowedEmail } from "@/lib/security";
import type { ServiceType } from "@/lib/types";

const PHONE_REGEX = /^\+?\d{10,15}$/;
const CONTACT_MIN_INTERVAL_MS = 60_000;
const CONTACT_MAX_PER_HOUR = 5;
const APPLICATION_MAX_PER_HOUR = 6;

function normalizePhone(value: string) {
  const cleaned = value.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+")) {
    return `+${cleaned.slice(1).replace(/\+/g, "")}`;
  }
  return cleaned.replace(/\+/g, "");
}

function pickFirstNonEmpty(...values: Array<string | null | undefined>) {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return "";
}

function isLegacyContactSchemaError(message: string) {
  const lower = message.toLowerCase();
  return (
    (lower.includes("phone_number") && lower.includes("does not exist")) ||
    (lower.includes("null value in column") &&
      lower.includes("email") &&
      lower.includes("violates not-null constraint"))
  );
}

export async function submitApplication(data: {
  name?: string;
  studentId?: string;
  issue: string;
  serviceType: ServiceType;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Please sign in to submit an application.");
  }
  if (!isAllowedEmail(user.email)) {
    throw new Error("This account is not allowed to submit requests.");
  }
  if (!user.email_confirmed_at) {
    throw new Error("Please verify your email before submitting a request.");
  }

  const issue = data.issue.trim();
  if (!issue) {
    throw new Error("Please describe your request.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, student_number")
    .eq("id", user.id)
    .maybeSingle();

  const meta = (user.user_metadata ?? {}) as {
    full_name?: unknown;
    student_number?: unknown;
  };

  const fullName = pickFirstNonEmpty(
    profile?.full_name,
    typeof meta.full_name === "string" ? meta.full_name : undefined,
    data.name
  );

  const studentId = pickFirstNonEmpty(
    profile?.student_number,
    typeof meta.student_number === "string" ? meta.student_number : undefined,
    data.studentId?.replace(/\s/g, "")
  );

  if (!fullName || !/^\d{11}$/.test(studentId)) {
    throw new Error("Profile data is incomplete. Please update your name and student number.");
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count: recentCount, error: countError } = await supabase
    .from("applications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", oneHourAgo);
  if (countError) {
    throw new Error("Could not validate request rate. Please try again.");
  }
  if ((recentCount ?? 0) >= APPLICATION_MAX_PER_HOUR) {
    throw new Error("Too many requests. Please wait before submitting again.");
  }

  const { error } = await supabase.from("applications").insert({
    user_id: user.id,
    service_type: data.serviceType,
    description: `Name: ${fullName}\nStudent ID: ${studentId}\n\n${issue}`,
    status: "pending",
  });
  if (error) throw new Error(error.message);
}

export async function sendMessage(data: {
  name: string;
  phone: string;
  message: string;
  website?: string;
}) {
  const name = data.name.trim();
  const phone = normalizePhone(data.phone);
  const message = data.message.trim();
  const website = data.website?.trim() ?? "";

  if (website) {
    throw new Error("Failed to send message.");
  }

  if (!name || !message || !PHONE_REGEX.test(phone)) {
    throw new Error("Please provide a valid name, phone number, and message.");
  }

  const admin = createAdminClient();
  let recent: { created_at: string }[] | null = null;
  let hourlyCount = 0;
  let useLegacySchema = false;
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { data: recentByPhone, error: recentByPhoneError } = await admin
    .from("contact_messages")
    .select("created_at")
    .eq("phone_number", phone)
    .order("created_at", { ascending: false })
    .limit(1);

  if (recentByPhoneError) {
    if (!isLegacyContactSchemaError(recentByPhoneError.message ?? "")) {
      throw new Error("Failed to send message.");
    }

    useLegacySchema = true;

    const { data: recentByEmail, error: recentByEmailError } = await admin
      .from("contact_messages")
      .select("created_at")
      .eq("email", phone)
      .order("created_at", { ascending: false })
      .limit(1);

    if (recentByEmailError) throw new Error("Failed to send message.");
    recent = recentByEmail;

    const { count: hourlyByEmail, error: hourlyByEmailError } = await admin
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("email", phone)
      .gte("created_at", oneHourAgo);
    if (hourlyByEmailError) throw new Error("Failed to send message.");
    hourlyCount = hourlyByEmail ?? 0;
  } else {
    recent = recentByPhone;

    const { count: hourlyByPhone, error: hourlyByPhoneError } = await admin
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("phone_number", phone)
      .gte("created_at", oneHourAgo);
    if (hourlyByPhoneError) throw new Error("Failed to send message.");
    hourlyCount = hourlyByPhone ?? 0;
  }

  if (recent && recent.length > 0) {
    const last = new Date(recent[0].created_at).getTime();
    if (Number.isFinite(last) && Date.now() - last < CONTACT_MIN_INTERVAL_MS) {
      throw new Error("Please wait one minute before sending another message.");
    }
  }
  if (hourlyCount >= CONTACT_MAX_PER_HOUR) {
    throw new Error("Too many messages. Please try again in one hour.");
  }

  const { error: insertError } = await admin.from("contact_messages").insert({
    name,
    phone_number: phone,
    message,
  });

  if (!insertError) return;

  const shouldFallbackToLegacyInsert =
    useLegacySchema || isLegacyContactSchemaError(insertError.message ?? "");

  if (shouldFallbackToLegacyInsert) {
    const { error: legacyInsertError } = await admin.from("contact_messages").insert({
      name,
      email: phone,
      message,
    });
    if (!legacyInsertError) return;
  }

  throw new Error("Failed to send message.");
}
