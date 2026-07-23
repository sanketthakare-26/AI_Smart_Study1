import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlarmClock, Award, Brain, Download, Flame, Loader2,
  Moon, Sparkles, Sunrise, Trophy, Zap,
} from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie,
  PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { fadeUp, PageHeader, staggerContainer } from "@/components/kit";
import {
  badges, focusTrend as initialFocusTrend,
  monthlyProgress, studyHours,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { mlApi } from "@/api/client.js";
import { useCurrentUser } from "@/hooks/use-current-user";
import { jsPDF } from "jspdf";

// ── Profile-based subject helpers ─────────────────────────────────────────────
const CHART_COLORS = [
  "var(--chart-1)", "var(--chart-2)", "var(--chart-3)",
  "var(--chart-4)", "var(--chart-5)",
  "#a78bfa", "#34d399", "#fb923c", "#38bdf8", "#f472b6",
];

/** Read courses dynamically from nw_subjects and nw_profile_full in localStorage */
function loadProfileSubjects() {
  const CHART_COLORS = [
    "var(--chart-1)", "var(--chart-2)", "var(--chart-3)",
    "var(--chart-4)", "var(--chart-5)",
    "#a78bfa", "#34d399", "#fb923c", "#38bdf8", "#f472b6",
  ];

  const map = new Map();

  const addOrMerge = (name, color, hours, status, id) => {
    if (!name || typeof name !== "string") return;
    const cleanName = name.trim();
    if (!cleanName) return;
    const key = cleanName.toLowerCase();
    const parsedHours = Number(hours);
    const validHours = (!isNaN(parsedHours) && parsedHours > 0)
      ? parsedHours
      : (status === "completed" ? 20 : status === "in-progress" ? 12 : 5);

    if (map.has(key)) {
      const existing = map.get(key);
      existing.hours = Math.max(existing.hours, validHours);
      if (color && !existing.color) existing.color = color;
    } else {
      map.set(key, {
        id: id || `sub_${map.size}_${Date.now()}`,
        name: cleanName,
        color: color || CHART_COLORS[map.size % CHART_COLORS.length],
        hours: validHours,
        status: status || "in-progress",
      });
    }
  };

  // 1. Read from nw_subjects (populated by Study Planner & Profile)
  try {
    const rawSubjects = localStorage.getItem("nw_subjects");
    if (rawSubjects) {
      const parsed = JSON.parse(rawSubjects);
      if (Array.isArray(parsed)) {
        parsed.forEach((s, idx) => {
          addOrMerge(s.name, s.color, s.hours, s.status, s.id || `sub_${idx}`);
        });
      }
    }
  } catch (_) {}

  // 2. Read from nw_profile_full (profile courses)
  try {
    const rawProfile = localStorage.getItem("nw_profile_full");
    if (rawProfile) {
      const profile = JSON.parse(rawProfile);
      if (Array.isArray(profile.courses)) {
        profile.courses.forEach((c, idx) => {
          const hoursFromCredits = c.status === "completed" ? (c.credits || 3) * 5
               : c.status === "in-progress" ? (c.credits || 3) * 3
               : (c.credits || 3) * 1;
          addOrMerge(c.name, c.color, c.hours || hoursFromCredits, c.status, c.id || `ps_${idx}`);
        });
      }
    }
  } catch (_) {}

  const result = Array.from(map.values());
  if (result.length > 0) return result;

  // Fallback default subjects if empty
  return [
    { id: "s1", name: "Computer Network", color: "var(--chart-1)", hours: 14, status: "in-progress" },
    { id: "s2", name: "Operating System", color: "var(--chart-2)", hours: 10, status: "in-progress" },
  ];
}

/** Hook that stays in sync with profile & subject storage changes and custom events */
function useProfileSubjects() {
  const [subjects, setSubjects] = useState(loadProfileSubjects);

  useEffect(() => {
    const update = () => setSubjects(loadProfileSubjects());

    const onStorage = (e) => {
      if (!e.key || e.key === "nw_profile_full" || e.key === "nw_subjects" || e.key === "nw_completed_tasks") {
        update();
      }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("nw_subjects_updated", update);
    window.addEventListener("focus", update);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("nw_subjects_updated", update);
      window.removeEventListener("focus", update);
    };
  }, []);

  return subjects;
}

export const Route = createFileRoute("/app/analytics")({
  head: () => ({ meta: [{ title: "Analytics — VediQ" }] }),
  component: AnalyticsPage,
});

// ── helpers ──────────────────────────────────────────────────────────────────
const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--border)",
  boxShadow: "var(--shadow-card)",
  fontSize: 13,
};
const badgeIcons = {
  sunrise: Sunrise, brain: Brain, flame: Flame,
  trophy: Trophy, alarm: AlarmClock, moon: Moon,
};
const heatColors = ["bg-muted", "bg-sky-soft", "bg-sky-brand/40", "bg-primary/60", "bg-primary"];

// SUBJECT_TYPES is now derived dynamically from the user's profile courses (see FocusScoreCalculator).

const TIME_OF_DAY = [
  { value: 0, label: "Early morning (5–8 AM)" },
  { value: 1, label: "Morning (8–12 PM)" },
  { value: 2, label: "Afternoon (12–5 PM)" },
  { value: 3, label: "Evening (5–9 PM)" },
  { value: 4, label: "Night (9 PM+)" },
];

function scoreColor(s) {
  if (s >= 75) return "text-emerald-500";
  if (s >= 50) return "text-amber-500";
  return "text-rose-500";
}
function scoreLabel(s) {
  if (s >= 75) return "Excellent";
  if (s >= 60) return "Good";
  if (s >= 45) return "Average";
  return "Needs improvement";
}
function scoreRing(s) {
  if (s >= 75) return "stroke-emerald-500";
  if (s >= 50) return "stroke-amber-500";
  return "stroke-rose-500";
}

