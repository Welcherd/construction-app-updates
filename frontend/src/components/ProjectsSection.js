import { useState } from "react";
import { MapPin, ArrowRight } from "lucide-react";

const projects = [
  {
    title: "Horizon Tower",
    location: "Dubai, UAE",
    category: "Commercial",
    description:
      "A 72-story mixed-use skyscraper featuring cutting-edge sustainable design and panoramic observation decks.",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
  },
  {
    title: "Pacific Bridge",
    location: "Sydney, Australia",
    category: "Infrastructure",
    description:
      "A landmark suspension bridge spanning 1.2 km, connecting two major urban districts with advanced seismic engineering.",
    image: "https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=800&q=80",
  },
  {
    title: "Nordic Arena",
    location: "Oslo, Norway",
    category: "Sports & Leisure",
    description:
      "A 45,000-seat multi-purpose stadium with a retractable roof and zero-carbon energy systems.",
    image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80",
  },
];

export default function ProjectsSection() {
  const [active, setActive] = useState(0);

  return (
    <section id="projects" className="relative py-24" data-testid="projects-section">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Featured Work
          </p>
          <h2 className="text-balance text-4xl font-bold text-foreground md:text-5xl">
            Landmark Projects Across the Globe
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image display */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <img
              src={projects[active].image}
              alt={projects[active].title}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="inline-block rounded-full border border-primary/30 bg-primary/20 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm">
                {projects[active].category}
              </span>
              <h3 className="mt-3 text-2xl font-bold text-foreground">
                {projects[active].title}
              </h3>
              <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {projects[active].location}
              </div>
            </div>
          </div>

          {/* Project list */}
          <div className="flex flex-col gap-4">
            {projects.map((project, i) => (
              <button
                key={project.title}
                onClick={() => setActive(i)}
                className={`glass-panel flex items-start gap-4 rounded-xl p-6 text-left transition-all ${
                  active === i
                    ? "border-primary/30 ring-1 ring-primary/20"
                    : "hover:border-border/50"
                }`}
                data-testid={`project-btn-${i}`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                    active === i
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-foreground">
                    {project.title}
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                </div>
                <ArrowRight
                  className={`mt-1 h-5 w-5 shrink-0 transition-colors ${
                    active === i ? "text-primary" : "text-muted-foreground/40"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
