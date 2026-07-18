import { POPULAR_CITIES } from "@/config/site";
import { slugifyCity } from "@/lib/utils";

export type KamiIntent =
  | "help"
  | "nearby"
  | "food"
  | "sightseeing"
  | "municipal"
  | "weekend"
  | "route"
  | "facilityType"
  | "cityOverview"
  | "unknown";

export type KamiLink = {
  label: string;
  href: string;
};

export type KamiReply = {
  text: string;
  links: KamiLink[];
  tip?: string;
};

function norm(value: string) {
  return slugifyCity(value).replace(/-/g, " ");
}

function findCitiesInText(text: string, cities: string[]): string[] {
  const n = norm(text);
  const hits: { city: string; index: number }[] = [];

  for (const city of cities) {
    const nc = norm(city);
    if (!nc) continue;
    const idx = n.indexOf(nc);
    if (idx >= 0) hits.push({ city, index: idx });
  }

  hits.sort((a, b) => a.index - b.index || b.city.length - a.city.length);

  const unique: string[] = [];
  for (const hit of hits) {
    if (!unique.includes(hit.city)) unique.push(hit.city);
    if (unique.length >= 2) break;
  }
  return unique;
}

function detectFacilityTip(text: string): string | null {
  const n = norm(text);
  if (n.includes("orduevi")) return "Orduevi";
  if (n.includes("polisevi")) return "Polisevi";
  if (n.includes("ogretmenevi") || n.includes("öğretmenevi")) return "Öğretmenevi";
  if (n.includes("misafirhane")) return "Kamu Misafirhanesi";
  return null;
}

export function detectKamiIntent(raw: string, cities: string[]): {
  intent: KamiIntent;
  cities: string[];
  tip: string | null;
} {
  const text = raw.trim();
  const n = norm(text);
  const foundCities = findCitiesInText(text, cities);
  const tip = detectFacilityTip(text);

  if (
    n.includes("merhaba") ||
    n.includes("selam") ||
    n.includes("yardim") ||
    n.includes("ne yapabilirsin") ||
    n.includes("kimsin")
  ) {
    return { intent: "help", cities: foundCities, tip };
  }

  if (
    n.includes("rota") ||
    n.includes("yol") ||
    (foundCities.length >= 2 && (n.includes("aras") || n.includes("den") || n.includes("e git")))
  ) {
    return { intent: "route", cities: foundCities, tip };
  }

  if (
    n.includes("hafta sonu") ||
    n.includes("haftasonu") ||
    n.includes("nereye gidebilirim") ||
    (n.includes("hafta") && (n.includes("nereye") || n.includes("oner") || n.includes("tavsiye")))
  ) {
    return { intent: "weekend", cities: foundCities, tip };
  }

  if (
    n.includes("yemek") ||
    n.includes("ne yemeli") ||
    n.includes("lezzet") ||
    n.includes("restoran")
  ) {
    return { intent: "food", cities: foundCities, tip };
  }

  if (
    n.includes("gezi") ||
    n.includes("gezilecek") ||
    n.includes("turistik") ||
    n.includes("tarih") ||
    n.includes("muze") ||
    n.includes("müze")
  ) {
    return { intent: "sightseeing", cities: foundCities, tip };
  }

  if (
    n.includes("belediye") ||
    n.includes("sosyal tesis") ||
    n.includes("kahvalti") ||
    n.includes("kahvaltı")
  ) {
    return { intent: "municipal", cities: foundCities, tip };
  }

  if (
    n.includes("yakin") ||
    n.includes("yakın") ||
    n.includes("yakınım") ||
    n.includes("civarda") ||
    n.includes("etraf")
  ) {
    return { intent: "nearby", cities: foundCities, tip };
  }

  if (tip) {
    return { intent: "facilityType", cities: foundCities, tip };
  }

  if (foundCities.length === 1) {
    return { intent: "cityOverview", cities: foundCities, tip };
  }

  return { intent: "unknown", cities: foundCities, tip };
}

function cityHref(city: string, params?: Record<string, string>) {
  const qs = new URLSearchParams(params);
  const search = qs.toString();
  return `/sehir/${slugifyCity(city)}${search ? `?${search}` : ""}`;
}

