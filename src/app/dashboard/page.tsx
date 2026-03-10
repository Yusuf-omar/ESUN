import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileSection } from "@/components/dashboard/ProfileSection";
import { UnionCard } from "@/components/dashboard/UnionCard";
import { StatusTracker } from "@/components/dashboard/StatusTracker";

function isMissingArchivedAtColumnError(message: string) {
  const lower = message.toLowerCase();
  return (
    lower.includes("archived_at") &&
    (lower.includes("does not exist") ||
      lower.includes("schema cache") ||
      lower.includes("could not find"))
  );
}

type ProfileRow = {
  id: string;
  full_name: string | null;
  student_number: string | null;
  phone_number: string | null;
  email: string | null;
  updated_at: string | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, student_number, phone_number, email, updated_at")
    .eq("id", user.id)
    .maybeSingle();

  const meta = (user.user_metadata ?? {}) as {
    full_name?: unknown;
    student_number?: unknown;
    phone_number?: unknown;
  };

  const metaFullName =
    typeof meta.full_name === "string" && meta.full_name.trim()
      ? meta.full_name.trim()
      : null;
  const metaStudentNumber =
    typeof meta.student_number === "string" && meta.student_number.trim()
      ? meta.student_number.trim()
      : null;
  const metaPhoneNumber =
    typeof meta.phone_number === "string" && meta.phone_number.trim()
      ? meta.phone_number.trim()
      : null;

  const mergedProfile: ProfileRow = {
    id: user.id,
    full_name: profile?.full_name ?? metaFullName,
    student_number: profile?.student_number ?? metaStudentNumber,
    phone_number: profile?.phone_number ?? metaPhoneNumber,
    email: profile?.email ?? user.email ?? null,
    updated_at: profile?.updated_at ?? null,
  };

  const shouldUpsertProfile =
    !profile ||
    profile.email !== mergedProfile.email ||
    (!!mergedProfile.full_name && profile.full_name !== mergedProfile.full_name) ||
    (!!mergedProfile.student_number &&
      profile.student_number !== mergedProfile.student_number) ||
    (!!mergedProfile.phone_number &&
      profile.phone_number !== mergedProfile.phone_number);

  if (shouldUpsertProfile) {
    await supabase.from("profiles").upsert(
      {
        id: mergedProfile.id,
        full_name: mergedProfile.full_name,
        student_number: mergedProfile.student_number,
        phone_number: mergedProfile.phone_number,
        email: mergedProfile.email,
      },
      { onConflict: "id" }
    );
  }

  const { data: applicationsWithArchive, error: withArchiveError } = await supabase
    .from("applications")
    .select("id, service_type, description, status, archived_at, created_at")
    .eq("user_id", user.id)
    .is("archived_at", null)
    .order("created_at", { ascending: false });

  const { data: applicationsLegacy } =
    withArchiveError && isMissingArchivedAtColumnError(withArchiveError.message ?? "")
      ? await supabase
          .from("applications")
          .select("id, service_type, description, status, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
      : { data: null as { id: string }[] | null };

  const applications = applicationsWithArchive ?? applicationsLegacy ?? [];

  return (
    <div className="space-y-12">
      <ProfileSection profile={mergedProfile} />
      <UnionCard profile={mergedProfile} />
      <StatusTracker applications={applications} />
    </div>
  );
}
