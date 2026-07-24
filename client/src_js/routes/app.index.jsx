import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AlarmClock, ArrowRight, CheckCircle2, Circle, Flame, Moon, Sparkles, Timer, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fadeUp, PageHeader, ProgressRing, staggerContainer, StatCard } from "@/components/kit";
import { alarms, sleepVsFocus, todayPlan } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useCurrentUser, getGreeting, getTodayLabel } from "@/hooks/use-current-user";

export const Route = createFileRoute("/app/")({
    head: () => ({ meta: [{ title: "Dashboard — VediQ" }] }),
    component: Dashboard,
});

function Dashboard() {
    const user = useCurrentUser();
    const nextAlarm = alarms.find((a) => a.enabled);

    // Load subjects from localStorage & sync with profile
    const [subjectList, setSubjectList] = useState(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("nw_subjects");
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
                } catch (_) {}
            }
            const storedProfile = localStorage.getItem("nw_profile_full");
            if (storedProfile) {
                try {
                    const profile = JSON.parse(storedProfile);
                    if (Array.isArray(profile.courses) && profile.courses.length > 0) {
                        return profile.courses.map((c, idx) => ({
                            id: c.id || `ps_${idx}`,
                            name: c.name,
                            color: c.color || "var(--chart-1)",
                            hours: Number(c.hours) || 10,
                            mastery: Number(c.mastery) ?? 50,
                            status: c.status || "preparation",
                        }));
                    }
                } catch (_) {}
            }
        }
        return [];
    });

    useEffect(() => {
        const updateSubjects = () => {
            if (typeof window === "undefined") return;
            try {
                const stored = localStorage.getItem("nw_subjects");
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        setSubjectList(parsed);
                        return;
                    }
                }
                const storedProfile = localStorage.getItem("nw_profile_full");
                if (storedProfile) {
                    const profile = JSON.parse(storedProfile);
                    if (Array.isArray(profile.courses) && profile.courses.length > 0) {
                        const synced = profile.courses.map((c, idx) => ({
                            id: c.id || `ps_${idx}`,
                            name: c.name,
                            color: c.color || "var(--chart-1)",
                            hours: Number(c.hours) || 10,
                            mastery: Number(c.mastery) ?? 50,
                            status: c.status || "preparation",
                        }));
                        setSubjectList(synced);
                    }
                }
            } catch (_) {}
        };

        const onStorage = (e) => {
            if (!e.key || e.key === "nw_subjects" || e.key === "nw_profile_full") {
                updateSubjects();
            }
        };

        window.addEventListener("storage", onStorage);
        window.addEventListener("nw_subjects_updated", updateSubjects);
        window.addEventListener("focus", updateSubjects);
        return () => {
            window.removeEventListener("storage", onStorage);
            window.removeEventListener("nw_subjects_updated", updateSubjects);
            window.removeEventListener("focus", updateSubjects);
        };
    }, []);

    const getDaysUntil = (dateStr) => {
        if (!dateStr) return null;
        const exam = new Date(dateStr);
        const today = new Date("2026-07-11"); // Same base reference date
        exam.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        const diffTime = exam - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getTodayWeekday = () => {
        const daysMap = {
            1: "Mon 7",
            2: "Tue 8",
            3: "Wed 9",
            4: "Thu 10",
            5: "Fri 11",
            6: "Sat 12",
            0: "Sun 13"
        };
        const dayOfWeek = new Date().getDay();
        return daysMap[dayOfWeek] || "Sat 12";
    };

    const todayWeekday = getTodayWeekday();

    // Re-use the exact same calendar generation algorithm
    const dynamicTodayPlan = useMemo(() => {
        if (!subjectList || subjectList.length === 0) return [];
        
        // Sort: closest exam first, then lower mastery
        const sorted = [...subjectList].sort((a, b) => {
            const daysA = getDaysUntil(a.examDate);
            const daysB = getDaysUntil(b.examDate);
            const hasA = daysA !== null && daysA >= 0;
            const hasB = daysB !== null && daysB >= 0;
            if (hasA && !hasB) return -1;
            if (!hasA && hasB) return 1;
            if (hasA && hasB) return daysA - daysB;
            return a.mastery - b.mastery;
        });

        const times = ["06:45", "14:30", "17:00", "20:15"];
        const sessionTypes = ["focus", "revision", "drills", "flashcards", "practice", "mock test"];
        
        const weekDaysList = ["Mon 7", "Tue 8", "Wed 9", "Thu 10", "Fri 11", "Sat 12", "Sun 13"];
        const dayIndex = weekDaysList.indexOf(todayWeekday);
        
        const blocks = [];
        const numSessions = (dayIndex % 2 === 0) ? 2 : 3;
        for (let i = 0; i < numSessions; i++) {
            const subject = sorted[(dayIndex * 2 + i) % sorted.length];
            if (!subject) continue;
            const type = sessionTypes[(dayIndex + i) % sessionTypes.length];
            blocks.push({
                id: `t_dash_${i}`,
                time: times[i % times.length],
                title: `${subject.name} — ${subject.nextTopic || type}`,
                duration: i % 2 === 0 ? "50 min" : "30 min",
                type: i % 3 === 0 ? "Deep focus" : i % 3 === 1 ? "Practice" : "Spaced repetition",
                color: subject.color
            });
        }
        return blocks;
    }, [subjectList, todayWeekday]);

    // Local checked off state
    const [completedTasks, setCompletedTasks] = useState({});
    const toggleTask = (taskId) => {
        setCompletedTasks(prev => ({
            ...prev,
            [taskId]: !prev[taskId]
        }));
    };

    const doneCount = dynamicTodayPlan.filter(t => completedTasks[t.id]).length;

    // Reactive greeting that updates live
    const [greeting, setGreeting] = useState(getGreeting());
    const [todayLabel, setTodayLabel] = useState(getTodayLabel());
    useEffect(() => {
        const id = setInterval(() => {
            setGreeting(getGreeting());
            setTodayLabel(getTodayLabel());
        }, 60_000); // refresh every minute
        return () => clearInterval(id);
    }, []);

    // Emoji based on greeting
    const greetEmoji = greeting === "Good morning" ? "☀️" : greeting === "Good afternoon" ? "🌤️" : "🌙";

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <PageHeader
            title={`${greeting}, ${user.name.split(" ")[0]} ${greetEmoji}`}
            subtitle={`${todayLabel} · Your predicted peak focus window is 06:45–08:15.`}
            actions={
              <Link to="/app/planner" className="btn-gradient inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold">
                <Sparkles className="h-4 w-4"/> Generate today's plan
              </Link>
            }
          />

          {/* Stat row */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={<Flame className="h-5 w-5"/>} label="Study streak" value={`${user.streakDays ?? 0} days`} sub="3 days to next badge" tone="amber"/>
            <StatCard icon={<Zap className="h-5 w-5"/>} label="Focus score" value={`${user.focusScore ?? 0}/100`} sub="+6 vs last week" tone="primary"/>
            <StatCard icon={<Moon className="h-5 w-5"/>} label="Sleep score" value={`${user.sleepScore ?? 0}/100`} sub="7h 24m last night" tone="teal"/>
            <StatCard icon={<Timer className="h-5 w-5"/>} label="Plan progress" value={`${doneCount}/${dynamicTodayPlan.length} tasks`} sub="On track for today" tone="emerald"/>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            {/* Today's plan */}
            <motion.div variants={fadeUp} className="card-surface p-6 xl:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">Today's study plan ({todayWeekday})</h2>
                <Link to="/app/planner" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                  Full planner <ArrowRight className="h-3.5 w-3.5"/>
                </Link>
              </div>
              <div className="mt-4 space-y-2">
                {dynamicTodayPlan.map((t, i) => {
                  const isDone = !!completedTasks[t.id];
                  return (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.07 }}
                      onClick={() => toggleTask(t.id)}
                      className={cn("flex items-center gap-4 rounded-xl border border-border px-4 py-3 transition-colors hover:bg-muted/60 cursor-pointer border-l-4", isDone && "opacity-60")}
                      style={{ borderLeftColor: t.color }}
                    >
                      {isDone ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-brand"/> : <Circle className="h-5 w-5 shrink-0 text-muted-foreground/50"/>}
                      <span className="w-12 shrink-0 font-display text-sm font-semibold text-primary">{t.time}</span>
                      <div className="min-w-0 flex-1">
                        <p className={cn("truncate text-sm font-medium", isDone && "line-through")}>{t.title}</p>
                        <p className="text-xs text-muted-foreground">{t.type} · {t.duration}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Next alarm */}
              <motion.div variants={fadeUp} className="card-surface card-hover p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold">Next alarm</h2>
                  <Link to="/app/alarms" className="text-sm font-medium text-primary hover:underline">Manage</Link>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                    <AlarmClock className="h-6 w-6"/>
                    <span className="pulse-wave absolute inset-0 rounded-2xl border-2 border-primary/40"/>
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-3xl font-bold">{nextAlarm.time}</p>
                    <p className="truncate text-sm text-muted-foreground">{nextAlarm.label}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between rounded-lg bg-muted px-3 py-2">
                    <span className="text-muted-foreground">Optimal window</span>
                    <span className="font-semibold">{nextAlarm.wakeWindow}</span>
                  </div>
                  <div className="flex justify-between rounded-lg bg-emerald-soft px-3 py-2">
                    <span className="text-muted-foreground">Snooze risk</span>
                    <span className="font-semibold text-emerald-brand">{nextAlarm.snoozeRisk}% — low</span>
                  </div>
                </div>
              </motion.div>

              {/* Focus ring */}
              <motion.div variants={fadeUp} className="card-surface flex items-center gap-5 p-6">
                <ProgressRing value={user.focusScore ?? 0} size={110} label="Focus"/>
                <div className="min-w-0">
                  <h3 className="font-display font-semibold">Focus score</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Predicted from sleep quality, session history, and time of day by your personal ML model.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Sleep vs focus chart */}
          <motion.div variants={fadeUp} className="card-surface mt-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-lg font-semibold">Sleep vs focus — this week</h2>
              <Link to="/app/analytics" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                All analytics <ArrowRight className="h-3.5 w-3.5"/>
              </Link>
            </div>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sleepVsFocus}>
                  <defs>
                    <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.25}/>
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.25}/>
                      <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }}/>
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={30}/>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", boxShadow: "var(--shadow-card)" }}/>
                  <Area type="monotone" dataKey="focus" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#focusGrad)" name="Focus score"/>
                  <Area type="monotone" dataKey="sleep" stroke="var(--chart-2)" strokeWidth={2.5} fill="url(#sleepGrad)" name="Sleep (h)"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.div>
    );
}