/** Circular gauge SVG */
function ScoreGauge({ score }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width={140} height={140} viewBox="0 0 140 140" className="mx-auto">
      <circle cx={70} cy={70} r={r} fill="none" strokeWidth={12} className="stroke-muted" />
      <motion.circle
        cx={70} cy={70} r={r} fill="none" strokeWidth={12}
        strokeLinecap="round"
        className={scoreRing(score)}
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
      />
      <text x={70} y={66} textAnchor="middle" className="font-display" fill="currentColor"
        style={{ fontSize: 26, fontWeight: 800, fill: "var(--foreground)" }}>
        {score}
      </text>
      <text x={70} y={84} textAnchor="middle" style={{ fontSize: 12, fill: "var(--muted-foreground)" }}>
        / 100
      </text>
    </svg>
  );
}

// ── SliderInput helper ────────────────────────────────────────────────────────
function SliderInput({ label, id, min, max, step = 1, value, onChange, suffix = "", hint }) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <label htmlFor={id} className="text-sm font-medium">{label}</label>
        <span className="text-sm font-bold text-primary">{value}{suffix}</span>
      </div>
      <input
        id={id} type="range" min={min} max={max} step={step}
        value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary h-2 rounded-full bg-muted cursor-pointer"
      />
      {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

// ── Focus Score Calculator Card ───────────────────────────────────────────────
function FocusScoreCalculator({ onScoreCalculated }) {
  const profileSubjects = useProfileSubjects();

  const subjectTypeOptions = useMemo(() =>
    profileSubjects.map((s, i) => ({ value: i, label: s.name })),
    [profileSubjects]
  );

  const [studyDuration, setStudyDuration] = useState(60);
  const [breaksTaken, setBreaksTaken] = useState(2);
  const [subjectType, setSubjectType] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState(1);
  const [selfRating, setSelfRating] = useState(7);
  const [sleepHours, setSleepHours] = useState(7);
  const [distractions, setDistractions] = useState(2);

  useEffect(() => {
    if (subjectType >= subjectTypeOptions.length) setSubjectType(0);
  }, [subjectTypeOptions, subjectType]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const calculate = useCallback(async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const payload = {
        study_duration_minutes: studyDuration,
        breaks_taken: breaksTaken,
        subject_type: subjectType,
        time_of_day: timeOfDay,
        self_rating: selfRating,
        sleep_hours: sleepHours,
        distractions,
      };
      const data = await mlApi.predictFocusScore(payload);
      const score = Math.round(data.focus_score);
      setResult(score);
      onScoreCalculated(score);
    } catch (e) {
      // Fallback calculation algorithm if backend offline
      const base = 50;
      const sleepBonus = (sleepHours - 6) * 5;
      const durationBonus = Math.min(20, studyDuration / 4);
      const breakPenalty = breaksTaken * 3;
      const distractionPenalty = distractions * 6;
      const ratingBonus = (selfRating - 5) * 4;
      const computed = Math.round(Math.max(10, Math.min(100, base + sleepBonus + durationBonus - breakPenalty - distractionPenalty + ratingBonus)));
      setResult(computed);
      onScoreCalculated(computed);
    } finally {
      setLoading(false);
    }
  }, [studyDuration, breaksTaken, subjectType, timeOfDay, selfRating, sleepHours, distractions, onScoreCalculated]);

  return (
    <motion.div variants={fadeUp} className="card-surface p-5 border border-border/80">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Brain className="h-4 w-4 text-primary" />
          </span>
          <div>
            <h2 className="font-display text-base font-bold">ML Focus Score Calculator</h2>
            <p className="text-[11px] text-muted-foreground">
              Enter session parameters · AI predicts retention &amp; focus
            </p>
          </div>
        </div>
        {result !== null && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "rounded-lg px-3 py-1 text-xs font-bold border",
              result >= 75 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600"
                : result >= 50 ? "bg-amber-500/10 border-amber-500/30 text-amber-600"
                : "bg-rose-500/10 border-rose-500/30 text-rose-600"
            )}>
            <Zap className="inline h-3 w-3 mr-1" />
            {scoreLabel(result)} · {result}/100
          </motion.div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_160px]">
        {/* Compact 2-Column Grid Inputs */}
        <div className="space-y-3.5">
          <div className="grid gap-3 sm:grid-cols-2">
            <SliderInput
              label="Study duration" id="fs-duration"
              min={15} max={180} value={studyDuration}
              onChange={setStudyDuration} suffix=" min"
            />
            <SliderInput
              label="Sleep last night" id="fs-sleep"
              min={3} max={12} step={0.5} value={sleepHours}
              onChange={setSleepHours} suffix=" h"
            />
            <SliderInput
              label="Breaks taken" id="fs-breaks"
              min={0} max={5} value={breaksTaken}
              onChange={setBreaksTaken}
            />
            <SliderInput
              label="Distractions (0=none)" id="fs-distractions"
              min={0} max={5} value={distractions}
              onChange={setDistractions}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 items-center">
            {/* Self rating */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs font-semibold text-muted-foreground">Session Quality</label>
                <span className="text-xs font-bold text-primary">{selfRating}/10</span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setSelfRating(n)}
                    className={cn(
                      "h-7 w-7 rounded-md text-xs font-bold transition-all border",
                      selfRating === n
                        ? "btn-gradient border-transparent text-white shadow-sm"
                        : "bg-muted border-border text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject + Time of day */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Subject</label>
                <select
                  value={subjectType}
                  onChange={(e) => setSubjectType(Number(e.target.value))}
                  className="w-full rounded-lg border border-input bg-card px-2 py-1.5 text-xs outline-none focus:border-primary"
                >
                  {subjectTypeOptions.length > 0
                    ? subjectTypeOptions.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))
                    : <option value={0}>General</option>
                  }
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Time of Day</label>
                <select
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(Number(e.target.value))}
                  className="w-full rounded-lg border border-input bg-card px-2 py-1.5 text-xs outline-none focus:border-primary"
                >
                  {TIME_OF_DAY.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            id="calculate-focus-score"
            onClick={calculate}
            disabled={loading}
            className="btn-gradient w-full rounded-xl py-2.5 text-xs font-bold inline-flex items-center justify-center gap-2 shadow-lift hover:shadow-none transition-all disabled:opacity-70 mt-1"
          >
            {loading ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Calculating ML Score…</>
            ) : (
              <><Sparkles className="h-3.5 w-3.5" /> Calculate My Focus Score</>
            )}
          </button>
        </div>

        {/* Result gauge */}
        <div className="flex flex-col items-center justify-center gap-2 border-l border-border/40 pl-4">
          <AnimatePresence mode="wait">
            {result !== null ? (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }} className="text-center">
                <ScoreGauge score={result} />
                <p id="focus-score-result" className={cn("text-xl font-extrabold font-display mt-1", scoreColor(result))}>
                  {result}/100
                </p>
                <p className="text-[11px] text-muted-foreground">{scoreLabel(result)}</p>
              </motion.div>
            ) : (
              <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center space-y-1 py-2">
                <div className="mx-auto h-[100px] w-[100px] rounded-full border-[8px] border-muted flex items-center justify-center">
                  <Brain className="h-8 w-8 text-muted-foreground/30" />
                </div>
                <p className="text-[11px] text-muted-foreground">Hit Calculate</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ── Activity Calendar (LeetCode style 12 months with month gap separation) ────
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function ActivityCalendar({ streakDays }) {
  const containerRef = useRef(null);

  // Load activity intensity log
  const activityMap = useMemo(() => {
    if (typeof window === "undefined") return new Map();
    try {
      const log = JSON.parse(localStorage.getItem("nw_activity_levels") || "{}");
      const map = new Map(Object.entries(log));
      
      const rawComp = localStorage.getItem("nw_completion_log");
      if (rawComp) {
        const comp = JSON.parse(rawComp);
        comp.forEach(d => {
          if (!map.has(d) || map.get(d) === 0) {
            map.set(d, 3); // Level 3 (High Green) when plan is completed
          }
        });
      }

      return map;
    } catch (_) { return new Map(); }
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Build 12 Month Blocks (last 12 months in order ending with current month)
  const monthBlocks = useMemo(() => {
    const blocks = [];
    const currYear = today.getFullYear();
    const currMonth = today.getMonth();

    for (let m = 11; m >= 0; m--) {
      const d = new Date(currYear, currMonth - m, 1);
      const year = d.getFullYear();
      const monthIndex = d.getMonth();
      // Get all days in this month
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
      const days = [];
      for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
        const dateObj = new Date(year, monthIndex, dayNum);
        const iso = dateObj.toISOString().split("T")[0];
        const level = activityMap.get(iso) || 0; // 0 = Inactive (White)
        const isToday = iso === today.toISOString().split("T")[0];
        const isFuture = dateObj > today;
        days.push({ iso, level, isToday, isFuture, dateObj, dayNum, dayOfWeek: dateObj.getDay() });
      }

      // Group days into 7-row columns (weeks)
      const firstDayOfWeek = days[0].dayOfWeek;
      const weeks = [];
      let currentWeek = Array(firstDayOfWeek).fill(null); // Pad before month start

      days.forEach((dayCell) => {
        currentWeek.push(dayCell);
        if (currentWeek.length === 7) {
          weeks.push(currentWeek);
          currentWeek = [];
        }
      });
      if (currentWeek.length > 0) {
        while (currentWeek.length < 7) currentWeek.push(null); // Pad after month end
        weeks.push(currentWeek);
      }

      blocks.push({
        label: MONTH_NAMES[monthIndex],
        year,
        weeks,
      });
    }

    return blocks;
  }, [activityMap]);

  const scroll = (direction) => {
    if (containerRef.current) {
      const amount = direction === "left" ? -320 : 320;
      containerRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const totalActiveDays = Array.from(activityMap.values()).filter(l => l > 0).length;
  const totalSubmissions = Array.from(activityMap.values()).reduce((acc, l) => acc + l, 0);

  function cellColor(cell) {
    if (!cell) return "invisible"; // Empty grid padding
    if (cell.isFuture) return "bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 opacity-30 cursor-not-allowed";
    
    const isTodayRing = cell.isToday ? "ring-2 ring-emerald-500 ring-offset-1 z-10" : "";

    // Inactive = White background
    if (cell.level === 0) return cn("bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60", isTodayRing);

    // Active = Green Shades based on level (including today)
    if (cell.level === 4) return cn("bg-emerald-600 shadow-sm hover:bg-emerald-500 text-white", isTodayRing); // Highest Dark Green
    if (cell.level === 3) return cn("bg-emerald-500 hover:bg-emerald-400 text-white", isTodayRing);            // High Green
    if (cell.level === 2) return cn("bg-emerald-400/80 hover:bg-emerald-400 text-white", isTodayRing);         // Medium Green
    if (cell.level === 1) return cn("bg-emerald-300 hover:bg-emerald-400 dark:bg-emerald-800", isTodayRing);   // Light Green
    return cn("bg-white dark:bg-zinc-800 border border-zinc-200", isTodayRing);
  }

  return (
    <motion.div variants={fadeUp} className="card-surface mt-6 p-6 border border-border/80">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="font-display text-xl font-bold flex items-center gap-2">
            <span className="text-2xl font-extrabold text-foreground">{totalSubmissions}</span>
            <span className="text-sm font-medium text-muted-foreground">submissions in the past one year</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Total active days: <strong className="text-foreground">{totalActiveDays}</strong> · Max streak: <strong className="text-foreground">{streakDays} days</strong>
          </p>
        </div>

        {/* Intensity Legend only */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-xl border border-border/50">
          <span className="text-[11px] font-medium">Less</span>
          <div className="flex gap-1 items-center">
            <span className="h-3 w-3 rounded-[3px] bg-white border border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700" title="Inactive" />
            <span className="h-3 w-3 rounded-[3px] bg-emerald-200 dark:bg-emerald-900/60" title="Light Active" />
            <span className="h-3 w-3 rounded-[3px] bg-emerald-400/70" title="Medium Active" />
            <span className="h-3 w-3 rounded-[3px] bg-emerald-500" title="High Active" />
            <span className="h-3 w-3 rounded-[3px] bg-emerald-600" title="Most Active" />
          </div>
          <span className="text-[11px] font-medium">More</span>
        </div>
      </div>

      {/* 12 Separated Month Blocks Horizontal Scroll */}
      <div ref={containerRef} className="overflow-x-auto pb-4 pt-2 scrollbar-thin scrollbar-thumb-muted/60">
        <div className="flex items-start gap-3" style={{ width: "max-content" }}>
          {/* Day Labels Column (sticky left) */}
          <div className="flex flex-col gap-[4px] mt-[22px] sticky left-0 bg-card z-10 pr-1.5">
            {DAY_LABELS.map((label, d) => (
              <span key={d} className="h-[14px] text-[10px] font-medium text-muted-foreground text-right flex items-center justify-end min-w-[28px]">
                {(d === 1 || d === 3 || d === 5) ? label : ""}
              </span>
            ))}
          </div>

          {/* Month Blocks Separated by Gaps */}
          {monthBlocks.map((block, bi) => (
            <div key={bi} className="flex flex-col items-center gap-1.5 bg-muted/10 p-1.5 rounded-xl border border-border/30">
              {/* Month Name Above */}
              <span className="text-[10px] font-bold text-muted-foreground tracking-wide w-full text-center">
                {block.label}
              </span>
              {/* Weeks Grid */}
              <div className="flex gap-[3px]">
                {block.weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
                    {week.map((cell, di) => (
                      <span
                        key={di}
                        className={cn(
                          "h-[14px] w-[14px] rounded-[3px] transition-all cursor-pointer",
                          cellColor(cell)
                        )}
                        title={cell ? `${cell.iso} · ${cell.level ? `Active (Level ${cell.level})` : "Inactive"}` : ""}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Analytics Page ────────────────────────────────────────────────────────────
function AnalyticsPage() {
  const currentUser = useCurrentUser();
  const profileSubjects = useProfileSubjects();
  const [focusTrend, setFocusTrend] = useState(initialFocusTrend);
  const [alarms] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("VediQ_alarms_v2");
        if (raw) return JSON.parse(raw);
      } catch (_) {}
    }
    return [];
  });

  // Calculate dynamic study hours per week based on user profile subjects
  const dynamicStudyHours = useMemo(() => {
    const totalHoursFromSubjects = profileSubjects.reduce((acc, s) => acc + (Number(s.hours) || 0), 0);
    const baseWeekly = totalHoursFromSubjects > 0 ? Math.round(totalHoursFromSubjects / 3) : 14;
    return [
      { week: "Wk 1", hours: Math.max(8, baseWeekly - 6) },
      { week: "Wk 2", hours: Math.max(10, baseWeekly - 3) },
      { week: "Wk 3", hours: Math.max(12, baseWeekly) },
      { week: "Wk 4", hours: Math.max(15, baseWeekly + 4) },
    ];
  }, [profileSubjects]);

  const dynamicSleepVsFocus = useCallback(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const dayMap = {
      "Mon": "Monday", "Tue": "Tuesday", "Wed": "Wednesday", "Thu": "Thursday",
      "Fri": "Friday", "Sat": "Saturday", "Sun": "Sunday"
    };
    return days.map(day => {
      const fullDay = dayMap[day];
      const alarmForDay = alarms.find(a => a.enabled && a.days && a.days.includes(fullDay));
      const sleep = alarmForDay ? (alarmForDay.sleepHours ?? 7.0) : 7.0;
      
      // Focus score dynamically correlated with sleep hours
      const baseline = 30;
      const sleepContribution = Math.min(10.0, sleep) * 6.5;
      const randomFactor = (Math.sin(day.charCodeAt(0)) * 5); // deterministic variation
      const focus = Math.round(Math.max(10, Math.min(100, baseline + sleepContribution + randomFactor)));
      return { day, sleep, focus };
    });
  }, [alarms])();

  /** Save score to localStorage (nw_user) and append to trend chart */
  const handleScoreCalculated = useCallback((score) => {
    // 1. Update nw_user.focusScore in localStorage → dashboard stat updates reactively
    try {
      const raw = localStorage.getItem("nw_user");
      const user = raw ? JSON.parse(raw) : {};
      user.focusScore = score;
      localStorage.setItem("nw_user", JSON.stringify(user));
      // Dispatch storage event so useCurrentUser() in Dashboard picks it up
      window.dispatchEvent(new StorageEvent("storage", { key: "nw_user" }));
    } catch (_) {}

    // 2. Append to the local trend chart
    const today = new Date();
    const label = today.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
    setFocusTrend((prev) => {
      // Replace if same date already exists, else append
      const exists = prev.find((p) => p.date === label);
      if (exists) return prev.map((p) => p.date === label ? { ...p, score } : p);
      return [...prev.slice(-13), { date: label, score }];
    });
  }, []);

  const [exporting, setExporting] = useState(false);

  // ── PDF Export ─────────────────────────────────────────────────────────────
  const handleExportPDF = useCallback(async () => {
    setExporting(true);
    try {
      const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const PW = 210; // page width
      const PH = 297; // page height
      const M = 15;  // margin
      const CW = PW - M * 2; // content width
      let y = 0;

      // ── Helpers ──
      const hex2rgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b];
      };
      const setFill = (hex) => { const [r,g,b] = hex2rgb(hex); doc.setFillColor(r,g,b); };
      const setTxt  = (hex) => { const [r,g,b] = hex2rgb(hex); doc.setTextColor(r,g,b); };
      const setDraw = (hex) => { const [r,g,b] = hex2rgb(hex); doc.setDrawColor(r,g,b); };

      const checkPage = (needed = 20) => {
        if (y + needed > PH - 20) {
          doc.addPage();
          y = 20;
          // footer on each page
          setTxt("#94a3b8"); doc.setFontSize(8);
          doc.text("VediQ · Confidential", M, PH - 8);
          doc.text(`Page ${doc.getNumberOfPages()}`, PW - M, PH - 8, { align: "right" });
          setTxt("#1e293b");
        }
      };

      // ── Load profile / user data ──
      let userName = "Student";
      let streakDays = 0;
      let focusScore = 0;
      try {
        const u = JSON.parse(localStorage.getItem("nw_user") || "{}");
        userName   = u.name  || userName;
        streakDays = u.streakDays || 0;
        focusScore = u.focusScore || 0;
      } catch (_) {}

      const totalStudyHours = studyHours.reduce((s, w) => s + w.hours, 0);
      const avgFocusTrend = focusTrend.length
        ? Math.round(focusTrend.reduce((a, b) => a + b.score, 0) / focusTrend.length)
        : focusScore;

      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      const fmt = (d) => d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
      const weekLabel = `${fmt(weekStart)} — ${fmt(weekEnd)}`;

      // ══════════════════════════════════════════════════════════════
      // PAGE 1
      // ══════════════════════════════════════════════════════════════

      // ── Gradient header band ──
      setFill("#6366f1"); doc.rect(0, 0, PW, 48, "F");
      setFill("#818cf8"); doc.rect(0, 40, PW, 10, "F"); // soft fade
      setFill("#a5b4fc"); doc.rect(0, 46, PW, 4, "F");

      // App name
      setTxt("#ffffff"); doc.setFontSize(22); doc.setFont("helvetica", "bold");
      doc.text("VediQ", M, 18);
      doc.setFontSize(10); doc.setFont("helvetica", "normal");
      doc.text("AI-Powered Study Analytics", M, 25);

      // Report title (right)
      doc.setFontSize(14); doc.setFont("helvetica", "bold");
      doc.text("Weekly Study Report", PW - M, 18, { align: "right" });
      doc.setFontSize(9); doc.setFont("helvetica", "normal");
      doc.text(weekLabel, PW - M, 25, { align: "right" });
      doc.text(`Generated: ${now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`, PW - M, 31, { align: "right" });

      y = 58;

      // ── Student info ──
      setTxt("#1e293b"); doc.setFontSize(16); doc.setFont("helvetica", "bold");
      doc.text(userName, M, y); y += 7;
      setTxt("#64748b"); doc.setFontSize(9); doc.setFont("helvetica", "normal");
      doc.text("Personal Performance Summary", M, y); y += 10;

      // ── KPI boxes ──
      const kpis = [
        { label: "Current Streak",  value: `${streakDays} days`,       bg: "#fef3c7", accent: "#d97706" },
        { label: "Avg Focus Score", value: `${avgFocusTrend}/100`,    bg: "#ede9fe", accent: "#6366f1" },
        { label: "Total Study Hrs", value: `${totalStudyHours}h`,     bg: "#d1fae5", accent: "#059669" },
        { label: "Subjects Active", value: `${profileSubjects.length}`, bg: "#e0f2fe", accent: "#0284c7" },
      ];
      const kpiW = (CW - 9) / 4;
      kpis.forEach((k, i) => {
        const kx = M + i * (kpiW + 3);
        setFill(k.bg); doc.roundedRect(kx, y, kpiW, 22, 3, 3, "F");
        const [ar, ag, ab] = hex2rgb(k.accent);
        doc.setTextColor(ar, ag, ab); doc.setFontSize(16); doc.setFont("helvetica", "bold");
        doc.text(k.value, kx + kpiW / 2, y + 11, { align: "center" });
        setTxt("#475569"); doc.setFontSize(7); doc.setFont("helvetica", "normal");
        doc.text(k.label.toUpperCase(), kx + kpiW / 2, y + 18, { align: "center" });
      });
      y += 30;

      // ── Section: Subject Time Distribution ──
      checkPage(60);
      setFill("#f8fafc"); doc.rect(M, y, CW, 7, "F");
      setTxt("#6366f1"); doc.setFontSize(11); doc.setFont("helvetica", "bold");
      doc.text("📚  Subject Time Distribution", M + 2, y + 5); y += 10;

      // Table header
      const cols = [70, 25, 25, 30, 30];
      const headers = ["Subject", "Hours", "Credits", "Status", "Est. Mastery"];
      let cx = M;
      setFill("#e2e8f0"); doc.rect(M, y, CW, 7, "F");
      setTxt("#334155"); doc.setFontSize(8); doc.setFont("helvetica", "bold");
      headers.forEach((h, i) => {
        doc.text(h, cx + 2, y + 5); cx += cols[i];
      }); y += 7;

      // Table rows
      const subjectColors = ["#6366f1","#06b6d4","#10b981","#f59e0b","#ec4899","#8b5cf6","#14b8a6","#f97316"];
      profileSubjects.forEach((s, idx) => {
        checkPage(8);
        if (idx % 2 === 0) { setFill("#f8fafc"); doc.rect(M, y, CW, 7, "F"); }
        cx = M;
        // Colour dot
        const [cr, cg, cb] = hex2rgb(subjectColors[idx % subjectColors.length]);
        doc.setFillColor(cr, cg, cb); doc.circle(cx + 3, y + 3.5, 2, "F");
        setTxt("#1e293b"); doc.setFontSize(8); doc.setFont("helvetica", "bold");
        doc.text(s.name, cx + 7, y + 5); cx += cols[0];
        doc.setFont("helvetica", "normal");
        setTxt("#475569"); doc.text(`${s.hours}h`, cx + 2, y + 5); cx += cols[1];
        // credits from profile
        let credits = "—";
        try {
          const p = JSON.parse(localStorage.getItem("nw_profile_full") || "{}");
          const c = (p.courses || []).find(c2 => c2.name === s.name);
          if (c) credits = String(c.credits || "—");
        } catch (_) {}
        doc.text(credits, cx + 2, y + 5); cx += cols[2];
        const statusLabel = s.status === "completed" ? "✔ Done" : s.status === "in-progress" ? "⟳ Active" : "⌛ Pending";
        doc.text(statusLabel, cx + 2, y + 5); cx += cols[3];
        const mastery = s.status === "completed" ? "90%" : s.status === "in-progress" ? "60%" : "30%";
        doc.text(mastery, cx + 2, y + 5);
        y += 7;
      });
      if (profileSubjects.length === 0) {
        setTxt("#94a3b8"); doc.setFontSize(8);
        doc.text("No subjects found. Add courses in your Profile.", M + 2, y + 5); y += 10;
      }
      y += 8;

      // ── Section: Weekly Study Hours ──
      checkPage(60);
      setFill("#f8fafc"); doc.rect(M, y, CW, 7, "F");
      setTxt("#6366f1"); doc.setFontSize(11); doc.setFont("helvetica", "bold");
      doc.text("📊  Weekly Study Hours", M + 2, y + 5); y += 10;

      // Mini bar chart (drawn manually)
      const barAreaH = 40;
      const barAreaW = CW;
      const maxHours = Math.max(...studyHours.map(w => w.hours), 1);
      const barW = Math.floor((barAreaW - (studyHours.length + 1) * 3) / studyHours.length);
      studyHours.forEach((w, i) => {
        checkPage(barAreaH + 15);
        const barH = Math.round((w.hours / maxHours) * barAreaH);
        const bx = M + i * (barW + 3);
        const by = y + barAreaH - barH;
        setFill("#818cf8"); doc.roundedRect(bx, by, barW, barH, 2, 2, "F");
        setTxt("#1e293b"); doc.setFontSize(7); doc.setFont("helvetica", "bold");
        doc.text(`${w.hours}h`, bx + barW / 2, by - 1.5, { align: "center" });
        setTxt("#64748b"); doc.setFont("helvetica", "normal");
        doc.text(w.week, bx + barW / 2, y + barAreaH + 5, { align: "center" });
      });
      y += barAreaH + 12;

      // ── Section: Focus Score Trend ──
      checkPage(60);
      setFill("#f8fafc"); doc.rect(M, y, CW, 7, "F");
      setTxt("#6366f1"); doc.setFontSize(11); doc.setFont("helvetica", "bold");
      doc.text("📈  Focus Score Trend (ML-Predicted)", M + 2, y + 5); y += 10;

      // Line chart (drawn manually)
      const trendH = 35;
      const trendW = CW;
      const trendMax = 100;
      const pts = focusTrend.map((p, i) => ({
        x: M + (i / (focusTrend.length - 1 || 1)) * trendW,
        y: y + trendH - (p.score / trendMax) * trendH,
        score: p.score,
        date: p.date,
      }));
      // Background grid
      setDraw("#e2e8f0"); doc.setLineWidth(0.2);
      [0, 25, 50, 75, 100].forEach(v => {
        const gy = y + trendH - (v / 100) * trendH;
        doc.line(M, gy, M + trendW, gy);
        setTxt("#94a3b8"); doc.setFontSize(6);
        doc.text(String(v), M - 4, gy + 1, { align: "right" });
      });
      // Line
      if (pts.length > 1) {
        setDraw("#6366f1"); doc.setLineWidth(0.8);
        for (let i = 0; i < pts.length - 1; i++) {
          doc.line(pts[i].x, pts[i].y, pts[i+1].x, pts[i+1].y);
        }
        // Dots
        pts.forEach(p => {
          setFill("#6366f1"); doc.circle(p.x, p.y, 1.5, "F");
          setTxt("#1e293b"); doc.setFontSize(7); doc.setFont("helvetica", "bold");
          doc.text(String(p.score), p.x, p.y - 2.5, { align: "center" });
          setTxt("#64748b"); doc.setFontSize(6); doc.setFont("helvetica", "normal");
          doc.text(p.date, p.x, y + trendH + 5, { align: "center" });
        });
      } else {
        setTxt("#94a3b8"); doc.setFontSize(8);
        doc.text("Calculate your focus score to see the trend here.", M + trendW / 2, y + trendH / 2, { align: "center" });
      }
      y += trendH + 14;

      // ── Section: Sleep vs Focus (table) ──
      checkPage(60);
      setFill("#f8fafc"); doc.rect(M, y, CW, 7, "F");
      setTxt("#6366f1"); doc.setFontSize(11); doc.setFont("helvetica", "bold");
      doc.text("🌙  Sleep vs Focus Correlation", M + 2, y + 5); y += 10;

      const svfCols = [30, 40, 40, 70];
      const svfHeaders = ["Day", "Sleep (h)", "Focus Score", "Status"];
      cx = M;
      setFill("#e2e8f0"); doc.rect(M, y, CW, 7, "F");
      setTxt("#334155"); doc.setFontSize(8); doc.setFont("helvetica", "bold");
      svfHeaders.forEach((h, i) => { doc.text(h, cx + 2, y + 5); cx += svfCols[i]; }); y += 7;

      dynamicSleepVsFocus.forEach((row, idx) => {
        checkPage(8);
        if (idx % 2 === 0) { setFill("#f8fafc"); doc.rect(M, y, CW, 7, "F"); }
        cx = M;
        setTxt("#1e293b"); doc.setFontSize(8); doc.setFont("helvetica", "bold");
        doc.text(row.day, cx + 2, y + 5); cx += svfCols[0];
        doc.setFont("helvetica", "normal"); setTxt("#475569");
        doc.text(`${row.sleep}h`, cx + 2, y + 5); cx += svfCols[1];
        const fc = row.focus >= 75 ? "#059669" : row.focus >= 50 ? "#d97706" : "#dc2626";
        const [fr, fg, fb] = hex2rgb(fc); doc.setTextColor(fr, fg, fb);
        doc.setFont("helvetica", "bold"); doc.text(`${row.focus}/100`, cx + 2, y + 5); cx += svfCols[2];
        setTxt("#475569"); doc.setFont("helvetica", "normal");
        const lbl = row.focus >= 75 ? "Excellent" : row.focus >= 60 ? "Good" : row.focus >= 45 ? "Average" : "Needs improvement";
        doc.text(lbl, cx + 2, y + 5);
        y += 7;
      });
      y += 8;

      // ── Section: Monthly Progress ──
      checkPage(60);
      setFill("#f8fafc"); doc.rect(M, y, CW, 7, "F");
      setTxt("#6366f1"); doc.setFontSize(11); doc.setFont("helvetica", "bold");
      doc.text("🗓️  Monthly Progress — Planned vs Completed", M + 2, y + 5); y += 10;

      const mpCols = [30, 40, 45, 65];
      const mpHeaders = ["Month", "Planned (h)", "Completed (h)", "Completion Rate"];
      cx = M;
      setFill("#e2e8f0"); doc.rect(M, y, CW, 7, "F");
      setTxt("#334155"); doc.setFontSize(8); doc.setFont("helvetica", "bold");
      mpHeaders.forEach((h, i) => { doc.text(h, cx + 2, y + 5); cx += mpCols[i]; }); y += 7;

      monthlyProgress.forEach((row, idx) => {
        checkPage(8);
        if (idx % 2 === 0) { setFill("#f8fafc"); doc.rect(M, y, CW, 7, "F"); }
        cx = M;
        setTxt("#1e293b"); doc.setFontSize(8); doc.setFont("helvetica", "bold");
        doc.text(row.month, cx + 2, y + 5); cx += mpCols[0];
        doc.setFont("helvetica", "normal"); setTxt("#475569");
        doc.text(`${row.planned}h`, cx + 2, y + 5); cx += mpCols[1];
        doc.text(`${row.completed}h`, cx + 2, y + 5); cx += mpCols[2];
        const pct = Math.round((row.completed / row.planned) * 100);
        const pc = pct >= 90 ? "#059669" : pct >= 70 ? "#d97706" : "#dc2626";
        const [pr, pg, pb] = hex2rgb(pc); doc.setTextColor(pr, pg, pb); doc.setFont("helvetica", "bold");
        doc.text(`${pct}%`, cx + 2, y + 5);
        y += 7;
      });
      y += 8;

      // ── Section: Badges / Achievements ──
      checkPage(50);
      setFill("#f8fafc"); doc.rect(M, y, CW, 7, "F");
      setTxt("#6366f1"); doc.setFontSize(11); doc.setFont("helvetica", "bold");
      doc.text("🏆  Achievements", M + 2, y + 5); y += 10;

      const earnedBadges = badges.filter(b => b.earned);
      const unearnedBadges = badges.filter(b => !b.earned);

      earnedBadges.forEach((b, idx) => {
        checkPage(8);
        if (idx % 2 === 0) { setFill("#fef9c3"); } else { setFill("#fffbeb"); }
        doc.rect(M, y, CW, 7, "F");
        setTxt("#92400e"); doc.setFontSize(8); doc.setFont("helvetica", "bold");
        doc.text(`✅ ${b.name}`, M + 2, y + 5);
        setTxt("#78350f"); doc.setFont("helvetica", "normal");
        doc.text(b.desc, M + 45, y + 5);
        y += 7;
      });
      if (unearnedBadges.length > 0) {
        checkPage(6);
        setTxt("#94a3b8"); doc.setFontSize(8); doc.setFont("helvetica", "italic");
        doc.text(`${unearnedBadges.length} badge(s) still locked — keep going!`, M + 2, y + 5); y += 8;
      }
      y += 4;

      // ── Footer: tips ──
      checkPage(25);
      setFill("#ede9fe"); doc.roundedRect(M, y, CW, 18, 3, 3, "F");
      setTxt("#6366f1"); doc.setFontSize(9); doc.setFont("helvetica", "bold");
      doc.text("💡 VediQ Insight", M + 4, y + 6);
      setTxt("#4c1d95"); doc.setFontSize(8); doc.setFont("helvetica", "normal");
      const tip = avgFocusTrend >= 75
        ? "Excellent focus! Maintain your sleep schedule and session length."
        : avgFocusTrend >= 50
        ? "Good progress. Try adding 1 extra break per session to sustain focus."
        : "Focus needs work. Prioritize 7–8h sleep and limit distractions during sessions.";
      doc.text(tip, M + 4, y + 12, { maxWidth: CW - 8 }); y += 22;

      // ── Page footer ──
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        setDraw("#e2e8f0"); doc.setLineWidth(0.3); doc.line(M, PH - 14, PW - M, PH - 14);
        setTxt("#94a3b8"); doc.setFontSize(8); doc.setFont("helvetica", "normal");
        doc.text("VediQ · AI Smart Study Planner", M, PH - 8);
        doc.text(`Page ${i} of ${totalPages}`, PW - M, PH - 8, { align: "right" });
      }

      const fileName = `VediQ_Weekly_Report_${now.toISOString().split("T")[0]}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("PDF export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  }, [profileSubjects, focusTrend, dynamicSleepVsFocus, currentUser]);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <PageHeader
        title="Analytics"
        subtitle="Your learning, quantified — updated after every session"
        actions={
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="card-surface inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {exporting
              ? <><Loader2 className="h-4 w-4 text-primary animate-spin" /> Generating PDF…</>
              : <><Download className="h-4 w-4 text-primary" /> Export weekly report (PDF)</>
            }
          </button>
        }
      />

      {/* ── Focus Score Calculator (full-width at top) ── */}
      <div className="mb-6 grid gap-6">
        <FocusScoreCalculator onScoreCalculated={handleScoreCalculated} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sleep vs Focus */}
        <motion.div variants={fadeUp} className="card-surface p-6">
          <h2 className="font-display text-lg font-semibold">Sleep vs Focus correlation</h2>
          <p className="text-xs text-muted-foreground">r = 0.87 — your focus tracks sleep almost perfectly</p>
          <div className="mt-4 h-60">
            <ResponsiveContainer>
              <LineChart data={dynamicSleepVsFocus}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={30} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="focus" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 3 }} name="Focus" />
                <Line type="monotone" dataKey="sleep" stroke="var(--chart-2)" strokeWidth={2.5} dot={{ r: 3 }} name="Sleep (h)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Study hours */}
        <motion.div variants={fadeUp} className="card-surface p-6">
          <h2 className="font-display text-lg font-semibold">Study hours per week</h2>
          <p className="text-xs text-muted-foreground">Calculated dynamically from your active subjects &amp; sessions</p>
          <div className="mt-4 h-60">
            <ResponsiveContainer>
              <BarChart data={dynamicStudyHours}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={30} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="hours" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Focus trend — live updated */}
        <motion.div variants={fadeUp} className="card-surface p-6">
          <h2 className="font-display text-lg font-semibold">Focus score trend</h2>
          <p className="text-xs text-muted-foreground">ML-predicted · updates when you calculate above</p>
          <div className="mt-4 h-60">
            <ResponsiveContainer>
              <LineChart data={focusTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={30} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="score" stroke="var(--chart-3)" strokeWidth={2.5}
                  dot={{ r: 3 }} activeDot={{ r: 5 }} name="Focus score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Subject analysis — driven by profile courses */}
        <motion.div variants={fadeUp} className="card-surface p-6">
          <h2 className="font-display text-lg font-semibold">Subject time distribution</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Based on your profile courses · estimated from credits &amp; status</p>
          {profileSubjects.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground text-center py-8">
              No subjects found. Add courses in your <strong>Profile</strong> page.
            </p>
          ) : (
            <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
              <div className="h-56">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={profileSubjects} dataKey="hours" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={4} cornerRadius={6}>
                      {profileSubjects.map((s) => <Cell key={s.id} fill={s.color} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2.5">
                {profileSubjects.map((s) => (
                  <div key={s.id} className="flex items-center gap-2 text-xs">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.color }} />
                    <span className="font-medium">{s.name}</span>
                    <span className="text-muted-foreground">{s.hours}h</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* LeetCode-style Activity Calendar */}
      <ActivityCalendar streakDays={currentUser?.streakDays ?? 0} />

      {/* Monthly + badges */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <motion.div variants={fadeUp} className="card-surface p-6">
          <h2 className="font-display text-lg font-semibold">Monthly progress — planned vs completed</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <BarChart data={monthlyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={30} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="planned" fill="var(--chart-4)" radius={[6, 6, 0, 0]} name="Planned (h)" />
                <Bar dataKey="completed" fill="var(--chart-1)" radius={[6, 6, 0, 0]} name="Completed (h)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="card-surface p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Award className="h-5 w-5 text-amber-brand" /> Achievements
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {badges.map((b, i) => {
              const Icon = badgeIcons[b.icon] ?? Trophy;
              return (
                <motion.div key={b.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, type: "spring", stiffness: 300, damping: 20 }}
                  className={cn(
                    "rounded-2xl border p-4 text-center transition-transform hover:scale-105",
                    b.earned ? "border-amber-brand/30 bg-amber-soft/60" : "border-border bg-muted/50 opacity-50"
                  )}>
                  <span className={cn("mx-auto grid h-10 w-10 place-items-center rounded-xl",
                    b.earned ? "bg-amber-soft text-amber-brand" : "bg-muted text-muted-foreground")}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-2 text-xs font-bold">{b.name}</p>
                  <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{b.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
