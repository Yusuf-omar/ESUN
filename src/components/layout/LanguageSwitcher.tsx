"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LOCALES, type Locale } from "@/lib/i18n";
import { useI18n } from "@/components/providers/I18nProvider";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, copy, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (!wrapperRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocumentClick);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  const currentLabel = getLabel(copy.language, locale);

  return (
    <div ref={wrapperRef} className={`relative ${compact ? "w-[130px]" : "w-[165px]"}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={copy.language.switchAria}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-[#8c7656]/50 bg-[#0d0d0d]/80 px-3 py-2 text-sm text-white transition hover:border-[#c9ad84]/70"
      >
        <span className="truncate font-medium">{currentLabel}</span>
        <motion.svg
          viewBox="0 0 20 20"
          className="h-4 w-4 text-white/70"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden="true"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            role="listbox"
            aria-label={copy.language.label}
            className="absolute start-0 top-full z-[60] mt-2 w-full overflow-hidden rounded-xl border border-[#8c7656]/55 bg-[#0b0907]/95 p-1 shadow-[0_16px_36px_rgba(0,0,0,0.45)] backdrop-blur"
          >
            {LOCALES.map((option) => {
              const isActive = option === locale;
              return (
                <li key={option} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    onClick={() => {
                      setLocale(option);
                      setOpen(false);
                    }}
                    className={`block w-full rounded-lg px-3 py-2 text-start text-sm transition ${
                      isActive
                        ? "bg-[#a81123] text-white"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {getLabel(copy.language, option)}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function getLabel(
  labels: { ar: string; en: string; tr: string },
  locale: Locale
) {
  if (locale === "ar") return labels.ar;
  if (locale === "tr") return labels.tr;
  return labels.en;
}
