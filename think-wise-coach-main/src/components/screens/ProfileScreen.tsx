import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Bell, 
  Download, 
  Settings, 
  ChevronRight,
  Target,
  Flame,
  Calendar,
  Trophy,
  Moon,
  Smartphone,
  Mail,
  LogOut,
  Trash2,
  HelpCircle
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useTheme } from "next-themes";

interface ProfileScreenProps {
  onLogout?: () => void;
  user?: { email: string; name?: string };
}

export function ProfileScreen({ onLogout, user }: ProfileScreenProps) {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    weeklyReport: true,
    coachTips: false,
    restDayReminder: true,
  });

  const userStats = {
    totalWorkouts: 47,
    currentStreak: 5,
    longestStreak: 12,
    totalMinutes: 1420,
    caloriesBurned: 8500,
    memberSince: "Nov 2024",
  };

  const handleExportHistory = () => {
    toast.success("Workout history exported", {
      description: "Check your downloads folder for the CSV file."
    });
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    toast.success("Logged out successfully");
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion", {
      description: "Please contact support to delete your account."
    });
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="gradient-primary px-6 pt-12 pb-20">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-white">
                {user?.name || user?.email?.split('@')[0] || 'User'}
              </h1>
              <p className="text-white/80 text-sm">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 -mt-12 space-y-6">
        {/* User Stats */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Your Stats
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <StatItem 
              icon={Target}
              label="Total Workouts"
              value={userStats.totalWorkouts.toString()}
            />
            <StatItem 
              icon={Flame}
              label="Current Streak"
              value={`${userStats.currentStreak} days`}
            />
            <StatItem 
              icon={Calendar}
              label="Total Minutes"
              value={userStats.totalMinutes.toLocaleString()}
            />
            <StatItem 
              icon={Trophy}
              label="Calories Burned"
              value={userStats.caloriesBurned.toLocaleString()}
            />
          </div>

          <Separator className="my-4" />
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Longest Streak</span>
            <span className="font-semibold text-primary">{userStats.longestStreak} days</span>
          </div>
        </GlassCard>

        {/* Notification Preferences */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </h2>

          <div className="space-y-4">
            <NotificationToggle
              icon={Smartphone}
              label="Daily Workout Reminder"
              description="Get reminded at your preferred workout time"
              checked={notifications.dailyReminder}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, dailyReminder: checked }))
              }
            />
            <NotificationToggle
              icon={Mail}
              label="Weekly Progress Report"
              description="Receive a summary every Sunday"
              checked={notifications.weeklyReport}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, weeklyReport: checked }))
              }
            />
            <NotificationToggle
              icon={Moon}
              label="Rest Day Reminders"
              description="Gentle nudges on recovery days"
              checked={notifications.restDayReminder}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, restDayReminder: checked }))
              }
            />
            <NotificationToggle
              icon={HelpCircle}
              label="Health Mate Tips & Insights"
              description="Personalized suggestions for improvement"
              checked={notifications.coachTips}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, coachTips: checked }))
              }
            />
          </div>
        </GlassCard>

        {/* Theme Settings */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
            <Moon className="w-5 h-5 text-primary" />
            Appearance
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Toggle between light and dark themes</p>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>
          </div>
        </GlassCard>

        {/* Export & Data */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Workout History
          </h2>

          <p className="text-sm text-muted-foreground mb-4">
            Export your complete workout history as a CSV file for personal records or analysis.
          </p>

          <Button 
            onClick={handleExportHistory}
            variant="outline"
            className="w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export History (CSV)
            </span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </GlassCard>

        {/* Account Management */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Account
          </h2>

          <div className="space-y-2">
            <AccountAction
              icon={User}
              label="Edit Profile"
              onClick={() => toast.info("Profile editing coming soon")}
            />
            <AccountAction
              icon={Target}
              label="Update Fitness Goals"
              onClick={() => toast.info("Goal settings coming soon")}
            />
            <AccountAction
              icon={HelpCircle}
              label="Help & Support"
              onClick={() => toast.info("Opening help center...")}
            />
            
            <Separator className="my-4" />
            
            <AccountAction
              icon={LogOut}
              label="Log Out"
              onClick={handleLogout}
              variant="muted"
            />
            <AccountAction
              icon={Trash2}
              label="Delete Account"
              onClick={handleDeleteAccount}
              variant="danger"
            />
          </div>
        </GlassCard>

        {/* App Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-4"
        >
          <p className="text-xs text-muted-foreground">
            HealthMate v1.0.0
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Your data is encrypted and secure
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function StatItem({ 
  icon: Icon, 
  label, 
  value 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string; 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-muted/50 rounded-xl p-4"
    >
      <Icon className="w-5 h-5 text-primary mb-2" />
      <p className="text-xl font-heading font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </motion.div>
  );
}

function NotificationToggle({ 
  icon: Icon,
  label, 
  description,
  checked,
  onCheckedChange 
}: { 
  icon: React.ElementType;
  label: string; 
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center mt-0.5">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function AccountAction({ 
  icon: Icon, 
  label, 
  onClick,
  variant = "default"
}: { 
  icon: React.ElementType; 
  label: string; 
  onClick: () => void;
  variant?: "default" | "muted" | "danger";
}) {
  const variants = {
    default: "hover:bg-muted",
    muted: "text-muted-foreground hover:bg-muted",
    danger: "text-destructive hover:bg-destructive/10",
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${variants[variant]}`}
    >
      <span className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <span className="text-sm font-medium">{label}</span>
      </span>
      <ChevronRight className="w-4 h-4 opacity-50" />
    </button>
  );
}
