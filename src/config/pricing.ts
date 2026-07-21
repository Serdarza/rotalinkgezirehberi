/**
 * Tesis türüne göre gecelik konaklama fiyat aralıkları.
 *
 * TEK MERKEZ: Fiyatlar değiştiğinde sadece bu dosyayı güncelleyin —
 * tüm tesis kartlarına otomatik yansır.
 *
 * `sivil: null` → o tesiste sivil misafir konaklayamaz.
 */

export type FacilityPricing = {
  /** Kamu personeli gecelik fiyat aralığı */
  kamu: string;
  /** Sivil misafir gecelik fiyat aralığı (null: konaklayamaz) */
  sivil: string | null;
};

export const PRICING_NOTE = "Fiyatlar yaklaşıktır; tesise ve oda tipine göre değişebilir.";

const PRICING: Record<string, FacilityPricing> = {
  orduevi: {
    kamu: "400 – 1.405 TL",
    sivil: null,
  },
  polisevi: {
    kamu: "848 – 1.550 TL",
    sivil: "1.317 – 2.200 TL",
  },
  ogretmenevi: {
    kamu: "750 – 1.600 TL",
    sivil: "1.500 – 2.650 TL",
  },
  karayollari: {
    kamu: "120 – 850 TL",
    sivil: "180 – 1.350 TL",
  },
  /** Diğer tüm kamu misafirhaneleri (taban) */
  misafirhane: {
    kamu: "400 TL ve üzeri",
    sivil: "750 TL ve üzeri",
  },
};

export function getFacilityPricing(tip: string | null | undefined): FacilityPricing {
  const n = String(tip ?? "")
    .trim()
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (n.includes("orduevi")) return PRICING.orduevi;
  if (n.includes("polisevi")) return PRICING.polisevi;
  if (n.includes("ogretmenevi")) return PRICING.ogretmenevi;
  if (n.includes("karayollari") || n.includes("dsi")) return PRICING.karayollari;
  return PRICING.misafirhane;
}
