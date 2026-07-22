import { useState } from "react";
import { Link, useNavigate, createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { Loader2, AlertCircle } from "lucide-react";
import { AuthLayout, AuthInput, SocialButtons } from "@/components/AuthLayout";
import { useAuth } from "@/context/AuthContext";

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
  const { registerWithEmail, loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password");

  // ── Email / Password register ─────────────────────────────────────────────
  const onSubmit = async (values) => {
    setAuthError("");
    setLoading(true);
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("force_show_onboarding", "true");
      }
      await registerWithEmail(values.email, values.password, values.name);
      navigate({ to: "/app" });
    } catch (err) {
      setAuthError(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ── Google register ───────────────────────────────────────────────────────
  const handleGoogle = async () => {
    setAuthError("");
    setGoogleLoading(true);
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("force_show_onboarding", "true");
      }
      await loginWithGoogle();
      navigate({ to: "/app" });
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setAuthError(getFirebaseErrorMessage(err.code));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Let AI fix your mornings and maximise your study time."
      footer={
        <span>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </span>
      }
    >
      {authError && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthInput
          label="Full name"
          type="text"
          placeholder="Alex Johnson"
          error={errors.name?.message}
          {...register("name", { required: "Name is required" })}
        />
        <AuthInput
          label="Email"
          type="email"
          placeholder="you@university.edu"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/, message: "Enter a valid email" },
          })}
        />
        <AuthInput
          label="Password"
          type="password"
          placeholder="Min. 6 characters"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Minimum 6 characters" },
          })}
        />
        <AuthInput
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          error={errors.confirm?.message}
          {...register("confirm", {
            required: "Please confirm your password",
            validate: (v) => v === password || "Passwords do not match",
          })}
        />

        <button
          type="submit"
          disabled={loading}
          className="btn-gradient flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Creating account…
            </>
          ) : (
            "Create account"
          )}
        </button>

        <div className="relative py-2 text-center text-xs text-muted-foreground">
          <span className="relative z-10 bg-background px-3">or sign up with</span>
          <span className="absolute inset-x-0 top-1/2 h-px bg-border" />
        </div>

        <SocialButtons onGoogle={handleGoogle} googleLoading={googleLoading} />

        <p className="text-center text-xs text-muted-foreground">
          By creating an account you agree to our{" "}
          <a href="#" className="underline hover:text-foreground">
            Terms of Service
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}

function getFirebaseErrorMessage(code) {
  const messages = {
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/too-many-requests": "Too many attempts. Try again later.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/popup-blocked": "Popup was blocked. Allow popups for this site.",
  };
  return messages[code] || "Registration failed. Please try again.";
}
