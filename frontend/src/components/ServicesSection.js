import { Building2, HardHat, Landmark, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ServicesSection() {
  const services = [
    {
      icon: Building2,
      title: "High-Rise Delivery",
      description: "Towers and mixed-use icons with precision scheduling. We manage complex vertical construction projects from foundation to finish.",
    },
    {
      icon: Landmark,
      title: "Infrastructure",
      description: "Bridges, transit and civil works engineered to last. Our infrastructure projects connect communities across continents.",
    },
    {
      icon: HardHat,
      title: "Industrial Works",
      description: "Plants, logistics hubs, and heavy facilities. We deliver industrial projects that power economies worldwide.",
    },
  ];

  return (
    <section id="services" className="relative py-24" data-testid="services-section">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Our Services
          </p>
          <h2 className="text-balance text-4xl font-bold text-foreground md:text-5xl">
            Integrated Construction Solutions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From concept to completion, we deliver comprehensive construction services
            tailored to your project’s unique requirements.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="glass-panel rounded-2xl p-8 transition-all hover:scale-[1.02]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-foreground">{service.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
