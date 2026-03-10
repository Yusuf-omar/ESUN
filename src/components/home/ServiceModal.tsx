"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TapButton } from "@/components/ui/TapButton";
import type { ServiceType } from "@/lib/types";
import { getServiceLabels } from "@/lib/i18n";
import { useI18n } from "@/components/providers/I18nProvider";
import type { ActionResult } from "@/app/actions";

const STUDENT_ID_REGEX = /^\d{11}$/;

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: ServiceType;
  isSignedIn: boolean;
  onSubmit: (data: {
    name?: string;
    studentId?: string;
    issue: string;
    serviceType: ServiceType;
  }) => Promise<ActionResult>;
}

export function ServiceModal({
  isOpen,
  onClose,
  serviceType,
  isSignedIn,
  onSubmit,
}: ServiceModalProps) {
  const { copy } = useI18n();
  const m = copy.serviceModal;
  const serviceLabels = getServiceLabels(copy);

  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [issue, setIssue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isSignedIn) {
      if (!name.trim()) {
        setError(m.errorName);
        return;
      }
      if (!STUDENT_ID_REGEX.test(studentId.replace(/\s/g, ""))) {
        setError(m.errorStudentId);
        return;
      }
    }

    if (!issue.trim()) {
      setError(m.errorIssue);
      return;
    }
    setLoading(true);
    try {
      const result = await onSubmit({
        name: isSignedIn ? undefined : name.trim(),
        studentId: isSignedIn ? undefined : studentId.replace(/\s/g, ""),
        issue: issue.trim(),
        serviceType,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setName("");
      setStudentId("");
      setIssue("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : m.genericError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#8c7656]/50 bg-[#100e0c]/95 p-5 shadow-[0_25px_60px_rgba(0,0,0,0.55)] md:p-6"
            >
              <h2 className="text-lg font-bold text-white md:text-xl">
                {m.title} {serviceLabels[serviceType]}
              </h2>
              {isSignedIn && <p className="mt-2 text-sm text-white/70">{m.signedInHint}</p>}
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {!isSignedIn && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-white/80">{m.name}</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        dir="auto"
                        className="mt-1 w-full rounded-lg border border-[#8c7656]/50 bg-[#14110d]/75 px-4 py-2 text-white placeholder:text-white/40 focus:border-[#c9ad84] focus:ring-2 focus:ring-[#c9ad84]/25 focus:outline-none"
                        placeholder={m.namePlaceholder}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80">
                        {m.studentId}
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={studentId}
                        onChange={(e) =>
                          setStudentId(e.target.value.replace(/\D/g, "").slice(0, 11))
                        }
                        dir="ltr"
                        className="mt-1 w-full rounded-lg border border-[#8c7656]/50 bg-[#14110d]/75 px-4 py-2 text-white placeholder:text-white/40 focus:border-[#c9ad84] focus:ring-2 focus:ring-[#c9ad84]/25 focus:outline-none"
                        placeholder={m.studentIdPlaceholder}
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-white/80">{m.issue}</label>
                  <textarea
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    rows={4}
                    dir="auto"
                    className="mt-1 w-full resize-none rounded-lg border border-[#8c7656]/50 bg-[#14110d]/75 px-4 py-2 text-white placeholder:text-white/40 focus:border-[#c9ad84] focus:ring-2 focus:ring-[#c9ad84]/25 focus:outline-none"
                    placeholder={m.issuePlaceholder}
                  />
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <div className="flex flex-col-reverse gap-3 sm:flex-row">
                  <TapButton type="button" variant="outline" className="flex-1" onClick={onClose}>
                    {m.cancel}
                  </TapButton>
                  <TapButton type="submit" className="flex-1" disabled={loading}>
                    {loading ? m.submitting : m.submit}
                  </TapButton>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
