import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "dd_session";

/**
 * Protège /admin. La vérification complète (compte toujours existant) est refaite
 * côté serveur dans le layout admin ; ce middleware évite juste d'afficher
 * le dashboard à un visiteur sans session valide.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Purge de cookie : toujours accessible, sinon la boucle ne se casse jamais.
  if (pathname === "/admin/session-expiree") return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  let valid = false;

  if (token && process.env.AUTH_SECRET) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET));
      valid = true;
    } catch {
      valid = false;
    }
  }

  if (pathname === "/admin/login") {
    if (valid) return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.next();
  }

  if (!valid) {
    const url = new URL("/admin/login", request.url);
    if (pathname !== "/admin") url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
