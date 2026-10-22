import Link from "next/link";

/**
 * Affiche a la place d'une liste vide quand la base est injoignable. Sans ce
 * bloc, la page garderait son titre et ses explications au-dessus d'un trou,
 * et le visiteur croirait que l'atelier ne propose plus rien.
 */
export function ContentUnavailable({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[14px] border border-line bg-surface px-6 py-10 text-center">
      <p className="mb-1.5 text-[15px] font-semibold">{children}</p>
      <p className="text-[14px] leading-relaxed text-ink-dim">
        Nous rétablissons l&apos;affichage au plus vite. En attendant,{" "}
        <Link href="/contact" className="font-semibold text-accent-deep hover:underline">
          contactez-nous
        </Link>{" "}
        : nous répondons à toutes les demandes par téléphone et par email.
      </p>
    </div>
  );
}
