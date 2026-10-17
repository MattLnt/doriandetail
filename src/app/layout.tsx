import type { Metadata } from "next";
import { Space_Grotesk, Work_Sans } from "next/font/google";

import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const sans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-work-sans",
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
