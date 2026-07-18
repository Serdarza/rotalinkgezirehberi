/** Open-Meteo WMO weather code → Türkçe açıklama ve ikon anahtarı */

export type WeatherIconKey =
  | "sun"
  | "cloud-sun"
  | "cloud"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "thunder";

export function getWeatherLabel(code: number): { label: string; icon: WeatherIconKey } {
  if (code === 0) return { label: "Açık", icon: "sun" };
  if (code === 1 || code === 2) return { label: "Parçalı bulutlu", icon: "cloud-sun" };
  if (code === 3) return { label: "Bulutlu", icon: "cloud" };
  if (code === 45 || code === 48) return { label: "Sisli", icon: "fog" };
  if (code >= 51 && code <= 57) return { label: "Çiseleme", icon: "drizzle" };
  if (code >= 61 && code <= 67) return { label: "Yağmurlu", icon: "rain" };
  if (code >= 71 && code <= 77) return { label: "Karlı", icon: "snow" };
  if (code >= 80 && code <= 82) return { label: "Sağanak", icon: "rain" };
  if (code >= 85 && code <= 86) return { label: "Kar sağanağı", icon: "snow" };
  if (code >= 95) return { label: "Gök gürültülü", icon: "thunder" };
  return { label: "Değişken", icon: "cloud" };
}

export type WeatherData = {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  feelsLike?: number;
};

export type LocationData = {
  city: string;
  district?: string;
  latitude: number;
  longitude: number;
};

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature` +
    `&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Hava durumu alınamadı");
  const data = await res.json();
  const current = data.current;

  return {
    temperature: current.temperature_2m,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    weatherCode: current.weather_code,
    feelsLike: current.apparent_temperature,
  };
}

export async function reverseGeocode(lat: number, lon: number): Promise<LocationData> {
  const url =
    `https://api.bigdatacloud.net/data/reverse-geocode-client` +
    `?latitude=${lat}&longitude=${lon}&localityLanguage=tr`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Konum adı alınamadı");
  const data = await res.json();

  const city =
    data.city ||
    data.locality ||
    data.principalSubdivision ||
    "Konumunuz";

  const district =
    data.locality && data.locality !== city
      ? data.locality
      : data.principalSubdivision && data.principalSubdivision !== city
        ? data.principalSubdivision
        : undefined;

  return { city, district, latitude: lat, longitude: lon };
}

/** İl adına göre Türkiye koordinatı bulur (Open-Meteo Geocoding) */
export async function geocodeCity(cityName: string): Promise<LocationData> {
  const url =
    `https://geocoding-api.open-meteo.com/v1/search` +
    `?name=${encodeURIComponent(cityName)}` +
    `&count=5&language=tr&countryCode=TR`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("İl konumu bulunamadı");
  const data = await res.json();
  const results = Array.isArray(data.results) ? data.results : [];

  if (!results.length) {
    throw new Error(`“${cityName}” için konum bulunamadı`);
  }

  const normalized = cityName.toLocaleLowerCase("tr");
  const match =
    results.find(
      (r: { name?: string; admin1?: string }) =>
        (r.name ?? "").toLocaleLowerCase("tr") === normalized ||
        (r.admin1 ?? "").toLocaleLowerCase("tr") === normalized
    ) ?? results[0];

  return {
    city: match.name || cityName,
    district: match.admin1 && match.admin1 !== match.name ? match.admin1 : undefined,
    latitude: match.latitude,
    longitude: match.longitude,
  };
}
