import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export default async function AdminLayout({
  children,
}: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (!ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? "")) {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen bg-transparent">
      <header className="glass border-b border-[#8c7656]/30 sticky top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <span className="text-lg font-bold text-white">ESUN Admin</span>
          <nav className="flex items-center gap-4">
            <Link href="/admin" className="text-sm text-white/80 transition hover:text-[#e7d4b0]">
              Dashboard
            </Link>
            <Link href="/admin/applications" className="text-sm text-white/80 transition hover:text-[#e7d4b0]">
              Applications
            </Link>
            <Link href="/admin/messages" className="text-sm text-white/80 transition hover:text-[#e7d4b0]">
              Messages
            </Link>
            <Link href="/admin/library" className="text-sm text-white/80 transition hover:text-[#e7d4b0]">
              Library
            </Link>
            <Link href="/admin/members" className="text-sm text-white/80 transition hover:text-[#e7d4b0]">
              Members
            </Link>
            <Link href="/admin/events" className="text-sm text-white/80 transition hover:text-[#e7d4b0]">
              Events
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">{children}</main>
    </div>
  );
}
