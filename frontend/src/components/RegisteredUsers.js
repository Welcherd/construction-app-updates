import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Star,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Filter,
  Users,
  Building2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getFlag } from "@/components/WorldMap";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ROLE_LABELS = {
  worker: "Worker",
  contractor: "Contractor",
  equipment_owner: "Equipment Owner",
  project_manager: "Project Manager",
};

const EXPERTISE_COLORS = {
  beginner: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  professional: "bg-green-500/20 text-green-400 border-green-500/30",
};

export function RegisteredUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 10;

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, roleFilter, search]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });

      if (roleFilter) params.append("role", roleFilter);
      if (search) params.append("search", search);

      const response = await fetch(`${API_URL}/api/users?${params}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setUsers(data.users);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(total / perPage);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  return (
    <section id="users" className="relative py-24" data-testid="users-section">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary flex items-center gap-2">
            <Users className="w-4 h-4" />
            Our Community
          </p>
          <h2 className="text-balance text-4xl font-bold text-foreground md:text-5xl">
            Registered Professionals
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Connect with {total.toLocaleString()}+ construction professionals worldwide.
          </p>
        </div>

        {/* Filters */}
        <div className="glass-panel rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, company, or skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-background/50"
                data-testid="users-search"
              />
            </form>

            <div className="flex gap-2 flex-wrap">
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
                className="rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm text-foreground"
                data-testid="users-role-filter"
              >
                <option value="">All Roles</option>
                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-destructive">{error}</p>
            <Button onClick={fetchUsers} className="mt-4">
              Retry
            </Button>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No users found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {users.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function UserCard({ user }) {
  const flag = getFlag(user.country);

  return (
    <article
      className="glass-panel rounded-xl p-5 transition-all hover:scale-[1.02]"
      data-testid={`user-card-${user.id}`}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/20 text-lg font-bold text-primary">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.username}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            user.username?.slice(0, 2).toUpperCase()
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground truncate">{user.username}</h3>
            <span className="text-sm leading-none" aria-hidden="true">
              {flag}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {ROLE_LABELS[user.role] || user.role}
          </p>
          {user.company && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Building2 className="h-3 w-3" />
              {user.company}
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{user.bio}</p>
      )}

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge
          variant="outline"
          className={cn("text-xs", EXPERTISE_COLORS[user.expertise_level])}
        >
          {user.expertise_level}
        </Badge>
        {user.specializations?.slice(0, 2).map((spec) => (
          <Badge key={spec} variant="secondary" className="text-xs">
            {spec}
          </Badge>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          {user.rating?.toFixed(1) || "0.0"}
        </span>
        <span className="flex items-center gap-1">
          <Briefcase className="h-3.5 w-3.5" />
          {user.projects_completed || 0} projects
        </span>
        <span className="flex items-center gap-1">
          {user.years_experience || 0} yrs exp
        </span>
      </div>

      {/* Contact Button */}
      <Button size="sm" className="w-full mt-4" data-testid={`contact-user-${user.id}`}>
        Connect
      </Button>
    </article>
  );
}

export default RegisteredUsers;
