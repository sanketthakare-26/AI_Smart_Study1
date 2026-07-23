import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown, Mic, MicOff, Send, Timer, UserPlus, Users, Plus,
  Laptop, Share2, Copy, Search, MessageCircle, X, BookOpen,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { io } from "socket.io-client";
import { fadeUp, PageHeader, staggerContainer } from "@/components/kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/rooms")({
  head: () => ({ meta: [{ title: "Study Rooms — VediQ" }] }),
  component: RoomsPage,
});

function getOrGenerateUserCode() {
  if (typeof window === "undefined") return "00000";
  try {
    let code = localStorage.getItem("nw_user_5digit_id");
    if (!code) {
      code = Math.floor(10000 + Math.random() * 90000).toString();
      localStorage.setItem("nw_user_5digit_id", code);
    }
    return code;
  } catch (_) { return "00000"; }
}

function initials(name) {
  if (!name) return "??";
  return name.split(" ").map(w => w[0] || "").join("").toUpperCase().slice(0, 2) || "??";
}

function RoomsPage() {
  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem("nw_user") || "{}"); } catch { return {}; }
  })();
  const userName = currentUser.name || "Student";
  const myUserCode = useRef(getOrGenerateUserCode()).current;

  // Real user study hours from subjects / profile
  const userHours = (() => {
    try {
      const stored = localStorage.getItem("nw_subjects");
      if (stored) {
        const subs = JSON.parse(stored);
        return subs.reduce((acc, s) => acc + (Number(s.hours) || 0), 0);
      }
    } catch (_) {}
    return currentUser.hours || 12.5;
  })();

  const userStreak = currentUser.streakDays || 5;

  const [rooms, setRooms] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [micOn, setMicOn] = useState(false);

  const [socket, setSocket] = useState(null);
  const [onlineRoomUsers, setOnlineRoomUsers] = useState([]);
  const [globalOnlineUsers, setGlobalOnlineUsers] = useState([]);

  const [friendsList, setFriendsList] = useState(() => {
    try { return JSON.parse(localStorage.getItem("nw_friends") || "[]"); } catch { return []; }
  });
  const [searchFriendCode, setSearchFriendCode] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);

  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomTopic, setNewRoomTopic] = useState("");

  const chatEndRef = useRef(null);
  const activeRoom = rooms.find(r => r.id === activeRoomId);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "") : "http://localhost:5000");
    const s = io(socketUrl, { transports: ["websocket", "polling"] });
    s.on("connect", () => {
      s.emit("user-online", { name: userName, userCode: myUserCode, hours: userHours, streak: userStreak });
    });
    s.on("room-users-update", users => setOnlineRoomUsers(users));
    s.on("global-users-update", users => setGlobalOnlineUsers(users));
    s.on("receive-room-message", msg => setMessages(prev => [...prev, msg]));
    s.on("room-list-update", updatedRooms => setRooms(updatedRooms));
    setSocket(s);
    return () => s.disconnect();
  }, []);

  useEffect(() => {
    if (!socket || !activeRoomId) return;
    socket.emit("join-study-room", { roomId: activeRoomId, userName, userCode: myUserCode });
  }, [activeRoomId, socket]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!timerRunning) return;
    if (timeLeft <= 0) { setTimerRunning(false); toast.success("Pomodoro complete! Take a break."); return; }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timerRunning, timeLeft]);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const joinRoom = roomId => {
    if (socket && activeRoomId && activeRoomId !== roomId) socket.emit("leave-study-room", { roomId: activeRoomId });
    setActiveRoomId(roomId);
    setMessages([]);
    setOnlineRoomUsers([]);
    setTimeLeft(25 * 60);
    setTimerRunning(false);
    toast.info(`Joined: ${rooms.find(r => r.id === roomId)?.name}`);
  };

  const handleCreateRoom = e => {
    e.preventDefault();
    if (!newRoomName.trim() || !newRoomTopic.trim()) return;
    const roomData = {
      id: `r_${Date.now()}`,
      name: newRoomName.trim(),
      topic: newRoomTopic.trim(),
      createdBy: userName,
      live: true,
    };
    if (socket) {
      socket.emit("create-room", roomData);
    } else {
      setRooms(prev => [...prev, roomData]);
    }
    setShowAddRoom(false);
    setNewRoomName("");
    setNewRoomTopic("");
    joinRoom(roomData.id);
    toast.success(`Room "${roomData.name}" created!`);
  };

  const send = () => {
    if (!input.trim() || !activeRoomId) return;
    const msg = { id: `m_${Date.now()}`, from: userName, text: input.trim(), time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), me: true, userCode: myUserCode };
    if (socket) socket.emit("send-room-message", { roomId: activeRoomId, message: msg });
    else setMessages(p => [...p, msg]);
    setInput("");
  };

  const handleAddFriend = e => {
    e.preventDefault();
    if (searchFriendCode.length !== 5) { toast.error("Enter a valid 5-digit Friend ID."); return; }
    if (searchFriendCode === myUserCode) { toast.error("That's your own ID!"); return; }
    if (friendsList.some(f => f.code === searchFriendCode)) { toast.error("Already a friend."); return; }
    const matched = globalOnlineUsers.find(u => u.userCode === searchFriendCode);
    const f = { id: `f_${Date.now()}`, name: matched?.name || `User #${searchFriendCode}`, online: !!matched, code: searchFriendCode };
    const updated = [...friendsList, f];
    setFriendsList(updated);
    localStorage.setItem("nw_friends", JSON.stringify(updated));
    setSearchFriendCode("");
    toast.success(`${f.name} added!`);
  };

  // Derive dynamic real-user leaderboard from global online active users
  const realLeaderboard = [...globalOnlineUsers]
    .map(u => ({
      name: u.name,
      hours: u.hours || 0,
      streak: u.streak || 0,
      userCode: u.userCode,
      you: u.userCode === myUserCode,
    }))
    .sort((a, b) => b.hours - a.hours)
    .map((u, i) => ({ ...u, rank: i + 1 }));

  const inviteUrl = typeof window !== "undefined" ? window.location.href : "";
  const waMsg = encodeURIComponent(`Study with me on VediQ! My ID: ${myUserCode} — ${inviteUrl}`);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Study Rooms"
        subtitle="Create or join rooms — real-time chat powered by WebSockets"
        actions={
          <button onClick={() => setShowInviteModal(true)} className="btn-gradient inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold">
            <UserPlus className="h-4 w-4" /> Invite Friends
          </button>
        }
      />

      {/* Friend-ID Banner */}
      <div className="card-surface flex flex-wrap items-center justify-between gap-4 border border-primary/20 bg-primary-soft/10 p-4">
        <div className="flex items-center gap-3">
          <span className="btn-gradient grid h-10 w-10 place-items-center rounded-xl font-bold text-white text-base">#</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Friend ID</p>
            <p className="font-display text-xl font-bold tracking-widest text-primary">{myUserCode}</p>
          </div>
        </div>
        <form onSubmit={handleAddFriend} className="flex flex-1 max-w-xs items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="text" maxLength={5} placeholder="5-digit Friend ID…" value={searchFriendCode}
              onChange={e => setSearchFriendCode(e.target.value.replace(/\D/g, ""))}
              className="w-full rounded-xl border border-input bg-card py-2 pl-9 pr-3 text-xs outline-none focus:border-primary" />
          </div>
          <button type="submit" className="btn-gradient whitespace-nowrap rounded-xl px-3 py-2 text-xs font-bold">Add Friend</button>
        </form>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid gap-6 xl:grid-cols-3">

        {/* Left Column */}
        <motion.div variants={fadeUp} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <Laptop className="h-5 w-5 text-primary" /> Active Rooms
            </h2>
            <button onClick={() => setShowAddRoom(v => !v)} className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              <Plus className="h-3.5 w-3.5" /> Create Room
            </button>
          </div>

          <AnimatePresence>
            {showAddRoom && (
              <motion.form initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                onSubmit={handleCreateRoom} className="card-surface overflow-hidden border border-primary/20 p-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">New Study Room</p>
                <input required type="text" placeholder="Room Name (e.g. DSA Grinders)" value={newRoomName}
                  onChange={e => setNewRoomName(e.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-3 py-1.5 text-xs outline-none focus:border-primary" />
                <input required type="text" placeholder="Topic (e.g. Graph Algorithms)" value={newRoomTopic}
                  onChange={e => setNewRoomTopic(e.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-3 py-1.5 text-xs outline-none focus:border-primary" />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowAddRoom(false)} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
                  <button type="submit" className="btn-gradient rounded-lg px-3 py-1.5 text-xs font-bold">Create</button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {rooms.length === 0 ? (
            <div className="card-surface flex flex-col items-center gap-3 p-10 text-center text-muted-foreground">
              <Laptop className="h-10 w-10 opacity-20" />
              <p className="text-sm font-semibold">No rooms yet</p>
              <p className="text-xs opacity-70">Create the first study room!</p>
              <button onClick={() => setShowAddRoom(true)} className="btn-gradient mt-1 rounded-xl px-4 py-2 text-xs font-bold">
                <Plus className="mr-1 inline h-3.5 w-3.5" /> Create Room
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {rooms.map(r => {
                const isCurrent = r.id === activeRoomId;
                return (
                  <div key={r.id} className={cn("card-surface border p-5 transition-all duration-200",
                    isCurrent ? "border-primary bg-primary/5 shadow-lift" : "border-transparent card-hover")}>
                    <div className="flex items-center justify-between">
                      <p className="font-display font-bold">{r.name}</p>
                      {r.live && (
                        <span className="chip animate-pulse bg-emerald-soft text-[10px] text-emerald-brand">
                          <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-brand" />Live
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{r.topic} · by {r.createdBy}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        {r.memberCount !== undefined ? `${r.memberCount} members` : (isCurrent ? `${onlineRoomUsers.length} online` : "Join to see members")}
                      </div>
                      <button onClick={() => joinRoom(r.id)} disabled={isCurrent}
                        className={cn("rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                          isCurrent ? "cursor-default bg-primary-soft font-bold text-primary" : "btn-gradient hover:scale-105")}>
                        {isCurrent ? "Inside ?" : "Join Room"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Active Users / Friends */}
          <div className="card-surface space-y-3 p-5">
            <h3 className="flex items-center gap-2 border-b border-border pb-2 font-display font-semibold">
              <Users className="h-4 w-4 text-primary" /> Active Web Users ({globalOnlineUsers.length})
            </h3>
            {globalOnlineUsers.length === 0 ? (
              <p className="py-4 text-center text-xs text-muted-foreground">No active users on the web right now.</p>
            ) : (
              <div className="max-h-52 space-y-2.5 overflow-y-auto pr-1">
                {globalOnlineUsers.map(u => {
                  const isYou = u.userCode === myUserCode;
                  return (
                    <div key={u.socketId} className="flex items-center gap-3">
                      <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-soft text-[10px] font-bold text-primary">
                        {initials(u.name)}
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-brand animate-pulse" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {u.name} {isYou && <span className="text-xs font-bold text-primary">(you)</span>}
                        </p>
                        <p className="text-xs text-emerald-brand font-semibold">Active on Web</p>
                      </div>
                      {u.userCode && (
                        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-bold">#{u.userCode}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* Chat Panel */}
        <motion.div variants={fadeUp} className="card-surface flex flex-col overflow-hidden border border-border xl:col-span-2">
          {!activeRoom ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center text-muted-foreground">
              <BookOpen className="h-14 w-14 opacity-20" />
              <p className="font-display text-lg font-semibold text-foreground">No room selected</p>
              <p className="max-w-xs text-sm">Create a room or join one to start chatting with real users in real time.</p>
              <button onClick={() => setShowAddRoom(true)} className="btn-gradient mt-2 rounded-xl px-5 py-2 text-sm font-bold">
                <Plus className="mr-1 inline h-4 w-4" /> Create a Room
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/20 px-5 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-ping rounded-full bg-emerald-500" />
                    <p className="font-display text-base font-bold">{activeRoom.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activeRoom.topic} · {onlineRoomUsers.length} user{onlineRoomUsers.length !== 1 ? "s" : ""} online
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setTimerRunning(r => !r)}
                    className="chip flex items-center gap-1.5 bg-primary-soft px-3 py-1.5 font-mono text-xs font-semibold text-primary">
                    <Timer className="h-3.5 w-3.5" /> {fmt(timeLeft)}
                  </button>
                  <button onClick={() => { setMicOn(m => !m); toast.info(micOn ? "Mic muted" : "Mic on"); }}
                    className={cn("grid h-9 w-9 place-items-center rounded-xl transition-colors",
                      micOn ? "bg-emerald-soft text-emerald-brand" : "bg-muted text-muted-foreground")}>
                    {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Members strip */}
              <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/30 px-5 py-2.5">
                <span className="self-center text-[10px] font-bold uppercase text-muted-foreground">In Room:</span>
                {onlineRoomUsers.length === 0 ? (
                  <span className="text-xs italic text-muted-foreground">Connecting…</span>
                ) : onlineRoomUsers.map(u => (
                  <div key={u.socketId} className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-card px-2.5 py-1">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-primary-soft text-[10px] font-bold text-primary">
                      {initials(u.name)}
                    </span>
                    <span className="text-xs font-semibold">{u.name}</span>
                    {u.userCode === myUserCode && <span className="text-[9px] font-bold text-primary">(you)</span>}
                  </div>
                ))}
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-3 overflow-y-auto p-5" style={{ minHeight: "18rem", maxHeight: "380px" }}>
                {messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
                    <MessageCircle className="h-10 w-10 opacity-20" />
                    <p className="text-sm font-semibold">No messages yet</p>
                    <p className="text-xs opacity-70">Say hi to start the conversation!</p>
                  </div>
                ) : messages.map(m => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className={cn("flex", m.from === userName ? "justify-end" : "justify-start")}>
                    <div className={cn("max-w-[75%] rounded-2xl border px-4 py-2.5 text-sm shadow-sm",
                      m.from === userName ? "btn-gradient rounded-br-md border-transparent text-white" : "rounded-bl-md border-border/80 bg-card")}>
                      {m.from !== userName && (
                        <p className="mb-1 text-[10px] font-extrabold uppercase tracking-wide text-primary">{m.from}</p>
                      )}
                      <p className="font-medium leading-relaxed">{m.text}</p>
                      <p className={cn("mt-1 text-right text-[9px] font-medium",
                        m.from === userName ? "text-white/60" : "text-muted-foreground/70")}>{m.time}</p>
                    </div>
                  </motion.div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-border bg-muted/10 p-3">
                <div className="flex gap-2">
                  <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
                    placeholder={`Message ${activeRoom.name}…`}
                    className="flex-1 rounded-xl border border-input bg-card px-4 py-2.5 text-sm outline-none focus:border-primary" />
                  <button onClick={send} className="btn-gradient grid h-11 w-11 shrink-0 place-items-center rounded-xl">
                    <Send className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Real Academic Leaderboard */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="card-surface p-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Crown className="h-5 w-5 text-amber-brand" /> Weekly Academic Leaderboard
          </h2>
          <span className="chip bg-amber-soft text-xs font-semibold text-amber-brand">Live Active Users</span>
        </div>
        <div className="mt-4 space-y-2">
          {realLeaderboard.length === 0 ? (
            <p className="py-4 text-center text-xs text-muted-foreground">No active users on the leaderboard yet.</p>
          ) : (
            realLeaderboard.map((p, i) => (
              <motion.div key={p.userCode || p.name} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                className={cn("flex items-center gap-4 rounded-xl border px-4 py-3 transition-colors",
                  p.you ? "border-primary/40 bg-primary-soft/50 font-bold" : "border-border hover:bg-muted/30")}>
                <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg font-display text-sm font-bold",
                  p.rank === 1 ? "bg-amber-soft text-amber-brand" :
                  p.rank === 2 ? "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200" :
                  p.rank === 3 ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" :
                  "bg-muted text-muted-foreground")}>
                  {p.rank}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {p.name} {p.you && <span className="ml-1 text-xs font-medium text-primary">(you)</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">{p.streak}-day streak</p>
                </div>
                <span className="shrink-0 font-display text-sm font-bold text-primary">{p.hours}h</span>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="card-surface w-full max-w-md space-y-5 border border-border p-6 shadow-lift">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="flex items-center gap-2 font-display text-lg font-bold">
                  <UserPlus className="h-5 w-5 text-primary" /> Invite Friends
                </h3>
                <button onClick={() => setShowInviteModal(false)} className="rounded-lg p-1 hover:bg-muted">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-1 rounded-xl border border-primary/30 bg-primary-soft/20 p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your 5-Digit Friend ID</p>
                <p className="font-display text-4xl font-extrabold tracking-[0.3em] text-primary">{myUserCode}</p>
                <p className="text-[11px] text-muted-foreground">Share this — friends type it to add you instantly.</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Room Link</label>
                <div className="flex gap-2">
                  <input readOnly value={inviteUrl} className="w-full rounded-xl border border-input bg-card px-3 py-2 text-xs outline-none" />
                  <button onClick={() => { navigator.clipboard.writeText(inviteUrl); toast.success("Copied!"); }}
                    className="btn-gradient flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold">
                    <Copy className="h-3.5 w-3.5" /> Copy
                  </button>
                </div>
              </div>
              <div className="space-y-2 border-t border-border pt-2">
                <p className="text-xs font-semibold text-muted-foreground">Share via</p>
                <div className="grid grid-cols-2 gap-3">
                  <a href={`https://api.whatsapp.com/send?text=${waMsg}`} target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white transition-colors hover:bg-emerald-700">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                  <button onClick={() => { navigator.clipboard.writeText(`My VediQ ID: ${myUserCode}`); toast.success("Copied!"); }}
                    className="flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/60 py-2.5 text-xs font-bold transition-colors hover:bg-muted">
                    <Share2 className="h-4 w-4" /> Copy Text
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
