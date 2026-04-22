import type { Dictionary } from "@/lib/getDictionary";

type Props = {
  dict: Dictionary["hero"];
};

export default function HeroSection({ dict }: Props) {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center bg-surface-dark text-white">
      <div className="absolute inset-0 bg-[url('/images/hero.jpg')] bg-cover bg-center opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-surface-dark/80" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
          <span className="bg-gradient-to-r from-white via-white to-glow bg-clip-text text-transparent">
            {dict.title}
          </span>
        </h1>
        <p className="mt-4 text-xl text-stone-400 md:text-2xl">
          {dict.subtitle}
        </p>
        <a
          href="#gallery"
          className="mt-8 inline-block rounded-lg bg-accent px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-accent/30 transition-all hover:bg-accent-hover hover:shadow-accent/50"
        >
          {dict.cta}
        </a>
      </div>
    </section>
  );
}
