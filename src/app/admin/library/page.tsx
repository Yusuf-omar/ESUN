import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { AdminLibrary } from "@/components/admin/AdminLibrary";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function isMissingColumnError(message: string, column: string) {
  const lower = message.toLowerCase();
  return (
    lower.includes(column) &&
    (lower.includes("does not exist") ||
      lower.includes("schema cache") ||
      lower.includes("could not find"))
  );
}

export default async function AdminLibraryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? "")) {
    redirect("/dashboard");
  }

  const admin = createAdminClient();
  const { data: items, error: itemsError } = await admin
    .from("library_items")
    .select("id, title, category, description, file_url, post_url, preview_image_url, is_public, created_at")
    .order("created_at", { ascending: false });

  const { data: legacyItems, error: legacyError } =
    itemsError &&
    (isMissingColumnError(itemsError.message ?? "", "post_url") ||
      isMissingColumnError(itemsError.message ?? "", "preview_image_url"))
      ? await admin
          .from("library_items")
          .select("id, title, category, description, file_url, is_public, created_at")
          .order("created_at", { ascending: false })
      : { data: null as { id: string }[] | null, error: itemsError };

  const normalizedItems =
    ((items as Parameters<typeof AdminLibrary>[0]["list"] | null) ??
      (legacyItems as Parameters<typeof AdminLibrary>[0]["list"] | null) ??
      []
    ).map((item) => ({
      ...item,
      post_url: item.post_url ?? null,
      preview_image_url: item.preview_image_url ?? null,
    }));

  const error = itemsError && !(isMissingColumnError(itemsError.message ?? "", "post_url") ||
    isMissingColumnError(itemsError.message ?? "", "preview_image_url"))
    ? itemsError
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
      <AdminLibrary list={normalizedItems} />
    </div>
  );
}
