import "server-only";
import type { Locale } from "@/i18n-config";

const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  cs: () => import("@/dictionaries/cs.json").then((m) => m.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["en"]>>;

export function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}
