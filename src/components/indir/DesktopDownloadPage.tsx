import Image from "next/image";
import { APP_INFO } from "@/config/downloads";
import { FeatureCards } from "./FeatureCards";
import { QrCodeSection } from "./QrCodeSection";
import { StoreButtons } from "./StoreButtons";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Masaüstü indirme sayfası — Server Component kabuğu.
 * İnteraktif parçalar (QR, tema) client bileşenlerinde.
 */
export function DesktopDownloadPage() {
  return (
    <main className="relative min-h-dvh overflow-hidden">
      {/* Animasyonlu arka plan */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-sky-950" />
      <div className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] animate-float rounded-full bg-sky-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-[400px] w-[400px] animate-float-delayed rounded-full bg-cyan-400/15 blur-3xl" />

      {/* Üst bar */}
      <header className="relative z-20 flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 shadow-md">
            <Image
              src="/logo.svg"
              alt=""
              width={40}
              height={40}
              className="h-8 w-8"
              priority
            />
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-800 dark:text-white">
            {APP_INFO.shortName}
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* Ana içerik */}
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pb-20 pt-4 sm:px-10 sm:pt-8">
        <div className="w-full animate-fade-in-up">
          {/* Glassmorphism kart */}
          <div className="overflow-hidden rounded-[2rem] border border-white/50 bg-white/50 p-8 shadow-2xl shadow-sky-500/10 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5 sm:p-12">
            <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-16">
              {/* Sol: metin + butonlar */}
              <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
                {/* Logo */}
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-sky-500 to-cyan-400 shadow-2xl shadow-sky-500/40">
                  <Image
                    src="/logo.svg"
                    alt="Rotalink logosu"
                    width={72}
                    height={72}
                    className="h-16 w-16"
                    priority
                  />
                </div>

                <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
                  {APP_INFO.name}
                </h1>

                <p className="mb-8 max-w-lg text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
                  {APP_INFO.tagline}
                </p>

                <StoreButtons className="mb-10 lg:justify-start" />

                <FeatureCards />
              </div>

              {/* Sağ: QR kod */}
              <div className="flex shrink-0 flex-col items-center lg:pt-8">
                <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Mobil İndir
                </p>
                <QrCodeSection />
              </div>
            </div>
          </div>

          {/* Alt bilgi */}
          <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} Rotalink — Türkiye&apos;nin Kamu Seyahat
            Rehberi
          </p>
        </div>
      </div>
    </main>
  );
}
