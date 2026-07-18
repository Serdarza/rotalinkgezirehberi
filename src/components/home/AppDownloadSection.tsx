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
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest opacity-80">Mobil Uygulama</p>
            <h2 className="mb-4 text-3xl font-extrabold sm:text-4xl">{APP_INFO.name}</h2>
            <p className="mb-8 text-lg opacity-90">{APP_INFO.tagline}</p>
            <StoreButtons className="[&_a]:flex-1" />
          </div>

          <div className="flex flex-col items-center gap-6">
            <GlassCard className="w-full max-w-xs border-white/30 bg-white/20 p-8 text-center backdrop-blur-xl">
              <div className="relative mx-auto mb-4 h-[420px] w-[210px] rounded-[2.5rem] border-4 border-slate-800 bg-slate-900 p-2 shadow-2xl">
                <div className="h-full overflow-hidden rounded-[2rem] bg-gradient-to-b from-sky-400 to-[#0F62FE]">
                  <div className="flex h-full flex-col items-center justify-center p-4 text-white">
                    <Image src="/logo.svg" alt="" width={48} height={48} className="mb-4" />
                    <p className="text-center text-sm font-bold">Rotalink</p>
                    <p className="mt-2 text-center text-xs opacity-80">Kamu Seyahat Rehberi</p>
                  </div>
                </div>
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
