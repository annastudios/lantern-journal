"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type IconName =
  | "home"
  | "search"
  | "book"
  | "star"
  | "tag"
  | "calendar"
  | "settings"
  | "chevron"
  | "moon"
  | "lantern";

const navItems: {
  label: string;
  href: string;
  icon: IconName;
  active?: boolean;
}[] = [
  { label: "Home", href: "/dashboard", icon: "home" },
  { label: "Calendar", href: "/calendar", icon: "calendar" },
  { label: "Settings", href: "/settings", icon: "settings", active: true },
];

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
    case "home":
      return (
        <svg {...common}>
          <path d="m3 10.5 9-7 9 7" />
          <path d="M5 9.5V20h14V9.5" />
          <path d="M10 20v-6h4v6" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path d="M5 4.5h10a4 4 0 0 1 4 4V20H9a4 4 0 0 1-4-4Z" />
          <path d="M5 4.5V16a4 4 0 0 0 4 4" />
          <path d="M9 8h6" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <path d="m12 3.5 2.6 5.25 5.8.85-4.2 4.1 1 5.8-5.2-2.75L6.8 19.5l1-5.8-4.2-4.1 5.8-.85Z" />
        </svg>
      );
    case "tag":
      return (
        <svg {...common}>
          <path d="M20 13.2 13.2 20 4 10.8V4h6.8Z" />
          <circle cx="8" cy="8" r="1.2" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <path d="M7 3v4" />
          <path d="M17 3v4" />
          <path d="M4 9h16" />
          <rect x="4" y="5" width="16" height="16" rx="2" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1-2 3.4-.2-.1a1.7 1.7 0 0 0-1.8-.2 1.7 1.7 0 0 0-1 1.4v.3h-4v-.3a1.7 1.7 0 0 0-1-1.4 1.7 1.7 0 0 0-1.8.2l-.2.1-2-3.4.1-.1A1.6 1.6 0 0 0 6.2 15a1.7 1.7 0 0 0-1.2-1.1l-.3-.1v-3.6l.3-.1A1.7 1.7 0 0 0 6.2 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1 2-3.4.2.1a1.7 1.7 0 0 0 1.8.2 1.7 1.7 0 0 0 1-1.4v-.3h4v.3a1.7 1.7 0 0 0 1 1.4 1.7 1.7 0 0 0 1.8-.2l.2-.1 2 3.4-.1.1A1.6 1.6 0 0 0 19.4 9a1.7 1.7 0 0 0 1.2 1.1l.3.1v3.6l-.3.1A1.7 1.7 0 0 0 19.4 15Z" />
        </svg>
      );
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
    case "lantern":
      return (
        <svg {...common}>
          <path d="M9 3h6" />
          <path d="M10 3 8.5 7h7L14 3" />
          <path d="M8 7h8l1 13H7Z" />
          <path d="M10 16c0-2.5 2-4 2-4s2 1.5 2 4a2 2 0 0 1-4 0Z" />
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
      <div className="flex min-h-screen overflow-hidden border border-white/5 bg-[radial-gradient(circle_at_82%_9%,rgba(244,210,122,0.13),transparent_22%),#0b0f17]">
        <aside className="flex w-[230px] shrink-0 flex-col border-r border-white/10 bg-[#0c111a]/95 px-4 py-6">
          <Link href="/dashboard" className="flex items-center gap-3 px-2">
            <span className="grid size-7 place-items-center rounded-lg bg-[#171d25] text-[#f4d27a] shadow-[0_0_18px_rgba(244,210,122,0.16)]">
              <Icon name="lantern" className="size-4" />
            </span>
            <span className="text-lg font-semibold text-[#f4d27a]">Lantern</span>
          </Link>

          <nav className="mt-8 space-y-1.5 text-[13px] text-[#b6bfca]">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 transition ${
                  item.active
                    ? "bg-white/[0.055] text-[#f4d27a]"
                    : "hover:bg-white/[0.045] hover:text-white"
                }`}
              >
                <Icon name={item.icon} className="size-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t border-white/5 pt-5">
            <div className="flex items-center gap-3 rounded-lg px-2 py-2">
              <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-[#f4d27a] to-[#8fb7ff] text-sm font-bold text-[#12151c]">
                A
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-white">
                  Aarav Sharma
                </p>
                <p className="truncate text-[11px] text-[#788391]">{email}</p>
              </div>
              <Icon name="chevron" className="size-3 text-[#788391]" />
            </div>
          </div>
        </aside>

        <section className="relative flex-1 overflow-y-auto px-12 py-10">
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
