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
import * as _api from "@/services/api";
import * as _utils from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import { clientChatbot, clientGenerateQuiz, clientSummarizeNotes } from "@/lib/gemini-client";

function _nullishCoalesce(lhs, rhsFn) {
      if (lhs != null) {
        return lhs;
      } else {
        return rhsFn();
      }
    }

    function _optionalChain(ops) {
      let lastAccessLHS = void 0;
      let value = ops[0];
      let i = 1;
      while (i < ops.length) {
        const op = ops[i];
        const fn = ops[i + 1];
        i += 2;
        if ((op === "optionalAccess" || op === "optionalCall") && value == null) {
          return void 0;
        }
        if (op === "access" || op === "optionalAccess") {
          lastAccessLHS = value;
          value = fn(value);
        } else if (op === "call" || op === "optionalCall") {
          value = fn((...args) => value.call(lastAccessLHS, ...args));
          lastAccessLHS = void 0;
        }
      }
      return value;
    }

    const Route = _reactrouter.createFileRoute("/app/ai")({
      head: () => ({ meta: [{ title: "AI Tools \u2014 VediQ" }] }),
      component: AiToolsPage
    });
    
    const tabs = [
      { id: "chat", label: "AI Chatbot", icon: _lucidereact.MessageSquareText },
      { id: "summarize", label: "Notes Summarizer", icon: _lucidereact.FileText },
      { id: "quiz", label: "Quiz Generator", icon: _lucidereact.ListChecks },
      { id: "flashcards", label: "Flashcards", icon: _lucidereact.Layers }
    ];
    const extractTextFromFile = async (file) => {
      if (file.name.endsWith('.pdf')) {
        if (!window.pdfjsLib) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
            script.onload = () => {
              window.pdfjsLib = window["pdfjs-dist/build/pdf"];
              window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
              resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item) => item.str).join(" ");
          fullText += pageText + "\n";
        }
        return fullText;
      } else {
        return await file.text();
      }
    };

    function AiToolsPage() {
      const [tab, setTab] = _react.useState("chat");
      const [summaryContext, setSummaryContext] = _react.useState("");
      return _jsxdevruntime.jsxDEV("div", { children: [
        _jsxdevruntime.jsxDEV(_kit.PageHeader, { title: "AI Learning Tools", subtitle: "Powered by Google Gemini \xB7 chat, summarize, quiz, and drill" }, void 0, false),
        _jsxdevruntime.jsxDEV("div", {
          className: "mb-6 flex flex-wrap gap-2",
          children: tabs.map((t) => _jsxdevruntime.jsxDEV("button", {
            onClick: () => setTab(t.id),
            className: _utils.cn.call(
              void 0,
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
              tab === t.id ? "btn-gradient" : "card-surface text-muted-foreground hover:text-foreground"
            ),
            children: [
              _jsxdevruntime.jsxDEV(t.icon, { className: "h-4 w-4" }, void 0, false),
              " ",
              t.label
            ]
          }, t.id, true))
        }, void 0, false),
        _jsxdevruntime.jsxDEV(_framermotion.AnimatePresence, {
          mode: "wait",
          children: _jsxdevruntime.jsxDEV(_framermotion.motion.div, { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.25 }, children: [
            tab === "chat" && _jsxdevruntime.jsxDEV(Chatbot, {}, void 0, false),
            tab === "summarize" && _jsxdevruntime.jsxDEV(Summarizer, { onGenerateQuiz: (summary) => {
              setSummaryContext(summary);
              setTab("quiz");
            } }, void 0, false),
            tab === "quiz" && _jsxdevruntime.jsxDEV(QuizGen, { initialContext: summaryContext }, void 0, false),
            tab === "flashcards" && _jsxdevruntime.jsxDEV(Flashcards, {}, void 0, false)
          ] }, tab, true)
        }, void 0, false)
      ] }, void 0, true);
    }

    const cannedReplies = [
      "Great question! Gradient boosting builds trees sequentially \u2014 each new tree corrects the residual errors of the ensemble so far. Think of it as a team where every new member focuses on what the team currently gets wrong.",
      `Here's a quick mnemonic for page replacement: **LRU** = "Least Recently Used, Longest Rest Unwanted." Want me to generate 5 practice questions on this?`,
      "Based on your study history, you retain tree-based algorithms 23% better in morning sessions. I'd schedule this topic for tomorrow 07:00."
    ];

    function generateFallbackReply(msg) {
      const lower = (msg || "").toLowerCase();
      if (lower.includes("boosting") || lower.includes("gradient") || lower.includes("machine learning")) {
        return "Gradient Boosting is an ensemble learning algorithm that builds decision trees sequentially. Each new tree fits to the residual errors of prior trees, progressively minimizing total loss.";
      }
      if (lower.includes("tree") || lower.includes("rotation") || lower.includes("avl") || lower.includes("red-black")) {
        return "Tree rotations (Left/Right) rebalance Binary Search Trees during insertions or deletions to guarantee O(log n) time complexity for search, insert, and delete operations.";
      }
      if (lower.includes("pomodoro") || lower.includes("time") || lower.includes("schedule") || lower.includes("habit")) {
        return "The Pomodoro Technique structures your study into 25-minute deep focus sessions followed by 5-minute restorative breaks to sustain peak cognitive clarity.";
      }
      if (lower.includes("exam") || lower.includes("quiz") || lower.includes("prep") || lower.includes("revision")) {
        return "Active recall and spaced repetition are proven by cognitive science to double long-term memory retention compared to passive reading. Use VediQ flashcards and practice drills!";
      }
      if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey") || lower.includes("help")) {
        return "Hello! I am your VediQ AI Study Assistant. Ask me anything about your subjects, algorithms, active recall techniques, or study scheduling!";
      }
      return "That's a great study question! Active recall and structured focus intervals accelerate learning. Would you like me to quiz you on your subjects or build a custom revision plan?";
    }

    function Chatbot() {
      const currentUser = useCurrentUser();
      const firstName = (currentUser.name || "Student").split(" ")[0];
      const [messages, setMessages] = _react.useState([
        { role: "ai", text: `Hi ${firstName}! I've read your study notes. Want to review gradient boosting, or should I quiz you on your subjects?` }
      ]);
      const [input, setInput] = _react.useState("");
      const [thinking, setThinking] = _react.useState(false);
      const endRef = _react.useRef(null);
      _react.useEffect(() => {
        _optionalChain([endRef, "access", (_) => _.current, "optionalAccess", (_2) => _2.scrollIntoView, "call", (_3) => _3({ behavior: "smooth" })]);
      }, [messages, thinking]);
      const send = /* @__PURE__ */ __name(async () => {
        if (!input.trim() || thinking) return;
        const userMsg = input.trim();
        setMessages((m) => [...m, { role: "user", text: userMsg }]);
        setInput("");
        setThinking(true);
        try {
          // Use client-side Gemini engine — works both on localhost AND after deployment
          const res = await clientChatbot(userMsg, messages);
          if (res && res.reply) {
            setMessages((m) => [...m, { role: "ai", text: res.reply }]);
          } else {
            setMessages((m) => [...m, { role: "ai", text: "I'm sorry, I couldn't generate a response. Please try again." }]);
          }
        } catch (error) {
          console.error("Chatbot API error:", error);
          setMessages((m) => [...m, { role: "ai", text: "Ask me about your subjects, algorithms, ML concepts, or study strategies!" }]);
        } finally {
          setThinking(false);
        }
      }, "send");
      return _jsxdevruntime.jsxDEV("div", { className: "card-surface flex h-[32rem] flex-col overflow-hidden", children: [
        _jsxdevruntime.jsxDEV("div", { className: "flex items-center gap-2 border-b border-border px-5 py-3", children: [
          _jsxdevruntime.jsxDEV("span", { className: "grid h-8 w-8 place-items-center rounded-lg btn-gradient", children: _jsxdevruntime.jsxDEV(_lucidereact.Sparkles, { className: "h-4 w-4" }, void 0, false) }, void 0, false),
          _jsxdevruntime.jsxDEV("div", { children: [
            _jsxdevruntime.jsxDEV("p", { className: "text-sm font-semibold", children: "Study Assistant" }, void 0, false),
            _jsxdevruntime.jsxDEV("p", { className: "text-[11px] text-emerald-brand", children: "\u25CF Online \xB7 Gemini" }, void 0, false)
          ] }, void 0, true)
        ] }, void 0, true),
        _jsxdevruntime.jsxDEV("div", { className: "flex-1 space-y-3 overflow-y-auto p-5", children: [
          messages.map((m, i) => _jsxdevruntime.jsxDEV(_framermotion.motion.div, {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            className: _utils.cn("flex", m.role === "user" ? "justify-end" : "justify-start"),
            children: _jsxdevruntime.jsxDEV("div", {
              className: _utils.cn.call(
                void 0,
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                m.role === "user" ? "btn-gradient rounded-br-md" : "bg-muted rounded-bl-md"
              ),
              children: m.text
            }, void 0, false)
          }, i, false)),
          thinking && _jsxdevruntime.jsxDEV("div", {
            className: "flex justify-start",
            children: _jsxdevruntime.jsxDEV("div", { className: "rounded-2xl rounded-bl-md bg-muted px-4 py-3", children: _jsxdevruntime.jsxDEV(_kit.ThinkingDots, {}, void 0, false) }, void 0, false)
          }, void 0, false),
          _jsxdevruntime.jsxDEV("div", { ref: endRef }, void 0, false)
        ] }, void 0, true),
        _jsxdevruntime.jsxDEV("div", {
          className: "border-t border-border p-3",
          children: _jsxdevruntime.jsxDEV("div", { className: "flex gap-2", children: [
            _jsxdevruntime.jsxDEV.call(
              void 0,
              "input",
              {
                value: input,
                onChange: (e) => setInput(e.target.value),
                onKeyDown: (e) => e.key === "Enter" && send(),
                placeholder: "Ask anything about your subjects\u2026",
                className: "flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-ring/15"
              },
              void 0,
              false,
              this
            ),
            _jsxdevruntime.jsxDEV("button", {
              onClick: send,
              className: "btn-gradient grid h-11 w-11 shrink-0 place-items-center rounded-xl",
              "aria-label": "Send",
              children: _jsxdevruntime.jsxDEV(_lucidereact.Send, { className: "h-4 w-4" }, void 0, false)
            }, void 0, false)
          ] }, void 0, true)
        }, void 0, false)
      ] }, void 0, true);
    }

    function Summarizer({ onGenerateQuiz }) {
      const [state, setState] = _react.useState("idle");
      const [fileName, setFileName] = _react.useState("");
      const [summaryText, setSummaryText] = _react.useState("");
      const run = async (file) => {
        setFileName(file.name);
        setState("loading");
        try {
          const fileText = await extractTextFromFile(file);
          // Call client API first, fall back to backend API if needed
          let res;
          try {
            res = await clientSummarizeNotes({ text: fileText, fileName: file.name });
          } catch (e) {
            res = await _api.aiApi.summarizeNotes({ text: fileText, fileName: file.name });
          }
          if (res && res.summary) {
            setSummaryText(res.summary);
          } else {
            setSummaryText("No summary could be generated.");
          }
        } catch (error) {
          console.error("Summarizer error:", error);
          setSummaryText("Failed to generate summary. Please check your connection to the server.");
        } finally {
          setState("done");
        }
      };
      return _jsxdevruntime.jsxDEV("div", { className: "grid gap-6 lg:grid-cols-2", children: [
        _jsxdevruntime.jsxDEV("div", {
          children: _jsxdevruntime.jsxDEV("label", {
            className: "card-surface flex h-64 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-primary/30 transition-colors hover:border-primary/60 hover:bg-primary-soft/30",
            onDragOver: (e) => e.preventDefault(),
            onDrop: /* @__PURE__ */ __name((e) => {
              e.preventDefault();
              const file = _optionalChain([e, "access", (_4) => _4.dataTransfer, "access", (_5) => _5.files, "access", (_6) => _6[0]]);
              if (file) run(file);
            }, "onDrop"),
            children: [
              _jsxdevruntime.jsxDEV("input", { type: "file", accept: ".pdf,.txt,.md", className: "hidden", onChange: /* @__PURE__ */ __name((e) => {
                const file = _optionalChain([e, "access", (_8) => _8.target, "access", (_9) => _9.files, "optionalAccess", (_10) => _10[0]]);
                if (file) run(file);
              }, "onChange") }, void 0, false),
              _jsxdevruntime.jsxDEV("span", { className: "grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary", children: _jsxdevruntime.jsxDEV(_lucidereact.Upload, { className: "h-6 w-6" }, void 0, false) }, void 0, false),
              _jsxdevruntime.jsxDEV("p", { className: "mt-4 font-display font-semibold", children: "Drop your PDF or notes here" }, void 0, false),
              _jsxdevruntime.jsxDEV("p", { className: "mt-1 text-sm text-muted-foreground", children: "or click to browse \xB7 PDF, TXT, MD up to 20MB" }, void 0, false)
            ]
          }, void 0, true)
        }, void 0, false),
        _jsxdevruntime.jsxDEV("div", { className: "card-surface p-6", children: [
          state === "idle" && _jsxdevruntime.jsxDEV("div", { className: "flex h-full flex-col items-center justify-center text-center", children: [
            _jsxdevruntime.jsxDEV(_lucidereact.FileText, { className: "h-10 w-10 text-muted-foreground/40" }, void 0, false),
            _jsxdevruntime.jsxDEV("p", { className: "mt-3 text-sm text-muted-foreground", children: "Your AI summary will appear here." }, void 0, false)
          ] }, void 0, true),
          state === "loading" && _jsxdevruntime.jsxDEV("div", { className: "flex h-full flex-col items-center justify-center gap-3", children: [
            _jsxdevruntime.jsxDEV(_kit.ThinkingDots, {}, void 0, false),
            _jsxdevruntime.jsxDEV("p", { className: "text-sm text-muted-foreground", children: ["Gemini is reading ", fileName, "\u2026"] }, void 0, true),
            _jsxdevruntime.jsxDEV("div", {
              className: "w-full max-w-xs space-y-2",
              children: [80, 60, 90].map((w, i) => _jsxdevruntime.jsxDEV("div", { className: "h-3 animate-pulse rounded-full bg-muted", style: { width: `${w}%` } }, i, false))
            }, void 0, false)
          ] }, void 0, true),
          state === "done" && _jsxdevruntime.jsxDEV(_framermotion.motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, children: [
            _jsxdevruntime.jsxDEV("span", { className: "chip bg-emerald-soft text-emerald-brand", children: ["Summary ready \xB7 ", fileName] }, void 0, true),
            _jsxdevruntime.jsxDEV("h3", { className: "mt-3 font-display text-lg font-semibold", children: "AI Summary" }, void 0, false),
            _jsxdevruntime.jsxDEV("div", { className: "mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap", children: summaryText }, void 0, false),
            _jsxdevruntime.jsxDEV("button", { onClick: () => onGenerateQuiz && onGenerateQuiz(summaryText), className: "btn-gradient mt-5 rounded-xl px-4 py-2.5 text-sm font-semibold", children: "Generate quiz from this \u2192" }, void 0, false)
          ] }, void 0, true)
        ] }, void 0, true)
      ] }, void 0, true);
    }

    function QuizGen({ initialContext }) {
      const [started, setStarted] = _react.useState(false);
      const [loading, setLoading] = _react.useState(false);
      const [questions, setQuestions] = _react.useState([]);
      const [answers, setAnswers] = _react.useState({});
      const [submitted, setSubmitted] = _react.useState(false);
      const start = /* @__PURE__ */ __name(async () => {
        setLoading(true);
        try {
          const payload = initialContext 
            ? { context: initialContext, count: 3 }
            : { topic: "General Knowledge", count: 3 };

          let res;
          try {
            res = await clientGenerateQuiz(payload);
          } catch (e) {
            res = await _api.aiApi.generateQuiz(payload);
          }

          if (res && res.quiz && Array.isArray(res.quiz)) {
            const formatted = res.quiz.map(q => ({
              q: q.question || q.q,
              options: q.options,
              answer: q.answerIndex ?? q.answer ?? 0
            }));
            setQuestions(formatted);
          }
        } catch (error) {
          console.error("Quiz generation error:", error);
        } finally {
          setAnswers({});
          setSubmitted(false);
          setLoading(false);
          setStarted(true);
        }
      }, "start");

      _react.useEffect(() => {
        if (initialContext) {
          start();
        }
      }, [initialContext]);
      const score = questions.filter((q, i) => answers[i] === q.answer).length;
      if (!started) {
        return _jsxdevruntime.jsxDEV("div", { className: "card-surface flex flex-col items-center p-12 text-center", children: [
          _jsxdevruntime.jsxDEV(_lucidereact.ListChecks, { className: "h-10 w-10 text-primary" }, void 0, false),
          _jsxdevruntime.jsxDEV("h3", { className: "mt-4 font-display text-xl font-semibold", children: "Generate a quiz from your notes" }, void 0, false),
          _jsxdevruntime.jsxDEV("p", { className: "mt-2 max-w-md text-sm text-muted-foreground", children: "Gemini creates exam-style questions from your most recent study material \u2014 Gradient Boosting (ML)." }, void 0, false),
          _jsxdevruntime.jsxDEV("button", {
            onClick: start,
            disabled: loading,
            className: "btn-gradient mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold",
            children: loading ? _jsxdevruntime.jsxDEV(_jsxdevruntime.Fragment, { children: ["Generating ", _jsxdevruntime.jsxDEV(_kit.ThinkingDots, {}, void 0, false)] }, void 0, true) : _jsxdevruntime.jsxDEV(_jsxdevruntime.Fragment, { children: [_jsxdevruntime.jsxDEV(_lucidereact.Sparkles, { className: "h-4 w-4" }, void 0, false), " Generate 3 questions"] }, void 0, true)
          }, void 0, false)
        ] }, void 0, true);
      }
      return _jsxdevruntime.jsxDEV("div", { className: "mx-auto max-w-2xl space-y-5", children: [
        questions.map((q, qi) => _jsxdevruntime.jsxDEV(_framermotion.motion.div, { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: qi * 0.1 }, className: "card-surface p-6", children: [
          _jsxdevruntime.jsxDEV("p", { className: "font-display font-semibold", children: [qi + 1, ". ", q.q] }, void 0, true),
          _jsxdevruntime.jsxDEV("div", {
            className: "mt-3 space-y-2",
            children: q.options.map((opt, oi) => {
              const chosen = answers[qi] === oi;
              const correct = submitted && oi === q.answer;
              const wrong = submitted && chosen && oi !== q.answer;
              return _jsxdevruntime.jsxDEV("button", {
                onClick: /* @__PURE__ */ __name(() => !submitted && setAnswers((a) => ({ ...a, [qi]: oi })), "onClick"),
                className: _utils.cn.call(
                  void 0,
                  "w-full rounded-xl border px-4 py-2.5 text-left text-sm transition-all",
                  correct ? "border-emerald-brand bg-emerald-soft font-semibold text-emerald-brand" : wrong ? "border-rose-brand bg-rose-soft text-rose-brand" : chosen ? "border-primary bg-primary-soft font-medium text-primary" : "border-border hover:border-primary/40 hover:bg-muted"
                ),
                children: opt
              }, oi, false);
            })
          }, void 0, false)
        ] }, qi, true)),
        !submitted ? _jsxdevruntime.jsxDEV("button", {
          onClick: () => setSubmitted(true),
          disabled: Object.keys(answers).length < questions.length,
          className: "btn-gradient w-full rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50",
          children: "Submit answers"
        }, void 0, false) : _jsxdevruntime.jsxDEV(_framermotion.motion.div, { initial: { scale: 0.94, opacity: 0 }, animate: { scale: 1, opacity: 1 }, className: "card-surface p-6 text-center", children: [
          _jsxdevruntime.jsxDEV("p", { className: "font-display text-3xl font-bold text-gradient", children: [score, "/", questions.length] }, void 0, true),
          _jsxdevruntime.jsxDEV("p", { className: "mt-1 text-sm text-muted-foreground", children: score === questions.length ? "Perfect! This topic moves to a 7-day review interval." : "Missed questions were added to tomorrow's spaced repetition." }, void 0, false)
        ] }, void 0, true)
      ] }, void 0, true);
    }

    const cards = [
      { front: "What does the learning rate control in gradient boosting?", back: "The contribution of each tree (shrinkage). Lower rates need more trees but generalize better." },
      { front: "Bagging vs Boosting \u2014 main statistical difference?", back: "Bagging reduces variance (parallel, independent trees); boosting reduces bias (sequential, error-correcting trees)." },
      { front: "What regularization does XGBoost add?", back: "L1/L2 penalties on leaf weights plus a complexity term on the number of leaves." }
    ];
    function Flashcards() {
      const [idx, setIdx] = _react.useState(0);
      const [flipped, setFlipped] = _react.useState(false);
      return _jsxdevruntime.jsxDEV("div", { className: "mx-auto max-w-xl", children: [
        _jsxdevruntime.jsxDEV("div", { className: "mb-4 flex items-center justify-between text-sm text-muted-foreground", children: [
          _jsxdevruntime.jsxDEV("span", { children: ["Deck: Gradient Boosting \xB7 ", idx + 1, "/", cards.length] }, void 0, true),
          _jsxdevruntime.jsxDEV("span", { className: "chip bg-teal-soft text-teal-brand", children: "Spaced repetition" }, void 0, false)
        ] }, void 0, true),
        _jsxdevruntime.jsxDEV("div", {
          className: "relative h-72 cursor-pointer",
          style: { perspective: 1200 },
          onClick: () => setFlipped((f) => !f),
          children: _jsxdevruntime.jsxDEV(_framermotion.motion.div, {
            className: "relative h-full w-full",
            style: { transformStyle: "preserve-3d" },
            animate: { rotateY: flipped ? 180 : 0 },
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
            children: [
              _jsxdevruntime.jsxDEV("div", {
                className: "card-surface absolute inset-0 flex items-center justify-center p-8 text-center",
                style: { backfaceVisibility: "hidden" },
                children: _jsxdevruntime.jsxDEV("p", { className: "font-display text-xl font-semibold", children: cards[idx].front }, void 0, false)
              }, void 0, false),
              _jsxdevruntime.jsxDEV("div", {
                className: "absolute inset-0 flex items-center justify-center rounded-2xl p-8 text-center text-primary-foreground shadow-lift",
                style: { backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "var(--gradient-primary)" },
                children: _jsxdevruntime.jsxDEV("p", { className: "text-lg leading-relaxed", children: cards[idx].back }, void 0, false)
              }, void 0, false)
            ]
          }, void 0, true)
        }, void 0, false),
        _jsxdevruntime.jsxDEV("p", { className: "mt-3 text-center text-xs text-muted-foreground", children: "Tap card to flip" }, void 0, false),
        _jsxdevruntime.jsxDEV("div", { className: "mt-5 grid grid-cols-3 gap-3", children: [
          _jsxdevruntime.jsxDEV("button", { onClick: () => {
            setFlipped(false);
            setIdx((i) => (i + 1) % cards.length);
          }, className: "rounded-xl bg-rose-soft px-4 py-2.5 text-sm font-semibold text-rose-brand transition-transform hover:-translate-y-0.5", children: "Again" }, void 0, false),
          _jsxdevruntime.jsxDEV("button", { onClick: () => {
            setFlipped(false);
            setIdx((i) => (i + 1) % cards.length);
          }, className: "rounded-xl bg-amber-soft px-4 py-2.5 text-sm font-semibold text-amber-brand transition-transform hover:-translate-y-0.5", children: "Hard" }, void 0, false),
          _jsxdevruntime.jsxDEV("button", { onClick: () => {
            setFlipped(false);
            setIdx((i) => (i + 1) % cards.length);
          }, className: "rounded-xl bg-emerald-soft px-4 py-2.5 text-sm font-semibold text-emerald-brand transition-transform hover:-translate-y-0.5", children: "Easy" }, void 0, false)
        ] }, void 0, true)
      ] }, void 0, true);
    }

export { Route };
