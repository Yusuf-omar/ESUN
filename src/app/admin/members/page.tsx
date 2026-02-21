import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { AdminMembers } from "@/components/admin/AdminMembers";
import Link from "next/link";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export default async function AdminMembersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? "")) {
    redirect("/dashboard");
  }

  const admin = createAdminClient();
  const { data: members, error } = await admin
    .from("profiles")
    .select("id, full_name, student_number, phone_number, email, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Members</h1>
          <p className="mt-1 text-white/70">Review registered member profiles.</p>
        </div>
        <Link
          href="/admin/members/export"
          className="rounded-lg border border-[#8c7656]/60 px-4 py-2 text-sm text-white hover:border-[#a81123] hover:text-[#a81123]"
        >
          Export Excel (CSV)
        </Link>
      </div>
      {error && <p className="mt-3 text-sm text-amber-400">{error.message}</p>}
      <AdminMembers list={members ?? []} />
    </div>
  );
}
