"use client";

import { motion } from "framer-motion";
import { HeroLogo } from "./HeroLogo";
import { AR } from "@/lib/ar";

function scrollToJoin() {
  document.getElementById("join-form")?.scrollIntoView({
    behavior: "smooth",
  });
}

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent">
      <motion.div
        className="pointer-events-none absolute -left-14 top-24 h-52 w-52 rounded-full bg-[#c9ad84]/15 blur-3xl"
        animate={{ y: [0, -14, 0], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-16 bottom-20 h-64 w-64 rounded-full bg-[#a81123]/18 blur-3xl"
        animate={{ y: [0, 18, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 40%, rgba(201,173,132,0.2), transparent)",
        }}
      />
      <motion.div
        className="relative flex flex-col items-center gap-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <HeroLogo />
        <div className="text-center">
          <motion.h1
            className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {AR.hero.title}
          </motion.h1>
          <motion.p
            className="mt-2 text-lg text-white/80 md:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {AR.hero.subtitle}
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            onClick={scrollToJoin}
            className="rounded-lg bg-[#a81123] px-8 py-4 text-lg font-bold text-white"
            whileTap={{ scale: 0.97 }}
            whileHover={{
              boxShadow: "0 0 24px rgba(168, 17, 35, 0.5)",
            }}
          >
            {AR.hero.cta}
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
