"use client";

import { AR } from "@/lib/ar";

interface Profile {
  id: string;
  full_name: string | null;
  student_number: string | null;
  phone_number: string | null;
  email: string | null;
  updated_at: string | null;
}

export function ProfileSection({ profile }: { profile: Profile | null }) {
  const d = AR.dashboard;

  return (
    <section className="glass rounded-2xl border border-[#8c7656]/40 bg-[#0d0d0d]/80 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c9ad84]/60">
      <h2 className="text-lg font-bold text-white">{d.profile}</h2>
      <dl className="mt-4 space-y-2 text-sm">
        <div>
          <dt className="text-white/60">{d.name}</dt>
          <dd className="font-medium text-white">{profile?.full_name ?? "-"}</dd>
        </div>
        <div>
          <dt className="text-white/60">{d.studentNumber}</dt>
          <dd className="font-medium text-white">
            {profile?.student_number ?? "-"}
          </dd>
        </div>
        <div>
          <dt className="text-white/60">{d.phoneNumber}</dt>
          <dd className="font-medium text-white">{profile?.phone_number ?? "-"}</dd>
        </div>
        <div>
          <dt className="text-white/60">{d.email}</dt>
          <dd className="font-medium text-white">{profile?.email ?? "-"}</dd>
        </div>
      </dl>
    </section>
  );
}
