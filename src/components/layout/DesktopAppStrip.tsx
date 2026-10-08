import Image from "next/image";
import { Container } from "@/components/ui/Section";
import { StoreButtons } from "@/components/indir/StoreButtons";
import { APP_INFO } from "@/config/downloads";

/** Masaüstünde her sayfanın altında: mobil uygulama tanıtımı (mağazaya yönlendirme yok). */
export function DesktopAppStrip() {
  return (
    <section aria-label="Rotalink Mobil Uygulaması" className="hidden border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 lg:block">
      <Container className="flex items-center justify-between gap-8 py-6">
        <div className="flex items-center gap-4">
          <Image src="/logo.png" alt="" width={52} height={52} className="h-12 w-12 rounded-2xl object-cover shadow-md" />
          <div>
            <p className="text-base font-bold text-slate-900 dark:text-white">Rotalink Mobil Uygulaması</p>
            <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">{APP_INFO.tagline}</p>
          </div>
        </div>
        <StoreButtons size="default" className="!w-auto sm:!justify-end" />
      </Container>
    </section>
  );
}
