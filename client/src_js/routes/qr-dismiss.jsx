import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, ArrowRight, Hourglass } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/qr-dismiss")({
  head: () => ({
    meta: [{ title: "Alarm Dismissed — NeuroWake" }],
  }),
  component: QrDismissPage,
});

function QrDismissPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    localStorage.setItem("neurowake_dismiss_signal", Date.now().toString());
    try {
      if (window.activeAlarmSound) {
        window.activeAlarmSound.stop();
        window.activeAlarmSound = null;
      }
    } catch (e) {
      console.warn("Failed to stop active alarm sound:", e);
    }
    try {
      localStorage.removeItem("ringing_alarm_state");
    } catch (_) {}

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
    <div className="flex min-h-screen items-center justify-center bg-background px-4 font-sans selection:bg-primary/10">
      <div className="w-full max-w-md text-center space-y-8" id="qr-dismiss-success">
        <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <CheckCircle2 className="h-16 w-16 text-emerald-500" />
          </motion.div>
          <motion.span
            className="absolute inset-0 rounded-full border border-emerald-500/30"
            animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          />
        </div>

        <div className="space-y-3">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground" id="qr-dismiss-status">
            Alarm Stopped Successfully!
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Your QR code was verified. The alarm has been turned off. Get ready to conquer your day! 🚀
          </p>
        </div>

        <div className="card-surface rounded-2xl p-6 border border-border bg-card/50 backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-center gap-3">
            <Hourglass className="h-5 w-5 text-primary animate-spin shrink-0" />
            <p className="text-sm font-semibold text-foreground">
              Redirecting you to dashboard in{" "}
              <span className="font-bold text-primary font-display text-lg" id="qr-dismiss-countdown">
                {countdown}
              </span>{" "}
              seconds...
            </p>
          </div>
          
          <div className="mt-4 h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="h-full rounded-full bg-primary"
            />
          </div>
        </div>

        <div>
          <button
            onClick={() => navigate({ to: "/app/alarms" })}
            className="btn-gradient rounded-xl px-6 py-3 text-sm font-bold text-white inline-flex items-center gap-2 shadow-lift hover:shadow-none transition-all duration-300"
          >
            Go to Alarms Now
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
