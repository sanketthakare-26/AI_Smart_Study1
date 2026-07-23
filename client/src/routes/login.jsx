import { useState } from "react";
import { Link, useNavigate, createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { Loader2, AlertCircle } from "lucide-react";
import { AuthLayout, AuthInput, SocialButtons } from "@/components/AuthLayout";
import { useAuth } from "@/context/AuthContext";

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
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm();

  // ── Email / Password login ──────────────────────────────────────────────
  const onSubmit = async (values) => {
    setAuthError("");
    setLoading(true);
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("force_show_onboarding", "true");
      }
      await loginWithEmail(values.email, values.password);
      navigate({ to: "/app" });
    } catch (err) {
      setAuthError(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ── Google login ─────────────────────────────────────────────────────────
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
      title="Welcome back"
      subtitle="Your alarms and study plan are waiting."
      footer={
        <span>
          New here?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Create an account
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
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Minimum 6 characters" },
          })}
        />

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-gradient flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
            </>
          ) : (
            "Log in"
          )}
        </button>

        <div className="relative py-2 text-center text-xs text-muted-foreground">
          <span className="relative z-10 bg-background px-3">or continue with</span>
          <span className="absolute inset-x-0 top-1/2 h-px bg-border" />
        </div>

        <SocialButtons onGoogle={handleGoogle} googleLoading={googleLoading} />
      </form>
    </AuthLayout>
  );
}

function getFirebaseErrorMessage(code) {
  const messages = {
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/invalid-credential": "Invalid email or password.",
    "auth/too-many-requests": "Too many failed attempts. Try again later.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/popup-blocked": "Popup was blocked. Allow popups for this site.",
  };
  return messages[code] || "Authentication failed. Please try again.";
}
