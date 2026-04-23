import { type NextRequest, NextResponse } from "next/server";
import { i18n } from "./i18n-config";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  const { pathname } = request.nextUrl;

  const hasLocale = i18n.locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (hasLocale) return response;

  const acceptLanguage = request.headers.get("accept-language");
  let preferredLocale: string = i18n.defaultLocale;

  if (acceptLanguage) {
    const lang = acceptLanguage.split(",")[0]?.split("-")[0]?.toLowerCase();
    if (lang && (i18n.locales as readonly string[]).includes(lang)) {
      preferredLocale = lang as (typeof i18n.locales)[number];
    }
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|auth|_next/static|_next/image|favicon.ico|images).*)"],
};
