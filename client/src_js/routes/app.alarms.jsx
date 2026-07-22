import { useState, useEffect, useRef, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, X, AlarmClock, Zap, BellRing, Puzzle, Trash2,
  Pencil, Volume2, Check, History, Play, Square, Upload,
  Music, ChevronRight, RefreshCw, Brain, ShieldAlert, QrCode, Camera, AlertCircle
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { mlApi } from "../api/client.js";

export const Route = createFileRoute("/app/alarms")({
  head: () => ({ meta: [{ title: "Smart Alarms — NeuroWake" }] }),
  component: AlarmsPage,
});

// ─────────────────────────────────────────────────────────────────────────────
// ── BUILT-IN RINGTONES — all generated with Web Audio API ───────────────────
// ─────────────────────────────────────────────────────────────────────────────
export const BUILTIN_TONES = [
  {
    id: "classic_beep",
    name: "Classic Beep",
    icon: "📣",
    description: "Triple-beep pattern",
  },
  {
    id: "gentle_rise",
    name: "Gentle Rise",
    icon: "🌅",
    description: "Soft sine, gradually louder",
  },
  {
    id: "digital_pulse",
    name: "Digital Pulse",
    icon: "⚡",
    description: "Fast electronic pulses",
  },
  {
    id: "zen_bell",
    name: "Zen Bell",
    icon: "🔔",
    description: "Calm bell chime",
  },
  {
    id: "school_bell",
    name: "School Bell",
    icon: "🎓",
    description: "Traditional ring",
  },
  {
    id: "rooster",
    name: "Rooster",
    icon: "🐓",
    description: "Rising morning call",
  },
];

function createTone(id, ctx, volScale = 1.0) {
  const now = ctx.currentTime;

  function beep(start, freq, duration, type = "square", gainVal = 0.4) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(gainVal * volScale, start + 0.01);
    gain.gain.linearRampToValueAtTime(0, start + duration);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  switch (id) {
    case "classic_beep": {
      // Triple square beeps
      for (let i = 0; i < 3; i++) beep(now + i * 0.28, 880 + i * 60, 0.18, "square");
      return 1.0;
    }
    case "gentle_rise": {
      // Sine that sweeps up
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(660, now + 0.9);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.4 * volScale, now + 0.2);
      gain.gain.linearRampToValueAtTime(0, now + 0.9);
      osc.start(now); osc.stop(now + 1.0);
      return 1.1;
    }
    case "digital_pulse": {
      // 6 rapid square pips
      for (let i = 0; i < 6; i++) beep(now + i * 0.12, 1046, 0.07, "square", 0.35);
      return 0.9;
    }
    case "zen_bell": {
      // Bell: sine with long decay
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(523, now);
      gain.gain.setValueAtTime(0.5 * volScale, now);
      gain.gain.exponentialRampToValueAtTime(0.001 * volScale, now + 1.8);
      osc.start(now); osc.stop(now + 2.0);
      return 2.2;
    }
    case "school_bell": {
      // Two-tone ringing
      for (let i = 0; i < 4; i++) {
        beep(now + i * 0.22, i % 2 === 0 ? 830 : 1050, 0.16, "square");
      }
      return 1.1;
    }
    case "rooster": {
      // Rising glide pattern
      const freqs = [330, 415, 523, 659, 784];
      freqs.forEach((f, i) => beep(now + i * 0.18, f, 0.15, "sawtooth", 0.25));
      return 1.1;
    }
    default:
      beep(now, 880, 0.2, "square");
      return 0.5;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ── AUDIO ENGINE ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function buildAlarmSound(tone) {
  // tone = { type: "builtin", id: "..." } | { type: "custom", dataUrl: "..." }
  let ctx = null;
  let loopHandle = null;
  let audio = null; // for custom
  let volScale = 1.0;

  function start() {
    if (tone.type === "custom" && tone.dataUrl) {
      audio = new Audio(tone.dataUrl);
      audio.loop = true;
      audio.volume = Math.min(1.0, 0.9 * volScale);
      audio.play().catch(() => {});
    } else {
      const id = tone.id ?? "classic_beep";
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      function loop() {
        const dur = createTone(id, ctx, volScale);
        loopHandle = setTimeout(loop, dur * 1000 + 200);
      }
      loop();
    }
  }

  function stop() {
    clearTimeout(loopHandle);
    if (audio) { audio.pause(); audio = null; }
    try { ctx?.close(); } catch (_) {}
    ctx = null;
  }

  function setVolumeScale(scale) {
    volScale = scale;
    if (audio) {
      audio.volume = Math.min(1.0, 0.9 * scale);
    }
    // For web audio context tone, it will automatically apply to next beep loops
  }

  return { start, stop, setVolumeScale };
}

// Preview a tone for 2 seconds then auto-stop
function previewTone(tone, onDone) {
  const snd = buildAlarmSound(tone);
  snd.start();
  const t = setTimeout(() => { snd.stop(); onDone?.(); }, 2200);
  return () => { clearTimeout(t); snd.stop(); };
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Helpers ───────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_NAMES = { 0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat" };

function riskTone(risk) {
  if (risk < 35) return "bg-emerald-soft text-emerald-brand";
  if (risk < 60) return "bg-amber-soft text-amber-brand";
  return "bg-rose-soft text-rose-brand";
}

function formatDisplayTime(hour24, minute) {
  const h = parseInt(hour24, 10);
  const m = parseInt(minute, 10);
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${displayH}:${String(m).padStart(2, "0")} ${period}`;
}

function generatePuzzle() {
  const a = Math.floor(Math.random() * 20) + 5;
  const b = Math.floor(Math.random() * 20) + 5;
  const ops = [
    { q: `${a} + ${b}`, ans: String(a + b) },
    { q: `${a + b} − ${b}`, ans: String(a) },
    { q: `${a} × ${b > 9 ? 2 : b}`, ans: String(a * (b > 9 ? 2 : b)) },
  ];
  return ops[Math.floor(Math.random() * ops.length)];
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Storage ───────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
const STORAGE_KEY = "neurowake_alarms_v2";

function loadAlarms() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"); }
  catch { return []; }
}
function saveAlarms(a) { localStorage.setItem(STORAGE_KEY, JSON.stringify(a)); }

// Default tone for new alarms
const DEFAULT_TONE = { type: "builtin", id: "classic_beep" };

// ─────────────────────────────────────────────────────────────────────────────
// ── AlarmsPage ────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function AlarmsPage() {
  const [alarms, setAlarms] = useState(loadAlarms);
  const [tab, setTab] = useState("alarms");
  const [showModal, setShowModal] = useState(false);
  const [editAlarm, setEditAlarm] = useState(null);
  const [ringingAlarm, setRingingAlarm] = useState(null);
  const [wakeHistory, setWakeHistory] = useState(() => {
    try {
      const raw = localStorage.getItem("neurowake_wake_history");
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return [
      { id: "h1", date: "Jul 17, 2026", time: "06:18 AM", label: "Morning Deep Work", result: "Woke on first ring", snoozes: 0 },
      { id: "h2", date: "Jul 16, 2026", time: "06:24 AM", label: "Morning Deep Work", result: "Solved math puzzle", snoozes: 1 },
      { id: "h3", date: "Jul 15, 2026", time: "06:15 AM", label: "Morning Deep Work", result: "Woke on first ring", snoozes: 0 },
      { id: "h4", date: "Jul 14, 2026", time: "07:41 AM", label: "DSA Exam Prep", result: "Snoozed twice", snoozes: 2 },
    ];
  });
  const soundRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => { saveAlarms(alarms); }, [alarms]);

  // Clean up sound on component unmount
  useEffect(() => {
    return () => {
      try {
        soundRef.current?.stop();
        window.activeAlarmSound?.stop();
      } catch (_) {}
    };
  }, []);

  // Listen for storage dismiss signal (from QR dismiss page in another tab)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "neurowake_dismiss_signal") {
        dismissAlarm();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Live clock — check every 10 s
  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (ringingAlarm) return;
      const now = new Date();
      const todayDay = DAY_NAMES[now.getDay()];
      const nowH = now.getHours();
      const nowM = now.getMinutes();
      if (now.getSeconds() > 10) return;
      for (const alarm of alarms) {
        if (!alarm.enabled) continue;
        if (!alarm.days.includes(todayDay)) continue;
        if (alarm.hour === nowH && alarm.minute === nowM) { triggerAlarm(alarm); break; }
      }
    }, 10000);
    return () => clearInterval(timerRef.current);
  }, [alarms, ringingAlarm]);

  function triggerAlarm(alarm) {
    setRingingAlarm(alarm);
    try {
      soundRef.current = buildAlarmSound(alarm.tone ?? DEFAULT_TONE);
      soundRef.current.start();
      window.activeAlarmSound = soundRef.current; // Store globally so public qr-dismiss page can stop it
    } catch (e) { console.warn("Audio error:", e); }
  }

  function dismissAlarm() {
    try { soundRef.current?.stop(); } catch (_) {}
    try { window.activeAlarmSound?.stop(); } catch (_) {}
    soundRef.current = null;
    window.activeAlarmSound = null;

    // Log this wake event to history in localStorage
    if (ringingAlarm) {
      try {
        const historyRaw = localStorage.getItem("neurowake_wake_history");
        const list = historyRaw ? JSON.parse(historyRaw) : [];
        const now = new Date();
        const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
        const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        
        const newEntry = {
          id: `h_${Date.now()}`,
          date: dateStr,
          time: timeStr,
          label: ringingAlarm.label || "Alarm",
          result: "Woke on first ring",
          snoozes: 0,
        };
        list.unshift(newEntry);
        localStorage.setItem("neurowake_wake_history", JSON.stringify(list));
        setWakeHistory(list);
      } catch (e) {
        console.warn("History save error:", e);
      }
    }

    setRingingAlarm(null);
  }

  function upsert(alarm) {
    setAlarms((prev) => {
      const exists = prev.find((a) => a.id === alarm.id);
      return exists ? prev.map((a) => a.id === alarm.id ? alarm : a) : [...prev, alarm];
    });
  }
  function deleteAlarm(id) { setAlarms((p) => p.filter((a) => a.id !== id)); }
  function toggleAlarm(id) { setAlarms((p) => p.map((a) => a.id === id ? { ...a, enabled: !a.enabled } : a)); }

  function openEdit(alarm) { setEditAlarm(alarm); setShowModal(true); }
  function openCreate() { setEditAlarm(null); setShowModal(true); }

  function toneLabel(alarm) {
    if (!alarm.tone || alarm.tone.type === "builtin") {
      const found = BUILTIN_TONES.find((t) => t.id === (alarm.tone?.id ?? "classic_beep"));
      return found ? `${found.icon} ${found.name}` : "Classic Beep";
    }
    return `🎵 ${alarm.tone.fileName ?? "Custom song"}`;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Smart Alarms</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Adaptive wake prediction · custom ringtones · puzzle dismissal
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => triggerAlarm({ id: "preview", label: "Preview ring", hour: 6, minute: 18, tone: DEFAULT_TONE })}
            className="card-surface rounded-xl px-4 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
          >
            Preview ring
          </button>
          <button
            onClick={openCreate}
            className="btn-gradient inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" /> New alarm
          </button>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="mb-6 inline-flex rounded-xl bg-muted p-1">
        {["alarms", "history"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-lg px-4 py-1.5 text-sm font-semibold capitalize transition-colors",
              tab === t ? "bg-card text-foreground shadow-soft" : "text-muted-foreground"
            )}
          >
            {t === "alarms" ? "My alarms" : "Wake history"}
          </button>
        ))}
      </div>

      {/* Alarms grid */}
      {tab === "alarms" && (
        <motion.div
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3"
        >
          {alarms.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-20 text-center">
              <AlarmClock className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <p className="mt-4 text-sm font-medium text-muted-foreground">No alarms yet</p>
              <button onClick={openCreate} className="btn-gradient mt-4 rounded-xl px-5 py-2.5 text-sm font-semibold">
                Create your first alarm
              </button>
            </div>
          )}

          {alarms.map((a) => (
            <motion.div
              key={a.id}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className={cn("card-surface p-5", !a.enabled && "opacity-60")}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display text-3xl font-bold">{formatDisplayTime(a.hour, a.minute)}</p>
                  <p className="mt-0.5 truncate text-sm font-medium text-muted-foreground">{a.label || "Alarm"}</p>
                </div>
                <Switch checked={a.enabled} onCheckedChange={() => toggleAlarm(a.id)} aria-label={`Toggle ${a.label}`} />
              </div>

              {/* Day pills */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {ALL_DAYS.map((d) => (
                  <span
                    key={d}
                    className={cn(
                      "grid h-7 w-9 place-items-center rounded-lg text-[11px] font-semibold",
                      a.days.includes(d) ? "bg-primary-soft text-primary" : "bg-muted text-muted-foreground/40"
                    )}
                  >
                    {d[0]}
                  </span>
                ))}
              </div>

              {/* Ring info */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Music className="h-3.5 w-3.5" /> Ringtone
                  </span>
                  <span className="font-semibold">{toneLabel(a)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => openEdit(a)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-input bg-background py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => deleteAlarm(a.id)}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/15 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {tab === "history" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-surface p-6">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <History className="h-5 w-5 text-primary" /> Wake-up timeline
            </h2>
            {wakeHistory.length > 0 && (
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to clear your wake-up history?")) {
                    localStorage.setItem("neurowake_wake_history", "[]");
                    setWakeHistory([]);
                  }
                }}
                className="text-xs text-destructive hover:underline flex items-center gap-1 font-semibold"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear all
              </button>
            )}
          </div>

          {wakeHistory.length === 0 ? (
            <div className="py-12 text-center">
              <History className="mx-auto h-12 w-12 text-muted-foreground/30 mb-2" />
              <p className="text-sm font-medium text-muted-foreground">Your alarm history will appear here after alarms ring.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Alarm Time</th>
                    <th className="pb-3 font-semibold">Label</th>
                    <th className="pb-3 font-semibold">Snoozes</th>
                    <th className="pb-3 font-semibold text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {wakeHistory.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-medium text-foreground whitespace-nowrap">{item.date}</td>
                      <td className="py-3 text-muted-foreground whitespace-nowrap">{item.time}</td>
                      <td className="py-3 font-semibold text-foreground">{item.label}</td>
                      <td className="py-3 text-muted-foreground">{item.snoozes} times</td>
                      <td className="py-3 text-right">
                        <span className={cn(
                          "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          item.snoozes === 0 ? "bg-emerald-soft text-emerald-brand" : "bg-amber-soft text-amber-brand"
                        )}>
                          {item.result || "Woke successfully"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <AlarmModal
            alarm={editAlarm}
            onClose={() => setShowModal(false)}
            onSave={(a) => { upsert(a); setShowModal(false); }}
          />
        )}
      </AnimatePresence>

      {/* Ringing */}
      <AnimatePresence>
        {ringingAlarm && (
          <RingingOverlay
            alarm={ringingAlarm}
            onDismiss={dismissAlarm}
            onIncreaseVolume={(scale) => {
              if (soundRef.current) {
                soundRef.current.setVolumeScale(scale);
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Alarm Modal ───────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function AlarmModal({ alarm, onClose, onSave }) {
  const isEdit = !!alarm;
  const [hour24, setHour24] = useState(alarm?.hour ?? 6);
  const [minute, setMinute] = useState(alarm?.minute ?? 30);
  const [period, setPeriod] = useState((alarm?.hour ?? 6) >= 12 ? "PM" : "AM");
  const [label, setLabel] = useState(alarm?.label ?? "");
  const [days, setDays] = useState(alarm?.days ?? ["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [adaptive, setAdaptive] = useState(alarm?.adaptive ?? true);
  const [tone, setTone] = useState(alarm?.tone ?? DEFAULT_TONE);
  const [showTonePicker, setShowTonePicker] = useState(false);

  // ML habits prediction input states
  const [sleepHours, setSleepHours] = useState(alarm?.sleepHours ?? 7.0);
  const [snoozeCount, setSnoozeCount] = useState(alarm?.snoozeCount ?? 2);
  const [studyPending, setStudyPending] = useState(alarm?.studyPending ?? true);
  const [energyLevel, setEnergyLevel] = useState(alarm?.energyLevel ?? 3);

  const displayHour = hour24 % 12 === 0 ? 12 : hour24 % 12;

  function setDisplayHour(val) {
    const h = parseInt(val, 10);
    if (isNaN(h) || h < 1 || h > 12) return;
    setHour24(period === "AM" ? (h === 12 ? 0 : h) : (h === 12 ? 12 : h + 12));
  }
  function togglePeriod(p) {
    setPeriod(p);
    const dh = hour24 % 12 === 0 ? 12 : hour24 % 12;
    if (p === "AM") setHour24(dh === 12 ? 0 : dh);
    else setHour24(dh === 12 ? 12 : dh + 12);
  }
  function toggleDay(d) {
    setDays((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  }

  function toneName() {
    if (tone.type === "custom") return `🎵 ${tone.fileName ?? "Custom"}`;
    const found = BUILTIN_TONES.find((t) => t.id === tone.id);
    return found ? `${found.icon} ${found.name}` : "Classic Beep";
  }

  function computeSnoozeRisk(sleep, snooze, study, energy) {
    let score = 50;
    score += (7 - sleep) * 8;
    score += snooze * 6;
    score += study ? 15 : -10;
    score += (3 - energy) * 10;
    return Math.max(5, Math.min(99, Math.round(score)));
  }

  function save() {
    onSave({
      id: alarm?.id ?? `a${Date.now()}`,
      label: label.trim() || "Alarm",
      hour: hour24,
      minute,
      days,
      enabled: alarm?.enabled ?? true,
      adaptive,
      tone,
      snoozeRisk: computeSnoozeRisk(sleepHours, snoozeCount, studyPending, energyLevel),
      sleepHours,
      snoozeCount,
      studyPending,
      energyLevel,
    });
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm overflow-y-auto"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="card-surface w-full max-w-md p-6 my-4"
        initial={{ scale: 0.93, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 24 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">{isEdit ? "Edit alarm" : "New alarm"}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>

        <div className="mt-6 space-y-5">
          {/* AM/PM time picker */}
          <div>
            <label className="mb-3 block text-sm font-medium">Time</label>
            <div className="flex items-center gap-3">
              {/* Hour */}
              <div className="flex flex-col items-center">
                <button onClick={() => setDisplayHour(displayHour === 12 ? 1 : displayHour + 1)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">▲</button>
                <input type="number" min={1} max={12} value={displayHour}
                  onChange={(e) => setDisplayHour(e.target.value)}
                  className="w-16 rounded-xl border border-input bg-card px-2 py-2.5 text-center font-display text-3xl font-bold outline-none focus:border-primary focus:ring-4 focus:ring-ring/15" />
                <button onClick={() => setDisplayHour(displayHour === 1 ? 12 : displayHour - 1)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">▼</button>
              </div>

              <span className="font-display text-4xl font-bold text-muted-foreground">:</span>

              {/* Minute */}
              <div className="flex flex-col items-center">
                <button onClick={() => setMinute((m) => (m + 5) % 60)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">▲</button>
                <input type="number" min={0} max={59} value={String(minute).padStart(2, "0")}
                  onChange={(e) => { const v = parseInt(e.target.value, 10); if (!isNaN(v) && v >= 0 && v <= 59) setMinute(v); }}
                  className="w-16 rounded-xl border border-input bg-card px-2 py-2.5 text-center font-display text-3xl font-bold outline-none focus:border-primary focus:ring-4 focus:ring-ring/15" />
                <button onClick={() => setMinute((m) => (m - 5 + 60) % 60)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">▼</button>
              </div>

              {/* AM / PM */}
              <div className="ml-2 flex flex-col gap-2">
                {["AM", "PM"].map((p) => (
                  <button key={p} onClick={() => togglePeriod(p)}
                    className={cn("w-14 rounded-xl py-2 text-sm font-bold transition-colors",
                      period === p ? "btn-gradient" : "bg-muted text-muted-foreground hover:bg-muted/80")}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Set for <span className="font-semibold text-foreground">{formatDisplayTime(hour24, minute)}</span>
            </p>
          </div>

          {/* Label */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">Label</label>
            <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Morning Deep Work"
              className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-ring/15" />
          </div>

          {/* Repeat days */}
          <div>
            <label className="mb-2 block text-sm font-medium">Repeat</label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_DAYS.map((d) => (
                <button key={d} onClick={() => toggleDay(d)}
                  className={cn("rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                    days.includes(d) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}>
                  {d}
                </button>
              ))}
              <button onClick={() => setDays(days.length === 7 ? [] : [...ALL_DAYS])}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold bg-muted text-muted-foreground hover:bg-primary-soft hover:text-primary transition-colors">
                {days.length === 7 ? "None" : "Every day"}
              </button>
            </div>
          </div>

          {/* ── RINGTONE PICKER ── */}
          <div>
            <label className="mb-2 block text-sm font-medium">Ringtone</label>
            <button
              onClick={() => setShowTonePicker(true)}
              className="flex w-full items-center justify-between rounded-xl border border-input bg-card px-4 py-3 text-sm hover:bg-muted transition-colors"
            >
              <span className="flex items-center gap-2">
                <Music className="h-4 w-4 text-primary" />
                <span className="font-semibold">{toneName()}</span>
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Adaptive */}
          <div className="flex items-center justify-between rounded-xl bg-primary-soft px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-primary">Adaptive wake prediction</p>
              <p className="text-xs text-secondary-foreground">ML picks lightest sleep moment in ±15 min</p>
            </div>
            <Switch checked={adaptive} onCheckedChange={setAdaptive} />
          </div>

          {/* ML Habits Input Section */}
          <div className="border border-border rounded-2xl p-4 space-y-4 bg-muted/25 text-left">
            <h3 className="text-sm font-bold flex items-center gap-1.5 text-foreground">
              <Brain className="h-4 w-4 text-primary" /> ML habits input data
            </h3>
            
            {/* Sleep duration */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Sleep duration prev night</span>
                <span className="text-primary font-bold">{sleepHours} hours</span>
              </div>
              <input
                type="range"
                min={3.0}
                max={12.0}
                step={0.5}
                value={sleepHours}
                onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Snooze Count */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Snooze count last 7 days</span>
                <span className="text-primary font-bold">{snoozeCount} times</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={snoozeCount}
                onChange={(e) => setSnoozeCount(parseInt(e.target.value, 10))}
                className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Study pending */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Pending study session today</p>
                <p className="text-[10px] text-muted-foreground/80">Scheduled revisions or exam preps</p>
              </div>
              <Switch checked={studyPending} onCheckedChange={setStudyPending} />
            </div>

            {/* Energy level */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-semibold text-muted-foreground block">On-wake energy level</span>
              <div className="flex justify-between gap-1.5">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setEnergyLevel(lvl)}
                    className={cn(
                      "flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors",
                      energyLevel === lvl
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-muted-foreground border-input hover:bg-muted"
                    )}
                  >
                    {lvl === 1 ? "⚡ 1" : lvl === 5 ? "🔥 5" : lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Save */}
          <button onClick={save}
            className="btn-gradient flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold">
            <Check className="h-4 w-4" />
            {isEdit ? "Update alarm" : "Save alarm"}
          </button>
        </div>
      </motion.div>

      {/* Ringtone picker sheet */}
      <AnimatePresence>
        {showTonePicker && (
          <TonePicker
            current={tone}
            onSelect={(t) => { setTone(t); setShowTonePicker(false); }}
            onClose={() => setShowTonePicker(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Tone Picker Sheet ─────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function TonePicker({ current, onSelect, onClose }) {
  const [previewing, setPreviewing] = useState(null); // tone id being previewed
  const stopRef = useRef(null);
  const fileRef = useRef(null);
  const [customFiles, setCustomFiles] = useState(() => {
    try { return JSON.parse(localStorage.getItem("neurowake_custom_tones") ?? "[]"); }
    catch { return []; }
  });

  function stopPreview() {
    stopRef.current?.();
    stopRef.current = null;
    setPreviewing(null);
  }

  function handlePreview(tone) {
    stopPreview();
    setPreviewing(tone.id ?? tone.fileName);
    stopRef.current = previewTone(tone, () => { stopRef.current = null; setPreviewing(null); });
  }

  useEffect(() => () => stopPreview(), []);

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const newTone = { type: "custom", id: `custom_${Date.now()}`, fileName: file.name, dataUrl: reader.result };
      const updated = [...customFiles, newTone];
      setCustomFiles(updated);
      localStorage.setItem("neurowake_custom_tones", JSON.stringify(updated));
      onSelect(newTone);
    };
    reader.readAsDataURL(file);
  }

  function deleteCustom(id) {
    const updated = customFiles.filter((c) => c.id !== id);
    setCustomFiles(updated);
    localStorage.setItem("neurowake_custom_tones", JSON.stringify(updated));
  }

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/40 p-4 backdrop-blur-sm sm:items-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="card-surface w-full max-w-md rounded-2xl p-5"
        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 360, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold">Choose ringtone</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>

        {/* Built-in tones */}
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Built-in tones</p>
        <div className="space-y-1.5 mb-4">
          {BUILTIN_TONES.map((t) => {
            const isSelected = current.type === "builtin" && current.id === t.id;
            const isPreviewing = previewing === t.id;
            return (
              <div key={t.id}
                className={cn("flex items-center justify-between rounded-xl px-4 py-3 cursor-pointer transition-colors",
                  isSelected ? "bg-primary-soft border border-primary/30" : "hover:bg-muted border border-transparent")}
                onClick={() => onSelect({ type: "builtin", id: t.id })}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{t.icon}</span>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); isPreviewing ? stopPreview() : handlePreview({ type: "builtin", id: t.id }); }}
                    className={cn("rounded-lg p-1.5 transition-colors",
                      isPreviewing ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}
                    title={isPreviewing ? "Stop preview" : "Preview"}
                  >
                    {isPreviewing ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  </button>
                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom uploaded files */}
        <div className="border-t border-border pt-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your songs</p>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 rounded-lg bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
            >
              <Upload className="h-3.5 w-3.5" /> Upload
            </button>
            <input ref={fileRef} type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
          </div>

          {customFiles.length === 0 && (
            <button
              onClick={() => fileRef.current?.click()}
              className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-5 text-center hover:border-primary/40 hover:bg-muted/50 transition-colors"
            >
              <Music className="h-7 w-7 text-muted-foreground/50" />
              <p className="mt-2 text-sm font-medium text-muted-foreground">Upload MP3, WAV, OGG…</p>
              <p className="text-xs text-muted-foreground/60">Tap to browse your device</p>
            </button>
          )}

          <div className="space-y-1.5">
            {customFiles.map((cf) => {
              const isSelected = current.type === "custom" && current.id === cf.id;
              const isPreviewing = previewing === cf.fileName;
              return (
                <div key={cf.id}
                  className={cn("flex items-center justify-between rounded-xl px-4 py-3 cursor-pointer transition-colors",
                    isSelected ? "bg-primary-soft border border-primary/30" : "hover:bg-muted border border-transparent")}
                  onClick={() => onSelect(cf)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl">🎵</span>
                    <p className="text-sm font-semibold truncate">{cf.fileName}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); isPreviewing ? stopPreview() : handlePreview(cf); }}
                      className={cn("rounded-lg p-1.5 transition-colors",
                        isPreviewing ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}
                    >
                      {isPreviewing ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteCustom(cf.id); }}
                      className="rounded-lg p-1.5 text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    {isSelected && <Check className="h-4 w-4 text-primary" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Ringing Overlay ───────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// ─── Math puzzle generator ────────────────────────────────────────────────────
function generateSnoozeChallengePuzzle() {
  const ops  = ["+", "-", "×"];
  const a    = Math.floor(Math.random() * 20) + 5;
  const b    = Math.floor(Math.random() * 10) + 1;
  const op   = ops[Math.floor(Math.random() * ops.length)];
  let answer;
  if (op === "+") answer = a + b;
  else if (op === "-") answer = a - b;
  else answer = a * b;
  return { question: `${a} ${op} ${b} = ?`, answer: String(answer) };
}

// ─── Ringing overlay ─────────────────────────────────────────────────────────
function RingingOverlay({ alarm, onDismiss, onIncreaseVolume }) {
  // ML snooze-risk state
  const [mlLoading, setMlLoading]   = useState(true);
  const [snoozeData, setSnoozeData] = useState(null);   // API response
  const [mlError, setMlError]       = useState("");

  // QR code scanning state
  const [qrScanning, setQrScanning] = useState(false);
  const [qrError, setQrError]       = useState("");
  const [solved, setSolved]         = useState(false);
  const [volumeWarning, setVolumeWarning] = useState("");
  const [volumeScaleLevel, setVolumeScaleLevel] = useState(1);

  const qrVideoRef = useRef(null);
  const qrCanvasRef = useRef(null);
  const qrStreamRef = useRef(null);
  const qrLoopRef   = useRef(null);

  // Dynamically load jsQR CDN on mount
  useEffect(() => {
    if (window.jsQR) return;
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // ── Fetch snooze risk on mount ──────────────────────────────────────────
  useEffect(() => {
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const now  = new Date();
    const payload = {
      hour_of_alarm_decimal:    alarm?.hour !== undefined ? (alarm.hour + alarm.minute / 60) : (now.getHours() + now.getMinutes() / 60),
      sleep_duration_prev_night: alarm?.sleepHours ?? 6.5,   // Use actual alarm inputs!
      snooze_count_last_7_days:  alarm?.snoozeCount ?? 2,
      study_session_pending:     alarm?.studyPending ? 1 : 0,
      self_reported_energy:      alarm?.energyLevel ?? 3,
      day_of_week:              days[now.getDay()],
    };
    mlApi.predictSnoozeRisk(payload)
      .then(data => { setSnoozeData(data); setMlLoading(false); })
      .catch(err => {
        console.error("Snooze risk ML failed:", err);
        setMlError("ML service unavailable");
        setMlLoading(false);
      });
  }, [alarm]);

  // ── QR Scanner loop ──────────────────────────────────────────────────────
  const scanFrame = () => {
    if (!qrVideoRef.current || !qrCanvasRef.current || !window.jsQR) {
      qrLoopRef.current = requestAnimationFrame(scanFrame);
      return;
    }
    const video = qrVideoRef.current;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      const canvas = qrCanvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      const code = window.jsQR(imgData.data, imgData.width, imgData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        console.log("✅ QR Code scanned:", code.data);
        setSolved(true);
        stopQrScanner();
        // Redirect to the public qr-dismiss success page
        window.location.href = "/qr-dismiss";
        return; // stop scanning
      }
    }
    qrLoopRef.current = requestAnimationFrame(scanFrame);
  };

  const startQrScanner = async () => {
    setQrError("");
    setQrScanning(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      qrStreamRef.current = mediaStream;
      if (qrVideoRef.current) {
        qrVideoRef.current.srcObject = mediaStream;
      }
      qrLoopRef.current = requestAnimationFrame(scanFrame);
    } catch (err) {
      console.error("Camera access failed:", err);
      setQrError("Could not access camera. Please check permissions.");
      setQrScanning(false);
    }
  };

  const stopQrScanner = () => {
    if (qrLoopRef.current) {
      cancelAnimationFrame(qrLoopRef.current);
      qrLoopRef.current = null;
    }
    if (qrStreamRef.current) {
      qrStreamRef.current.getTracks().forEach(track => track.stop());
      qrStreamRef.current = null;
    }
    setQrScanning(false);
  };

  // Clean up QR camera stream on unmount
  useEffect(() => {
    return () => {
      if (qrLoopRef.current) cancelAnimationFrame(qrLoopRef.current);
      if (qrStreamRef.current) {
        qrStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // ── Dismiss click handler ───────────────────────────────────────────────
  const handleDismissClick = () => {
    if (risk === "high") {
      // Penalty: increase volume scale and warn user!
      const nextLevel = volumeScaleLevel + 1;
      setVolumeScaleLevel(nextLevel);
      setVolumeWarning("⚠️ High snooze risk detected! Simple dismiss blocked. Sound volume increased. You must scan the QR code to stop the alarm!");
      // Progressive volume scale (starting at 1.5x up to 4.0x)
      const scaleVal = Math.min(4.0, 1.0 + nextLevel * 0.75);
      onIncreaseVolume?.(scaleVal);
    } else {
      onDismiss();
    }
  };

  // ── Risk colour helpers ─────────────────────────────────────────────────
  const riskColor = {
    high:   "border-rose-500/40 bg-rose-500/5",
    medium: "border-amber-500/40 bg-amber-500/5",
    low:    "border-emerald-500/40 bg-emerald-500/5",
  };
  const riskBadge = {
    high:   "bg-rose-soft text-rose-brand",
    medium: "bg-amber-soft text-amber-brand",
    low:    "bg-emerald-soft text-emerald-brand",
  };

  const risk = snoozeData?.risk_level ?? "low";
  const displayTime = alarm?.hour !== undefined ? formatDisplayTime(alarm.hour, alarm.minute) : "06:18";

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center bg-card/95 p-4 backdrop-blur-sm overflow-y-auto"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="text-center w-full max-w-md space-y-6 my-4">

        {/* Bell animation */}
        <div className="relative mx-auto grid h-36 w-36 place-items-center">
          {[0, 1, 2].map((i) => (
            <motion.span key={i}
              className="absolute inset-0 rounded-full border-2 border-primary/40"
              animate={{ scale: [1, 1.9], opacity: [0.7, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}/>
          ))}
          <motion.span
            animate={{ rotate: [-6, 6, -6] }}
            transition={{ duration: 0.4, repeat: Infinity }}
            className="grid h-24 w-24 place-items-center rounded-full btn-gradient"
          >
            <BellRing className="h-10 w-10 text-white animate-pulse"/>
          </motion.span>
        </div>

        {/* Time */}
        <div>
          <p className="font-display text-5xl font-extrabold tracking-tight">{displayTime}</p>
          <p className="mt-1 text-sm text-muted-foreground font-medium">{alarm?.label || "Time to wake up!"}</p>
        </div>

        {/* Volume warning banner */}
        {volumeWarning && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card-surface p-4 border border-rose-500 bg-rose-500/10 text-rose-brand rounded-2xl text-xs font-semibold text-left space-y-1.5"
          >
            <p>{volumeWarning}</p>
            <p className="font-bold uppercase text-[10px] text-rose-600 flex items-center gap-1">
              🔊 Volume Scale: {volumeScaleLevel}x Penalty Active
            </p>
          </motion.div>
        )}

        {/* ML Snooze Risk Card */}
        {mlLoading ? (
          <div className="card-surface rounded-2xl p-5 border border-border flex items-center gap-3">
            <RefreshCw className="h-5 w-5 text-primary animate-spin shrink-0"/>
            <div className="text-left">
              <p className="text-sm font-bold text-foreground">ML model analysing habits…</p>
              <p className="text-xs text-muted-foreground mt-0.5">Calculating probability from sleep & habit inputs</p>
            </div>
          </div>
        ) : mlError ? (
          <div className="card-surface rounded-2xl p-5 border border-rose-500/20 bg-rose-500/5">
            <p className="text-xs text-rose-brand">{mlError} — using fallback dismiss</p>
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className={cn("card-surface rounded-2xl p-5 border text-left", riskColor[risk])}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary shrink-0"/>
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-muted-foreground">ML Snooze Prediction</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">
                    {snoozeData.will_snooze ? "You're likely to snooze!" : "You'll probably wake up!"}
                  </p>
                </div>
              </div>
              <span className={cn("shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider", riskBadge[risk])}>
                {risk} risk
              </span>
            </div>

            {/* Snooze probability bar */}
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                <span>Snooze probability</span>
                <span className="font-bold text-foreground">{snoozeData.snooze_probability}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${snoozeData.snooze_probability}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={cn("h-full rounded-full",
                    risk === "high" ? "bg-rose-500" :
                    risk === "medium" ? "bg-amber-500" : "bg-emerald-500"
                  )}
                />
              </div>
            </div>

            {/* Habit factors list */}
            <div className="mt-4 pt-3 border-t border-border flex flex-wrap gap-2 text-[10px] text-muted-foreground">
              <span>🛏️ {alarm?.sleepHours ?? 7.0}h Sleep</span>
              <span>🔄 {alarm?.snoozeCount ?? 2} Snoozes</span>
              <span>📚 {alarm?.studyPending ? "Study pending" : "No pending study"}</span>
              <span>⚡ {alarm?.energyLevel ?? 3}/5 Energy</span>
            </div>
          </motion.div>
        )}

        {/* QR Scanner view for HIGH risk */}
        {!mlLoading && risk === "high" && !solved && (
          <motion.div
            initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="card-surface rounded-2xl p-5 border border-primary/20 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Wake Mission</span>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <QrCode className="h-4 w-4 text-primary animate-pulse" /> Scan QR Code to Dismiss
                </h3>
              </div>
              {qrScanning && (
                <button
                  onClick={stopQrScanner}
                  className="text-xs px-2.5 py-1 rounded-lg border border-input bg-card hover:bg-muted text-muted-foreground"
                >
                  Cancel
                </button>
              )}
            </div>

            {qrScanning ? (
              <div className="relative overflow-hidden rounded-2xl bg-black aspect-video border border-border flex items-center justify-center">
                <video ref={qrVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <canvas ref={qrCanvasRef} className="hidden" />
                
                {/* QR scanning laser effect */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-emerald-500/80 rounded-xl relative">
                    <motion.div
                      animate={{ y: [0, 192, 0] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-x-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border py-8 text-center bg-muted/10">
                <QrCode className="mx-auto h-12 w-12 text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground">Camera feed is off</p>
                <button
                  onClick={startQrScanner}
                  className="mt-3 btn-gradient rounded-xl px-5 py-2.5 text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Camera className="h-3.5 w-3.5" /> Start QR Scanner
                </button>
              </div>
            )}

            {qrError && (
              <p className="text-xs text-rose-brand font-medium flex items-center gap-1 justify-center">
                <AlertCircle className="h-3.5 w-3.5" /> {qrError}
              </p>
            )}
          </motion.div>
        )}

        {/* Success / Solved badge */}
        {solved && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="card-surface rounded-2xl p-5 border border-emerald-500/40 bg-emerald-500/5 flex items-center gap-3 text-left"
          >
            <Check className="h-6 w-6 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-800">QR Code scanned successfully!</p>
              <p className="text-xs text-emerald-600 mt-0.5">Alarm dismissed. Time to start your focus session! 🚀</p>
            </div>
          </motion.div>
        )}

        {/* Dismiss Alarm Button (Simple click for low/medium risk, increases volume for high risk) */}
        {!mlLoading && !solved && (
          <div className="flex flex-col gap-3">
            <button
              onClick={handleDismissClick}
              className={cn(
                "w-full rounded-xl py-3.5 text-sm font-bold shadow-lift transition-all",
                risk === "high" ? "bg-muted text-muted-foreground hover:bg-muted/80" : "btn-gradient text-white"
              )}
            >
              Dismiss Alarm
            </button>
            <p className="text-xs text-muted-foreground">
              {risk === "high" 
                ? "💡 High snooze risk: simple dismiss will increase sound volume!"
                : risk === "medium" 
                ? "🟡 Moderate risk: stay committed to your study schedule today!"
                : "✅ Low risk: great wake habit, have an amazing session!"
              }
            </p>
          </div>
        )}

        {/* fallback dismiss when ML service fails */}
        {!mlLoading && mlError && (
          <button onClick={onDismiss} className="btn-gradient w-full rounded-xl py-3.5 text-sm font-bold">
            Dismiss Alarm
          </button>
        )}

      </div>
    </motion.div>
  );
}

