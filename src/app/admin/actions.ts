"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export async function updateApplicationStatus(
  id: string,
  status: string
) {
  await ensureAdmin();
  const admin = createAdminClient();
  const { error } = await admin
    .from("applications")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/admin/applications");
}

export async function createLibraryItem(data: {
  title: string;
  category?: string;
  description?: string;
  postUrl?: string;
  previewImageUrl?: string;
  isPublic?: boolean;
}) {
  await ensureAdmin();
  const admin = createAdminClient();

  const title = data.title.trim();
  if (!title) throw new Error("Title is required.");

  const { error } = await admin.from("library_items").insert({
    title,
    category: data.category?.trim() || null,
    description: data.description?.trim() || null,
    post_url: data.postUrl?.trim() || null,
    preview_image_url: data.previewImageUrl?.trim() || null,
    file_url: data.postUrl?.trim() || null,
    is_public: data.isPublic ?? true,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/library");
}

export async function toggleLibraryItemVisibility(id: string, isPublic: boolean) {
  await ensureAdmin();
  const admin = createAdminClient();

  const { error } = await admin
    .from("library_items")
    .update({ is_public: !isPublic })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/library");
}

export async function updateLibraryItem(
  id: string,
  data: {
    title: string;
    category?: string;
    description?: string;
    postUrl?: string;
    previewImageUrl?: string;
    isPublic?: boolean;
  }
) {
  await ensureAdmin();
  const admin = createAdminClient();

  const title = data.title.trim();
  if (!title) throw new Error("Title is required.");

  const { error } = await admin
    .from("library_items")
    .update({
      title,
      category: data.category?.trim() || null,
      description: data.description?.trim() || null,
      post_url: data.postUrl?.trim() || null,
      preview_image_url: data.previewImageUrl?.trim() || null,
      file_url: data.postUrl?.trim() || null,
      is_public: data.isPublic ?? true,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/library");
}

export async function deleteLibraryItem(id: string) {
  await ensureAdmin();
  const admin = createAdminClient();

  const { error } = await admin.from("library_items").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/library");
}

export async function deleteContactMessage(id: string) {
  await ensureAdmin();
  const admin = createAdminClient();

  const { error } = await admin.from("contact_messages").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function createEvent(data: {
  title: string;
  date: string;
  registrationLink?: string;
}) {
  await ensureAdmin();
  const admin = createAdminClient();

  const title = data.title.trim();
  const date = data.date.trim();
  if (!title) throw new Error("Title is required.");
  if (!date) throw new Error("Date is required.");

  const { error } = await admin.from("events").insert({
    title,
    date,
    registration_link: data.registrationLink?.trim() || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/events");
}

export async function deleteEvent(id: string) {
  await ensureAdmin();
  const admin = createAdminClient();

  const { error } = await admin.from("events").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/events");
}

export async function deleteMember(id: string) {
  await ensureAdmin();
  const admin = createAdminClient();

  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/members");
}

async function ensureAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? "")) {
    throw new Error("Unauthorized");
  }

  return user;
}
