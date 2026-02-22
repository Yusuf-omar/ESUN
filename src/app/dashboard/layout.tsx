import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-transparent pt-20">
        <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
          <div className="mb-6 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-white">ملفي الشخصي</h1>
            <Link href="/" className="text-sm text-white/70 transition hover:text-white">
              ← الرئيسية
            </Link>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
