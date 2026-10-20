/** Blog konu (kategori) sınıflandırması ve yazı listesi. */

export type BlogCategorySlug =
  | "kamu-sosyal-tesisleri"
  | "kamu-misafirhaneleri"
  | "ogretmenevleri"
  | "polisevleri-orduevleri"
  | "belediye-sosyal-tesisleri"
  | "seyahat-ipuclari";

export type BlogCategory = {
  slug: BlogCategorySlug;
  label: string;
  description: string;
  /** İlgili ülke geneli rehber sayfası */
  hubPath: string;
  hubLabel: string;
  accent: "blue" | "teal" | "amber" | "violet" | "rose" | "emerald";
};

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    slug: "kamu-sosyal-tesisleri",
    label: "Kamu Sosyal Tesisleri",
    description:
      "Kamu sosyal tesislerinin türleri, kimlerin yararlanabildiği ve doğru tesisi bulma yolları.",
    hubPath: "/kamu-sosyal-tesisleri/",
    hubLabel: "Tüm kamu sosyal tesisleri",
    accent: "blue",
  },
  {
    slug: "kamu-misafirhaneleri",
    label: "Kamu Misafirhaneleri",
    description:
      "Kurum misafirhaneleri, konukevleri ve uygulama otelleri hakkında pratik rehberler.",
    hubPath: "/kamu-misafirhaneleri/",
    hubLabel: "Kamu misafirhaneleri listesi",
    accent: "teal",
  },
  {
    slug: "ogretmenevleri",
    label: "Öğretmenevleri",
    description: "Öğretmenevlerinde konaklama, kabul koşulları ve planlama ipuçları.",
    hubPath: "/ogretmenevleri/",
    hubLabel: "Öğretmenevleri listesi",
    accent: "violet",
  },
  {
    slug: "polisevleri-orduevleri",
    label: "Polisevleri ve Orduevleri",
    description: "Polisevi ve orduevi tesisleri, giriş şartları ve kullanım önerileri.",
    hubPath: "/polisevleri/",
    hubLabel: "Polisevleri listesi",
    accent: "rose",
  },
  {
    slug: "belediye-sosyal-tesisleri",
    label: "Belediye Sosyal Tesisleri",
    description: "Belediyelerin kafe, restoran ve dinlenme tesisleri rehberi.",
    hubPath: "/belediye-sosyal-tesisleri/",
    hubLabel: "Belediye sosyal tesisleri listesi",
    accent: "amber",
  },
  {
    slug: "seyahat-ipuclari",
    label: "Seyahat İpuçları",
    description: "Kamu tesisleriyle seyahat planlamak için kontrol listeleri ve öneriler.",
    hubPath: "/kamu-sosyal-tesisleri/",
    hubLabel: "Kamu tesislerini keşfet",
    accent: "emerald",
  },
];

