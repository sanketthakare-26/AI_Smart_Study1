var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _reactrouter from "@tanstack/react-router";
import * as _framermotion from "framer-motion";
import * as _lucidereact from "lucide-react";
import * as _recharts from "recharts";
import * as _kit from "@/components/kit";
import * as _mockdata from "@/lib/mock-data";
import * as _utils from "@/lib/utils";
import { useCurrentUser, getGreeting, getTodayLabel } from "@/hooks/use-current-user";

const Route = _reactrouter.createFileRoute("/app/")({
      head: () => ({ meta: [{ title: "Dashboard \u2014 NeuroWake" }] }),
      component: Dashboard
    });
    
    function Dashboard() {
      const user = useCurrentUser();
      const [alarms] = _react.useState(() => {
        if (typeof window !== "undefined") {
          try {
            const raw = localStorage.getItem("neurowake_alarms_v2");
            if (raw) return JSON.parse(raw);
          } catch (_) {}
        }
        return _mockdata.alarms;
      });
      const nextAlarm = alarms.find((a) => a.enabled) || alarms[0] || _mockdata.alarms[0];

      const dynamicSleepVsFocus = _react.useMemo(() => {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const dayMap = {
          "Mon": "Monday", "Tue": "Tuesday", "Wed": "Wednesday", "Thu": "Thursday",
          "Fri": "Friday", "Sat": "Saturday", "Sun": "Sunday"
        };
        return days.map(day => {
          const fullDay = dayMap[day];
          const alarmForDay = alarms.find(a => a.enabled && a.days && a.days.includes(fullDay));
          const sleep = alarmForDay ? (alarmForDay.sleepHours ?? 7.0) : 7.0;
          
          // Focus score formula dynamically correlated with sleep hours
          const baseline = 30;
          const sleepContribution = Math.min(10.0, sleep) * 6.5;
          const randomFactor = (Math.sin(day.charCodeAt(0)) * 5); // deterministic variation
          const focus = Math.round(Math.max(10, Math.min(100, baseline + sleepContribution + randomFactor)));
          return { day, sleep, focus };
        });
      }, [alarms]);

      const [subjectList, setSubjectList] = _react.useState(() => {
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

      _react.useEffect(() => {
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

      const getDaysUntil = _react.useCallback((dateStr) => {
        if (!dateStr) return null;
        const exam = new Date(dateStr);
        const today = new Date("2026-07-11");
        exam.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        const diffTime = exam - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }, []);

      const getTodayWeekday = _react.useCallback(() => {
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
      }, []);

      const todayWeekday = getTodayWeekday();

      const dynamicTodayPlan = _react.useMemo(() => {
        if (!subjectList || subjectList.length === 0) return [];
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
            title: `${subject.name} \u2014 ${subject.nextTopic || type}`,
            duration: i % 2 === 0 ? "50 min" : "30 min",
            type: i % 3 === 0 ? "Deep focus" : i % 3 === 1 ? "Practice" : "Spaced repetition",
            color: subject.color
          });
        }
        return blocks;
      }, [subjectList, todayWeekday, getDaysUntil]);

      const [completedTasks, setCompletedTasks] = _react.useState(() => {
        if (typeof window !== "undefined") {
          try {
            const raw = localStorage.getItem("nw_completed_tasks");
            if (raw) return JSON.parse(raw);
          } catch (_) {}
        }
        return {};
      });

      const toggleTask = _react.useCallback((taskId) => {
        setCompletedTasks((prev) => {
          const updated = {
            ...prev,
            [taskId]: !prev[taskId],
          };
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("nw_completed_tasks", JSON.stringify(updated));
            } catch (_) {}
          }
          return updated;
        });
      }, []);

      const doneCount = dynamicTodayPlan.filter((t) => completedTasks[t.id]).length;

      // Reactively count study streak when plan is fully completed
      _react.useEffect(() => {
        if (dynamicTodayPlan.length === 0) return;
        try {
          const rawUser = localStorage.getItem("nw_user");
          const userData = rawUser ? JSON.parse(rawUser) : { streakDays: 0 };
          const todayStr = new Date().toISOString().split("T")[0];

          if (doneCount === dynamicTodayPlan.length) {
            // Plan completed! Increment streak if not already logged today
            if (userData.lastCompletedDate !== todayStr) {
              userData.streakDays = (userData.streakDays || 0) + 1;
              userData.lastCompletedDate = todayStr;
              localStorage.setItem("nw_user", JSON.stringify(userData));
              window.dispatchEvent(new StorageEvent("storage", { key: "nw_user" }));

              // Also add todayStr to the completion log (for the LeetCode calendar)
              try {
                const rawLog = localStorage.getItem("nw_completion_log");
                const log = rawLog ? JSON.parse(rawLog) : [];
                if (!log.includes(todayStr)) {
                  log.push(todayStr);
                  localStorage.setItem("nw_completion_log", JSON.stringify(log));
                }
              } catch (_) {}
            }
          } else {
            // Plan not complete. If it was marked complete today, revert the streak
            if (userData.lastCompletedDate === todayStr) {
              userData.streakDays = Math.max(0, (userData.streakDays || 1) - 1);
              userData.lastCompletedDate = "";
              localStorage.setItem("nw_user", JSON.stringify(userData));
              window.dispatchEvent(new StorageEvent("storage", { key: "nw_user" }));

              // Remove today from the completion log
              try {
                const rawLog = localStorage.getItem("nw_completion_log");
                const log = rawLog ? JSON.parse(rawLog) : [];
                localStorage.setItem("nw_completion_log", JSON.stringify(log.filter(d => d !== todayStr)));
              } catch (_) {}
            }
          }
        } catch (e) {
          console.warn("Error updating streak:", e);
        }
      }, [doneCount, dynamicTodayPlan.length]);

      const [greeting, setGreeting] = _react.useState(getGreeting());
      const [todayLabel, setTodayLabel] = _react.useState(getTodayLabel());
      _react.useEffect(() => {
        const id = setInterval(() => {
          setGreeting(getGreeting());
          setTodayLabel(getTodayLabel());
        }, 60000);
        return () => clearInterval(id);
      }, []);

      const greetEmoji = greeting === "Good morning" ? "\u2600\uFE0F" : greeting === "Good afternoon" ? "\uD83C\uDF24\uFE0F" : "\uD83C\uDF19";
      const firstName = user.name ? user.name.split(" ")[0] : "Student";

      return _jsxdevruntime.jsxDEV(_framermotion.motion.div, { variants: _kit.staggerContainer, initial: "hidden", animate: "visible", children: [
        _jsxdevruntime.jsxDEV.call(
          void 0,
          _kit.PageHeader,
          {
            title: `${greeting}, ${firstName} ${greetEmoji}`,
            subtitle: `${todayLabel} \xB7 Your predicted peak focus window is 06:45\u201308:15.`,
            actions: _jsxdevruntime.jsxDEV(_reactrouter.Link, { to: "/app/planner", className: "btn-gradient inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold", children: [
              _jsxdevruntime.jsxDEV(_lucidereact.Sparkles, { className: "h-4 w-4" }, void 0, false),
              " Generate today's plan"
            ] }, void 0, true)
          },
          void 0,
          false,
          this
        ),
        _jsxdevruntime.jsxDEV("div", { className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4", children: [
          _jsxdevruntime.jsxDEV(_kit.StatCard, { icon: _jsxdevruntime.jsxDEV(_lucidereact.Flame, { className: "h-5 w-5" }, void 0, false), label: "Study streak", value: `${user.streakDays ?? 0} days`, sub: "3 days to next badge", tone: "amber" }, void 0, false),
          _jsxdevruntime.jsxDEV(_kit.StatCard, { icon: _jsxdevruntime.jsxDEV(_lucidereact.Zap, { className: "h-5 w-5" }, void 0, false), label: "Focus score", value: `${user.focusScore ?? 0}/100`, sub: "+6 vs last week", tone: "primary" }, void 0, false),
          _jsxdevruntime.jsxDEV(_kit.StatCard, { icon: _jsxdevruntime.jsxDEV(_lucidereact.Moon, { className: "h-5 w-5" }, void 0, false), label: "Sleep score", value: `${user.sleepScore ?? 0}/100`, sub: "7h 24m last night", tone: "teal" }, void 0, false),
          _jsxdevruntime.jsxDEV(_kit.StatCard, { icon: _jsxdevruntime.jsxDEV(_lucidereact.Timer, { className: "h-5 w-5" }, void 0, false), label: "Plan progress", value: `${doneCount}/${dynamicTodayPlan.length} tasks`, sub: "On track for today", tone: "emerald" }, void 0, false)
        ] }, void 0, true),
        _jsxdevruntime.jsxDEV("div", { className: "mt-6 grid gap-6 xl:grid-cols-3", children: [
          /* Today's plan */
          _jsxdevruntime.jsxDEV(_framermotion.motion.div, { variants: _kit.fadeUp, className: "card-surface p-6 xl:col-span-2", children: [
            _jsxdevruntime.jsxDEV("div", { className: "flex items-center justify-between", children: [
              _jsxdevruntime.jsxDEV("h2", { className: "font-display text-lg font-semibold", children: `Today's study plan (${todayWeekday})` }, void 0, false),
              _jsxdevruntime.jsxDEV(_reactrouter.Link, { to: "/app/planner", className: "flex items-center gap-1 text-sm font-medium text-primary hover:underline", children: [
                "Full planner ",
                _jsxdevruntime.jsxDEV(_lucidereact.ArrowRight, { className: "h-3.5 w-3.5" }, void 0, false)
              ] }, void 0, true)
            ] }, void 0, true),
            subjectList.length === 0
              ? _jsxdevruntime.jsxDEV("div", { className: "mt-8 flex flex-col items-center justify-center text-center gap-3 py-8", children: [
                  _jsxdevruntime.jsxDEV(_lucidereact.BookOpen, { className: "h-12 w-12 text-muted-foreground/30" }, void 0, false),
                  _jsxdevruntime.jsxDEV("p", { className: "font-semibold text-sm text-foreground", children: "No study plan yet" }, void 0, false),
                  _jsxdevruntime.jsxDEV("p", { className: "text-xs text-muted-foreground max-w-xs", children: "Set up your subjects in your profile and your personalized study plan will appear here." }, void 0, false),
                  _jsxdevruntime.jsxDEV(_reactrouter.Link, { to: "/app/profile", className: "mt-2 btn-gradient rounded-xl px-4 py-2 text-xs font-bold", children: "Set up Profile →" }, void 0, false)
                ] }, void 0, true)
              : _jsxdevruntime.jsxDEV("div", {
                className: "mt-4 space-y-2",
                children: dynamicTodayPlan.map((t, i) => {
                  const isDone = !!completedTasks[t.id];
                  return _jsxdevruntime.jsxDEV(_framermotion.motion.div, {
                    initial: { opacity: 0, x: -16 },
                    animate: { opacity: 1, x: 0 },
                    transition: { delay: 0.2 + i * 0.07 },
                    onClick: () => toggleTask(t.id),
                    className: _utils.cn.call(
                      void 0,
                      "flex items-center gap-4 rounded-xl border border-border px-4 py-3 transition-colors hover:bg-muted/60 cursor-pointer border-l-4",
                      isDone && "opacity-60"
                    ),
                    style: { borderLeftColor: t.color },
                    children: [
                      isDone ? _jsxdevruntime.jsxDEV(_lucidereact.CheckCircle2, { className: "h-5 w-5 shrink-0 text-emerald-brand" }, void 0, false) : _jsxdevruntime.jsxDEV(_lucidereact.Circle, { className: "h-5 w-5 shrink-0 text-muted-foreground/50" }, void 0, false),
                      _jsxdevruntime.jsxDEV("span", { className: "w-12 shrink-0 font-display text-sm font-semibold text-primary", children: t.time }, void 0, false),
                      _jsxdevruntime.jsxDEV("div", { className: "min-w-0 flex-1", children: [
                        _jsxdevruntime.jsxDEV("p", { className: _utils.cn("truncate text-sm font-medium", isDone && "line-through"), children: t.title }, void 0, false),
                        _jsxdevruntime.jsxDEV("p", { className: "text-xs text-muted-foreground", children: [t.type, " · ", t.duration] }, void 0, true)
                      ] }, void 0, true)
                    ]
                  }, t.id, true);
                })
              }, void 0, false)
          ] }, void 0, true),
          _jsxdevruntime.jsxDEV("div", { className: "space-y-6", children: [
            /* Next alarm */
            _jsxdevruntime.jsxDEV(_framermotion.motion.div, { variants: _kit.fadeUp, className: "card-surface card-hover p-6", children: [
              _jsxdevruntime.jsxDEV("div", { className: "flex items-center justify-between", children: [
                _jsxdevruntime.jsxDEV("h2", { className: "font-display text-lg font-semibold", children: "Next alarm" }, void 0, false),
                _jsxdevruntime.jsxDEV(_reactrouter.Link, { to: "/app/alarms", className: "text-sm font-medium text-primary hover:underline", children: "Manage" }, void 0, false)
              ] }, void 0, true),
              _jsxdevruntime.jsxDEV("div", { className: "mt-4 flex items-center gap-4", children: [
                _jsxdevruntime.jsxDEV("span", { className: "relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary", children: [
                  _jsxdevruntime.jsxDEV(_lucidereact.AlarmClock, { className: "h-6 w-6" }, void 0, false),
                  _jsxdevruntime.jsxDEV("span", { className: "pulse-wave absolute inset-0 rounded-2xl border-2 border-primary/40" }, void 0, false)
                ] }, void 0, true),
                _jsxdevruntime.jsxDEV("div", { className: "min-w-0", children: [
                  _jsxdevruntime.jsxDEV("p", { className: "font-display text-3xl font-bold", children: nextAlarm.time }, void 0, false),
                  _jsxdevruntime.jsxDEV("p", { className: "truncate text-sm text-muted-foreground", children: nextAlarm.label }, void 0, false)
                ] }, void 0, true)
              ] }, void 0, true),
              _jsxdevruntime.jsxDEV("div", { className: "mt-4 space-y-2 text-xs", children: [
                _jsxdevruntime.jsxDEV("div", { className: "flex justify-between rounded-lg bg-muted px-3 py-2", children: [
                  _jsxdevruntime.jsxDEV("span", { className: "text-muted-foreground", children: "Optimal window" }, void 0, false),
                  _jsxdevruntime.jsxDEV("span", { className: "font-semibold", children: nextAlarm.wakeWindow }, void 0, false)
                ] }, void 0, true),
                _jsxdevruntime.jsxDEV("div", { className: "flex justify-between rounded-lg bg-emerald-soft px-3 py-2", children: [
                  _jsxdevruntime.jsxDEV("span", { className: "text-muted-foreground", children: "Snooze risk" }, void 0, false),
                  _jsxdevruntime.jsxDEV("span", { className: "font-semibold text-emerald-brand", children: [nextAlarm.snoozeRisk, "% \u2014 low"] }, void 0, true)
                ] }, void 0, true)
              ] }, void 0, true)
            ] }, void 0, true),
            _jsxdevruntime.jsxDEV(_framermotion.motion.div, { variants: _kit.fadeUp, className: "card-surface flex items-center gap-5 p-6", children: [
              _jsxdevruntime.jsxDEV(_kit.ProgressRing, { value: user.focusScore ?? 0, size: 110, label: "Focus" }, void 0, false),
              _jsxdevruntime.jsxDEV("div", { className: "min-w-0", children: [
                _jsxdevruntime.jsxDEV("h3", { className: "font-display font-semibold", children: "Focus score" }, void 0, false),
                _jsxdevruntime.jsxDEV("p", {
                  className: "mt-1 text-xs leading-relaxed text-muted-foreground",
                  children: "Predicted from sleep quality, session history, and time of day by your personal ML model."
                }, void 0, false)
              ] }, void 0, true)
            ] }, void 0, true)
          ] }, void 0, true)
        ] }, void 0, true),
        _jsxdevruntime.jsxDEV(_framermotion.motion.div, { variants: _kit.fadeUp, className: "card-surface mt-6 p-6", children: [
          _jsxdevruntime.jsxDEV("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
            _jsxdevruntime.jsxDEV("h2", { className: "font-display text-lg font-semibold", children: "Sleep vs focus \u2014 this week" }, void 0, false),
            _jsxdevruntime.jsxDEV(_reactrouter.Link, { to: "/app/analytics", className: "flex items-center gap-1 text-sm font-medium text-primary hover:underline", children: [
              "All analytics ",
              _jsxdevruntime.jsxDEV(_lucidereact.ArrowRight, { className: "h-3.5 w-3.5" }, void 0, false)
            ] }, void 0, true)
          ] }, void 0, true),
          _jsxdevruntime.jsxDEV("div", {
            className: "mt-4 h-64",
            children: _jsxdevruntime.jsxDEV(_recharts.ResponsiveContainer, {
              width: "100%",
              height: "100%",
              children: _jsxdevruntime.jsxDEV(_recharts.AreaChart, { data: dynamicSleepVsFocus, children: [
                _jsxdevruntime.jsxDEV("defs", { children: [
                  _jsxdevruntime.jsxDEV("linearGradient", { id: "focusGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                    _jsxdevruntime.jsxDEV("stop", { offset: "0%", stopColor: "var(--chart-1)", stopOpacity: 0.25 }, void 0, false),
                    _jsxdevruntime.jsxDEV("stop", { offset: "100%", stopColor: "var(--chart-1)", stopOpacity: 0 }, void 0, false)
                  ] }, void 0, true),
                  _jsxdevruntime.jsxDEV("linearGradient", { id: "sleepGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                    _jsxdevruntime.jsxDEV("stop", { offset: "0%", stopColor: "var(--chart-2)", stopOpacity: 0.25 }, void 0, false),
                    _jsxdevruntime.jsxDEV("stop", { offset: "100%", stopColor: "var(--chart-2)", stopOpacity: 0 }, void 0, false)
                  ] }, void 0, true)
                ] }, void 0, true),
                _jsxdevruntime.jsxDEV(_recharts.XAxis, { dataKey: "day", axisLine: false, tickLine: false, tick: { fontSize: 12 } }, void 0, false),
                _jsxdevruntime.jsxDEV(_recharts.YAxis, { axisLine: false, tickLine: false, tick: { fontSize: 12 }, width: 30 }, void 0, false),
                _jsxdevruntime.jsxDEV(_recharts.Tooltip, { contentStyle: { borderRadius: 12, border: "1px solid var(--border)", boxShadow: "var(--shadow-card)" } }, void 0, false),
                _jsxdevruntime.jsxDEV(_recharts.Area, { type: "monotone", dataKey: "focus", stroke: "var(--chart-1)", strokeWidth: 2.5, fill: "url(#focusGrad)", name: "Focus score" }, void 0, false),
                _jsxdevruntime.jsxDEV(_recharts.Area, { type: "monotone", dataKey: "sleep", stroke: "var(--chart-2)", strokeWidth: 2.5, fill: "url(#sleepGrad)", name: "Sleep (h)" }, void 0, false)
              ] }, void 0, true)
            }, void 0, false)
          }, void 0, false)
        ] }, void 0, true)
      ] }, void 0, true);
    }

export { Route };
