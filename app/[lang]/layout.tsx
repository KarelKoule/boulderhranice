import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { i18n } from "@/i18n-config";
import { getDictionary } from "@/lib/getDictionary";
import { isLocale } from "@/lib/isLocale";
import "@/app/globals.css";

type Props = {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
};

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : i18n.defaultLocale;
  const dict = await getDictionary(locale);

  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
  };
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;

  return (
    <html lang={lang}>
      <body className="bg-surface-dark text-white antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
