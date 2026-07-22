import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { VediqLogo } from "@/components/VediqLogo";

export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand side */}
      <div className="relative hidden overflow-hidden lg:block" style={{ background: "var(--gradient-primary)" }}>
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary-glow/40 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-sky-brand/30 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
          <Link to="/" className="flex items-center gap-2.5">
            <VediqLogo textClassName="font-display text-xl font-bold text-white" />
          </Link>
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-display text-4xl font-bold leading-tight"
            >
              VediQ — AI Smart Study System
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-4 max-w-md text-primary-foreground/80"
            >
              Plan, Focus, Learn, and Improve. Adaptive alarms, AI study planner, and collaborative study rooms built for students.
            </motion.p>
          </div>
          <p className="text-sm text-primary-foreground/60">Powered by custom ML models + Google Gemini</p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <VediqLogo />
          </Link>
          <h1 className="font-display text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && (
            <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export function AuthInput({ label, error, ...props }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <input
        {...props}
        className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-ring/15"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function SocialButtons({ onGoogle, googleLoading }) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {/* Google */}
      <button
        type="button"
        onClick={onGoogle}
        disabled={googleLoading}
        className="card-surface flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-transform hover:-translate-y-0.5 disabled:opacity-70"
      >
        {googleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
        )}
        Continue with Google
      </button>
    </div>
  );
}
