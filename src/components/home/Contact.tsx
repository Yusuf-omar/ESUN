"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TapButton } from "@/components/ui/TapButton";
import { useI18n } from "@/components/providers/I18nProvider";

interface ContactProps {
  isSignedIn: boolean;
  onSendMessage: (data: {
    name?: string;
    phone?: string;
    message: string;
    website?: string;
  }) => Promise<void>;
}

export function Contact({ isSignedIn, onSendMessage }: ContactProps) {
  const { copy } = useI18n();
  const c = copy.contact;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setStatus("sending");

    try {
      await onSendMessage({
        name: isSignedIn ? undefined : name,
        phone: isSignedIn ? undefined : phone,
        message,
        website,
      });
      setStatus("sent");
      setMessage("");
      setWebsite("");
      if (!isSignedIn) {
        setName("");
        setPhone("");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send message.";
      setErrorMessage(msg);
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="scroll-mt-20 border-t border-[#8c7656]/30 bg-transparent py-14 md:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="text-center text-3xl font-bold text-white md:text-4xl">{c.title}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-white/80">{c.subtitle}</p>
        <motion.div
          className="mx-auto mt-12 max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <form
            onSubmit={handleSubmit}
            className="glass rounded-2xl border border-[#8c7656]/40 p-6 transition-all duration-300 hover:border-[#c9ad84]/60 md:p-8"
          >
            <div className="space-y-4">
              {!isSignedIn && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-white/80">{c.name}</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      dir="auto"
                      required
                      className="mt-1 w-full rounded-lg border border-[#8c7656]/50 bg-[#14110d]/75 px-4 py-2 text-white focus:border-[#c9ad84] focus:ring-2 focus:ring-[#c9ad84]/25 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80">{c.phone}</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      dir="ltr"
                      autoComplete="tel"
                      required
                      className="mt-1 w-full rounded-lg border border-[#8c7656]/50 bg-[#14110d]/75 px-4 py-2 text-white focus:border-[#c9ad84] focus:ring-2 focus:ring-[#c9ad84]/25 focus:outline-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-white/80">{c.message}</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  dir="auto"
                  required
                  rows={4}
                  className="mt-1 w-full resize-none rounded-lg border border-[#8c7656]/50 bg-[#14110d]/75 px-4 py-2 text-white focus:border-[#c9ad84] focus:ring-2 focus:ring-[#c9ad84]/25 focus:outline-none"
                />
              </div>
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
              {status === "sent" && <p className="text-sm text-green-400">{c.sent}</p>}
              {status === "error" && (
                <p className="text-sm text-red-400">{errorMessage || c.error}</p>
              )}
              <TapButton type="submit" className="w-full py-3" disabled={status === "sending"}>
                {status === "sending" ? c.sending : c.sendMessage}
              </TapButton>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
