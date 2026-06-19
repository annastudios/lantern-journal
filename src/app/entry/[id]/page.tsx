"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

type ContentBlock =
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "image";
      alt: string;
      src: string;
    };

type EntryImage = {
  id: string;
  alt: string;
  src: string;
};

type IconName = "arrow" | "edit" | "star" | "trash" | "image" | "save" | "close";

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const common = {
    className,
    width: 22,
    height: 22,
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
    case "edit":
      return (
        <svg {...common}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <path d="m12 3.5 2.6 5.25 5.8.85-4.2 4.1 1 5.8-5.2-2.75L6.8 19.5l1-5.8-4.2-4.1 5.8-.85Z" />
        </svg>
      );
    case "trash":
      return (
        <svg {...common}>
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M19 6 18 20H6L5 6" />
          <path d="M10 11v5" />
          <path d="M14 11v5" />
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
  }
}

function parseContent(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const imagePattern = /^!\[(.*?)]\((.*?)\)$/;

  content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .forEach((block) => {
      const imageMatch = block.match(imagePattern);

      if (imageMatch) {
        blocks.push({
          type: "image",
          alt: imageMatch[1] || "Journal image",
          src: imageMatch[2],
        });
        return;
      }

      blocks.push({
        type: "paragraph",
        text: block,
      });
    });

  return blocks;
}

function splitContentAndImages(content: string) {
  const imagePattern = /^!\[(.*?)]\((.*?)\)$/;
  const textBlocks: string[] = [];
  const images: EntryImage[] = [];

  content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .forEach((block, index) => {
      const imageMatch = block.match(imagePattern);

      if (imageMatch) {
        images.push({
          id: `${index}-${imageMatch[2].slice(0, 24)}`,
          alt: imageMatch[1] || "Journal image",
          src: imageMatch[2],
        });
        return;
      }

      textBlocks.push(block);
    });

  return {
    text: textBlocks.join("\n\n"),
    images,
  };
}

function serializeContent(content: string, images: EntryImage[]) {
  const imageMarkdown = images.map((image) => `![${image.alt}](${image.src})`);
  return [content.trim(), ...imageMarkdown].filter(Boolean).join("\n\n");
}

