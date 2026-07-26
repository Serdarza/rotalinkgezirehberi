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
}

/** Flutter Campaign — GitHub kampanya.json */
export interface Campaign {
  id: string;
  slug: string;
  title: string;
  organization: string;
  summary: string;
  /** Açıklamanın paragraf/madde satırları (detay sayfası için). */
  paragraphs: string[];
  linkUrl: string | null;
  createdAt: string | null;
  tags: string[];
}

export type CategoryKey =
  | "misafirhane"
  | "polisevi"
  | "ogretmenevi"
  | "orduevi"
  | "askeri";
