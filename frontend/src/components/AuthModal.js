import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, User, Mail, Lock, Building2, Globe, Briefcase, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ROLES = [
  { value: "worker", label: "Construction Worker" },
  { value: "contractor", label: "General Contractor" },
  { value: "equipment_owner", label: "Equipment Owner" },
  { value: "project_manager", label: "Project Manager" },
];

const EXPERTISE_LEVELS = [
  { value: "beginner", label: "Beginner (0-2 years)" },
  { value: "intermediate", label: "Intermediate (3-7 years)" },
  { value: "professional", label: "Professional (8+ years)" },
];

const SPECIALIZATIONS = [
  "Electrical", "Plumbing", "HVAC", "Structural", "Concrete",
  "Carpentry", "Masonry", "Roofing", "Finishing", "Excavation",
];

const PROJECT_TYPES = [
  "Residential", "Commercial", "Infrastructure", "Industrial", "Renovation",
];

export function AuthModal({ isOpen, onClose, initialMode = "login" }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  // Update mode when initialMode prop changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setStep(1);
      setError("");
    }
  }, [isOpen, initialMode]);
  
  // Form fields
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    company: "",
    role: "worker",
    expertise_level: "intermediate",
    country: "US",
    phone: "",
    bio: "",
    years_experience: 0,
    specializations: [],
    project_types: [],
    consent_data_sharing: false,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const toggleArrayField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(formData.email, formData.password);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (step < 3) {
      // Validate current step
      if (step === 1) {
        if (!formData.email || !formData.password || !formData.username) {
          setError("Please fill in all required fields");
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return;
        }
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters");
          return;
        }
      }
      setStep(step + 1);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setStep(1);
    setError("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-panel border-border/50 sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {mode === "login" ? "Welcome Back" : "Join ConstructionConnection"}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="pl-10 bg-background/50"
                  required
                  data-testid="login-email"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="pl-10 bg-background/50"
                  required
                  data-testid="login-password"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading} data-testid="login-submit">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Sign In
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={switchMode}
                className="text-primary hover:underline"
              >
                Sign up
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Step indicators */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={cn(
                    "h-2 w-8 rounded-full transition-colors",
                    s === step ? "bg-primary" : s < step ? "bg-primary/50" : "bg-muted"
                  )}
                />
              ))}
            </div>

            {step === 1 && (
              <>
                <div>
                  <label className="text-sm font-medium text-foreground">Username *</label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="johndoe"
                      value={formData.username}
                      onChange={(e) => handleChange("username", e.target.value)}
                      className="pl-10 bg-background/50"
                      required
                      data-testid="register-username"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Email *</label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="pl-10 bg-background/50"
                      required
                      data-testid="register-email"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Password *</label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className="pl-10 bg-background/50"
                      required
                      data-testid="register-password"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Confirm Password *</label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      className="pl-10 bg-background/50"
                      required
                      data-testid="register-confirm-password"
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="text-sm font-medium text-foreground">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleChange("role", e.target.value)}
                    className="mt-1 w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm text-foreground"
                    data-testid="register-role"
                  >
                    {ROLES.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Experience Level</label>
                  <select
                    value={formData.expertise_level}
                    onChange={(e) => handleChange("expertise_level", e.target.value)}
                    className="mt-1 w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm text-foreground"
                    data-testid="register-expertise"
                  >
                    {EXPERTISE_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Company (Optional)</label>
                  <div className="relative mt-1">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Your company name"
                      value={formData.company}
                      onChange={(e) => handleChange("company", e.target.value)}
                      className="pl-10 bg-background/50"
                      data-testid="register-company"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Years of Experience</label>
                  <Input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.years_experience}
                    onChange={(e) => handleChange("years_experience", parseInt(e.target.value) || 0)}
                    className="mt-1 bg-background/50"
                    data-testid="register-years"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Country</label>
                  <div className="relative mt-1">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="US"
                      value={formData.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                      className="pl-10 bg-background/50"
                      data-testid="register-country"
                    />
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <label className="text-sm font-medium text-foreground">Specializations</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {SPECIALIZATIONS.map((spec) => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => toggleArrayField("specializations", spec)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                          formData.specializations.includes(spec)
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        )}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Project Types</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {PROJECT_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleArrayField("project_types", type)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                          formData.project_types.includes(type)
                            ? "bg-accent text-accent-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Bio (Optional)</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="mt-1 w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm text-foreground min-h-[80px] resize-none"
                    data-testid="register-bio"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.consent_data_sharing}
                    onChange={(e) => handleChange("consent_data_sharing", e.target.checked)}
                    className="rounded border-border"
                  />
                  <span className="text-muted-foreground">
                    I agree to share my profile with other users
                  </span>
                </label>
              </>
            )}

            <div className="flex gap-2">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
                data-testid={step < 3 ? "register-next" : "register-submit"}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {step < 3 ? "Next" : "Create Account"}
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                onClick={switchMode}
                className="text-primary hover:underline"
              >
                Sign in
              </button>
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