function extractTags(content: string) {
  const tags = content.match(/#[a-z0-9_-]+/gi) ?? [];
  return Array.from(new Set(tags.map((tag) => tag.toLowerCase())));
}

function formatDateTime(createdAt: string) {
  const date = new Date(createdAt);

  return {
    date: date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
  };
}

function getReadingMood(date: Date) {
  const hour = date.getHours();

  if (hour < 12) {
    return {
      label: "Morning note",
      accent: "from-[#f4d27a]/20",
    };
  }

  if (hour < 18) {
    return {
      label: "Afternoon reflection",
      accent: "from-[#8fb7ff]/20",
    };
  }

  return {
    label: "Evening reflection",
    accent: "from-[#f4d27a]/20",
  };
}

export default function EntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<EntryImage[]>([]);
  const [createdAt, setCreatedAt] = useState("");

  const savedContent = useMemo(() => serializeContent(content, images), [content, images]);
  const contentBlocks = useMemo(() => parseContent(savedContent), [savedContent]);
  const tags = useMemo(() => extractTags(content), [content]);
  const dateTime = createdAt ? formatDateTime(createdAt) : null;
  const readingMood = createdAt ? getReadingMood(new Date(createdAt)) : null;

  useEffect(() => {
    fetchEntry();
  }, [id]);

  async function fetchEntry() {
    const { data, error } = await supabase
      .from("entries")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    if (data) {
      const parsedContent = splitContentAndImages(data.content);
      setTitle(data.title);
      setContent(parsedContent.text);
      setImages(parsedContent.images);
      setCreatedAt(data.created_at);
    }

    setLoading(false);
  }

  async function saveChanges() {
    if (!title.trim() || (!content.trim() && images.length === 0)) {
      setMessage("Title and entry content are required.");
      return;
    }

    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("entries")
      .update({
        title,
        content: savedContent,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      console.error(error);
      setMessage("Failed to save changes.");
      return;
    }

    setIsEditing(false);
  }

  async function deleteEntry() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this entry?"
    );

    if (!confirmed) return;

    const { error } = await supabase.from("entries").delete().eq("id", id);

    if (error) {
      console.error(error);
      setMessage("Failed to delete entry.");
      return;
    }

    router.push("/dashboard");
  }

  function insertFormatting(prefix: string, suffix = prefix) {
    const textarea = document.getElementById("entry-content") as HTMLTextAreaElement;

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
      const imageSource = String(reader.result);
      const imageName = file.name.replace(/\.[^.]+$/, "") || "Journal image";

      setImages((current) => [
        ...current,
        {
          id: `${Date.now()}-${file.name}`,
          alt: imageName,
          src: imageSource,
        },
      ]);
      setMessage("Image added. It will be saved with this entry.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    reader.readAsDataURL(file);
  }

  function removeImage(imageId: string) {
    setImages((current) => current.filter((image) => image.id !== imageId));
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0b0f17] text-[#a3adba]">
        Loading entry...
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0f17] px-6 py-10 text-[#f5efe1]">
      <div className="pointer-events-none absolute inset-0 bg-[#0b0f17]" />
      <div className="pointer-events-none absolute right-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-[#f4d27a]/10 blur-3xl" />
      <div className="pointer-events-none absolute left-[-160px] bottom-[-180px] h-[420px] w-[420px] rounded-full bg-[#28405e]/20 blur-3xl" />

      <div className="relative mx-auto max-w-[980px]">
        <header className="mb-12 flex items-center justify-between gap-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-3 text-[18px] font-semibold text-[#d4d9e2] transition hover:text-white"
          >
            <Icon name="arrow" className="size-6" />
            Back to entries
          </Link>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-[#d4d9e2] transition hover:text-[#f4d27a]"
              aria-label="Edit entry"
            >
              <Icon name="edit" className="size-7" />
            </button>
            <button
              type="button"
              onClick={() => setIsFavorite((current) => !current)}
              className={`transition ${
                isFavorite ? "text-[#f4d27a]" : "text-[#d4d9e2] hover:text-[#f4d27a]"
              }`}
              aria-label="Favorite entry"
            >
              <Icon
                name="star"
                className={`size-7 ${isFavorite ? "fill-[#f4d27a]" : ""}`}
              />
            </button>
            <button
              type="button"
              onClick={deleteEntry}
              className="text-[#d4d9e2] transition hover:text-red-400"
              aria-label="Delete entry"
            >
              <Icon name="trash" className="size-7" />
            </button>
          </div>
        </header>

        {!isEditing ? (
          <article className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#121820]/78 px-7 py-8 shadow-[0_28px_80px_rgba(0,0,0,0.32)] md:px-10 md:py-10">
            <div
              className={`pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b ${
                readingMood?.accent ?? "from-[#f4d27a]/20"
              } to-transparent`}
            />
            <div className="pointer-events-none absolute right-8 top-8 h-28 w-28 rounded-full border border-[#f4d27a]/10 bg-[#f4d27a]/5 blur-sm" />
            <div className="pointer-events-none absolute right-16 top-20 h-px w-36 rotate-[-18deg] bg-[#8b6f35]/30" />
            <div className="pointer-events-none absolute right-10 top-10 hidden size-24 place-items-center overflow-hidden rounded-3xl border border-[#8b6f35]/30 bg-[#111720]/70 opacity-70 shadow-[0_0_42px_rgba(244,210,122,0.18)] md:grid">
              <Image
                src="/lantern.svg"
                alt=""
                width={76}
                height={76}
              />
            </div>

            <div className="relative">
              {readingMood && (
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#f4d27a]/20 bg-[#f4d27a]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#f4d27a]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#f4d27a]" />
                  {readingMood.label}
                </div>
              )}

              <h1 className="max-w-3xl text-[42px] font-semibold leading-tight tracking-normal text-white md:text-[48px]">
                {title || "Untitled Entry"}
              </h1>

              {dateTime && (
                <p className="mt-5 text-[18px] text-[#b9c0ca] md:text-[20px]">
                  {dateTime.date}
                  <span className="mx-3 text-[#6d7480]">.</span>
                  {dateTime.time}
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-2">
                {(tags.length ? tags : ["#life"]).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-violet-500/15 px-4 py-2 text-[15px] font-semibold text-violet-300"
                  >
                    {tag.replace("#", "")}
                  </span>
                ))}
              </div>

              <div className="my-9 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="space-y-8">
                {contentBlocks.map((block, index) => {
                  if (block.type === "image") {
                    return (
                      <img
                        key={`${block.src}-${index}`}
                        src={block.src}
                        alt={block.alt}
                        className="max-h-[380px] w-full rounded-2xl border border-white/10 object-cover shadow-[0_22px_60px_rgba(0,0,0,0.32)]"
                      />
                    );
                  }

                  return (
                    <p
                      key={`${block.text}-${index}`}
                      className="max-w-[860px] whitespace-pre-wrap text-[20px] leading-[1.85] text-[#d8dee7] md:text-[21px]"
                    >
                      {block.text}
                    </p>
                  );
                })}
              </div>

              {tags.length > 0 && (
                <div className="mt-12 flex flex-wrap gap-4 border-t border-white/10 pt-7">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[18px] font-semibold text-violet-300"
                    >
                      {tag.replace("#", "# ")}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ) : (
          <section className="rounded-2xl border border-white/10 bg-[#151a22]/85 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#f4d27a]/80">
                  Lantern
                </p>
                <h1 className="mt-1 text-[28px] font-semibold text-white">
                  Edit Entry
                </h1>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-[#a3adba] transition hover:text-white"
                aria-label="Close editor"
              >
                <Icon name="close" className="size-6" />
              </button>
            </div>

            <input
              id="entry-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Give this moment a title..."
              className="mb-4 w-full border-0 bg-transparent px-2 py-3 text-[38px] font-semibold leading-tight text-white outline-none placeholder:text-[#566071]"
            />

            <div className="mb-5 flex flex-wrap items-center gap-2 border-y border-white/10 py-3 text-[#c7ced8]">
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
              <div className="mb-5">
                <p className="mb-3 text-sm text-[#a3adba]">Images</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="group relative overflow-hidden rounded-lg border border-white/10 bg-[#0f141c]"
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="h-44 w-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-[#0b0f17]/85 px-3 py-2">
                        <p className="truncate text-xs text-[#d4d9e2]">{image.alt}</p>
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="shrink-0 rounded-md border border-red-500/50 px-2 py-1 text-xs font-semibold text-red-300 transition hover:bg-red-500/10"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <textarea
              id="entry-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={16}
              placeholder="Write what happened, what you felt, or what you want to remember..."
              className="min-h-[430px] w-full resize-y rounded-xl border border-white/10 bg-[#0f141c]/85 p-5 text-[18px] leading-8 text-[#e0e5ed] outline-none transition placeholder:text-[#657083] focus:border-[#f4d27a]/60"
            />

            {message && <p className="mt-4 text-sm text-red-400">{message}</p>}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="h-11 rounded-lg border border-white/10 px-5 text-sm text-[#d4d9e2] transition hover:border-white/20"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveChanges}
                disabled={saving}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#f4c56d] px-5 text-sm font-bold !text-[#15100a] transition hover:bg-[#f8d282] disabled:opacity-60"
              >
                <Icon name="save" className="size-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
