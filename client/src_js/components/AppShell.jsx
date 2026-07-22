import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, AlarmClock, CalendarCheck, Sparkles,
  BarChart3, Users, BrainCircuit, Bell, Menu, X, Search,
  LogOut, Settings, User, Flame,
} from "lucide-react";
import { notifications } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useCurrentUser } from "@/hooks/use-current-user";

const navItems = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/alarms", label: "Smart Alarms", icon: AlarmClock },
  { to: "/app/planner", label: "Study Planner", icon: CalendarCheck },
  { to: "/app/ai", label: "AI Tools", icon: Sparkles },
  { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/app/rooms", label: "Study Rooms", icon: Users },
];

function SidebarContent({ onNavigate }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-2.5 px-5 py-6">
        <span className="grid h-9 w-9 place-items-center rounded-xl btn-gradient">
          <BrainCircuit className="h-5 w-5" />
        </span>
        <span className="font-display text-lg font-bold">NeuroWake</span>
      </Link>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-xl bg-primary-soft"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <item.icon className="relative z-10 h-4 w-4 shrink-0" />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-2xl bg-primary-soft p-4">
        <p className="font-display text-sm font-semibold text-primary">Tonight's tip</p>
        <p className="mt-1 text-xs leading-relaxed text-secondary-foreground">
          Sleep before 23:30 to keep tomorrow's snooze risk under 25%.
        </p>
      </div>
    </div>
  );
}

export function AppShell({ children }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const currentUser = useCurrentUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const unread = notifications.filter((n) => n.unread).length;

  // Derive initials from Firebase user
  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-foreground/30 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-72 bg-sidebar shadow-lift lg:hidden"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-5 rounded-lg p-2 text-muted-foreground hover:bg-muted"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="relative hidden max-w-sm flex-1 sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search sessions, alarms, notes…"
                className="w-full rounded-xl border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring/30"
              />
            </div>

            <div className="ml-auto flex items-center gap-4">
              {/* LeetCode style streak */}
              <div
                onClick={() => navigate({ to: "/app" })}
                className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-bold text-amber-500 bg-amber-500/10 cursor-pointer hover:bg-amber-500/15 transition-all select-none"
                title="Your daily study streak! Complete all tasks today to increase it."
              >
                <Flame className="h-4.5 w-4.5 fill-amber-500 text-amber-500 animate-pulse" />
                <span>{currentUser.streakDays ?? 0}</span>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => { setNotifOpen((v) => !v); setUserMenuOpen(false); }}
                  className="relative rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unread > 0 && (
                    <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                      {unread}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      className="absolute right-0 top-12 w-80 max-w-[85vw] card-surface p-2"
                    >
                      <p className="px-3 py-2 font-display text-sm font-semibold">Notifications</p>
                      {notifications.map((n) => (
                        <div key={n.id} className="rounded-xl px-3 py-2.5 hover:bg-muted">
                          <div className="flex items-center gap-2">
                            {n.unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                            <p className="text-sm font-medium">{n.title}</p>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                          <p className="mt-1 text-[10px] text-muted-foreground/70">{n.time}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User avatar / menu */}
              <div className="relative">
                <button
                  onClick={() => { setUserMenuOpen((v) => !v); setNotifOpen(false); }}
                  className="flex items-center gap-2.5 rounded-xl py-1.5 pl-1.5 pr-3 hover:bg-muted"
                >
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={displayName}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid h-8 w-8 place-items-center rounded-full btn-gradient text-xs font-bold">
                      {initials}
                    </span>
                  )}
                  <div className="hidden text-left md:block">
                    <p className="text-sm font-semibold leading-tight">{displayName}</p>
                    <p className="text-[11px] text-muted-foreground">{user?.email}</p>
                  </div>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      className="absolute right-0 top-12 w-48 card-surface p-1"
                    >
                      <Link
                        to="/app/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <User className="h-4 w-4" /> Profile
                      </Link>
                      <Link
                        to="/app/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <Settings className="h-4 w-4" /> Settings
                      </Link>
                      <div className="my-1 h-px bg-border" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                      >
                        <LogOut className="h-4 w-4" /> Log out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
