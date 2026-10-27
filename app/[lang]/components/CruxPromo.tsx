import type { Dictionary } from "@/lib/getDictionary";

const CRUX_DOWNLOAD_URL =
  "https://play.google.com/store/apps/details?id=ca.cruxapp.twa&hl=en";

type Props = {
  dict: Dictionary["crux"];
};

export default function CruxPromo({ dict }: Props) {
  return (
    <aside
      id="crux"
      className="mx-auto mt-10 flex max-w-2xl flex-col items-center gap-6 rounded-2xl border border-white/15 bg-white/5 p-6 text-left backdrop-blur-sm sm:flex-row sm:gap-8"
    >
      <div className="flex flex-col items-center gap-3 sm:items-start">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/crux-logo.png"
            alt="Crux logo"
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-xl"
          />
          <h2 className="text-2xl font-bold text-white">{dict.title}</h2>
        </div>
        <p className="text-center text-stone-300 sm:text-left">
          {dict.description}
        </p>
        <a
          href={CRUX_DOWNLOAD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-accent px-5 py-2 font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          {dict.cta}
        </a>
      </div>
      <a
        href={CRUX_DOWNLOAD_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 rounded-xl bg-white p-3"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/crux-qr.svg"
          alt={dict.qrAlt}
          width={128}
          height={128}
          className="h-32 w-32"
        />
        <span className="mt-2 block text-center text-xs font-medium text-stone-700">
          {dict.scan}
        </span>
      </a>
    </aside>
  );
}
