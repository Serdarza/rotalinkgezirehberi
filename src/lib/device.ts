/**
 * User-Agent tabanlı cihaz algılama.
 * Sunucu tarafında (headers) ve istemci tarafında kullanılabilir.
 */

export type DeviceType = "android" | "ios" | "desktop";

/**
 * User-Agent string'inden cihaz türünü belirler.
 * @param userAgent - navigator.userAgent veya request header değeri
 */
export function detectDevice(userAgent: string): DeviceType {
  const ua = userAgent.toLowerCase();

  if (/android/i.test(ua)) {
    return "android";
  }

  if (/iphone|ipad|ipod/i.test(ua)) {
    return "ios";
  }

  return "desktop";
}

/** Mağaza görünen adları */
export const STORE_LABELS: Record<Exclude<DeviceType, "desktop">, string> = {
  android: "Google Play",
  ios: "App Store",
};
