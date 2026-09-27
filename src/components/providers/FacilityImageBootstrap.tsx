"use client";

import { useEffect } from "react";
import { ensureMasterDataLoaded } from "@/lib/masterDataRepo";

/** Flutter splash benzeri: master veritabanını önceden yükler. */
export function FacilityImageBootstrap() {
  useEffect(() => {
    void ensureMasterDataLoaded();
  }, []);

  return null;
}
