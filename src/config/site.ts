export const SITE = {
  name: "Rotalink",
  title: "Rotalink — Kamu Seyahatinin En Akıllı Yolu",
  description:
    "Kamu misafirhaneleri, polisevleri, öğretmenevleri, orduevleri ve yüzlerce kamu sosyal tesisini tek platformda keşfedin.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://rotalink.tr",
  locale: "tr_TR",
  email: "rotalinkinfo@gmail.com",
} as const;

export const COLORS = {
  primary: "#0F62FE",
  secondary: "#14B8A6",
  success: "#22C55E",
  background: "#FFFFFF",
  dark: "#0F172A",
} as const;

export const POPULAR_CITIES = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Antalya",
  "Bursa",
  "Düzce",
  "Trabzon",
  "Gaziantep",
] as const;

export const FACILITY_CATEGORIES = [
  {
    key: "misafirhane" as const,
    title: "Kamu Misafirhaneleri",
    description: "Uygun fiyatlı konaklama imkânları sunan kamu misafirhaneleri.",
    tips: ["Kamu Misafirhanesi", "Karayolları Misafirhanesi"],
    icon: "Building2",
  },
  {
    key: "polisevi" as const,
    title: "Polisevleri",
    description: "Emniyet personeli ve misafirleri için polis evleri.",
    tips: ["Polisevi"],
    icon: "Shield",
  },
  {
    key: "ogretmenevi" as const,
    title: "Öğretmenevleri",
    description: "Öğretmenler ve misafirler için konaklama tesisleri.",
    tips: ["Öğretmenevi"],
    icon: "GraduationCap",
  },
  {
    key: "orduevi" as const,
    title: "Orduevleri",
    description: "Askeri personel ve aileleri için orduevi tesisleri.",
    tips: ["Orduevi"],
    icon: "Landmark",
  },
  {
    key: "askeri" as const,
    title: "Askeri Sosyal Tesisler",
    description: "Jandarma ve askeri sosyal tesis imkânları.",
    tips: ["Orduevi"],
    icon: "Medal",
  },
] as const;

export const FEATURES = [
  { title: "Haritalı Yol Tarifi", icon: "MapPin" },
  { title: "Telefon Bilgileri", icon: "Phone" },
  { title: "Belediye Sosyal Tesisleri", icon: "Building2" },
  { title: "Gezi Yerleri", icon: "Compass" },
  { title: "Favorilere Ekle", icon: "Heart" },
  { title: "Hızlı Arama", icon: "Search" },
  { title: "Filtreleme", icon: "SlidersHorizontal" },
  { title: "Anlık Güncellemeler", icon: "RefreshCw" },
] as const;

export const TESTIMONIALS = [
  {
    name: "Mehmet K.",
    role: "Öğretmen",
    text: "Yolculuklarımda öğretmenevlerini anında bulabiliyorum. Telefon ve konum bilgisi tek tıkla elime geliyor.",
    rating: 5,
  },
  {
    name: "Ayşe D.",
    role: "Emekli Memur",
    text: "Kamu misafirhanelerini şehir şehir listelemesi çok pratik. Güvenilir ve güncel bir kaynak.",
    rating: 5,
  },
  {
    name: "Can T.",
    role: "Seyahat Tutkunu",
    text: "Polisevi ve orduevi bilgilerine hızlıca ulaşıyorum. Rotalink seyahatlerimi kolaylaştırdı.",
    rating: 5,
  },
] as const;

export const FAQ_ITEMS = [
  {
    q: "Rotalink ücretsiz mi?",
    a: "Evet, Rotalink web sitesi ve mobil uygulaması kamu tesis bilgilerine ücretsiz erişim sağlar.",
  },
  {
    q: "Hangi tesisler listeleniyor?",
    a: "Kamu misafirhaneleri, polisevleri, öğretmenevleri, orduevleri ve askeri sosyal tesisler dahil olmak üzere yüzlerce kamu tesisi.",
  },
  {
    q: "Bilgiler ne sıklıkla güncellenir?",
    a: "Tesis verileri düzenli olarak güncellenir. Hatalı bilgi için iletişim formundan bize ulaşabilirsiniz.",
  },
  {
    q: "Rezervasyon yapabilir miyim?",
    a: "Rotalink doğrudan rezervasyon yapmaz; tesis telefon bilgileriyle yetkiliye ulaşmanızı sağlar.",
  },
  {
    q: "Mobil uygulama var mı?",
    a: "Evet, Google Play ve App Store'dan Rotalink uygulamasını indirebilirsiniz.",
  },
] as const;

export const BLOG_POSTS = [
  {
    slug: "kamu-misafirhanesi-rehberi",
    title: "Kamu Misafirhaneleri: Bilmeniz Gerekenler",
    excerpt: "Kamu misafirhanelerine nasıl erişilir, nelere dikkat edilmeli?",
    date: "2026-03-01",
  },
  {
    slug: "ogretmenevi-konaklama",
    title: "Öğretmenevi ile Ekonomik Konaklama",
    excerpt: "Öğretmenevlerinin avantajları ve kullanım koşulları.",
    date: "2026-02-15",
  },
  {
    slug: "turkiye-seyahat-ipuclari",
    title: "Türkiye'de Kamu Tesisleriyle Seyahat",
    excerpt:
      "81 ilde kamu tesisleriyle pratik keşif rehberi: fiyat aralıkları, rezervasyon ipuçları ve önerilen rotalar.",
    date: "2026-01-20",
  },
] as const;

export const FOOTER_LINKS = {
  kurumsal: [
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/iletisim", label: "İletişim" },
    { href: "/blog", label: "Blog" },
    { href: "/sik-sorulan-sorular", label: "Sık Sorulan Sorular" },
  ],
  yasal: [
    { href: "/kvkk", label: "KVKK" },
    { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
    { href: "/kullanim-sartlari", label: "Kullanım Şartları" },
    { href: "/cerez-politikasi", label: "Çerez Politikası" },
  ],
} as const;
