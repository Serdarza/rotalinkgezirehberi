import type { FacilityKind } from "@/lib/facilities";

/**
 * İl bazlı kategori sayfaları (`/sehir/<il>/<kategori>/`) ve ülke geneli hub
 * sayfaları için tek kaynak. Metinler genel bilgidir; fiyat, kontenjan veya
 * rezervasyon iddiası içermez (Rotalink rezervasyon yapmaz).
 */

export type CategorySlug =
  | "ogretmenevi"
  | "kamu-misafirhanesi"
  | "polisevi"
  | "orduevi"
  | "belediye-sosyal-tesisleri"
  | "gezilecek-yerler"
  | "yemek-mekanlari";

export type CategorySource = "tesis" | "sosyal" | "gezi" | "yemek";

export type CategoryFaq = { q: string; a: string };

export type CategoryDef = {
  slug: CategorySlug;
  source: CategorySource;
  kind?: FacilityKind;
  /** Cümle içinde küçük harfle: "öğretmenevi" */
  singular: string;
  /** Başlıkta: "Öğretmenevleri" */
  plural: string;
  /** Ülke geneli hub sayfası */
  hubPath?: string;
  /** Kısa tanıtım (kimler için, ne işe yarar) */
  explainer: string;
  /** Önemli noktalar */
  tips: string[];
  faq: CategoryFaq[];
  accent: "blue" | "teal" | "amber" | "violet" | "rose" | "emerald";
};

