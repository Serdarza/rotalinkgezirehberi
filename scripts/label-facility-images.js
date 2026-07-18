/**
 * Kategori görsellerinin üzerine tesis tipi etiketini işler.
 * Kullanım: node scripts/label-facility-images.js
 */
const fs = require("fs");
const sharp = require("sharp");

const items = [
  { file: "public/facilities/orduevi.jpg", label: "ORDUEVİ" },
  { file: "public/facilities/polisevi.jpg", label: "POLİSEVİ" },
  { file: "public/facilities/ogretmenevi.jpg", label: "ÖĞRETMENEVİ" },
  { file: "public/facilities/misafirhane.jpg", label: "MİSAFİRHANE" },
];

async function main() {
  for (const { file, label } of items) {
    // Windows'ta dosya kilidi sorununu önlemek için önce belleğe oku
    const img = sharp(fs.readFileSync(file));
    const { width: w, height: h } = await img.metadata();
    const bandH = Math.round(h * 0.3);
    const fontSize = Math.round(w / 13);
    const textY = h - Math.round(bandH * 0.28);

    const svg = Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="black" stop-opacity="0"/>
      <stop offset="1" stop-color="black" stop-opacity="0.72"/>
    </linearGradient>
  </defs>
  <rect x="0" y="${h - bandH}" width="${w}" height="${bandH}" fill="url(#g)"/>
  <text x="50%" y="${textY}" text-anchor="middle"
    font-family="Segoe UI, Arial, sans-serif" font-size="${fontSize}" font-weight="800"
    letter-spacing="6" fill="white" stroke="black" stroke-opacity="0.25" stroke-width="2">${label}</text>
</svg>`);

    const out = await img
      .composite([{ input: svg }])
      .jpeg({ quality: 74, mozjpeg: true })
      .toBuffer();
    fs.writeFileSync(file, out);
    console.log(file, out.length);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
