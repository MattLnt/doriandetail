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
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* ── Volet photo ────────────────────────────────────────────────────
          Sur mobile il devient un bandeau court : une photo plein ecran
          repousserait le formulaire sous la ligne de flottaison. */}
      <section className="relative flex min-h-[210px] flex-col justify-end overflow-hidden bg-dark text-on-dark lg:min-h-screen">
        <Image
          src="/hero-atelier.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 52vw, 100vw"
          className="object-cover object-[58%_center]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0.93) 12%, rgba(10,10,10,0.6) 55%, rgba(10,10,10,0.42) 100%)",
          }}
        />

        <div className="relative z-10 p-7 lg:p-12">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex size-[38px] items-center justify-center overflow-hidden rounded-[10px] border border-accent/40 bg-accent-soft">
              <Image
                src="/logo.png"
                alt=""
                width={76}
                height={76}
                priority
                className="size-[46px] -translate-y-[3px] object-contain"
              />
            </span>
            <span className="leading-none">
              <span className="disp block text-[17px] font-bold tracking-wide">
                DORIAN
              </span>
              <span className="block text-[10.5px] font-semibold tracking-[0.22em] text-on-dark-dim">
                DETAILING
              </span>
            </span>
          </Link>

          <p className="disp mt-7 max-w-[420px] text-[clamp(22px,2.4vw,32px)] font-bold leading-[1.12] lg:mt-10">
            Le poste de pilotage de l&apos;atelier.
          </p>
          <p className="mt-3 hidden max-w-[360px] text-[14.5px] leading-relaxed text-on-dark-dim lg:block">
            Formules, tarifs, options, boutique et demandes de contact — tout se
            règle ici, et le site se met à jour dans la foulée.
          </p>
        </div>
      </section>

      {/* ── Volet formulaire ───────────────────────────────────────────── */}
      <section className="flex items-center justify-center bg-surface px-5 py-12 lg:px-10">
        <div className="w-full max-w-[380px]">
          <p className="eyebrow">Espace d&apos;administration</p>
          <h1 className="mb-1.5 mt-3 text-[26px] font-bold">Connexion</h1>
          <p className="mb-7 text-[14px] leading-relaxed text-ink-dim">
            Identifiez-vous pour accéder au tableau de bord.
          </p>

          <LoginForm next={next} />

          <Link
            href="/"
            className="mt-7 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-dim transition-colors hover:text-accent-deep"
          >
            Retour au site
            <ArrowRightIcon size={13} />
          </Link>
        </div>
      </section>
    </main>
  );
}
