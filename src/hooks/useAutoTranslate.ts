"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";

type TranslatableLocale = "en" | "tr";

const cache: Record<TranslatableLocale, Map<string, string>> = {
  en: new Map(),
  tr: new Map(),
};

interface TranslateResponse {
  translations?: Record<string, string>;
}

export function useAutoTranslate(
  values: Array<string | null | undefined>,
  locale: Locale
) {
  const target = locale === "en" || locale === "tr" ? locale : null;

  const sourceKey = useMemo(
    () =>
      Array.from(
        new Set(
          values
            .map((value) => value?.trim() ?? "")
            .filter((value) => value.length > 0)
        )
      ).join("\u0001"),
    [values]
  );
  const sourceValues = useMemo(
    () => (sourceKey ? sourceKey.split("\u0001") : []),
    [sourceKey]
  );

  const [, setVersion] = useState(0);

  useEffect(() => {
    if (!target) return;

    const targetCache = cache[target];
    const missing = sourceValues.filter((value) => !targetCache.has(value));
    if (missing.length === 0) return;

    let isCancelled = false;

    (async () => {
      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target, texts: missing }),
        });
        if (!response.ok) return;

        const data = (await response.json()) as TranslateResponse;
        const incoming = data.translations ?? {};

        for (const [source, translated] of Object.entries(incoming)) {
          if (!translated || !translated.trim()) continue;
          targetCache.set(source, translated);
        }

        if (!isCancelled) {
          setVersion((value) => value + 1);
        }
      } catch {
        // Keep original Arabic text if translation service is unavailable.
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [target, sourceKey, sourceValues]);

  return (value: string | null | undefined) => {
    if (!value) return "";
    if (!target) return value;
    return cache[target].get(value) ?? value;
  };
}