export const CATEGORY_DEFS: Record<CategorySlug, CategoryDef> = {
  ogretmenevi: {
    slug: "ogretmenevi",
    source: "tesis",
    kind: "ogretmenevi",
    singular: "öğretmenevi",
    plural: "Öğretmenevleri",
    hubPath: "/ogretmenevleri/",
    accent: "blue",
    explainer:
      "Öğretmenevleri, öncelikle eğitim çalışanlarına hizmet veren sosyal ve konaklama tesisleridir. Birçok öğretmenevinde diğer kamu personeli ve misafirler de tesisin kurallarına göre konaklayabilir; kabul koşulları tesisten tesise değişir.",
    tips: [
      "Yola çıkmadan önce tesisi arayıp müsaitlik ve kabul koşullarını sorun.",
      "Kimlik veya kurum kimlik kartınızı yanınızda bulundurun.",
      "Bayram, yaz tatili ve okul dönemi tatillerinde yoğunluk artabilir; erken planlayın.",
    ],
    faq: [
      {
        q: "Öğretmenevinde sadece öğretmenler mi kalabilir?",
        a: "Öğretmenevleri öncelikle eğitim çalışanlarına hizmet verir. Pek çok tesiste diğer kamu personeli ve misafirler de kabul edilebilir; ancak bu tesise ve döneme göre değişir. Kesin bilgi için ilgili öğretmenevini arayın.",
      },
      {
        q: "Rotalink üzerinden rezervasyon yapılır mı?",
        a: "Hayır. Rotalink rezervasyon yapmaz; tesis adı, adres, konum ve iletişim bilgilerini bir arada sunan bir rehberdir. Rezervasyon için tesisle doğrudan iletişime geçmeniz gerekir.",
      },
    ],
  },
  "kamu-misafirhanesi": {
    slug: "kamu-misafirhanesi",
    source: "tesis",
    kind: "misafirhane",
    singular: "kamu misafirhanesi",
    plural: "Kamu Misafirhaneleri",
    hubPath: "/kamu-misafirhaneleri/",
    accent: "teal",
    explainer:
      "Kamu misafirhaneleri; bakanlıklar, kamu kurumları, belediyeler, üniversiteler ve benzeri kuruluşlara bağlı konaklama tesisleridir. Çoğu öncelikle kendi kurum personeline hizmet verir; bazıları diğer kamu çalışanlarını da kabul edebilir.",
    tips: [
      "Misafirhaneler kuruma bağlıdır; kabul edilen kişiler ve belgeler kurumdan kuruma farklılık gösterir.",
      "Müsaitlik ve konaklama koşulları için doğrudan tesisi arayın.",
      "Resmî görev seyahati için kurumunuzun yazışma ve onay süreçlerini göz önünde bulundurun.",
    ],
    faq: [
      {
        q: "Kamu misafirhanelerinde kimler konaklayabilir?",
        a: "Genellikle bağlı olduğu kurumun personeli öncelikli olur. Bazı misafirhaneler diğer kamu çalışanlarını ve hak sahiplerini de kabul edebilir. Koşullar kuruma göre değiştiği için tesisten bilgi almanız gerekir.",
      },
      {
        q: "Listedeki tesisler her zaman açık mı?",
        a: "Listeler açık kaynaklardan derlenir ve zamanla değişebilir. Yola çıkmadan önce tesisin açık olduğunu ve müsait yer bulunduğunu telefonla teyit etmenizi öneririz.",
      },
    ],
  },
  polisevi: {
    slug: "polisevi",
    source: "tesis",
    kind: "polisevi",
    singular: "polisevi",
    plural: "Polisevleri",
    hubPath: "/polisevleri/",
    accent: "rose",
    explainer:
      "Polisevleri, emniyet teşkilatı mensuplarına ve hak sahibi yakınlarına hizmet vermek üzere işletilen sosyal tesislerdir. Konaklama, yeme-içme ve sosyal etkinlik imkânları tesise göre değişir.",
    tips: [
      "Giriş ve konaklama şartlarını tesisle teyit edin.",
      "Kimlik veya kurum kartı ibrazı istenebilir.",
      "Yoğun dönemlerde erken arayarak müsaitliği sorun.",
    ],
    faq: [
      {
        q: "Polisevinde kimler kalabilir?",
        a: "Polisevleri öncelikle emniyet personeli ve yakınlarına hizmet verir. Misafir kabulü tesise ve döneme göre değişebilir; kesin bilgi için ilgili polisevini arayın.",
      },
      {
        q: "Rotalink polisevi rezervasyonu yapıyor mu?",
        a: "Hayır, Rotalink rezervasyon yapmaz. Tesis bilgilerini ve iletişim yollarını bir araya getiren bir rehberdir.",
      },
    ],
  },
  orduevi: {
    slug: "orduevi",
    source: "tesis",
    kind: "orduevi",
    singular: "orduevi",
    plural: "Orduevleri",
    hubPath: "/orduevleri/",
    accent: "emerald",
    explainer:
      "Orduevleri, askerî personel ve ailelerine hizmet veren sosyal tesislerdir. Konaklama, lokal ve sosyal alanlar sunabilir; giriş ve kullanım kuralları tesise göre değişir.",
    tips: [
      "Giriş izni ve konaklama koşullarını yola çıkmadan önce tesisten öğrenin.",
      "Kimlik ve kurum kartınızı yanınızda bulundurun.",
      "Tesislerin hizmet kapsamı ve çalışma düzeni farklılık gösterebilir.",
    ],
    faq: [
      {
        q: "Orduevine kimler girebilir?",
        a: "Orduevleri öncelikle askerî personel ve hak sahibi yakınlarına hizmet verir. Kabul kuralları tesise göre değişir; bilgi için doğrudan orduevini arayın.",
      },
      {
        q: "Orduevi bilgileri güncel mi?",
        a: "Bilgiler açık kaynaklardan derlenir. Adres veya telefon değişmiş olabilir; hatalı bir kayıt görürseniz iletişim sayfamızdan bize bildirebilirsiniz.",
      },
    ],
  },
  "belediye-sosyal-tesisleri": {
    slug: "belediye-sosyal-tesisleri",
    source: "sosyal",
    singular: "belediye sosyal tesisi",
    plural: "Belediye Sosyal Tesisleri",
    hubPath: "/belediye-sosyal-tesisleri/",
    accent: "violet",
    explainer:
      "Belediye sosyal tesisleri; kafe, restoran, çay bahçesi, dinlenme ve spor alanları gibi yeme-içme ve sosyal imkânlar sunan belediye işletmeleridir. Çoğu günübirlik kullanım içindir ve konaklama vaat etmez.",
    tips: [
      "Çalışma saatleri mevsime ve tesise göre değişebilir.",
      "Konum ve ulaşım için haritadan yol tarifi alabilirsiniz.",
      "Etkinlik veya rezervasyon gereken bölümler için tesisle iletişime geçin.",
    ],
    faq: [
      {
        q: "Belediye sosyal tesislerinde konaklama yapılır mı?",
        a: "Genellikle hayır. Belediye sosyal tesisleri çoğunlukla günübirlik yeme-içme, dinlenme ve sosyal etkinlik alanlarıdır. Konaklama arıyorsanız kamu misafirhaneleri veya öğretmenevi gibi tesislere bakın.",
      },
    ],
  },
  "gezilecek-yerler": {
    slug: "gezilecek-yerler",
    source: "gezi",
    singular: "gezilecek yer",
    plural: "Gezilecek Yerler",
    accent: "teal",
    explainer:
      "Bu liste, ilin öne çıkan doğal, tarihî ve kültürel gezi noktalarını bir araya getirir. Konaklama için kamu tesislerini, gezi için bu rotaları birlikte planlayabilirsiniz.",
    tips: [
      "Müze ve ören yerlerinin ziyaret saatlerini önceden kontrol edin.",
      "Haritadan yol tarifi alarak rotanızı ilçelere göre gruplayın.",
      "Mevsim koşullarını göz önünde bulundurun.",
    ],
    faq: [
      {
        q: "Gezilecek yerler listesi nasıl hazırlanıyor?",
        a: "Liste açık kaynaklardan derlenir ve sıralama bir tercih ya da puanlama anlamı taşımaz. Ziyaret saatleri ve koşulları değişebilir; güncel bilgiyi ilgili kurumun kaynaklarından doğrulayın.",
      },
    ],
  },
  "yemek-mekanlari": {
    slug: "yemek-mekanlari",
    source: "yemek",
    singular: "yemek mekanı",
    plural: "Yemek Mekanları",
    accent: "amber",
    explainer:
      "İlin yerel lezzetlerini sunan restoran, lokanta ve yemek mekânları listesi. Yolculuk planınıza uygun durakları belirlemek için konaklama ve gezi listeleriyle birlikte kullanabilirsiniz.",
    tips: [
      "Çalışma saatleri ve menü için mekânı önceden kontrol edin.",
      "Yoğun saatlerde rezervasyon gerekebilir; mekânla iletişime geçin.",
    ],
    faq: [
      {
        q: "Listedeki mekânlar için puan veya sıralama var mı?",
        a: "Hayır. Liste açık kaynaklardan derlenmiş bir rehberdir; sıralama bir değerlendirme anlamı taşımaz.",
      },
    ],
  },
};

