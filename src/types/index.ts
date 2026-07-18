export type FacilityType =
  | "Orduevi"
  | "Polisevi"
  | "Öğretmenevi"
  | "Kamu Misafirhanesi"
  | "Karayolları Misafirhanesi"
  | string;

export interface Tesis {
  isim: string;
  tip: FacilityType;
  il: string;
  adres?: string;
  telefon?: string;
  latitude?: number;
  longitude?: number;
  aciklama?: string;
}

export interface GeziYeri {
  isim: string;
  il: string;
  adres?: string;
  aciklama?: string;
}

export interface YemekMekani {
  isim: string;
  il: string;
  adres?: string;
  aciklama?: string;
}

export interface SosyalTesis {
  isim: string;
  il: string;
  ilce?: string;
  belediye?: string;
  adres?: string;
  aciklama?: string;
}

export interface SiteStats {
  cityCount: number;
  facilityCount: number;
  geziCount: number;
  monthlyUsers?: string;
}

export type CategoryKey =
  | "misafirhane"
  | "polisevi"
  | "ogretmenevi"
  | "orduevi"
  | "askeri";
