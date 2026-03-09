import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Noto_Sans, Noto_Sans_Arabic } from "next/font/google";
import { I18nProvider } from "@/components/providers/I18nProvider";
import {
  DEFAULT_LOCALE,
  getDir,
  isLocale,
  LOCALE_COOKIE,
} from "@/lib/i18n";
import "./globals.css";

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-latin",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Egyptian Students Union | Nisantasi University",
  description:
    "Trusted support for Egyptian students at Nisantasi University through services, activities, and guidance.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(localeCookie) ? localeCookie : DEFAULT_LOCALE;
  const dir = getDir(locale);

  return (
    <html lang={locale} dir={dir} className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${notoArabic.variable} ${notoSans.variable} min-h-screen bg-transparent font-sans text-white antialiased`}
      >
        <I18nProvider initialLocale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}

