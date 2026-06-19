"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

type Entry = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

type IconName =
  | "home"
  | "search"
  | "book"
  | "star"
  | "tag"
  | "calendar"
  | "settings"
  | "plus"
  | "more"
  | "chevron"
  | "lantern";

const navItems: {
  label: string;
  href: string;
  icon: IconName;
  active?: boolean;
}[] = [
  { label: "Home", href: "/dashboard", icon: "home", active: true },
  { label: "Calendar", href: "/calendar", icon: "calendar" },
  { label: "Settings", href: "/settings", icon: "settings" },
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
    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      );
    case "more":
      return (
        <svg {...common}>
          <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
          <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
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

function getEntryTag(entry: Entry) {
  const text = `${entry.title} ${entry.content}`.toLowerCase();

  if (text.includes("grateful") || text.includes("gratitude")) {
    return { label: "gratitude", className: "bg-sky-500/15 text-sky-300" };
  }

  if (text.includes("memory") || text.includes("memories")) {
    return { label: "memories", className: "bg-emerald-500/15 text-emerald-300" };
  }

  if (text.includes("career") || text.includes("work") || text.includes("job")) {
    return { label: "career", className: "bg-amber-400/15 text-amber-300" };
  }

  return { label: "life", className: "bg-violet-500/15 text-violet-300" };
}

export default function DashboardPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<Entry[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("aarav@example.com");

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    const query = search.trim().toLowerCase();
    const filtered = entries.filter(
      (entry) =>
        entry.title.toLowerCase().includes(query) ||
        entry.content.toLowerCase().includes(query)
    );

    setFilteredEntries(filtered);
  }, [search, entries]);

  async function fetchEntries() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    setUserEmail(user.email ?? "aarav@example.com");

    const { data, error } = await supabase
      .from("entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setEntries(data);
      setFilteredEntries(data);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#0b0f17] text-[#f5efe1]">
      <div className="flex min-h-screen overflow-hidden border border-white/5 bg-[radial-gradient(circle_at_67%_14%,rgba(244,210,122,0.13),transparent_27%),#0b0f17]">
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
                
                <p className="truncate text-[11px] text-[#788391]">{userEmail}</p>
              </div>
              <Icon name="chevron" className="size-3 text-[#788391]" />
            </div>
          </div>
        </aside>

        <section className="relative flex-1 overflow-y-auto px-10 py-8">
          <div className="pointer-events-none absolute right-12 top-20 hidden opacity-45 xl:block">
            <div className="relative h-28 w-44">
              <div className="absolute right-16 top-5 h-24 w-px rotate-[-58deg] bg-[#8b6f35]/55" />
              <div className="absolute right-1 top-2 h-10 w-20 rounded-[50%] border-t border-[#8b6f35]/50 rotate-[-24deg]" />
              <div className="absolute right-8 top-8 h-8 w-16 rounded-[50%] border-t border-[#8b6f35]/45 rotate-[-18deg]" />
              <div className="absolute right-12 top-9 grid size-16 place-items-center overflow-hidden rounded-xl border border-[#8b6f35]/55 bg-[#15161b]/70 text-[#f4d27a]">
                <Image
                  src="/lantern.svg"
                  alt=""
                  width={58}
                  height={58}
                />
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-[950px]">
            <header className="mb-10 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-[32px] font-semibold tracking-normal text-white">
                  My Journal
                </h1>
                <p className="mt-2 text-[13px] text-[#a3adba]">
                  A space for your thoughts, memories and reflections.
                </p>
              </div>

              <div className="flex w-full items-center gap-4 md:w-auto">
                <label className="relative w-full md:w-[255px]">
                  <span className="sr-only">Search entries</span>
                  <input
                    type="text"
                    placeholder="Search entries..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="h-11 w-full rounded-lg border border-white/10 bg-[#111720] px-4 pr-10 text-[12px] text-white outline-none transition placeholder:text-[#6e7783] focus:border-[#f4d27a]/70"
                  />
                  <Icon
                    name="search"
                    className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#6e7783]"
                  />
                </label>

                <Link
                  href="/new-entry"
                  className="flex h-11 shrink-0 items-center gap-2 rounded-lg bg-[#f4c56d] px-4 text-[12px] font-bold !text-[#15100a] shadow-[0_8px_18px_rgba(244,197,109,0.18)] transition hover:bg-[#f8d282]"
                >
                  <Icon name="plus" className="size-3.5" />
                  New Entry
                </Link>
              </div>
            </header>

            {loading ? (
              <p className="text-sm text-[#a3adba]">Loading entries...</p>
            ) : filteredEntries.length === 0 ? (
              <div className="rounded-lg border border-white/10 bg-[#151a22]/85 p-12 text-center shadow-[0_18px_44px_rgba(0,0,0,0.22)]">
                <h2 className="text-2xl font-semibold text-white">No entries found</h2>
                <p className="mt-3 text-sm text-[#a3adba]">
                  Start writing your first journal entry.
                </p>
                <Link
                  href="/new-entry"
                  className="mt-7 inline-flex h-11 items-center rounded-lg bg-[#f4c56d] px-5 text-sm font-bold !text-[#15100a]"
                >
                  Create Entry
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredEntries.map((entry) => {
                  const tag = getEntryTag(entry);

                  return (
                    <Link key={entry.id} href={`/entry/${entry.id}`} className="group">
                      <article className="flex min-h-[165px] flex-col rounded-lg border border-white/10 bg-[#151a22]/90 p-5 shadow-[0_14px_34px_rgba(0,0,0,0.22)] transition duration-200 hover:-translate-y-0.5 hover:border-[#f4d27a]/50">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-[11px] text-[#8994a3]">
                            {new Date(entry.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <Icon
                            name="star"
                            className="size-4 shrink-0 text-[#a0a8b3] transition group-hover:text-[#f4d27a]"
                          />
                        </div>

                        <h2 className="mt-3 line-clamp-1 text-[17px] font-semibold text-white">
                          {entry.title}
                        </h2>

                        <p className="mt-2 line-clamp-3 text-[12px] leading-5 text-[#c2cad4]">
                          {entry.content}
                        </p>

                        <div className="mt-auto flex items-center justify-between pt-4">
                          <span className={`rounded px-2 py-1 text-[10px] ${tag.className}`}>
                            {tag.label}
                          </span>
                          <Icon name="more" className="size-4 text-[#a0a8b3]" />
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
