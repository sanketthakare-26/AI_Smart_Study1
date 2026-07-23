import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, ArrowRight, Hourglass } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/qr-dismiss")({
  head: () => ({
    meta: [{ title: "Alarm Dismissed — VediQ" }],
  }),
  component: QrDismissPage,
});

function QrDismissPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    // 1. Send dismiss signal to other tabs/windows
    localStorage.setItem("VediQ_dismiss_signal", Date.now().toString());

    // 2. Stop any local active audio sounds
    try {
      if (window.activeAlarmSound) {
        window.activeAlarmSound.stop();
        window.activeAlarmSound = null;
      }
    } catch (e) {
      console.warn("Failed to stop active alarm sound:", e);
    }

    // 3. Clear any active ringing state in localStorage
    try {
      localStorage.removeItem("ringing_alarm_state");
    } catch (_) {}

    // 4. Countdown timer (4 seconds)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate({ to: "/app/alarms" });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4 selection:bg-orange-500/20"
      style={{
        background: "linear-gradient(135deg, #fef3c7 0%, #fbcfe8 50%, #e0e7ff 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg rounded-3xl bg-white/80 p-10 text-center shadow-2xl backdrop-blur-xl border border-white/60 relative overflow-hidden"
      >
        {/* Sun Icon */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-2xl shadow-inner">
          ☀️
        </div>

        {/* Main Title */}
        <h1 className="font-display text-4xl font-extrabold text-orange-600 tracking-tight underline decoration-orange-400 decoration-wavy underline-offset-8">
          Get up Buddy!!
        </h1>

        {/* Subtitle / Motivational Quote */}
        <p className="mt-6 text-base font-medium text-zinc-600 max-w-sm mx-auto leading-relaxed">
          Do something today that your future self will thank you for.
        </p>

        {/* Sparkle Icon */}
        <div className="my-6 text-3xl animate-bounce">
          ✨
        </div>

        {/* Progress Bar & Countdown */}
        <div className="space-y-2 max-w-xs mx-auto">
          <div className="h-1.5 w-full rounded-full bg-orange-100 overflow-hidden">
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 4, ease: "linear" }}
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-600"
            />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            ONE STEP CLOSER TO YOUR <span className="font-bold text-orange-600">JOURNEY</span> · ({countdown}s)
          </p>
        </div>
      </motion.div>
    </div>
  );
}
