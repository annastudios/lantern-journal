"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn() {
    if (!email.trim()) {
      setMessage("Please enter your email.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your inbox for the magic link.");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0f17] px-6 py-8 text-[#f5efe1]">
      <div className="pointer-events-none absolute inset-0 bg-[#0b0f17]" />
      <div className="pointer-events-none absolute right-[-160px] top-[-160px] h-[480px] w-[480px] rounded-full bg-[#f4d27a]/10 blur-3xl" />
      <div className="pointer-events-none absolute left-[-180px] bottom-[-180px] h-[460px] w-[460px] rounded-full bg-[#28405e]/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_430px]">
          <section className="hidden lg:block">
            <Link
              href="/"
              className="mb-12 inline-flex items-center gap-2 text-sm font-semibold text-[#c9d0db] transition hover:text-white"
            >
              <ArrowIcon className="size-4" />
              Back home
            </Link>

            <div className="max-w-xl">
              <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#f4d27a]/15 bg-[#f4d27a]/10 px-4 py-2 text-sm font-bold text-[#f4d27a]">
                <Image
                  src="/lantern.svg"
                  alt=""
                  width={42}
                  height={42}
                />
                Welcome back
              </div>

              <h1 className="text-[58px] font-semibold leading-tight text-white">
                Return to your quiet corner.
              </h1>
              <p className="mt-7 text-[20px] leading-8 text-[#c2cad4]">
                Sign in with a magic link and pick up exactly where your thoughts left off.
              </p>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-[#151a22]/90 p-7 shadow-[0_28px_80px_rgba(0,0,0,0.34)] md:p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 grid size-32 place-items-center overflow-hidden rounded-[30px] border border-[#8b6f35]/40 bg-[#111720] shadow-[0_0_56px_rgba(244,210,122,0.2)]">
                <Image
                  src="/lantern.svg"
                  alt="Lantern"
                  width={110}
                  height={110}
                  priority
                />
              </div>

              <h2 className="text-[34px] font-semibold text-white">Lantern</h2>
              <p className="mt-3 text-sm leading-6 text-[#aeb7c4]">
                Send yourself a secure magic link.
              </p>
            </div>

            <label className="mb-2 block text-sm font-semibold text-[#c7ced8]">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 w-full rounded-lg border border-white/10 bg-[#0f141c] px-4 text-white outline-none transition placeholder:text-[#657083] focus:border-[#f4d27a]/70"
            />

            <button
              type="button"
              onClick={signIn}
              disabled={loading}
              className="mt-5 h-12 w-full rounded-lg bg-[#f4c56d] text-sm font-bold !text-[#15100a] shadow-[0_14px_32px_rgba(244,197,109,0.18)] transition hover:bg-[#f8d282] disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Magic Link"}
            </button>

            {message && (
              <div className="mt-5 rounded-lg border border-white/10 bg-[#0f141c] p-4 text-sm leading-6 text-[#d4d9e2]">
                {message}
              </div>
            )}

            <Link
              href="/"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 text-sm font-semibold text-[#9aa4b2] transition hover:text-white lg:hidden"
            >
              <ArrowIcon className="size-4" />
              Back home
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
