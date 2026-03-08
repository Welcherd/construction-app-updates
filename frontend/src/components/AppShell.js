import { useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Home, Wrench, FolderKanban, MessageCircle, User } from "lucide-react";

const tabs = [
  { id: "home", label: "Home", icon: Home },
  { id: "equipment", label: "Equipment", icon: Wrench },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "profile", label: "Profile", icon: User },
];

export function AppShell({ activeTab, onTabChange, children, topBar }) {
  const scrollRefs = useRef({});
  const contentRef = useRef(null);

  const getScrollElement = useCallback(
    (tabId) => {
      const root = contentRef.current;
      if (!root) return null;
      return root.querySelector(`[data-tab-id="${tabId}"] [data-scroll-container]`) ?? root;
    },
    []
  );

  const handleTabClick = useCallback(
    (tabId) => {
      const currentScrollEl = getScrollElement(activeTab);
      if (tabId === activeTab) {
        currentScrollEl?.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (currentScrollEl) {
        scrollRefs.current[activeTab] = currentScrollEl.scrollTop;
      }

      onTabChange(tabId);

      requestAnimationFrame(() => {
        const nextScrollEl = getScrollElement(tabId);
        if (nextScrollEl) {
          nextScrollEl.scrollTop = scrollRefs.current[tabId] || 0;
        }
      });
    },
    [activeTab, getScrollElement, onTabChange]
  );

  return (
    <div className="flex h-[100dvh] flex-col bg-transparent" data-testid="app-shell">
      {topBar && (
        <header
          className="sticky top-0 z-40 flex items-center glass-panel border-b border-border/50"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          {topBar}
        </header>
      )}

      <main
        ref={contentRef}
        className="flex-1 overflow-y-auto"
      >
        {children}
      </main>

      <nav
        className="sticky bottom-0 z-40 glass-panel border-t border-border/50"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        role="tablist"
        aria-label="Main navigation"
        data-testid="bottom-nav"
      >
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={tab.label}
                data-testid={`nav-${tab.id}`}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 py-2 pt-2.5 text-xs font-medium transition-colors select-none",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground active:text-foreground"
                )}
                onClick={() => handleTabClick(tab.id)}
              >
                <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
