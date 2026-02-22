"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { hasPublicSupabaseConfig } from "@/lib/supabase/env";
import { TapButton } from "@/components/ui/TapButton";
import { AR } from "@/lib/ar";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUPABASE_CONFIG_ERROR =
  "Supabase is not configured. Add real values in .env.local.";
const a = AR.auth;

function isSupabaseConfigError(message: string) {
  const lower = message.toLowerCase();
  return (
    lower.includes("not configured") ||
    lower.includes("supabase") ||
    lower.includes("invalid api key") ||
    lower.includes("failed to fetch")
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get("error");
    if (errorParam === "domain") {
      setError("This email domain is not allowed for member access.");
    } else if (errorParam === "auth") {
      setError("Authentication failed. Please try logging in again.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setError(a.emailError);
      return;
    }
    if (!hasPublicSupabaseConfig()) {
      setError(SUPABASE_CONFIG_ERROR);
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });
      if (err) {
        const msg = err.message || "";
        if (isSupabaseConfigError(msg)) {
          setError(SUPABASE_CONFIG_ERROR);
          return;
        }
        setError(msg);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : (err as { message?: string })?.message;
      setError(msg || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#010101] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#8c7656]/40 bg-[#0d0d0d] p-8 glass">
        <h1 className="text-2xl font-bold text-white">{a.loginTitle}</h1>
        <p className="mt-1 text-sm text-white/70">{a.loginSubtitle}</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80">{a.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              dir="ltr"
              autoComplete="email"
              className="mt-1 w-full rounded-lg border border-[#8c7656]/50 bg-[#010101] px-4 py-2 text-white placeholder:text-white/40 focus:border-[#a81123] focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80">
              {a.password}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dir="ltr"
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-[#8c7656]/50 bg-[#010101] px-4 py-2 text-white focus:border-[#a81123] focus:outline-none"
              required
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <TapButton type="submit" className="w-full py-3" disabled={loading}>
            {loading ? a.signingIn : a.signIn}
          </TapButton>
        </form>
        <p className="mt-4 text-center text-sm text-white/70">
          {a.noAccount}{" "}
          <Link href="/signup" className="font-medium text-[#a81123]">
            {a.signUp}
          </Link>
        </p>
        <p className="mt-2 text-center">
          <Link href="/" className="text-sm text-white/60 hover:text-white">
            {a.backToHome}
          </Link>
        </p>
      </div>
    </div>
  );
}
