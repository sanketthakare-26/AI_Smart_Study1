import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { AuthLayout } from "@/components/AuthLayout";
export const Route = createFileRoute("/otp")({
    head: () => ({ meta: [{ title: "Verify email — VediQ" }] }),
    component: OtpPage,
});
function OtpPage() {
    const navigate = useNavigate();
    const [digits, setDigits] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const refs = useRef([]);
    const handleChange = (i, val) => {
        if (!/^\d?$/.test(val))
            return;
        const next = [...digits];
        next[i] = val;
        setDigits(next);
        if (val && i < 5)
            refs.current[i + 1]?.focus();
    };
    const handleKeyDown = (i, e) => {
        if (e.key === "Backspace" && !digits[i] && i > 0)
            refs.current[i - 1]?.focus();
    };
    const complete = digits.every((d) => d !== "");
    const verify = async () => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1100));
        setLoading(false);
        navigate({ to: "/app" });
    };
    return (<AuthLayout title="Verify your email" subtitle="Enter the 6-digit code we sent to your inbox.">
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {digits.map((d, i) => (<motion.input key={i} ref={(el) => { refs.current[i] = el; }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} value={d} onChange={(e) => handleChange(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)} inputMode="numeric" maxLength={1} aria-label={`Digit ${i + 1}`} className="h-13 w-11 rounded-xl border border-input bg-card text-center font-display text-xl font-bold outline-none transition-all focus:border-primary focus:ring-4 focus:ring-ring/15 sm:h-14 sm:w-12"/>))}
        </div>
        <button onClick={verify} disabled={!complete || loading} className="btn-gradient flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin"/> Verifying…</> : <><ShieldCheck className="h-4 w-4"/> Verify & continue</>}
        </button>
        <p className="text-center text-xs text-muted-foreground">
          Didn't get a code? <button className="font-semibold text-primary hover:underline">Resend</button>
        </p>
      </div>
    </AuthLayout>);
}
