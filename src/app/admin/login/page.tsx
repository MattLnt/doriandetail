import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/Icons";

import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false },
};

type PageProps = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: PageProps) {
  const { next } = await searchParams;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-dark px-5 py-12 text-on-dark">
      <Image
        src="/hero-atelier.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[58%_center]"
      />

      {/* Deux voiles superposes. Le premier assombrit l'ensemble pour que le
          texte blanc passe partout ; le second concentre l'obscurite au centre,
          derriere la carte, sans eteindre les bords de la photo. */}
      <div className="absolute inset-0 bg-dark/72" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 62% 78% at 50% 48%, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.3) 62%, rgba(10,10,10,0) 100%)",
        }}
      />

      <div className="relative z-10 w-full max-w-[400px]">
        <div className="mb-7 flex flex-col items-center text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex size-[42px] items-center justify-center overflow-hidden rounded-[11px] border border-accent/40 bg-accent-soft">
              <Image
                src="/logo.png"
                alt=""
                width={84}
                height={84}
                priority
                className="size-[52px] -translate-y-[3px] object-contain"
              />
            </span>
            <span className="text-left leading-none">
              <span className="disp block text-[19px] font-bold tracking-wide">
                DORIAN
              </span>
              <span className="block text-[11px] font-semibold tracking-[0.22em] text-on-dark-dim">
                DETAILING
              </span>
            </span>
          </Link>

          <h1 className="disp mt-6 text-[clamp(24px,3.4vw,30px)] font-bold leading-[1.15]">
            Le poste de pilotage de l&apos;atelier.
          </h1>
          <p className="mt-2.5 max-w-[320px] text-[14px] leading-relaxed text-on-dark-dim">
            Identifiez-vous pour gérer les formules, la boutique et les demandes.
          </p>
        </div>

        <LoginForm next={next} />

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-on-dark-dim transition-colors hover:text-accent"
          >
            Retour au site
            <ArrowRightIcon size={13} />
          </Link>
        </div>
      </div>
    </main>
  );
}
