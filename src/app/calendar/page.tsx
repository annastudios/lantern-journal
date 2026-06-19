"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import Calendar from "react-calendar";
import Link from "next/link";
import Image from "next/image";

import "./calendar.css";

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
  | "more"
  | "chevron"
  | "lantern";

const navItems: {
  label: string;
  href: string;
  icon: IconName;
  active?: boolean;
}[] = [
  { label: "Home", href: "/dashboard", icon: "home" },
  { label: "Calendar", href: "/calendar", icon: "calendar", active: true },
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

function getDateKey(date: Date) {
  return date.toDateString();
}

function getEntryTag(entry: Entry) {
  const text = `${entry.title} ${entry.content}`.toLowerCase();

  if (text.includes("grateful") || text.includes("gratitude")) {
    return { label: "gratitude", className: "text-sky-300" };
  }

  if (text.includes("memory") || text.includes("memories")) {
    return { label: "memories", className: "text-emerald-300" };
  }

  if (text.includes("career") || text.includes("work") || text.includes("job")) {
    return { label: "career", className: "text-amber-300" };
  }

  return { label: "life", className: "text-violet-300" };
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("aarav@example.com");

  useEffect(() => {
    fetchEntries();
  }, []);

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
      .order("created_at", {
        ascending: false,
      });

    if (!error && data) {
      setEntries(data);
    }

    setLoading(false);
  }

  const entryCountsByDate = useMemo(() => {
    return entries.reduce<Record<string, number>>((counts, entry) => {
      const key = getDateKey(new Date(entry.created_at));
      counts[key] = (counts[key] ?? 0) + 1;
      return counts;
    }, {});
  }, [entries]);

  const selectedDateString = getDateKey(selectedDate);
  const filteredEntries = entries.filter(
    (entry) => getDateKey(new Date(entry.created_at)) === selectedDateString
  );

  return (
    <main className="min-h-screen bg-[#0b0f17] text-[#f5efe1]">
      <div className="flex min-h-screen overflow-hidden border border-white/5 bg-[radial-gradient(circle_at_78%_12%,rgba(244,210,122,0.14),transparent_25%),#0b0f17]">
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
                <p className="truncate text-[11px] text-[#788391]">{userEmail}</p>
              </div>
              <Icon name="chevron" className="size-3 text-[#788391]" />
            </div>
          </div>
        </aside>

        <section className="relative flex-1 overflow-y-auto px-12 py-10">
          <div className="pointer-events-none absolute right-0 top-0 hidden h-56 w-[430px] overflow-hidden xl:block">
            <div className="absolute right-10 top-7 text-[#f4c56d]">
              <div className="h-12 w-12 rounded-full bg-[#f4c56d]" />
              <div className="absolute left-5 top-[-4px] h-12 w-12 rounded-full bg-[#0b0f17]" />
            </div>
            <div className="absolute right-7 top-20 h-24 w-72 rounded-t-[60%] bg-[#2a2e31]/60 blur-[1px]" />
            <div className="absolute right-36 top-28 h-14 w-40 rounded-t-[70%] bg-[#3a3228]/70" />
            <div className="absolute right-[308px] top-16 h-1 w-1 rounded-full bg-[#f4d27a]" />
            <div className="absolute right-[148px] top-7 h-1 w-1 rounded-full bg-[#f4d27a]" />
            <div className="absolute right-[84px] top-[60px] h-1 w-1 rounded-full bg-[#f4d27a]" />
            <div className="absolute right-20 top-[82px] grid size-24 place-items-center overflow-hidden rounded-2xl border border-[#8b6f35]/55 bg-[#15161b]/70 text-[#f4d27a] shadow-[0_0_44px_rgba(244,210,122,0.16)]">
              <Image
                src="/lantern.svg"
                alt=""
                width={76}
                height={76}
              />
            </div>
          </div>

          <div className="mx-auto max-w-[910px]">
            <header className="mb-16">
              <h1 className="text-[32px] font-semibold tracking-normal text-white">
                Calendar
              </h1>
              <p className="mt-3 text-sm text-[#a3adba]">
                Browse your memories by date.
              </p>
            </header>

            <div className="grid items-start gap-10 lg:grid-cols-[390px_1fr]">
              <section className="rounded-lg border border-white/10 bg-[#151a22]/82 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.24)]">
                <Calendar
                  onChange={(value) => {
                    if (value instanceof Date) {
                      setSelectedDate(value);
                    }
                  }}
                  value={selectedDate}
                  prev2Label={null}
                  next2Label={null}
                  tileContent={({ date, view }) => {
                    const count = entryCountsByDate[getDateKey(date)];

                    if (view !== "month" || !count) {
                      return null;
                    }

                    return <span className="entry-dot" aria-hidden="true" />;
                  }}
                />
              </section>

              <section className="pt-8">
                <h2 className="text-[22px] font-semibold text-white">
                  {selectedDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h2>
                <p className="mt-3 text-sm text-[#a3adba]">
                  {filteredEntries.length}{" "}
                  {filteredEntries.length === 1 ? "Entry" : "Entries"}
                </p>

                <div className="mt-7 space-y-4">
                  {loading ? (
                    <p className="text-sm text-[#a3adba]">Loading entries...</p>
                  ) : filteredEntries.length === 0 ? (
                    <div className="rounded-lg border border-white/10 bg-[#151a22]/82 p-5 text-sm text-[#a3adba]">
                      No entries on this day.
                    </div>
                  ) : (
                    filteredEntries.map((entry) => {
                      const tag = getEntryTag(entry);

                      return (
                        <Link
                          key={entry.id}
                          href={`/entry/${entry.id}`}
                          className="group block"
                        >
                          <article className="rounded-lg border border-white/10 bg-[#151a22]/92 p-5 shadow-[0_12px_30px_rgba(0,0,0,0.2)] transition hover:border-[#f4d27a]/50">
                            <div className="flex items-center justify-between gap-4">
                              <div className="min-w-0">
                                <h3 className="truncate text-[15px] font-semibold text-white">
                                  {entry.title}
                                </h3>
                                <p className="mt-4 text-[13px] text-[#a3adba]">
                                  {new Date(entry.created_at).toLocaleTimeString(
                                    "en-US",
                                    {
                                      hour: "numeric",
                                      minute: "2-digit",
                                    }
                                  )}{" "}
                                  <span className="px-1 text-[#596272]">.</span>
                                  <span className={tag.className}>{tag.label}</span>
                                </p>
                              </div>
                              <Icon
                                name="chevron"
                                className="size-4 shrink-0 text-[#a0a8b3] transition group-hover:text-[#f4d27a]"
                              />
                            </div>
                          </article>
                        </Link>
                      );
                    })
                  )}
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
