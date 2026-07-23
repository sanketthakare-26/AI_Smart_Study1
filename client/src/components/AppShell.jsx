import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, AlarmClock, CalendarCheck, Sparkles,
  BarChart3, Users, BrainCircuit, Bell, Menu, X, Search,
  LogOut, Settings, User, Flame, CheckCheck, Trash2,
  BookOpen, Brain, Zap, TrendingUp, Moon, AlarmCheck,
  Clock, Award, Target, Plus, GraduationCap, Save, CheckCircle2, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useCurrentUser } from "@/hooks/use-current-user";
import { VediqLogo } from "@/components/VediqLogo";
import { checkGlobalAlarms } from "@/lib/alarm-manager";

// ── Live notification engine with Persistent Deletion ─────────────────────────
function buildLiveNotifications() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  let deletedIds = new Set();
  try {
    const raw = localStorage.getItem("vediq_deleted_notif_ids");
    if (raw) deletedIds = new Set(JSON.parse(raw));
  } catch (_) {}

  let user = {};
  let profile = { courses: [] };
  let alarms = [];
  let subjects = [];

  try { user    = JSON.parse(localStorage.getItem("nw_user")         || "{}"); } catch (_) {}
  try { profile = JSON.parse(localStorage.getItem("nw_profile_full") || "{}"); } catch (_) {}
  try { alarms  = JSON.parse(localStorage.getItem("VediQ_alarms_v2") || "[]"); } catch (_) {}
  try { subjects = JSON.parse(localStorage.getItem("nw_subjects")    || "[]"); } catch (_) {}

  const name        = user.name       || "Student";
  const streak      = user.streakDays || 0;
  const enabledAlarms = alarms.filter(a => a.enabled);

  const notifications = [];

  const add = (n) => {
    if (!deletedIds.has(n.id)) {
      notifications.push({ unread: true, ts: Date.now(), ...n });
    }
  };

  // 1. Alarm Ringing in X minutes notification
  if (enabledAlarms.length > 0) {
    const sorted = [...enabledAlarms].sort((a, b) => (a.time || "").localeCompare(b.time || ""));
    const nextAlarm = sorted[0];
    const [aH, aM] = (nextAlarm.time || "07:00").split(":").map(Number);
    let alarmMinLeft = (aH * 60 + aM) - (hour * 60 + minute);
    if (alarmMinLeft < 0) alarmMinLeft += 1440;

    add({
      id: `notif_alarm_${nextAlarm.id}`,
      icon: "alarm",
      title: `⏰ Alarm ringing in ${alarmMinLeft} min: ${nextAlarm.label || "Study Alarm"}`,
      body: `Set for ${nextAlarm.time}. Adaptive wake window is active to ensure optimal wake phase.`,
      category: "alarm",
    });
  }

  // 2. Collaborative Study Room & Inviting Friends notification
  add({
    id: "notif_room_active",
    icon: "users",
    title: "🏫 Study Rooms live on VediQ",
    body: "Collaborative study rooms are active. Join friends or invite them using your 5-digit Friend ID.",
    category: "study",
  });

  // 3. Time-aware greeting / tip
  if (hour >= 5 && hour < 9) {
    add({
      id: "notif_tip_morning",
      icon: "sunrise",
      title: "🌅 Good morning, " + name.split(" ")[0] + "!",
      body: `It's ${timeStr}. Best focus window is 06:00–10:00. Start your first session now.`,
      category: "tip",
    });
  } else if (hour >= 9 && hour < 12) {
    add({
      id: "notif_tip_peak",
      icon: "brain",
      title: "🧠 Peak focus window active",
      body: `${timeStr} — Highest retention period. Start a revision session on VediQ.`,
      category: "tip",
    });
  } else {
    add({
      id: "notif_tip_evening",
      icon: "moon",
      title: "🌙 Evening revision window",
      body: `${timeStr} — Finish your subject goals and set your VediQ alarm for tomorrow.`,
      category: "tip",
    });
  }

  // 4. Streak status
  if (streak > 0) {
    add({
      id: `notif_streak_${streak}`,
      icon: "flame",
      title: `🔥 ${streak}-day streak active!`,
      body: `Complete study tasks today to keep your ${streak}-day streak alive on VediQ.`,
      category: "streak",
    });
  }

  return notifications;
}

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const NOTIF_ICONS = {
  sunrise: "🌅", brain: "🧠", clock: "🕐", zap: "⚡", book: "📚",
  moon: "🌙", flame: "🔥", target: "🎯", alarm: "⏰", award: "🏅",
  users: "👥", trending: "📈", default: "🔔",
};

