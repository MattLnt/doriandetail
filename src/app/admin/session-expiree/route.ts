import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/lib/auth";

/**
 * Purge le cookie de session puis renvoie vers la connexion.
 *
 * Indispensable pour casser la boucle de redirections : un jeton signe reste
 * valide pour le middleware meme si le compte admin a disparu de la base. Le
 * layout du dashboard ne peut pas supprimer de cookie pendant son rendu, il
 * redirige donc ici.
 */
export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
