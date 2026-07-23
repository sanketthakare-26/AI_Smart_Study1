import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { AuthInput, AuthLayout, SocialButtons } from "@/components/AuthLayout";
import { authApi } from "@/services/api";
export const Route = createFileRoute("/login")({
    head: () => ({
        meta: [
            { title: "Log in — VediQ" },
            { name: "description", content: "Log in to your VediQ AI study and alarm dashboard." },
        ],
    }),
    component: LoginPage,
});
function LoginPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = async (values) => {
        setLoading(true);
        await authApi.login(values);
        setLoading(false);
        navigate({ to: "/app" });
    };
    return (<AuthLayout title="Welcome back" subtitle="Your alarms and study plan are waiting." footer={<span>New here? <Link to="/register" className="font-semibold text-primary hover:underline">Create an account</Link></span>}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthInput label="Email" type="email" placeholder="you@university.edu" error={errors.email?.message} {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/, message: "Enter a valid email" } })}/>
        <AuthInput label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })}/>
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">Forgot password?</Link>
        </div>
        <button type="submit" disabled={loading} className="btn-gradient flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-70">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin"/> Signing in…</> : "Log in"}
        </button>
        <div className="relative py-2 text-center text-xs text-muted-foreground">
          <span className="relative z-10 bg-background px-3">or continue with</span>
          <span className="absolute inset-x-0 top-1/2 h-px bg-border"/>
        </div>
        <SocialButtons />
      </form>
    </AuthLayout>);
}
