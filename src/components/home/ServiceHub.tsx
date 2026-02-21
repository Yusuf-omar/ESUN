"use client";

import { useState } from "react";
import { ServiceCard } from "./ServiceCard";
import { ServiceModal } from "./ServiceModal";
import type { ServiceType } from "@/lib/types";
import { AR } from "@/lib/ar";

const SERVICES: { type: ServiceType; description: string }[] = [
  { type: "religious_social_guidance", description: AR.services.religiousSocialGuidanceDesc },
  { type: "academic_support", description: AR.services.academicSupportDesc },
  { type: "cultural_activities", description: AR.services.culturalActivitiesDesc },
];

interface ServiceHubProps {
  onSubmitApplication: (data: {
    name?: string;
    studentId?: string;
    issue: string;
    serviceType: ServiceType;
  }) => Promise<void>;
  isSignedIn: boolean;
}

export function ServiceHub({ onSubmitApplication, isSignedIn }: ServiceHubProps) {
  const [modalService, setModalService] = useState<ServiceType | null>(null);

  return (
    <section id="services" className="scroll-mt-20 border-t border-[#8c7656]/30 bg-transparent py-14 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6 w-full">
        <h2 className="text-center text-3xl font-bold text-white md:text-4xl">
          {AR.services.title}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-white/80">
          {AR.services.subtitle}
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {SERVICES.map((service, index) => (
            <ServiceCard
              key={service.type}
              type={service.type}
              description={service.description}
              index={index}
              onApply={() => setModalService(service.type)}
            />
          ))}
        </div>
      </div>
      <ServiceModal
        isOpen={modalService !== null}
        onClose={() => setModalService(null)}
        serviceType={modalService ?? "academic_support"}
        isSignedIn={isSignedIn}
        onSubmit={onSubmitApplication}
      />
    </section>
  );
}
