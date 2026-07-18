import Link from "next/link";
import Image from "next/image";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { slugifyCity } from "@/lib/utils";
import { POPULAR_CITIES } from "@/config/site";

const CITY_IMAGES: Record<string, string> = {
  İstanbul: "photo-1524231757912-21f4fe3a7200",
  Ankara: "photo-1601925260368-ae2f83cf8b7f",
  İzmir: "photo-1569336410210-0354a3de603e",
  Antalya: "photo-1506905925346-21bda4d32df4",
  Bursa: "photo-1590073242678-70eeef2182d7",
  Kayseri: "photo-1541438641304-7aa1bddedd0d",
  Trabzon: "photo-1605647540924-852290fbf7b2",
  Gaziantep: "photo-1591604129939-f1efa4d8f1f3",
};

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
                  src={`https://images.unsplash.com/${CITY_IMAGES[city] ?? "photo-1524231757912-21f4fe3a7200"}?w=600&q=80`}
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
