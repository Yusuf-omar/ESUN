import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { AdminApplications } from "@/components/admin/AdminApplications";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function isMissingArchivedAtColumnError(message: string) {
  const lower = message.toLowerCase();
  return (
    lower.includes("archived_at") &&
    (lower.includes("does not exist") ||
      lower.includes("schema cache") ||
      lower.includes("could not find"))
  );
}

export default async function AdminApplicationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? "")) {
    redirect("/dashboard");
  }

  const admin = createAdminClient();
  const { data: applicationsWithArchive, error: withArchiveError } = await admin
    .from("applications")
    .select("id, user_id, service_type, description, status, archived_at, created_at")
    .order("created_at", { ascending: false });

  const { data: legacyApplications } =
    withArchiveError && isMissingArchivedAtColumnError(withArchiveError.message ?? "")
      ? await admin
          .from("applications")
          .select("id, user_id, service_type, description, status, created_at")
          .order("created_at", { ascending: false })
      : { data: null as { id: string }[] | null };

  const applications =
    ((applicationsWithArchive as Parameters<typeof AdminApplications>[0]["list"] | null) ??
      (legacyApplications as Parameters<typeof AdminApplications>[0]["list"] | null) ??
      []
    ).map((app) => ({
      ...app,
      archived_at: app.archived_at ?? null,
    }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Applications</h1>
      <p className="mt-1 text-white/70">Manage service requests.</p>
      <AdminApplications list={applications} />
    </div>
  );
}