export const CATEGORY_SLUGS = Object.keys(CATEGORY_DEFS) as CategorySlug[];

export function isCategorySlug(value: string): value is CategorySlug {
  return value in CATEGORY_DEFS;
}

/** Konaklama kategorileri (hub sayfaları ve sıralama için) */
export const LODGING_CATEGORY_SLUGS: CategorySlug[] = [
  "ogretmenevi",
  "kamu-misafirhanesi",
  "polisevi",
  "orduevi",
];

export function categoryTitle(def: CategoryDef, city: string, count: number): string {
  switch (def.slug) {
    case "ogretmenevi":
      return `${city} Öğretmenevleri: Adres, Konum ve Tesis Listesi`;
    case "kamu-misafirhanesi":
      return `${city} Kamu Misafirhaneleri: Adres ve Tesis Listesi`;
    case "polisevi":
      return `${city} Polisevleri: Adres ve Tesis Listesi`;
    case "orduevi":
      return `${city} Orduevleri: Adres ve Tesis Listesi`;
    case "belediye-sosyal-tesisleri":
      return `${city} Belediye Sosyal Tesisleri: Kafe, Restoran ve Dinlenme`;
    case "gezilecek-yerler":
      return `${city} Gezilecek Yerler: ${count} Gezi Noktası`;
    case "yemek-mekanlari":
      return `${city} Yemek Mekanları ve Restoranlar`;
  }
}

export function categoryH1(def: CategoryDef, city: string): string {
  return `${city} ${def.plural}`;
}

export function categoryDescription(def: CategoryDef, city: string, count: number): string {
  switch (def.slug) {
    case "ogretmenevi":
    case "kamu-misafirhanesi":
    case "polisevi":
    case "orduevi":
      return `${city} ilindeki ${count} ${def.singular} için adres, konum ve iletişim yolları. Kimler yararlanabilir, nelere dikkat edilmeli — Rotalink ${city} ${def.plural.toLocaleLowerCase("tr")} rehberi.`;
    case "belediye-sosyal-tesisleri":
      return `${city} ilindeki ${count} belediye sosyal tesisi: kafe, restoran ve dinlenme alanları. Adres ve konum bilgileriyle Rotalink ${city} rehberi.`;
    case "gezilecek-yerler":
      return `${city} ilinde gezilecek ${count} yer: doğal, tarihî ve kültürel rotalar. Konaklama için kamu tesisleriyle birlikte Rotalink ${city} gezi rehberi.`;
    case "yemek-mekanlari":
      return `${city} ilindeki ${count} yemek mekânı: yerel lezzetler ve restoranlar. Rotalink ${city} yemek rehberi.`;
  }
}

