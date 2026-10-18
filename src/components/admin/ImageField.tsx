"use client";

import { useRef, useState } from "react";

import { ImageIcon } from "@/components/Icons";

/**
 * Champ image : chemin saisi à la main (recommandé en production) ou envoi direct
 * d'un fichier (disponible en local, le stockage étant en lecture seule sur Vercel).
 */
export function ImageField({
  name = "imageUrl",
  defaultValue,
}: {
  name?: string;
  defaultValue?: string | null;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const payload = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !payload.url) {
        setError(payload.error ?? "Envoi impossible.");
        return;
      }
      setValue(payload.url);
    } catch {
      setError("Envoi impossible : vérifiez votre connexion.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label htmlFor={name} className="label">
        Image
      </label>

      <div className="flex flex-wrap items-start gap-4">
        <div className="flex h-[92px] w-[92px] flex-shrink-0 items-center justify-center overflow-hidden rounded-[12px] border border-line bg-surface-2 text-ink-faint">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon size={26} />
          )}
        </div>

        <div className="min-w-[240px] flex-1">
          <input
            id={name}
            name={name}
            type="text"
            className="field"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="/produits/mon-image.jpg"
          />
          <p className="hint">
            Chemin d&apos;un fichier placé dans <code>/public</code> (ex.{" "}
            <code>/produits/cire.jpg</code>) ou URL complète d&apos;une image externe.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void upload(file);
              }}
            />
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? "Envoi…" : "Envoyer un fichier"}
            </button>
            {value && (
              <button
                type="button"
                className="text-[13px] text-ink-dim hover:text-accent-deep"
                onClick={() => setValue("")}
              >
                Retirer l&apos;image
              </button>
            )}
          </div>

          {error && <p className="error-text">{error}</p>}
        </div>
      </div>
    </div>
  );
}
