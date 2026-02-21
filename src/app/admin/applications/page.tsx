import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { AdminApplications } from "@/components/admin/AdminApplications";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export default async function AdminApplicationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? "")) {
    redirect("/dashboard");
  }

  const admin = createAdminClient();
  const { data: applications } = await admin
    .from("applications")
    .select("id, user_id, service_type, description, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Applications</h1>
      <p className="mt-1 text-white/70">Manage service requests.</p>
      <AdminApplications list={applications ?? []} />
    </div>
  );
}
