"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { markAppDownloadClicked } from "@/lib/downloadPrompt";
import { openAppOrStore } from "@/lib/facilityContact";
import { STAY_ON_WEB_PARAM } from "@/lib/appLink";

const INDIR_SESSION_KEY = "rotalink_indir_redirected";

type MobileRedirectProps = {
  /** Yönlendirilecek mağaza URL'si */
  url: string;
  /** Mağaza adı (ekranda gösterilir) */
  storeName: string;
};

/**
 * Mobil cihazlarda mağazaya yönlendirme ekranı.
 * 2 saniye spinner gösterir, ardından otomatik yönlendirir.
 */
export function MobileRedirect({ url, storeName }: MobileRedirectProps) {
  const [autoRedirect, setAutoRedirect] = useState(true);
  const [returnPath, setReturnPath] = useState("/");

  useEffect(() => {
    const from = new URLSearchParams(window.location.search).get("from");
    const back = from && from.startsWith("/") && !from.startsWith("//") ? from : "/";
    setReturnPath(`${back}${back.includes("?") ? "&" : "?"}${STAY_ON_WEB_PARAM}=1`);

    // Aynı oturumda mağazadan geri dönen kullanıcıyı tekrar mağazaya atma.
    try {
      if (sessionStorage.getItem(INDIR_SESSION_KEY)) {
        setAutoRedirect(false);
        return;
      }
      sessionStorage.setItem(INDIR_SESSION_KEY, "1");
    } catch {
      // storage kapalıysa yine yönlendir
    }
    markAppDownloadClicked();
    // replace: geri tuşu /indir'e dönüp tekrar mağazaya atmasın.
    window.location.replace(url);
  }, [url]);

  return (
    <main
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6"
      role="main"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-sky-950" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-sky-400/20 blur-3xl" />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center text-center animate-fade-in-up">
        <Image
          src="/logo.png"
          alt="Rotalink"
          width={80}
          height={80}
          className="mb-8 h-20 w-20 rounded-full object-cover shadow-xl shadow-sky-500/30"
          priority
        />

        {autoRedirect && (
          <div
            className="mb-6 h-14 w-14 animate-spin rounded-full border-4 border-sky-200 border-t-sky-500 dark:border-sky-800 dark:border-t-sky-400"
            role="status"
            aria-label="Yükleniyor"
          />
        )}

        <h1 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
          {autoRedirect
            ? `${storeName}'a yönlendiriliyorsunuz`
            : "Rotalink uygulamasını indirin"}
        </h1>
        <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">
          {!autoRedirect
            ? "Kamu tesisleri, fiyatlar ve gezi rehberi uygulamada."
            : "Yönlendiriliyor..."}
        </p>

        <a
          href={url}
          onClick={() => markAppDownloadClicked()}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 dark:bg-white dark:text-slate-900"
        >
          Hemen {storeName}&apos;a git
          <span aria-hidden="true">→</span>
        </a>

        <button
          type="button"
          onClick={openAppOrStore}
          className="mt-3 rounded-2xl px-6 py-3 text-sm font-semibold text-sky-600 transition hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-slate-800"
        >
          Uygulamam var, aç
        </button>

        <a
          href={returnPath}
          className="mt-1 text-xs text-slate-400 underline-offset-2 hover:underline dark:text-slate-500"
        >
          Web sitesinde devam et
        </a>
      </div>
    </main>
  );
}
