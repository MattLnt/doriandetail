import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getSettingsOrFallback } from "@/lib/queries";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettingsOrFallback();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader phone={settings.phone} />
      <main className="flex-1 pt-[var(--header-h)]">{children}</main>
      <SiteFooter settings={settings} />
    </div>
  );
}
