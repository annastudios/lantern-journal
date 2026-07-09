"use client";

import Link from "next/link";

export type NavKey = "home" | "calendar" | "settings";

const navItems: { key: NavKey; label: string; href: string }[] = [
  { key: "home", label: "Home", href: "/dashboard" },
  { key: "calendar", label: "Calendar", href: "/calendar" },
  { key: "settings", label: "Settings", href: "/settings" },
];

function NavIcon({
  name,
  className = "",
}: {
  name: NavKey | "lantern" | "chevron";
  className?: string;
}) {
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

export function Sidebar({
  active,
  userEmail,
  userName,
}: {
  active: NavKey;
  userEmail: string;
  userName?: string;
}) {
  return (
    <>
      <aside className="hidden w-[230px] shrink-0 flex-col border-r border-white/10 bg-[#0c111a]/95 px-4 py-6 md:flex">
        <Link href="/dashboard" className="flex items-center gap-3 px-2">
          <span className="grid size-7 place-items-center rounded-lg bg-[#171d25] text-[#f4d27a] shadow-[0_0_18px_rgba(244,210,122,0.16)]">
            <NavIcon name="lantern" className="size-4" />
          </span>
          <span className="text-lg font-semibold text-[#f4d27a]">Lantern</span>
        </Link>

        <nav className="mt-8 space-y-1.5 text-[13px] text-[#b6bfca]">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 transition ${
                active === item.key
                  ? "bg-white/[0.055] text-[#f4d27a]"
                  : "hover:bg-white/[0.045] hover:text-white"
              }`}
            >
              <NavIcon name={item.key} className="size-4" />
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
              {userName && (
                <p className="truncate text-[13px] font-semibold text-white">
                  {userName}
                </p>
              )}
              <p className="truncate text-[11px] text-[#788391]">{userEmail}</p>
            </div>
            <NavIcon name="chevron" className="size-3 text-[#788391]" />
          </div>
        </div>
      </aside>

      <header className="flex items-center justify-between border-b border-white/10 bg-[#0c111a]/95 px-4 py-3 md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-lg bg-[#171d25] text-[#f4d27a]">
            <NavIcon name="lantern" className="size-4" />
          </span>
          <span className="text-base font-semibold text-[#f4d27a]">Lantern</span>
        </Link>
        <Link
          href="/settings"
          className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-[#f4d27a] to-[#8fb7ff] text-xs font-bold text-[#12151c]"
        >
          A
        </Link>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-white/10 bg-[#0c111a]/95 py-2 md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`flex flex-col items-center gap-1 rounded-md px-4 py-1.5 text-[11px] ${
              active === item.key ? "text-[#f4d27a]" : "text-[#b6bfca]"
            }`}
          >
            <NavIcon name={item.key} className="size-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
