export type GeoResult = { latitude: number; longitude: number };

export class GeoError extends Error {
  readonly denied: boolean;
  constructor(message: string, denied: boolean) {
    super(message);
    this.denied = denied;
  }
}

function getPosition(options: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

/**
 * Telefonlarda tek denemeli konum isteği sık sık TIMEOUT /
 * POSITION_UNAVAILABLE ile düşer. Önce hızlı (ağ tabanlı, önbellekli)
 * dene; olmazsa GPS (yüksek hassasiyet) ile daha uzun süreli ikinci
 * deneme yap.
 */
export async function getCurrentPositionRobust(): Promise<GeoResult> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    throw new GeoError("Tarayıcı konum desteklemiyor", false);
  }

  try {
    const pos = await getPosition({
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 600000,
    });
    return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
  } catch (err) {
    const e = err as GeolocationPositionError;
    if (e.code === e.PERMISSION_DENIED) {
      throw new GeoError("Konum izni verilmedi", true);
    }
    // TIMEOUT veya POSITION_UNAVAILABLE — GPS ile tekrar dene
  }

  try {
    const pos = await getPosition({
      enableHighAccuracy: true,
      timeout: 25000,
      maximumAge: 0,
    });
    return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
  } catch (err) {
    const e = err as GeolocationPositionError;
    throw new GeoError(
      e.code === e.PERMISSION_DENIED ? "Konum izni verilmedi" : "Konum alınamadı",
      e.code === e.PERMISSION_DENIED
    );
  }
}
