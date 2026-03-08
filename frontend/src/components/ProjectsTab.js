import { useCallback, useState } from "react";
import { PullToRefresh } from "@/components/PullToRefresh";
import { MobileSelect } from "@/components/MobileSelect";
import { Badge } from "@/components/ui/badge";
import { Search, Building2, MapPin, Calendar, Users, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getFlag } from "@/components/WorldMap";
import { cn } from "@/lib/utils";

const PROJECTS = [
  {
    id: "1",
    title: "Horizon Tower",
    type: "Commercial",
    location: "Dubai, UAE",
    country: "AE",
    status: "In Progress",
    progress: 72,
    workers: 450,
    startDate: "Mar 2024",
    description: "72-story mixed-use skyscraper with sustainable design",
  },
  {
    id: "2",
    title: "Pacific Bridge",
    type: "Infrastructure",
    location: "Sydney, Australia",
    country: "AU",
    status: "In Progress",
    progress: 45,
    workers: 320,
    startDate: "Jan 2024",
    description: "1.2km suspension bridge connecting urban districts",
  },
  {
    id: "3",
    title: "Nordic Arena",
    type: "Sports",
    location: "Oslo, Norway",
    country: "NO",
    status: "Planning",
    progress: 15,
    workers: 85,
    startDate: "Jun 2025",
    description: "45,000-seat stadium with retractable roof",
  },
  {
    id: "4",
    title: "Mumbai Metro Line 5",
    type: "Infrastructure",
    location: "Mumbai, India",
    country: "IN",
    status: "In Progress",
    progress: 58,
    workers: 890,
    startDate: "Sep 2023",
    description: "25km metro line serving 3M daily commuters",
  },
  {
    id: "5",
    title: "Green Valley Residences",
    type: "Residential",
    location: "Austin, TX",
    country: "US",
    status: "Completed",
    progress: 100,
    workers: 120,
    startDate: "Feb 2023",
    description: "200-unit eco-friendly residential complex",
  },
];

const TYPE_OPTIONS = [
  { label: "All Types", value: "all" },
  { label: "Commercial", value: "Commercial" },
  { label: "Residential", value: "Residential" },
  { label: "Infrastructure", value: "Infrastructure" },
  { label: "Sports", value: "Sports" },
];

const STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Planning", value: "Planning" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
];

export function ProjectsTab() {
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleRefresh = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 1200));
  }, []);

  const filtered = PROJECTS.filter((p) => {
    const matchesType = type === "all" || p.type === type;
    const matchesStatus = status === "all" || p.status === status;
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <PullToRefresh onRefresh={handleRefresh} className="h-full">
      <div className="border-b border-border/50 glass-panel px-4 py-3">
        <div className="flex items-center gap-1.5 mb-1">
          <Briefcase className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Global Projects</span>
        </div>
        <p className="text-xs text-muted-foreground">
          12,400+ active construction projects across 42 countries
        </p>
      </div>

      <div className="sticky top-0 z-10 space-y-3 border-b border-border/50 glass-panel px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50"
            data-testid="projects-search"
          />
        </div>
        <div className="flex gap-2">
          <MobileSelect
            value={type}
            onValueChange={setType}
            options={TYPE_OPTIONS}
            placeholder="Type"
            title="Project Type"
            className="flex-1"
          />
          <MobileSelect
            value={status}
            onValueChange={setStatus}
            options={STATUS_OPTIONS}
            placeholder="Status"
            title="Project Status"
            className="flex-1"
          />
        </div>
      </div>

      <div className="divide-y divide-border/50">
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-3 rounded-full bg-muted p-4">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">No projects found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your filters
          </p>
        </div>
      )}
    </PullToRefresh>
  );
}

function ProjectCard({ project }) {
  const flag = getFlag(project.country);
  
  const statusColors = {
    "Planning": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "In Progress": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    "Completed": "bg-green-500/20 text-green-400 border-green-500/30",
  };

  return (
    <article className="glass-panel p-4" data-testid={`project-${project.id}`}>
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-foreground">{project.title}</h3>
            <Badge
              variant="outline"
              className={cn("shrink-0 text-xs", statusColors[project.status])}
            >
              {project.status}
            </Badge>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{project.type}</p>
        </div>
      </div>

      <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>

      {/* Progress bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-foreground">{project.progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="text-sm leading-none" aria-hidden="true">{flag}</span>
          <MapPin className="h-3.5 w-3.5" />
          {project.location}
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          {project.workers} workers
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {project.startDate}
        </span>
      </div>
    </article>
  );
}
