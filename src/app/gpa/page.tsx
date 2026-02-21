"use client";

import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { GPACalculator } from "@/components/gpa/GPACalculator";
import { AR } from "@/lib/ar";

export default function GPAPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[#010101] pt-20">
        <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
          <div className="mb-4">
            <Link href="/" className="text-sm text-white/70 hover:text-white">
              ← الرئيسية
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            {AR.gpa.title}
          </h1>
          <p className="mt-2 text-white/80">
            {AR.gpa.subtitle}
          </p>
          <GPACalculator />
        </div>
      </main>
    </>
  );
}
