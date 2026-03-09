import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Nav } from "@/components/layout/Nav";
import { isAllowedEmail } from "@/lib/security";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

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
  if (!isAllowedEmail(user.email)) redirect("/login?error=domain");

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-transparent pt-20">
        <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
          <DashboardHeader />
          {children}
        </div>
      </div>
    </>
  );
}

