import { SITE } from "@/config/site";

/** Politikaların son güncellenme tarihi (sayfa başlığında gösterilir). */
export const LEGAL_UPDATED_AT = "26 Temmuz 2026";

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalPageConfig = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: LegalSection[];
};

const CONTACT_EMAIL = SITE.email;

export const LEGAL_PAGES: LegalPageConfig[] = [
  {
    slug: "gizlilik-politikasi",
    title: "Gizlilik Politikası",
    description:
      "Rotalink'in kişisel verileri nasıl işlediği, çerez kullanımı ve KVKK kapsamındaki haklarınız hakkında ayrıntılı bilgi.",
    intro:
      "Bu gizlilik politikası, rotalink.tr web sitesi ve Rotalink mobil uygulaması üzerinden toplanan bilgilerin hangi amaçlarla işlendiğini, kimlerle paylaşıldığını ve haklarınızı nasıl kullanabileceğinizi açıklar. Rotalink'i kullanarak bu politikada anlatılan uygulamaları kabul etmiş olursunuz.",
    sections: [
      {
        heading: "1. Veri sorumlusu ve iletişim",
        paragraphs: [
          `Rotalink, Türkiye genelindeki kamu misafirhaneleri, polisevleri, öğretmenevleri, orduevleri, belediye sosyal tesisleri, gezi ve yemek noktalarını derleyen bağımsız bir bilgilendirme platformudur. Herhangi bir kamu kurumunun resmi yayın organı değildir.`,
          `Gizlilikle ilgili tüm soru, talep ve şikâyetlerinizi ${CONTACT_EMAIL} adresine iletebilirsiniz. Başvurularınız en geç 30 gün içinde yanıtlanır.`,
        ],
      },
      {
        heading: "2. Topladığımız veriler",
        paragraphs: [
          "Rotalink'i kullanmak için üye olmanız veya kimlik bilgisi vermeniz gerekmez. Topladığımız veriler sınırlıdır:",
        ],
        bullets: [
          "Konum bilgisi: Yalnızca “size en yakın tesisler” ve hava durumu özelliklerinde, tarayıcınızın izin istemine onay vermeniz hâlinde kullanılır. Konumunuz sunucularımızda saklanmaz, kaydedilmez ve üçüncü kişilere satılmaz; hesaplama cihazınızda yapılır.",
          "İletişim formu verileri: Bize yazdığınızda ilettiğiniz ad, e-posta adresi ve mesaj içeriği yalnızca talebinizi yanıtlamak için kullanılır.",
          "Teknik veriler: Tarayıcı türü, işletim sistemi, yönlendiren adres ve ziyaret edilen sayfalar gibi anonim kayıtlar; site güvenliği ve performans ölçümü amacıyla işlenir.",
          "Tarayıcı depolaması: Tema tercihi, favori tesisler ve fiyat görüntüleme hakkı gibi tercihler yalnızca cihazınızda (localStorage / sessionStorage) tutulur.",
        ],
      },
      {
        heading: "3. Çerezler ve üçüncü taraf hizmetler",
        paragraphs: [
          "Sitemizde deneyimi iyileştirmek için çerezler kullanılabilir. Çerezler; tercihlerinizi hatırlamak ve site trafiğini ölçmek için kullanılır.",
          "Harita ve hava durumu gibi bazı özellikler dış sağlayıcılardan yüklenir. Bu sağlayıcılar kendi gizlilik politikalarını uygular.",
          "Tarayıcınızın ayarlarından çerezleri engelleyebilir veya silebilirsiniz; bu durumda sitenin bazı bölümleri beklendiği gibi çalışmayabilir.",
        ],
      },
      {
        heading: "4. Verilerin işlenme amacı ve hukuki dayanağı",
        bullets: [
          "Hizmetin sunulması ve iyileştirilmesi (meşru menfaat).",
          "Talep ve şikâyetlerin yanıtlanması (sözleşmenin kurulması / meşru menfaat).",
          "Konum tabanlı özelliklerin çalıştırılması (açık rıza).",
          "Reklam gösterimi ve ölçümü (açık rıza / meşru menfaat).",
          "Hukuki yükümlülüklerin yerine getirilmesi.",
        ],
      },
      {
        heading: "5. Verilerin paylaşımı",
        paragraphs: [
          "Kişisel verilerinizi satmayız, kiralamayız veya pazarlama amacıyla üçüncü kişilere aktarmayız. Veriler yalnızca hizmetin yürütülmesi için zorunlu olan altyapı sağlayıcılarıyla (barındırma) ve yasal zorunluluk hâlinde yetkili kamu kurumlarıyla paylaşılabilir.",
        ],
      },
      {
        heading: "6. Saklama süresi",
        paragraphs: [
          "İletişim formu üzerinden gönderilen mesajlar, talebin sonuçlanmasından itibaren en fazla 12 ay saklanır. Cihazınızda tutulan tercihler siz silene kadar kalır; tarayıcı verilerini temizleyerek dilediğiniz zaman kaldırabilirsiniz.",
        ],
      },
      {
        heading: "7. KVKK kapsamındaki haklarınız",
        paragraphs: [
          "6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacını öğrenme, eksik veya yanlış işlenmişse düzeltilmesini isteme, silinmesini veya yok edilmesini isteme ve işlemeye itiraz etme haklarına sahipsiniz.",
          `Bu haklarınızı kullanmak için ${CONTACT_EMAIL} adresine yazabilirsiniz.`,
        ],
      },
      {
        heading: "8. Çocukların gizliliği",
        paragraphs: [
          "Rotalink genel izleyici kitlesine yöneliktir ve 13 yaşın altındaki çocuklardan bilerek kişisel veri toplamaz. Böyle bir verinin iletildiğini fark edersek gecikmeden sileriz.",
        ],
      },
      {
        heading: "9. Politika değişiklikleri",
        paragraphs: [
          `Bu politika zaman zaman güncellenebilir. Güncel sürüm her zaman bu sayfada yayınlanır ve yukarıda son güncelleme tarihi belirtilir. Son güncelleme: ${LEGAL_UPDATED_AT}.`,
        ],
      },
    ],
  },
  {
    slug: "kullanim-sartlari",
    title: "Kullanım Şartları",
    description:
      "Rotalink web sitesi ve mobil uygulamasının kullanım koşulları, içerik doğruluğu, sorumluluk sınırları ve telif hakları.",
    intro:
      "Rotalink'i kullanarak aşağıdaki şartları kabul etmiş sayılırsınız. Şartları kabul etmiyorsanız lütfen platformu kullanmayınız.",
    sections: [
      {
        heading: "1. Hizmetin kapsamı",
        paragraphs: [
          "Rotalink; kamu misafirhaneleri, polisevleri, öğretmenevleri, orduevleri, belediye sosyal tesisleri, gezilecek yerler, yemek noktaları ve kamu personeline yönelik kampanyalar hakkında derlenmiş bilgi sunan ücretsiz bir rehberdir.",
          "Rotalink bir rezervasyon veya aracılık platformu değildir. Konaklama, giriş izni, fiyat ve müsaitlik konusundaki yetki tamamen ilgili tesise aittir.",
        ],
      },
      {
        heading: "2. Bilgilerin doğruluğu",
        paragraphs: [
          "Sitede yer alan görsel, adres, telefon, fiyat ve açıklama bilgileri kamuya açık kaynaklardan derlenmektedir. Bilgiler düzenli olarak gözden geçirilse de tesisler tarafından haber verilmeden değiştirilebilir.",
          "Bu nedenle yola çıkmadan önce ilgili tesisle doğrudan iletişime geçmenizi öneririz. Hatalı veya güncel olmayan bir bilgi fark ederseniz iletişim sayfasından bize bildirebilirsiniz; en kısa sürede düzeltilir.",
        ],
      },
      {
        heading: "3. Sorumluluğun sınırlandırılması",
        paragraphs: [
          "Rotalink, sitede yer alan bilgilere dayanarak yapılan seyahat, konaklama veya harcama tercihlerinden doğabilecek doğrudan ya da dolaylı zararlardan sorumlu tutulamaz. Platform “olduğu gibi” sunulmaktadır.",
          "Üçüncü taraf sitelere verilen bağlantılar yalnızca kolaylık amaçlıdır; bu sitelerin içeriğinden ve gizlilik uygulamalarından Rotalink sorumlu değildir.",
        ],
      },
      {
        heading: "4. Kampanya ve indirimler",
        paragraphs: [
          "Kampanyalar sayfasında listelenen indirim ve avantajlar, kampanyayı sunan kurum veya firma tarafından belirlenir; şartlar önceden haber verilmeden değişebilir. Yararlanma koşulları için ilgili kurumun resmi duyurusunu esas alınız.",
        ],
      },
      {
        heading: "5. Kabul edilebilir kullanım",
        bullets: [
          "Site içeriğinin otomatik araçlarla toplu olarak kopyalanması, kazınması veya yeniden yayınlanması yasaktır.",
          "Platformun işleyişini bozacak, aşırı yük oluşturacak veya güvenlik önlemlerini aşmaya yönelik girişimlerde bulunulamaz.",
          "İletişim formu üzerinden yanıltıcı, hakaret içeren veya hukuka aykırı içerik gönderilemez.",
        ],
      },
      {
        heading: "6. Fikri mülkiyet",
        paragraphs: [
          "Rotalink adı, logosu, arayüz tasarımı ve özgün metinleri Rotalink'e aittir. Tesislere ait isim ve görseller ilgili kurumların mülkiyetindedir ve yalnızca tanıtım/bilgilendirme amacıyla kullanılmaktadır. Hak sahibi olduğunuz bir içeriğin kaldırılmasını talep etmek için bizimle iletişime geçebilirsiniz.",
        ],
      },
      {
        heading: "7. Ortaklık bağlantıları",
        paragraphs: [
          "Sitede GetYourGuide gibi üçüncü taraf seyahat ortaklarının bağlantıları yer alabilir. Bu bağlantılar üzerinden yapılan rezervasyonlar ilgili platformun kendi koşullarına tabidir; Rotalink doğrudan satış yapmaz.",
        ],
      },
      {
        heading: "8. Değişiklikler ve yürürlük",
        paragraphs: [
          `Bu şartlar güncellenebilir; değişiklikler bu sayfada yayınlandığı anda yürürlüğe girer. Son güncelleme: ${LEGAL_UPDATED_AT}.`,
        ],
      },
    ],
  },
  {
    slug: "cerez-politikasi",
    title: "Çerez Politikası",
    description:
      "Rotalink'te kullanılan çerez türleri ve çerez tercihlerinizi nasıl yönetebileceğiniz.",
    intro:
      "Çerezler, ziyaret ettiğiniz siteler tarafından cihazınıza kaydedilen küçük metin dosyalarıdır. Bu politika Rotalink'te hangi çerezlerin, neden kullanıldığını açıklar.",
    sections: [
      {
        heading: "1. Kullandığımız çerez türleri",
        bullets: [
          "Zorunlu çerezler: Sitenin temel işlevleri için gereklidir. Tema tercihi ve oturum boyunca geçerli görüntüleme hakları bu kapsamdadır.",
          "Tercih çerezleri: Favori tesisler, son aranan iller gibi seçimlerinizi hatırlar. Bunlar cihazınızda saklanır, sunucuya gönderilmez.",
          "Ölçüm çerezleri: Hangi sayfaların ne kadar görüntülendiğini anonim olarak ölçmemizi sağlar.",
        ],
      },
      {
        heading: "2. Çerezleri yönetme",
        paragraphs: [
          "Tüm modern tarayıcılar çerezleri görüntüleme, silme ve engelleme imkânı sunar. Chrome, Safari, Firefox ve Edge için ilgili ayarlar “Gizlilik ve güvenlik” bölümünde yer alır.",
          "Çerezleri tamamen engellerseniz tema tercihi, favoriler ve konum tabanlı öneriler gibi özellikler çalışmayabilir.",
        ],
      },
      {
        heading: "3. Üçüncü taraf içerikler",
        paragraphs: [
          "Harita (OpenStreetMap tabanlı) ve hava durumu servisi gibi bazı özellikler dış sağlayıcılardan yüklenir. Bu sağlayıcılar kendi çerez politikalarını uygular.",
        ],
      },
      {
        heading: "4. Güncellemeler",
        paragraphs: [
          `Bu çerez politikası gerektikçe güncellenir. Son güncelleme: ${LEGAL_UPDATED_AT}.`,
        ],
      },
    ],
  },
];

export const PRIVACY_POLICY_PATH = "/gizlilik-politikasi";
