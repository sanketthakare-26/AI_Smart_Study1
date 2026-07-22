import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { AuthInput, AuthLayout, SocialButtons } from "@/components/AuthLayout";
import { authApi } from "@/services/api";
export const Route = createFileRoute("/register")({
    head: () => ({
        meta: [
            { title: "Create account — NeuroWake" },
            { name: "description", content: "Create your NeuroWake account and let AI fix your mornings." },
        ],
    }),
    component: RegisterPage,
});
function RegisterPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = async (values) => {
        setLoading(true);
        await authApi.register(values);
        setLoading(false);
        navigate({ to: "/otp" });
    };
    return (<AuthLayout title="Create your account" subtitle="Two minutes now, better mornings forever." footer={<span>Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Log in</Link></span>}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthInput label="Full name" placeholder="Aarav Sharma" error={errors.name?.message} {...register("name", { required: "Name is required" })}/>
        <AuthInput label="Email" type="email" placeholder="you@university.edu" error={errors.email?.message} {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/, message: "Enter a valid email" } })}/>
        <AuthInput label="Password" type="password" placeholder="At least 8 characters" error={errors.password?.message} {...register("password", { required: "Password is required", minLength: { value: 8, message: "Minimum 8 characters" } })}/>
        <button type="submit" disabled={loading} className="btn-gradient flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-70">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin"/> Creating account…</> : "Create account"}
        </button>
        <div className="relative py-2 text-center text-xs text-muted-foreground">
          <span className="relative z-10 bg-background px-3">or sign up with</span>
          <span className="absolute inset-x-0 top-1/2 h-px bg-border"/>
        </div>
        <SocialButtons />
      </form>
    </AuthLayout>);
}
