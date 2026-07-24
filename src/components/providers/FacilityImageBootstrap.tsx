"use client";

import { useEffect } from "react";
import { ensureFacilityImagesLoaded } from "@/lib/facilityImageRepo";

/** Uygulama açılışında tesis görsel indeksini önceden yükler (Flutter splash benzeri). */
export function FacilityImageBootstrap() {
  useEffect(() => {
    void ensureFacilityImagesLoaded();
  }, []);
  return null;
}
