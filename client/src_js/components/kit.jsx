import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
/* ---------- Motion presets ---------- */
export const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
export const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};
/* ---------- Progress Ring ---------- */
export function ProgressRing({ value, size = 120, stroke = 10, label, colorVar = "--primary", }) {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    return (<div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-muted"/>
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round" stroke={`var(${colorVar})`} strokeDasharray={c} initial={{ strokeDashoffset: c }} whileInView={{ strokeDashoffset: c - (value / 100) * c }} viewport={{ once: true }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}/>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-bold">{value}</span>
        {label && <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</span>}
      </div>
    </div>);
}
/* ---------- Stat Card ---------- */
export function StatCard({ icon, label, value, sub, tone = "primary", }) {
    const tones = {
        primary: "bg-primary-soft text-primary",
        teal: "bg-teal-soft text-teal-brand",
        emerald: "bg-emerald-soft text-emerald-brand",
        amber: "bg-amber-soft text-amber-brand",
        sky: "bg-sky-soft text-sky-brand",
    };
    return (<motion.div variants={fadeUp} className="card-surface card-hover p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 font-display text-2xl font-bold">{value}</p>
          {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
        </div>
        <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", tones[tone])}>{icon}</div>
      </div>
    </motion.div>);
}
/* ---------- Page Header ---------- */
export function PageHeader({ title, subtitle, actions }) {
    return (<div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate font-display text-2xl font-bold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>);
}
/* ---------- Empty State ---------- */
export function EmptyState({ icon, title, desc, action }) {
    return (<div className="card-surface flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary">{icon}</div>
      <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{desc}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>);
}
/* ---------- AI thinking loader ---------- */
export function ThinkingDots() {
    return (<span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (<motion.span key={i} className="h-2 w-2 rounded-full bg-primary" animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}/>))}
    </span>);
}
