import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { AdminEvents } from "@/components/admin/AdminEvents";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export default async function AdminEventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? "")) {
    redirect("/dashboard");
  }
  const admin = createAdminClient();
  const { data: events } = await admin
    .from("events")
    .select("id, title, date, registration_link")
    .order("date", { ascending: true });
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Events</h1>
      <p className="mt-1 text-white/70">Create and manage upcoming events for the home page.</p>
      <AdminEvents list={events ?? []} />
    </div>
  );
}
