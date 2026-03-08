import { useCallback, useState } from "react";
import { PullToRefresh } from "@/components/PullToRefresh";
import { MobileSelect } from "@/components/MobileSelect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFlag } from "@/components/WorldMap";
import { Search, MapPin, Star, Clock, DollarSign, Wrench, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const EQUIPMENT = [
  {
    id: "1",
    name: "CAT 320 Excavator",
    category: "excavators",
    dailyRate: 450,
    weeklyRate: 2400,
    location: "Austin, TX",
    country: "US",
    rating: 4.8,
    reviews: 23,
    available: true,
    owner: "Lone Star Rentals",
    specs: "20-ton, GPS equipped, thumb attachment",
    jobTypes: ["Residential", "Commercial"],
  },
  {
    id: "2",
    name: "Liebherr LTM 1100 Crane",
    category: "cranes",
    dailyRate: 1200,
    weeklyRate: 6500,
    location: "Berlin, Germany",
    country: "DE",
    rating: 4.9,
    reviews: 15,
    available: true,
    owner: "Deutsche Bau Vermietung",
    specs: "100-ton capacity, 197ft boom",
    jobTypes: ["Commercial"],
  },
  {
    id: "3",
    name: "Komatsu PC200 Excavator",
    category: "excavators",
    dailyRate: 380,
    weeklyRate: 2000,
    location: "Tokyo, Japan",
    country: "JP",
    rating: 4.9,
    reviews: 42,
    available: true,
    owner: "Sakura Equipment Co.",
    specs: "21-ton, hybrid engine, low emissions",
    jobTypes: ["Residential", "Commercial"],
  },
  {
    id: "4",
    name: "XCMG QY50K Truck Crane",
    category: "cranes",
    dailyRate: 950,
    weeklyRate: 5200,
    location: "Dubai, UAE",
    country: "AE",
    rating: 4.7,
    reviews: 18,
    available: true,
    owner: "Gulf Heavy Equipment",
    specs: "50-ton, telescopic boom, desert rated",
    jobTypes: ["Commercial"],
  },
  {
    id: "5",
    name: "Bobcat S650 Skid Steer",
    category: "loaders",
    dailyRate: 250,
    weeklyRate: 1300,
    location: "London, UK",
    country: "GB",
    rating: 4.7,
    reviews: 31,
    available: true,
    owner: "Thames Plant Hire",
    specs: "74HP, enclosed cab, A/C",
    jobTypes: ["Residential", "Commercial"],
  },
];

const CATEGORY_OPTIONS = [
  { label: "All Categories", value: "all" },
  { label: "Excavators", value: "excavators" },
  { label: "Cranes", value: "cranes" },
  { label: "Loaders", value: "loaders" },
  { label: "Lifts", value: "lifts" },
];

const JOB_TYPE_OPTIONS = [
  { label: "All Job Types", value: "all" },
  { label: "Residential", value: "Residential" },
  { label: "Commercial", value: "Commercial" },
];

const REGION_OPTIONS = [
  { label: "All Regions", value: "all" },
  { label: "Americas", value: "americas" },
  { label: "Europe", value: "europe" },
  { label: "Asia Pacific", value: "apac" },
  { label: "Middle East", value: "mea" },
];

const REGION_MAP = {
  americas: ["US", "CA", "BR", "MX"],
  europe: ["GB", "DE", "FR"],
  apac: ["JP", "CN", "IN", "AU", "SG", "KR"],
  mea: ["AE", "SA", "NG"],
};

export function EquipmentTab() {
  const [category, setCategory] = useState("all");
  const [jobType, setJobType] = useState("all");
  const [region, setRegion] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleRefresh = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 1200));
  }, []);

  const filtered = EQUIPMENT.filter((eq) => {
    const matchesCategory = category === "all" || eq.category === category;
    const matchesJobType = jobType === "all" || eq.jobTypes.includes(jobType);
    const matchesRegion = region === "all" || (REGION_MAP[region]?.includes(eq.country) ?? false);
    const matchesSearch =
      !searchQuery ||
      eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.specs.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesJobType && matchesRegion && matchesSearch;
  });

  return (
    <PullToRefresh onRefresh={handleRefresh} className="h-full">
      {/* Region header */}
      <div className="border-b border-border/50 glass-panel px-4 py-3">
        <div className="flex items-center gap-1.5 mb-1">
          <Globe className="h-3.5 w-3.5 text-accent" />
          <span className="text-xs font-semibold text-accent uppercase tracking-wider">Equipment Worldwide</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Browse 8,200+ pieces of rental equipment across 42 countries
        </p>
      </div>

      <div className="sticky top-0 z-10 space-y-3 border-b border-border/50 glass-panel px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search equipment worldwide..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50"
            data-testid="equipment-search"
          />
        </div>
        <div className="flex gap-2">
          <MobileSelect
            value={category}
            onValueChange={setCategory}
            options={CATEGORY_OPTIONS}
            placeholder="Category"
            title="Equipment Category"
            className="flex-1"
          />
          <MobileSelect
            value={jobType}
            onValueChange={setJobType}
            options={JOB_TYPE_OPTIONS}
            placeholder="Job Type"
            title="Construction Type"
            className="flex-1"
          />
        </div>
        <MobileSelect
          value={region}
          onValueChange={setRegion}
          options={REGION_OPTIONS}
          placeholder="Region"
          title="Select Region"
        />
      </div>

      <div className="divide-y divide-border/50">
        {filtered.map((eq) => (
          <EquipmentCard key={eq.id} equipment={eq} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-3 rounded-full bg-muted p-4">
            <Wrench className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">No equipment found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your filters or expanding your region
          </p>
        </div>
      )}
    </PullToRefresh>
  );
}

function EquipmentCard({ equipment }) {
  const flag = getFlag(equipment.country);

  return (
    <article className="glass-panel p-4" data-testid={`equipment-${equipment.id}`}>
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-foreground">{equipment.name}</h3>
            <Badge
              variant={equipment.available ? "default" : "secondary"}
              className={cn(
                "shrink-0 text-xs",
                equipment.available
                  ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/30"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {equipment.available ? "Available" : "Rented"}
            </Badge>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{equipment.owner}</p>
        </div>
      </div>

      <p className="mt-2 text-sm text-muted-foreground">{equipment.specs}</p>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {equipment.jobTypes.map((jt) => (
          <span
            key={jt}
            className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent"
          >
            {jt}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="text-sm leading-none" aria-hidden="true">{flag}</span>
          <MapPin className="h-3.5 w-3.5" />
          {equipment.location}
        </span>
        <span className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          {equipment.rating} ({equipment.reviews})
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1 font-semibold text-foreground">
            <DollarSign className="h-3.5 w-3.5" />
            {equipment.dailyRate}/day
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            ${equipment.weeklyRate}/wk
          </span>
        </div>
        <Button size="sm" className="select-none" data-testid={`contact-${equipment.id}`}>
          Contact
        </Button>
      </div>
    </article>
  );
}
