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

  // Le compte peut avoir été supprimé depuis l'émission du jeton.
  const admin = await prisma.admin.findUnique({
    where: { id: session.sub },
    select: { email: true },
  });
  if (!admin) redirect("/admin/login");

  const pendingMessages = await prisma.contactMessage.count({ where: { handled: false } });

  return (
    <div className="flex min-h-screen flex-col bg-surface lg:flex-row">
      <AdminNav email={admin.email} pendingMessages={pendingMessages} />
      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-[1100px] px-5 py-8 md:px-8 md:py-10">{children}</div>
      </div>
    </div>
  );
}
