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
import type { LibraryItem } from "@/lib/types";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: libraryItems } = await supabase
    .from("library_items")
    .select("id, title, category, description, file_url, post_url, preview_image_url, created_at")
    .eq("is_public", true)
    .order("created_at", { ascending: false });
  const today = new Date().toISOString().slice(0, 10);
  const { data: upcomingEvents } = await supabase
    .from("events")
    .select("id, title, date, registration_link")
    .gte("date", today)
    .order("date", { ascending: true })
    .limit(6);

  const items: LibraryItem[] = libraryItems ?? [];

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <OurStory />
        <ServiceHub onSubmitApplication={submitApplication} isSignedIn={!!user} />
        <UpcomingEvents events={upcomingEvents ?? []} />
        <LibrarySection items={items} />
        <Contact onSendMessage={sendMessage} />
        {!user && <JoinForm />}
      </main>
      <Footer />
    </>
  );
}
