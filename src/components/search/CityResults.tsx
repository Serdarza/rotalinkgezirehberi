"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Section";
import { FacilityCard } from "@/components/home/FacilitySections";
import { Breadcrumb } from "@/components/layout/PageHeader";
import type { GeziYeri, SosyalTesis, Tesis, YemekMekani } from "@/types";
import { cn } from "@/lib/utils";

type Tab = "tesis" | "gezi" | "yemek" | "sosyal";

const TABS: { key: Tab; label: string }[] = [
  { key: "tesis", label: "Tesis" },
  { key: "gezi", label: "Gezi" },
  { key: "yemek", label: "Yemek" },
  { key: "sosyal", label: "Sosyal" },
];

type Props = {
  city: string;
  data: {
    tesis: Tesis[];
    gezi: GeziYeri[];
    yemek: YemekMekani[];
    sosyal: SosyalTesis[];
  };
  tipFilter?: string;
};

export function CityResults({ city, data, tipFilter }: Props) {
  const [tab, setTab] = useState<Tab>("tesis");

  const tesis = tipFilter
    ? data.tesis.filter((t) => t.tip === tipFilter)
    : data.tesis;

  const counts = {
    tesis: tesis.length,
    gezi: data.gezi.length,
    yemek: data.yemek.length,
    sosyal: data.sosyal.length,
  };

  return (
    <Container className="py-12">
      <Breadcrumb
        items={[
          { label: "Anasayfa", href: "/" },
          { label: city },
        ]}
      />
      <h1 className="mb-2 text-3xl font-extrabold text-slate-900 dark:text-white">
        {city} — Arama Sonuçları
      </h1>
      <p className="mb-8 text-slate-600 dark:text-slate-400">
        {city} ilindeki kamu tesisleri ve gezi noktaları
        {tipFilter ? ` · ${tipFilter}` : ""}
      </p>

      <div className="mb-6 flex flex-wrap gap-2 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
              tab === t.key
                ? "bg-white text-[#0F62FE] shadow-sm dark:bg-slate-900"
                : "text-slate-600 dark:text-slate-400"
            )}
          >
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </div>

      {tab === "tesis" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tesis.length ? tesis.map((f) => <FacilityCard key={f.isim} facility={f} />) : (
            <p className="col-span-full text-slate-500">Bu kategoride sonuç bulunamadı.</p>
          )}
        </div>
      )}

      {tab === "gezi" && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {data.gezi.map((g) => (
            <li key={g.isim} className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
              <h3 className="font-bold">{g.isim}</h3>
              {g.aciklama && <p className="mt-1 text-sm text-slate-500">{g.aciklama}</p>}
            </li>
          ))}
        </ul>
      )}

      {tab === "yemek" && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {data.yemek.map((y) => (
            <li key={y.isim} className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
              <h3 className="font-bold">{y.isim}</h3>
              {y.aciklama && <p className="mt-1 text-sm text-slate-500">{y.aciklama}</p>}
            </li>
          ))}
        </ul>
      )}

      {tab === "sosyal" && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {data.sosyal.map((s) => (
            <li key={s.isim} className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
              <h3 className="font-bold">{s.isim}</h3>
              {s.aciklama && <p className="mt-1 text-sm text-slate-500">{s.aciklama}</p>}
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
