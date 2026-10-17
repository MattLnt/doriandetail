import Image from "next/image";
import Link from "next/link";

import type { Settings } from "@/lib/queries";

export function SiteFooter({ settings }: { settings: Settings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-line py-9">
      <div className="shell flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-[30px] w-[30px] items-center justify-center overflow-hidden rounded-lg bg-accent-soft">
            <Image
              src="/logo.png"
              alt=""
              width={60}
              height={60}
              className="h-[36px] w-[36px] -translate-y-[2px] object-contain"
            />
          </span>
          <span className="text-[13px] text-ink-faint">
            © {year} Dorian Detailing — {settings.city.replace(/^\d+\s*/, "")}
          </span>
        </div>

        <nav className="flex flex-wrap gap-6 text-[13px] text-ink-dim">
          <Link href="/prestations">Prestations</Link>
          <Link href="/tarifs">Tarifs</Link>
          <Link href="/boutique">Boutique</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/admin" className="text-ink-faint">
            Administration
          </Link>
        </nav>
      </div>
    </footer>
  );
}
