"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/config/downloads";
import { detectDevice, type DeviceType } from "@/lib/device";
import { QrCodeSection } from "@/components/indir/QrCodeSection";

/**
 * İndirme pop-up'larının mağaza bölümü: telefonda yalnızca cihazın mağazası,
 * masaüstünde telefonla taranacak QR kod + iki mağaza bağlantısı.
 */
export function StorePromoActions({ onStoreClick }: { onStoreClick: () => void }) {
  // Pop-up'lar yalnızca istemcide açılır; sunucu çıktısıyla uyuşmazlık oluşmaz.
  const [device] = useState<DeviceType>(() =>
    typeof navigator === "undefined" ? "desktop" : detectDevice(navigator.userAgent),
  );

  if (device === "desktop") {
    return (
      <div className="flex flex-col items-center gap-3">
        <QrCodeSection />
        <div className="flex gap-4 text-xs font-semibold">
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onStoreClick}
            className="text-slate-500 underline-offset-4 transition hover:text-[#0F62FE] hover:underline dark:text-slate-400"
          >
            Google Play
          </a>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onStoreClick}
            className="text-slate-500 underline-offset-4 transition hover:text-[#0F62FE] hover:underline dark:text-slate-400"
          >
            App Store
          </a>
        </div>
      </div>
    );
  }

  const isAndroid = device === "android";
  return (
    <a
      href={isAndroid ? PLAY_STORE_URL : APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onStoreClick}
      className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
    >
      <Download className="h-4 w-4" />
      {isAndroid ? "Google Play'den Ücretsiz İndir" : "App Store'dan Ücretsiz İndir"}
    </a>
  );
}
