import { useState, useEffect, useCallback } from "react";
import { APIProvider, Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  User,
  Building2,
  Star,
  Briefcase,
  X,
  Filter,
  Loader2,
  Users,
  Navigation,
} from "lucide-react";
import { cn } from "@/lib/utils";

const API_URL = process.env.REACT_APP_BACKEND_URL;
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const ROLE_LABELS = {
  worker: "Worker",
  contractor: "Contractor",
  equipment_owner: "Equipment Owner",
  project_manager: "Project Manager",
};

const ROLE_COLORS = {
  worker: "#22c55e",       // green
  contractor: "#f59e0b",   // amber
  equipment_owner: "#3b82f6", // blue
  project_manager: "#8b5cf6", // purple
};

const SPECIALIZATIONS = [
  "Electrical", "Plumbing", "HVAC", "Structural", "Concrete",
  "Carpentry", "Masonry", "Roofing", "Finishing", "Excavation",
];

function WorkerMarker({ worker, isSelected, onClick }) {
  const color = ROLE_COLORS[worker.role] || "#f59e0b";
  
  return (
    <div
      onClick={onClick}
      className="cursor-pointer transition-transform hover:scale-110"
      style={{ transform: isSelected ? "scale(1.2)" : "scale(1)" }}
    >
      <div
        className="relative flex items-center justify-center rounded-full border-2 border-white shadow-lg"
        style={{
          width: "40px",
          height: "40px",
          backgroundColor: color,
        }}
      >
        {worker.avatar_url ? (
          <img
            src={worker.avatar_url}
            alt={worker.username}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-white text-sm font-bold">
            {worker.username?.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      {isSelected && (
        <div
          className="absolute inset-0 rounded-full animate-ping"
          style={{ backgroundColor: `${color}40` }}
        />
      )}
    </div>
  );
}

function WorkerInfoWindow({ worker, onClose }) {
  return (
    <div className="min-w-[280px] max-w-[320px] p-4 bg-card rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full text-white font-bold"
            style={{ backgroundColor: ROLE_COLORS[worker.role] }}
          >
            {worker.avatar_url ? (
              <img
                src={worker.avatar_url}
                alt={worker.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              worker.username?.slice(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">{worker.username}</h3>
            <p className="text-sm text-muted-foreground">
              {ROLE_LABELS[worker.role]}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      {worker.company && (
        <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Building2 className="w-4 h-4" />
          {worker.company}
        </div>
      )}

      <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="w-4 h-4" />
        {worker.location?.city}, {worker.location?.country}
      </div>

      {/* Specializations */}
      {worker.specializations?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {worker.specializations.slice(0, 3).map((spec) => (
            <Badge key={spec} variant="secondary" className="text-xs">
              {spec}
            </Badge>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          {worker.rating?.toFixed(1) || "0.0"}
        </span>
        <span className="flex items-center gap-1">
          <Briefcase className="h-3.5 w-3.5" />
          {worker.projects_completed || 0} projects
        </span>
        <span>{worker.years_experience || 0} yrs exp</span>
      </div>

      <Button size="sm" className="w-full mt-4" data-testid={`connect-worker-${worker.id}`}>
        Connect
      </Button>
    </div>
  );
}

function MapFilters({ filters, setFilters, onLocateMe }) {
  return (
    <div className="absolute top-4 left-4 z-10 glass-panel rounded-xl p-4 max-w-xs">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Find Workers</span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-muted-foreground">Role</label>
          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            className="mt-1 w-full rounded-md border border-border/50 bg-background/50 px-2 py-1.5 text-sm text-foreground"
          >
            <option value="">All Roles</option>
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-muted-foreground">Specialization</label>
          <select
            value={filters.specialization}
            onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
            className="mt-1 w-full rounded-md border border-border/50 bg-background/50 px-2 py-1.5 text-sm text-foreground"
          >
            <option value="">All Specializations</option>
            {SPECIALIZATIONS.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-muted-foreground">Min Experience (years)</label>
          <input
            type="number"
            min="0"
            max="50"
            value={filters.minExperience}
            onChange={(e) => setFilters({ ...filters, minExperience: parseInt(e.target.value) || 0 })}
            className="mt-1 w-full rounded-md border border-border/50 bg-background/50 px-2 py-1.5 text-sm text-foreground"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2"
          onClick={onLocateMe}
        >
          <Navigation className="w-4 h-4" />
          Near Me
        </Button>
      </div>
    </div>
  );
}

function MapLegend() {
  return (
    <div className="absolute bottom-4 left-4 z-10 glass-panel rounded-lg p-3">
      <div className="flex flex-wrap gap-3">
        {Object.entries(ROLE_LABELS).map(([role, label]) => (
          <div key={role} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: ROLE_COLORS[role] }}
            />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkerCount({ count }) {
  return (
    <div className="absolute top-4 right-4 z-10 glass-panel rounded-lg px-3 py-2">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">{count} Workers</span>
      </div>
    </div>
  );
}

function MapPlaceholder({ workersCount }) {
  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
      <div className="glass-panel rounded-xl p-6 text-center max-w-md mx-4">
        <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-bold text-foreground mb-2">
          Workers Map Ready
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {workersCount} workers with locations are ready to be displayed.
          Configure your Google Maps API key to see them on the map.
        </p>
        <div className="text-xs text-muted-foreground bg-background/50 rounded-lg p-3 font-mono">
          REACT_APP_GOOGLE_MAPS_API_KEY=your_key
        </div>
      </div>
    </div>
  );
}

export function WorkersMap({ className }) {
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 30, lng: 0 });
  const [mapZoom, setMapZoom] = useState(2);
  const [filters, setFilters] = useState({
    role: "",
    specialization: "",
    minExperience: 0,
  });

  const isConfigured = GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== "YOUR_GOOGLE_MAPS_API_KEY";

  const fetchWorkers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.role) params.append("role", filters.role);
      if (filters.specialization) params.append("specialization", filters.specialization);
      if (filters.minExperience > 0) params.append("min_experience", filters.minExperience.toString());

      const response = await fetch(`${API_URL}/api/workers/map?${params}`);
      if (response.ok) {
        const data = await response.json();
        setWorkers(data.workers);
      }
    } catch (error) {
      console.error("Failed to fetch workers:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setMapZoom(10);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Unable to get your location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  if (!isConfigured) {
    return (
      <div className={cn("relative", className)}>
        <MapPlaceholder workersCount={workers.length} />
      </div>
    );
  }

  return (
    <div className={cn("relative", className)} data-testid="workers-map">
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      <MapFilters filters={filters} setFilters={setFilters} onLocateMe={handleLocateMe} />
      <WorkerCount count={workers.length} />
      <MapLegend />

      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          style={{ width: "100%", height: "100%" }}
          center={mapCenter}
          zoom={mapZoom}
          onCenterChanged={(e) => setMapCenter(e.detail.center)}
          onZoomChanged={(e) => setMapZoom(e.detail.zoom)}
          mapId="workers-map"
          mapTypeId="roadmap"
          gestureHandling="greedy"
          disableDefaultUI={true}
          zoomControl={true}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={true}
          styles={[
            { elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a2e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#8b8b8b" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f0f1a" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#2a2a4a" }] },
          ]}
        >
          {workers.map((worker) => (
            <AdvancedMarker
              key={worker.id}
              position={{ lat: worker.location.lat, lng: worker.location.lng }}
              onClick={() => setSelectedWorker(worker)}
            >
              <WorkerMarker
                worker={worker}
                isSelected={selectedWorker?.id === worker.id}
                onClick={() => setSelectedWorker(worker)}
              />
            </AdvancedMarker>
          ))}

          {selectedWorker && (
            <InfoWindow
              position={{ lat: selectedWorker.location.lat, lng: selectedWorker.location.lng }}
              onCloseClick={() => setSelectedWorker(null)}
              pixelOffset={[0, -45]}
            >
              <WorkerInfoWindow
                worker={selectedWorker}
                onClose={() => setSelectedWorker(null)}
              />
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
}

export default WorkersMap;
