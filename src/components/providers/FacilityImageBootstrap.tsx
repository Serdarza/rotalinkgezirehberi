"use client";

import { useEffect } from "react";
import { ensureFacilityImagesLoaded, lookupFacilityImages } from "@/lib/facilityImageRepo";
import { ensureFacilityPricesLoaded } from "@/lib/facilityPriceRepo";
import { ensureMasterDataLoaded, getMasterSnapshot } from "@/lib/masterDataRepo";
import { prefetchMediaUrls } from "@/lib/mediaImageCache";

/** Flutter splash benzeri: master + görsel indeksi + fiyat; görünen tesis fotoğraflarını diske önceden alır. */
export function FacilityImageBootstrap() {
  useEffect(() => {
    void (async () => {
      await Promise.all([
        ensureMasterDataLoaded(),
        ensureFacilityImagesLoaded(),
        ensureFacilityPricesLoaded(),
      ]);

      const snap = getMasterSnapshot();
      const urls: string[] = [];
      for (const t of snap.tesis.slice(0, 24)) {
        const found = lookupFacilityImages(t.il, t.isim);
        if (found[0]) urls.push(found[0]);
      }
      prefetchMediaUrls(urls);
    })();
  }, []);

  return null;
}
