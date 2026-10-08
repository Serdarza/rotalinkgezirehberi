"use client";

import { useEffect } from "react";

/**
 * Uygulama paylaşım linkleri (`/tesis/<il>/<tesis>`) ve kısa şehir linkleri
 * (`/kayseri`) web'de sayfa değildir; tarayıcıda kalan ziyaretçiyi (masaüstü,
 * `?web=1`) mevcut şehir sayfasına taşır. Telefonda `<head>` betiği bundan
 * önce uygulamaya / mağazaya yönlendirir.
 */
export function AppPathRedirect({ citySlugs }: { citySlugs: string[] }) {
  useEffect(() => {
    const segs = window.location.pathname.split("/").filter(Boolean).map(decodeURIComponent);
    let city: string | null = null;
    let facility: string | null = null;
    if (segs[0] === "tesis" && segs[1]) {
      city = segs[1].toLowerCase();
      facility = segs[2] ? segs[2].toLowerCase().replace(/-/g, " ") : null;
    } else if (segs.length === 1) city = segs[0].toLowerCase();
    if (city && citySlugs.includes(city)) {
      const q = facility ? `?q=${encodeURIComponent(facility)}` : "";
      window.location.replace(`/sehir/${city}/${q}`);
    }
  }, [citySlugs]);
  return null;
}
