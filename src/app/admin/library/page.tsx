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
  const { data: itemsWithLocale, error: withLocaleError } = await admin
    .from("library_items")
    .select("id, title, content_locale, category, description, file_url, post_url, preview_image_url, is_public, created_at")
    .order("created_at", { ascending: false });

  const { data: legacyItems, error: legacyError } =
    withLocaleError &&
    withLocaleError.message.toLowerCase().includes("content_locale")
      ? await admin
          .from("library_items")
          .select("id, title, category, description, file_url, post_url, preview_image_url, is_public, created_at")
          .order("created_at", { ascending: false })
      : { data: null as { id: string }[] | null, error: withLocaleError };

  const items = itemsWithLocale ?? legacyItems ?? [];
  const error = withLocaleError && !withLocaleError.message.toLowerCase().includes("content_locale")
    ? withLocaleError
    : legacyError;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Library</h1>
      <p className="mt-1 text-white/70">Manage public library resources shown on the home page.</p>
      {error && (
        <p className="mt-3 text-sm text-amber-400">
          {error.message}
        </p>
      )}
      <AdminLibrary list={items as Parameters<typeof AdminLibrary>[0]["list"]} />
    </div>
  );
}
