"use client";

import { useEffect, useState } from "react";
import { MOBILE_REDIRECT_DELAY_MS } from "@/config/downloads";

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
  const [secondsLeft, setSecondsLeft] = useState(
    Math.ceil(MOBILE_REDIRECT_DELAY_MS / 1000)
  );

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      window.location.href = url;
    }, MOBILE_REDIRECT_DELAY_MS);

    const countdownInterval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(countdownInterval);
    };
  }, [url]);

  return (
    <main
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6"
      role="main"
      aria-live="polite"
      aria-busy="true"
    >
      {/* Arka plan */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-sky-950" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-sky-400/20 blur-3xl" />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center text-center animate-fade-in-up">
        {/* Logo */}
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-400 shadow-xl shadow-sky-500/30">
          <span className="text-3xl font-extrabold text-white" aria-hidden="true">
            R
          </span>
        </div>

        {/* Spinner */}
        <div
          className="mb-6 h-14 w-14 animate-spin rounded-full border-4 border-sky-200 border-t-sky-500 dark:border-sky-800 dark:border-t-sky-400"
          role="status"
          aria-label="Yükleniyor"
        />

        <h1 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
          {storeName}&apos;a yönlendiriliyorsunuz
        </h1>
        <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">
          {secondsLeft > 0
            ? `${secondsLeft} saniye içinde otomatik yönlendirileceksiniz`
            : "Yönlendiriliyor..."}
        </p>

        {/* Manuel yedek bağlantı */}
        <a
          href={url}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 dark:bg-white dark:text-slate-900"
        >
          Hemen {storeName}&apos;a git
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </main>
  );
}
