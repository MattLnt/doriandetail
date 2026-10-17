import { randomBytes } from "node:crypto";
import { writeFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/format";

const MAX_BYTES = 4 * 1024 * 1024; // 4 Mo

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

/**
 * Enregistre une image produit dans /public/uploads.
 *
 * Attention : sur Vercel le système de fichiers est en lecture seule à l'exécution.
 * En production, déposez les visuels dans /public/produits puis déployez, et saisissez
 * leur chemin dans le champ « Image » — ou renseignez une URL externe.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  if (process.env.VERCEL) {
    return NextResponse.json(
      {
        error:
          "L'envoi de fichiers n'est pas disponible en production : le stockage est en lecture seule. Déposez l'image dans /public/produits, redéployez, puis saisissez son chemin — ou collez une URL externe.",
      },
      { status: 501 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Fichier trop volumineux (4 Mo maximum)." },
      { status: 413 },
    );
  }

  const extension = EXTENSIONS[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Format non pris en charge. Utilisez JPG, PNG, WebP ou AVIF." },
      { status: 415 },
    );
  }

  // Nom reconstruit de zéro : le nom d'origine n'est jamais utilisé comme chemin.
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";
  const filename = `${base}-${randomBytes(4).toString("hex")}.${extension}`;
  const target = path.join(process.cwd(), "public", "uploads", filename);

  try {
    await writeFile(target, Buffer.from(await file.arrayBuffer()));
  } catch (error) {
    console.error("[upload] écriture impossible", error);
    return NextResponse.json(
      { error: "Enregistrement impossible sur le serveur." },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: `/uploads/${filename}` });
}