/** Hub sayfaları */
export type HubDef = {
  path: string;
  /** Hub sayfasının listeleyeceği il kategorisi (yoksa özet hub) */
  category?: CategorySlug;
  title: string;
  h1: string;
  description: string;
  lead: string;
};

export const HUB_DEFS: HubDef[] = [
  {
    path: "/kamu-sosyal-tesisleri/",
    title: "Kamu Sosyal Tesisleri: Misafirhane, Öğretmenevi, Polisevi ve Orduevi",
    h1: "Kamu Sosyal Tesisleri Rehberi",
    description:
      "Türkiye genelinde kamu misafirhaneleri, öğretmenevleri, polisevleri, orduevleri ve belediye sosyal tesisleri. İl il adres ve konum bilgileriyle tüm kamu sosyal tesisleri tek rehberde.",
    lead: "Kamu sosyal tesisleri; kamu kurumlarının, belediyelerin ve kamu personeline hizmet eden kuruluşların işlettiği konaklama, yeme-içme ve dinlenme tesisleridir. Rotalink bu tesisleri il il, tür tür bir araya getirir.",
  },
  {
    path: "/kamu-misafirhaneleri/",
    category: "kamu-misafirhanesi",
    title: "Kamu Misafirhaneleri: İl İl Tesis Listesi",
    h1: "Kamu Misafirhaneleri",
    description:
      "Türkiye'deki kamu misafirhaneleri il il listelenir: bakanlık, kurum, belediye ve üniversite misafirhaneleri. Adres, konum ve iletişim yolları Rotalink'te.",
    lead: "Kamu misafirhaneleri; farklı kurumlara bağlı konaklama tesisleridir. Aşağıdan ilinizi seçerek o ildeki kamu misafirhanelerini görebilirsiniz.",
  },
  {
    path: "/ogretmenevleri/",
    category: "ogretmenevi",
    title: "Öğretmenevleri: İl İl Öğretmenevi Listesi",
    h1: "Öğretmenevleri",
    description:
      "Türkiye'deki öğretmenevleri il il listelenir. Adres, konum ve iletişim yolları ile öğretmenevi bulmanın en kolay yolu Rotalink'te.",
    lead: "Öğretmenevleri; eğitim çalışanlarına ve tesisin kabul ettiği misafirlere hizmet veren konaklama ve sosyal tesislerdir. İlinizi seçerek öğretmenevlerini listeleyin.",
  },
  {
    path: "/polisevleri/",
    category: "polisevi",
    title: "Polisevleri: İl İl Polisevi Listesi",
    h1: "Polisevleri",
    description:
      "Türkiye'deki polisevleri il il listelenir. Adres, konum ve iletişim yolları ile polisevi bilgileri Rotalink'te.",
    lead: "Polisevleri; emniyet teşkilatı mensuplarına ve yakınlarına hizmet veren sosyal tesislerdir. İlinizi seçerek polisevlerini görün.",
  },
  {
    path: "/orduevleri/",
    category: "orduevi",
    title: "Orduevleri: İl İl Orduevi Listesi",
    h1: "Orduevleri",
    description:
      "Türkiye'deki orduevleri il il listelenir. Adres, konum ve iletişim yolları ile orduevi bilgileri Rotalink'te.",
    lead: "Orduevleri; askerî personel ve ailelerine hizmet veren sosyal tesislerdir. İlinizi seçerek orduevlerini görün.",
  },
  {
    path: "/belediye-sosyal-tesisleri/",
    category: "belediye-sosyal-tesisleri",
    title: "Belediye Sosyal Tesisleri: İl İl Kafe, Restoran ve Dinlenme Alanları",
    h1: "Belediye Sosyal Tesisleri",
    description:
      "Belediye sosyal tesisleri il il listelenir: kafe, restoran, çay bahçesi ve dinlenme alanları. Adres ve konum bilgileriyle Rotalink rehberi.",
    lead: "Belediye sosyal tesisleri; yeme-içme ve dinlenme için kullanılan, çoğunlukla günübirlik hizmet veren tesislerdir. İlinizi seçerek listeleyin.",
  },
];
