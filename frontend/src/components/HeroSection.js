import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      {/* Semi-transparent overlay for readability */}
      <div className="absolute inset-0 bg-background/40" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-primary" data-testid="hero-subtitle">
          Construction Connection
        </p>
        <h1 className="text-balance text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl lg:text-8xl" data-testid="hero-title">
          Building the World,{" "}
          <span className="text-primary">One Landmark</span> at a Time
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
          From towering skyscrapers to critical infrastructure, we deliver
          precision engineering and construction solutions across 40+ countries.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            className="select-none px-8"
            data-testid="view-projects-btn"
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View Our Projects
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="select-none px-8 bg-secondary/50 backdrop-blur-sm"
            data-testid="learn-more-btn"
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Learn More
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <button
          onClick={() => document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Scroll down"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowDown className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
}
