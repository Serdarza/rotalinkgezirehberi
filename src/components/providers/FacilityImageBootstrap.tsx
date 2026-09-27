"use client";

import { useEffect } from "react";
import { ensureFacilityPricesLoaded } from "@/lib/facilityPriceRepo";
import { ensureMasterDataLoaded } from "@/lib/masterDataRepo";

/** Flutter splash benzeri: master veritabanı ve fiyat indeksini önceden yükler. */
export function FacilityImageBootstrap() {
  useEffect(() => {
    void ensureMasterDataLoaded();
    void ensureFacilityPricesLoaded();
  }, []);

  return null;
}
