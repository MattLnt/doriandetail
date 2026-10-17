import type { Metadata } from "next";

import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false },
};

type PageProps = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: PageProps) {
  const { next } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-5 py-12">
      <div className="w-full max-w-[400px]">
        <div className="mb-7 text-center">
          <p className="disp text-[19px] font-bold tracking-wide">DORIAN DETAILING</p>
          <p className="mt-1 text-[12px] font-semibold tracking-[0.18em] text-ink-faint">
            ADMINISTRATION
          </p>
        </div>
        <LoginForm next={next} />
        <p className="mt-6 text-center text-[12.5px] text-ink-faint">
          Accès réservé à la gestion de la boutique et des prestations.
        </p>
      </div>
    </main>
  );
}
