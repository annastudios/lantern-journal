"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/Sidebar";
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

type IconName = "chevron";

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
      <div className="flex min-h-screen flex-col overflow-hidden border border-white/5 bg-[radial-gradient(circle_at_78%_12%,rgba(244,210,122,0.14),transparent_25%),#0b0f17] md:flex-row">
        <Sidebar active="calendar" userEmail={userEmail} userName="Aarav Sharma" />

        <section className="relative flex-1 overflow-y-auto px-5 py-6 pb-24 md:px-12 md:py-10 md:pb-10">
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
