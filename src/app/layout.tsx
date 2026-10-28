import type { Metadata } from "next";
import { Nunito, Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";

// Variables volontairement generiques : changer de famille ne touche que ce
// fichier, globals.css n'a pas a connaitre leur nom.
const display = Outfit({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display-raw",
  display: "swap",
});

const sans = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans-raw",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dorian Detailing — Centre de detailing à Braine-l'Alleud",
    template: "%s | Dorian Detailing",
  },
  description:
    "Nettoyage, polissage et protection céramique réalisés à la main dans notre atelier de Braine-l'Alleud. Intervention sur rendez-vous dans tout le Brabant wallon.",
  metadataBase: new URL("https://doriandetailing.be"),
  openGraph: {
    type: "website",
    locale: "fr_BE",
    siteName: "Dorian Detailing",
    url: "/",
    images: [{ url: "/hero-atelier.jpg", width: 1290, height: 759, alt: "L'atelier Dorian Detailing à Braine-l'Alleud" }],
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: { canonical: "/" },
  // Explicite : une page publique sans directive laisse la porte ouverte aux
  // reglages par defaut d'un intermediaire (CDN, proxy).
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${sans.variable}`}>
      <body>
        {children}
        {/* Sans mesure, impossible de dire si le site manque de visiteurs ou
            de conversions : les deux se corrigent differemment. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
