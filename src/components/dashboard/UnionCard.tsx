"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/components/providers/I18nProvider";

interface Profile {
  id: string;
  full_name: string | null;
  student_number: string | null;
  email: string | null;
}

export function UnionCard({ profile }: { profile: Profile | null }) {
  const { copy } = useI18n();
  const d = copy.dashboard;

  return (
    <section className="rounded-2xl border-2 border-[#8c7656] bg-[#0d0d0d]/85 p-6 backdrop-blur-sm md:p-8">
      <h2 className="text-lg font-bold text-[#c9ad84]">{d.unionCard}</h2>
      <motion.div
        className="mt-4 flex flex-col gap-4 rounded-xl border border-[#8c7656]/50 bg-[#120f0d]/85 p-6 transition-all duration-300"
        whileHover={{
          y: -4,
          boxShadow: "0 0 26px rgba(201, 173, 132, 0.18)",
        }}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#a81123]/30">
            <span className="text-2xl font-bold text-[#f0d5a8]">E</span>
          </div>
          <div>
            <p className="text-xl font-bold text-white">{profile?.full_name ?? d.member}</p>
            <p className="text-white/70">{d.unionSubtitle}</p>
          </div>
        </div>
        <div className="flex justify-between border-t border-[#8c7656]/30 pt-4 text-sm">
          <span className="text-white/60">{d.studentNumber}</span>
          <span className="font-mono font-medium text-white">{profile?.student_number ?? "-"}</span>
        </div>
      </motion.div>
    </section>
  );
}

