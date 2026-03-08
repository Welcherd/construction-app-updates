import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const handleNavClick = (href) => {
    setOpen(false);
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
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
          <Button
            onClick={() => handleNavClick("#contact")}
            className="select-none"
            data-testid="get-quote-btn"
          >
            Get a Quote
          </Button>
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
            <Button
              onClick={() => handleNavClick("#contact")}
              className="select-none mt-2"
            >
              Get a Quote
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
