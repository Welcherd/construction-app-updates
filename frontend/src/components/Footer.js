export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    Company: ["About Us", "Careers", "Press", "Contact"],
    Services: ["Commercial", "Residential", "Infrastructure", "Industrial"],
    Resources: ["Case Studies", "Blog", "Newsletter", "Support"],
    Legal: ["Privacy", "Terms", "Cookies", "Licenses"],
  };

  return (
    <footer className="glass-panel border-t border-border/50" data-testid="footer">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
                <span className="text-sm font-bold text-primary-foreground">CC</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Construction Connection
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Building the world’s most iconic structures across 40+ countries.
            </p>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-foreground">{category}</h4>
              <ul className="mt-4 space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Construction Connection. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-foreground">
              Twitter
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              LinkedIn
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
