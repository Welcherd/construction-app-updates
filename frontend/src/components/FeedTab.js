import { useCallback, useState } from "react";
import { PullToRefresh } from "@/components/PullToRefresh";
import { PostCard } from "@/components/PostCard";
import { WorldMap, GlobalStatsBar } from "@/components/WorldMap";
import { PenSquare, Search, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";

const INITIAL_POSTS = [
  {
    id: "1",
    author: "Mike Rodriguez",
    initials: "MR",
    role: "General Contractor",
    location: "Austin, TX",
    country: "US",
    content:
      "Just wrapped up a 12-unit residential complex ahead of schedule. The key was getting the right excavator from day one. Anyone have recommendations for long-reach excavators in the DFW area?",
    likes: 24,
    comments: 8,
    timeAgo: "2h",
    tags: ["residential", "excavator", "DFW"],
  },
  {
    id: "2",
    author: "Aisha Okonkwo",
    initials: "AO",
    role: "Civil Engineer",
    location: "Lagos, Nigeria",
    country: "NG",
    content:
      "Supervising the new Lekki coastal highway expansion. 12km of reinforced concrete road with 3 flyover bridges. Looking for international partners with marine piling experience.",
    likes: 38,
    comments: 14,
    timeAgo: "3h",
    tags: ["infrastructure", "highway", "marine"],
  },
  {
    id: "3",
    author: "Kenji Tanaka",
    initials: "KT",
    role: "Structural Engineer",
    location: "Tokyo, Japan",
    country: "JP",
    content:
      "Completed seismic retrofitting on a 30-story commercial tower in Shinjuku. Used base isolation bearings that can withstand magnitude 8.0. Happy to share our methodology with the global community.",
    likes: 62,
    comments: 21,
    timeAgo: "4h",
    tags: ["seismic", "commercial", "engineering"],
  },
  {
    id: "4",
    author: "Hans Muller",
    initials: "HM",
    role: "Site Manager",
    location: "Berlin, Germany",
    country: "DE",
    content:
      "Our Passivhaus residential project is hitting energy targets that are 40% better than predicted. Prefabricated wall panels from our factory in Hamburg are a game changer for speed and insulation.",
    likes: 45,
    comments: 17,
    timeAgo: "5h",
    tags: ["passivhaus", "residential", "sustainability"],
  },
  {
    id: "5",
    author: "Sarah Chen",
    initials: "SC",
    role: "Site Superintendent",
    location: "Denver, CO",
    country: "US",
    content:
      "Looking for a 50-ton crane rental for a commercial high-rise project starting next month. Need it for approximately 6 weeks. Any operators available in the Denver metro?",
    likes: 15,
    comments: 12,
    timeAgo: "6h",
    tags: ["commercial", "crane", "hiring"],
  },
];

const FILTER_TAGS = [
  { label: "All", value: "all" },
  { label: "Global", value: "international", icon: "globe" },
  { label: "Residential", value: "residential" },
  { label: "Commercial", value: "commercial" },
  { label: "Infrastructure", value: "infrastructure" },
  { label: "Equipment", value: "excavator" },
];

export function FeedTab() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const handleRefresh = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 1200));
    setPosts((prev) => [...prev]);
  }, []);

  const filtered = posts.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "international" && p.country !== "US") ||
      p.tags.some((t) => t.toLowerCase().includes(activeFilter.toLowerCase()));
    return matchesSearch && matchesFilter;
  });

  return (
    <PullToRefresh onRefresh={handleRefresh} className="h-full">
      {/* Global Map Hero */}
      <div className="relative overflow-hidden border-b border-border/50 glass-panel">
        <WorldMap className="h-36 opacity-60 dark:opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-4 pb-3">
          <div className="mb-1 flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Global Network</span>
          </div>
          <h2 className="text-base font-bold text-foreground font-display text-balance leading-tight">
            Building connections across 42 countries worldwide
          </h2>
        </div>
      </div>

      {/* Global Stats */}
      <div className="border-b border-border/50 glass-panel px-4 py-3">
        <GlobalStatsBar />
      </div>

      {/* Search + Filters */}
      <div className="sticky top-0 z-10 space-y-2.5 border-b border-border/50 glass-panel px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search posts, people, countries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50"
            data-testid="feed-search"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {FILTER_TAGS.map((tag) => (
            <button
              key={tag.value}
              type="button"
              data-testid={`filter-${tag.value}`}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors select-none ${
                activeFilter === tag.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/80 text-secondary-foreground active:bg-secondary"
              }`}
              onClick={() => setActiveFilter(tag.value)}
            >
              {tag.icon === "globe" && <Globe className="mr-1 inline h-3 w-3" />}
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-border/50">
        {filtered.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-3 rounded-full bg-muted p-4">
            <PenSquare className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">No posts found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or follow more workers worldwide
          </p>
        </div>
      )}
    </PullToRefresh>
  );
}
