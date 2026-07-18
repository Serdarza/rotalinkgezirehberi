/**
 * Rotalink indirme bağlantıları ve site yapılandırması.
 * Tüm mağaza URL'leri tek dosyada tutulur.
 */

/** Google Play Store uygulama sayfası */
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.serdarza.rotalink&pcampaignid=web_share";

/** Apple App Store uygulama sayfası */
export const APP_STORE_URL =
  "https://apps.apple.com/cd/app/rotalink-kamu-seyahat-rehberi/id6764678799";

/** QR kodunun yönlendireceği sayfa (mobil cihaz algılama için) */
export const DOWNLOAD_PAGE_PATH = "/indir";

/** Üretim ortamı site URL'si — .env ile override edilebilir */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rotalink.tr";

/** Tam indirme sayfası URL'si (QR kod için) */
export const DOWNLOAD_PAGE_URL = `${SITE_URL}${DOWNLOAD_PAGE_PATH}`;

export const APP_INFO = {
  name: "Rotalink Kamu Seyahat Rehberi",
  shortName: "Rotalink",
  tagline:
    "Kamu sosyal tesisleri, misafirhaneler, öğretmenevleri, polisevleri ve daha fazlası tek uygulamada.",
  description:
    "Türkiye genelindeki kamu misafirhaneleri, orduevleri, polisevleri, öğretmenevleri ve sosyal tesisler için akıllı seyahat rehberi uygulaması.",
} as const;

export const FEATURES = [
  "Kamu Misafirhaneleri",
  "Polisevleri",
  "Öğretmenevleri",
  "Askeri Sosyal Tesisler",
  "Haritalı Yol Tarifi",
  "Sürekli Güncel Bilgiler",
] as const;

/** Mobil cihazlarda otomatik yönlendirme gecikmesi (ms) */
export const MOBILE_REDIRECT_DELAY_MS = 2000;
