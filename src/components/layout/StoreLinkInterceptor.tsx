"use client";

import { useEffect } from "react";
import { isPhoneOrMapLink } from "@/lib/appLink";
import { redirectMobileToStore } from "@/lib/facilityContact";

/**
 * Telefonda indirme ve tesis bilgisi tıklamaları doğrudan mağazayı açar:
 * `/indir`, `tel:` ve Google Haritalar / konum bağlantıları.
 * Masaüstünde bu bağlantılar normal çalışır.
 */
export function StoreLinkInterceptor() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      const downloadPage =
        url.origin === window.location.origin && /^\/indir\/?$/.test(url.pathname);
      if (!downloadPage && !isPhoneOrMapLink(url)) return;
      if (!redirectMobileToStore()) return;
      e.preventDefault();
      e.stopPropagation();
    }
    // Capture: Next.js <Link> ve harita popup'ındaki bağlantılardan önce yakalanır.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
