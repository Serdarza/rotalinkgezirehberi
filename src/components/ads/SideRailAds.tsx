"use client";

import { AdSenseUnit } from "./AdSenseUnit";

/**
 * Geniş ekranlarda içeriğin sol ve sağında sabit (sticky) sütun reklamlar.
 * Mobil / tablet'te gizlenir — içerik alanına dokunmaz.
 */
export function SideRailAds() {
  return (
    <>
      <aside
        className="pointer-events-none fixed bottom-0 left-0 top-20 z-20 hidden w-[140px] xl:block 2xl:w-[160px]"
        aria-label="Sol reklam sütunu"
      >
        <div className="pointer-events-auto sticky top-24 max-h-[calc(100vh-7rem)] overflow-hidden px-2">
          <AdSenseUnit variant="sidebar" />
        </div>
      </aside>
      <aside
        className="pointer-events-none fixed bottom-0 right-0 top-20 z-20 hidden w-[140px] xl:block 2xl:w-[160px]"
        aria-label="Sağ reklam sütunu"
      >
        <div className="pointer-events-auto sticky top-24 max-h-[calc(100vh-7rem)] overflow-hidden px-2">
          <AdSenseUnit variant="sidebar" />
        </div>
      </aside>
    </>
  );
}
