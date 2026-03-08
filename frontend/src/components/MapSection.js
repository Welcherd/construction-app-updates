import { InteractiveGoogleMap } from "@/components/InteractiveGoogleMap";
import { Globe } from "lucide-react";

export default function MapSection() {
  return (
    <section id="map" className="relative py-24" data-testid="map-section">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Global Network
          </p>
          <h2 className="text-balance text-4xl font-bold text-foreground md:text-5xl">
            Our Worldwide Presence
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore our active projects and equipment rental locations across 42 countries.
            Click on markers to view details.
          </p>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden">
          <InteractiveGoogleMap className="w-full h-[600px]" />
        </div>
      </div>
    </section>
  );
}
