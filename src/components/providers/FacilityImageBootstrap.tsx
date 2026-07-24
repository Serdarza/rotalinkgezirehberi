"use client";

import { useEffect } from "react";
import { ensureFacilityImagesLoaded } from "@/lib/facilityImageRepo";
import { ensureFacilityPricesLoaded } from "@/lib/facilityPriceRepo";

/** Flutter splash benzeri: görsel + fiyat indekslerini önceden yükler. */
export function FacilityImageBootstrap() {
  useEffect(() => {
    void ensureFacilityImagesLoaded();
    void ensureFacilityPricesLoaded();
  }, []);
  return null;
}
