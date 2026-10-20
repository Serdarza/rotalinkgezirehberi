import { HubPage, hubMetadata } from "@/components/seo/HubPage";

export const metadata = hubMetadata("/ogretmenevleri/");

export default function OgretmenevleriPage() {
  return <HubPage path="/ogretmenevleri/" />;
}