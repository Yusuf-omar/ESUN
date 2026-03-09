import { Nav } from "@/components/layout/Nav";
import { Hero } from "@/components/home/Hero";
import { OurStory } from "@/components/home/OurStory";
import { ServiceHub } from "@/components/home/ServiceHub";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { LibrarySection } from "@/components/home/LibrarySection";
import { Contact } from "@/components/home/Contact";
import { JoinForm } from "@/components/home/JoinForm";
import { Footer } from "@/components/layout/Footer";
import { submitApplication, sendMessage } from "@/app/actions";
import { createClient } from "@/lib/supabase/server";
import type { EventRow, LibraryItem } from "@/lib/types";

function isMissingColumnError(message: string, column: string) {
  const lower = message.toLowerCase();
  return lower.includes(column) && lower.includes("does not exist");
}

async function fetchUpcomingEvents(supabase: Awaited<ReturnType<typeof createClient>>, today: string) {
  const attempts = [
    () =>
      supabase
        .from("events")
        .select("id, title, content_locale, date, registration_link")
        .gte("date", today)
        .order("date", { ascending: true })
        .limit(20),
    () =>
      supabase
        .from("events")
        .select("id, title, date, registration_link")
        .gte("date", today)
        .order("date", { ascending: true })
        .limit(20),
    () =>
      supabase
        .from("events")
        .select("id, title, content_locale, date:event_date, registration_link")
        .gte("event_date", today)
        .order("event_date", { ascending: true })
        .limit(20),
    () =>
      supabase
        .from("events")
        .select("id, title, date:event_date, registration_link")
        .gte("event_date", today)
        .order("event_date", { ascending: true })
        .limit(20),
  ];

  for (const query of attempts) {
    const { data, error } = await query();
    if (!error) return (data as EventRow[] | null) ?? [];

    const message = error.message ?? "";
    const isSchemaMismatch =
      isMissingColumnError(message, "content_locale") ||
      isMissingColumnError(message, "date") ||
      isMissingColumnError(message, "event_date");
    if (!isSchemaMismatch) {
      console.error("Failed to fetch upcoming events:", error.message);
      return [];
    }
  }

  return [];
}

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: libraryItemsWithLocale, error: libraryWithLocaleError } = await supabase
    .from("library_items")
    .select("id, title, content_locale, category, description, file_url, post_url, preview_image_url, created_at")
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  const { data: libraryItemsLegacy } =
    libraryWithLocaleError &&
    libraryWithLocaleError.message.toLowerCase().includes("content_locale")
      ? await supabase
          .from("library_items")
          .select("id, title, category, description, file_url, post_url, preview_image_url, created_at")
          .eq("is_public", true)
          .order("created_at", { ascending: false })
      : { data: null as LibraryItem[] | null };

  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(
    new Date()
  );
  const upcomingEvents = await fetchUpcomingEvents(supabase, today);

  const items: LibraryItem[] =
    (libraryItemsWithLocale as LibraryItem[] | null) ??
    ((libraryItemsLegacy as LibraryItem[] | null) ?? []);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <OurStory />
        <ServiceHub onSubmitApplication={submitApplication} isSignedIn={!!user} />
        <UpcomingEvents events={upcomingEvents} />
        <LibrarySection items={items} />
        <Contact onSendMessage={sendMessage} isSignedIn={!!user} />
        {!user && <JoinForm />}
      </main>
      <Footer />
    </>
  );
}
