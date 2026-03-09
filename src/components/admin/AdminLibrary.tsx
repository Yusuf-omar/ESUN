"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TapButton } from "@/components/ui/TapButton";
import type { ContentLocale } from "@/lib/types";
import {
  createLibraryItem,
  deleteLibraryItem,
  toggleLibraryItemVisibility,
  updateLibraryItem,
} from "@/app/admin/actions";

const CONTENT_LOCALE_OPTIONS: Array<{ value: ContentLocale; label: string }> = [
  { value: "ar", label: "Arabic" },
  { value: "en", label: "English" },
  { value: "tr", label: "Turkish" },
];

interface LibraryRow {
  id: string;
  title: string;
  content_locale?: ContentLocale | null;
  category: string | null;
  description: string | null;
  file_url: string | null;
  post_url: string | null;
  preview_image_url: string | null;
  is_public: boolean;
  created_at: string;
}

interface EditFormState {
  title: string;
  contentLocale: ContentLocale;
  category: string;
  description: string;
  postUrl: string;
  previewImageUrl: string;
  isPublic: boolean;
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function resolvePostUrl(item: LibraryRow) {
  return item.post_url || item.file_url || "";
}

function resolvePreviewImage(item: LibraryRow) {
  return item.preview_image_url || item.file_url || "";
}

function toEditState(item: LibraryRow): EditFormState {
  return {
    title: item.title,
    contentLocale: item.content_locale ?? "ar",
    category: item.category || "",
    description: item.description || "",
    postUrl: resolvePostUrl(item),
    previewImageUrl: resolvePreviewImage(item),
    isPublic: item.is_public,
  };
}

export function AdminLibrary({ list }: { list: LibraryRow[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [contentLocale, setContentLocale] = useState<ContentLocale>("ar");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [postUrl, setPostUrl] = useState("");
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    title: "",
    contentLocale: "ar",
    category: "",
    description: "",
    postUrl: "",
    previewImageUrl: "",
    isPublic: true,
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createLibraryItem({
        title,
        contentLocale,
        category,
        description,
        postUrl,
        previewImageUrl,
        isPublic,
      });
      setTitle("");
      setContentLocale("ar");
      setCategory("");
      setDescription("");
      setPostUrl("");
      setPreviewImageUrl("");
      setIsPublic(true);
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create item.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    setError("");
    try {
      await toggleLibraryItemVisibility(id, current);
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update item.";
      setError(msg);
    }
  };

  const handleDelete = async (id: string) => {
    setError("");
    try {
      await deleteLibraryItem(id);
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete item.";
      setError(msg);
    }
  };

  const handleStartEdit = (item: LibraryRow) => {
    setEditingId(item.id);
    setEditForm(toEditState(item));
    setError("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setSavingEdit(false);
  };

  const handleSaveEdit = async (id: string) => {
    setError("");
    setSavingEdit(true);
    try {
      await updateLibraryItem(id, {
        title: editForm.title,
        contentLocale: editForm.contentLocale,
        category: editForm.category,
        description: editForm.description,
        postUrl: editForm.postUrl,
        previewImageUrl: editForm.previewImageUrl,
        isPublic: editForm.isPublic,
      });
      setEditingId(null);
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save changes.";
      setError(msg);
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="mt-6 space-y-8">
      <form
        onSubmit={handleCreate}
        className="glass rounded-xl border border-[#8c7656]/40 p-4 transition-all duration-300 hover:border-[#c9ad84]/60 md:p-6"
      >
        <h2 className="text-lg font-bold text-white">Add Instagram/Post Card</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-sm text-white/75">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#8c7656]/50 bg-[#010101] px-4 py-2 text-white focus:border-[#a81123] focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="text-sm text-white/75">Content Language</label>
            <select
              value={contentLocale}
              onChange={(e) => setContentLocale(e.target.value as ContentLocale)}
              className="mt-1 w-full rounded-lg border border-[#8c7656]/50 bg-[#010101] px-4 py-2 text-white focus:border-[#a81123] focus:outline-none"
            >
              {CONTENT_LOCALE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-white/55">
              Add separate cards per language to keep content translated correctly.
            </p>
          </div>
          <div>
            <label className="text-sm text-white/75">Category</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#8c7656]/50 bg-[#010101] px-4 py-2 text-white focus:border-[#a81123] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-white/75">Post URL (Instagram/File)</label>
            <input
              value={postUrl}
              onChange={(e) => setPostUrl(e.target.value)}
              placeholder="https://instagram.com/p/..."
              dir="ltr"
              className="mt-1 w-full rounded-lg border border-[#8c7656]/50 bg-[#010101] px-4 py-2 text-white focus:border-[#a81123] focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-white/75">Preview Image URL</label>
            <input
              value={previewImageUrl}
              onChange={(e) => setPreviewImageUrl(e.target.value)}
              placeholder="https://...jpg"
              dir="ltr"
              className="mt-1 w-full rounded-lg border border-[#8c7656]/50 bg-[#010101] px-4 py-2 text-white focus:border-[#a81123] focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <p className="text-xs text-white/55">
              The card image uses Preview Image URL. The button opens Post URL.
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-white/75">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-[#8c7656]/50 bg-[#010101] px-4 py-2 text-white focus:border-[#a81123] focus:outline-none"
            />
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-white/80">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Public
          </label>
        </div>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <div className="mt-4">
          <TapButton type="submit" disabled={loading}>
            {loading ? "Saving..." : "Add Item"}
          </TapButton>
        </div>
      </form>

      <div className="space-y-4">
        {list.length === 0 ? (
          <p className="text-white/60">No library resources yet.</p>
        ) : (
          list.map((item) => {
            const isEditing = editingId === item.id;
            const postLink = resolvePostUrl(item);
            const previewImage = resolvePreviewImage(item);

            return (
              <article
                key={item.id}
                className="rounded-xl border border-[#8c7656]/40 bg-[#0d0d0d]/85 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c9ad84]/60"
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-white/75">Title</label>
                      <input
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, title: e.target.value }))
                        }
                        className="mt-1 w-full rounded-lg border border-[#8c7656]/50 bg-[#010101] px-4 py-2 text-white focus:border-[#a81123] focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/75">Content Language</label>
                      <select
                        value={editForm.contentLocale}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            contentLocale: e.target.value as ContentLocale,
                          }))
                        }
                        className="mt-1 w-full rounded-lg border border-[#8c7656]/50 bg-[#010101] px-4 py-2 text-white focus:border-[#a81123] focus:outline-none"
                      >
                        {CONTENT_LOCALE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-white/75">Category</label>
                      <input
                        value={editForm.category}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, category: e.target.value }))
                        }
                        className="mt-1 w-full rounded-lg border border-[#8c7656]/50 bg-[#010101] px-4 py-2 text-white focus:border-[#a81123] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/75">Post URL</label>
                      <input
                        value={editForm.postUrl}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, postUrl: e.target.value }))
                        }
                        dir="ltr"
                        className="mt-1 w-full rounded-lg border border-[#8c7656]/50 bg-[#010101] px-4 py-2 text-white focus:border-[#a81123] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/75">Preview Image URL</label>
                      <input
                        value={editForm.previewImageUrl}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            previewImageUrl: e.target.value,
                          }))
                        }
                        dir="ltr"
                        className="mt-1 w-full rounded-lg border border-[#8c7656]/50 bg-[#010101] px-4 py-2 text-white focus:border-[#a81123] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/75">Description</label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        rows={3}
                        className="mt-1 w-full rounded-lg border border-[#8c7656]/50 bg-[#010101] px-4 py-2 text-white focus:border-[#a81123] focus:outline-none"
                      />
                    </div>
                    <label className="inline-flex items-center gap-2 text-sm text-white/80">
                      <input
                        type="checkbox"
                        checked={editForm.isPublic}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, isPublic: e.target.checked }))
                        }
                      />
                      Public
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <TapButton
                        type="button"
                        onClick={() => handleSaveEdit(item.id)}
                        disabled={savingEdit}
                      >
                        {savingEdit ? "Saving..." : "Save"}
                      </TapButton>
                      <TapButton
                        type="button"
                        variant="outline"
                        className="py-1.5 px-3 text-sm"
                        onClick={handleCancelEdit}
                        disabled={savingEdit}
                      >
                        Cancel
                      </TapButton>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-medium text-white">{item.title}</h3>
                      <p className="text-xs text-white/50">{formatDate(item.created_at)}</p>
                    </div>
                    <p className="mt-1 text-xs text-white/60">
                      Locale: {item.content_locale ?? "ar"}
                    </p>
                    <p className="mt-1 text-sm text-white/70">{item.category || "General"}</p>
                    {previewImage && (
                      <img
                        src={previewImage}
                        alt={item.title}
                        className="mt-3 h-36 w-full rounded-lg object-cover transition-transform duration-500 hover:scale-[1.03]"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                    <p className="mt-2 text-sm text-white/80">
                      {item.description || "No description."}
                    </p>
                    {postLink && (
                      <a
                        href={postLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm text-[#a81123] hover:underline"
                      >
                        Open post
                      </a>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <TapButton
                        type="button"
                        variant="outline"
                        className="py-1.5 px-3 text-sm"
                        onClick={() => handleStartEdit(item)}
                      >
                        Edit
                      </TapButton>
                      <TapButton
                        type="button"
                        variant="outline"
                        className="py-1.5 px-3 text-sm"
                        onClick={() => handleToggle(item.id, item.is_public)}
                      >
                        {item.is_public ? "Make Private" : "Make Public"}
                      </TapButton>
                      <TapButton
                        type="button"
                        variant="ghost"
                        className="py-1.5 px-3 text-sm text-red-400"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </TapButton>
                    </div>
                  </>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
