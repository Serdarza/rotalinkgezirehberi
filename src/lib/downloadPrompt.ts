/**
 * İndirme yönlendirme frekansı — tek merkez.
 *
 * - Kullanıcı Play/App Store’a tıkladıysa: bir daha otomatik popup gösterme.
 * - “Şimdi değil” dediyse: 30 gün sessiz kal.
 */

const DOWNLOADED_KEY = "rotalink_app_download_clicked";
const DISMISSED_KEY = "rotalink_download_prompt_dismissed_at";
const DISMISS_DAYS = 30;

function canUseStorage() {
  return typeof window !== "undefined";
}

/** Kullanıcı mağaza butonuna bastı (indirme niyeti). */
export function markAppDownloadClicked() {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(DOWNLOADED_KEY, "1");
  } catch {
    // storage kapalıysa sessiz geç
  }
}

export function hasAppDownloadClicked(): boolean {
  if (!canUseStorage()) return false;
  try {
    return localStorage.getItem(DOWNLOADED_KEY) === "1";
  } catch {
    return false;
  }
}

/** Popup’ı kapat (“Şimdi değil”). */
export function dismissDownloadPrompt() {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
  } catch {
    // ignore
  }
}

/** Otomatik indirme popup’ı gösterilsin mi? */
export function shouldShowDownloadPrompt(): boolean {
  if (!canUseStorage()) return false;
  if (hasAppDownloadClicked()) return false;

  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    if (!raw) return true;
    const at = Number(raw);
    if (!Number.isFinite(at)) return true;
    const ms = DISMISS_DAYS * 24 * 60 * 60 * 1000;
    return Date.now() - at > ms;
  } catch {
    return true;
  }
}
