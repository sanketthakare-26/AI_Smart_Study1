import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  AlarmClock,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CalendarCheck,
  CloudSun,
  FileText,
  MessageSquareText,
  Moon,
  Puzzle,
  Sparkles,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { VediqLogo } from "@/components/VediqLogo";
import heroDashboard from "@/assets/hero-dashboard.jpg";
import { fadeUp, staggerContainer } from "@/components/kit";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs, landingStats, testimonials } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VediQ — AI Smart Study System" },
      {
        name: "description",
        content:
          "Plan, Focus, Learn, and Improve. Adaptive wake prediction, AI study planning, and focus analytics for students.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: AlarmClock,
    title: "Adaptive Wake Prediction",
    desc: "A custom ML model finds your lightest sleep phase inside your wake window and rings at the perfect moment.",
    tone: "bg-primary-soft text-primary",
  },
  {
    icon: Zap,
    title: "Snooze Risk Score",
    desc: "Every alarm gets a live risk prediction. High risk triggers progressive volume and puzzle dismissal automatically.",
    tone: "bg-amber-soft text-amber-brand",
  },
  {
    icon: CalendarCheck,
    title: "AI Study Planner",
    desc: "Gemini builds an exam-aware schedule around your real focus data, with spaced repetition baked in.",
    tone: "bg-teal-soft text-teal-brand",
  },
  {
    icon: MessageSquareText,
    title: "AI Learning Assistant",
    desc: "Chat with your notes, generate quizzes, summarize PDFs, and build flashcards in seconds.",
    tone: "bg-sky-soft text-sky-brand",
  },
  {
    icon: BarChart3,
    title: "Study Analytics",
    desc: "Sleep-vs-focus correlation, weekly heatmaps, subject mastery, and trend lines that actually explain your progress.",
    tone: "bg-emerald-soft text-emerald-brand",
  },
  {
    icon: CloudSun,
    title: "Weather & Traffic Buffers",
    desc: "Rainy morning? Heavy traffic? Your alarm shifts earlier automatically so you're never caught off guard.",
    tone: "bg-rose-soft text-rose-brand",
  },
];

const workflow = [
  {
    step: "01",
    icon: Moon,
    title: "Sleep is tracked",
    desc: "Bedtime, duration, and wake latency feed the prediction model each night.",
  },
  {
    step: "02",
    icon: BrainCircuit,
    title: "ML predicts your morning",
    desc: "Snooze risk, optimal wake window, and best study slot are computed before you wake.",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "Gemini plans your day",
    desc: "An AI study plan is generated around your peak focus hours and exam deadlines.",
  },
  {
    step: "04",
    icon: TrendingUp,
    title: "Analytics close the loop",
    desc: "Every session refines the models — the system gets smarter the more you use it.",
  },
];

const techStack = [
  { name: "Custom ML Models", desc: "Snooze risk · wake window · focus score" },
  { name: "Google Gemini", desc: "Planning · summarization · quiz generation" },
  { name: "React + Vite", desc: "Fast, modern frontend" },
  { name: "Recharts", desc: "Live learning analytics" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-card/80 shadow-soft backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <VediqLogo />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#how" className="text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </a>
          <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="btn-gradient rounded-xl px-4 py-2 text-sm font-semibold"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

function Landing() {
  const heroRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.to(".blob-1", { x: 40, y: -30, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".blob-2", { x: -30, y: 40, duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.utils.toArray(".gsap-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40">
        <div className="blob-1 pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="blob-2 pointer-events-none absolute -right-24 top-64 h-80 w-80 rounded-full bg-teal-brand/15 blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">

            <motion.h1
              variants={fadeUp}
              className="mt-5 font-display text-4xl font-bold leading-[1.12] sm:text-5xl lg:text-[3.4rem]"
            >
              An alarm that understands{" "}
              <span className="text-gradient">your brain</span>, not just your clock.
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-lg text-lg text-muted-foreground"
            >
              VediQ predicts your perfect wake moment, plans your study day with AI, and shows
              you exactly how sleep drives your focus.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="btn-gradient inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
              >
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="animate-float overflow-hidden rounded-3xl border border-border shadow-lift">
              <img
                src={heroDashboard}
                alt="VediQ AI dashboard with smart alarm, focus score, and study analytics"
                width={1280}
                height={960}
                className="h-auto w-full"
              />
            </div>

          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="gsap-reveal card-surface grid grid-cols-2 gap-6 rounded-3xl p-8 lg:grid-cols-4">
          {landingStats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-bold text-gradient">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="gsap-reveal mx-auto max-w-2xl text-center">
          <span className="chip bg-teal-soft text-teal-brand">Features</span>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            More than an alarm. A learning system.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Every feature is driven by real predictions from your own data.
          </p>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={fadeUp} className="card-surface card-hover p-6">
              <span className={`grid h-11 w-11 place-items-center rounded-xl ${f.tone}`}>
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-card py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="gsap-reveal mx-auto max-w-2xl text-center">
            <span className="chip bg-primary-soft text-primary">AI Workflow</span>
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
              How VediQ thinks
            </h2>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {workflow.map((w, i) => (
              <motion.div
                key={w.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.55 }}
                className="relative"
              >
                <span className="font-display text-5xl font-bold text-primary/10">{w.step}</span>
                <span className="mt-2 grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
                  <w.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display font-semibold">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="gsap-reveal mt-16 grid gap-4 rounded-3xl bg-background p-6 sm:grid-cols-2 lg:grid-cols-4">
            {techStack.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-border bg-card p-4 text-center shadow-soft"
              >
                <p className="font-display text-sm font-semibold">{t.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="gsap-reveal mx-auto max-w-2xl text-center">
          <span className="chip bg-emerald-soft text-emerald-brand">Loved by students</span>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            Mornings, transformed
          </h2>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.figure key={t.name} variants={fadeUp} className="card-surface card-hover p-6">
              <blockquote className="text-sm leading-relaxed text-foreground">
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                  {t.name.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <div className="gsap-reveal text-center">
          <span className="chip bg-sky-soft text-sky-brand">FAQ</span>
          <h2 className="mt-4 font-display text-3xl font-bold">Questions, answered</h2>
        </div>
        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`item-${i}`}
              className="card-surface mb-3 rounded-2xl border px-5"
            >
              <AccordionTrigger className="text-left font-display text-sm font-semibold hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div
          className="gsap-reveal relative overflow-hidden rounded-3xl p-10 text-center sm:p-16"
          style={{ background: "var(--gradient-primary)" }}
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary-foreground/10 blur-2xl" />
          <h2 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
            Wake smarter tomorrow.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
            Join 15,000+ students using AI to fix their mornings and master their exams.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-card px-7 py-3 text-sm font-semibold text-primary shadow-lift transition-transform hover:-translate-y-0.5"
          >
            Create free account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg btn-gradient">
              <BrainCircuit className="h-4 w-4" />
            </span>
            <span className="font-display font-bold">VediQ</span>
          </div>
          <p className="text-sm text-muted-foreground">
            AI-Powered Smart Study &amp; Alarm Management · Capstone 2026
          </p>
          <div className="flex gap-5 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
            <Link to="/login" className="hover:text-foreground">Log in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
