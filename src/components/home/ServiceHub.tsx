"use client";

import { useState } from "react";
import { ServiceCard } from "./ServiceCard";
import { ServiceModal } from "./ServiceModal";
import type { ServiceType } from "@/lib/types";
import { useI18n } from "@/components/providers/I18nProvider";

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
  const { copy } = useI18n();
  const services: { type: ServiceType; description: string }[] = [
    {
      type: "religious_social_guidance",
      description: copy.services.religiousSocialGuidanceDesc,
    },
    { type: "academic_support", description: copy.services.academicSupportDesc },
    { type: "cultural_activities", description: copy.services.culturalActivitiesDesc },
  ];

  return (
    <section id="services" className="scroll-mt-20 border-t border-[#8c7656]/30 bg-transparent py-14 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6 w-full">
        <h2 className="text-center text-3xl font-bold text-white md:text-4xl">
          {copy.services.title}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-white/80">
          {copy.services.subtitle}
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {services.map((service, index) => (
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
