"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/components/providers/I18nProvider";

export function Community() {
  const { copy } = useI18n();
  const instagramUrl = `https://www.instagram.com/${copy.community.instagramHandle}/`;

  return (
    <section
      id="community"
      className="scroll-mt-20 border-t border-[#8c7656]/30 bg-[#010101] py-20"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="text-center text-3xl font-bold text-white md:text-4xl">
          {copy.community.title}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-white/80">
          {copy.community.subtitle}
        </p>
        <motion.div
          className="mx-auto mt-10 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="glass rounded-2xl border border-[#8c7656]/40 p-8 text-center">
            <p className="text-white/90">{copy.community.teaser}</p>
            <motion.a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-lg bg-[#a81123] px-6 py-3 font-bold text-white"
              whileTap={{ scale: 0.97 }}
              whileHover={{
                boxShadow: "0 0 20px rgba(168, 17, 35, 0.4)",
              }}
            >
              @{copy.community.instagramHandle}
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