export function buildKamiReply(
  raw: string,
  cities: string[],
  options?: { userCity?: string | null }
): KamiReply {
  const { intent, cities: mentioned, tip } = detectKamiIntent(raw, cities);
  const focusCity = mentioned[0] ?? options?.userCity ?? null;
  const weekendPicks = POPULAR_CITIES.slice(0, 4);

  switch (intent) {
    case "help":
      return {
        text:
          "Merhaba, ben KAMİ — Rotalink’in akıllı kamu seyahat asistanıyım. Yakındaki tesisler, gezi yerleri, yemek önerileri, hafta sonu fikirleri ve şehirler arası rota konusunda yardımcı olurum.",
        links: [
          { label: "İl ara", href: "/#ara" },
          { label: "Uygulamayı indir", href: "/indir" },
        ],
        tip: "Hazır sorulardan birini seçebilir veya şehir adı yazabilirsiniz.",
      };

    case "nearby":
      return {
        text: focusCity
          ? `${focusCity} için konaklama ve yakındaki seçenekleri şehir sayfasında listeledim. Konumunuza göre sıralama için ana sayfadaki “Bana Yakın” bölümünü veya mobil uygulamayı kullanın.`
          : "Yakınımdaki tesisler için önce konum izniyle “Bana Yakın” listesine bakın veya bir il adı yazın (ör. “Ankara yakınımdaki tesisler”).",
        links: focusCity
          ? [
              { label: `${focusCity} tesisleri`, href: cityHref(focusCity) },
              { label: "Bana Yakın", href: "/#yakin" },
              { label: "Uygulamada aç", href: "/indir" },
            ]
          : [
              { label: "Bana Yakın", href: "/#yakin" },
              { label: "İl ara", href: "/#ara" },
              { label: "Uygulamayı indir", href: "/indir" },
            ],
      };

    case "food":
      return {
        text: focusCity
          ? `${focusCity} için yöresel yemek ve mekan önerilerine şehir sayfasındaki Yemek sekmesinden ulaşabilirsiniz.`
          : "Yemek önerisi için bir il yazın — örneğin “İzmir’de ne yemeliyim?”",
        links: focusCity
          ? [
              { label: `${focusCity} yemek`, href: cityHref(focusCity, { sekme: "yemek" }) },
              { label: "Uygulamada keşfet", href: "/indir" },
            ]
          : [
              { label: "Popüler iller", href: "/#sehirler" },
              { label: "İl ara", href: "/#ara" },
            ],
      };

    case "sightseeing":
      return {
        text: focusCity
          ? `${focusCity} gezilecek yerler listesini hazırladım. Gezi sekmesinden inceleyebilirsiniz.`
          : "Gezilecek yerler için il adı ekleyin — örneğin “Trabzon gezilecek yerler”.",
        links: focusCity
          ? [
              { label: `${focusCity} gezi`, href: cityHref(focusCity, { sekme: "gezi" }) },
              { label: "Uygulamada aç", href: "/indir" },
            ]
          : [
              { label: "İl ara", href: "/#ara" },
              { label: "Uygulamayı indir", href: "/indir" },
            ],
      };

    case "municipal":
      return {
        text: focusCity
          ? `${focusCity} belediye sosyal tesislerini Belediye Tesisleri sekmesinde görebilirsiniz.`
          : "Belediye tesisleri için bir il yazın veya uygulamada “yakınımdaki belediye tesisleri” diye sorun.",
        links: focusCity
          ? [
              {
                label: `${focusCity} belediye tesisleri`,
                href: cityHref(focusCity, { sekme: "sosyal" }),
              },
              { label: "Uygulamayı indir", href: "/indir" },
            ]
          : [
              { label: "İl ara", href: "/#ara" },
              { label: "Uygulamayı indir", href: "/indir" },
            ],
      };

    case "weekend":
      return {
        text:
          "Hafta sonu için kısa ve pratik kaçışlar: popüler illerde kamu tesisleri + gezi noktaları bir arada. Bir şehir seçin veya uygulamada size özel skorlu öneri alın.",
        links: [
          ...weekendPicks.map((city) => ({
            label: city,
            href: cityHref(city),
          })),
          { label: "Uygulamada hafta sonu önerisi", href: "/indir" },
        ],
        tip: "Mobil KAMİ, konumunuza göre hafta sonu skorlaması yapar.",
      };

    case "route": {
      const from = mentioned[0];
      const to = mentioned[1];
      if (from && to) {
        return {
          text: `${from} → ${to} rotası için her iki ilin tesis ve gezi listelerini açabilirsiniz. Yol üstü önerileri ve canlı mesafe için mobil uygulamadaki KAMİ rota planlayıcıyı kullanın.`,
          links: [
            { label: `${from} tesisleri`, href: cityHref(from) },
            { label: `${to} tesisleri`, href: cityHref(to) },
            { label: "Uygulamada rota planla", href: "/indir" },
          ],
        };
      }
      return {
        text: "Rota için iki il yazın — örneğin “Ankara’dan Antalya’ya rota”. Web’de illeri açar, uygulamada yol üstü tesisleri planlarım.",
        links: [
          { label: "İl ara", href: "/#ara" },
          { label: "Uygulamayı indir", href: "/indir" },
        ],
      };
    }

    case "facilityType": {
      const tipName = tip ?? "Tesis";
      return {
        text: focusCity
          ? `${focusCity} içindeki ${tipName} listesini filtreli olarak açıyorum.`
          : `${tipName} aramak için bir il seçin veya arama kutusuna il yazın.`,
        links: focusCity
          ? [
              {
                label: `${focusCity} · ${tipName}`,
                href: cityHref(focusCity, { tip: tipName }),
              },
              { label: "Başka il ara", href: "/#ara" },
            ]
          : [
              { label: "İl ara", href: "/#ara" },
              {
                label: `Örnek: Ankara ${tipName}`,
                href: cityHref("Ankara", { tip: tipName }),
              },
            ],
      };
    }

    case "cityOverview":
      return {
        text: `${focusCity} için konaklama, gezi, yemek ve belediye tesislerini tek sayfada topladık. İstediğiniz sekmeye geçebilirsiniz.`,
        links: [
          { label: `${focusCity} tüm sonuçlar`, href: cityHref(focusCity!) },
          { label: "Gezi", href: cityHref(focusCity!, { sekme: "gezi" }) },
          { label: "Yemek", href: cityHref(focusCity!, { sekme: "yemek" }) },
          { label: "Uygulamada aç", href: "/indir" },
        ],
      };

    default:
      return {
        text:
          "Bunu tam anlayamadım. Şehir adı, tesis türü (Orduevi, Polisevi…) veya hazır sorulardan birini deneyin. Daha gelişmiş yanıtlar mobil KAMİ’de.",
        links: [
          { label: "İl ara", href: "/#ara" },
          { label: "Uygulamayı indir", href: "/indir" },
        ],
      };
  }
}

export const KAMI_CHIPS = [
  "Yakınımdaki tesisler",
  "Bu hafta sonu nereye gidebilirim?",
  "Ankara gezilecek yerler",
  "İzmir’de ne yemeliyim?",
  "Ankara’dan Antalya’ya rota",
  "Düzce Orduevi",
] as const;
