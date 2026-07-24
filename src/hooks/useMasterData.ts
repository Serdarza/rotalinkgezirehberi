"use client";

import { useEffect, useState } from "react";
import {
  ensureMasterDataLoaded,
  filterMasterByCity,
  getMasterSnapshot,
  isMasterDataReady,
  subscribeMasterData,
  type MasterSnapshot,
} from "@/lib/masterDataRepo";

const EMPTY: MasterSnapshot = {
  tesis: [],
  gezi: [],
  yemek: [],
  sosyal: [],
  cities: [],
};

/** GitHub master DB — hazır olunca snapshot döner. */
export function useMasterData() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const bump = () => {
      if (!cancelled) setTick((n) => n + 1);
    };

    void ensureMasterDataLoaded().then(bump);
    return subscribeMasterData(bump);
  }, []);

  void tick;
  const ready = isMasterDataReady();
  const snapshot = ready ? getMasterSnapshot() : EMPTY;

  return {
    ready,
    ...snapshot,
  };
}

/** İl sayfası: build-time props → GitHub master gelince güncelle. */
export function useCityMasterData(
  city: string,
  fallback: {
    tesis: MasterSnapshot["tesis"];
    gezi: MasterSnapshot["gezi"];
    yemek: MasterSnapshot["yemek"];
    sosyal: MasterSnapshot["sosyal"];
  }
) {
  const master = useMasterData();

  if (!master.ready) return fallback;
  return filterMasterByCity(city);
}
