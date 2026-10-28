"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ArrowRightIcon, PhoneIcon } from "@/components/Icons";
import { telHref } from "@/lib/seo";

const NAV = [
  { href: "/prestations", label: "Prestations" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/boutique", label: "Boutique" },
  { href: "/#avis", label: "Avis" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ phone }: { phone: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Seul l'accueil ouvre sur un hero sombre : ailleurs, le haut de page est
  // clair et l'en-tete doit rester pleine, sinon elle serait illisible.
  const overlay = pathname === "/";

  useEffect(() => {
    if (!overlay) {
      setScrolled(false);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  // Transparente uniquement posee sur le hero, en haut, menu ferme.
  const solid = !overlay || scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 w-full text-on-dark transition-colors duration-300 ${
        solid
          ? "border-b border-dark-line bg-dark/92 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="shell flex items-center justify-between gap-6 py-4">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          {/* Le logo fourni inclut le mot-clé sous le monogramme : on recadre
              sur le monogramme, le nom étant déjà écrit à côté. */}
          <span className="flex h-[38px] w-[38px] items-center justify-center overflow-hidden">
            <Image
              src="/logo.png"
              alt=""
              width={76}
              height={76}
              priority
              className="h-[46px] w-[46px] -translate-y-[3px] object-contain"
            />
          </span>
          <span className="leading-none">
            <span className="disp block text-[17px] font-bold tracking-wide">DORIAN</span>
            <span className="block text-[10.5px] font-semibold tracking-[0.22em] text-on-dark-dim">
              DETAILING
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-on-dark-dim lg:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-accent">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Appeler reste la premiere action : sur mobile, le bouton est a
            cote du menu, jamais replie dedans. */}
        <div className="flex items-center gap-2.5">
          <a
            href={telHref(phone)}
            className="btn btn-accent inline-flex"
            aria-label={`Appeler le ${phone}`}
          >
            <PhoneIcon size={15} />
            <span className="hidden sm:inline">{phone}</span>
            <span className="sm:hidden">Appeler</span>
          </a>

          <Link href="/contact" className="btn btn-ghost-dark hidden lg:inline-flex">
            Devis gratuit
            <ArrowRightIcon size={15} />
          </Link>

          <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-dark-line lg:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <svg
            width="20"
            height="20"
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
      </div>

      {open && (
        <nav className="border-t border-dark-line bg-dark lg:hidden">
          <div className="shell flex flex-col py-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-dark-line py-3.5 text-[15px] font-medium text-on-dark-dim last:border-0"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="btn btn-accent my-4"
              onClick={() => setOpen(false)}
            >
              Nous contacter
              <ArrowRightIcon size={15} />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
