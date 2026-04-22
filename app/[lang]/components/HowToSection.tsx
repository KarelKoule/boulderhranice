import type { Dictionary } from "@/lib/getDictionary";

type Props = {
  dict: Dictionary["howTo"];
};

export default function HowToSection({ dict }: Props) {
  return (
    <section id="how-to" className="bg-surface-dark py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {dict.title}
        </h2>
        <p className="mt-4 text-lg text-stone-400">{dict.intro}</p>

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dict.steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-accent/30 hover:bg-white/10"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                {index + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-stone-400">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
