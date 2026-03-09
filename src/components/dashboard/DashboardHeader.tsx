"use client";

import Link from "next/link";
import { useI18n } from "@/components/providers/I18nProvider";

export function DashboardHeader() {
  const { copy } = useI18n();
  const d = copy.dashboard;

  return (
    <div className="mb-6 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-2xl font-bold text-white">{d.pageTitle}</h1>
      <Link href="/" className="text-sm text-white/70 transition hover:text-white">
        {d.backHome}
      </Link>
    </div>
  );
}

