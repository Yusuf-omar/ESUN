"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/components/providers/I18nProvider";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export function Nav() {
  const [user, setUser] = useState<boolean | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { copy } = useI18n();

  const navItems = useMemo(
    () => [
      { href: "/#our-story", label: copy.nav.ourStory },
      { href: "/#services", label: copy.nav.services },
      { href: "/#events", label: copy.nav.events },
      { href: "/gpa", label: copy.nav.gpaCalculator },
      { href: "/#library", label: copy.nav.library },
      { href: "/#contact", label: copy.nav.contact },
    ],
    [copy]
  );

  useEffect(() => {
    let mounted = true;

    const syncUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (mounted) setUser(!!session);
    };

    void syncUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (mounted) setUser(!!session);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 right-0 top-0 z-50 glass glass-nav"
    >
      <nav className="mx-auto max-w-6xl px-4 py-3 md:px-6">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="max-w-[220px] text-white">
            <span className="block text-xs font-bold leading-snug md:text-sm">
              {copy.siteName}
            </span>
            <span className="block text-[11px] text-white/70 md:hidden">
              {copy.siteSubtitle}
            </span>
            <span className="hidden text-xs text-white/70 md:block">
              {copy.siteSubtitle}
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setIsMenuOpen((v) => !v)}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#8c7656]/70 text-white transition hover:border-[#c9ad84] md:hidden"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <span
              className={`absolute block h-0.5 w-5 bg-current transition-transform ${
                isMenuOpen ? "rotate-45" : "-translate-y-1.5"
              }`}
            />
            <span
              className={`absolute block h-0.5 w-5 bg-current transition-opacity ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute block h-0.5 w-5 bg-current transition-transform ${
                isMenuOpen ? "-rotate-45" : "translate-y-1.5"
              }`}
            />
          </button>
        </div>

        <div className="mt-3 hidden flex-wrap items-center justify-between gap-4 md:flex">
          <ul className="flex min-w-0 flex-1 flex-wrap items-center gap-5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative text-sm font-medium text-white/90 transition hover:text-[#e7d4b0] after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-right after:scale-x-0 after:bg-[#c9ad84] after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 items-center gap-2">
            <LanguageSwitcher compact />
            {user === true ? (
              <>
                <Link href="/dashboard">
                  <motion.span
                    whileTap={{ scale: 0.97 }}
                    className="rounded-lg bg-[#a81123] px-4 py-2 text-sm font-bold text-white"
                  >
                    {copy.nav.dashboard}
                  </motion.span>
                </Link>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogout}
                  className="rounded-lg border border-[#8c7656] px-4 py-2 text-sm font-medium text-white transition hover:border-[#c9ad84] hover:text-[#f4e6cc]"
                >
                  {copy.nav.logOut}
                </motion.button>
              </>
            ) : user === false ? (
              <>
                <Link href="/login">
                  <motion.span
                    whileTap={{ scale: 0.97 }}
                    className="rounded-lg border border-[#8c7656] px-4 py-2 text-sm font-medium text-white transition hover:border-[#c9ad84] hover:text-[#f4e6cc]"
                  >
                    {copy.nav.logIn}
                  </motion.span>
                </Link>
                <Link href="/signup">
                  <motion.span
                    whileTap={{ scale: 0.97 }}
                    className="rounded-lg bg-[#a81123] px-4 py-2 text-sm font-bold text-white"
                  >
                    {copy.nav.joinUnion}
                  </motion.span>
                </Link>
              </>
            ) : (
              <span className="inline-block h-9 w-44 animate-pulse rounded-lg border border-[#8c7656]/30 bg-white/5" />
            )}
          </div>
        </div>

        {isMenuOpen && (
          <div className="mt-3 rounded-xl border border-[#8c7656]/40 bg-[#0f0d0a]/95 p-3 md:hidden">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/5 hover:text-[#e7d4b0]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 space-y-2 border-t border-[#8c7656]/35 pt-3">
              <LanguageSwitcher />
              {user === true ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block rounded-lg bg-[#a81123] px-4 py-2.5 text-center text-sm font-bold text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {copy.nav.dashboard}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-lg border border-[#8c7656] px-4 py-2.5 text-sm font-medium text-white transition hover:border-[#c9ad84] hover:text-[#f4e6cc]"
                  >
                    {copy.nav.logOut}
                  </button>
                </>
              ) : user === false ? (
                <>
                  <Link
                    href="/login"
                    className="block rounded-lg border border-[#8c7656] px-4 py-2.5 text-center text-sm font-medium text-white transition hover:border-[#c9ad84] hover:text-[#f4e6cc]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {copy.nav.logIn}
                  </Link>
                  <Link
                    href="/signup"
                    className="block rounded-lg bg-[#a81123] px-4 py-2.5 text-center text-sm font-bold text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {copy.nav.joinUnion}
                  </Link>
                </>
              ) : (
                <span className="inline-block h-10 w-full animate-pulse rounded-lg border border-[#8c7656]/30 bg-white/5" />
              )}
            </div>
          </div>
        )}
      </nav>
    </motion.header>
  );
}
