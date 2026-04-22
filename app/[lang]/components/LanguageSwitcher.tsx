"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { i18n } from "@/i18n-config";

const labels: Record<string, string> = {
  en: "EN",
  cs: "CZ",
};

export default function LanguageSwitcher() {
  const pathname = usePathname();

  function getLocalePath(locale: string) {
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  }

  const currentLocale = pathname.split("/")[1];

  return (
    <div className="flex gap-1">
      {i18n.locales.map((locale) => (
        <Link
          key={locale}
          href={getLocalePath(locale)}
          className={`rounded px-2 py-1 text-sm font-medium transition-colors ${
            currentLocale === locale
              ? "bg-accent text-white"
              : "text-stone-500 hover:text-glow"
          }`}
        >
          {labels[locale]}
        </Link>
      ))}
    </div>
  );
}
