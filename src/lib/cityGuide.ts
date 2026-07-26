/**
 * İl sayfaları için özgün rehber metni.
 * Sayılar canlı veriye dayanır; rezervasyon/ücret iddiası uydurulmaz.
 */

export type CityGuideStats = {
  konaklama: number;
  orduevi: number;
  polisevi: number;
  ogretmenevi: number;
  misafirhane: number;
  gezi: number;
  yemek: number;
  belediye: number;
};

export type CityGuide = {
  title: string;
  lead: string;
  paragraphs: string[];
  tips: string[];
};

function tipCounts(stats: CityGuideStats) {
  const parts: string[] = [];
  if (stats.ogretmenevi > 0) {
    parts.push(
      `${stats.ogretmenevi} öğretmenevi`
    );
  }
  if (stats.misafirhane > 0) {
    parts.push(`${stats.misafirhane} kamu misafirhanesi`);
  }
  if (stats.polisevi > 0) {
    parts.push(`${stats.polisevi} polisevi`);
  }
  if (stats.orduevi > 0) {
    parts.push(`${stats.orduevi} orduevi`);
  }
  if (!parts.length && stats.konaklama > 0) {
    parts.push(`${stats.konaklama} konaklama tesisi`);
  }
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} ve ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")} ve ${parts[parts.length - 1]}`;
}

function joinTr(items: string[]) {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} ve ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} ve ${items[items.length - 1]}`;
}

/**
 * Şehir + gerçek sayılara göre 2–3 paragraf rehber üretir.
 * Her il için sayılar farklı olduğu için metin de özgünleşir.
 */
export function buildCityGuide(city: string, stats: CityGuideStats): CityGuide {
  const title = `${city} kamu tesisleri ve gezi rehberi`;

  const lead =
    stats.konaklama > 0
      ? `${city}’da Rotalink kaydında ${stats.konaklama} kamu konaklama tesisi bulunmaktadır: ${tipCounts(stats)}.`
      : `${city} için konaklama listesi güncellenirken gezi, yemek ve belediye sosyal tesisleri aşağıda yer alır.`;

  const p1Parts: string[] = [
    `${city} seyahatinde kamu misafirhanesi, öğretmenevi, polisevi veya orduevi arıyorsanız bu sayfadaki Konaklama sekmesinden tesis adına, ilçesine ve iletişim bilgisine ulaşabilirsiniz.`,
  ];

  if (stats.ogretmenevi > 0) {
    p1Parts.push(
      `Öğretmenevleri öncelikle Millî Eğitim personeline hizmet eder; birçok tesiste diğer kamu personeli de misafir olarak konaklayabilir ancak şartlar tesise göre değişir.`
    );
  }
  if (stats.polisevi > 0 || stats.orduevi > 0) {
    const who: string[] = [];
    if (stats.polisevi > 0) who.push("polisevleri emniyet personeli");
    if (stats.orduevi > 0) who.push("orduevleri askerî personel");
    p1Parts.push(
      `${joinTr(who)} ve hak sahibi yakınları için düzenlenmiştir; giriş ve ücret kurallarını yola çıkmadan önce tesisle teyit edin.`
    );
  }
  if (stats.misafirhane > 0) {
    p1Parts.push(
      `Kamu misafirhaneleri farklı kurumlara bağlı olabilir; müsaitlik ve ücret için doğrudan aramak en güvenli yoldur.`
    );
  }

  const extras: string[] = [];
  if (stats.gezi > 0) {
    extras.push(
      `Gezi sekmesinde ${stats.gezi} gezilecek yer kaydı bulunur`
    );
  }
  if (stats.yemek > 0) {
    extras.push(
      `Yemek sekmesinde ${stats.yemek} yemek mekânı listelenir`
    );
  }
  if (stats.belediye > 0) {
    extras.push(
      `Belediye sekmesinde ${stats.belediye} belediye sosyal tesisi (kafe, restoran, dinlenme alanı) yer alır`
    );
  }

  const p2 =
    extras.length > 0
      ? `${city} yalnızca konaklama ile sınırlı değildir: ${joinTr(extras)}. Bu kayıtlar açık kaynaklardan derlenir; adres ve açıklamalar değişebileceği için güncel bilgiyi tesis veya yerel belediye kaynaklarından doğrulamanız önerilir.`
      : `${city} için gezi ve yemek listeleri zamanla genişletilmektedir. Eksik veya hatalı bir kayıt görürseniz iletişim formundan bildirebilirsiniz.`;

  const p3 =
    `Rotalink rezervasyon yapmaz ve oda tahsis etmez; yalnızca bilgilendirme amaçlı bir rehberdir. Özellikle bayram ve yaz döneminde ${city} kamu tesisleri hızla dolabildiği için erken arama ve alternatif ilçe seçeneklerini birlikte planlamak faydalıdır.`;

  const tips: string[] = [
    "Yola çıkmadan önce tesis telefonunu arayın; müsaitlik ve giriş koşulları değişebilir.",
    "Kimlik / kurum kartı ibrazı istenebilir; yanınızda bulundurun.",
    "Listelenen fiyat ve görseller açık kaynaklıdır; kesin ücret için tesis yetkilisine sorun.",
  ];

  if (stats.belediye > 0) {
    tips.push(
      `${city} belediye sosyal tesisleri çoğunlukla günübirlik yeme-içme ve dinlenme içindir; konaklama vaat etmez.`
    );
  }

  return {
    title,
    lead,
    paragraphs: [p1Parts.join(" "), p2, p3],
    tips: tips.slice(0, 4),
  };
}

export function countFacilityTips(tesis: { tip?: string | null }[]) {
  let orduevi = 0;
  let polisevi = 0;
  let ogretmenevi = 0;
  let misafirhane = 0;

  for (const t of tesis) {
    const n = String(t.tip ?? "")
      .trim()
      .toLocaleLowerCase("tr");
    if (n.includes("orduevi")) orduevi += 1;
    else if (n.includes("polisevi")) polisevi += 1;
    else if (n.includes("öğretmenevi") || n.includes("ogretmenevi"))
      ogretmenevi += 1;
    else misafirhane += 1;
  }

  return { orduevi, polisevi, ogretmenevi, misafirhane };
}
