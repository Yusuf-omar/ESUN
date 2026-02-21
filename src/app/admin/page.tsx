import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <article className="rounded-xl border border-[#8c7656]/40 bg-[#0d0d0d]/85 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c9ad84]/60">
      <p className="text-sm text-white/65">{title}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
    </article>
  );
}

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? "")) {
    redirect("/dashboard");
  }

  const admin = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);

  const [
    { count: appsCount },
    { count: messagesCount },
    { count: membersCount },
    { count: upcomingCount },
  ] = await Promise.all([
    admin.from("applications").select("*", { count: "exact", head: true }),
    admin.from("contact_messages").select("*", { count: "exact", head: true }),
    admin.from("profiles").select("*", { count: "exact", head: true }),
    admin
      .from("events")
      .select("*", { count: "exact", head: true })
      .gte("date", today),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-1 text-white/70">
          Quick overview of platform activity.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Applications" value={appsCount ?? 0} />
        <StatCard title="Messages" value={messagesCount ?? 0} />
        <StatCard title="Members" value={membersCount ?? 0} />
        <StatCard title="Upcoming Events" value={upcomingCount ?? 0} />
      </section>
    </div>
  );
}
