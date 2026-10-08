"use client";

import { useEffect } from "react";
import { openStoreDirect } from "@/lib/appLink";
import { markAppDownloadClicked } from "@/lib/downloadPrompt";

/**
 * Telefonda sitedeki tüm "İndir" bağlantıları (`/indir`) ara sayfa olmadan
 * doğrudan cihazın mağazasını açar. Masaüstünde `/indir` (QR + iki mağaza) kalır.
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
      if (url.origin !== window.location.origin) return;
      if (!/^\/indir\/?$/.test(url.pathname)) return;

      const { pathname, search } = window.location;
      const source = pathname.startsWith("/indir") ? "/" : pathname + search;
      if (!openStoreDirect(source, pathname)) return;
      e.preventDefault();
      e.stopPropagation();
      markAppDownloadClicked();
    }
    // Capture: Next.js <Link> istemci geçişinden önce yakalanır.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
