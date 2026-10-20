"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Phone, X } from "lucide-react";
import {
  CONTACT_PHONE_EVENT,
  type ContactPhoneDetail,
} from "@/lib/facilityContact";

type OpenState = ContactPhoneDetail & { id: number };

function phoneLines(raw: string | null | undefined): string[] {
  const text = String(raw ?? "").trim();
  if (!text || text === "-" || text.toLowerCase() === "yok") return [];
  const parts = text
    .split(/\s*(?:\/|,|;|\|| ve )\s*/i)
    .map((part) => part.trim())
    .filter((part) => /\d/.test(part));
  return parts.length ? parts : [text];
}

function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : null;
}

export function ContactPhoneModal() {
  const [open, setOpen] = useState<OpenState | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    function onOpen(event: Event) {
      const detail = (event as CustomEvent<ContactPhoneDetail>).detail ?? {};
      setCopied(null);
      setOpen({ ...detail, id: Date.now() });
    }
    window.addEventListener(CONTACT_PHONE_EVENT, onOpen);
    return () => window.removeEventListener(CONTACT_PHONE_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const lines = phoneLines(open.telefon);
  const title = open.isim?.trim() || "İletişim";

  async function copy(phone: string) {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(phone);
    } catch {
      setCopied(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-phone-title"
      data-allow-copy
      onClick={(event) => {
        if (event.target === event.currentTarget) setOpen(null);
      }}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="relative bg-gradient-to-br from-[#0F62FE] to-[#14B8A6] px-6 pb-6 pt-8 text-white">
          <button
            type="button"
            onClick={() => setOpen(null)}
            className="absolute right-4 top-4 rounded-full bg-white/20 p-2 transition hover:bg-white/30"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/80">İletişim</p>
          <h2 id="contact-phone-title" className="mt-1 pr-8 text-xl font-extrabold leading-snug">
            {title}
          </h2>
          {open.il && <p className="mt-1 text-sm text-white/90">{open.il}</p>}
        </div>

        <div className="space-y-3 px-6 py-6" data-allow-copy>
          {lines.length ? (
            lines.map((phone) => {
              const href = telHref(phone);
              return (
                <div
                  key={phone}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/70"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#14B8A6]/15 text-[#0f766e] dark:text-teal-300">
                    <Phone className="h-5 w-5" aria-hidden />
                  </span>
                  {href ? (
                    <a
                      href={href}
                      className="min-w-0 flex-1 text-lg font-bold tracking-wide text-slate-900 hover:text-[#0F62FE] dark:text-white"
                    >
                      {phone}
                    </a>
                  ) : (
                    <p className="min-w-0 flex-1 text-lg font-bold tracking-wide text-slate-900 dark:text-white">
                      {phone}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => copy(phone)}
                    className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-600"
                  >
                    {copied === phone ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#14B8A6]" aria-hidden /> Kopyalandı
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden /> Kopyala
                      </>
                    )}
                  </button>
                </div>
              );
            })
          ) : (
            <p className="rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-relaxed text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
              Bu tesis için kayıtlı bir telefon numarası yok. Numara eklendiğinde burada görünür.
            </p>
          )}
          <p className="text-xs leading-relaxed text-slate-500">
            Numara açık kaynaklardan derlenir; aramadan önce güncelliğini teyit edin. Rotalink rezervasyon yapmaz.
          </p>
          <button
            type="button"
            onClick={() => setOpen(null)}
            className="w-full rounded-xl py-2 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
