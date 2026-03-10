"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function isMissingDateColumnError(message: string) {
  const lower = message.toLowerCase();
  return (
    lower.includes("date") &&
    (lower.includes("does not exist") ||
      lower.includes("schema cache") ||
      lower.includes("could not find"))
  );
}

function isMissingLegacyEventDateColumnError(message: string) {
  const lower = message.toLowerCase();
  return (
    lower.includes("event_date") &&
    (lower.includes("does not exist") ||
      lower.includes("schema cache") ||
      lower.includes("could not find"))
  );
}

function isMissingLibraryColumnError(message: string, column: string) {
  const lower = message.toLowerCase();
  return (
    lower.includes(column) &&
    (lower.includes("does not exist") ||
      lower.includes("schema cache") ||
      lower.includes("could not find"))
  );
}

function isMissingArchivedAtColumnError(message: string) {
  const lower = message.toLowerCase();
  return (
    lower.includes("archived_at") &&
    (lower.includes("does not exist") ||
      lower.includes("schema cache") ||
      lower.includes("could not find"))
  );
}

export async function updateApplicationStatus(
  id: string,
  status: string
) {
  await ensureAdmin();
  const admin = createAdminClient();
  const { error } = await admin
    .from("applications")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/admin/applications");
}

export async function archiveApplication(id: string) {
  await ensureAdmin();
  const admin = createAdminClient();
  const { error } = await admin
    .from("applications")
    .update({ archived_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    if (isMissingArchivedAtColumnError(error.message ?? "")) {
      throw new Error(
        "Archive column is missing. Run the latest supabase/schema.sql migration."
      );
    }
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/applications");
}

export async function deleteApplication(id: string) {
  await ensureAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("applications").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/applications");
}

export async function createLibraryItem(data: {
  title: string;
  category?: string;
  description?: string;
  postUrl?: string;
  previewImageUrl?: string;
  isPublic?: boolean;
}) {
  await ensureAdmin();
  const admin = createAdminClient();

  const title = data.title.trim();
  if (!title) throw new Error("Title is required.");

  const payload = {
    title,
    category: data.category?.trim() || null,
    description: data.description?.trim() || null,
    post_url: data.postUrl?.trim() || null,
    preview_image_url: data.previewImageUrl?.trim() || null,
    file_url: data.postUrl?.trim() || null,
    is_public: data.isPublic ?? true,
  };

  const { error } = await admin.from("library_items").insert(payload);

  if (
    error &&
    (isMissingLibraryColumnError(error.message ?? "", "post_url") ||
      isMissingLibraryColumnError(error.message ?? "", "preview_image_url"))
  ) {
    const { error: legacyError } = await admin.from("library_items").insert({
      title,
      category: payload.category,
      description: payload.description,
      file_url: payload.file_url,
      is_public: payload.is_public,
    });
    if (!legacyError) {
      revalidatePath("/");
      revalidatePath("/admin/library");
      return;
    }
  }

  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/library");
}

export async function toggleLibraryItemVisibility(id: string, isPublic: boolean) {
  await ensureAdmin();
  const admin = createAdminClient();

  const { error } = await admin
    .from("library_items")
    .update({ is_public: !isPublic })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/library");
}

export async function updateLibraryItem(
  id: string,
  data: {
    title: string;
    category?: string;
    description?: string;
    postUrl?: string;
    previewImageUrl?: string;
    isPublic?: boolean;
  }
) {
  await ensureAdmin();
  const admin = createAdminClient();

  const title = data.title.trim();
  if (!title) throw new Error("Title is required.");

  const updatePayload = {
    title,
    category: data.category?.trim() || null,
    description: data.description?.trim() || null,
    post_url: data.postUrl?.trim() || null,
    preview_image_url: data.previewImageUrl?.trim() || null,
    file_url: data.postUrl?.trim() || null,
    is_public: data.isPublic ?? true,
  };

  const { error } = await admin
    .from("library_items")
    .update(updatePayload)
    .eq("id", id);

  if (
    error &&
    (isMissingLibraryColumnError(error.message ?? "", "post_url") ||
      isMissingLibraryColumnError(error.message ?? "", "preview_image_url"))
  ) {
    const { error: legacyError } = await admin
      .from("library_items")
      .update({
        title,
        category: updatePayload.category,
        description: updatePayload.description,
        file_url: updatePayload.file_url,
        is_public: updatePayload.is_public,
      })
      .eq("id", id);
    if (!legacyError) {
      revalidatePath("/");
      revalidatePath("/admin/library");
      return;
    }
  }

  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/library");
}

export async function deleteLibraryItem(id: string) {
  await ensureAdmin();
  const admin = createAdminClient();

  const { error } = await admin.from("library_items").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/library");
}

export async function deleteContactMessage(id: string) {
  await ensureAdmin();
  const admin = createAdminClient();

  const { error } = await admin.from("contact_messages").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function createEvent(data: {
  title: string;
  date: string;
  registrationLink?: string;
}) {
  await ensureAdmin();
  const admin = createAdminClient();

  const title = data.title.trim();
  const date = data.date.trim();
  if (!title) throw new Error("Title is required.");
  if (!date) throw new Error("Date is required.");

  const payload = {
    title,
    date,
    registration_link: data.registrationLink?.trim() || null,
  };

  const insertVariants: Array<Record<string, string | null | undefined>> = [
    payload,
    { ...payload, event_date: date, date: undefined },
    { title, date, registration_link: payload.registration_link },
    { title, event_date: date, registration_link: payload.registration_link },
  ];

  let insertError: { message?: string } | null = null;
  for (const candidate of insertVariants) {
    const cleaned = Object.fromEntries(
      Object.entries(candidate).filter(([, value]) => value !== undefined)
    );
    const { error } = await admin.from("events").insert(cleaned);
    if (!error) {
      revalidatePath("/");
      revalidatePath("/admin");
      revalidatePath("/admin/events");
      return;
    }

    insertError = error;
    const message = error.message ?? "";
    const isSchemaMismatch =
      isMissingDateColumnError(message) ||
      isMissingLegacyEventDateColumnError(message);
    if (!isSchemaMismatch) {
      throw new Error(message);
    }
  }

  if (insertError) throw new Error(insertError.message);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/events");
}

export async function deleteEvent(id: string) {
  await ensureAdmin();
  const admin = createAdminClient();

  const { error } = await admin.from("events").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/events");
}

export async function deleteMember(id: string) {
  await ensureAdmin();
  const admin = createAdminClient();

  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/members");
}

async function ensureAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? "")) {
    throw new Error("Unauthorized");
  }

  return user;
}
