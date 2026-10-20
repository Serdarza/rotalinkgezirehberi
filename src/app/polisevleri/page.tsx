import { HubPage, hubMetadata } from "@/components/seo/HubPage";

export const metadata = hubMetadata("/polisevleri/");

export default function PolisevleriPage() {
  return <HubPage path="/polisevleri/" />;
}