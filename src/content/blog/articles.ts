import type { ArticleContext } from "@/lib/blogStats";
import { formatCount } from "@/lib/blogStats";
import type { ArticleDef } from "./StructuredArticle";

/**
 * Veri tabanlı blog yazıları. Sayılar `ArticleContext` ile canlı veriden gelir;
 * fiyat, kontenjan veya kesin kabul şartı iddiası bulunmaz.
 */
export const ARTICLES: Record<string, (c: ArticleContext) => ArticleDef> = {
  "kamu-sosyal-tesisleri-nedir": (c) => ({
    intro: [
      "Kamu sosyal tesisleri; kamu kurumlarının, belediyelerin ve kamu personeline hizmet veren kuruluşların işlettiği konaklama, yeme-içme, dinlenme ve sosyal etkinlik tesislerinin genel adıdır. Tek bir mevzuata bağlı tek bir kategori değildir: her kurumun kendi kuralları, kabul koşulları ve hizmet kapsamı vardır.",
      `Rotalink'te ${c.cities} ilde ${formatCount(c.totalLodging)} konaklama tesisi ve ${formatCount(c.sosyal)} belediye sosyal tesisi listeleniyor. Bu rehber, kamu sosyal tesislerinin başlıca türlerini, kimlerin yararlanabildiğini ve doğru tesise nasıl ulaşılacağını özetler.`,
    ],
    sections: [
      {
        id: "turler",
        title: "Kamu sosyal tesislerinin başlıca türleri",
        bullets: [
          `Kamu misafirhaneleri: bakanlıklara, kamu kurumlarına, belediyelere ve üniversitelere bağlı konaklama tesisleri (Rotalink'te ${formatCount(c.misafirhane)} kayıt).`,
          `Öğretmenevleri: öncelikle eğitim çalışanlarına hizmet veren konaklama ve sosyal tesisler (${formatCount(c.ogretmenevi)} kayıt).`,
          `Polisevleri: emniyet teşkilatı mensuplarına ve yakınlarına yönelik tesisler (${formatCount(c.polisevi)} kayıt).`,
          `Orduevleri: askerî personel ve ailelerine yönelik sosyal tesisler (${formatCount(c.orduevi)} kayıt).`,
          `Belediye sosyal tesisleri: kafe, restoran, çay bahçesi ve dinlenme alanları (${formatCount(c.sosyal)} kayıt).`,
        ],
        links: [
          { href: "/kamu-misafirhaneleri/", label: "Kamu misafirhaneleri" },
          { href: "/ogretmenevleri/", label: "Öğretmenevleri" },
          { href: "/polisevleri/", label: "Polisevleri" },
          { href: "/orduevleri/", label: "Orduevleri" },
          { href: "/belediye-sosyal-tesisleri/", label: "Belediye sosyal tesisleri" },
        ],
      },
      {
        id: "kimler-yararlanir",
        title: "Kimler yararlanabilir?",
        paragraphs: [
          "Kamu sosyal tesisleri çoğunlukla bağlı oldukları kurumun personeline öncelik verir. Örneğin öğretmenevleri eğitim çalışanlarına, polisevleri emniyet mensuplarına, orduevleri askerî personele hizmet verecek şekilde düzenlenmiştir.",
          "Bazı tesisler müsaitlik durumuna ve kendi kurallarına göre diğer kamu çalışanlarını ya da misafirleri de kabul edebilir. Bu durum tesisten tesise, hatta dönemden döneme değiştiği için genel bir kural olarak almamak gerekir.",
        ],
        note: "Kabul koşullarını öğrenmenin en güvenilir yolu, yola çıkmadan önce tesisi doğrudan aramaktır.",
      },
      {
        id: "konaklama-gunubirlik",
        title: "Konaklama mı, günübirlik tesis mi?",
        paragraphs: [
          "Misafirhaneler, öğretmenevleri, polisevleri ve orduevleri konaklama imkânı sunabilen tesislerdir. Belediye sosyal tesisleri ise çoğunlukla günübirlik yeme-içme ve dinlenme için kullanılır; konaklama sunmaları beklenmez.",
          "Gezi planı yapıyorsanız konaklamayı bir kamu tesisinde, gün içi molaları belediye tesislerinde planlamak pratik bir yöntemdir.",
        ],
      },
      {
        id: "dogru-tesis",
        title: "Doğru tesisi bulmak için 5 adım",
        steps: [
          "Gideceğiniz ili ve yaklaşık tarih aralığınızı belirleyin.",
          "İlgili tesis türünü seçin: size uygun olan misafirhane, öğretmenevi, polisevi veya orduevi olabilir.",
          "Tesis sayfasında adresi ve harita konumunu kontrol ederek rotanıza uygun olanları ayırın.",
          "Seçtiğiniz tesisleri telefonla arayarak müsaitlik ve kabul koşullarını teyit edin.",
          "Yedek olarak aynı ildeki en az bir alternatif tesisi not alın.",
        ],
      },
      {
        id: "rotalink-nasil",
        title: "Rotalink'te nasıl kullanılır?",
        paragraphs: [
          "Rotalink'te il sayfasından başlayarak tesis türüne göre listelere ulaşabilir, her tesisin adres ve harita bilgisine bakabilirsiniz. Rotalink bir rezervasyon platformu değildir; amaç, doğru tesise hızlıca ulaşmanızı sağlamaktır.",
        ],
        links: [
          { href: "/kamu-sosyal-tesisleri/", label: "Tüm kamu sosyal tesisleri" },
          { href: "/sehir/ankara/", label: "Ankara" },
          { href: "/sehir/istanbul/", label: "İstanbul" },
          { href: "/sehir/izmir/", label: "İzmir" },
        ],
      },
      {
        id: "dikkat",
        title: "Dikkat edilmesi gerekenler",
        bullets: [
          "Kimlik ve gerekiyorsa kurum kimlik kartınızı yanınıza alın.",
          "Bayram ve yaz döneminde yoğunluk artar; mümkün olduğunca erken iletişime geçin.",
          "Listelerdeki bilgiler açık kaynaklardan derlenir; adres ve telefon değişmiş olabilir.",
          "Ücret bilgisi için yalnızca ilgili tesisin verdiği güncel bilgiye güvenin.",
        ],
      },
    ],
    faq: [
      {
        q: "Kamu sosyal tesisi ile kamu misafirhanesi aynı şey mi?",
        a: "Hayır. Kamu sosyal tesisleri daha geniş bir çatı terimdir; kamu misafirhaneleri bunun içindeki konaklama odaklı bir türdür. Öğretmenevleri, polisevleri, orduevleri ve belediye tesisleri de bu çatı altında değerlendirilir.",
      },
      {
        q: "Herkes kamu sosyal tesislerinden yararlanabilir mi?",
        a: "Genellikle hayır; çoğu tesis öncelikle bağlı olduğu kurum personeline hizmet verir. Bazı tesisler farklı gruplara da açık olabilir. Güncel koşullar için tesisi aramanız gerekir.",
      },
      {
        q: "Rotalink üzerinden rezervasyon yapabilir miyim?",
        a: "Hayır. Rotalink rezervasyon yapmaz; tesis bilgilerini ve iletişim yollarını bir araya getiren bir rehberdir.",
      },
    ],
    cta: {
      title: "Kamu sosyal tesislerini il il keşfedin",
      text: "Misafirhane, öğretmenevi, polisevi, orduevi ve belediye tesislerini tek rehberde görün.",
      links: [
        { href: "/kamu-sosyal-tesisleri/", label: "Tesisleri keşfet" },
        { href: "/indir/", label: "Uygulamayı indir" },
      ],
    },
  }),

  "kamu-misafirhanesi-nasil-bulunur": (c) => ({
    intro: [
      "Kamu misafirhanesi aramak, sıradan bir otel aramaktan farklıdır: tesisler farklı kurumlara bağlıdır, kabul edilen kişiler değişir ve çoğu zaman bilgiye telefonla ulaşmak gerekir.",
      `Rotalink'te şu anda ${formatCount(c.misafirhane)} kamu misafirhanesi kaydı bulunuyor. Aşağıdaki adımlar, doğru tesisi daha hızlı bulmanıza yardımcı olur.`,
    ],
    sections: [
      {
        id: "adimlar",
        title: "Adım adım misafirhane bulma",
        steps: [
          "Gideceğiniz ilin sayfasını açın ve kamu misafirhaneleri listesine geçin.",
          "Tesisin hangi kuruma bağlı olduğunu adından ve türünden anlayın (örneğin üniversite, belediye veya bakanlık misafirhanesi).",
          "Adres ve harita konumuna bakarak gideceğiniz yere uzaklığını değerlendirin.",
          "Tesisi telefonla arayın; müsaitlik, giriş saatleri ve kabul koşullarını sorun.",
          "Gerekli belgeleri (kimlik, kurum kimlik kartı, varsa görev yazısı) öğrenip hazırlayın.",
          "Yedek olarak aynı ilde ikinci bir seçenek belirleyin.",
        ],
        links: [{ href: "/kamu-misafirhaneleri/", label: "Kamu misafirhaneleri listesi" }],
      },
      {
        id: "kabul",
        title: "Kimler kabul edilir?",
        paragraphs: [
          "Misafirhaneler genellikle bağlı oldukları kurumun personeline öncelik verir. Resmî görevle seyahat edenler için kurum içi yazışma gerekebilir. Bazı misafirhaneler diğer kamu çalışanlarını da kabul edebilir.",
          "Bu koşullar kurumdan kuruma farklıdır ve değişebilir. Kendi durumunuza uygunluğu öğrenmek için tesisi doğrudan aramak en doğru yoldur.",
        ],
      },
      {
        id: "belgeler",
        title: "Hazırlanması gerekebilecek belgeler",
        bullets: [
          "Nüfus cüzdanı veya kimlik kartı",
          "Kurum kimlik kartı",
          "Resmî görev seyahatleri için görevlendirme yazısı",
          "Birlikte kalacak kişiler için kimlik bilgileri",
        ],
        note: "Bu liste örnektir; gerekli belgeleri tesis belirler.",
      },
      {
        id: "hatalar",
        title: "Sık yapılan hatalar",
        bullets: [
          "Tesisi aramadan yola çıkmak ve müsaitliği yerinde öğrenmeye çalışmak",
          "Eski bir telefon veya adrese güvenmek",
          "Yoğun dönemlerde son güne bırakmak",
          "Yalnızca tek seçenek belirlemek",
        ],
      },
      {
        id: "rotalink",
        title: "Rotalink bu süreçte nasıl yardımcı olur?",
        paragraphs: [
          "Rotalink, il il kamu misafirhanesi listesini, adres ve harita bilgisiyle sunar. Rezervasyon yapmaz; sizi doğru tesise ve iletişim bilgisine ulaştırır.",
        ],
        links: [
          { href: "/kamu-sosyal-tesisleri/", label: "Tüm kamu sosyal tesisleri" },
          { href: "/blog/kurum-misafirhaneleri-turleri/", label: "Kurum misafirhaneleri türleri" },
        ],
      },
    ],
    faq: [
      {
        q: "Kamu misafirhanesine nasıl rezervasyon yapılır?",
        a: "Rezervasyon süreci tesise ve bağlı olduğu kuruma göre değişir. Çoğu tesis telefonla veya yazışmayla başvuru alır. Rotalink rezervasyon yapmaz; iletişim yollarını sunar.",
      },
      {
        q: "Misafirhane listesi güncel mi?",
        a: "Liste açık kaynaklardan derlenir ve zamanla değişebilir. Yola çıkmadan önce tesisi aramanızı öneririz.",
      },
    ],
    cta: {
      title: "Misafirhaneleri il il inceleyin",
      text: "Gideceğiniz ildeki kamu misafirhanelerini adres ve harita bilgisiyle görün.",
      links: [
        { href: "/kamu-misafirhaneleri/", label: "Misafirhaneleri listele" },
        { href: "/indir/", label: "Uygulamayı indir" },
      ],
    },
  }),

  "kurum-misafirhaneleri-turleri": (c) => {
    const rows: [string, number][] = [
      ["DSİ misafirhaneleri", c.countTip("dsi")],
      ["Karayolları misafirhaneleri", c.countTip("karayolları")],
      ["Orman misafirhaneleri", c.countTip("orman")],
      ["PTT misafirhaneleri", c.countTip("ptt")],
      ["Maliye misafirhaneleri", c.countTip("maliye")],
      ["Çevre ve Şehircilik misafirhaneleri", c.countTip("çevre", "çşb")],
      ["Meteoroloji misafirhaneleri", c.countTip("meteoroloji")],
      ["TEDAŞ ve TEİAŞ misafirhaneleri", c.countTip("tedaş", "teiaş")],
      ["Sağlık müdürlüğü misafirhaneleri", c.countTip("sağlık")],
      ["Belediye misafirhaneleri ve konukevleri", c.countTip("belediye")],
      ["İl özel idaresi misafirhaneleri", c.countTip("özel idare")],
      ["TCDD misafirhaneleri", c.countTip("tcdd")],
      ["Üniversite misafirhaneleri ve konukevleri", c.countTip("üniversite")],
    ];
    const bullets = rows
      .filter(([, n]) => n > 0)
      .map(([label, n]) => `${label}: Rotalink'te ${formatCount(n)} kayıt`);
    return {
      intro: [
        "Kamu misafirhaneleri tek bir kurumun değil, onlarca farklı kurum ve kuruluşun işlettiği tesislerden oluşur. Bu çeşitlilik, hangi tesisin kimlere hizmet verdiğini anlamayı zorlaştırabilir.",
        `Rotalink'te ${formatCount(c.misafirhane)} misafirhane ve benzeri konaklama tesisi kayıtlıdır. Bu yazıda başlıca kurum misafirhanesi türlerine genel bir bakış sunuyoruz.`,
      ],
      sections: [
        {
          id: "turler",
          title: "Rotalink'te yer alan başlıca kurum misafirhaneleri",
          paragraphs: [
            "Aşağıdaki sayılar Rotalink veri tabanındaki güncel kayıtlara göredir. Bir tesisin türü, çoğunlukla bağlı olduğu kurumu gösterir.",
          ],
          bullets,
        },
        {
          id: "kimler",
          title: "Kimler kalabilir?",
          paragraphs: [
            "Kurum misafirhaneleri genellikle önce kendi personeli için ayrılmıştır. Müsaitlik olması durumunda diğer kamu çalışanlarının ya da farklı misafirlerin kabul edilip edilmeyeceği kurumun kurallarına bağlıdır.",
            "Aynı tür tesis bile illere göre farklı kurallarla çalışabilir; bu yüzden genel bir kalıp yerine ilgili tesisin kendi bilgisi esas alınmalıdır.",
          ],
        },
        {
          id: "iletisim",
          title: "İletişim kurarken nelere dikkat edilmeli?",
          bullets: [
            "Tesisin bağlı olduğu kurumu ve çalışma saatlerini öğrenin.",
            "Kabul koşullarını ve istenen belgeleri sorun.",
            "Giriş-çıkış saatlerini ve kalış süresi kurallarını netleştirin.",
            "Yazılı onay gerekiyorsa süreci önceden başlatın.",
          ],
        },
        {
          id: "rehber",
          title: "İl il misafirhane rehberi",
          paragraphs: [
            "Gideceğiniz ildeki misafirhaneleri görmek için kamu misafirhaneleri sayfasından ilinizi seçebilirsiniz.",
          ],
          links: [
            { href: "/kamu-misafirhaneleri/", label: "Kamu misafirhaneleri" },
            { href: "/blog/kamu-misafirhanesi-nasil-bulunur/", label: "Misafirhane nasıl bulunur?" },
          ],
        },
      ],
      faq: [
        {
          q: "DSİ, Karayolları veya Orman misafirhanesinde kimler kalabilir?",
          a: "Bu tesisler öncelikle bağlı oldukları kurumun personeline hizmet verir. Diğer kamu çalışanlarının kabulü tesise ve döneme göre değişebilir; kesin bilgi için tesisi arayın.",
        },
        {
          q: "Misafirhane türü listelerde nasıl belirleniyor?",
          a: "Tür bilgisi, tesisin bağlı olduğu kurum veya adlandırması esas alınarak veri tabanında tutulur. Hatalı bir kayıt görürseniz iletişim sayfamızdan bildirebilirsiniz.",
        },
      ],
      cta: {
        title: "Kurum misafirhanelerini keşfedin",
        text: "İl il kamu misafirhanelerini adres ve harita bilgisiyle inceleyin.",
        links: [
          { href: "/kamu-misafirhaneleri/", label: "Misafirhaneleri listele" },
          { href: "/indir/", label: "Uygulamayı indir" },
        ],
      },
    };
  },

  "uygulama-oteli-universite-konukevi-nedir": (c) => {
    const uygulama = c.countTip("uygulama");
    const konuk = c.countTip("konuk");
    return {
      intro: [
        "Kamu tesisleri arasında 'uygulama oteli' ve 'üniversite konukevi' gibi adlarla karşılaşabilirsiniz. Bu tesisler klasik misafirhanelerden farklı bir amaçla kurulmuş olabilir.",
        `Rotalink'te ${formatCount(uygulama)} uygulama oteli ve ${formatCount(konuk)} konukevi kaydı bulunuyor.`,
      ],
      sections: [
        {
          id: "uygulama-oteli",
          title: "Uygulama oteli nedir?",
          paragraphs: [
            "Uygulama otelleri, genellikle turizm ve otelcilik eğitimi veren okulların ya da yükseköğretim kurumlarının öğrencilerinin mesleki uygulama yapabilmesi için işlettiği konaklama tesisleridir.",
            "Bu tesislerin hizmet kapsamı, açık olduğu dönemler ve kabul ettiği misafir grubu okula veya kuruma göre değişir. Bazıları yalnızca belirli dönemlerde hizmet verebilir.",
          ],
        },
        {
          id: "konukevi",
          title: "Üniversite konukevi nedir?",
          paragraphs: [
            "Üniversite konukevleri, üniversitelerin akademik ve idari misafirlerini ağırlamak amacıyla işlettiği tesislerdir. Birçoğunda öncelik üniversite mensuplarına ve davetli konuklara verilir.",
            "Kabul koşulları üniversiteden üniversiteye farklıdır; bazı konukevleri farklı misafir gruplarına da açık olabilir.",
          ],
        },
        {
          id: "dikkat",
          title: "Kullanmadan önce dikkat edilecekler",
          bullets: [
            "Tesisin ilgili dönemde açık olup olmadığını teyit edin.",
            "Kabul edilen misafir gruplarını ve gerekli belgeleri sorun.",
            "Eğitim amaçlı çalışan tesislerde hizmet kapsamının sınırlı olabileceğini göz önünde bulundurun.",
            "İletişim için tesisin güncel telefonunu veya kurumun resmî kanalını kullanın.",
          ],
        },
        {
          id: "bulma",
          title: "Rotalink'te nasıl bulunur?",
          paragraphs: [
            "Kamu misafirhaneleri listesinde il seçerek üniversite ve okul bağlantılı tesisleri de görebilirsiniz.",
          ],
          links: [
            { href: "/kamu-misafirhaneleri/", label: "Kamu misafirhaneleri" },
            { href: "/kamu-sosyal-tesisleri/", label: "Tüm kamu sosyal tesisleri" },
          ],
        },
      ],
      faq: [
        {
          q: "Uygulama otelinde herkes kalabilir mi?",
          a: "Bu, tesise bağlıdır. Bazı uygulama otelleri geniş bir misafir grubuna açıkken bazıları sınırlı hizmet verebilir. Kesin bilgi için tesisi arayın.",
        },
        {
          q: "Üniversite konukevi ile misafirhane arasındaki fark nedir?",
          a: "Konukevleri genellikle üniversitenin misafirlerine yöneliktir; misafirhaneler ise daha geniş biçimde farklı kurumlara bağlı olabilir. İsimlendirme tesisten tesise değişir.",
        },
      ],
      cta: {
        title: "Konaklama seçeneklerini inceleyin",
        text: "İl il kamu misafirhanelerini ve konukevlerini adres ve harita bilgisiyle görün.",
        links: [
          { href: "/kamu-misafirhaneleri/", label: "Tesisleri keşfet" },
          { href: "/indir/", label: "Uygulamayı indir" },
        ],
      },
    };
  },

  "polisevi-rehberi": (c) => ({
    intro: [
      "Polisevleri, emniyet teşkilatı mensuplarına ve hak sahibi yakınlarına hizmet vermek üzere işletilen sosyal tesislerdir. Konaklama, yeme-içme ve sosyal etkinlik imkânları tesise göre değişir.",
      `Rotalink'te ${formatCount(c.polisevi)} polisevi kaydı bulunuyor. Bu rehber, polisevi arayanlara temel bilgileri ve pratik ipuçlarını sunar.`,
    ],
    sections: [
      {
        id: "nedir",
        title: "Polisevi nedir?",
        paragraphs: [
          "Polisevleri, emniyet camiasının sosyal ihtiyaçlarına yönelik tesislerdir. Birçoğu şehir merkezlerinde, bazıları ise tatil ve dinlenme bölgelerinde bulunur.",
          "Sunulan hizmetler; konaklama, lokal ve toplantı alanları gibi farklı imkânları içerebilir. Her polisevinin kapsamı farklıdır.",
        ],
      },
      {
        id: "kimler",
        title: "Kimler yararlanabilir?",
        paragraphs: [
          "Polisevleri öncelikle emniyet personeli ve yakınlarına hizmet verir. Misafir kabulü ve kullanım koşulları tesise ve döneme göre değişebilir.",
        ],
        note: "Kesin koşullar için ilgili polisevini doğrudan arayın.",
      },
      {
        id: "surec",
        title: "Konaklama sürecinde yapılacaklar",
        steps: [
          "Gideceğiniz ildeki polisevlerini listeden belirleyin.",
          "Tesisi arayıp müsaitlik ve kabul koşullarını öğrenin.",
          "İstenen belgeleri (kimlik, kurum kartı vb.) hazırlayın.",
          "Giriş-çıkış saatlerini ve kullanım kurallarını netleştirin.",
        ],
      },
      {
        id: "ipuclari",
        title: "Pratik ipuçları",
        bullets: [
          "Bayram ve yaz tatili gibi yoğun dönemlerde erken iletişime geçin.",
          "Aynı ilde alternatif bir tesis not alın.",
          "Adres ve telefonu yola çıkmadan önce teyit edin.",
        ],
        links: [
          { href: "/polisevleri/", label: "Polisevleri listesi" },
          { href: "/blog/orduevi-rehberi/", label: "Orduevi rehberi" },
        ],
      },
    ],
    faq: [
      {
        q: "Polisevinde sivil misafirler kalabilir mi?",
        a: "Bu tesise ve döneme göre değişir. Pek çok polisevi öncelikle emniyet personeline hizmet verir. Güncel koşullar için ilgili tesisi arayın.",
      },
      {
        q: "Polisevi rezervasyonunu Rotalink yapıyor mu?",
        a: "Hayır. Rotalink rezervasyon yapmaz; polisevi bilgilerini ve iletişim yollarını sunar.",
      },
    ],
    cta: {
      title: "Polisevlerini il il görün",
      text: "Adres ve harita bilgileriyle tüm polisevlerini inceleyin.",
      links: [
        { href: "/polisevleri/", label: "Polisevlerini listele" },
        { href: "/indir/", label: "Uygulamayı indir" },
      ],
    },
  }),

  "orduevi-rehberi": (c) => ({
    intro: [
      "Orduevleri, askerî personel ve ailelerine hizmet veren sosyal tesislerdir. Konaklama, lokal ve sosyal alan imkânları sunabilir; giriş ve kullanım kuralları tesise göre değişir.",
      `Rotalink'te ${formatCount(c.orduevi)} orduevi kaydı bulunuyor. Bu rehber, orduevi kullanmayı planlayanlar için temel bilgileri özetler.`,
    ],
    sections: [
      {
        id: "nedir",
        title: "Orduevi nedir?",
        paragraphs: [
          "Orduevleri, askerî personelin ve yakınlarının sosyal ve konaklama ihtiyaçları için işletilen tesislerdir. Büyük şehirlerde olduğu kadar garnizon bulunan farklı illerde de yer alabilirler.",
        ],
      },
      {
        id: "kimler",
        title: "Kimler yararlanabilir?",
        paragraphs: [
          "Orduevleri öncelikle askerî personele ve hak sahibi yakınlarına hizmet verir. Misafir kabulü ve giriş şartları tesise göre farklılık gösterebilir.",
        ],
        note: "Giriş izni ve kullanım koşullarını yola çıkmadan önce ilgili orduevinden öğrenin.",
      },
      {
        id: "hazirlik",
        title: "Yola çıkmadan önce yapılacaklar",
        steps: [
          "Gideceğiniz ildeki orduevlerini listeden belirleyin.",
          "Tesisi arayıp giriş ve konaklama koşullarını sorun.",
          "Kimlik ve kurum kartınızı yanınıza alın.",
          "Alternatif bir tesis belirleyin.",
        ],
        links: [{ href: "/orduevleri/", label: "Orduevleri listesi" }],
      },
      {
        id: "ipuclari",
        title: "Kullanım ipuçları",
        bullets: [
          "Tesislerin hizmet kapsamı ve çalışma düzeni farklı olabilir; önceden bilgi alın.",
          "Yoğun dönemlerde erken iletişime geçin.",
          "Adres ve telefon bilgilerini teyit edin.",
        ],
      },
    ],
    faq: [
      {
        q: "Orduevine kimler girebilir?",
        a: "Orduevleri öncelikle askerî personele ve yakınlarına hizmet verir. Kabul kuralları tesise göre değişir; kesin bilgi için orduevini arayın.",
      },
      {
        q: "Orduevi bilgileri ne kadar güncel?",
        a: "Bilgiler açık kaynaklardan derlenir ve değişmiş olabilir. Hatalı bir kayıt görürseniz iletişim sayfamızdan bildirebilirsiniz.",
      },
    ],
    cta: {
      title: "Orduevlerini il il görün",
      text: "Adres ve harita bilgileriyle tüm orduevlerini inceleyin.",
      links: [
        { href: "/orduevleri/", label: "Orduevlerini listele" },
        { href: "/indir/", label: "Uygulamayı indir" },
      ],
    },
  }),

  "belediye-sosyal-tesisleri-rehberi": (c) => ({
    intro: [
      "Belediye sosyal tesisleri; kafe, restoran, çay bahçesi, dinlenme ve spor alanları gibi yeme-içme ve sosyal imkânlar sunan belediye işletmeleridir. Şehir hayatının önemli mola noktalarından biridir.",
      `Rotalink'te ${formatCount(c.sosyal)} belediye sosyal tesisi kaydı bulunuyor.`,
    ],
    sections: [
      {
        id: "nedir",
        title: "Belediye sosyal tesisi nedir?",
        paragraphs: [
          "Belediyelerin işlettiği ya da işlettirdiği sosyal tesisler genellikle şehrin manzaralı noktalarında, parklarda veya mesire alanlarında yer alır. Hizmetler tesise göre farklılık gösterir.",
        ],
      },
      {
        id: "konaklama",
        title: "Konaklama için uygun mu?",
        paragraphs: [
          "Belediye sosyal tesislerinin çoğu günübirlik kullanım içindir; konaklama sunmaları beklenmez. Konaklama arıyorsanız kamu misafirhaneleri, öğretmenevleri, polisevleri ve orduevleri daha uygun seçeneklerdir.",
        ],
        links: [
          { href: "/kamu-misafirhaneleri/", label: "Kamu misafirhaneleri" },
          { href: "/ogretmenevleri/", label: "Öğretmenevleri" },
        ],
      },
      {
        id: "plan",
        title: "Gezi planına nasıl dahil edilir?",
        bullets: [
          "Gün içi mola ve yemek noktası olarak rotanıza ekleyin.",
          "Çalışma saatleri mevsime göre değişebilir; önceden kontrol edin.",
          "Konumu harita üzerinden kontrol edip ulaşım süresini hesaplayın.",
          "Etkinlik veya organizasyon için tesisle iletişime geçin.",
        ],
      },
      {
        id: "rotalink",
        title: "Rotalink'te nasıl bulunur?",
        paragraphs: [
          "Belediye sosyal tesislerini il il listeleyebilir, adres ve açıklama bilgilerine bakabilirsiniz.",
        ],
        links: [{ href: "/belediye-sosyal-tesisleri/", label: "Belediye sosyal tesisleri" }],
      },
    ],
    faq: [
      {
        q: "Belediye sosyal tesisleri herkese açık mı?",
        a: "Genellikle kafe ve restoran bölümleri halka açıktır. Bazı alanlar için farklı koşullar olabilir; tesise sormanız doğru olur.",
      },
      {
        q: "Çalışma saatleri nerede yazıyor?",
        a: "Çalışma saatleri tesise ve mevsime göre değişir. Güncel saat için tesisin kendi kaynaklarına başvurun.",
      },
    ],
    cta: {
      title: "Belediye tesislerini il il keşfedin",
      text: "Kafe, restoran ve dinlenme alanlarını adres bilgisiyle listeleyin.",
      links: [
        { href: "/belediye-sosyal-tesisleri/", label: "Tesisleri listele" },
        { href: "/indir/", label: "Uygulamayı indir" },
      ],
    },
  }),

  "bayram-ve-yaz-tatilinde-kamu-tesisi-planlama": () => ({
    intro: [
      "Bayram ve yaz tatili dönemlerinde kamu tesislerine talep artar. Erken planlama yapmayanlar için seçenekler hızla azalabilir. Bu rehber, yoğun dönemlerde daha rahat plan yapmanız için pratik öneriler sunar.",
    ],
    sections: [
      {
        id: "tarih",
        title: "Tatil tarihlerini önceden netleştirin",
        paragraphs: [
          "Resmî tatil ve idari izin günlerini erkenden öğrenmek, plan yapmanın ilk adımıdır. Tatil tarihleri yıldan yıla değişebilir.",
        ],
        links: [{ href: "/resmi-tatiller/", label: "Resmî tatil takvimi" }],
      },
      {
        id: "erken-iletisim",
        title: "Erken iletişime geçin",
        paragraphs: [
          "Yoğun dönemlerde tesislerin müsaitliği çabuk dolabilir. Gitmeyi düşündüğünüz tesisi mümkün olduğunca erken arayarak durumu öğrenin.",
          "Bazı tesisler yalnızca belirli tarih aralıkları için bilgi verebilir; bu nedenle farklı zamanlarda tekrar iletişime geçmek gerekebilir.",
        ],
      },
      {
        id: "alternatif",
        title: "Alternatif seçenekler belirleyin",
        bullets: [
          "Aynı ilde farklı türde tesisler (öğretmenevi, misafirhane, polisevi, orduevi) not alın.",
          "Merkez ilçe yerine çevre ilçelerdeki tesislere de bakın.",
          "Rota üzerindeki mola noktalarında konaklama seçeneklerini ayrıca değerlendirin.",
        ],
        links: [{ href: "/kamu-sosyal-tesisleri/", label: "Tüm tesisleri incele" }],
      },
      {
        id: "esneklik",
        title: "Esnek olun",
        paragraphs: [
          "Tarihlerde veya konumda esneklik, uygun yer bulma ihtimalinizi artırır. Hafta içi seyahat veya bir iki gün önce/sonra çıkmak seçeneklerinizi genişletebilir.",
        ],
      },
      {
        id: "gunubirlik",
        title: "Gün içi molalar için belediye tesisleri",
        paragraphs: [
          "Konaklamanızı bir kamu tesisinde planlarken gün içi yeme-içme için belediye sosyal tesislerine bakabilirsiniz.",
        ],
        links: [{ href: "/belediye-sosyal-tesisleri/", label: "Belediye sosyal tesisleri" }],
      },
    ],
    faq: [
      {
        q: "Bayramda kamu tesislerinde yer bulmak zor mu?",
        a: "Yoğun dönemlerde talep artabilir. Erken iletişime geçmek ve alternatif belirlemek yardımcı olur; kesin müsaitlik için tesisi arayın.",
      },
      {
        q: "Rotalink yer ayırtıyor mu?",
        a: "Hayır. Rotalink rezervasyon yapmaz; tesis bilgileri ve iletişim yollarını sunar.",
      },
    ],
    cta: {
      title: "Planınızı şimdi yapın",
      text: "Gideceğiniz ildeki tesisleri keşfedip erkenden iletişime geçin.",
      links: [
        { href: "/kamu-sosyal-tesisleri/", label: "Tesisleri keşfet" },
        { href: "/resmi-tatiller/", label: "Tatil takvimi" },
      ],
    },
  }),

  "kamu-personeli-seyahat-kontrol-listesi": () => ({
    intro: [
      "Kamu tesisinde konaklayacaksanız yola çıkmadan önce birkaç şeyi kontrol etmek, sürprizlerle karşılaşmanızı önler. Aşağıdaki 12 adımlık liste, seyahatinizi daha sağlıklı planlamanız için hazırlandı.",
    ],
    sections: [
      {
        id: "liste",
        title: "Yola çıkmadan önce 12 adım",
        steps: [
          "Gideceğiniz ili ve tarih aralığını netleştirin.",
          "Size uygun tesis türlerini belirleyin: misafirhane, öğretmenevi, polisevi veya orduevi.",
          "Tesislerin adres ve harita konumunu kontrol edin.",
          "Tesisleri telefonla arayarak müsaitliği sorun.",
          "Kabul koşullarını ve istenen belgeleri öğrenin.",
          "Kimlik ve kurum kimlik kartınızı hazırlayın.",
          "Giriş-çıkış saatlerini ve kalış süresi kurallarını netleştirin.",
          "Yedek olarak aynı ilde ikinci bir tesis belirleyin.",
          "Ulaşım ve park imkânlarını öğrenin.",
          "Rota üzerindeki mola noktalarını belirleyin.",
          "Konum ve telefon bilgilerini yanınıza (telefona) kaydedin.",
          "Yola çıkmadan bir gün önce müsaitliği tekrar teyit edin.",
        ],
      },
      {
        id: "belgeler",
        title: "Yanınıza alınacaklar",
        bullets: [
          "Kimlik veya kimlik kartı",
          "Kurum kimlik kartı",
          "Resmî görev seyahatleri için görevlendirme yazısı",
          "Rezervasyon veya görüşme notlarınız",
        ],
      },
      {
        id: "rotalink",
        title: "Rotalink ile hızlanın",
        paragraphs: [
          "Rotalink'te il il tesis listelerine, adres ve harita bilgilerine ulaşabilir; favorilerinizi kaydedebilirsiniz.",
        ],
        links: [
          { href: "/kamu-sosyal-tesisleri/", label: "Tesisleri keşfet" },
          { href: "/blog/kamu-misafirhanesi-nasil-bulunur/", label: "Misafirhane nasıl bulunur?" },
        ],
      },
    ],
    faq: [
      {
        q: "Tesisi aramak zorunlu mu?",
        a: "Zorunlu olmasa da kabul koşulları ve müsaitlik değişebildiği için yola çıkmadan aramanız önerilir.",
      },
    ],
    cta: {
      title: "Seyahatinizi planlayın",
      text: "Tesisleri il il inceleyin ve yola hazır çıkın.",
      links: [
        { href: "/kamu-sosyal-tesisleri/", label: "Tesisleri keşfet" },
        { href: "/indir/", label: "Uygulamayı indir" },
      ],
    },
  }),
};
