"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { AR } from "@/lib/ar";

const navItems = [
  { href: "/#our-story", label: AR.nav.ourStory },
  { href: "/#services", label: AR.nav.services },
  { href: "/#events", label: "الفعاليات" },
  { href: "/gpa", label: AR.nav.gpaCalculator },
  { href: "/#library", label: AR.nav.library },
  { href: "/#contact", label: AR.nav.contact },
];

export function Nav() {
  const [user, setUser] = useState<boolean | null>(null);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

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
    router.push("/");
    router.refresh();
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 right-0 top-0 z-50 glass"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link
          href="/"
          className="max-w-[190px] text-xs font-bold leading-tight text-white md:max-w-[360px] md:text-base"
        >
          <span className="block whitespace-nowrap md:hidden">
            اتحاد الطلاب المصريين
          </span>
          <span className="hidden whitespace-nowrap md:block">
            اتحاد الطلاب المصريين بجامعه نيشان تاشي
          </span>
        </Link>

        <ul className="flex flex-wrap items-center gap-4 md:gap-6">
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

          {user === true ? (
            <>
              <li>
                <Link href="/dashboard">
                  <motion.span
                    whileTap={{ scale: 0.97 }}
                    className="rounded-lg bg-[#a81123] px-4 py-2 text-sm font-bold text-white"
                  >
                    ملفي الشخصي
                  </motion.span>
                </Link>
              </li>
              <li>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogout}
                  className="rounded-lg border border-[#8c7656] px-4 py-2 text-sm font-medium text-white transition hover:border-[#c9ad84] hover:text-[#f4e6cc]"
                >
                  {AR.nav.logOut}
                </motion.button>
              </li>
            </>
          ) : user === false ? (
            <>
              <li>
                <Link href="/login">
                  <motion.span
                    whileTap={{ scale: 0.97 }}
                    className="rounded-lg border border-[#8c7656] px-4 py-2 text-sm font-medium text-white transition hover:border-[#c9ad84] hover:text-[#f4e6cc]"
                  >
                    {AR.nav.logIn}
                  </motion.span>
                </Link>
              </li>
              <li>
                <Link href="/signup">
                  <motion.span
                    whileTap={{ scale: 0.97 }}
                    className="rounded-lg bg-[#a81123] px-4 py-2 text-sm font-bold text-white"
                  >
                    {AR.nav.joinUnion}
                  </motion.span>
                </Link>
              </li>
            </>
          ) : (
            <li>
              <span className="inline-block h-9 w-44 animate-pulse rounded-lg border border-[#8c7656]/30 bg-white/5" />
            </li>
          )}
        </ul>
      </nav>
    </motion.header>
  );
}
