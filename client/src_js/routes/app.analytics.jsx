import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback, useMemo } from "react";
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
  monthlyProgress, studyHours, subjects,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { mlApi } from "@/api/client.js";
import { useCurrentUser } from "@/hooks/use-current-user";

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

const SUBJECT_TYPES = [
  { value: 0, label: "Science" },
  { value: 1, label: "Mathematics" },
  { value: 2, label: "Engineering" },
  { value: 3, label: "Literature" },
  { value: 4, label: "History" },
  { value: 5, label: "Arts" },
];

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
  const [studyDuration, setStudyDuration] = useState(60);
  const [breaksTaken, setBreaksTaken] = useState(2);
  const [subjectType, setSubjectType] = useState(1);
  const [timeOfDay, setTimeOfDay] = useState(1);
  const [selfRating, setSelfRating] = useState(7);
  const [sleepHours, setSleepHours] = useState(7);
  const [distractions, setDistractions] = useState(2);

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
      setError("ML service unavailable. Please make sure the server is running.");
    } finally {
      setLoading(false);
    }
  }, [studyDuration, breaksTaken, subjectType, timeOfDay, selfRating, sleepHours, distractions, onScoreCalculated]);

  return (
    <motion.div variants={fadeUp} className="card-surface p-6 lg:col-span-2">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Brain className="h-5 w-5 text-primary" />
          </span>
          <div>
            <h2 className="font-display text-lg font-semibold">ML Focus Score Calculator</h2>
            <p className="text-xs text-muted-foreground">
              Enter your session details · AI predicts your focus score
            </p>
          </div>
        </div>
        {result !== null && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-bold border",
              result >= 75 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600"
                : result >= 50 ? "bg-amber-500/10 border-amber-500/30 text-amber-600"
                : "bg-rose-500/10 border-rose-500/30 text-rose-600"
            )}>
            <Zap className="inline h-3.5 w-3.5 mr-1" />
            {scoreLabel(result)} · {result}/100
          </motion.div>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_180px]">
        {/* Inputs */}
        <div className="space-y-5">
          {/* Study duration */}
          <SliderInput
            label="Study duration" id="fs-duration"
            min={15} max={180} value={studyDuration}
            onChange={setStudyDuration} suffix=" min"
            hint="How many minutes did / will you study this session?"
          />

          {/* Sleep hours */}
          <SliderInput
            label="Sleep last night" id="fs-sleep"
            min={3} max={12} step={0.5} value={sleepHours}
            onChange={setSleepHours} suffix=" h"
            hint="Hours of sleep before this session"
          />

          {/* Breaks taken */}
          <SliderInput
            label="Breaks taken" id="fs-breaks"
            min={0} max={5} value={breaksTaken}
            onChange={setBreaksTaken}
            hint="Number of short breaks during this session"
          />

          {/* Distractions */}
          <SliderInput
            label="Distractions" id="fs-distractions"
            min={0} max={5} value={distractions}
            onChange={setDistractions}
            hint="0 = none, 5 = very distracted"
          />

          {/* Self rating */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Self-rated session quality</label>
              <span className="text-sm font-bold text-primary">{selfRating}/10</span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setSelfRating(n)}
                  className={cn(
                    "h-9 w-9 rounded-lg text-sm font-bold transition-all border",
                    selfRating === n
                      ? "btn-gradient border-transparent text-white shadow-lift"
                      : "bg-muted border-border text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Subject type + Time of day */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Subject type</label>
              <select
                value={subjectType}
                onChange={(e) => setSubjectType(Number(e.target.value))}
                className="w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                {SUBJECT_TYPES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Time of day</label>
              <select
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(Number(e.target.value))}
                className="w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                {TIME_OF_DAY.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-xs text-rose-500 bg-rose-500/10 rounded-lg px-3 py-2">
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* CTA */}
          <button
            id="calculate-focus-score"
            onClick={calculate}
            disabled={loading}
            className="btn-gradient w-full rounded-xl py-3 text-sm font-bold inline-flex items-center justify-center gap-2 shadow-lift hover:shadow-none transition-all disabled:opacity-70"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Calculating…</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Calculate My Focus Score</>
            )}
          </button>
        </div>

        {/* Result gauge */}
        <div className="flex flex-col items-center justify-center gap-3">
          <AnimatePresence mode="wait">
            {result !== null ? (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }} className="text-center">
                <ScoreGauge score={result} />
                <p id="focus-score-result" className={cn("text-2xl font-extrabold font-display mt-2", scoreColor(result))}>
                  {result}/100
                </p>
                <p className="text-xs text-muted-foreground mt-1">{scoreLabel(result)}</p>
              </motion.div>
            ) : (
              <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center space-y-2">
                <div className="mx-auto h-[140px] w-[140px] rounded-full border-[12px] border-muted flex items-center justify-center">
                  <Brain className="h-12 w-12 text-muted-foreground/30" />
                </div>
                <p className="text-xs text-muted-foreground">Fill in details &amp; hit Calculate</p>
              </motion.div>
            )}
          </AnimatePresence>

          {result !== null && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-[10px] text-center text-muted-foreground px-2">
              ✅ Score saved to your dashboard
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Activity Calendar (LeetCode style) ───────────────────────────────────────
const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_LABELS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function ActivityCalendar({ streakDays }) {
  // Load completed dates from localStorage
  const completedDates = useMemo(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const raw = localStorage.getItem("nw_completion_log");
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch (_) { return new Set(); }
  }, []);

  // Build 18-week grid (Sun–Sat columns)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const WEEKS = 18;
  const DAYS = WEEKS * 7;

  // Find the most recent Sunday
  const start = new Date(today);
  start.setDate(start.getDate() - start.getDay() - (WEEKS - 1) * 7);

  const weeks = [];
  const monthBreaks = [];
  for (let w = 0; w < WEEKS; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      const iso = date.toISOString().split("T")[0];
      const isCompleted = completedDates.has(iso);
      const isToday = iso === today.toISOString().split("T")[0];
      const isFuture = date > today;
      week.push({ iso, isCompleted, isToday, isFuture, date });
    }
    // Track month label position
    const firstDay = week[0].date;
    if (w === 0 || firstDay.getDate() <= 7) {
      monthBreaks.push({ week: w, label: MONTH_LABELS[firstDay.getMonth()] });
    }
    weeks.push(week);
  }

  const totalCompleted = completedDates.size;

  function cellColor(cell) {
    if (cell.isFuture) return "bg-muted/40 opacity-40";
    if (cell.isCompleted) return "bg-rose-500 hover:bg-rose-400";
    if (cell.isToday) return "bg-muted border-2 border-primary";
    return "bg-muted hover:bg-muted/80";
  }

  return (
    <motion.div variants={fadeUp} className="card-surface mt-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="font-display text-lg font-semibold flex items-center gap-2">
            <Flame className="h-5 w-5 fill-rose-500 text-rose-500" />
            Study Activity — last 18 weeks
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {totalCompleted} days completed · {streakDays} day current streak
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            {["bg-muted", "bg-rose-500/30", "bg-rose-500/60", "bg-rose-500"].map((c, i) => (
              <span key={i} className={cn("h-3 w-3 rounded-[3px]", c)} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="inline-flex flex-col gap-1" style={{ minWidth: WEEKS * 18 }}>
          {/* Month labels */}
          <div className="flex gap-[3px] pl-8 mb-1">
            {weeks.map((week, wi) => {
              const mb = monthBreaks.find(m => m.week === wi);
              return (
                <div key={wi} className="w-[15px] text-[9px] text-muted-foreground overflow-visible whitespace-nowrap">
                  {mb ? mb.label : ""}
                </div>
              );
            })}
          </div>
          {/* Day rows */}
          {[0,1,2,3,4,5,6].map((dayIdx) => (
            <div key={dayIdx} className="flex items-center gap-[3px]">
              <span className="w-7 text-[9px] text-muted-foreground text-right pr-1 shrink-0">
                {dayIdx % 2 === 1 ? DAY_LABELS[dayIdx] : ""}
              </span>
              {weeks.map((week, wi) => {
                const cell = week[dayIdx];
                return (
                  <motion.span
                    key={wi}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: (wi * 7 + dayIdx) * 0.005 }}
                    className={cn(
                      "h-[15px] w-[15px] rounded-[3px] cursor-default transition-all",
                      cellColor(cell)
                    )}
                    title={`${cell.iso}${cell.isCompleted ? " ✅ Plan completed" : cell.isToday ? " 📅 Today" : cell.isFuture ? " 🔮 Future" : " No activity"}`}
                  />
                );
              })}
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

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <PageHeader
        title="Analytics"
        subtitle="Your learning, quantified — updated after every session"
        actions={
          <button className="card-surface inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5">
            <Download className="h-4 w-4 text-primary" /> Export weekly report (PDF)
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
          <p className="text-xs text-muted-foreground">+86% since week 1</p>
          <div className="mt-4 h-60">
            <ResponsiveContainer>
              <BarChart data={studyHours}>
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

        {/* Subject analysis */}
        <motion.div variants={fadeUp} className="card-surface p-6">
          <h2 className="font-display text-lg font-semibold">Subject time distribution</h2>
          <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <div className="h-56">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={subjects} dataKey="hours" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={4} cornerRadius={6}>
                    {subjects.map((s) => <Cell key={s.id} fill={s.color} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2.5">
              {subjects.map((s) => (
                <div key={s.id} className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.color }} />
                  <span className="font-medium">{s.name}</span>
                  <span className="text-muted-foreground">{s.hours}h</span>
                </div>
              ))}
            </div>
          </div>
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
