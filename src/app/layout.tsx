import type { Metadata } from "next";
import { Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "اتحاد الطلاب المصريين | جامعة نيشان تاشي",
  description:
    "دعم موثوق للطلاب المصريين في جامعة نيشان تاشي عبر الخدمات الأكاديمية والأنشطة الثقافية والإرشاد.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <body
        className={`${notoArabic.variable} min-h-screen bg-transparent font-sans text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
