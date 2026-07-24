"use client";

import { useEffect } from "react";
import { ensureFacilityImagesLoaded } from "@/lib/facilityImageRepo";
import { ensureFacilityPricesLoaded } from "@/lib/facilityPriceRepo";
import { ensureMasterDataLoaded } from "@/lib/masterDataRepo";

/** Flutter splash benzeri: master DB + görsel + fiyat indekslerini önceden yükler. */
export function FacilityImageBootstrap() {
  useEffect(() => {
    void ensureMasterDataLoaded();
    void ensureFacilityImagesLoaded();
    void ensureFacilityPricesLoaded();
  }, []);
  return null;
}
