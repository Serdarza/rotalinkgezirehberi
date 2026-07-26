"use client";

import { useEffect } from "react";

/** Yalnızca kullanıcının kendi yazdığı alanlar düzenlenebilir kalır. */
const EDITABLE_SELECTOR = "input, textarea, select, [contenteditable='true']";

function isEditable(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest(EDITABLE_SELECTOR));
}

/** Sayfa içeriğinin kopyalanmasını, seçilmesini ve sürüklenmesini engeller. */
export function CopyProtection() {
  useEffect(() => {
    const guard = (e: Event) => {
      if (isEditable(e.target)) return;
      e.preventDefault();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (isEditable(e.target)) return;
      if (!e.ctrlKey && !e.metaKey) return;
      const key = e.key.toLowerCase();
      if (key === "c" || key === "x" || key === "a") {
        e.preventDefault();
      }
    };

    const clearSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;
      if (isEditable(document.activeElement)) return;
      selection.removeAllRanges();
    };

    document.addEventListener("copy", guard);
    document.addEventListener("cut", guard);
    document.addEventListener("selectstart", guard);
    document.addEventListener("dragstart", guard);
    document.addEventListener("contextmenu", guard);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("selectionchange", clearSelection);

    return () => {
      document.removeEventListener("copy", guard);
      document.removeEventListener("cut", guard);
      document.removeEventListener("selectstart", guard);
      document.removeEventListener("dragstart", guard);
      document.removeEventListener("contextmenu", guard);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("selectionchange", clearSelection);
    };
  }, []);

  return null;
}
