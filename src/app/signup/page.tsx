"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { hasPublicSupabaseConfig } from "@/lib/supabase/env";
import { TapButton } from "@/components/ui/TapButton";
import { useI18n } from "@/components/providers/I18nProvider";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STUDENT_ID_REGEX = /^\d{11}$/;
const PHONE_REGEX = /^\+?\d{10,15}$/;

function normalizePhone(value: string) {
  const cleaned = value.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+")) {
    return `+${cleaned.slice(1).replace(/\+/g, "")}`;
  }
  return cleaned.replace(/\+/g, "");
}

function isSupabaseConfigError(message: string) {
  const lower = message.toLowerCase();
  return (
    lower.includes("not configured") ||
    lower.includes("supabase") ||
    lower.includes("invalid api key") ||
    lower.includes("failed to fetch")
  );
}

export default function SignupPage() {
  const { copy } = useI18n();
  const a = copy.auth;

  const [name, setName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedStudentNumber = studentNumber.replace(/\s/g, "");
    const normalizedPhoneNumber = normalizePhone(phoneNumber);

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setError(a.emailError);
      return;
    }
    if (!STUDENT_ID_REGEX.test(normalizedStudentNumber)) {
      setError(a.studentIdError);
      return;
    }
    if (!PHONE_REGEX.test(normalizedPhoneNumber)) {
      setError(a.phoneError);
      return;
    }
    if (!hasPublicSupabaseConfig()) {
      setError(a.configError);
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: err } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: name.trim(),
            student_number: normalizedStudentNumber,
            phone_number: normalizedPhoneNumber,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });
      if (err) {
        const msg = err.message || "";
        if (isSupabaseConfigError(msg)) {
          setError(a.configError);
          return;
        }
        setError(msg);
        return;
      }

      if (data.session) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      setSent(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : (err as { message?: string })?.message;
      setError(msg || a.signupFailed);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#010101] px-4">
        <div className="w-full max-w-md rounded-2xl border border-[#8c7656]/40 bg-[#0d0d0d] p-8 glass text-center">
          <h1 className="text-2xl font-bold text-white">{a.checkEmail}</h1>
          <p className="mt-3 text-white/80">
            {a.checkEmailText} <strong>{email}</strong>.
          </p>
          <Link href="/login" className="mt-6 inline-block">
            <TapButton>{a.goToLogin}</TapButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#010101] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#8c7656]/40 bg-[#0d0d0d] p-8 glass">
        <h1 className="text-2xl font-bold text-white">{a.signupTitle}</h1>
        <p className="mt-1 text-sm text-white/70">{a.signupSubtitle}</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80">{a.fullName}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              dir="auto"
              autoComplete="name"
              className="mt-1 w-full rounded-lg border border-[#8c7656]/50 bg-[#010101] px-4 py-2 text-white focus:border-[#a81123] focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80">{a.studentNumber}</label>
            <input
              type="text"
              inputMode="numeric"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value.replace(/\D/g, "").slice(0, 11))}
              placeholder="20232022109"
              dir="ltr"
              className="mt-1 w-full rounded-lg border border-[#8c7656]/50 bg-[#010101] px-4 py-2 text-white placeholder:text-white/40 focus:border-[#a81123] focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80">{a.phoneNumber}</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+201001234567"
              dir="ltr"
              autoComplete="tel"
              className="mt-1 w-full rounded-lg border border-[#8c7656]/50 bg-[#010101] px-4 py-2 text-white placeholder:text-white/40 focus:border-[#a81123] focus:outline-none"
              required
            />
          </div>
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
            <label className="block text-sm font-medium text-white/80">{a.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dir="ltr"
              autoComplete="new-password"
              className="mt-1 w-full rounded-lg border border-[#8c7656]/50 bg-[#010101] px-4 py-2 text-white focus:border-[#a81123] focus:outline-none"
              required
              minLength={6}
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <TapButton type="submit" className="w-full py-3" disabled={loading}>
            {loading ? a.creatingAccount : a.signUp}
          </TapButton>
        </form>
        <p className="mt-4 text-center text-sm text-white/70">
          {a.alreadyHaveAccount}{" "}
          <Link href="/login" className="font-medium text-[#a81123]">
            {copy.nav.logIn}
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
