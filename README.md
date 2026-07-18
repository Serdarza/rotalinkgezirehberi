# Rotalink Next.js App

Production-ready download page and landing experience for Rotalink.

## Routes

| Route | Behavior |
|-------|----------|
| `/` | Premium desktop landing page |
| `/indir` | Smart download — auto-redirect on mobile, full page on desktop |

## Device detection

- **Android** → Google Play (2s spinner, then redirect)
- **iOS** → App Store (2s spinner, then redirect)
- **Desktop** → Download page with QR code + store buttons

## Configuration

Edit `src/config/downloads.ts` for store URLs and site settings.

Set environment variable:

```env
NEXT_PUBLIC_SITE_URL=https://rotalink.tr
```

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000/indir](http://localhost:3000/indir)

## Build

```bash
npm run build
npm start
```
