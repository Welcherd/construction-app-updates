import { useState, useCallback } from "react";
import { APIProvider, Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { MapPin, Building2, Wrench, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Project locations data
const PROJECT_LOCATIONS = [
  {
    id: "p1",
    type: "project",
    name: "Horizon Tower",
    category: "Commercial",
    location: "Dubai, UAE",
    position: { lat: 25.2048, lng: 55.2708 },
    status: "In Progress",
    progress: 72,
    description: "72-story mixed-use skyscraper with sustainable design",
  },
  {
    id: "p2",
    type: "project",
    name: "Pacific Bridge",
    category: "Infrastructure",
    location: "Sydney, Australia",
    position: { lat: -33.8688, lng: 151.2093 },
    status: "In Progress",
    progress: 45,
    description: "1.2km suspension bridge connecting urban districts",
  },
  {
    id: "p3",
    type: "project",
    name: "Nordic Arena",
    category: "Sports",
    location: "Oslo, Norway",
    position: { lat: 59.9139, lng: 10.7522 },
    status: "Planning",
    progress: 15,
    description: "45,000-seat stadium with retractable roof",
  },
  {
    id: "p4",
    type: "project",
    name: "Mumbai Metro Line 5",
    category: "Infrastructure",
    location: "Mumbai, India",
    position: { lat: 19.076, lng: 72.8777 },
    status: "In Progress",
    progress: 58,
    description: "25km metro line serving 3M daily commuters",
  },
  {
    id: "p5",
    type: "project",
    name: "Green Valley Residences",
    category: "Residential",
    location: "Austin, TX",
    position: { lat: 30.2672, lng: -97.7431 },
    status: "Completed",
    progress: 100,
    description: "200-unit eco-friendly residential complex",
  },
];

// Equipment rental locations data
const EQUIPMENT_LOCATIONS = [
  {
    id: "e1",
    type: "equipment",
    name: "Lone Star Rentals",
    equipment: "CAT 320 Excavator",
    location: "Austin, TX",
    position: { lat: 30.2849, lng: -97.7341 },
    dailyRate: 450,
    available: true,
  },
  {
    id: "e2",
    type: "equipment",
    name: "Deutsche Bau Vermietung",
    equipment: "Liebherr LTM 1100 Crane",
    location: "Berlin, Germany",
    position: { lat: 52.52, lng: 13.405 },
    dailyRate: 1200,
    available: true,
  },
  {
    id: "e3",
    type: "equipment",
    name: "Sakura Equipment Co.",
    equipment: "Komatsu PC200 Excavator",
    location: "Tokyo, Japan",
    position: { lat: 35.6762, lng: 139.6503 },
    dailyRate: 380,
    available: true,
  },
  {
    id: "e4",
    type: "equipment",
    name: "Gulf Heavy Equipment",
    equipment: "XCMG QY50K Truck Crane",
    location: "Dubai, UAE",
    position: { lat: 25.1972, lng: 55.2744 },
    dailyRate: 950,
    available: true,
  },
  {
    id: "e5",
    type: "equipment",
    name: "Thames Plant Hire",
    equipment: "Bobcat S650 Skid Steer",
    location: "London, UK",
    position: { lat: 51.5074, lng: -0.1278 },
    dailyRate: 250,
    available: true,
  },
];

const ALL_LOCATIONS = [...PROJECT_LOCATIONS, ...EQUIPMENT_LOCATIONS];

// Custom marker component
function CustomMarker({ item, isSelected, onClick }) {
  const isProject = item.type === "project";
  
  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-transform hover:scale-110",
        isSelected && "scale-125"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full shadow-lg border-2 border-white",
          isProject
            ? "w-10 h-10 bg-primary"
            : "w-8 h-8 bg-accent"
        )}
      >
        {isProject ? (
          <Building2 className="w-5 h-5 text-primary-foreground" />
        ) : (
          <Wrench className="w-4 h-4 text-accent-foreground" />
        )}
      </div>
      {/* Pulse animation for selected */}
      {isSelected && (
        <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
      )}
    </div>
  );
}

