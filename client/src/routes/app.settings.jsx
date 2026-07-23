import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Bell, Palette, Sparkles, Brain, Check, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { fadeUp, PageHeader } from "@/components/kit";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "App Settings — VediQ" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(() => localStorage.getItem("nw_set_email_alerts") !== "false");
  const [wakeReminders, setWakeReminders] = useState(() => localStorage.getItem("nw_set_wake_reminders") !== "false");
  const [sessionAlerts, setSessionAlerts] = useState(() => localStorage.getItem("nw_set_session_alerts") !== "false");
  
  const [glassmorphism, setGlassmorphism] = useState(() => localStorage.getItem("nw_set_glassmorphism") !== "false");
  const [aiVoice, setAiVoice] = useState(() => localStorage.getItem("nw_set_ai_voice") || "encouraging");
  const [alarmDifficulty, setAlarmDifficulty] = useState(() => localStorage.getItem("nw_set_alarm_difficulty") || "Standard");

  const [saved, setSaved] = useState(false);

  function handleSave() {
    localStorage.setItem("nw_set_email_alerts", String(emailAlerts));
    localStorage.setItem("nw_set_wake_reminders", String(wakeReminders));
    localStorage.setItem("nw_set_session_alerts", String(sessionAlerts));
    localStorage.setItem("nw_set_glassmorphism", String(glassmorphism));
    localStorage.setItem("nw_set_ai_voice", aiVoice);
    localStorage.setItem("nw_set_alarm_difficulty", alarmDifficulty);

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="Preferences & Settings"
        description="Customize notifications, AI assistant characteristics, and application aesthetics."
      />

      <div className="space-y-6">
        {/* Notifications */}
        <motion.div variants={fadeUp} className="card-surface p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold flex items-center gap-2 border-b border-border pb-3">
            <Bell className="h-5 w-5 text-primary" /> Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Email Alerts</p>
                <p className="text-xs text-muted-foreground">Receive weekly performance summaries and study plans.</p>
              </div>
              <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} aria-label="Toggle Email Alerts" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Wake Verification Reminders</p>
                <p className="text-xs text-muted-foreground">Alerts when you miss a QR or Math challenge dismiss window.</p>
              </div>
              <Switch checked={wakeReminders} onCheckedChange={setWakeReminders} aria-label="Toggle Wake Reminders" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Study Session Alerts</p>
                <p className="text-xs text-muted-foreground">Nudge notifications to keep your streak alive today.</p>
              </div>
              <Switch checked={sessionAlerts} onCheckedChange={setSessionAlerts} aria-label="Toggle Study Alerts" />
            </div>
          </div>
        </motion.div>

        {/* Customization & Theme */}
        <motion.div variants={fadeUp} className="card-surface p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold flex items-center gap-2 border-b border-border pb-3">
            <Palette className="h-5 w-5 text-primary" /> UI Customization
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Glassmorphism Overlay</p>
                <p className="text-xs text-muted-foreground">Enable dynamic backdrop blurs and frosted glass cards.</p>
              </div>
              <Switch checked={glassmorphism} onCheckedChange={setGlassmorphism} aria-label="Toggle Glassmorphism" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Default Alarm Difficulty</label>
              <select
                value={alarmDifficulty}
                onChange={(e) => setAlarmDifficulty(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-card text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-ring/10 transition-all"
              >
                <option value="Standard">Standard (Button Dismiss)</option>
                <option value="Math">Math (Snooze Challenge)</option>
                <option value="QR">QR Code Wake Mission</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* AI & Smart Systems */}
        <motion.div variants={fadeUp} className="card-surface p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold flex items-center gap-2 border-b border-border pb-3">
            <Sparkles className="h-5 w-5 text-primary" /> AI Personality
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">AI Tone Style</label>
              <select
                value={aiVoice}
                onChange={(e) => setAiVoice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-card text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-ring/10 transition-all"
              >
                <option value="encouraging">Encouraging & Motivating</option>
                <option value="strict">Strict & Disciplined</option>
                <option value="analytical">Analytical & Metric-oriented</option>
                <option value="casual">Casual Friend</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Save Bar */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div>
            {saved && (
              <span className="text-xs font-semibold text-emerald-brand flex items-center gap-1">
                <Check className="h-4 w-4" /> Preferences updated successfully!
              </span>
            )}
          </div>
          <button
            onClick={handleSave}
            className="btn-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lift"
          >
            <Save className="h-4 w-4" /> Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
