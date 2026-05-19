import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Categories } from "@/components/landing/Categories";
import { PensShowcase } from "@/components/landing/PensShowcase";
import { Visualizer } from "@/components/landing/Visualizer";
import { Configurator } from "@/components/landing/Configurator";
import { SocialProof } from "@/components/landing/SocialProof";
import { FinalCTA, Footer } from "@/components/landing/FinalCTA";
import { MobileSticky } from "@/components/landing/MobileSticky";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Urgent Advertising — See Your Brand Printed Before You Order" },
      { name: "description", content: "Premium promotional products in Egypt. Upload your logo and instantly preview pens, mugs, USBs, notebooks and banners before printing. Live pricing in EGP." },
      { property: "og:title", content: "Urgent Advertising — Preview Before You Print" },
      { property: "og:description", content: "Upload your logo and instantly preview promotional products before printing. Custom pens, mugs, USBs and more." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <Categories />
        <PensShowcase />
        <Visualizer />
        <Configurator />
        <SocialProof />
        <FinalCTA />
      </main>
      <Footer />
      <MobileSticky />
    </div>
  );
}
