"use client";

import { useEffect, useState } from "react";
import {
  ensureFacilityPricesLoaded,
  getFacilityPriceNote,
  isFacilityPriceIndexReady,
  lookupFacilityPrice,
  type FacilityPriceEntry,
} from "@/lib/facilityPriceRepo";

type State = {
  ready: boolean;
  entry: FacilityPriceEntry | null;
  note: string;
};

export function useFacilityPricing(il: string, isim: string): State {
  const [state, setState] = useState<State>(() => ({
    ready: isFacilityPriceIndexReady(),
    entry: lookupFacilityPrice(il, isim),
    note: getFacilityPriceNote(),
  }));

  useEffect(() => {
    let cancelled = false;

    void ensureFacilityPricesLoaded().then(() => {
      if (cancelled) return;
      setState({
        ready: true,
        entry: lookupFacilityPrice(il, isim),
        note: getFacilityPriceNote(),
      });
    });

    return () => {
      cancelled = true;
    };
  }, [il, isim]);

  return state;
}
