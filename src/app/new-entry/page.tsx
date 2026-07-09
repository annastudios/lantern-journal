"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { getRandomPrompt, writingPrompts } from "@/lib/prompts";

type EntryImage = {
  id: string;
  alt: string;
  src: string;
};

type IconName = "arrow" | "image" | "save" | "close" | "spark" | "shuffle";

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const common = {
    className,
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "arrow":
      return (
        <svg {...common}>
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
      );
    case "image":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="8" cy="10" r="1.5" />
          <path d="m21 15-5-5L5 19" />
        </svg>
      );
    case "save":
      return (
        <svg {...common}>
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
          <path d="M17 21v-8H7v8" />
          <path d="M7 3v5h8" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common}>
          <path d="m12 3 1.7 5.2L19 10l-5.3 1.8L12 17l-1.7-5.2L5 10l5.3-1.8Z" />
          <path d="M19 16v4" />
          <path d="M17 18h4" />
        </svg>
      );
    case "shuffle":
      return (
        <svg {...common}>
          <path d="m18 4 3 3-3 3" />
          <path d="M3 7h4a4 4 0 0 1 3.4 1.9l4.2 6.2A4 4 0 0 0 18 17h3" />
          <path d="m18 20 3-3-3-3" />
          <path d="M3 17h4a4 4 0 0 0 3.4-1.9l.6-.9" />
          <path d="M13.4 8.9 14 8" />
        </svg>
      );
  }
}

function serializeEntry(content: string, images: EntryImage[], tags: string[]) {
  const imageMarkdown = images.map((image) => `![${image.alt}](${image.src})`);
  const tagLine = tags.length ? tags.map((tag) => `#${tag}`).join(" ") : "";

  return [content.trim(), ...imageMarkdown, tagLine].filter(Boolean).join("\n\n");
}