// Info window content for projects
function ProjectInfoContent({ item, onClose }) {
  const statusColors = {
    "Planning": "bg-blue-500",
    "In Progress": "bg-yellow-500",
    "Completed": "bg-green-500",
  };

  return (
    <div className="min-w-[280px] max-w-[320px] p-4 bg-card rounded-lg">
      <div className="flex items-start justify-between">
        <div>
          <span className={cn(
            "inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white mb-2",
            statusColors[item.status]
          )}>
            {item.status}
          </span>
          <h3 className="text-lg font-bold text-foreground">{item.name}</h3>
          <p className="text-sm text-muted-foreground">{item.category}</p>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <p className="mt-2 text-sm text-foreground">{item.description}</p>
      
      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="w-3.5 h-3.5" />
        {item.location}
      </div>
      
      {/* Progress bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-foreground">{item.progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${item.progress}%` }}
          />
        </div>
      </div>
      
      <Button size="sm" className="w-full mt-4" data-testid={`view-project-${item.id}`}>
        View Details
        <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
      </Button>
    </div>
  );
}

// Info window content for equipment
function EquipmentInfoContent({ item, onClose }) {
  return (
    <div className="min-w-[280px] max-w-[320px] p-4 bg-card rounded-lg">
      <div className="flex items-start justify-between">
        <div>
          <span className={cn(
            "inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2",
            item.available
              ? "bg-green-500/20 text-green-400"
              : "bg-muted text-muted-foreground"
          )}>
            {item.available ? "Available" : "Rented"}
          </span>
          <h3 className="text-lg font-bold text-foreground">{item.equipment}</h3>
          <p className="text-sm text-muted-foreground">{item.name}</p>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="w-3.5 h-3.5" />
        {item.location}
      </div>
      
      <div className="mt-3 text-lg font-bold text-foreground">
        ${item.dailyRate}<span className="text-sm font-normal text-muted-foreground">/day</span>
      </div>
      
      <Button size="sm" className="w-full mt-4" data-testid={`contact-equipment-${item.id}`}>
        Contact Owner
        <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
      </Button>
    </div>
  );
}

// Map placeholder when API key is not configured
function MapPlaceholder({ filter }) {
  const filteredItems = filter === "all" 
    ? ALL_LOCATIONS 
    : ALL_LOCATIONS.filter(item => item.type === filter);

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl overflow-hidden" data-testid="map-placeholder">
      {/* Background gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 50%, 
              rgba(30, 64, 175, 0.2) 0%, 
              rgba(15, 23, 42, 0.8) 50%,
              rgba(0, 0, 0, 1) 100%
            )
          `,
        }}
      />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
      
      {/* Simulated map markers */}
      <div className="absolute inset-0">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              // Distribute markers across the placeholder
              left: `${15 + (index % 5) * 18}%`,
              top: `${20 + Math.floor(index / 5) * 25}%`,
            }}
          >
            <div
              className={cn(
                "flex items-center justify-center rounded-full shadow-lg border-2 border-white/50 animate-pulse",
                item.type === "project"
                  ? "w-8 h-8 bg-primary"
                  : "w-6 h-6 bg-accent"
              )}
            >
              {item.type === "project" ? (
                <Building2 className="w-4 h-4 text-primary-foreground" />
              ) : (
                <Wrench className="w-3 h-3 text-accent-foreground" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Configuration notice */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="glass-panel rounded-xl p-6 text-center max-w-md mx-4">
          <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-2">
            Google Maps Integration Ready
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add your Google Maps API key to enable the interactive satellite map with project and equipment locations.
          </p>
          <div className="text-xs text-muted-foreground bg-background/50 rounded-lg p-3 font-mono">
            REACT_APP_GOOGLE_MAPS_API_KEY=your_key_here
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Showing {filteredItems.length} locations ({filter === "all" ? "all" : filter})
          </p>
        </div>
      </div>
    </div>
  );
}

// Filter controls
function MapFilters({ filter, setFilter }) {
  const filters = [
    { id: "all", label: "All", count: ALL_LOCATIONS.length },
    { id: "project", label: "Projects", count: PROJECT_LOCATIONS.length, icon: Building2 },
    { id: "equipment", label: "Equipment", count: EQUIPMENT_LOCATIONS.length, icon: Wrench },
  ];

  return (
    <div className="absolute top-4 left-4 z-10 flex gap-2">
      {filters.map((f) => {
        const Icon = f.icon;
        return (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              filter === f.id
                ? "bg-primary text-primary-foreground"
                : "glass-panel text-foreground hover:bg-muted"
            )}
            data-testid={`filter-map-${f.id}`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {f.label}
            <span className="ml-1 text-xs opacity-70">({f.count})</span>
          </button>
        );
      })}
    </div>
  );
}

// Main Interactive Map Component
export function InteractiveGoogleMap({ className }) {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState("all");

  const isConfigured = apiKey && apiKey !== "YOUR_GOOGLE_MAPS_API_KEY";

  const filteredLocations = filter === "all"
    ? ALL_LOCATIONS
    : ALL_LOCATIONS.filter(item => item.type === filter);

  const handleMarkerClick = useCallback((item) => {
    setSelectedItem(item);
  }, []);

  const handleCloseInfo = useCallback(() => {
    setSelectedItem(null);
  }, []);

  if (!isConfigured) {
    return (
      <div className={cn("relative", className)}>
        <MapFilters filter={filter} setFilter={setFilter} />
        <MapPlaceholder filter={filter} />
      </div>
    );
  }

  return (
    <div className={cn("relative", className)} data-testid="interactive-map">
      <MapFilters filter={filter} setFilter={setFilter} />
      
      <APIProvider apiKey={apiKey}>
        <Map
          style={{ width: "100%", height: "100%" }}
          defaultCenter={{ lat: 25, lng: 10 }}
          defaultZoom={2}
          mapId="construction-connection-map"
          mapTypeId="satellite"
          gestureHandling="greedy"
          disableDefaultUI={true}
          zoomControl={true}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={true}
        >
          {filteredLocations.map((item) => (
            <AdvancedMarker
              key={item.id}
              position={item.position}
              onClick={() => handleMarkerClick(item)}
            >
              <CustomMarker
                item={item}
                isSelected={selectedItem?.id === item.id}
                onClick={() => handleMarkerClick(item)}
              />
            </AdvancedMarker>
          ))}

          {selectedItem && (
            <InfoWindow
              position={selectedItem.position}
              onCloseClick={handleCloseInfo}
              pixelOffset={[0, -40]}
            >
              {selectedItem.type === "project" ? (
                <ProjectInfoContent item={selectedItem} onClose={handleCloseInfo} />
              ) : (
                <EquipmentInfoContent item={selectedItem} onClose={handleCloseInfo} />
              )}
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
}

export default InteractiveGoogleMap;
