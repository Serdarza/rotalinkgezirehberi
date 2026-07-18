import { Container, GlassCard } from "@/components/ui/Section";
import type { SiteStats } from "@/types";

export function StatsSection({ stats }: { stats: SiteStats & { monthlyUsers: string } }) {
  const items = [
    { value: String(stats.cityCount), label: "İl" },
    { value: `${stats.facilityCount.toLocaleString("tr-TR")}+`, label: "Kamu Tesisi" },
    { value: stats.monthlyUsers, label: "Aylık Kullanıcı" },
  ];

  return (
    <section className="-mt-16 relative z-20 pb-8">
      <Container>
        <div className="grid gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <GlassCard key={item.label} className="text-center">
              <p className="text-3xl font-extrabold text-[#0F62FE] sm:text-4xl">{item.value}</p>
              <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">{item.label}</p>
            </GlassCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
