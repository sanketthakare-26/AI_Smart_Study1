import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Layers, ListChecks, MessageSquareText, Send, Sparkles, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PageHeader, ThinkingDots } from "@/components/kit";
import { aiApi } from "@/services/api";
import { cn } from "@/lib/utils";
import { clientChatbot, clientGenerateQuiz, clientSummarizeNotes } from "@/lib/gemini-client";
export const Route = createFileRoute("/app/ai")({
    head: () => ({ meta: [{ title: "AI Tools — VediQ" }] }),
    component: AiToolsPage,
});
const tabs = [
    { id: "chat", label: "AI Chatbot", icon: MessageSquareText },
    { id: "summarize", label: "Notes Summarizer", icon: FileText },
    { id: "quiz", label: "Quiz Generator", icon: ListChecks },
    { id: "flashcards", label: "Flashcards", icon: Layers },
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
    const [tab, setTab] = useState("chat");
    const [summaryContext, setSummaryContext] = useState("");
    return (<div>
      <PageHeader title="AI Learning Tools" subtitle="Powered by Google Gemini · chat, summarize, quiz, and drill"/>
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (<button key={t.id} onClick={() => setTab(t.id)} className={cn("flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all", tab === t.id ? "btn-gradient" : "card-surface text-muted-foreground hover:text-foreground")}>
            <t.icon className="h-4 w-4"/> {t.label}
          </button>))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
          {tab === "chat" && <Chatbot />}
          {tab === "summarize" && <Summarizer onGenerateQuiz={(summary) => {
              setSummaryContext(summary);
              setTab("quiz");
          }} />}
          {tab === "quiz" && <QuizGen initialContext={summaryContext} />}
          {tab === "flashcards" && <Flashcards />}
        </motion.div>
      </AnimatePresence>
    </div>);
}
const cannedReplies = [
    "Great question! Gradient boosting builds trees sequentially — each new tree corrects the residual errors of the ensemble so far. Think of it as a team where every new member focuses on what the team currently gets wrong.",
    "Here's a quick mnemonic for page replacement: **LRU** = \"Least Recently Used, Longest Rest Unwanted.\" Want me to generate 5 practice questions on this?",
    "Based on your study history, you retain tree-based algorithms 23% better in morning sessions. I'd schedule this topic for tomorrow 07:00.",
];
function Chatbot() {
    const [messages, setMessages] = useState([
        { role: "ai", text: "Hi Aarav! I've read your ML notes from yesterday. Want to review gradient boosting, or should I quiz you on decision trees?" },
    ]);
    const [input, setInput] = useState("");
    const [thinking, setThinking] = useState(false);
    const endRef = useRef(null);
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, thinking]);
    const send = async () => {
        if (!input.trim() || thinking)
            return;
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
                setMessages((m) => [...m, { role: "ai", text: "Sorry, I couldn't generate a response. Please try again." }]);
            }
        } catch (error) {
            console.error("Chatbot error:", error);
            setMessages((m) => [...m, { role: "ai", text: "Ask me about your subjects, algorithms, ML concepts, or study strategies!" }]);
        } finally {
            setThinking(false);
        }
    };
    return (<div className="card-surface flex h-[32rem] flex-col overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border px-5 py-3">
        <span className="grid h-8 w-8 place-items-center rounded-lg btn-gradient"><Sparkles className="h-4 w-4"/></span>
        <div>
          <p className="text-sm font-semibold">Study Assistant</p>
          <p className="text-[11px] text-emerald-brand">● Online · Gemini</p>
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-5">
        {messages.map((m, i) => (<motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed", m.role === "user" ? "btn-gradient rounded-br-md" : "bg-muted rounded-bl-md")}>
              {m.text}
            </div>
          </motion.div>))}
        {thinking && (<div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3"><ThinkingDots /></div>
          </div>)}
        <div ref={endRef}/>
      </div>
      <div className="border-t border-border p-3">
        <div className="flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask anything about your subjects…" className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-ring/15"/>
          <button onClick={send} className="btn-gradient grid h-11 w-11 shrink-0 place-items-center rounded-xl" aria-label="Send">
            <Send className="h-4 w-4"/>
          </button>
        </div>
      </div>
    </div>);
}
/* ---------------- Summarizer ---------------- */
function Summarizer({ onGenerateQuiz }) {
    const [state, setState] = useState("idle");
    const [fileName, setFileName] = useState("");
    const [summaryText, setSummaryText] = useState("");
    const run = async (file) => {
        setFileName(file.name);
        setState("loading");
        try {
            const fileText = await extractTextFromFile(file);
            let res;
            try {
                res = await clientSummarizeNotes({ text: fileText, fileName: file.name });
            } catch (e) {
                res = await aiApi.summarizeNotes({ text: fileText, fileName: file.name });
            }
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const start = async () => {
        setLoading(true);
        try {
            const payload = initialContext 
                ? { context: initialContext, count: 3 }
                : { topic: "General Knowledge", count: 3 };
            let res;
            try {
                res = await clientGenerateQuiz(payload);
            } catch (e) {
                res = await aiApi.generateQuiz(payload);
            }
            if (res?.quiz && Array.isArray(res.quiz) && res.quiz.length > 0) {
                setQuestions(res.quiz.map(q => ({ q: q.question || q.q, options: q.options, answer: q.answerIndex ?? q.answer ?? 0 })));
            }
        } catch (err) {
            console.error("Quiz error:", err);
        } finally {
            setAnswers({});
            setSubmitted(false);
            setLoading(false);
            setStarted(true);
        }
    };
    useEffect(() => {
        if (initialContext) {
            start();
        }
    }, [initialContext]);
    const score = questions.filter((q, i) => answers[i] === q.answer).length;
    if (!started) {
        return (<div className="card-surface flex flex-col items-center p-12 text-center">
        <ListChecks className="h-10 w-10 text-primary"/>
        <h3 className="mt-4 font-display text-xl font-semibold">Generate a quiz from your notes</h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">Gemini creates exam-style questions from your most recent study material — Gradient Boosting (ML).</p>
        <button onClick={start} disabled={loading} className="btn-gradient mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold">
          {loading ? <>Generating <ThinkingDots /></> : <><Sparkles className="h-4 w-4"/> Generate 3 questions</>}
        </button>
      </div>);
    }
    return (<div className="mx-auto max-w-2xl space-y-5">
      {questions.map((q, qi) => (<motion.div key={qi} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: qi * 0.1 }} className="card-surface p-6">
          <p className="font-display font-semibold">{qi + 1}. {q.q}</p>
          <div className="mt-3 space-y-2">
            {q.options.map((opt, oi) => {
                const chosen = answers[qi] === oi;
                const correct = submitted && oi === q.answer;
                const wrong = submitted && chosen && oi !== q.answer;
                return (<button key={oi} onClick={() => !submitted && setAnswers((a) => ({ ...a, [qi]: oi }))} className={cn("w-full rounded-xl border px-4 py-2.5 text-left text-sm transition-all", correct ? "border-emerald-brand bg-emerald-soft font-semibold text-emerald-brand"
                        : wrong ? "border-rose-brand bg-rose-soft text-rose-brand"
                            : chosen ? "border-primary bg-primary-soft font-medium text-primary"
                                : "border-border hover:border-primary/40 hover:bg-muted")}>
                  {opt}
                </button>);
            })}
          </div>
        </motion.div>))}
      {!submitted ? (<button onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < questions.length} className="btn-gradient w-full rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50">
          Submit answers
        </button>) : (<motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card-surface p-6 text-center">
          <p className="font-display text-3xl font-bold text-gradient">{score}/{questions.length}</p>
          <p className="mt-1 text-sm text-muted-foreground">{score === questions.length ? "Perfect! This topic moves to a 7-day review interval." : "Missed questions were added to tomorrow's spaced repetition."}</p>
        </motion.div>)}
    </div>);
}
function Flashcards({ initialContext }) {
    const defaultCards = [
        { front: "What does the learning rate control in gradient boosting?", back: "The contribution of each tree (shrinkage). Lower rates need more trees but generalize better." },
        { front: "Bagging vs Boosting — main statistical difference?", back: "Bagging reduces variance (parallel, independent trees); boosting reduces bias (sequential, error-correcting trees)." },
        { front: "What regularization does XGBoost add?", back: "L1/L2 penalties on leaf weights plus a complexity term on the number of leaves." }
    ];
    const cards = Array.isArray(defaultCards) ? defaultCards : [];
    const [idx, setIdx] = useState(0);
    const [flipped, setFlipped] = useState(false);
    return (<div className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>Deck: {initialContext ? "Uploaded Notes" : "Gradient Boosting"} · {idx + 1}/{cards.length}</span>
        <span className="chip bg-teal-soft text-teal-brand">Spaced repetition</span>
      </div>
      <div className="relative h-72 cursor-pointer" style={{ perspective: 1200 }} onClick={() => setFlipped((f) => !f)}>
        <motion.div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }} animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
          <div className="card-surface absolute inset-0 flex items-center justify-center p-8 text-center" style={{ backfaceVisibility: "hidden" }}>
            <p className="font-display text-xl font-semibold">{cards[idx]?.front}</p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl p-8 text-center text-primary-foreground shadow-lift" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "var(--gradient-primary)" }}>
            <p className="text-lg leading-relaxed">{cards[idx]?.back}</p>
          </div>
        </motion.div>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">Tap card to flip</p>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <button onClick={() => { setFlipped(false); setIdx((i) => (i + 1) % cards.length); }} className="rounded-xl bg-rose-soft px-4 py-2.5 text-sm font-semibold text-rose-brand transition-transform hover:-translate-y-0.5">Again</button>
        <button onClick={() => { setFlipped(false); setIdx((i) => (i + 1) % cards.length); }} className="rounded-xl bg-amber-soft px-4 py-2.5 text-sm font-semibold text-amber-brand transition-transform hover:-translate-y-0.5">Hard</button>
        <button onClick={() => { setFlipped(false); setIdx((i) => (i + 1) % cards.length); }} className="rounded-xl bg-emerald-soft px-4 py-2.5 text-sm font-semibold text-emerald-brand transition-transform hover:-translate-y-0.5">Easy</button>
      </div>
    </div>);
}
