import { useState, useEffect } from "react";
import "@/App.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import EarthBackground from "@/components/EarthBackground";
import { AppShell } from "@/components/AppShell";
import { FeedTab } from "@/components/FeedTab";
import { EquipmentTab } from "@/components/EquipmentTab";
import { ProjectsTab } from "@/components/ProjectsTab";
import { MessagesTab } from "@/components/MessagesTab";
import { ProfileTab } from "@/components/ProfileTab";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import MapSection from "@/components/MapSection";
import RegisteredUsers from "@/components/RegisteredUsers";
import FindWorkersSection from "@/components/FindWorkersSection";
import { AuthModal } from "@/components/AuthModal";
import { useIsMobile } from "@/hooks/useMobile";
import { HardHat, Bell, Globe, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

function TopBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <div className="flex w-full items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <HardHat className="h-5 w-5 text-primary-foreground" />
            <Globe className="absolute -bottom-0.5 -right-0.5 h-3 w-3 text-accent" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground tracking-tight leading-tight">
              ConstructionConnection
            </h1>
            <p className="text-[10px] text-muted-foreground tracking-wider uppercase leading-none">
              42 countries · 186K workers
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:block">
                {user?.username}
              </span>
              <button
                type="button"
                className="relative rounded-lg p-2 text-muted-foreground transition-colors select-none active:bg-muted"
                aria-label="Notifications"
                data-testid="notifications-btn"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
              </button>
            </>
          ) : (
            <Button size="sm" onClick={() => setShowAuth(true)} data-testid="mobile-login-btn">
              <User className="h-4 w-4 mr-1" />
              Sign In
            </Button>
          )}
        </div>
      </div>
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}

const ALL_TABS = ["home", "equipment", "projects", "messages", "profile"];

function MobileApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [mountedTabs, setMountedTabs] = useState(new Set(["home"]));

  useEffect(() => {
    setMountedTabs((prev) => {
      if (prev.has(activeTab)) return prev;
      return new Set([...prev, activeTab]);
    });
  }, [activeTab]);

  const tabComponents = {
    home: <FeedTab />,
    equipment: <EquipmentTab />,
    projects: <ProjectsTab />,
    messages: <MessagesTab />,
    profile: <ProfileTab />,
  };

  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      topBar={activeTab !== "messages" ? <TopBar /> : (
        <div className="flex w-full items-center px-4 py-2.5">
          <h1 className="text-lg font-bold text-foreground">Messages</h1>
        </div>
      )}
    >
      {ALL_TABS.map((tabId) => {
        if (!mountedTabs.has(tabId)) return null;
        return (
          <div
            key={tabId}
            data-tab-id={tabId}
            className={activeTab === tabId ? "block h-full" : "hidden"}
            aria-hidden={activeTab !== tabId}
          >
            {tabComponents[tabId]}
          </div>
        );
      })}
    </AppShell>
  );
}

function DesktopApp() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <FindWorkersSection />
        <MapSection />
        <RegisteredUsers />
        <ProjectsSection />
        <ServicesSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

function AppContent() {
  const isMobile = useIsMobile();

  return (
    <>
      <EarthBackground />
      <div className="relative z-10">
        {isMobile ? <MobileApp /> : <DesktopApp />}
      </div>
    </>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
