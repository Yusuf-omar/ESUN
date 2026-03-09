import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { AdminEvents } from "@/components/admin/AdminEvents";
import type { EventRow } from "@/lib/types";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function isMissingColumnError(message: string, column: string) {
  const lower = message.toLowerCase();
  return lower.includes(column) && lower.includes("does not exist");
}

async function fetchAdminEvents(admin: ReturnType<typeof createAdminClient>) {
  const attempts = [
    () => admin.from("events").select("id, title, content_locale, date, registration_link").order("date", { ascending: true }),
    () => admin.from("events").select("id, title, date, registration_link").order("date", { ascending: true }),
    () =>
      admin
        .from("events")
        .select("id, title, content_locale, date:event_date, registration_link")
        .order("event_date", { ascending: true }),
    () => admin.from("events").select("id, title, date:event_date, registration_link").order("event_date", { ascending: true }),
  ];

  for (const query of attempts) {
    const { data, error } = await query();
    if (!error) return (data as EventRow[] | null) ?? [];

    const message = error.message ?? "";
    const isSchemaMismatch =
      isMissingColumnError(message, "content_locale") ||
      isMissingColumnError(message, "date") ||
      isMissingColumnError(message, "event_date");
    if (!isSchemaMismatch) {
      console.error("Failed to fetch admin events:", error.message);
      return [];
    }
  }

  return [];
}

export default async function AdminEventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? "")) {
    redirect("/dashboard");
  }
  const admin = createAdminClient();
  const events = await fetchAdminEvents(admin);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Events</h1>
      <p className="mt-1 text-white/70">Create and manage upcoming events for the home page.</p>
      <AdminEvents list={events} />
    </div>
  );
}
