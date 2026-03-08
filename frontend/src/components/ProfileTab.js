import { useState } from "react";
import { PullToRefresh } from "@/components/PullToRefresh";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTheme } from "@/components/ThemeProvider";
import {
  User,
  MapPin,
  Briefcase,
  Mail,
  Phone,
  Globe,
  Settings,
  Bell,
  Shield,
  LogOut,
  Moon,
  Sun,
  Camera,
  Edit2,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ProfileTab() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);

  const handleRefresh = async () => {
    await new Promise((r) => setTimeout(r, 1200));
  };

  return (
    <PullToRefresh onRefresh={handleRefresh} className="h-full">
      <div className="space-y-4 pb-8">
        {/* Profile Header */}
        <div className="glass-panel px-4 py-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-2xl font-bold text-primary">
                JD
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground"
                data-testid="change-avatar"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-foreground">John Doe</h2>
                <button type="button" className="text-muted-foreground hover:text-foreground">
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">Senior Project Manager</p>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>New York, NY</span>
                <span className="text-border">·</span>
                <Globe className="h-3.5 w-3.5" />
                <span>Available for projects</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-background/50 px-3 py-2 text-center">
              <p className="text-lg font-bold text-foreground">47</p>
              <p className="text-xs text-muted-foreground">Projects</p>
            </div>
            <div className="rounded-lg bg-background/50 px-3 py-2 text-center">
              <p className="text-lg font-bold text-foreground">12</p>
              <p className="text-xs text-muted-foreground">Countries</p>
            </div>
            <div className="rounded-lg bg-background/50 px-3 py-2 text-center">
              <p className="text-lg font-bold text-foreground">4.9</p>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="glass-panel divide-y divide-border/50">
          <SettingsItem
            icon={theme === "dark" ? Moon : Sun}
            label="Dark Mode"
            action={
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                data-testid="dark-mode-toggle"
              />
            }
          />
          <SettingsItem
            icon={Bell}
            label="Notifications"
            action={
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
                data-testid="notifications-toggle"
              />
            }
          />
          <SettingsItem icon={Shield} label="Privacy & Security" chevron />
          <SettingsItem icon={Settings} label="Account Settings" chevron />
        </div>

        {/* Contact Info */}
        <div className="glass-panel divide-y divide-border/50">
          <SettingsItem icon={Mail} label="john.doe@construction.com" />
          <SettingsItem icon={Phone} label="+1 (555) 123-4567" />
          <SettingsItem icon={Briefcase} label="15 years experience" />
        </div>

        {/* Actions */}
        <div className="px-4 space-y-3">
          <Button variant="outline" className="w-full justify-start gap-2" data-testid="logout-btn">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>

          {/* Danger Zone */}
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <h3 className="text-sm font-semibold text-destructive">Danger Zone</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Permanently delete your account and all data
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-3 gap-2"
                  data-testid="delete-account-btn"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="glass-panel border-border/50">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-foreground">Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-background/50">Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </PullToRefresh>
  );
}

function SettingsItem({ icon: Icon, label, action, chevron }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/50">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <span className="text-sm text-foreground">{label}</span>
      </div>
      {action}
      {chevron && (
        <span className="text-muted-foreground">›</span>
      )}
    </div>
  );
}
