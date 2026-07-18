"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Droplets,
  LocateFixed,
  MapPin,
  Sun,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container, GlassCard } from "@/components/ui/Section";
import {
  fetchWeather,
  getWeatherLabel,
  reverseGeocode,
  type LocationData,
  type WeatherData,
  type WeatherIconKey,
} from "@/lib/weather";

const WEATHER_ICONS: Record<WeatherIconKey, LucideIcon> = {
  sun: Sun,
  "cloud-sun": CloudSun,
  cloud: Cloud,
  fog: CloudFog,
  drizzle: CloudRain,
  rain: CloudRain,
  snow: CloudSnow,
  thunder: CloudLightning,
};

type Status = "idle" | "loading" | "ready" | "denied" | "error";

export function WeatherWidget() {
  const [status, setStatus] = useState<Status>("idle");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);

  const loadByCoords = useCallback(async (lat: number, lon: number) => {
    setStatus("loading");
    try {
      const [weatherData, locationData] = await Promise.all([
        fetchWeather(lat, lon),
        reverseGeocode(lat, lon),
      ]);
      setWeather(weatherData);
      setLocation(locationData);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void loadByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error");
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 }
    );
  }, [loadByCoords]);

  useEffect(() => {
    // Otomatik dene; izin yoksa kullanıcı butonla açar
    requestLocation();
  }, [requestLocation]);

  const meta = weather ? getWeatherLabel(weather.weatherCode) : null;
  const WeatherIcon = meta ? WEATHER_ICONS[meta.icon] : CloudSun;

  return (
    <section className="relative z-20 -mt-10 pb-2">
      <Container>
        <AnimatePresence mode="wait">
          {status === "ready" && weather && location && meta && (
            <motion.div
              key="weather-ready"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <GlassCard className="overflow-hidden border-[#0F62FE]/15 bg-white/90 p-0 dark:bg-slate-900/90">
                <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F62FE] to-[#14B8A6] text-white shadow-lg shadow-[#0F62FE]/25">
                      <WeatherIcon className="h-8 w-8" strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#0F62FE]">
                        Konumunuza göre hava
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-lg font-bold text-slate-900 dark:text-white">
                        <MapPin className="h-4 w-4 shrink-0 text-[#14B8A6]" />
                        {location.district
                          ? `${location.district}, ${location.city}`
                          : location.city}
                      </p>
                      <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                        {meta.label}
                        <span className="mx-1.5 text-slate-300 dark:text-slate-600">·</span>
                        {location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°
                      </p>
                    </div>
                  </div>

                  <div className="flex items-end gap-6 sm:gap-8">
                    <div>
                      <p className="text-4xl font-extrabold tabular-nums tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                        {Math.round(weather.temperature)}°
                        <span className="text-2xl font-bold text-slate-400">C</span>
                      </p>
                      {weather.feelsLike != null && (
                        <p className="mt-1 text-xs text-slate-500">
                          Hissedilen {Math.round(weather.feelsLike)}°C
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Droplets className="h-4 w-4 text-[#0F62FE]" />
                        <span>Nem %{Math.round(weather.humidity)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Wind className="h-4 w-4 text-[#14B8A6]" />
                        <span>Rüzgâr {Math.round(weather.windSpeed)} km/s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {(status === "idle" || status === "loading") && (
            <motion.div
              key="weather-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GlassCard className="flex items-center justify-center gap-3 py-6 text-sm text-slate-500">
                <LocateFixed className="h-5 w-5 animate-pulse text-[#0F62FE]" />
                Konumunuz alınıyor, hava durumu hazırlanıyor...
              </GlassCard>
            </motion.div>
          )}

          {(status === "denied" || status === "error") && (
            <motion.div
              key="weather-prompt"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <GlassCard className="flex flex-col items-center justify-between gap-4 py-5 text-center sm:flex-row sm:text-left">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F62FE]/10 text-[#0F62FE]">
                    <LocateFixed className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      Konumunuza özel hava durumu
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                      {status === "denied"
                        ? "Konum izni verilmedi. Seyahat planınız için yerel havayı görmek ister misiniz?"
                        : "Hava durumu şu an alınamadı. Tekrar deneyebilirsiniz."}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={requestLocation}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#0F62FE] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:scale-[1.02]"
                >
                  <MapPin className="h-4 w-4" />
                  Konumu Aç
                </button>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </section>
  );
}
