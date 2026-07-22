var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _reactrouter from "@tanstack/react-router";
import * as _framermotion from "framer-motion";
import * as _lucidereact from "lucide-react";
import * as _react from "react";
import * as _kit from "@/components/kit";
import * as _mockdata from "@/lib/mock-data";
import * as _api from "@/services/api";
import * as _utils from "@/lib/utils";

function _nullishCoalesce(lhs, rhsFn) {
      if (lhs != null) {
        return lhs;
      } else {
        return rhsFn();
      }
    }

    const Route = _reactrouter.createFileRoute("/app/planner")({
      head: () => ({ meta: [{ title: "Study Planner \u2014 NeuroWake" }] }),
      component: PlannerPage
    });
    
    const weekDays = ["Mon 7", "Tue 8", "Wed 9", "Thu 10", "Fri 11", "Sat 12", "Sun 13"];

    // Lightweight markdown → HTML renderer (no external dependencies)
    function renderMarkdown(md) {
      if (!md) return "";
      return md
        // Headings
        .replace(/^#### (.+)$/gm, "<h4 class=\"text-xs font-bold text-foreground mt-3 mb-1\">$1</h4>")
        .replace(/^### (.+)$/gm, "<h3 class=\"text-sm font-bold text-primary mt-4 mb-1.5\">$1</h3>")
        .replace(/^## (.+)$/gm, "<h2 class=\"text-base font-bold text-foreground mt-5 mb-2\">$1</h2>")
        .replace(/^# (.+)$/gm, "<h1 class=\"text-lg font-bold text-primary mt-4 mb-2\">$1</h1>")
        // Bold
        .replace(/\*\*(.+?)\*\*/g, "<strong class=\"font-semibold text-foreground\">$1</strong>")
        // Italic
        .replace(/\*(.+?)\*/g, "<em class=\"italic text-muted-foreground\">$1</em>")
        // Horizontal rule
        .replace(/^---$/gm, "<hr class=\"my-3 border-border\"/>")
        // Numbered list items
        .replace(/^\d+\.\s+(.+)$/gm, "<li class=\"ml-4 mb-1 list-decimal\">$1</li>")
        // Bullet list items
        .replace(/^[\-\*]\s+(.+)$/gm, "<li class=\"ml-4 mb-1 list-disc\">$1</li>")
        // Table header separator skip
        .replace(/^\|[-:\s|]+\|$/gm, "")
        // Table rows
        .replace(/^\|(.+)\|$/gm, (_, cells) => {
          const tds = cells.split("|").map(c =>
            `<td class="px-2 py-1 border border-border text-xs">${c.trim()}</td>`
          ).join("");
          return `<tr>${tds}</tr>`;
        })
        // Wrap consecutive <tr> in <table>
        .replace(/(<tr>.*?<\/tr>\n?)+/gs, match =>
          `<div class="overflow-x-auto my-3"><table class="w-full border-collapse border border-border rounded-lg text-xs">${match}</table></div>`
        )
        // Wrap consecutive <li> in <ul>
        .replace(/(<li[^>]*>.*?<\/li>\n?)+/gs, match =>
          `<ul class="my-2 space-y-0.5">${match}</ul>`
        )
        // Blank lines → paragraph breaks
        .replace(/\n\n+/g, "<br/><br/>")
        // Single newlines
        .replace(/\n/g, "<br/>");
    }

    function PlannerPage() {
      const [generating, setGenerating] = _react.useState(false);
      const [generated, setGenerated] = _react.useState(false);
      const [subjectList, setSubjectList] = _react.useState(() => {
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("nw_subjects");
          if (stored) return JSON.parse(stored);
        }
        return _mockdata.subjects;
      });
      _react.useEffect(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem("nw_subjects", JSON.stringify(subjectList));
        }
      }, [subjectList]);
      const [showAddSubject, setShowAddSubject] = _react.useState(false);
      const [editingSubject, setEditingSubject] = _react.useState(null);
      const [selectedDay, setSelectedDay] = _react.useState("Sat 12");
      const [aiPlanText, setAiPlanText] = _react.useState("");
      const [newSubject, setNewSubject] = _react.useState({
        name: "",
        hours: 0,
        mastery: 50,
        nextTopic: "",
        color: "var(--chart-1)",
        status: "preparation",
        examDate: ""
      });

      const getDaysUntil = _react.useCallback((dateStr) => {
        if (!dateStr) return null;
        const exam = new Date(dateStr);
        const today = new Date("2026-07-11");
        exam.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        const diffTime = exam - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      }, []);

      const getClosestExamInfo = _react.useCallback(() => {
        const exams = subjectList
          .filter((s) => s.status === "exam" && s.examDate)
          .map((s) => ({
            name: s.name,
            daysLeft: getDaysUntil(s.examDate)
          }))
          .filter((e) => e.daysLeft >= 0)
          .sort((a, b) => a.daysLeft - b.daysLeft);
        if (exams.length > 0) {
          return `${exams[0].name} exam in ${exams[0].daysLeft} days`;
        }
        return "No upcoming exams";
      }, [subjectList, getDaysUntil]);

      const getWeight = _react.useCallback((subject) => {
        const status = subject.status || "preparation";
        if (status === "exam") {
          const daysLeft = getDaysUntil(subject.examDate);
          if (daysLeft !== null && daysLeft >= 0) {
            return 6 + Math.max(0, (30 - daysLeft) * 0.5);
          }
          return 6;
        }
        if (status === "revision") return 3.5;
        return 1.5;
      }, [getDaysUntil]);

      const dynamicCalendar = _react.useMemo(() => {
        if (!subjectList || subjectList.length === 0) return {};
        // Sort by priority weight descending: exam > revision > preparation
        const sorted = [...subjectList].sort((a, b) => getWeight(b) - getWeight(a));
        const blocks = {};
        const times = ["06:45", "14:30", "17:00", "20:15"];
        const sessionTypes = ["focus", "revision", "drills", "flashcards", "practice", "mock test"];
        
        weekDays.forEach((day, dayIndex) => {
          blocks[day] = [];
          const numSessions = (dayIndex % 2 === 0) ? 2 : 3;
          for (let i = 0; i < numSessions; i++) {
            const subject = sorted[(dayIndex * 2 + i) % sorted.length];
            if (!subject) continue;
            const type = sessionTypes[(dayIndex + i) % sessionTypes.length];
            const modeLabel = subject.status === "exam" ? "Exam" : subject.status === "revision" ? "Rev" : "Prep";
            blocks[day].push({
              time: times[i % times.length],
              title: `${subject.name} [${modeLabel}] \u2014 ${subject.nextTopic || type}`,
              color: subject.color
            });
          }
        });
        return blocks;
      }, [subjectList, getWeight]);

      const dynamicTodayPlan = _react.useMemo(() => {
        const blocks = dynamicCalendar[selectedDay] || [];
        return blocks.map((b, idx) => ({
          id: `t_${selectedDay}_${idx}`,
          time: b.time,
          title: b.title,
          duration: idx % 2 === 0 ? "50 min" : "30 min",
          type: idx % 3 === 0 ? "Deep focus" : idx % 3 === 1 ? "Practice" : "Spaced repetition",
          done: false,
          color: b.color
        }));
      }, [dynamicCalendar, selectedDay]);

      const generatePlan = /* @__PURE__ */ __name(async () => {
        setGenerating(true);
        try {
          const subjectGoals = subjectList
            .map((s) => `${s.name} (Mastery: ${s.mastery}%, Exam: ${s.examDate || "No exam"})`)
            .join(", ");
          const closestExam = subjectList
            .filter((s) => s.examDate)
            .sort((a, b) => new Date(a.examDate) - new Date(b.examDate))[0];
          const examDateParam = closestExam ? closestExam.examDate : "2026-07-28";
          const res = await _api.aiApi.generatePlan({ goals: subjectGoals || "All subjects", examDate: examDateParam });
          if (res && res.plan) {
            setAiPlanText(res.plan);
          }
        } catch (e) {
          console.error(e);
        }
        setGenerating(false);
        setGenerated(true);
        setTimeout(() => setGenerated(false), 5000);
      }, "generatePlan");

      const handleAddSubject = /* @__PURE__ */ __name(() => {
        if (!newSubject.name.trim()) return;
        const examDateVal = newSubject.status === "exam" ? newSubject.examDate : "";
        if (editingSubject) {
          setSubjectList(subjectList.map((s) => s.id === editingSubject ? {
            ...s,
            name: newSubject.name.trim(),
            hours: Number(newSubject.hours),
            mastery: Number(newSubject.mastery),
            nextTopic: newSubject.nextTopic.trim() || "Overview",
            color: newSubject.color,
            status: newSubject.status,
            examDate: examDateVal
          } : s));
          setEditingSubject(null);
        } else {
          const subject = {
            id: `s_${Date.now()}`,
            name: newSubject.name.trim(),
            hours: Number(newSubject.hours),
            mastery: Number(newSubject.mastery),
            nextTopic: newSubject.nextTopic.trim() || "Overview",
            color: newSubject.color,
            status: newSubject.status,
            examDate: examDateVal
          };
          setSubjectList([...subjectList, subject]);
        }
        setShowAddSubject(false);
        setNewSubject({ name: "", hours: 0, mastery: 50, nextTopic: "", color: "var(--chart-1)", status: "preparation", examDate: "" });
      }, "handleAddSubject");

      const handleEditClick = /* @__PURE__ */ __name((subject) => {
        setNewSubject({
          name: subject.name,
          hours: subject.hours,
          mastery: subject.mastery,
          nextTopic: subject.nextTopic,
          color: subject.color,
          status: subject.status || "preparation",
          examDate: subject.examDate || ""
        });
        setEditingSubject(subject.id);
        setShowAddSubject(true);
      }, "handleEditClick");

      const handleDeleteSubject = /* @__PURE__ */ __name((id) => {
        setSubjectList(subjectList.filter((s) => s.id !== id));
      }, "handleDeleteSubject");

      const handleCloseModal = /* @__PURE__ */ __name(() => {
        setShowAddSubject(false);
        setEditingSubject(null);
        setNewSubject({ name: "", hours: 0, mastery: 50, nextTopic: "", color: "var(--chart-1)", status: "preparation", examDate: "" });
      }, "handleCloseModal");

      return _jsxdevruntime.jsxDEV("div", { children: [
        _jsxdevruntime.jsxDEV.call(
          void 0,
          _kit.PageHeader,
          {
            title: "Study Planner",
            subtitle: "AI schedule \xB7 pomodoro \xB7 spaced repetition \xB7 exam countdown",
            actions: _jsxdevruntime.jsxDEV("button", {
              onClick: generatePlan,
              disabled: generating,
              className: "btn-gradient inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-80",
              children: generating ? _jsxdevruntime.jsxDEV(_jsxdevruntime.Fragment, { children: ["Planning ", _jsxdevruntime.jsxDEV(_kit.ThinkingDots, {}, void 0, false)] }, void 0, true) : _jsxdevruntime.jsxDEV(_jsxdevruntime.Fragment, { children: [_jsxdevruntime.jsxDEV(_lucidereact.Sparkles, { className: "h-4 w-4" }, void 0, false), " Regenerate AI plan"] }, void 0, true)
            }, void 0, false)
          },
          void 0,
          false,
          this
        ),
        _jsxdevruntime.jsxDEV(_framermotion.AnimatePresence, {
          children: generated && _jsxdevruntime.jsxDEV(_framermotion.motion.div, {
            initial: { opacity: 0, y: -10 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0 },
            className: "mb-5 rounded-xl bg-emerald-soft px-4 py-3 text-sm font-medium text-emerald-brand",
            children: "\u2728 Gemini rebuilt your week around your focus window and the closest exam. Scroll down to view the custom study guide!"
          }, void 0, false)
        }, void 0, false),
        aiPlanText && _jsxdevruntime.jsxDEV(
          _framermotion.motion.div,
          {
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: "auto" },
            className: "mb-6 card-surface p-5 border border-primary/20 bg-primary-soft/10",
            children: [
              _jsxdevruntime.jsxDEV("div", { className: "flex items-center justify-between mb-3 border-b border-border pb-2", children: [
                _jsxdevruntime.jsxDEV("h3", { className: "font-display text-sm font-bold text-primary flex items-center gap-1.5", children: [
                  _jsxdevruntime.jsxDEV(_lucidereact.Sparkles, { className: "h-4 w-4 text-primary animate-pulse" }, void 0, false),
                  " Custom AI Study Strategy"
                ] }, void 0, true),
                _jsxdevruntime.jsxDEV("button", { onClick: () => setAiPlanText(""), className: "text-xs text-muted-foreground hover:text-foreground", children: "Clear plan" }, void 0, false)
              ] }, void 0, true),
              _jsxdevruntime.jsxDEV("div", { className: "text-xs text-foreground leading-relaxed max-w-none space-y-1", dangerouslySetInnerHTML: { __html: renderMarkdown(aiPlanText) } }, void 0, false)
            ]
          },
          void 0,
          true,
          this
        ),
        _jsxdevruntime.jsxDEV(_framermotion.motion.div, { variants: _kit.staggerContainer, initial: "hidden", animate: "visible", className: "grid gap-6 xl:grid-cols-3", children: [
          /* Calendar */
          _jsxdevruntime.jsxDEV(_framermotion.motion.div, { variants: _kit.fadeUp, className: "card-surface p-6 xl:col-span-2", children: [
            _jsxdevruntime.jsxDEV("div", { className: "flex items-center justify-between", children: [
              _jsxdevruntime.jsxDEV("h2", { className: "flex items-center gap-2 font-display text-lg font-semibold", children: [_jsxdevruntime.jsxDEV(_lucidereact.CalendarDays, { className: "h-5 w-5 text-primary" }, void 0, false), " This week"] }, void 0, true),
              _jsxdevruntime.jsxDEV("span", { className: "chip bg-amber-soft text-amber-brand", children: [_jsxdevruntime.jsxDEV(_lucidereact.GraduationCap, { className: "h-3.5 w-3.5" }, void 0, false), ` ${getClosestExamInfo()}`] }, void 0, true)
            ] }, void 0, true),
            _jsxdevruntime.jsxDEV("div", {
              className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7",
              children: weekDays.map((d) => _jsxdevruntime.jsxDEV("div", { onClick: () => setSelectedDay(d), className: _utils.cn("min-h-32 rounded-xl border border-border p-2 cursor-pointer transition-all hover:border-primary/60", d === selectedDay ? "border-primary bg-primary-soft/40 shadow-sm scale-[1.02]" : "hover:scale-[1.01]"), children: [
                _jsxdevruntime.jsxDEV("p", { className: _utils.cn("mb-2 text-center text-xs font-bold", d === selectedDay ? "text-primary font-bold" : "text-muted-foreground"), children: d }, void 0, false),
                _jsxdevruntime.jsxDEV("div", {
                  className: "space-y-1.5",
                  children: _nullishCoalesce(dynamicCalendar[d], () => []).map((b) => _jsxdevruntime.jsxDEV("div", { className: "rounded-lg px-2 py-1.5 text-[10px] font-semibold leading-tight border-l-2", style: { background: `color-mix(in srgb, ${b.color} 10%, transparent)`, color: b.color, borderLeftColor: b.color }, children: [
                    b.time,
                    " \xB7 ",
                    b.title
                  ] }, b.title, true))
                }, void 0, false)
              ] }, d, true))
            }, void 0, false)
          ] }, void 0, true),
          _jsxdevruntime.jsxDEV(PomodoroCard, {}, void 0, false),
          _jsxdevruntime.jsxDEV(_framermotion.motion.div, { variants: _kit.fadeUp, className: "card-surface p-6 xl:col-span-2", children: [
            _jsxdevruntime.jsxDEV("div", { className: "flex items-center justify-between", children: [
              _jsxdevruntime.jsxDEV("h2", { className: "flex items-center gap-2 font-display text-lg font-semibold", children: [_jsxdevruntime.jsxDEV(_lucidereact.BookOpen, { className: "h-5 w-5 text-primary" }, void 0, false), " Subjects"] }, void 0, true),
              _jsxdevruntime.jsxDEV("button", { onClick: () => setShowAddSubject(true), className: "flex items-center gap-1 text-sm font-medium text-primary hover:underline", children: [_jsxdevruntime.jsxDEV(_lucidereact.Plus, { className: "h-3.5 w-3.5" }, void 0, false), " Add subject"] }, void 0, true)
            ] }, void 0, true),
            _jsxdevruntime.jsxDEV("div", {
              className: "mt-4 grid gap-4 sm:grid-cols-2",
              children: subjectList.map((s) => _jsxdevruntime.jsxDEV("div", { className: "rounded-xl border border-border p-4 transition-shadow hover:shadow-soft relative group", children: [
                _jsxdevruntime.jsxDEV("div", { className: "flex items-center justify-between", children: [
                  _jsxdevruntime.jsxDEV("p", { className: "font-display text-sm font-semibold", children: s.name }, void 0, false),
                  _jsxdevruntime.jsxDEV("div", { className: "flex items-center gap-1.5", children: [
                    _jsxdevruntime.jsxDEV("span", { className: "text-xs font-bold text-muted-foreground", children: [s.hours, "h"] }, void 0, true),
                    _jsxdevruntime.jsxDEV("button", { onClick: () => handleEditClick(s), "aria-label": "Edit subject", className: "p-1 rounded text-muted-foreground hover:text-primary hover:bg-muted transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100", children: _jsxdevruntime.jsxDEV(_lucidereact.Pencil, { className: "h-3.5 w-3.5" }, void 0, false) }, void 0, false),
                    _jsxdevruntime.jsxDEV("button", { onClick: () => handleDeleteSubject(s.id), "aria-label": "Delete subject", className: "p-1 rounded text-muted-foreground hover:text-red-500 hover:bg-muted transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100", children: _jsxdevruntime.jsxDEV(_lucidereact.Trash2, { className: "h-3.5 w-3.5" }, void 0, false) }, void 0, false)
                  ] }, void 0, true)
                ] }, void 0, true),
                _jsxdevruntime.jsxDEV("div", {
                  className: "mt-3 h-2 overflow-hidden rounded-full bg-muted",
                  children: _jsxdevruntime.jsxDEV.call(
                    void 0,
                    _framermotion.motion.div,
                    {
                      className: "h-full rounded-full",
                      style: { background: s.color },
                      initial: { width: 0 },
                      whileInView: { width: `${s.mastery}%` },
                      viewport: { once: true },
                      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
                    },
                    void 0,
                    false,
                    this
                  )
                }, void 0, false),
                _jsxdevruntime.jsxDEV("div", { className: "mt-2 flex flex-col gap-0.5", children: [
                  _jsxdevruntime.jsxDEV("p", { className: "text-xs text-muted-foreground font-medium", children: ["Mastery ", s.mastery, "% \u22C5 next: ", s.nextTopic] }, void 0, false),
                  s.examDate && _jsxdevruntime.jsxDEV("p", { className: "text-[11px] font-semibold text-amber-brand flex items-center gap-1", children: [
                    _jsxdevruntime.jsxDEV(_lucidereact.GraduationCap, { className: "h-3 w-3" }, void 0, false),
                    ` Exam: ${s.examDate} (${getDaysUntil(s.examDate)}d left)`
                  ] }, void 0, false)
                ] }, void 0, true)
              ] }, s.id, true))
            }, void 0, false)
          ] }, void 0, true),
          _jsxdevruntime.jsxDEV(_framermotion.AnimatePresence, {
            children: showAddSubject && _jsxdevruntime.jsxDEV("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4", children: _jsxdevruntime.jsxDEV(_framermotion.motion.div, {
              initial: { opacity: 0, scale: 0.95 },
              animate: { opacity: 1, scale: 1 },
              exit: { opacity: 0, scale: 0.95 },
              className: "card-surface w-full max-w-md p-6 shadow-lift border border-border",
              children: [
                _jsxdevruntime.jsxDEV("h3", { className: "font-display text-lg font-bold mb-4", children: editingSubject ? "Edit Subject" : "Add New Subject" }, void 0, false),
                _jsxdevruntime.jsxDEV("div", { className: "space-y-4", children: [
                  _jsxdevruntime.jsxDEV("div", { children: [
                    _jsxdevruntime.jsxDEV("label", { className: "text-xs font-semibold text-muted-foreground", children: "Subject Name" }, void 0, false),
                    _jsxdevruntime.jsxDEV("input", { type: "text", placeholder: "e.g. Computer Networks", className: "mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-ring/15", value: newSubject.name, onChange: (e) => setNewSubject({ ...newSubject, name: e.target.value }) }, void 0, false)
                  ] }, void 0, true),
                  _jsxdevruntime.jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [
                    _jsxdevruntime.jsxDEV("div", { children: [
                      _jsxdevruntime.jsxDEV("label", { className: "text-xs font-semibold text-muted-foreground", children: "Hours Studied" }, void 0, false),
                      _jsxdevruntime.jsxDEV("input", { type: "number", step: "0.1", placeholder: "e.g. 10", className: "mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-ring/15", value: newSubject.hours || "", onChange: (e) => setNewSubject({ ...newSubject, hours: parseFloat(e.target.value) || 0 }) }, void 0, false)
                    ] }, void 0, true),
                    _jsxdevruntime.jsxDEV("div", { children: [
                      _jsxdevruntime.jsxDEV("label", { className: "text-xs font-semibold text-muted-foreground", children: "Mastery (%)" }, void 0, false),
                      _jsxdevruntime.jsxDEV("input", { type: "number", min: "0", max: 100, placeholder: "e.g. 50", className: "mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-ring/15", value: newSubject.mastery, onChange: (e) => setNewSubject({ ...newSubject, mastery: parseInt(e.target.value) || 0 }) }, void 0, false)
                    ] }, void 0, true)
                  ] }, void 0, true),
                  _jsxdevruntime.jsxDEV("div", { children: [
                    _jsxdevruntime.jsxDEV("label", { className: "text-xs font-semibold text-muted-foreground", children: "Next Topic" }, void 0, false),
                    _jsxdevruntime.jsxDEV("input", { type: "text", placeholder: "e.g. IP Routing", className: "mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-ring/15", value: newSubject.nextTopic, onChange: (e) => setNewSubject({ ...newSubject, nextTopic: e.target.value }) }, void 0, false)
                  ] }, void 0, true),
                  _jsxdevruntime.jsxDEV("div", { children: [
                    _jsxdevruntime.jsxDEV("label", { className: "text-xs font-semibold text-muted-foreground", children: "Study Mode" }, void 0, false),
                    _jsxdevruntime.jsxDEV("div", { className: "flex rounded-xl bg-muted p-1 mt-1 border border-border", children: ["preparation", "revision", "exam"].map((mode) => _jsxdevruntime.jsxDEV("button", { type: "button", onClick: () => setNewSubject({ ...newSubject, status: mode }), className: _utils.cn("flex-1 text-center py-2 text-xs font-semibold rounded-lg capitalize transition-all", newSubject.status === mode ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"), children: mode }, mode, false)) })
                  ] }, void 0, true),
                  newSubject.status === "exam" && _jsxdevruntime.jsxDEV("div", { children: [
                    _jsxdevruntime.jsxDEV("label", { className: "text-xs font-semibold text-muted-foreground", children: "Exam Date" }, void 0, false),
                    _jsxdevruntime.jsxDEV("input", { type: "date", className: "mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-ring/15", value: newSubject.examDate || "", onChange: (e) => setNewSubject({ ...newSubject, examDate: e.target.value }) }, void 0, false)
                  ] }, void 0, true),
                  _jsxdevruntime.jsxDEV("div", { children: [
                    _jsxdevruntime.jsxDEV("label", { className: "text-xs font-semibold text-muted-foreground font-display", children: "Color Theme" }, void 0, false),
                    _jsxdevruntime.jsxDEV("div", { className: "flex gap-2.5 mt-2", children: ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"].map((c) => _jsxdevruntime.jsxDEV("button", { type: "button", className: _utils.cn("h-6 w-6 rounded-full border-2 transition-all", newSubject.color === c ? "border-primary scale-110" : "border-transparent"), style: { background: c }, onClick: () => setNewSubject({ ...newSubject, color: c }) }, c, false)) })
                  ] }, void 0, true)
                ] }, void 0, true),
                _jsxdevruntime.jsxDEV("div", { className: "flex justify-end gap-3 mt-6", children: [
                  _jsxdevruntime.jsxDEV("button", { className: "px-4 py-2.5 text-sm font-semibold rounded-xl card-surface hover:bg-muted", onClick: handleCloseModal, children: "Cancel" }, void 0, false),
                  _jsxdevruntime.jsxDEV("button", { className: "btn-gradient px-4 py-2.5 text-sm font-semibold rounded-xl", onClick: handleAddSubject, children: editingSubject ? "Save Changes" : "Add Subject" }, void 0, false)
                ] }, void 0, true)
              ]
            }, void 0, true) }, void 0, false)
          }, void 0, false),
          _jsxdevruntime.jsxDEV(_framermotion.motion.div, { variants: _kit.fadeUp, className: "space-y-6", children: [
            _jsxdevruntime.jsxDEV("div", { className: "card-surface p-6", children: [
              _jsxdevruntime.jsxDEV("h2", { className: "flex items-center gap-2 font-display text-lg font-semibold", children: [_jsxdevruntime.jsxDEV(_lucidereact.Target, { className: "h-5 w-5 text-primary" }, void 0, false), " Goals"] }, void 0, true),
              _jsxdevruntime.jsxDEV("div", {
                className: "mt-4 space-y-3",
                children: [
                  { label: "Daily: 3 focus sessions", pct: 66, tone: "var(--chart-1)" },
                  { label: "Weekly: 20 study hours", pct: 82, tone: "var(--chart-2)" },
                  { label: "Spaced reps due today: 34", pct: 45, tone: "var(--chart-3)" }
                ].map((g) => _jsxdevruntime.jsxDEV("div", { children: [
                  _jsxdevruntime.jsxDEV("div", { className: "flex justify-between text-xs font-medium", children: [
                    _jsxdevruntime.jsxDEV("span", { children: g.label }, void 0, false),
                    _jsxdevruntime.jsxDEV("span", { className: "text-muted-foreground", children: [g.pct, "%"] }, void 0, true)
                  ] }, void 0, true),
                  _jsxdevruntime.jsxDEV("div", {
                    className: "mt-1.5 h-2 overflow-hidden rounded-full bg-muted",
                    children: _jsxdevruntime.jsxDEV(_framermotion.motion.div, { className: "h-full rounded-full", style: { background: g.tone }, initial: { width: 0 }, animate: { width: `${g.pct}%` }, transition: { duration: 1, delay: 0.3 } }, void 0, false)
                  }, void 0, false)
                ] }, g.label, true))
              }, void 0, false)
            ] }, void 0, true),
            _jsxdevruntime.jsxDEV("div", { className: "card-surface p-6", children: [
              _jsxdevruntime.jsxDEV("h2", { className: "font-display text-lg font-semibold", children: "Recent sessions" }, void 0, false),
              _jsxdevruntime.jsxDEV("div", {
                className: "mt-3 space-y-2.5",
                children: _mockdata.sessionHistory.slice(0, 4).map((h) => _jsxdevruntime.jsxDEV("div", { className: "flex items-center justify-between text-sm", children: [
                  _jsxdevruntime.jsxDEV("div", { className: "min-w-0", children: [
                    _jsxdevruntime.jsxDEV("p", { className: "truncate font-medium", children: h.subject }, void 0, false),
                    _jsxdevruntime.jsxDEV("p", { className: "text-xs text-muted-foreground", children: [h.date, " \xB7 ", h.duration, " \xB7 ", h.pomodoros, " pomodoros"] }, void 0, true)
                  ] }, void 0, true),
                  _jsxdevruntime.jsxDEV("span", { className: _utils.cn("chip shrink-0", h.focus >= 85 ? "bg-emerald-soft text-emerald-brand" : "bg-amber-soft text-amber-brand"), children: h.focus }, void 0, false)
                ] }, h.id, true))
              }, void 0, false)
            ] }, void 0, true)
          ] }, void 0, true)
        ] }, void 0, true),
        _jsxdevruntime.jsxDEV(_framermotion.motion.div, { variants: _kit.fadeUp, initial: "hidden", animate: "visible", className: "card-surface mt-6 p-6", children: [
          _jsxdevruntime.jsxDEV("h2", { className: "font-display text-lg font-semibold", children: ["AI Study Plan for ", selectedDay] }, void 0, true),
          _jsxdevruntime.jsxDEV("div", {
            className: "mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3",
            children: dynamicTodayPlan.map((t) => _jsxdevruntime.jsxDEV("div", { className: "rounded-xl border border-border p-4 transition-all hover:shadow-sm", style: { borderLeft: `4px solid ${t.color}` }, children: [
              _jsxdevruntime.jsxDEV("div", { className: "flex items-center justify-between", children: [
                _jsxdevruntime.jsxDEV("span", { className: "font-display text-sm font-bold text-primary", children: t.time }, void 0, false),
                _jsxdevruntime.jsxDEV("span", { className: "chip bg-muted text-muted-foreground", children: t.duration }, void 0, false)
              ] }, void 0, true),
              _jsxdevruntime.jsxDEV("p", { className: "mt-2 text-sm font-medium text-foreground", children: t.title }, void 0, false),
              _jsxdevruntime.jsxDEV("p", { className: "mt-1 text-xs text-muted-foreground", children: t.type }, void 0, false)
            ] }, t.id, true))
          }, void 0, false)
        ] }, void 0, true)
      ] }, void 0, true);
    }

    function PomodoroCard() {
      const [durationMinutes, setDurationMinutes] = _react.useState(25);
      const [left, setLeft] = _react.useState(25 * 60);
      const [running, setRunning] = _react.useState(false);

      _react.useEffect(() => {
        if (!running) {
          setLeft(durationMinutes * 60);
        }
      }, [durationMinutes, running]);

      _react.useEffect(() => {
        if (!running) return;
        const id = setInterval(() => setLeft((s) => s > 0 ? s - 1 : 0), 1e3);
        return () => clearInterval(id);
      }, [running]);

      const TOTAL = durationMinutes * 60;
      const mins = String(Math.floor(left / 60)).padStart(2, "0");
      const secs = String(left % 60).padStart(2, "0");
      const pct = TOTAL > 0 ? 1 - left / TOTAL : 0;
      const r = 70;
      const c = 2 * Math.PI * r;
      return _jsxdevruntime.jsxDEV(_framermotion.motion.div, { variants: _kit.fadeUp, className: "card-surface flex flex-col items-center p-6", children: [
        _jsxdevruntime.jsxDEV("h2", { className: "font-display text-lg font-semibold", children: "Focus timer" }, void 0, false),
        _jsxdevruntime.jsxDEV("p", { className: "text-xs text-muted-foreground", children: "Pomodoro · adaptive breaks enabled" }, void 0, false),
        
        // Editable minutes controls when not running
        !running && _jsxdevruntime.jsxDEV("div", { className: "mt-3 flex items-center gap-2", children: [
          _jsxdevruntime.jsxDEV("button", {
            onClick: () => setDurationMinutes(m => Math.max(1, m - 5)),
            className: "h-7 w-8 rounded-lg bg-muted hover:bg-muted/80 text-xs font-bold flex items-center justify-center",
            children: "-5"
          }, void 0, false),
          _jsxdevruntime.jsxDEV("input", {
            type: "number",
            min: 1,
            max: 180,
            value: durationMinutes,
            onChange: (e) => setDurationMinutes(Math.max(1, parseInt(e.target.value) || 25)),
            className: "w-12 text-center bg-transparent border-b border-border font-bold text-sm outline-none"
          }, void 0, false),
          _jsxdevruntime.jsxDEV("span", { className: "text-xs text-muted-foreground", children: "min" }, void 0, false),
          _jsxdevruntime.jsxDEV("button", {
            onClick: () => setDurationMinutes(m => Math.min(180, m + 5)),
            className: "h-7 w-8 rounded-lg bg-muted hover:bg-muted/80 text-xs font-bold flex items-center justify-center",
            children: "+5"
          }, void 0, false)
        ] }, void 0, true),

        _jsxdevruntime.jsxDEV("div", { className: "relative mt-5 grid place-items-center", children: [
          _jsxdevruntime.jsxDEV("svg", { width: 170, height: 170, className: "-rotate-90", children: [
            _jsxdevruntime.jsxDEV("circle", { cx: 85, cy: 85, r, fill: "none", strokeWidth: 10, className: "stroke-muted" }, void 0, false),
            _jsxdevruntime.jsxDEV.call(
              void 0,
              "circle",
              {
                cx: 85,
                cy: 85,
                r,
                fill: "none",
                strokeWidth: 10,
                strokeLinecap: "round",
                stroke: "var(--primary)",
                strokeDasharray: c,
                strokeDashoffset: c * (1 - pct),
                style: { transition: "stroke-dashoffset 1s linear" }
              },
              void 0,
              false,
              this
            )
          ] }, void 0, true),
          _jsxdevruntime.jsxDEV("p", { className: "absolute font-display text-4xl font-bold", children: [mins, ":", secs] }, void 0, true)
        ] }, void 0, true),
        _jsxdevruntime.jsxDEV("div", { className: "mt-5 flex gap-3", children: [
          _jsxdevruntime.jsxDEV("button", {
            onClick: () => setRunning((v) => !v),
            className: "btn-gradient grid h-12 w-12 place-items-center rounded-2xl",
            "aria-label": running ? "Pause" : "Start",
            children: running ? _jsxdevruntime.jsxDEV(_lucidereact.Pause, { className: "h-5 w-5" }, void 0, false) : _jsxdevruntime.jsxDEV(_lucidereact.Play, { className: "h-5 w-5" }, void 0, false)
          }, void 0, false),
          _jsxdevruntime.jsxDEV("button", {
            onClick: () => {
              setRunning(false);
              setLeft(durationMinutes * 60);
            },
            className: "card-surface grid h-12 w-12 place-items-center rounded-2xl text-muted-foreground",
            "aria-label": "Reset",
            children: _jsxdevruntime.jsxDEV(_lucidereact.RotateCcw, { className: "h-5 w-5" }, void 0, false)
          }, void 0, false)
        ] }, void 0, true),
        _jsxdevruntime.jsxDEV("p", {
          className: "mt-4 rounded-xl bg-teal-soft px-3 py-2 text-center text-xs font-medium text-teal-brand",
          children: "AI suggests a 7-min break after this block — your focus dips at minute 27."
        }, void 0, false)
      ] }, void 0, true);
    }

export { Route };