export default function NewEntryPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<EntryImage[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [prompt, setPrompt] = useState(writingPrompts[0]);

  useEffect(() => {
    setPrompt(getRandomPrompt());
  }, []);

  function shufflePrompt() {
    setPrompt((current) => getRandomPrompt(current));
  }

  function usePrompt() {
    setContent((current) => (current.trim() ? current : `${prompt}\n\n`));
    textareaRef.current?.focus();
  }

  async function saveEntry() {
    if (!title.trim() || (!content.trim() && images.length === 0)) {
      setMessage("Add a title and write something, or attach an image.");
      return;
    }

    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please log in.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("entries").insert({
      title: title.trim(),
      content: serializeEntry(content, images, tags),
      user_id: user.id,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  function insertFormatting(prefix: string, suffix = prefix) {
    const textarea = textareaRef.current;

    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end);
    const nextContent =
      content.slice(0, start) + prefix + selected + suffix + content.slice(end);

    setContent(nextContent);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    });
  }

  function handleImageUpload(file: File | undefined) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please choose an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageName = file.name.replace(/\.[^.]+$/, "") || "Journal image";

      setImages((current) => [
        ...current,
        {
          id: `${Date.now()}-${file.name}`,
          alt: imageName,
          src: String(reader.result),
        },
      ]);
      setMessage("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    reader.readAsDataURL(file);
  }

  function addTag() {
    const tag = tagInput.trim().replace(/^#/, "").toLowerCase();

    if (!tag || tags.includes(tag)) {
      setTagInput("");
      return;
    }

    setTags((current) => [...current, tag]);
    setTagInput("");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0f17] px-6 py-8 text-[#f5efe1]">
      <div className="pointer-events-none absolute inset-0 bg-[#0b0f17]" />
      <div className="pointer-events-none absolute right-[-150px] top-[-160px] h-[440px] w-[440px] rounded-full bg-[#f4d27a]/10 blur-3xl" />
      <div className="pointer-events-none absolute left-[-180px] bottom-[-180px] h-[440px] w-[440px] rounded-full bg-[#28405e]/20 blur-3xl" />

      <div className="relative mx-auto max-w-[1180px]">
        <header className="mb-8 flex items-center justify-between gap-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-[16px] font-semibold text-[#d4d9e2] transition hover:text-white"
          >
            <Icon name="arrow" className="size-5" />
            Back
          </Link>

          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-[#f4d27a]/80">
              Lantern
            </p>
            <h1 className="mt-1 text-[28px] font-semibold text-white">New Entry</h1>
          </div>

          <button
            type="button"
            onClick={saveEntry}
            disabled={loading}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#f4c56d] px-5 text-sm font-bold !text-[#15100a] shadow-[0_12px_28px_rgba(244,197,109,0.18)] transition hover:bg-[#f8d282] disabled:opacity-60"
          >
            <Icon name="save" className="size-4" />
            {loading ? "Saving..." : "Save"}
          </button>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <section className="rounded-2xl border border-white/10 bg-[#151a22]/85 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
            <input
              type="text"
              placeholder="Give this moment a title..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full border-0 bg-transparent px-2 py-3 text-[38px] font-semibold leading-tight text-white outline-none placeholder:text-[#566071]"
            />

            <div className="my-4 flex flex-wrap items-center gap-2 border-y border-white/10 py-3 text-[#c7ced8]">
              <button
                type="button"
                onClick={() => insertFormatting("**")}
                className="h-9 rounded-md px-3 text-sm font-bold transition hover:bg-white/5"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => insertFormatting("_")}
                className="h-9 rounded-md px-3 text-sm italic transition hover:bg-white/5"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => setContent((current) => `${current.trimEnd()}\n\n# `)}
                className="h-9 rounded-md px-3 text-sm transition hover:bg-white/5"
              >
                H1
              </button>
              <button
                type="button"
                onClick={() => setContent((current) => `${current.trimEnd()}\n\n- `)}
                className="h-9 rounded-md px-3 text-sm transition hover:bg-white/5"
              >
                List
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="ml-auto inline-flex h-9 items-center gap-2 rounded-md border border-white/10 px-3 text-sm transition hover:border-[#f4d27a]/45 hover:bg-white/5"
              >
                <Icon name="image" className="size-4" />
                Add image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handleImageUpload(event.target.files?.[0])}
              />
            </div>

            {images.length > 0 && (
              <div className="mb-4 grid gap-3 sm:grid-cols-2">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#0f141c]"
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-48 w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-[#0b0f17]/85 px-3 py-2">
                      <p className="truncate text-xs text-[#d4d9e2]">{image.alt}</p>
                      <button
                        type="button"
                        onClick={() =>
                          setImages((current) =>
                            current.filter((item) => item.id !== image.id)
                          )
                        }
                        className="shrink-0 rounded-md border border-red-500/50 px-2 py-1 text-xs font-semibold text-red-300 transition hover:bg-red-500/10"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <textarea
              ref={textareaRef}
              placeholder="Write what happened, what you felt, or what you want to remember..."
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={17}
              className="min-h-[430px] w-full resize-y rounded-xl border border-white/10 bg-[#0f141c]/85 p-5 text-[18px] leading-8 text-[#e0e5ed] outline-none transition placeholder:text-[#657083] focus:border-[#f4d27a]/60"
            />

            {message && <p className="mt-4 text-sm text-red-300">{message}</p>}
          </section>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-white/10 bg-[#151a22]/78 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
              <div className="mb-5 grid size-20 place-items-center overflow-hidden rounded-2xl border border-[#8b6f35]/35 bg-[#111720] shadow-[0_0_38px_rgba(244,210,122,0.16)]">
                <Image
                  src="/lantern.svg"
                  alt=""
                  width={64}
                  height={64}
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[#f4d27a]">
                  <Icon name="spark" className="size-5" />
                  <h2 className="text-[17px] font-semibold text-white">Writing cue</h2>
                </div>
                <button
                  type="button"
                  onClick={shufflePrompt}
                  aria-label="Get another prompt"
                  className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/10 text-[#c7ced8] transition hover:border-[#f4d27a]/45 hover:text-[#f4d27a]"
                >
                  <Icon name="shuffle" className="size-4" />
                </button>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#aeb7c4]">{prompt}</p>
              <button
                type="button"
                onClick={usePrompt}
                className="mt-4 text-sm font-semibold text-[#f4d27a] transition hover:text-[#f8d282]"
              >
                Use this prompt
              </button>
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#151a22]/78 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
              <h2 className="text-[17px] font-semibold text-white">Tags</h2>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addTag();
                    }
                  }}
                  className="h-10 min-w-0 flex-1 rounded-lg border border-white/10 bg-[#0f141c] px-3 text-sm text-white outline-none placeholder:text-[#657083] focus:border-[#f4d27a]/60"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="h-10 rounded-lg border border-white/10 px-3 text-sm text-[#d4d9e2] transition hover:border-[#f4d27a]/45"
                >
                  Add
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {tags.length === 0 ? (
                  <p className="text-sm text-[#788391]">No tags yet.</p>
                ) : (
                  tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() =>
                        setTags((current) => current.filter((item) => item !== tag))
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-violet-500/15 px-3 py-1.5 text-sm font-semibold text-violet-300"
                    >
                      #{tag}
                      <Icon name="close" className="size-3" />
                    </button>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#151a22]/78 p-5 text-sm leading-6 text-[#aeb7c4] shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
              Images and tags save with the entry, but the editor stays clean while you write.
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
