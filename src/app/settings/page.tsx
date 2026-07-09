"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import Image from "next/image";

type IconName = "chevron" | "moon";

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const common = {
    className,
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "chevron":
      return (
        <svg {...common}>
          <path d="m9 18 6-6-6-6" />
        </svg>
      );
    case "moon":
      return (
        <svg {...common}>
          <path d="M20 14.2A7.2 7.2 0 0 1 9.8 4a8.5 8.5 0 1 0 10.2 10.2Z" />
        </svg>
      );
  }
}

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState("aarav@example.com");

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.email) {
      setEmail(user.email);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <main className="min-h-screen bg-[#0b0f17] text-[#f5efe1]">
      <div className="flex min-h-screen flex-col overflow-hidden border border-white/5 bg-[radial-gradient(circle_at_82%_9%,rgba(244,210,122,0.13),transparent_22%),#0b0f17] md:flex-row">
        <Sidebar active="settings" userEmail={email} userName="Aarav Sharma" />

        <section className="relative flex-1 overflow-y-auto px-5 py-6 pb-24 md:px-12 md:py-10 md:pb-10">
          <div className="pointer-events-none absolute right-0 top-0 hidden h-48 w-72 overflow-hidden opacity-70 lg:block">
            <div className="absolute right-14 top-7 h-28 w-px rotate-[-8deg] bg-[#8b6f35]/45" />
            <div className="absolute right-4 top-[52px] h-16 w-8 rounded-[50%] border-r border-[#8b6f35]/50" />
            <div className="absolute right-10 top-6 grid size-28 place-items-center overflow-hidden rounded-3xl border border-[#8b6f35]/45 bg-[#15161b]/70 text-[#f4d27a] shadow-[0_0_52px_rgba(244,210,122,0.2)]">
              <Image
                src="/lantern.svg"
                alt=""
                width={96}
                height={96}
              />
            </div>
            <div className="absolute right-[6px] top-[64px] h-14 w-16 rounded-[50%] border-t border-[#8b6f35]/45 rotate-[-64deg]" />
            <div className="absolute right-[6px] top-[94px] h-14 w-16 rounded-[50%] border-t border-[#8b6f35]/40 rotate-[-64deg]" />
            <div className="absolute right-[130px] top-[92px] h-1 w-1 rounded-full bg-[#f4d27a]" />
          </div>

          <div className="mx-auto max-w-[610px]">
            <header className="mb-9">
              <h1 className="text-[32px] font-semibold tracking-normal text-white">
                Settings
              </h1>
              <p className="mt-3 text-sm text-[#a3adba]">
                Manage your account and preferences.
              </p>
            </header>

            <div className="space-y-5">
              <section className="rounded-lg border border-white/10 bg-[#151a22]/85 p-6 shadow-[0_18px_44px_rgba(0,0,0,0.22)]">
                <h2 className="text-[16px] font-semibold text-[#f5d88a]">Account</h2>
                <div className="mt-7">
                  <p className="text-[13px] text-[#a3adba]">Email</p>
                  <p className="mt-3 text-[14px] text-[#b8c0cc]">{email}</p>
                </div>
              </section>

              <section className="rounded-lg border border-white/10 bg-[#151a22]/85 p-6 shadow-[0_18px_44px_rgba(0,0,0,0.22)]">
                <h2 className="text-[16px] font-semibold text-white">Appearance</h2>
                <div className="mt-7 flex items-center justify-between gap-4">
                  <p className="text-[13px] text-[#a3adba]">Theme</p>
                  <button
                    type="button"
                    className="flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-[#111720] px-4 text-[13px] text-[#d9dee7] transition hover:border-[#f4d27a]/45"
                  >
                    <Icon name="moon" className="size-4 text-[#f4d27a]" />
                    Dark
                    <Icon name="chevron" className="size-3 rotate-90 text-[#788391]" />
                  </button>
                </div>
              </section>

              <section className="rounded-lg border border-white/10 bg-[#151a22]/85 p-6 shadow-[0_18px_44px_rgba(0,0,0,0.22)]">
                <h2 className="text-[16px] font-semibold text-red-400">
                  Danger Zone
                </h2>
                <div className="mt-7 flex items-center justify-between gap-4">
                  <p className="text-[13px] text-[#a3adba]">
                    <span className="text-red-400">Logout</span> from your account
                  </p>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="h-10 rounded-lg border border-red-500 px-5 text-[13px] font-semibold text-red-400 transition hover:bg-red-500/10"
                  >
                    Logout
                  </button>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
