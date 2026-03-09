"use client";

import { useMemo } from "react";
import { useI18n } from "@/components/providers/I18nProvider";

const INSTAGRAM_URL = "https://www.instagram.com/esu.nisantasi/";
const WHATSAPP_URL = "https://wa.me/905073449445";
const EMAIL_ADDRESS = "nisantasiegyptin@gmail.com";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.15 1.5a1.35 1.35 0 1 1 0 2.7 1.35 1.35 0 0 1 0-2.7ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M12.04 2A9.94 9.94 0 0 0 3.5 16.95L2 22l5.2-1.36A10 10 0 1 0 12.04 2Zm5.8 14.07c-.24.68-1.4 1.28-1.95 1.37-.5.09-1.14.13-1.84-.1-.43-.14-.98-.32-1.7-.63-2.99-1.29-4.94-4.3-5.09-4.5-.14-.2-1.21-1.62-1.21-3.09 0-1.48.77-2.2 1.04-2.5.27-.3.59-.37.78-.37h.56c.18 0 .42-.07.65.48.24.59.81 2.05.88 2.2.07.15.12.33.02.53-.1.2-.15.33-.3.5-.14.16-.3.36-.43.48-.15.14-.31.28-.13.55.17.27.78 1.29 1.68 2.09 1.15 1.02 2.13 1.34 2.43 1.49.3.15.48.13.65-.08.2-.25.8-.93 1.01-1.26.2-.33.42-.27.7-.17.3.1 1.86.87 2.18 1.03.31.15.51.22.58.35.07.13.07.76-.17 1.44Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm9 7.1L21 7H3l9 5.1ZM3 9.2V17h18V9.2l-8.52 4.83a1 1 0 0 1-.96 0L3 9.2Z" />
    </svg>
  );
}

export function Footer() {
  const { copy } = useI18n();

  const instagramUrl = useMemo(() => {
    const customUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim();
    return customUrl || INSTAGRAM_URL;
  }, []);

  const whatsappUrl = useMemo(() => {
    const customUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim();
    return customUrl || WHATSAPP_URL;
  }, []);

  return (
    <footer className="border-t border-[#8c7656]/30 bg-transparent py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-5 px-4 md:px-6">
        <h3 className="text-xl font-bold text-white">{copy.footer.title}</h3>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[#8c7656]/60 px-4 py-2 text-sm text-white hover:border-[#a81123] hover:text-[#a81123]"
          >
            <InstagramIcon />
            <span>{copy.footer.instagram}</span>
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[#8c7656]/60 px-4 py-2 text-sm text-white hover:border-[#a81123] hover:text-[#a81123]"
          >
            <WhatsAppIcon />
            <span>{copy.footer.whatsapp}</span>
          </a>
          <a
            href={`mailto:${EMAIL_ADDRESS}`}
            className="inline-flex items-center gap-2 rounded-lg border border-[#8c7656]/60 px-4 py-2 text-sm text-white hover:border-[#a81123] hover:text-[#a81123]"
          >
            <MailIcon />
            <span>{copy.footer.emailForm}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
