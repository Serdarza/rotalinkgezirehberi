import { headers } from "next/headers";
import { detectDevice } from "@/lib/device";
import { DesktopDownloadPage } from "@/components/indir/DesktopDownloadPage";
import { MobileRedirect } from "@/components/indir/MobileRedirect";
import { PLAY_STORE_URL, APP_STORE_URL } from "@/config/downloads";

/** /indir — mobilde mağazaya yönlendir, masaüstünde indirme sayfası */
export default async function IndirPage() {
  const headersList = await headers();
  const ua = headersList.get("user-agent") ?? "";
  const device = detectDevice(ua);

  if (device === "android") {
    return <MobileRedirect url={PLAY_STORE_URL} storeName="Google Play" />;
  }
  if (device === "ios") {
    return <MobileRedirect url={APP_STORE_URL} storeName="App Store" />;
  }
  return <DesktopDownloadPage />;
}