const CATEGORY_COLORS = {
  tip: "bg-sky-soft text-sky-brand border-sky-500/20",
  streak: "bg-amber-soft text-amber-brand border-amber-500/20",
  focus: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  alarm: "bg-rose-soft text-rose-brand border-rose-500/20",
  study: "bg-emerald-soft text-emerald-brand border-emerald-500/20",
  achievement: "bg-amber-soft text-amber-brand border-amber-500/20",
  exam: "bg-rose-soft text-rose-brand border-rose-500/20",
  system: "bg-muted text-muted-foreground border-border",
};

function useLiveNotifications() {
  const [notifs, setNotifs] = useState(() => buildLiveNotifications());
  const [readIds, setReadIds] = useState(new Set());

  // Rebuild every 60 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setNotifs(buildLiveNotifications());
    }, 60_000);
    return () => clearInterval(timer);
  }, []);

  // Rebuild when localStorage changes
  useEffect(() => {
    const onStorage = () => setNotifs(buildLiveNotifications());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const markAllRead = useCallback(() => {
    setReadIds(new Set(notifs.map(n => n.id)));
  }, [notifs]);

  const deleteNotif = useCallback((idToDelete) => {
    setNotifs(prev => prev.filter(n => n.id !== idToDelete));
    try {
      const raw = localStorage.getItem("vediq_deleted_notif_ids");
      const current = raw ? JSON.parse(raw) : [];
      if (!current.includes(idToDelete)) {
        current.push(idToDelete);
        localStorage.setItem("vediq_deleted_notif_ids", JSON.stringify(current));
      }
    } catch (_) {}
  }, []);

  const clearAll = useCallback(() => {
    const ids = notifs.map(n => n.id);
    setNotifs([]);
    setReadIds(new Set());
    try {
      const raw = localStorage.getItem("vediq_deleted_notif_ids");
      const current = raw ? JSON.parse(raw) : [];
      const updated = Array.from(new Set([...current, ...ids]));
      localStorage.setItem("vediq_deleted_notif_ids", JSON.stringify(updated));
    } catch (_) {}
  }, [notifs]);

  const unread = notifs.filter(n => !readIds.has(n.id)).length;

  return { notifs, readIds, unread, markAllRead, clearAll, deleteNotif };
}

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
  const [tip, setTip] = useState("");

  // Live sidebar tip — refreshes every minute
  useEffect(() => {
    const buildTip = () => {
      const h = new Date().getHours();
      const tips = [
        h < 9  ? "Start your morning session now — peak retention window is 06:00–10:00." : null,
        h >= 9  && h < 12 ? "Your focus is sharpest right now. Tackle the hardest subject first." : null,
        h >= 12 && h < 14 ? "Post-lunch dip coming. A 10-min walk boosts alertness significantly." : null,
        h >= 14 && h < 18 ? "Afternoon secondary focus peak. Great for practice sets & drills." : null,
        h >= 18 && h < 21 ? "Evening revision time. Flashcards & spaced repetition work best now." : null,
        h >= 21            ? "Sleep before 23:30 to keep tomorrow's snooze risk under 25%." : null,
      ].filter(Boolean);
      return tips[0] || "Stay consistent. Even 25 minutes of focused study compounds over time.";
    };
    setTip(buildTip());
    const t = setInterval(() => setTip(buildTip()), 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center px-5 py-6">
        <VediqLogo className="h-10 w-10" textClassName="font-display text-2xl font-bold tracking-tight" />
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
        <p className="font-display text-sm font-semibold text-primary flex items-center gap-1.5">
          <span className="animate-pulse">💡</span> Tonight's tip
        </p>
        <p className="mt-1 text-xs leading-relaxed text-secondary-foreground">{tip}</p>
      </div>
    </div>
  );
}

// ── Onboarding Modal ──────────────────────────────────────────────────────────
const CHART_COLORS_OB = [
  "var(--chart-1)", "var(--chart-2)", "var(--chart-3)",
  "var(--chart-4)", "var(--chart-5)",
  "#a78bfa", "#34d399", "#fb923c", "#38bdf8", "#f472b6",
];

const OB_INPUT = "w-full px-3 py-2.5 rounded-xl border border-input bg-card text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-ring/10 transition-all";
const OB_DEGREES = ["B.Tech", "B.E.", "B.Sc", "BCA", "B.Com", "MBA", "M.Tech", "M.Sc", "MCA", "PhD", "Diploma", "Other"];
const OB_SEMESTERS = ["1st Semester","2nd Semester","3rd Semester","4th Semester","5th Semester","6th Semester","7th Semester","8th Semester","Final Year"];

function OnboardingModal({ user: firebaseUser, onClose }) {
  const [step, setStep] = useState(1); // 1 = personal info, 2 = subjects
  const [name, setName] = useState(firebaseUser?.displayName || "");
  const [email, setEmail] = useState(firebaseUser?.email || "");
  const [bio, setBio] = useState("");
  const [targetHours, setTargetHours] = useState("4");
  const [degree, setDegree] = useState("B.Tech");
  const [field, setField] = useState("");
  const [institution, setInstitution] = useState("");
  const [semester, setSemester] = useState("1st Semester");
  const [courses, setCourses] = useState([]);
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseHours, setNewCourseHours] = useState(0);
  const [newCourseMastery, setNewCourseMastery] = useState(50);
  const [newCourseNextTopic, setNewCourseNextTopic] = useState("");
  const [newCourseStatus, setNewCourseStatus] = useState("preparation");
  const [newCourseExamDate, setNewCourseExamDate] = useState("");
  const [newCourseColor, setNewCourseColor] = useState("var(--chart-1)");
  const [saved, setSaved] = useState(false);

  const addCourse = () => {
    if (!newCourseName.trim()) return;
    setCourses(prev => [...prev, {
      id: `c_${Date.now()}`,
      name: newCourseName.trim(),
      hours: Number(newCourseHours) || 0,
      mastery: Number(newCourseMastery) ?? 50,
      nextTopic: newCourseNextTopic.trim() || "Overview",
      status: newCourseStatus,
      examDate: newCourseStatus === "exam" ? newCourseExamDate : "",
      color: newCourseColor,
    }]);
    setNewCourseName("");
    setNewCourseHours(0);
    setNewCourseMastery(50);
    setNewCourseNextTopic("");
    setNewCourseStatus("preparation");
    setNewCourseExamDate("");
    setNewCourseColor("var(--chart-1)");
  };

  const removeCourse = (id) => setCourses(prev => prev.filter(c => c.id !== id));

  const handleSave = () => {
    const yr = new Date().getFullYear();
    const profile = {
      name, email, bio, targetHours, avatarUrl: null,
      education: { degree, field, institution, startYear: yr.toString(), endYear: (yr + 4).toString(), currentSemester: semester },
      courses,
    };
    localStorage.setItem("nw_profile_full", JSON.stringify(profile));
    const userKey = firebaseUser?.uid || firebaseUser?.email || "default";
    localStorage.setItem(`nw_profile_setup_done_${userKey}`, "true");
    localStorage.setItem("nw_profile_setup_done", "true");

    // Sync courses → nw_subjects
    const syncedSubjects = courses.map((c, idx) => ({
      id: c.id || `ps_${idx}`,
      name: c.name,
      color: c.color || CHART_COLORS_OB[idx % CHART_COLORS_OB.length],
      hours: Number(c.hours) || 0,
      mastery: Number(c.mastery) ?? 50,
      nextTopic: c.nextTopic || c.name,
      status: c.status || "preparation",
      examDate: c.status === "exam" ? (c.examDate || "") : "",
    }));
    localStorage.setItem("nw_subjects", JSON.stringify(syncedSubjects));

    const updatedUser = { name, email };
    localStorage.setItem("nw_user", JSON.stringify(updatedUser));
    window.dispatchEvent(new StorageEvent("storage", { key: "nw_subjects" }));
    window.dispatchEvent(new StorageEvent("storage", { key: "nw_profile_full" }));

    setSaved(true);
    setTimeout(() => onClose(), 1200);
  };

  const handleSkip = () => {
    const userKey = firebaseUser?.uid || firebaseUser?.email || "default";
    localStorage.setItem(`nw_profile_setup_done_${userKey}`, "skipped");
    localStorage.setItem("nw_profile_setup_done", "skipped");
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/75 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 backdrop-blur-sm px-6 py-4">
          <div>
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-xl btn-gradient text-sm">👋</span>
              Welcome to VediQ!
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Set up your profile to personalize your study experience</p>
          </div>
          <button
            onClick={handleSkip}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors"
          >
            Skip Now
          </button>
        </div>

        {/* Step tabs */}
        <div className="flex border-b border-border">
          {[{n:1,label:"Personal Info"},{n:2,label:"Your Subjects"}].map(({n,label}) => (
            <button
              key={n}
              onClick={() => setStep(n)}
              className={cn(
                "flex-1 py-3 text-sm font-semibold transition-colors",
                step === n
                  ? "text-primary border-b-2 border-primary bg-primary-soft/20"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Step {n}: {label}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4">
          {step === 1 && (
            <>
              {/* Personal info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className={OB_INPUT} placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={OB_INPUT} placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Bio / Study Goals</label>
                <textarea
                  value={bio}
                  rows={2}
                  onChange={e => setBio(e.target.value)}
                  className={cn(OB_INPUT, "resize-none")}
                  placeholder="Tell us about your academic goals..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Target Study Hours / Day</label>
                <select value={targetHours} onChange={e => setTargetHours(e.target.value)} className={OB_INPUT}>
                  <option value="2">2 Hours</option>
                  <option value="4">4 Hours (Recommended)</option>
                  <option value="6">6 Hours (Deep Focus)</option>
                  <option value="8">8 Hours (Hardcore)</option>
                </select>
              </div>

              {/* Academic info */}
              <div className="border-t border-border pt-4">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2"><GraduationCap className="h-4 w-4 text-primary" /> Academic Details</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Degree</label>
                    <select value={degree} onChange={e => setDegree(e.target.value)} className={OB_INPUT}>
                      {OB_DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Field of Study</label>
                    <input type="text" value={field} onChange={e => setField(e.target.value)} className={OB_INPUT} placeholder="e.g. Computer Science" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">College / University</label>
                  <input type="text" value={institution} onChange={e => setInstitution(e.target.value)} className={OB_INPUT} placeholder="e.g. XYZ College of Engineering" />
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Current Semester</label>
                  <select value={semester} onChange={e => setSemester(e.target.value)} className={OB_INPUT}>
                    {OB_SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="btn-gradient rounded-xl px-6 py-2.5 text-sm font-bold"
                >
                  Next: Add Subjects →
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <h4 className="font-semibold text-sm mb-1 flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /> Add Your Subjects</h4>
                <p className="text-xs text-muted-foreground mb-4">These will automatically appear in your Study Planner.</p>

                {/* Existing courses */}
                {courses.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {courses.map((c, i) => {
                      const StatusIcon = c.status === "completed" ? CheckCircle2 : c.status === "in-progress" ? Clock : BookOpen;
                      return (
                        <div key={c.id} className="flex items-center gap-3 rounded-xl border border-border px-4 py-2.5 bg-muted/20">
                          <div
                            className="h-3 w-3 rounded-full shrink-0"
                            style={{ background: CHART_COLORS_OB[i % CHART_COLORS_OB.length] }}
                          />
                          <StatusIcon className={cn("h-4 w-4 shrink-0",
                            c.status === "completed" ? "text-emerald-500" :
                            c.status === "in-progress" ? "text-amber-500" : "text-muted-foreground"
                          )} />
                          <span className="flex-1 text-sm font-medium">{c.name}</span>
                          <span className={cn(
                            "text-[10px] font-semibold rounded-full px-2 py-0.5 border",
                            c.status === "completed" ? "bg-emerald-soft text-emerald-brand border-emerald-500/20" :
                            c.status === "in-progress" ? "bg-amber-soft text-amber-brand border-amber-500/20" :
                            "bg-muted text-muted-foreground border-border"
                          )}>{c.status}</span>
                          <span className="text-[10px] text-muted-foreground">{c.credits}cr</span>
                          <button onClick={() => removeCourse(c.id)} className="rounded p-1 text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Add new subject inline with full planner fields */}
                <div className="rounded-xl border border-dashed border-primary/40 bg-primary-soft/10 p-4 space-y-3">
                  <p className="text-xs font-semibold text-primary">+ Add a Subject</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Subject Name</label>
                      <input
                        type="text"
                        value={newCourseName}
                        onChange={e => setNewCourseName(e.target.value)}
                        className={OB_INPUT}
                        placeholder="e.g. Computer Networks"
                      />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Hours Studied</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="e.g. 10"
                          value={newCourseHours}
                          onChange={e => setNewCourseHours(parseFloat(e.target.value) || 0)}
                          className={OB_INPUT}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Mastery (%)</label>
                        <input
                          type="number"
                          min="0" max="100"
                          placeholder="e.g. 50"
                          value={newCourseMastery}
                          onChange={e => setNewCourseMastery(parseInt(e.target.value) || 0)}
                          className={OB_INPUT}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Next Topic</label>
                      <input
                        type="text"
                        placeholder="e.g. IP Routing"
                        value={newCourseNextTopic}
                        onChange={e => setNewCourseNextTopic(e.target.value)}
                        className={OB_INPUT}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Study Mode</label>
                      <div className="flex rounded-xl bg-muted p-1 border border-border">
                        {["preparation", "revision", "exam"].map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setNewCourseStatus(s)}
                            className={cn(
                              "flex-1 text-center py-1.5 text-xs font-semibold rounded-lg capitalize transition-all",
                              newCourseStatus === s
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    {newCourseStatus === "exam" && (
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Exam Date</label>
                        <input
                          type="date"
                          value={newCourseExamDate}
                          onChange={e => setNewCourseExamDate(e.target.value)}
                          className={OB_INPUT}
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Color Theme</label>
                      <div className="flex gap-2.5 mt-1">
                        {["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"].map((c) => (
                          <button
                            key={c}
                            type="button"
                            className={cn("h-6 w-6 rounded-full border-2 transition-all", newCourseColor === c ? "border-primary scale-110" : "border-transparent")}
                            style={{ background: c }}
                            onClick={() => setNewCourseColor(c)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={addCourse}
                    className="w-full flex items-center justify-center gap-2 rounded-xl btn-gradient text-white text-sm font-semibold py-2 mt-2 shadow-sm"
                  >
                    <Plus className="h-4 w-4" /> Add Subject
                  </button>
                </div>

                {courses.length === 0 && (
                  <p className="text-center text-xs text-muted-foreground mt-4">No subjects added yet. Add at least one to populate your Study Planner.</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <button onClick={() => setStep(1)} className="text-sm text-muted-foreground hover:text-foreground font-medium">← Back</button>
                <div className="flex items-center gap-3">
                  {saved && (
                    <span className="text-sm font-semibold text-emerald-brand flex items-center gap-1.5">
                      <Check className="h-4 w-4" /> Saved!
                    </span>
                  )}
                  <button
                    onClick={handleSave}
                    className="btn-gradient inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold"
                  >
                    <Save className="h-4 w-4" /> Save & Continue
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function AppShell({ children }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const currentUser = useCurrentUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Global background alarm engine: monitor alarms every second across all pages
  useEffect(() => {
    const timer = setInterval(() => {
      checkGlobalAlarms(navigate);
    }, 1000);
    checkGlobalAlarms(navigate);
    return () => clearInterval(timer);
  }, [navigate]);

  // Check if user should see the onboarding profile setup form upon logging in / registering
  useEffect(() => {
    if (typeof window === "undefined" || !user) return;
    const userKey = user?.uid || user?.email || "default";
    const doneUser = localStorage.getItem(`nw_profile_setup_done_${userKey}`);
    const doneGlobal = localStorage.getItem("nw_profile_setup_done");
    const forceShow = sessionStorage.getItem("force_show_onboarding");
    
    // Show modal compulsory on every login/registration session OR if setup hasn't been completed
    if (forceShow === "true" || (!doneUser && !doneGlobal)) {
      setShowOnboarding(true);
      sessionStorage.removeItem("force_show_onboarding");
    }
  }, [user]);

  const { notifs, readIds, unread, markAllRead, clearAll, deleteNotif } = useLiveNotifications();

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
                placeholder="Search sessions, alarms, notes on VediQ…"
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
                  <Bell className={cn("h-5 w-5", unread > 0 && "animate-[wiggle_1s_ease-in-out_infinite]")} />
                  <AnimatePresence>
                    {unread > 0 && (
                      <motion.span
                        key={unread}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground"
                      >
                        {unread > 9 ? "9+" : unread}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      className="absolute right-0 top-12 w-96 max-w-[92vw] card-surface overflow-hidden"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-border px-4 py-3">
                        <div className="flex items-center gap-2">
                          <p className="font-display text-sm font-semibold">VediQ Notifications</p>
                          {unread > 0 && (
                            <span className="rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">
                              {unread} new
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={markAllRead}
                            title="Mark all as read"
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          >
                            <CheckCheck className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={clearAll}
                            title="Clear all"
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Live indicator */}
                      <div className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-soft/60 border-b border-emerald-500/10">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                          Live · Updates every minute
                        </p>
                      </div>

                      {/* Notification list */}
                      <div className="max-h-[420px] overflow-y-auto divide-y divide-border/40">
                        {notifs.length === 0 ? (
                          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                            <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                            All caught up!
                          </div>
                        ) : (
                          notifs.map((n, idx) => {
                            const isRead = readIds.has(n.id);
                            return (
                              <motion.div
                                key={n.id}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.04 }}
                                onClick={() => setReadIds(prev => new Set([...prev, n.id]))}
                                className={cn(
                                  "group flex gap-3 px-4 py-3 cursor-pointer transition-colors relative",
                                  isRead ? "hover:bg-muted/40" : "bg-primary/[0.03] hover:bg-primary/[0.06]"
                                )}
                              >
                                {/* Icon */}
                                <div className={cn(
                                  "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-sm",
                                  CATEGORY_COLORS[n.category] || CATEGORY_COLORS.system
                                )}>
                                  {NOTIF_ICONS[n.icon] || NOTIF_ICONS.default}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-start justify-between gap-1">
                                    <div className="flex items-start gap-1">
                                      {!isRead && (
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                      )}
                                      <p className={cn(
                                        "text-[13px] leading-snug",
                                        isRead ? "font-normal text-muted-foreground" : "font-semibold text-foreground"
                                      )}>
                                        {n.title}
                                      </p>
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteNotif(n.id);
                                      }}
                                      title="Delete notification"
                                      className="opacity-0 group-hover:opacity-100 rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all shrink-0"
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                  <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">
                                    {n.body}
                                  </p>
                                  <p className="mt-1 text-[10px] text-muted-foreground/60 font-medium">
                                    {timeAgo(n.ts)}
                                  </p>
                                </div>
                              </motion.div>
                            );
                          })
                        )}
                      </div>

                      {/* Footer */}
                      {notifs.length > 0 && (
                        <div className="border-t border-border px-4 py-2 text-center">
                          <p className="text-[10px] text-muted-foreground">
                            {notifs.length} notification{notifs.length !== 1 ? "s" : ""} · Auto-refreshes every 60s
                          </p>
                        </div>
                      )}
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

      {/* Onboarding modal for new users */}
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingModal
            user={user}
            onClose={() => setShowOnboarding(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

