import { AdSenseUnit } from "./AdSenseUnit";
import { Container } from "@/components/ui/Section";

export function AdSection() {
  return (
    <Container>
      <AdSenseUnit variant="banner" className="my-5" />
    </Container>
  );
}
