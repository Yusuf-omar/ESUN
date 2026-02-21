import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { AdminLibrary } from "@/components/admin/AdminLibrary";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export default async function AdminLibraryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? "")) {
    redirect("/dashboard");
  }

  const admin = createAdminClient();
  const { data: items, error } = await admin
    .from("library_items")
    .select("id, title, category, description, file_url, post_url, preview_image_url, is_public, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Library</h1>
      <p className="mt-1 text-white/70">Manage public library resources shown on the home page.</p>
      {error && (
        <p className="mt-3 text-sm text-amber-400">
          {error.message}
        </p>
      )}
      <AdminLibrary list={items ?? []} />
    </div>
  );
}
