"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TapButton } from "@/components/ui/TapButton";
import type { EventRow } from "@/lib/types";
import { getLocaleTag } from "@/lib/i18n";
import { useI18n } from "@/components/providers/I18nProvider";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";

function formatDate(value: string, localeTag: string) {
  return new Date(value).toLocaleDateString(localeTag, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function UpcomingEvents({ events }: { events: EventRow[] }) {
  const { copy, locale } = useI18n();
  const localeTag = getLocaleTag(locale);
  const translate = useAutoTranslate(
    events.map((event) => event.title),
    locale
  );

  return (
    <section
      id="events"
      className="scroll-mt-20 border-t border-[#8c7656]/30 bg-transparent py-14 md:py-16"
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <h2 className="text-center text-3xl font-bold text-white md:text-4xl">
          {copy.events.title}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-white/75">
          {copy.events.subtitle}
        </p>

        {events.length === 0 ? (
          <p className="mx-auto mt-10 max-w-2xl text-center text-white/65">
            {copy.events.empty}
          </p>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => (
              <motion.article
                key={event.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="group relative overflow-hidden rounded-2xl border border-[#8c7656]/40 bg-[#0d0d0d]/85 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#c9ad84]/60"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#a81123]/20 via-transparent to-transparent" />
                </div>
                <div className="relative z-10">
                  <p className="text-sm text-[#8c7656]">{formatDate(event.date, localeTag)}</p>
                  <h3 className="mt-2 text-xl font-bold text-white">
                    {translate(event.title)}
                  </h3>
                  <div className="mt-6">
                    {event.registration_link ? (
                      <Link href={event.registration_link} target="_blank" rel="noopener noreferrer">
                        <TapButton className="w-full py-3">{copy.events.registerNow}</TapButton>
                      </Link>
                    ) : (
                      <TapButton className="w-full py-3" disabled>
                        {copy.events.comingSoon}
                      </TapButton>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
