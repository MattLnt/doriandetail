import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminNav } from "@/components/admin/AdminNav";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: { default: "Administration", template: "%s | Admin Dorian Detailing" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // Pas de session : la page de connexion est rendue hors de cette coquille.
  // Le middleware a déjà redirigé, ce garde-fou couvre les accès directs.
  if (!session) redirect("/admin/login");

  // Le compte peut avoir été supprimé depuis l'émission du jeton. Dans ce cas
  // le cookie reste valide aux yeux du middleware : rediriger vers la
  // connexion boucle a l'infini. On passe par la route qui purge le cookie.
  const admin = await prisma.admin.findUnique({
    where: { id: session.sub },
    select: { email: true },
  });
  if (!admin) redirect("/admin/session-expiree");

  const pendingMessages = await prisma.contactMessage.count({ where: { handled: false } });

  return (
    // admin-dark redefinit les jetons de couleur pour tout ce qui est en
    // dessous : voir le bloc « Dashboard en sombre » dans globals.css.
    // admin-frame peint le liseret degrade ; la marge l'ecarte du bord de
    // l'ecran, sans quoi il serait colle a la fenetre et invisible.
    <div className="admin-dark min-h-screen bg-surface p-2.5 text-ink sm:p-4">
      {/* overflow-hidden casse position: sticky. La barre laterale n'est donc
          plus collante : sur grand ecran le cadre occupe la hauteur de la
          fenetre, la barre la remplit, et c'est le contenu qui defile. */}
      <div className="admin-frame min-h-[calc(100vh-1.25rem)] rounded-[22px] sm:min-h-[calc(100vh-2rem)] lg:h-[calc(100vh-2rem)] lg:min-h-0">
        <div className="flex min-h-[inherit] flex-col overflow-hidden rounded-[21px] bg-surface lg:h-full lg:flex-row">
          <AdminNav email={admin.email} pendingMessages={pendingMessages} />
          <div className="admin-gradient-bg min-w-0 flex-1 lg:overflow-y-auto">
            <div className="mx-auto max-w-[1100px] px-5 py-8 md:px-8 md:py-10">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
