import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Crown, Mic, MicOff, Send, Timer, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { fadeUp, PageHeader, staggerContainer } from "@/components/kit";
import { friends, leaderboard, roomChat, studyRooms } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
export const Route = createFileRoute("/app/rooms")({
    head: () => ({ meta: [{ title: "Study Rooms — VediQ" }] }),
    component: RoomsPage,
});
function RoomsPage() {
    const [messages, setMessages] = useState(roomChat);
    const [input, setInput] = useState("");
    const [micOn, setMicOn] = useState(false);
    const send = () => {
        if (!input.trim())
            return;
        setMessages((m) => [...m, { id: `m${Date.now()}`, from: "Aarav Sharma", text: input.trim(), time: "now", me: true }]);
        setInput("");
    };
    return (<div>
      <PageHeader title="Study Rooms" subtitle="Focus together — shared timers, chat, and friendly competition" actions={<button className="btn-gradient inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold">
            <UserPlus className="h-4 w-4"/> Invite friends
          </button>}/>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid gap-6 xl:grid-cols-3">
        {/* Rooms list */}
        <motion.div variants={fadeUp} className="space-y-4">
          <h2 className="font-display text-lg font-semibold">Rooms</h2>
          {studyRooms.map((r) => (<div key={r.id} className={cn("card-surface card-hover p-5", r.live && "border-primary/30")}>
              <div className="flex items-center justify-between">
                <p className="font-display font-semibold">{r.name}</p>
                {r.live && (<span className="chip bg-emerald-soft text-emerald-brand">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-brand"/> Live
                  </span>)}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{r.topic} · {r.members} members</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {Array.from({ length: Math.min(r.online, 4) }).map((_, i) => (<span key={i} className="grid h-7 w-7 place-items-center rounded-full border-2 border-card bg-primary-soft text-[10px] font-bold text-primary">
                      {"PKSD"[i]}
                    </span>))}
                  {r.online > 0 && <span className="ml-3 pl-2 text-xs text-muted-foreground">{r.online} online</span>}
                </div>
                <button className={cn("rounded-lg px-3 py-1.5 text-xs font-semibold", r.live ? "btn-gradient" : "bg-muted text-muted-foreground")}>
                  {r.live ? "Join" : "Schedule"}
                </button>
              </div>
            </div>))}

          {/* Friends */}
          <div className="card-surface p-5">
            <h3 className="flex items-center gap-2 font-display font-semibold"><Users className="h-4 w-4 text-primary"/> Friends</h3>
            <div className="mt-3 space-y-3">
              {friends.map((f) => (<div key={f.id} className="flex items-center gap-3">
                  <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                    {f.name.split(" ").map((n) => n[0]).join("")}
                    <span className={cn("absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card", f.online ? "bg-emerald-brand" : "bg-muted-foreground/40")}/>
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{f.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{f.status}</p>
                  </div>
                </div>))}
            </div>
          </div>
        </motion.div>

        {/* Active room */}
        <motion.div variants={fadeUp} className="card-surface flex flex-col overflow-hidden xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <p className="font-display font-semibold">ML Final Sprint</p>
              <p className="text-xs text-muted-foreground">4 online · shared pomodoro running</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="chip bg-primary-soft text-primary"><Timer className="h-3.5 w-3.5"/> 18:42 left</span>
              <button onClick={() => setMicOn((v) => !v)} className={cn("relative grid h-10 w-10 place-items-center rounded-xl transition-colors", micOn ? "bg-emerald-soft text-emerald-brand" : "bg-muted text-muted-foreground")} aria-label="Toggle microphone">
                {micOn && <span className="pulse-wave absolute inset-0 rounded-xl border-2 border-emerald-brand/40"/>}
                {micOn ? <Mic className="h-4.5 w-4.5"/> : <MicOff className="h-4.5 w-4.5"/>}
              </button>
            </div>
          </div>

          {/* Voice bar */}
          <div className="flex flex-wrap gap-3 border-b border-border bg-muted/40 px-5 py-3">
            {["Priya Nair", "Aarav Sharma", "Kenji Tanaka", "Sara Malik"].map((n, i) => (<div key={n} className="flex items-center gap-2">
                <span className={cn("relative grid h-8 w-8 place-items-center rounded-full text-[10px] font-bold", i === 0 ? "bg-emerald-soft text-emerald-brand" : "bg-primary-soft text-primary")}>
                  {n.split(" ").map((x) => x[0]).join("")}
                  {i === 0 && (<motion.span className="absolute inset-0 rounded-full border-2 border-emerald-brand/60" animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0, 0.8] }} transition={{ duration: 1.4, repeat: Infinity }}/>)}
                </span>
                <span className="text-xs font-medium">{n.split(" ")[0]}</span>
              </div>))}
          </div>

          {/* Chat */}
          <div className="flex-1 space-y-3 overflow-y-auto p-5" style={{ minHeight: "16rem" }}>
            {messages.map((m) => (<motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn("flex", m.me ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[75%] rounded-2xl px-4 py-2.5 text-sm", m.me ? "btn-gradient rounded-br-md" : "bg-muted rounded-bl-md")}>
                  {!m.me && <p className="mb-0.5 text-[11px] font-bold text-primary">{m.from}</p>}
                  <p className="leading-relaxed">{m.text}</p>
                  <p className={cn("mt-1 text-[10px]", m.me ? "text-primary-foreground/70" : "text-muted-foreground")}>{m.time}</p>
                </div>
              </motion.div>))}
          </div>
          <div className="border-t border-border p-3">
            <div className="flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Message the room…" className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-ring/15"/>
              <button onClick={send} className="btn-gradient grid h-11 w-11 shrink-0 place-items-center rounded-xl" aria-label="Send">
                <Send className="h-4 w-4"/>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Leaderboard */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="card-surface mt-6 p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold"><Crown className="h-5 w-5 text-amber-brand"/> Weekly leaderboard</h2>
        <div className="mt-4 space-y-2">
          {leaderboard.map((p, i) => (<motion.div key={p.rank} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className={cn("flex items-center gap-4 rounded-xl border px-4 py-3", p.you ? "border-primary/40 bg-primary-soft/50" : "border-border")}>
              <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg font-display text-sm font-bold", p.rank === 1 ? "bg-amber-soft text-amber-brand" : "bg-muted text-muted-foreground")}>
                {p.rank}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.name} {p.you && <span className="text-xs font-medium text-primary">(you)</span>}</p>
                <p className="text-xs text-muted-foreground">{p.streak}-day streak</p>
              </div>
              <span className="shrink-0 font-display text-sm font-bold">{p.hours}h</span>
            </motion.div>))}
        </div>
      </motion.div>
    </div>);
}
