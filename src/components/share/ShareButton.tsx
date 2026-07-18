"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, Copy, MessageCircle, Share2 } from "lucide-react";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  text?: string;
  /** Göreli path veya tam URL; boşsa mevcut sayfa */
  path?: string;
  className?: string;
  /** Küçük ikon butonu (kartlar için) */
  compact?: boolean;
};

function resolveUrl(path?: string) {
  if (typeof window === "undefined") {
    return path?.startsWith("http") ? path : `${SITE.url}${path ?? ""}`;
  }
  if (!path) return window.location.href;
  if (path.startsWith("http")) return path;
  return `${window.location.origin}${path.startsWith("/") ? path : `/${path}`}`;
}

export function ShareButton({ title, text, path, className, compact = false }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    setCanNativeShare(typeof navigator.share === "function");
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(t);
  }, [copied]);

  const shareText = text ?? title;

  async function copyLink() {
    const url = resolveUrl(path);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
    }
  }

  function shareWhatsApp() {
    const url = resolveUrl(path);
    const message = `${shareText}\n${url}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setOpen(false);
  }

  async function shareNative() {
    const url = resolveUrl(path);
    if (!navigator.share) return;
    try {
      await navigator.share({ title, text: shareText, url });
      setOpen(false);
    } catch {
      // iptal
    }
  }

  return (
    <div ref={rootRef} className={cn("relative inline-flex", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        className={cn(
          "inline-flex items-center justify-center gap-1.5 font-semibold transition",
          compact
            ? "rounded-xl bg-white px-3 py-2 text-xs text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700"
            : "rounded-2xl bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700"
        )}
      >
        <Share2 className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden />
        {!compact && <span>Paylaş</span>}
        <span className="sr-only">{compact ? "Paylaş" : undefined}</span>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 z-40 mt-2 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-slate-900"
        >
          <button
            type="button"
            role="menuitem"
            onClick={shareWhatsApp}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-emerald-50 dark:text-slate-200 dark:hover:bg-emerald-950/40"
          >
            <MessageCircle className="h-4 w-4 text-emerald-600" />
            WhatsApp
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => void copyLink()}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {copied ? (
              <Check className="h-4 w-4 text-[#14B8A6]" />
            ) : (
              <Copy className="h-4 w-4 text-[#0F62FE]" />
            )}
            {copied ? "Kopyalandı" : "Linki kopyala"}
          </button>
          {canNativeShare && (
            <button
              type="button"
              role="menuitem"
              onClick={() => void shareNative()}
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Share2 className="h-4 w-4 text-slate-500" />
              Diğer uygulamalar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
