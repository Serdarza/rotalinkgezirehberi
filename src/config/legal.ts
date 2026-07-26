export const PRIVACY_POLICY_URL =
  "https://docs.google.com/document/d/1_AsP4bDt7BuKebFhpLY-657rf31Bmy_hi-57zYo2jgU/edit?tab=t.0";

export const LEGAL_PAGES = [
  {
    slug: "gizlilik-politikasi",
    title: "Gizlilik Politikası",
    externalUrl: PRIVACY_POLICY_URL,
    content: [
      "Gizlilik politikamız Google Docs üzerinde yayınlanmaktadır.",
      "Sayfa otomatik yönlendirilmezse aşağıdaki bağlantıyı kullanın.",
    ],
  },
  {
    slug: "kullanim-sartlari",
    title: "Kullanım Şartları",
    content: [
      "Rotalink platformunu kullanarak bu şartları kabul etmiş sayılırsınız.",
      "Sunulan bilgiler bilgilendirme amaçlıdır.",
    ],
  },
  {
    slug: "cerez-politikasi",
    title: "Çerez Politikası",
    content: [
      "Sitemizde deneyimi iyileştirmek için çerezler kullanılmaktadır.",
      "Analitik ve reklam çerezleri için onayınız alınabilir.",
    ],
  },
] as const;
