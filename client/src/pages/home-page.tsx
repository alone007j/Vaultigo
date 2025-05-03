import Hero from "@/components/ui/home/Hero";
import Features from "@/components/ui/home/Features";
import AiFeatures from "@/components/ui/home/AiFeatures";
import PricingSection from "@/components/ui/home/PricingSection";
import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

export default function HomePage() {
  const [location] = useLocation();
  const featuresRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  // Handle hash navigation
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        let targetRef;
        switch (hash) {
          case "#features":
            targetRef = featuresRef;
            break;
          case "#ai":
            targetRef = aiRef;
            break;
          case "#pricing":
            targetRef = pricingRef;
            break;
        }

        if (targetRef?.current) {
          targetRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <main className="flex-1">
        <Hero />
        <div ref={featuresRef} id="features">
          <Features />
        </div>
        <div ref={aiRef} id="ai">
          <AiFeatures />
        </div>
        <div ref={pricingRef} id="pricing">
          <PricingSection />
        </div>
      </main>
    </div>
  );
}
