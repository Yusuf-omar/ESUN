import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { AdminMessages } from "@/components/admin/AdminMessages";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? "")) {
    redirect("/dashboard");
  }

  const admin = createAdminClient();
  let warning = "";

  const { data: messagesByPhone, error: byPhoneError } = await admin
    .from("contact_messages")
    .select("id, name, phone_number, email, message, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  let messages = messagesByPhone ?? [];

  if (byPhoneError) {
    const lower = byPhoneError.message.toLowerCase();
    if (lower.includes("phone_number") && lower.includes("does not exist")) {
      const { data: legacyMessages, error: legacyError } = await admin
        .from("contact_messages")
        .select("id, name, email, message, created_at")
        .order("created_at", { ascending: false })
        .limit(200);

      if (legacyError) {
        warning = legacyError.message;
        messages = [];
      } else {
        messages =
          legacyMessages?.map((m) => ({ ...m, phone_number: null })) ?? [];
        warning = "Legacy contact schema detected. Run latest schema.sql for phone support.";
      }
    } else {
      warning = byPhoneError.message;
      messages = [];
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Messages</h1>
      <p className="mt-1 text-white/70">Review messages submitted from the contact form.</p>
      {warning && <p className="mt-3 text-sm text-amber-400">{warning}</p>}
      <AdminMessages list={messages ?? []} />
    </div>
  );
}
