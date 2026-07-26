"use client";

import { useEffect } from "react";

/** Kopyalamaya izin verilen alanlar: form girdileri, e-posta/telefon ve adres metinleri. */
const ALLOWED_SELECTOR =
  "input, textarea, select, [contenteditable='true'], [data-copyable], .allow-copy, address, a[href^='tel:'], a[href^='mailto:']";

function isAllowed(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest(ALLOWED_SELECTOR));
}

/**
 * Sayfa metninin toplu kopyalanmasını engeller.
 * Adres, telefon, e-posta ve form alanları bu kısıtlamanın dışındadır.
 */
export function CopyProtection() {
  useEffect(() => {
    const guard = (e: Event) => {
      if (isAllowed(e.target)) return;
      e.preventDefault();
    };

    document.addEventListener("copy", guard);
    document.addEventListener("cut", guard);
    document.addEventListener("selectstart", guard);
    document.addEventListener("dragstart", guard);

    return () => {
      document.removeEventListener("copy", guard);
      document.removeEventListener("cut", guard);
      document.removeEventListener("selectstart", guard);
      document.removeEventListener("dragstart", guard);
    };
  }, []);

  return null;
}
