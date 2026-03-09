import { useState } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";

const navLinks = [
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Users", href: "#users" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const handleNavClick = (href) => {
    setOpen(false);
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const openLogin = () => {
    setAuthMode("login");
    setShowAuth(true);
    setOpen(false);
  };

  const openRegister = () => {
    setAuthMode("register");
    setShowAuth(true);
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border/50" data-testid="navbar">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-2 select-none">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
              <span className="text-sm font-bold text-primary-foreground">CC</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Construction Connection
            </span>
          </a>

          {/* Desktop */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="select-none text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </button>
            ))}
            
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  Welcome, <span className="text-foreground font-medium">{user?.username}</span>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                  data-testid="logout-btn"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={openLogin}
                  data-testid="login-btn"
                >
                  Sign In
                </Button>
                <Button
                  onClick={openRegister}
                  className="select-none"
                  data-testid="register-btn"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="select-none text-foreground md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            data-testid="mobile-menu-toggle"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="glass-panel border-t border-border/50 px-6 pb-6 pt-2 md:hidden">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="select-none text-sm font-medium text-muted-foreground transition-colors hover:text-foreground text-left"
                >
                  {link.label}
                </button>
              ))}
              
              {isAuthenticated ? (
                <>
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">
                      Signed in as <span className="text-foreground font-medium">{user?.username}</span>
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={openLogin}
                    className="mt-2"
                  >
                    Sign In
                  </Button>
                  <Button onClick={openRegister}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
        initialMode={authMode}
      />
    </>
  );
}
