import Image from "next/image";
import { Container, Section, GlassCard } from "@/components/ui/Section";
import { StoreButtons } from "@/components/indir/StoreButtons";
import { QrCodeSection } from "@/components/indir/QrCodeSection";
import { APP_INFO } from "@/config/downloads";

export function AppDownloadSection() {
  return (
    <Section id="indir" className="overflow-hidden bg-gradient-to-br from-[#0F62FE] to-[#14B8A6]">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="text-white">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest opacity-80">
              Mobil Uygulama
            </p>
            <h2 className="mb-4 text-3xl font-extrabold sm:text-4xl">{APP_INFO.name}</h2>
            <p className="mb-8 text-lg opacity-90">{APP_INFO.tagline}</p>
            <StoreButtons className="[&_a]:flex-1" />
          </div>

          <div className="flex flex-col items-center gap-6">
            <GlassCard className="w-full max-w-sm border-white/30 bg-white/20 p-6 text-center backdrop-blur-xl sm:p-8">
              {/* Telefon çerçevesi */}
              <div className="relative mx-auto w-[220px] sm:w-[240px]">
                <div className="relative overflow-hidden rounded-[2.4rem] border-[3px] border-slate-900 bg-slate-900 p-[3px] shadow-2xl shadow-black/40 ring-1 ring-white/20">
                  {/* Dinamik ada / notch */}
                  <div
                    className="pointer-events-none absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-slate-950"
                    aria-hidden
                  />
                  <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.1rem] bg-slate-900">
                    <Image
                      src="/app/phone-screen.png"
                      alt="Rotalink mobil uygulama ekranı — harita ve tesis arama"
                      fill
                      className="object-cover object-top"
                      sizes="240px"
                      priority={false}
                    />
                  </div>
                </div>
                {/* Alt speaker çizgisi */}
                <div
                  className="mx-auto mt-2 h-1 w-16 rounded-full bg-slate-900/40"
                  aria-hidden
                />
              </div>
            </GlassCard>

            <div className="rounded-3xl bg-white/20 p-6 backdrop-blur-xl">
              <QrCodeSection />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
