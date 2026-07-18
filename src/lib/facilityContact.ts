import { PLAY_STORE_URL, APP_STORE_URL, DOWNLOAD_PAGE_PATH } from "@/config/downloads";
import { detectDevice } from "@/lib/device";
import { markAppDownloadClicked } from "@/lib/downloadPrompt";

function toTelHref(telefon: string) {
  const digits = telefon.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : null;
}

/**
 * İletişim: telefon varsa doğrudan ara.
 * Yoksa mağazaya yönlendir ve indirme popup’larını bir daha gösterme.
 */
export function handleFacilityContact(telefon?: string | null) {
  const tel = telefon?.trim() ? toTelHref(telefon.trim()) : null;
  if (tel) {
    window.location.href = tel;
    return;
  }

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
