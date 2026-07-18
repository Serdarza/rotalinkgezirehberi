"use client";

import { useEffect, useState } from "react";
import { detectDevice, type DeviceType } from "@/lib/device";
import { PLAY_STORE_URL, APP_STORE_URL } from "@/config/downloads";
import { DesktopDownloadPage } from "./DesktopDownloadPage";
import { MobileRedirect } from "./MobileRedirect";

export function IndirClient() {
  const [device, setDevice] = useState<DeviceType | null>(null);

  useEffect(() => {
    setDevice(detectDevice(navigator.userAgent));
  }, []);

  if (!device) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-500 dark:border-sky-800 dark:border-t-sky-400"
          role="status"
          aria-label="Yükleniyor"
        />
      </div>
    );
  }

  if (device === "android") {
    return <MobileRedirect url={PLAY_STORE_URL} storeName="Google Play" />;
  }

  if (device === "ios") {
    return <MobileRedirect url={APP_STORE_URL} storeName="App Store" />;
  }

  return <DesktopDownloadPage />;
}
