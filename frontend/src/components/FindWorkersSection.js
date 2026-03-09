import { WorkersMap } from "@/components/WorkersMap";
import { MapPin, Users } from "lucide-react";

export default function FindWorkersSection() {
  return (
    <section id="find-workers" className="relative py-24" data-testid="find-workers-section">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Find Workers Near You
          </p>
          <h2 className="text-balance text-4xl font-bold text-foreground md:text-5xl">
            Connect with Local Professionals
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover skilled construction workers, contractors, and equipment owners in your area. 
            Use the filters to find the perfect match for your project.
          </p>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden">
          <WorkersMap className="w-full h-[600px]" />
        </div>

        {/* Quick stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel rounded-xl p-4 text-center">
            <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">186K+</p>
            <p className="text-xs text-muted-foreground">Workers</p>
          </div>
          <div className="glass-panel rounded-xl p-4 text-center">
            <div className="w-6 h-6 rounded-full bg-amber-500 mx-auto mb-2 flex items-center justify-center">
              <span className="text-xs text-white font-bold">C</span>
            </div>
            <p className="text-2xl font-bold text-foreground">45K+</p>
            <p className="text-xs text-muted-foreground">Contractors</p>
          </div>
          <div className="glass-panel rounded-xl p-4 text-center">
            <div className="w-6 h-6 rounded-full bg-blue-500 mx-auto mb-2 flex items-center justify-center">
              <span className="text-xs text-white font-bold">E</span>
            </div>
            <p className="text-2xl font-bold text-foreground">8.2K+</p>
            <p className="text-xs text-muted-foreground">Equipment Owners</p>
          </div>
          <div className="glass-panel rounded-xl p-4 text-center">
            <div className="w-6 h-6 rounded-full bg-purple-500 mx-auto mb-2 flex items-center justify-center">
              <span className="text-xs text-white font-bold">P</span>
            </div>
            <p className="text-2xl font-bold text-foreground">12K+</p>
            <p className="text-xs text-muted-foreground">Project Managers</p>
          </div>
        </div>
      </div>
    </section>
  );
}
