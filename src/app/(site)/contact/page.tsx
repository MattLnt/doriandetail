import type { Metadata } from "next";

import {
  ClockIcon,
  FacebookIcon,
  GoogleIcon,
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  TiktokIcon,
} from "@/components/Icons";
import { ContactForm } from "@/components/site/ContactForm";
import { prisma } from "@/lib/prisma";
import { getSettingsOrFallback } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez l'atelier Dorian Detailing à Braine-l'Alleud pour un devis ou un rendez-vous. Aucun paiement en ligne, le règlement se fait à l'atelier.",
};

type PageProps = {
  searchParams: Promise<{ prestation?: string; produit?: string }>;
};

export default async function ContactPage({ searchParams }: PageProps) {
  const [{ prestation, produit }, settings, services] = await Promise.all([
    searchParams,
    getSettingsOrFallback(),
    listServicesForForm(),
  ]);

  const telHref = `tel:${settings.phone.replace(/[^0-9+]/g, "")}`;
  const socials = [
    { href: settings.googleUrl, Icon: GoogleIcon, label: "Fiche Google" },
    { href: settings.instagram, Icon: InstagramIcon, label: "Instagram" },
    { href: settings.facebook, Icon: FacebookIcon, label: "Facebook" },
    { href: settings.tiktok, Icon: TiktokIcon, label: "TikTok" },
  ].filter((social): social is { href: string; Icon: typeof InstagramIcon; label: string } =>
    Boolean(social.href),
  );

  const defaultServiceSlug = services.some((s) => s.slug === prestation)
    ? prestation
    : undefined;
  const defaultMessage = produit
    ? `Bonjour, je souhaiterais des informations sur le produit « ${produit} ».`
    : undefined;

  return (
    <section className="py-14 md:py-16">
      <div className="shell flex flex-wrap gap-12 lg:gap-16">
        <div className="min-w-[280px] flex-1 basis-[320px]">
          <p className="eyebrow">Contact</p>
          <h1 className="mb-4 mt-3 text-[clamp(28px,3.4vw,38px)] font-bold leading-tight">
            Parlons de votre véhicule
          </h1>
          <p className="mb-8 text-[15px] leading-relaxed text-ink-dim">
            Atelier basé à Braine-l&apos;Alleud, intervention sur rendez-vous dans tout le
            Brabant wallon. Décrivez votre besoin, nous revenons vers vous avec un créneau
            et un devis confirmé.
          </p>

          <dl className="flex flex-col gap-5">
            <InfoRow Icon={PhoneIcon} label="Téléphone">
              <a href={telHref} className="hover:text-accent-deep">
                {settings.phone}
              </a>
            </InfoRow>
            <InfoRow Icon={MailIcon} label="Email">
              <a href={`mailto:${settings.email}`} className="hover:text-accent-deep">
                {settings.email}
              </a>
            </InfoRow>
            <InfoRow Icon={PinIcon} label="Atelier">
              {settings.addressLine}
              <br />
              {settings.city}
            </InfoRow>
            <InfoRow Icon={ClockIcon} label="Horaires">
              {settings.hours.split("\n").map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </InfoRow>
          </dl>

          {socials.length > 0 && (
            <div className="mt-8 flex gap-2.5">
              {socials.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-line transition-colors hover:border-accent hover:text-accent-deep"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="min-w-[300px] flex-[1.2] basis-[420px]">
          <ContactForm
            services={services}
            defaultServiceSlug={defaultServiceSlug}
            defaultMessage={defaultMessage}
          />
        </div>
      </div>
    </section>
  );
}

/**
 * Prestations proposees dans le formulaire. Une base injoignable ne doit pas
 * emporter la page : on rend la liste vide, le visiteur garde le telephone,
 * l'adresse et le champ message.
 *
 * Les options sont chargees avec les prestations : le formulaire les filtre
 * cote client a la selection, sans requete supplementaire.
 */
async function listServicesForForm() {
  try {
    return await prisma.service.findMany({
      where: { published: true },
      orderBy: { position: "asc" },
      select: {
        slug: true,
        name: true,
        options: {
          // La table de jonction n'a pas d'ordre propre : il vient de l'option.
          orderBy: { option: { position: "asc" } },
          select: {
            option: {
              select: { id: true, name: true, priceCents: true, published: true },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("[contact] prestations indisponibles", error);
    return [];
  }
}

function InfoRow({
  Icon,
  label,
  children,
}: {
  Icon: typeof PhoneIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-accent-soft text-accent-deep">
        <Icon size={17} />
      </span>
      <div>
        <dt className="mb-0.5 text-xs text-ink-faint">{label}</dt>
        <dd className="text-[14.5px] font-semibold leading-relaxed">{children}</dd>
      </div>
    </div>
  );
}
