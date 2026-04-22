import { type NextRequest, NextResponse } from "next/server";
import { i18n } from "./i18n-config";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = i18n.locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (hasLocale) return NextResponse.next();

  const acceptLanguage = request.headers.get("accept-language");
  let preferredLocale: string = i18n.defaultLocale;

  if (acceptLanguage) {
    const lang = acceptLanguage.split(",")[0]?.split("-")[0]?.toLowerCase();
    if (lang && (i18n.locales as readonly string[]).includes(lang)) {
      preferredLocale = lang as (typeof i18n.locales)[number];
    }
  }

  request.nextUrl.pathname = `/${preferredLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
