import Image from "next/image";
import Link from "next/link";

import { ClockIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/Icons";
import type { Settings } from "@/lib/queries";
import { telHref } from "@/lib/seo";

export function SiteFooter({ settings }: { settings: Settings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-dark pt-11 pb-8 text-on-dark">
      <div className="shell">
        {/* Nom, adresse, telephone : les trois informations que Google croise
            avec la fiche d'etablissement. Elles doivent figurer sur chaque
            page, pas seulement sur la page contact. */}
        <div className="grid gap-9 border-b border-dark-line pb-9 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-[30px] w-[30px] items-center justify-center overflow-hidden">
                <Image
                  src="/logo.png"
                  alt=""
                  width={60}
                  height={60}
                  className="h-[36px] w-[36px] -translate-y-[2px] object-contain"
                />
              </span>
              <span className="leading-none">
                <span className="disp block text-[15px] font-bold tracking-wide">DORIAN</span>
                <span className="block text-[9.5px] font-semibold tracking-[0.22em] text-on-dark-dim">
                  DETAILING
                </span>
              </span>
            </div>
            <p className="text-[13px] leading-relaxed text-on-dark-faint">
              Nettoyage, polissage et protection céramique à la main, en atelier à
              Braine-l&apos;Alleud et dans tout le Brabant wallon.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-[13.5px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-on-dark-faint">
              Nous joindre
            </p>
            <a
              href={telHref(settings.phone)}
              className="inline-flex items-center gap-2 font-semibold hover:text-accent"
            >
              <PhoneIcon size={14} />
              {settings.phone}
            </a>
            <a
              href={`mailto:${settings.email}`}
              className="inline-flex items-center gap-2 text-on-dark-dim hover:text-accent"
            >
              <MailIcon size={14} />
              {settings.email}
            </a>
          </div>

          <div className="flex flex-col gap-3 text-[13.5px] text-on-dark-dim">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-on-dark-faint">
              L&apos;atelier
            </p>
            <a
              href={settings.googleUrl ?? "#"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-start gap-2 hover:text-accent"
            >
              <span className="mt-[3px]">
                <PinIcon size={14} />
              </span>
              <span>
                {settings.addressLine}
                <br />
                {settings.city}
              </span>
            </a>
            <span className="inline-flex items-start gap-2">
              <span className="mt-[3px]">
                <ClockIcon size={14} />
              </span>
              <span className="whitespace-pre-line">{settings.hours}</span>
            </span>
          </div>

          <nav className="flex flex-col gap-2.5 text-[13.5px] text-on-dark-dim">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-on-dark-faint">
              Le site
            </p>
            <Link href="/prestations" className="hover:text-accent">
              Prestations
            </Link>
            <Link href="/tarifs" className="hover:text-accent">
              Tarifs
            </Link>
            <Link href="/boutique" className="hover:text-accent">
              Boutique
            </Link>
            <Link href="/contact" className="hover:text-accent">
              Contact
            </Link>
            <Link href="/mentions-legales" className="hover:text-accent">
              Mentions légales
            </Link>
          </nav>
        </div>

        <p className="pt-6 text-[12.5px] text-on-dark-faint">
          © {year} Dorian Detailing — {settings.city.replace(/^\d+\s*/, "")}
        </p>
      </div>
    </footer>
  );
}
