"use client";

import { useEffect, useState } from "react";
import {
  ensureFacilityImagesLoaded,
  lookupFacilityImages,
} from "@/lib/facilityImageRepo";
import { getFacilityImageSrc } from "@/lib/facilityImages";

type FacilityLike = {
  tip?: string | null;
  il: string;
  isim: string;
};

/**
 * Önce GitHub görsel DB (il+isim), yoksa kategori görseli.
 */
export function useFacilityCardImage(facility: FacilityLike): string {
  const [src, setSrc] = useState(() => {
    const urls = lookupFacilityImages(facility.il, facility.isim);
    return urls[0] ?? getFacilityImageSrc(facility.tip);
  });

  useEffect(() => {
    let cancelled = false;

    void ensureFacilityImagesLoaded().then(() => {
      if (cancelled) return;
      const urls = lookupFacilityImages(facility.il, facility.isim);
      setSrc(urls[0] ?? getFacilityImageSrc(facility.tip));
    });

    return () => {
      cancelled = true;
    };
  }, [facility.il, facility.isim, facility.tip]);

  return src;
}
