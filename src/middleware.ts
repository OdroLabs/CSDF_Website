import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { locales, defaultLocale } from "./lib/i18n";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin protection
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
  if (pathname.startsWith("/admin")) return NextResponse.next();

  // Locale prefix for public pages
  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (!hasLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|uploads|images|.*\\..*).*)",
  ],
};
