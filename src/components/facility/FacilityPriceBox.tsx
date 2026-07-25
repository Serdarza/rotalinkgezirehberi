"use client";

import { useCallback, useEffect, useState } from "react";
import { Lock, LockOpen, PlayCircle } from "lucide-react";
import { PriceUnlockAdModal } from "@/components/facility/PriceUnlockAdModal";
import { hasAppDownloadClicked } from "@/lib/downloadPrompt";
import { redirectToAppStore } from "@/lib/facilityContact";
import {
  getPriceUnlockCredits,
  grantRewardAndUnlock,
  isFacilityPriceUnlocked,
  unlockFacilityWithCredit,
} from "@/lib/priceUnlockStore";
import { useFacilityPricing } from "@/hooks/useFacilityPricing";

type Props = {
  il: string;
  isim: string;
  className?: string;
};

function PriceRow({
  label,
  defined,
  value,
}: {
  label: string;
  defined: boolean;
  value: string | null;
}) {
  if (!defined) return null;

  return (
    <p className="flex items-center justify-between gap-2">
      <span className="font-medium text-slate-500 dark:text-slate-400">{label}</span>
      {value ? (
        <span className="font-bold tabular-nums text-slate-800 dark:text-slate-100">
          {value}
        </span>
      ) : (
        <span className="rounded-md bg-red-50 px-1.5 py-0.5 font-semibold text-red-600 dark:bg-red-950/60 dark:text-red-400">
          Kalamaz
        </span>
      )}
    </p>
  );
}

/** Flutter `FacilityOvernightPriceBox` — kilitli fiyat + indirme / reklam kilidi. */
export function FacilityPriceBox({ il, isim, className }: Props) {
  const { ready, entry, note } = useFacilityPricing(il, isim);
  const [unlocked, setUnlocked] = useState(false);
  const [credits, setCredits] = useState(0);
  const [adOpen, setAdOpen] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const syncUnlockState = useCallback(() => {
    setUnlocked(isFacilityPriceUnlocked(il, isim));
    setCredits(getPriceUnlockCredits());
    setDownloaded(hasAppDownloadClicked());
  }, [il, isim]);

  useEffect(() => {
    syncUnlockState();
  }, [syncUnlockState]);

  function handleUnlockClick() {
    // Uygulama indirmediyse → mağaza
    if (!hasAppDownloadClicked()) {
      redirectToAppStore();
      return;
    }

    // Hak varsa reklamsız aç
    if (unlockFacilityWithCredit(il, isim)) {
      syncUnlockState();
      return;
    }

    // Hak yok → reklam
    setAdOpen(true);
  }

  function handleAdUnlocked() {
    grantRewardAndUnlock(il, isim);
    setAdOpen(false);
    syncUnlockState();
  }

  if (!ready) {
    return (
      <div
        className={`mb-4 space-y-1.5 rounded-2xl bg-slate-50 px-3 py-2.5 text-xs ring-1 ring-slate-200/70 dark:bg-slate-900/60 dark:ring-slate-700 ${className ?? ""}`}
      >
        <div className="h-3 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-3 w-36 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    );
  }

  if (!entry) {
    return (
      <div
        className={`mb-4 rounded-2xl bg-slate-50 px-3 py-2.5 text-xs ring-1 ring-slate-200/70 dark:bg-slate-900/60 dark:ring-slate-700 ${className ?? ""}`}
        title={note}
      >
        <p className="font-semibold text-slate-700 dark:text-slate-200">
          Ücret bilgisi kayıtlı değil
        </p>
        <p className="mt-0.5 text-slate-500 dark:text-slate-400">
          Güncel ücreti öğrenmek için tesisi arayabilirsiniz.
        </p>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <>
        <div
          className={`mb-4 rounded-2xl bg-slate-50 px-3 py-3 text-xs ring-1 ring-slate-200/70 dark:bg-slate-900/60 dark:ring-slate-700 ${className ?? ""}`}
        >
          <div className="mb-2.5 flex items-start gap-2.5">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#0F62FE]/10 text-[#0F62FE]">
              <Lock className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="font-bold text-slate-800 dark:text-slate-100">
                Fiyat bilgisi kilitli
              </p>
              <p className="mt-0.5 leading-relaxed text-slate-500 dark:text-slate-400">
                {downloaded
                  ? credits > 0
                    ? `Kalan hakkınız: ${credits} tesis. Bu tesisin fiyatını açabilirsiniz.`
                    : "30 saniyelik reklam izleyerek 5 tesisin fiyat bilgisini açabilirsiniz."
                  : "Fiyatları görmek için Rotalink uygulamasını indirin."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleUnlockClick}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F62FE] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#0043ce]"
          >
            {downloaded ? (
              credits > 0 ? (
                <>
                  <LockOpen className="h-3.5 w-3.5" aria-hidden />
                  Fiyatları aç
                </>
              ) : (
                <>
                  <PlayCircle className="h-3.5 w-3.5" aria-hidden />
                  Reklam izle — 5 tesis hakkı
                </>
              )
            ) : (
              <>
                <Lock className="h-3.5 w-3.5" aria-hidden />
                Uygulamayı indir — fiyatları aç
              </>
            )}
          </button>
        </div>

        <PriceUnlockAdModal
          open={adOpen}
          facilityName={isim}
          onClose={() => setAdOpen(false)}
          onUnlocked={handleAdUnlocked}
        />
      </>
    );
  }

  return (
    <div
      className={`mb-4 space-y-1 rounded-2xl bg-slate-50 px-3 py-2.5 text-xs ring-1 ring-slate-200/70 dark:bg-slate-900/60 dark:ring-slate-700 ${className ?? ""}`}
      title={note}
    >
      <PriceRow
        label="Sivil misafir"
        defined={entry.fiyatSivilDefined}
        value={entry.fiyatSivil}
      />
      <PriceRow
        label="Kamu personeli"
        defined={entry.fiyatKamuDefined}
        value={entry.fiyatKamuPersoneli}
      />
      <PriceRow
        label="Kurum personeli"
        defined={entry.fiyatKurumDefined}
        value={entry.fiyatKurumPersoneli}
      />
    </div>
  );
}
