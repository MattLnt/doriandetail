"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { logout } from "@/app/admin/login/actions";

const LINKS = [
  { href: "/admin", label: "Vue d'ensemble", exact: true },
  { href: "/admin/prestations", label: "Prestations" },
  { href: "/admin/options", label: "Options" },
  { href: "/admin/produits", label: "Produits" },
  { href: "/admin/rayons", label: "Rayons boutique" },
  { href: "/admin/messages", label: "Demandes" },
  { href: "/admin/reglages", label: "Réglages du site" },
];

export function AdminNav({
  email,
  pendingMessages,
}: {
  email: string;
  pendingMessages: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (link: (typeof LINKS)[number]) =>
    link.exact ? pathname === link.href : pathname.startsWith(link.href);

  return (
    <>
      {/* Barre mobile */}
      <div className="flex items-center justify-between border-b border-line bg-white px-5 py-3.5 lg:hidden">
        <Link href="/admin" className="disp text-[15px] font-bold">
          DORIAN · ADMIN
        </Link>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Fermer la navigation" : "Ouvrir la navigation"}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden
          >
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      <aside
        className={`${
          open ? "block" : "hidden"
        } border-b border-line bg-white lg:sticky lg:top-0 lg:block lg:h-screen lg:w-[244px] lg:flex-shrink-0 lg:border-b-0 lg:border-r`}
      >
        <div className="flex h-full flex-col p-5">
          <Link href="/admin" className="mb-7 hidden lg:block">
            <span className="disp block text-[16px] font-bold tracking-wide">DORIAN</span>
            <span className="block text-[10.5px] font-semibold tracking-[0.2em] text-ink-faint">
              ADMINISTRATION
            </span>
          </Link>

          <nav className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between rounded-[10px] px-3.5 py-2.5 text-[14px] font-medium transition-colors ${
                  isActive(link)
                    ? "bg-ink text-white"
                    : "text-ink-dim hover:bg-surface hover:text-ink"
                }`}
              >
                {link.label}
                {link.href === "/admin/messages" && pendingMessages > 0 && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      isActive(link) ? "bg-white/20 text-white" : "bg-accent text-accent-ink"
                    }`}
                  >
                    {pendingMessages}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="mt-6 border-t border-line pt-5 lg:mt-auto">
            <p className="mb-1 text-[11.5px] text-ink-faint">Connecté en tant que</p>
            <p className="mb-4 break-all text-[13px] font-semibold">{email}</p>
            <Link
              href="/"
              target="_blank"
              className="mb-2 block text-[13px] text-ink-dim hover:text-accent-deep"
            >
              Voir le site →
            </Link>
            <form action={logout}>
              <button type="submit" className="text-[13px] text-ink-dim hover:text-accent-deep">
                Se déconnecter
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
