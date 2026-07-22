import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { AuthInput, AuthLayout } from "@/components/AuthLayout";
export const Route = createFileRoute("/forgot-password")({
    head: () => ({ meta: [{ title: "Reset password — NeuroWake" }] }),
    component: ForgotPage,
});
function ForgotPage() {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = async () => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 900));
        setLoading(false);
        setSent(true);
    };
    return (<AuthLayout title="Reset your password" subtitle="We'll email you a secure reset link." footer={<Link to="/login" className="font-semibold text-primary hover:underline">Back to login</Link>}>
      {sent ? (<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-surface flex flex-col items-center p-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-brand"/>
          <h3 className="mt-4 font-display text-lg font-semibold">Check your inbox</h3>
          <p className="mt-1 text-sm text-muted-foreground">If an account exists for that email, a reset link is on its way.</p>
        </motion.div>) : (<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AuthInput label="Email" type="email" placeholder="you@university.edu" error={errors.email?.message} {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/, message: "Enter a valid email" } })}/>
          <button type="submit" disabled={loading} className="btn-gradient flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-70">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin"/> Sending…</> : "Send reset link"}
          </button>
        </form>)}
    </AuthLayout>);
}
