import { PLAY_STORE_URL, APP_STORE_URL, DOWNLOAD_PAGE_PATH } from "@/config/downloads";
import { detectDevice } from "@/lib/device";
import { hasAppDownloadClicked, markAppDownloadClicked } from "@/lib/downloadPrompt";
import {
  androidIntentUrl,
  appSchemeUrl,
  mobilePlatform,
  openStoreDirect,
  playStoreUrlFor,
  trackRedirect,
} from "@/lib/appLink";
import { slugifyCity } from "@/lib/utils";

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

const IOS_STORE_FALLBACK_MS = 1500;
const ANDROID_STORE_FALLBACK_MS = 2500;

/** Fiyat kilidi / iletişim: mağazaya yönlendir. */
export function redirectToAppStore() {
  goToStore();
}

/** Tesisin uygulamadaki yolu. `ara` telefonu, `konum` haritayı açar. */
export function facilityActionPath(
  il: string,
  isim: string,
  action: "ara" | "konum"
): string {
  const base = `/tesis/${slugifyCity(il)}/${slugifyCity(isim)}/?eylem=${action}`;
  // Uygulamanın tesis listesinde olmayan yerler (belediye vb.) için harita araması.
  return action === "konum" ? `${base}&q=${encodeURIComponent(`${isim} ${il}`)}` : base;
}

/**
 * Telefonda önce uygulamayı bu yolda açar.
 * Android: yüklüyse uygulama, değilse Play Store.
 * iOS: yüklüyse uygulama, açılmazsa App Store.
 * Masaüstünde false döner.
 */
export function openInAppOrStore(pathWithQuery: string): boolean {
  const platform = mobilePlatform();
  if (!platform) return false;
  const pathOnly = pathWithQuery.split("?")[0] || "/";
  markAppDownloadClicked();
  trackRedirect("web_to_app", pathOnly);
  const android = platform === "android";
  // Uygulama içi tarayıcılar (Instagram vb.) intent fallback'ini atlayabilir.
  const fallback = window.setTimeout(
    () => {
      if (document.visibilityState !== "visible") return;
      if (android) {
        trackRedirect("android_store_redirect", pathOnly);
        window.location.href = playStoreUrlFor(pathWithQuery, pathOnly);
      } else {
        trackRedirect("ios_store_redirect", pathOnly);
        window.location.replace(APP_STORE_URL);
      }
    },
    android ? ANDROID_STORE_FALLBACK_MS : IOS_STORE_FALLBACK_MS
  );
  const cancel = () => {
    if (document.visibilityState === "hidden") window.clearTimeout(fallback);
  };
  document.addEventListener("visibilitychange", cancel, { once: true });
  window.addEventListener("pagehide", () => window.clearTimeout(fallback), { once: true });
  window.location.href = android
    ? androidIntentUrl(pathWithQuery, pathOnly)
    : appSchemeUrl(pathWithQuery);
  return true;
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
 * - Mobilde uygulamada o tesisin aramasını açar; uygulama yoksa mağaza
 * - Masaüstünde indirme tıklanmışsa ve telefon varsa ara, yoksa indirme sayfası
 */
export function handleFacilityContact(
  telefon?: string | null,
  place?: { il: string; isim: string }
) {
  const appPath =
    place?.il && place.isim
      ? facilityActionPath(place.il, place.isim, "ara")
      : `${window.location.pathname}${window.location.search}`;
  if (openInAppOrStore(appPath)) return;

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
