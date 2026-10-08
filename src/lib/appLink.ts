import { APP_STORE_URL } from "@/config/downloads";
import { LEGAL_PAGES } from "@/config/legal";

/**
 * Web → uygulama yönlendirme kuralları (tek merkez).
 *
 * - Doğrulanmış linkler (Android App Links / iOS Universal Links) yalnızca
 *   `/sehir/*` ve `/tesis/*` yollarını kapsar; bkz. `public/.well-known/`.
 * - Sayfa tarayıcıda açılmışsa (uygulama yok, uygulama içi tarayıcı, elle
 *   yazılmış URL) web, `rotalink://open<yol>` ile uygulamayı dener; Android'de
 *   yoksa Play Store'a (Install Referrer ile yol taşınır), iOS'ta App Store'a gider.
 */

export const ANDROID_PACKAGE = "com.serdarza.rotalink";
export const APP_SCHEME = "rotalink";

/** Yönlendirme yapılmayacak yollar (uygulamanın kendisinin açtığı sayfalar dahil). */
export const APP_GATE_EXCLUDED_PREFIXES = [
  "/indir",
  "/iletisim",
  ...LEGAL_PAGES.map((p) => `/${p.slug}`),
];

/** `?web=1` → bu oturumda web'de kal (uygulama sitenin kendisini açarken kullanır). */
export const STAY_ON_WEB_PARAM = "web";

/** Oturum başına tek otomatik yönlendirme (mağazadan geri dönüşte döngü olmasın). */
export const APP_GATE_SESSION_KEY = "rotalink_app_gate_v2";

export const PLAY_STORE_BASE_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;
export const APP_STORE_REDIRECT_URL = APP_STORE_URL;

/** Ücretsiz sayaç (VisitorCounter ile aynı servis). */
export const REDIRECT_COUNTER_BASE = "https://api.counterapi.dev/v1/rotalink/";

/** `/sehir/kayseri/` → `sehir_kayseri`; kök → `home`. Sayaç ve UTM kampanyası adı. */
export function campaignTag(pathname: string): string {
  const tag = pathname
    .split("/")
    .filter(Boolean)
    .join("_")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 48);
  return tag || "home";
}

export function playStoreUrlFor(pathWithQuery: string, pathname: string): string {
  const referrer =
    `utm_source=rotalink_web&utm_medium=web_redirect&utm_campaign=${campaignTag(pathname)}` +
    `&rl_path=${encodeURIComponent(pathWithQuery)}`;
  return `${PLAY_STORE_BASE_URL}&referrer=${encodeURIComponent(referrer)}`;
}

export function androidIntentUrl(pathWithQuery: string, pathname: string): string {
  return (
    `intent://open${pathWithQuery}#Intent;scheme=${APP_SCHEME};package=${ANDROID_PACKAGE};` +
    `S.browser_fallback_url=${encodeURIComponent(playStoreUrlFor(pathWithQuery, pathname))};end`
  );
}

export function appSchemeUrl(pathWithQuery: string): string {
  return `${APP_SCHEME}://open${pathWithQuery}`;
}

/** Tesis telefonu veya harita/konum bağlantısı (telefonda mağazaya alınır). */
export function isPhoneOrMapLink(url: URL): boolean {
  if (url.protocol === "tel:" || url.protocol === "geo:") return true;
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  if (host === "maps.google.com" || host === "maps.app.goo.gl") return true;
  if (host === "google.com" || host.endsWith(".google.com")) {
    return url.pathname === "/maps" || url.pathname.startsWith("/maps/");
  }
  return false;
}

/** iPadOS 13+ masaüstü UA'sı da iOS sayılır. */
export function mobilePlatform(): "android" | "ios" | null {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent || "";
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) return "ios";
  return null;
}

/**
 * Telefonda mağazayı doğrudan açar (Android'de kaynak sayfa referrer ile taşınır).
 * Masaüstünde `false` döner; çağıran normal davranışa devam eder.
 */
export function openStoreDirect(pathWithQuery: string, pathname: string): boolean {
  const platform = mobilePlatform();
  if (!platform) return false;
  if (platform === "android") {
    trackRedirect("android_store_redirect", pathname);
    window.location.href = playStoreUrlFor(pathWithQuery, pathname);
  } else {
    trackRedirect("ios_store_redirect", pathname);
    window.location.href = APP_STORE_REDIRECT_URL;
  }
  return true;
}

export function trackRedirect(event: string, pathname: string) {
  const tag = campaignTag(pathname);
  for (const name of [event, `${event}__${tag}`]) {
    try {
      void fetch(`${REDIRECT_COUNTER_BASE}${name}/up`, { keepalive: true, mode: "no-cors" });
    } catch {
      // sayaç ulaşılamazsa yönlendirme yine çalışsın
    }
  }
}
