"use client";

import { QRCodeSVG } from "qrcode.react";
import { DOWNLOAD_PAGE_URL } from "@/config/downloads";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * QR kod bölümü — /indir sayfasına yönlendirir (mobil algılama için).
 */
export function QrCodeSection() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const fgColor = mounted && resolvedTheme === "dark" ? "#f8fafc" : "#0f172a";
  const bgColor = mounted && resolvedTheme === "dark" ? "#1e293b" : "#ffffff";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-3xl border border-white/40 bg-white/60 p-5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        {mounted ? (
          <QRCodeSVG
            value={DOWNLOAD_PAGE_URL}
            size={160}
            level="M"
            fgColor={fgColor}
            bgColor={bgColor}
            aria-label={`QR kod: ${DOWNLOAD_PAGE_URL}`}
          />
        ) : (
          <div
            className="h-40 w-40 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700"
            aria-hidden="true"
          />
        )}
      </div>
      <p className="max-w-[200px] text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        Telefonunuzla tarayın, doğru mağazaya otomatik yönlendirilin
      </p>
    </div>
  );
}
