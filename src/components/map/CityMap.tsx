"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import { cn } from "@/lib/utils";
import type { Tesis } from "@/types";

type Props = {
  facilities: Tesis[];
  className?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pinColor(tip: string | null | undefined) {
  const t = String(tip ?? "").toLocaleLowerCase("tr");
  if (t.includes("orduevi")) return "#7c3aed";
  if (t.includes("polisevi")) return "#0F62FE";
  if (t.includes("öğretmenevi")) return "#f59e0b";
  return "#14B8A6";
}

/**
 * Ücretsiz harita: Leaflet + OpenStreetMap (API anahtarı yok).
 * Statik export ile uyumlu — leaflet yalnızca tarayıcıda yüklenir.
 */
export function CityMap({ facilities, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current) return;

      if (!mapRef.current) {
        mapRef.current = L.map(containerRef.current, {
          scrollWheelZoom: false,
          zoomControl: true,
        });
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> katkıda bulunanlar',
          maxZoom: 19,
        }).addTo(mapRef.current);
        layerRef.current = L.layerGroup().addTo(mapRef.current);
      }

      const map = mapRef.current;
      const layer = layerRef.current;
      if (!map || !layer) return;

      layer.clearLayers();

      const points = facilities.filter(
        (f): f is Tesis & { latitude: number; longitude: number } =>
          typeof f.latitude === "number" &&
          typeof f.longitude === "number" &&
          Number.isFinite(f.latitude) &&
          Number.isFinite(f.longitude)
      );

      if (!points.length) {
        map.setView([39.0, 35.0], 6);
        return;
      }

      points.forEach((f) => {
        const color = pinColor(f.tip);
        const icon = L.divIcon({
          className: "",
          html: `<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};border:2.5px solid #fff;box-shadow:0 2px 8px rgba(15,23,42,.35);display:flex;align-items:center;justify-content:center;"><div style="width:8px;height:8px;border-radius:50%;background:#fff;transform:rotate(45deg);"></div></div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 26],
          popupAnchor: [0, -24],
        });

        const name = escapeHtml(f.isim);
        const tip = escapeHtml(String(f.tip ?? ""));
        const phone = f.telefon ? escapeHtml(f.telefon) : "";
        const phoneDigits = String(f.telefon ?? "").replace(/[^0-9+]/g, "");
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${f.isim} ${f.il}`
        )}`;

        const popupHtml = `
          <div style="min-width:190px;font-family:inherit;">
            <span style="display:inline-block;background:${color};color:#fff;font-size:10px;font-weight:700;text-transform:uppercase;padding:2px 8px;border-radius:8px;margin-bottom:6px;">${tip}</span>
            <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#0f172a;">${name}</p>
            ${
              phone
                ? `<p style="margin:0 0 8px;font-size:12px;color:#475569;">☎ <a href="tel:${phoneDigits}" style="color:#0F62FE;text-decoration:none;font-weight:600;">${phone}</a></p>`
                : ""
            }
            <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#0F62FE;color:#fff;font-size:12px;font-weight:600;padding:6px 12px;border-radius:10px;text-decoration:none;">Yol Tarifi</a>
          </div>`;

        L.marker([f.latitude, f.longitude], { icon })
          .bindPopup(popupHtml)
          .addTo(layer);
      });

      const bounds = L.latLngBounds(points.map((f) => [f.latitude, f.longitude]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    })();

    return () => {
      cancelled = true;
    };
  }, [facilities]);

  useEffect(
    () => () => {
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
    },
    []
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "z-0 h-full w-full overflow-hidden rounded-3xl border border-slate-200 shadow-md dark:border-slate-700",
        className
      )}
      role="application"
      aria-label="Tesis haritası"
    />
  );
}
