"use client";

import { motion } from "framer-motion";
import { TapButton } from "@/components/ui/TapButton";
import Link from "next/link";
import { useI18n } from "@/components/providers/I18nProvider";

export function JoinForm() {
  const { copy } = useI18n();
  const j = copy.joinForm;
  return (
    <section
      id="join-form"
      className="scroll-mt-20 border-t border-[#8c7656]/30 bg-transparent py-14 md:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="text-center text-3xl font-bold text-white md:text-4xl">
          {j.title}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-white/80">
          {j.subtitle}
        </p>
        <motion.div
          className="mx-auto mt-12 max-w-md text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link href="/signup">
            <TapButton className="w-full py-4 text-lg">
              {j.goToRegistration}
            </TapButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
