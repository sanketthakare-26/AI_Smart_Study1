import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Flame, Award, Camera, Check, Save,
  GraduationCap, BookOpen, Plus, Trash2, CheckCircle2,
  Clock, School, Building2, ChevronDown, ChevronUp,
} from "lucide-react";
import { fadeUp, PageHeader } from "@/components/kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/profile")({
  head: () => ({ meta: [{ title: "My Profile — NeuroWake" }] }),
  component: ProfilePage,
});

// ── helpers ──────────────────────────────────────────────────────────────────
function loadProfile() {
  try {
    const raw = localStorage.getItem("nw_profile_full");
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  // For new users: return blank defaults (no dummy data)
  const nwUser = (() => {
    try { return JSON.parse(localStorage.getItem("nw_user") || "{}"); } catch { return {}; }
  })();
  return {
    name: nwUser.name || "",
    email: nwUser.email || "",
    bio: "",
    targetHours: "4",
    avatarUrl: null,
    education: {
      degree: "B.Tech",
      field: "",
      institution: "",
      startYear: new Date().getFullYear().toString(),
      endYear: (new Date().getFullYear() + 4).toString(),
      currentSemester: "1st Semester",
    },
    courses: [],
  };
}

const INPUT_CLASS =
  "w-full px-3 py-2.5 rounded-xl border border-input bg-card text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-ring/10 transition-all";

const DEGREES = ["B.Tech", "B.E.", "B.Sc", "BCA", "B.Com", "MBA", "M.Tech", "M.Sc", "MCA", "PhD", "Diploma", "Other"];
const SEMESTERS = ["1st Semester","2nd Semester","3rd Semester","4th Semester","5th Semester","6th Semester","7th Semester","8th Semester","Final Year"];
const STATUS_COLORS = {
  completed: "bg-emerald-soft text-emerald-brand border border-emerald-500/20",
  "in-progress": "bg-amber-soft text-amber-brand border border-amber-500/20",
  pending: "bg-muted text-muted-foreground border border-border",
};
const STATUS_ICONS = {
  completed: CheckCircle2,
  "in-progress": Clock,
  pending: BookOpen,
};

// ── Component ─────────────────────────────────────────────────────────────────
function ProfilePage() {
  const nwUser = (() => {
    try { return JSON.parse(localStorage.getItem("nw_user") || "{}"); } catch { return {}; }
  })();

  const [profile, setProfile] = useState(loadProfile);
  const [saved, setSaved] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [newCourse, setNewCourse] = useState({
    name: "",
    hours: 0,
    mastery: 50,
    nextTopic: "",
    color: "var(--chart-1)",
    status: "preparation",
    examDate: "",
    credits: 3,
  });
  const [eduOpen, setEduOpen] = useState(true);
  const [coursesOpen, setCoursesOpen] = useState(true);
  const fileRef = useRef(null);

  // ── Avatar upload ───────────────────────────────────────────────────────────
  const handleAvatarUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfile((p) => ({ ...p, avatarUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  }, []);

  // ── Field helpers ───────────────────────────────────────────────────────────
  const set = (key) => (e) => setProfile((p) => ({ ...p, [key]: e.target.value }));
  const setEdu = (key) => (e) => setProfile((p) => ({ ...p, education: { ...p.education, [key]: e.target.value } }));
  const deleteCourse = (id) => setProfile((p) => ({ ...p, courses: p.courses.filter((c) => c.id !== id) }));

  const addCourse = () => {
    if (!newCourse.name.trim()) return;
    if (editingCourseId) {
      setProfile((p) => ({
        ...p,
        courses: p.courses.map((c) =>
          c.id === editingCourseId
            ? {
                ...c,
                name: newCourse.name.trim(),
                hours: Number(newCourse.hours) || 0,
                mastery: Number(newCourse.mastery) || 0,
                nextTopic: newCourse.nextTopic.trim() || "Overview",
                color: newCourse.color,
                status: newCourse.status,
                examDate: newCourse.status === "exam" ? newCourse.examDate : "",
              }
            : c
        ),
      }));
      setEditingCourseId(null);
    } else {
      setProfile((p) => ({
        ...p,
        courses: [
          ...p.courses,
          {
            id: `c_${Date.now()}`,
            name: newCourse.name.trim(),
            hours: Number(newCourse.hours) || 0,
            mastery: Number(newCourse.mastery) || 0,
            nextTopic: newCourse.nextTopic.trim() || "Overview",
            color: newCourse.color,
            status: newCourse.status,
            examDate: newCourse.status === "exam" ? newCourse.examDate : "",
            credits: 3,
          },
        ],
      }));
    }
    setNewCourse({
      name: "",
      hours: 0,
      mastery: 50,
      nextTopic: "",
      color: "var(--chart-1)",
      status: "preparation",
      examDate: "",
      credits: 3,
    });
    setShowAddCourse(false);
  };

  const startEditCourse = (c) => {
    setNewCourse({
      name: c.name || "",
      hours: c.hours || 0,
      mastery: c.mastery ?? 50,
      nextTopic: c.nextTopic || "",
      color: c.color || "var(--chart-1)",
      status: c.status || "preparation",
      examDate: c.examDate || "",
      credits: c.credits || 3,
    });
    setEditingCourseId(c.id);
    setShowAddCourse(true);
  };

  // ── Save ────────────────────────────────────────────────────────────────────
  function handleSave() {
    localStorage.setItem("nw_profile_full", JSON.stringify(profile));
    // Mark onboarding as complete so the setup modal won't reappear
    localStorage.setItem("nw_profile_setup_done", "true");

    // Sync courses → nw_subjects so Planner & Analytics pick them up immediately
    const CHART_COLORS = [
      "var(--chart-1)", "var(--chart-2)", "var(--chart-3)",
      "var(--chart-4)", "var(--chart-5)",
      "#a78bfa", "#34d399", "#fb923c", "#38bdf8", "#f472b6",
    ];
    const syncedSubjects = profile.courses.map((c, idx) => ({
      id: c.id || `ps_${idx}`,
      name: c.name,
      color: c.color || CHART_COLORS[idx % CHART_COLORS.length],
      hours: Number(c.hours) || 0,
      mastery: Number(c.mastery) ?? 50,
      nextTopic: c.nextTopic || c.name,
      status: c.status || "preparation",
      examDate: c.status === "exam" ? (c.examDate || "") : "",
    }));
    localStorage.setItem("nw_subjects", JSON.stringify(syncedSubjects));

    // Also keep nw_user name/email in sync
    const updatedUser = { ...nwUser, name: profile.name, email: profile.email };
    localStorage.setItem("nw_user", JSON.stringify(updatedUser));

    // Notify all listeners
    window.dispatchEvent(new StorageEvent("storage", { key: "nw_user" }));
    window.dispatchEvent(new StorageEvent("storage", { key: "nw_profile_full" }));
    window.dispatchEvent(new StorageEvent("storage", { key: "nw_subjects" }));
    window.dispatchEvent(new Event("nw_subjects_updated"));

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const initials = profile.name.split(" ").map((n) => n[0]).join("").toUpperCase();
  const completed = profile.courses.filter((c) => c.status === "completed").length;
  const inProgress = profile.courses.filter((c) => c.status === "in-progress").length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="My Profile"
        description="Manage personal details, academic history, and course progress."
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* ── Left: Avatar card ─────────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="card-surface p-6 flex flex-col items-center text-center space-y-4 self-start">
          {/* Avatar with upload */}
          <div className="relative group">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="h-28 w-28 rounded-full object-cover shadow-lift border-2 border-primary/30"
              />
            ) : (
              <span className="grid h-28 w-28 place-items-center rounded-full btn-gradient text-4xl font-bold text-white shadow-lift border-2 border-primary/20">
                {initials}
              </span>
            )}
            {/* Upload overlay */}
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute inset-0 rounded-full bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-semibold gap-1"
            >
              <Camera className="h-5 w-5" />
              Change
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            {/* Plan badge */}
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground shadow-sm whitespace-nowrap">
              {nwUser.plan || "Free"}
            </span>
          </div>

          <div className="pt-2">
            <h2 className="font-display text-xl font-bold">{profile.name}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{profile.email}</p>
            {profile.education.degree && (
              <p className="text-xs text-primary font-semibold mt-1">
                {profile.education.degree} · {profile.education.field}
              </p>
            )}
            {profile.education.institution && (
              <p className="text-[11px] text-muted-foreground">{profile.education.institution}</p>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2.5 w-full pt-4 border-t border-border">
            <div className="bg-muted/40 p-3 rounded-xl flex flex-col items-center">
              <Flame className="h-5 w-5 fill-rose-500 text-rose-500 mb-1" />
              <span className="text-lg font-bold">{nwUser.streakDays || 0}</span>
              <span className="text-[9px] uppercase text-muted-foreground tracking-wider font-semibold">Streak</span>
            </div>
            <div className="bg-muted/40 p-3 rounded-xl flex flex-col items-center">
              <Award className="h-5 w-5 text-primary mb-1" />
              <span className="text-lg font-bold">{nwUser.focusScore || 0}%</span>
              <span className="text-[9px] uppercase text-muted-foreground tracking-wider font-semibold">Focus</span>
            </div>
            <div className="bg-muted/40 p-3 rounded-xl flex flex-col items-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 mb-1" />
              <span className="text-lg font-bold">{completed}</span>
              <span className="text-[9px] uppercase text-muted-foreground tracking-wider font-semibold">Done</span>
            </div>
            <div className="bg-muted/40 p-3 rounded-xl flex flex-col items-center">
              <Clock className="h-5 w-5 text-amber-500 mb-1" />
              <span className="text-lg font-bold">{inProgress}</span>
              <span className="text-[9px] uppercase text-muted-foreground tracking-wider font-semibold">Active</span>
            </div>
          </div>

          <button
            onClick={() => fileRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/40 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Camera className="h-3.5 w-3.5" /> Upload Profile Photo
          </button>
        </motion.div>

        {/* ── Right: Form panels ──────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Personal Info */}
          <motion.div variants={fadeUp} className="card-surface p-6 space-y-4">
            <h3 className="font-display text-base font-semibold flex items-center gap-2 border-b border-border pb-3">
              <User className="h-4 w-4 text-primary" /> Personal Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Full Name</label>
                <input type="text" value={profile.name} onChange={set("name")} className={INPUT_CLASS} placeholder="Your name" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Email Address</label>
                <input type="email" value={profile.email} onChange={set("email")} className={INPUT_CLASS} placeholder="your@email.com" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Bio / Study Goals</label>
              <textarea
                value={profile.bio}
                rows={2}
                onChange={set("bio")}
                className={cn(INPUT_CLASS, "resize-none")}
                placeholder="Tell us about your academic goals..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Target Study Hours / Day</label>
              <select value={profile.targetHours} onChange={set("targetHours")} className={INPUT_CLASS}>
                <option value="2">2 Hours</option>
                <option value="4">4 Hours (Recommended)</option>
                <option value="6">6 Hours (Deep Focus)</option>
                <option value="8">8 Hours (Hardcore)</option>
              </select>
            </div>
          </motion.div>

          {/* Academic / Education */}
          <motion.div variants={fadeUp} className="card-surface overflow-hidden">
            <button
              onClick={() => setEduOpen((v) => !v)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
            >
              <h3 className="font-display text-base font-semibold flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" /> Academic Information
              </h3>
              {eduOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
            <AnimatePresence initial={false}>
              {eduOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 space-y-4 border-t border-border pt-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Degree</label>
                        <select value={profile.education.degree} onChange={setEdu("degree")} className={INPUT_CLASS}>
                          {DEGREES.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Field of Study / Branch</label>
                        <input type="text" value={profile.education.field} onChange={setEdu("field")} className={INPUT_CLASS} placeholder="e.g. Computer Science & Engineering" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                        <Building2 className="inline h-3.5 w-3.5 mr-1" />
                        College / University
                      </label>
                      <input type="text" value={profile.education.institution} onChange={setEdu("institution")} className={INPUT_CLASS} placeholder="e.g. XYZ College of Engineering" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Admission Year</label>
                        <input type="number" min="2000" max="2030" value={profile.education.startYear} onChange={setEdu("startYear")} className={INPUT_CLASS} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Graduation Year</label>
                        <input type="number" min="2000" max="2030" value={profile.education.endYear} onChange={setEdu("endYear")} className={INPUT_CLASS} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Current Semester</label>
                        <select value={profile.education.currentSemester} onChange={setEdu("currentSemester")} className={INPUT_CLASS}>
                          {SEMESTERS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Courses */}
          <motion.div variants={fadeUp} className="card-surface overflow-hidden">
            <button
              onClick={() => setCoursesOpen((v) => !v)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
            >
              <h3 className="font-display text-base font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" /> Courses &amp; Subjects
                <span className="ml-1 inline-flex gap-1.5">
                  <span className="rounded-full bg-emerald-soft text-emerald-brand text-[10px] font-bold px-2 py-0.5">{completed} done</span>
                  <span className="rounded-full bg-amber-soft text-amber-brand text-[10px] font-bold px-2 py-0.5">{inProgress} active</span>
                </span>
              </h3>
              {coursesOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>

            <AnimatePresence initial={false}>
              {coursesOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-border">
                    {/* Course rows */}
                    <div className="divide-y divide-border/60">
                      {profile.courses.map((course) => {
                        const Icon = STATUS_ICONS[course.status] || BookOpen;
                        return (
                          <div key={course.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 hover:bg-muted/20 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className="h-3 w-3 rounded-full shrink-0" style={{ background: course.color || "var(--chart-1)" }} />
                              <Icon className={cn("h-4 w-4 shrink-0",
                                course.status === "completed" ? "text-emerald-500" :
                                course.status === "exam" ? "text-rose-500" :
                                course.status === "revision" ? "text-amber-500" : "text-primary"
                              )} />
                              <div>
                                <p className="text-sm font-semibold">{course.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {course.hours || 0}h studied · Mastery: {course.mastery ?? 50}% · next: {course.nextTopic || "Overview"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="capitalize text-xs font-semibold rounded-full px-3 py-1 border bg-muted text-muted-foreground">
                                {course.status}
                              </span>
                              <button
                                onClick={() => startEditCourse(course)}
                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteCourse(course.id)}
                                className="rounded-lg p-1.5 text-destructive/60 hover:bg-destructive/10 hover:text-destructive transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Add/Edit course form - matching Study Planner exact form */}
                    <div className="px-6 py-4 border-t border-border">
                      <AnimatePresence>
                        {showAddCourse ? (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4"
                          >
                            <h4 className="font-display text-sm font-bold">
                              {editingCourseId ? "Edit Subject" : "Add New Subject"}
                            </h4>
                            <div className="space-y-4">
                              <div>
                                <label className="text-xs font-semibold text-muted-foreground">Subject Name</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Computer Networks"
                                  className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-ring/15"
                                  value={newCourse.name}
                                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-xs font-semibold text-muted-foreground">Hours Studied</label>
                                  <input
                                    type="number"
                                    step="0.1"
                                    placeholder="e.g. 10"
                                    className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-ring/15"
                                    value={newCourse.hours || ""}
                                    onChange={(e) => setNewCourse({ ...newCourse, hours: parseFloat(e.target.value) || 0 })}
                                  />
                                </div>
                                <div>
                                  <label className="text-xs font-semibold text-muted-foreground">Mastery (%)</label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="e.g. 50"
                                    className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-ring/15"
                                    value={newCourse.mastery}
                                    onChange={(e) => setNewCourse({ ...newCourse, mastery: parseInt(e.target.value) || 0 })}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-muted-foreground">Next Topic</label>
                                <input
                                  type="text"
                                  placeholder="e.g. IP Routing"
                                  className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-ring/15"
                                  value={newCourse.nextTopic}
                                  onChange={(e) => setNewCourse({ ...newCourse, nextTopic: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-muted-foreground">Study Mode</label>
                                <div className="flex rounded-xl bg-muted p-1 mt-1 border border-border">
                                  {["preparation", "revision", "exam"].map((mode) => (
                                    <button
                                      key={mode}
                                      type="button"
                                      onClick={() => setNewCourse({ ...newCourse, status: mode })}
                                      className={cn(
                                        "flex-1 text-center py-2 text-xs font-semibold rounded-lg capitalize transition-all",
                                        newCourse.status === mode ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                                      )}
                                    >
                                      {mode}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              {newCourse.status === "exam" && (
                                <div>
                                  <label className="text-xs font-semibold text-muted-foreground">Exam Date</label>
                                  <input
                                    type="date"
                                    className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-ring/15"
                                    value={newCourse.examDate || ""}
                                    onChange={(e) => setNewCourse({ ...newCourse, examDate: e.target.value })}
                                  />
                                </div>
                              )}
                              <div>
                                <label className="text-xs font-semibold text-muted-foreground font-display">Color Theme</label>
                                <div className="flex gap-2.5 mt-2">
                                  {["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"].map((c) => (
                                    <button
                                      key={c}
                                      type="button"
                                      className={cn("h-6 w-6 rounded-full border-2 transition-all", newCourse.color === c ? "border-primary scale-110" : "border-transparent")}
                                      style={{ background: c }}
                                      onClick={() => setNewCourse({ ...newCourse, color: c })}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                              <button
                                className="px-4 py-2 text-xs font-semibold rounded-xl card-surface hover:bg-muted"
                                onClick={() => {
                                  setShowAddCourse(false);
                                  setEditingCourseId(null);
                                }}
                              >
                                Cancel
                              </button>
                              <button className="btn-gradient px-4 py-2 text-xs font-semibold rounded-xl" onClick={addCourse}>
                                {editingCourseId ? "Save Changes" : "Add Subject"}
                              </button>
                            </div>
                          </motion.div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingCourseId(null);
                              setNewCourse({
                                name: "",
                                hours: 0,
                                mastery: 50,
                                nextTopic: "",
                                color: "var(--chart-1)",
                                status: "preparation",
                                examDate: "",
                                credits: 3,
                              });
                              setShowAddCourse(true);
                            }}
                            className="flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
                          >
                            <Plus className="h-4 w-4" /> Add Subject
                          </button>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Save Bar */}
          <div className="flex items-center justify-between rounded-2xl border border-border bg-card/60 px-5 py-3 backdrop-blur-sm">
            <div>
              {saved && (
                <span className="text-sm font-semibold text-emerald-brand flex items-center gap-1.5">
                  <Check className="h-4 w-4" /> Profile saved successfully!
                </span>
              )}
            </div>
            <button
              onClick={handleSave}
              className="btn-gradient inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-lift"
            >
              <Save className="h-4 w-4" /> Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
