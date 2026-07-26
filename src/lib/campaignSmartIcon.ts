import {
  ShoppingBag,
  UtensilsCrossed,
  Hotel,
  Bus,
  Tag,
  type LucideIcon,
} from "lucide-react";

const SHOPPING = [
  "giyim",
  "ayakkabı",
  "ayakkabi",
  "mağaza",
  "magaza",
  "butik",
  "alışveriş",
  "alisveris",
  "kiğılı",
  "kigili",
  "damat",
  "arçelik",
  "arcelik",
];
const FOOD = [
  "yemek",
  "restoran",
  "kafe",
  "cafe",
  "tatlı",
  "tatli",
  "kahve",
  "mado",
];
const LODGING = ["otel", "misafirhane", "konaklama", "pansiyon", "hostel"];
const TRANSPORT = [
  "bilet",
  "ulaşım",
  "ulasim",
  "araç",
  "arac",
  "otobüs",
  "otobus",
  "metro",
  "tren",
  "uçak",
  "ucak",
  "kiralama",
  "kargo",
  "telekom",
];

function anyMatch(text: string, words: string[]) {
  return words.some((w) => text.includes(w));
}

/** Flutter CampaignSmartIcon ile aynı anahtar kelime mantığı. */
export function campaignSmartIcon(title: string, summary: string): LucideIcon {
  const text = `${title} ${summary}`.toLocaleLowerCase("tr");
  if (anyMatch(text, SHOPPING)) return ShoppingBag;
  if (anyMatch(text, FOOD)) return UtensilsCrossed;
  if (anyMatch(text, LODGING)) return Hotel;
  if (anyMatch(text, TRANSPORT)) return Bus;
  return Tag;
}

export function campaignAccent(title: string, summary: string): {
  bg: string;
  icon: string;
  ring: string;
} {
  const key = `${title}|${summary}`;
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  const hue = h % 360;
  return {
    bg: `hsl(${hue} 55% 94%)`,
    icon: `hsl(${hue} 42% 38%)`,
    ring: `hsl(${hue} 45% 82%)`,
  };
}
