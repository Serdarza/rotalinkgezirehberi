import { headers } from "next/headers";
import { detectDevice, type DeviceType } from "./device";

/**
 * Sunucu tarafında request header'ından cihaz türünü algılar.
 * App Router Server Component'lerde kullanılır.
 */
export async function getDeviceFromHeaders(): Promise<DeviceType> {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") ?? "";
  return detectDevice(userAgent);
}
