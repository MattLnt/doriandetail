import type { Metadata } from "next";
import { Nunito, Outfit } from "next/font/google";

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
  metadataBase: new URL("https://dorian-detailing.be"),
  openGraph: {
    type: "website",
    locale: "fr_BE",
    siteName: "Dorian Detailing",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
