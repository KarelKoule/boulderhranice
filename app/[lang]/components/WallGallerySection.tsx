import Image from "next/image";
import type { Dictionary } from "@/lib/getDictionary";
import { GALLERY_SECTIONS } from "@/lib/gallerySections";
import ImageLightbox from "./ImageLightbox";

type Props = {
  dict: Dictionary["gallery"];
};

export default function WallGallerySection({ dict }: Props) {
  return (
    <section id="gallery" className="bg-stone-950 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {dict.title}
        </h2>
        <p className="mt-4 text-lg text-stone-400">{dict.subtitle}</p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {GALLERY_SECTIONS.map(({ key, image }) => (
            <div
              key={key}
              className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all hover:border-glow/30"
            >
              <ImageLightbox src={image} alt={dict.sections[key]}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={image}
                    alt={dict.sections[key]}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 50vw"
                    quality={75}
                  />
                </div>
              </ImageLightbox>
              <div className="px-5 py-3">
                <p className="text-sm font-medium text-stone-300">
                  {dict.sections[key]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
