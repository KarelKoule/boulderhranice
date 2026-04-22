import type { Dictionary } from "@/lib/getDictionary";

type Props = {
  dict: Dictionary["footer"];
};

export default function Footer({ dict }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-surface-dark py-8 text-stone-500">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm sm:px-6 lg:px-8">
        <p>{dict.location}</p>
        <p className="mt-1">
          &copy; {year} Boulder Hranice. {dict.rights}
        </p>
      </div>
    </footer>
  );
}
