"use client";

import { motion } from "framer-motion";
import type { ServiceType } from "@/lib/types";
import { SERVICE_LABELS } from "@/lib/types";
import { TapButton } from "@/components/ui/TapButton";
import { AR } from "@/lib/ar";

interface ServiceCardProps {
  type: ServiceType;
  description: string;
  onApply: () => void;
  index: number;
}

export function ServiceCard({
  type,
  description,
  onApply,
  index,
}: ServiceCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group glass relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#8c7656]/40 p-6 transition-all duration-300 hover:border-[#c9ad84]/65 md:p-8"
    >
      <div className="pointer-events-none absolute -top-16 -left-12 h-44 w-44 rounded-full bg-[#c9ad84]/10 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9ad84]/80 to-transparent" />
      <h3 className="text-xl font-bold text-white">
        {SERVICE_LABELS[type]}
      </h3>
      <p className="mt-3 flex-1 text-white/80">{description}</p>
      <div className="mt-6">
        <TapButton onClick={onApply} className="w-full py-3 min-h-14">
          {AR.services.applyNow}
        </TapButton>
      </div>
    </motion.article>
  );
}
