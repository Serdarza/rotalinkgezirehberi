import Link from "next/link";
import Image from "next/image";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { slugifyCity } from "@/lib/utils";
import { POPULAR_CITIES } from "@/config/site";

const CITY_IMAGES: Record<string, string> = {
  İstanbul: "photo-1524231757912-21f4fe3a7200",
  Ankara: "/cities/ankara.png",
  İzmir: "/cities/izmir.png",
  Antalya: "/cities/antalya.png",
  Bursa: "/cities/bursa.png",
  Düzce: "/cities/duzce.png",
  Trabzon: "/cities/trabzon.png",
  Gaziantep: "/cities/gaziantep.png",
};

function getCityImageSrc(city: string): string {
  const image = CITY_IMAGES[city] ?? "photo-1524231757912-21f4fe3a7200";
  if (image.startsWith("/")) return image;
  return `https://images.unsplash.com/${image}?w=600&q=80`;
}

export function PopularCitiesSection() {
  return (
    <Section id="sehirler" className="bg-white dark:bg-slate-950">
      <Container>
        <SectionHeading
          eyebrow="Keşfet"
          title="Popüler Şehirler"
          description="En çok aranan illerde kamu tesislerini hemen keşfedin."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR_CITIES.map((city) => (
            <Link
              key={city}
              href={`/sehir/${slugifyCity(city)}`}
              className="group relative overflow-hidden rounded-3xl shadow-lg transition-transform hover:-translate-y-1"
            >
              <div className="aspect-[4/3] relative">
                <Image
                  src={getCityImageSrc(city)}
                  alt={city}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-4 left-4 text-xl font-bold text-white">{city}</span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
