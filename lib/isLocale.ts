import { i18n, type Locale } from "@/i18n-config";

export function isLocale(lang: string): lang is Locale {
  return (i18n.locales as readonly string[]).includes(lang);
}