export function getBlogCategory(slug: BlogCategorySlug): BlogCategory {
  return BLOG_CATEGORIES.find((c) => c.slug === slug) ?? BLOG_CATEGORIES[0];
}

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  /** Yayın tarihi (ISO) */
  date: string;
  /** Son güncelleme (ISO) */
  updated?: string;
  category: BlogCategorySlug;
  /** Yaklaşık okuma süresi (dk) */
  readMinutes: number;
  featured?: boolean;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "kamu-sosyal-tesisleri-nedir",
    title: "Kamu Sosyal Tesisleri Nedir? Türleri, Kimler Yararlanır, Nasıl Bulunur",
    excerpt:
      "Misafirhane, öğretmenevi, polisevi, orduevi ve belediye tesisleri: kamu sosyal tesislerinin türleri, kullanım koşulları ve doğru tesisi bulmanın yolları.",
    date: "2026-10-20",
    category: "kamu-sosyal-tesisleri",
    readMinutes: 7,
    featured: true,
  },
  {
    slug: "kamu-misafirhanesi-nasil-bulunur",
    title: "Kamu Misafirhanesi Nasıl Bulunur ve Nasıl Başvurulur? Adım Adım Rehber",
    excerpt:
      "Kamu misafirhanesi arayanlar için adım adım rehber: doğru tesisi bulma, iletişim, gerekli belgeler ve sık yapılan hatalar.",
    date: "2026-10-20",
    category: "kamu-misafirhaneleri",
    readMinutes: 6,
    featured: true,
  },
  {
    slug: "kurum-misafirhaneleri-turleri",
    title: "Kurum Misafirhaneleri: DSİ, Karayolları, Orman, PTT ve Daha Fazlası",
    excerpt:
      "Kamu kurumlarına bağlı misafirhane türlerine genel bakış: hangi kurumların tesisi var, kimler öncelikli, nasıl iletişim kurulur?",
    date: "2026-10-20",
    category: "kamu-misafirhaneleri",
    readMinutes: 7,
  },
  {
    slug: "uygulama-oteli-universite-konukevi-nedir",
    title: "Uygulama Oteli ve Üniversite Konukevi Nedir? Kimler Kalabilir?",
    excerpt:
      "Meslek okulları ve üniversitelerin işlettiği uygulama otelleri ile konukevlerinin ne olduğu, nasıl çalıştığı ve nelere dikkat edilmesi gerektiği.",
    date: "2026-10-20",
    category: "kamu-misafirhaneleri",
    readMinutes: 5,
  },
  {
    slug: "polisevi-rehberi",
    title: "Polisevi Rehberi: Kimler Yararlanır, Nelere Dikkat Edilmeli?",
    excerpt:
      "Polisevlerinin ne olduğu, kimlerin yararlanabildiği, giriş ve konaklama süreci ile il il polisevi listesine nasıl ulaşılacağı.",
    date: "2026-10-20",
    category: "polisevleri-orduevleri",
    readMinutes: 5,
  },
  {
    slug: "orduevi-rehberi",
    title: "Orduevi Rehberi: Giriş Koşulları ve Kullanım İpuçları",
    excerpt:
      "Orduevlerinin sunduğu imkânlar, kimlerin yararlanabildiği ve yola çıkmadan önce yapılması gerekenler.",
    date: "2026-10-20",
    category: "polisevleri-orduevleri",
    readMinutes: 5,
  },
  {
    slug: "belediye-sosyal-tesisleri-rehberi",
    title: "Belediye Sosyal Tesisleri Rehberi: Kafe, Restoran ve Dinlenme Alanları",
    excerpt:
      "Belediye sosyal tesislerinin ne sunduğu, konaklama için uygun olup olmadığı ve il il nasıl bulunacağı.",
    date: "2026-10-20",
    category: "belediye-sosyal-tesisleri",
    readMinutes: 5,
  },
  {
    slug: "bayram-ve-yaz-tatilinde-kamu-tesisi-planlama",
    title: "Bayram ve Yaz Tatilinde Kamu Tesisi Planlama Rehberi",
    excerpt:
      "Yoğun dönemlerde kamu tesisinde yer bulmak için erken planlama, alternatif seçenekler ve iletişim ipuçları.",
    date: "2026-10-20",
    category: "seyahat-ipuclari",
    readMinutes: 6,
  },
  {
    slug: "kamu-personeli-seyahat-kontrol-listesi",
    title: "Kamu Personeli İçin Seyahat Kontrol Listesi: Yola Çıkmadan Önce 12 Adım",
    excerpt:
      "Kamu tesisinde konaklamadan önce kontrol edilecekler: belgeler, iletişim, ulaşım, harita ve yedek plan.",
    date: "2026-10-20",
    category: "seyahat-ipuclari",
    readMinutes: 5,
  },
  {
    slug: "kamu-misafirhanesi-rehberi",
    title: "Kamu Misafirhaneleri: Bilmeniz Gerekenler",
    excerpt: "Kamu misafirhanelerine nasıl erişilir, nelere dikkat edilmeli?",
    date: "2026-07-18",
    category: "kamu-misafirhaneleri",
    readMinutes: 4,
  },
  {
    slug: "ogretmenevi-konaklama",
    title: "Öğretmenevi ile Konaklama: Avantajlar ve Kullanım Koşulları",
    excerpt: "Öğretmenevlerinin avantajları ve kullanım koşulları.",
    date: "2026-07-18",
    category: "ogretmenevleri",
    readMinutes: 4,
  },
  {
    slug: "turkiye-seyahat-ipuclari",
    title: "Türkiye'de Kamu Tesisleriyle Seyahat",
    excerpt:
      "81 ilde kamu tesisleriyle pratik keşif rehberi: rezervasyon ipuçları ve önerilen rotalar.",
    date: "2026-07-18",
    category: "seyahat-ipuclari",
    readMinutes: 5,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

const byNewest = (a: BlogPost, b: BlogPost) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

export function postsByCategory(category: BlogCategorySlug): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.category === category).sort(byNewest);
}

/** Aynı kategoriden, sonra diğerlerinden ilgili yazılar. */
export function relatedPosts(slug: string, category: BlogCategorySlug, limit = 3): BlogPost[] {
  const others = BLOG_POSTS.filter((p) => p.slug !== slug).sort(byNewest);
  const same = others.filter((p) => p.category === category);
  const rest = others.filter((p) => p.category !== category);
  return [...same, ...rest].slice(0, limit);
}
