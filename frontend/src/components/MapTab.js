import { useState, useCallback } from "react";
import { PullToRefresh } from "@/components/PullToRefresh";
import { InteractiveGoogleMap } from "@/components/InteractiveGoogleMap";
import { Map, List, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export function MapTab() {
  const [viewMode, setViewMode] = useState("map"); // "map" or "list"

  const handleRefresh = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 1200));
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Header with view toggle */}
      <div className="glass-panel border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Global Map</h2>
            <p className="text-xs text-muted-foreground">
              Projects & equipment worldwide
            </p>
          </div>
          <div className="flex gap-1 bg-background/50 rounded-lg p-1">
            <button
              onClick={() => setViewMode("map")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "map"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              data-testid="view-map-btn"
            >
              <Map className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              data-testid="view-list-btn"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Map View */}
      {viewMode === "map" && (
        <div className="flex-1">
          <InteractiveGoogleMap className="w-full h-full" />
        </div>
      )}

      {/* List View - uses PullToRefresh */}
      {viewMode === "list" && (
        <PullToRefresh onRefresh={handleRefresh} className="flex-1">
          <div className="p-4 space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Projects
            </h3>
            {[
              { name: "Horizon Tower", location: "Dubai, UAE", status: "In Progress" },
              { name: "Pacific Bridge", location: "Sydney, Australia", status: "In Progress" },
              { name: "Nordic Arena", location: "Oslo, Norway", status: "Planning" },
              { name: "Mumbai Metro Line 5", location: "Mumbai, India", status: "In Progress" },
              { name: "Green Valley Residences", location: "Austin, TX", status: "Completed" },
            ].map((project, i) => (
              <div key={i} className="glass-panel rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">{project.name}</h4>
                    <p className="text-xs text-muted-foreground">{project.location}</p>
                  </div>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    project.status === "Completed" && "bg-green-500/20 text-green-400",
                    project.status === "In Progress" && "bg-yellow-500/20 text-yellow-400",
                    project.status === "Planning" && "bg-blue-500/20 text-blue-400"
                  )}>
                    {project.status}
                  </span>
                </div>
              </div>
            ))}

            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-6">
              Equipment Locations
            </h3>
            {[
              { name: "CAT 320 Excavator", owner: "Lone Star Rentals", location: "Austin, TX" },
              { name: "Liebherr LTM 1100 Crane", owner: "Deutsche Bau Vermietung", location: "Berlin, Germany" },
              { name: "Komatsu PC200 Excavator", owner: "Sakura Equipment Co.", location: "Tokyo, Japan" },
              { name: "XCMG QY50K Truck Crane", owner: "Gulf Heavy Equipment", location: "Dubai, UAE" },
              { name: "Bobcat S650 Skid Steer", owner: "Thames Plant Hire", location: "London, UK" },
            ].map((eq, i) => (
              <div key={i} className="glass-panel rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">{eq.name}</h4>
                    <p className="text-xs text-muted-foreground">{eq.owner} • {eq.location}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                    Available
                  </span>
                </div>
              </div>
            ))}
          </div>
        </PullToRefresh>
      )}
    </div>
  );
}
