"use client";

import { deleteContactMessage } from "@/app/admin/actions";
import { useI18n } from "@/components/providers/I18nProvider";

interface MessageRow {
  id: string;
  name: string;
  phone_number: string | null;
  email: string | null;
  message: string;
  created_at: string;
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AdminMessages({ list }: { list: MessageRow[] }) {
  const { copy } = useI18n();
  const label = copy.contact.phone;

  return (
    <div className="mt-6 space-y-4">
      {list.length === 0 ? (
        <p className="text-white/60">No messages yet.</p>
      ) : (
        list.map((msg) => (
          <article
            key={msg.id}
            className="rounded-xl border border-[#8c7656]/40 bg-[#0d0d0d]/85 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c9ad84]/60"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-white">{msg.name}</p>
              <p className="text-xs text-white/50">{formatDate(msg.created_at)}</p>
            </div>
            <p className="mt-2 text-sm text-white/80">
              <span className="text-white/60">{label}: </span>
              <span dir="ltr">{msg.phone_number ?? msg.email ?? "-"}</span>
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm text-white/80">{msg.message}</p>
            <div className="mt-3">
              <form action={deleteContactMessage.bind(null, msg.id)}>
                <button
                  type="submit"
                  className="rounded-md border border-red-500/40 px-3 py-1.5 text-sm text-red-400 transition hover:bg-red-500/10"
                >
                  Delete
                </button>
              </form>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
