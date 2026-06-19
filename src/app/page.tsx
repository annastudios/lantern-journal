import Image from "next/image";
import Link from "next/link";

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <span
      className={`absolute h-1 w-1 rounded-full bg-[#f4d27a] shadow-[0_0_14px_rgba(244,210,122,0.9)] ${className}`}
    />
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0f17] text-[#f5efe1]">
      <div className="pointer-events-none absolute inset-0 bg-[#0b0f17]" />
      <div className="pointer-events-none absolute right-[-160px] top-[-170px] h-[520px] w-[520px] rounded-full bg-[#f4d27a]/10 blur-3xl" />
      <div className="pointer-events-none absolute left-[-180px] bottom-[-190px] h-[520px] w-[520px] rounded-full bg-[#28405e]/20 blur-3xl" />

      <Sparkle className="left-[18%] top-[22%]" />
      <Sparkle className="right-[26%] top-[17%]" />
      <Sparkle className="right-[18%] top-[34%]" />
      <Sparkle className="left-[36%] bottom-[24%]" />

      <section className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_420px]">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#f4d27a]/15 bg-[#f4d27a]/10 px-4 py-2 text-sm font-bold text-[#f4d27a]">
              <Image
                src="/lantern.svg"
                alt=""
                width={42}
                height={42}
              />
              Private journaling for quiet moments
            </div>

            <h1 className="text-[58px] font-semibold leading-[1.04] tracking-normal text-white md:text-[76px]">
              Lantern
            </h1>

            <p className="mt-7 max-w-xl text-[21px] leading-8 text-[#c2cad4]">
              A warm place to catch your thoughts, remember small details, and return to yourself at the end of the day.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/login"
                className="inline-flex h-12 items-center rounded-lg bg-[#f4c56d] px-6 text-sm font-bold !text-[#15100a] shadow-[0_14px_32px_rgba(244,197,109,0.2)] transition hover:bg-[#f8d282]"
              >
                Begin Writing
              </Link>
              <p className="text-sm text-[#8994a3]">
                No feed. No pressure. Just your words.
              </p>
            </div>
          </div>

          <div className="relative hidden min-h-[520px] lg:block">
            <div className="absolute inset-x-8 bottom-12 h-28 rounded-[50%] bg-[#05070b]/70 blur-2xl" />
            <div className="absolute right-2 top-8 h-72 w-72 rounded-full bg-[#f4d27a]/10 blur-3xl" />
            <div className="absolute bottom-20 right-12 h-64 w-72 rounded-[36px] border border-white/10 bg-[#121820]/80 p-8 shadow-[0_34px_90px_rgba(0,0,0,0.4)]">
              <div className="absolute -top-20 left-1/2 grid size-52 -translate-x-1/2 place-items-center overflow-hidden rounded-[40px] border border-[#8b6f35]/40 bg-[#15161b]/90 shadow-[0_0_72px_rgba(244,210,122,0.24)]">
                <Image
                  src="/lantern.svg"
                  alt="Lantern"
                  width={154}
                  height={154}
                  priority
                />
              </div>
              <div className="mt-20 space-y-4">
                <div className="h-3 w-36 rounded-full bg-white/15" />
                <div className="h-3 w-full rounded-full bg-white/10" />
                <div className="h-3 w-4/5 rounded-full bg-white/10" />
              </div>
              <div className="mt-8 rounded-xl border border-[#f4d27a]/15 bg-[#f4d27a]/10 p-4 text-sm leading-6 text-[#f0dca0]">
                Today felt softer when I finally wrote it down.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
