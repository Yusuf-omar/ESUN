"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TapButton } from "@/components/ui/TapButton";
import { useI18n } from "@/components/providers/I18nProvider";

export function OurStory() {
  const [expanded, setExpanded] = useState(false);
  const { copy } = useI18n();

  return (
    <section
      id="our-story"
      className="scroll-mt-20 border-t border-[#8c7656]/30 bg-transparent py-14 md:py-16"
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <h2 className="text-center text-3xl font-bold text-white md:text-4xl">
          {copy.ourStory.title}
        </h2>
        <div className="mx-auto mt-12 max-w-3xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-xl border border-[#8c7656]/35 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c9ad84]/60"
          >
            <h3 className="text-lg font-bold text-[#8c7656]">{copy.ourStory.mission}</h3>
            <p className="mt-2 text-white/90">{copy.ourStory.missionText}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            className="glass rounded-xl border border-[#8c7656]/35 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c9ad84]/60"
          >
            <h3 className="text-lg font-bold text-[#8c7656]">{copy.ourStory.vision}</h3>
            <p className="mt-2 text-white/90">{copy.ourStory.visionText}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass rounded-xl border border-[#8c7656]/35 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c9ad84]/60"
          >
            <h3 className="text-lg font-bold text-[#8c7656]">{copy.ourStory.historyTitle}</h3>
            <AnimatePresence mode="wait">
              {expanded ? (
                <motion.p
                  key="full"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 text-white/90"
                >
                  {copy.ourStory.historyFull}
                </motion.p>
              ) : (
                <motion.p
                  key="short"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-2 text-white/90"
                >
                  {copy.ourStory.historyShort}...
                </motion.p>
              )}
            </AnimatePresence>
            <TapButton
              variant="outline"
              className="mt-4"
              onClick={() => setExpanded((e) => !e)}
            >
              {expanded ? copy.ourStory.showLess : copy.ourStory.readMore}
            </TapButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
