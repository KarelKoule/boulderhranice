import type { Dictionary } from "@/lib/getDictionary";

type Props = {
  dict: Dictionary["map"];
};

export default function MapSection({ dict }: Props) {
  return (
    <section id="map" className="bg-stone-950 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {dict.title}
        </h2>
        <p className="mt-2 text-lg text-stone-400">{dict.subtitle}</p>
        <div className="mt-8 overflow-hidden rounded-xl border border-white/10">
          <iframe
            title={dict.title}
            src="https://frame.mapy.cz/zakladni?x=17.7212436&y=49.5424589&z=17&source=coor&id=17.7212436%2C49.5424589"
            width="100%"
            height="400"
            className="border-0"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>
        <a
          href="https://mapy.cz/zakladni?x=17.7212436&y=49.5424589&z=17&source=coor&id=17.7212436%2C49.5424589"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm text-accent transition-colors hover:text-accent/80"
        >
          {dict.openInMaps}
        </a>
      </div>
    </section>
  );
}
