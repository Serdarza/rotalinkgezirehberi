# Rotalink — Profesyonel Web Platformu

Next.js ile geliştirilmiş, GitHub Pages üzerinde yayınlanan statik web sitesi.

## Yayınlama (Vercel gerekmez)

Site **statik export** olarak derlenir ve GitHub Actions ile `main` dalına otomatik deploy edilir:

1. Kaynak kod `nextjs` dalında tutulur
2. `nextjs` dalına push → GitHub Action build alır → `out/` klasörü `main` dalına yayınlanır
3. GitHub Pages kaynağı: **main** dalı, kök dizin
4. Özel alan adı: `rotalink.tr` (`public/CNAME`)

## Sayfalar

| Sayfa | Açıklama |
|-------|----------|
| `/` | Ana sayfa — hero, istatistikler, şehirler, tesisler, blog, SSS |
| `/indir` | Mobil: mağazaya yönlendirme · Masaüstü: QR kod + indirme |
| `/sehir/[sehir]` | Şehir bazlı arama sonuçları |
| `/hakkimizda`, `/iletisim`, `/blog` | Kurumsal sayfalar |
| Yasal sayfalar | KVKK, gizlilik, kullanım şartları, çerez politikası |

## Geliştirme

```bash
npm install
npm run dev
```

## Yerel statik önizleme

```bash
npm run build
npx serve out
```

## Ortam değişkeni

```env
NEXT_PUBLIC_SITE_URL=https://rotalink.tr
```

GitHub Action bu değeri otomatik ayarlar.
