import { PLAY_STORE_URL, APP_STORE_URL, DOWNLOAD_PAGE_PATH } from "@/config/downloads";
import { detectDevice } from "@/lib/device";
import { hasAppDownloadClicked, markAppDownloadClicked } from "@/lib/downloadPrompt";
import { androidIntentUrl, appSchemeUrl, openStoreDirect, trackRedirect } from "@/lib/appLink";

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

/**
 * Mobil ziyaretçiyi bulunduğu sayfayı kaydederek doğrudan mağazaya gönderir.
 * Masaüstünde false döner.
 */
export function redirectMobileToStore(): boolean {
  const { pathname, search } = window.location;
  const source = pathname.startsWith("/indir") ? "/" : pathname + search;
  if (!openStoreDirect(source, pathname)) return false;
  markAppDownloadClicked();
  return true;
}

const IOS_STORE_FALLBACK_MS = 1500;

/**
 * Bulunulan sayfayı uygulamada açar.
 * Android: uygulama yüklüyse ilgili sayfa, değilse Chrome fallback ile Play Store.
 * iOS: `rotalink://open<yol>` dener; sayfa görünür kalırsa (uygulama yok / eski sürüm) App Store.
 * Masaüstü: indirme sayfası.
 */
export function openAppOrStore() {
  markAppDownloadClicked();
  const device = detectDevice(navigator.userAgent);
  const { pathname, search } = window.location;
  if (device === "android") {
    trackRedirect("android_store_redirect", pathname);
    window.location.href = androidIntentUrl(pathname + search, pathname);
    return;
  }
  if (device === "ios") {
    trackRedirect("web_to_app", pathname);
    const fallback = window.setTimeout(() => {
      if (document.visibilityState === "visible") window.location.href = APP_STORE_URL;
    }, IOS_STORE_FALLBACK_MS);
    const cancelIfAppOpened = () => {
      if (document.visibilityState === "hidden") window.clearTimeout(fallback);
    };
    document.addEventListener("visibilitychange", cancelIfAppOpened, { once: true });
    window.addEventListener("pagehide", () => window.clearTimeout(fallback), { once: true });
    window.location.href = appSchemeUrl(pathname + search);
    return;
  }
  window.location.href = DOWNLOAD_PAGE_PATH;
}

/**
 * İletişim butonu:
 * - Mobilde her zaman mağaza (telefon numarası uygulamada)
 * - Masaüstünde indirme tıklanmışsa ve telefon varsa ara, yoksa indirme sayfası
 */
export function handleFacilityContact(telefon?: string | null) {
  // Mobilde telefon bilgisi uygulamada; tıklama indirmeye gider.
  if (redirectMobileToStore()) return;

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
