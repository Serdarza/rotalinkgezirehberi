import { PLAY_STORE_URL, APP_STORE_URL, DOWNLOAD_PAGE_PATH } from "@/config/downloads";
import { detectDevice } from "@/lib/device";
import { hasAppDownloadClicked, markAppDownloadClicked } from "@/lib/downloadPrompt";

function toTelHref(telefon: string) {
  const digits = telefon.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : null;
}

function goToStore() {
  markAppDownloadClicked();
  const device = detectDevice(navigator.userAgent);
  if (device === "android") {
    window.location.href = PLAY_STORE_URL;
    return;
  }
  if (device === "ios") {
    window.location.href = APP_STORE_URL;
    return;
  }
  window.location.href = DOWNLOAD_PAGE_PATH;
}

/** Fiyat kilidi / iletişim: mağazaya yönlendir. */
export function redirectToAppStore() {
  goToStore();
}

const ANDROID_PACKAGE = "com.serdarza.rotalink";

/**
 * Android: uygulama yüklüyse açar, değilse Chrome fallback ile Play Store'a gider.
 * iOS: uygulamada URL şeması olmadığından App Store sayfası (yüklüyse "Aç" gösterir).
 * Masaüstü: indirme sayfası.
 */
export function openAppOrStore() {
  markAppDownloadClicked();
  const device = detectDevice(navigator.userAgent);
  if (device === "android") {
    window.location.href =
      "intent://#Intent;action=android.intent.action.MAIN;" +
      "category=android.intent.category.LAUNCHER;" +
      `package=${ANDROID_PACKAGE};` +
      `S.browser_fallback_url=${encodeURIComponent(PLAY_STORE_URL)};end`;
    return;
  }
  if (device === "ios") {
    window.location.href = APP_STORE_URL;
    return;
  }
  window.location.href = DOWNLOAD_PAGE_PATH;
}

/**
 * İletişim butonu:
 * - Uygulama henüz indirilmediyse → her zaman mağazaya yönlendir
 * - İndirme tıklanmışsa ve telefon varsa → ara
 * - İndirme tıklanmışsa ama telefon yoksa → mağaza
 */
export function handleFacilityContact(telefon?: string | null) {
  if (!hasAppDownloadClicked()) {
    goToStore();
    return;
  }

  const tel = telefon?.trim() ? toTelHref(telefon.trim()) : null;
  if (tel) {
    window.location.href = tel;
    return;
  }

  goToStore();
}
