"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TapButton } from "@/components/ui/TapButton";
import { createEvent, deleteEvent } from "@/app/admin/actions";

interface EventRow {
  id: string;
  title: string;
  date: string;
  registration_link: string | null;
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AdminEvents({ list }: { list: EventRow[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const upcoming = list.filter((ev) => ev.date >= today);
  const past = list.filter((ev) => ev.date < today);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createEvent({ title, date, registrationLink });
      setTitle("");
      setDate("");
      setRegistrationLink("");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create event.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError("");
    try {
      await deleteEvent(id);
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete event.";
      setError(msg);
    }
  };

  return (
    <div className="mt-6 space-y-8">
      <form
        onSubmit={handleCreate}
        className="glass rounded-xl border border-[#8c7656]/40 p-4 transition-all duration-300 hover:border-[#c9ad84]/60 md:p-6"
      >
        <h2 className="text-lg font-bold text-white">Add Upcoming Event</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-sm text-white/75">Event Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-[#8c7656]/50 bg-[#010101] px-4 py-2 text-white focus:border-[#a81123] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-white/75">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-[#8c7656]/50 bg-[#010101] px-4 py-2 text-white focus:border-[#a81123] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-white/75">Registration Link (optional)</label>
            <input
              value={registrationLink}
              onChange={(e) => setRegistrationLink(e.target.value)}
              placeholder="https://..."
              dir="ltr"
              className="mt-1 w-full rounded-lg border border-[#8c7656]/50 bg-[#010101] px-4 py-2 text-white focus:border-[#a81123] focus:outline-none"
            />
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <div className="mt-4">
          <TapButton type="submit" disabled={loading}>
            {loading ? "Saving..." : "Add Event"}
          </TapButton>
        </div>
      </form>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-white">Upcoming Events</h3>
        {upcoming.length === 0 ? (
          <p className="text-white/60">No upcoming events.</p>
        ) : (
          upcoming.map((ev) => (
            <motion.div
              key={ev.id}
              className="rounded-xl border border-[#8c7656]/40 bg-[#0d0d0d]/85 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c9ad84]/60"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-white">{ev.title}</span>
                <span className="text-sm text-white/50">{formatDate(ev.date)}</span>
              </div>
              {ev.registration_link && (
                <a
                  href={ev.registration_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-[#a81123] hover:underline"
                >
                  Registration link
                </a>
              )}
              <div className="mt-3">
                <TapButton
                  type="button"
                  variant="ghost"
                  className="py-1.5 px-3 text-sm text-red-400"
                  onClick={() => handleDelete(ev.id)}
                >
                  Delete
                </TapButton>
              </div>
            </motion.div>
          ))
        )}
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-white/85">Past Events</h3>
        {past.length === 0 ? (
          <p className="text-white/50">No past events.</p>
        ) : (
          past.map((ev) => (
            <div
              key={ev.id}
              className="rounded-xl border border-[#8c7656]/25 bg-[#0d0d0d]/70 p-4 transition-all duration-300 hover:border-[#8c7656]/45"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-white/90">{ev.title}</span>
                <span className="text-sm text-white/50">{formatDate(ev.date)}</span>
              </div>
              <div className="mt-3">
                <TapButton
                  type="button"
                  variant="ghost"
                  className="py-1.5 px-3 text-sm text-red-400"
                  onClick={() => handleDelete(ev.id)}
                >
                  Delete
                </TapButton>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
