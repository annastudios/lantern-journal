"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/Sidebar";
import Link from "next/link";
import Image from "next/image";

type Entry = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

type IconName = "search" | "star" | "plus" | "more";

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
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <path d="m12 3.5 2.6 5.25 5.8.85-4.2 4.1 1 5.8-5.2-2.75L6.8 19.5l1-5.8-4.2-4.1 5.8-.85Z" />
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
      <div className="flex min-h-screen flex-col overflow-hidden border border-white/5 bg-[radial-gradient(circle_at_67%_14%,rgba(244,210,122,0.13),transparent_27%),#0b0f17] md:flex-row">
        <Sidebar active="home" userEmail={userEmail} />

        <section className="relative flex-1 overflow-y-auto px-5 py-6 pb-24 md:px-10 md:py-8 md:pb-8">
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
