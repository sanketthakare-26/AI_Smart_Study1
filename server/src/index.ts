import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./routes/auth.js";
import alarmsRouter from "./routes/alarms.js";
import studyRouter from "./routes/study.js";
import aiRouter from "./routes/ai.js";
import mlRouter from "./routes/ml.js";
import { connectDB } from "./db.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB database
connectDB();

import { createServer } from "http";
import { Server } from "socket.io";
import { startCron } from "./cron/digest.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server
const httpServer = createServer(app);

// Integrate Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// ── Server-side state ──────────────────────────────────────────────────────
interface StudyRoom {
  id: string;
  name: string;
  topic: string;
  createdBy: string;
  live: boolean;
  memberCount: number;
}

interface GlobalUser {
  socketId: string;
  name: string;
  userCode?: string;
  hours?: number;
  streak?: number;
  active?: boolean;
}

const serverRooms: StudyRoom[] = [
  { id: "room_ml_101", name: "Machine Learning & AI Focus", topic: "Neural Networks & Deep Learning", createdBy: "VediQ System", live: true, memberCount: 1 },
  { id: "room_dsa_202", name: "DSA & Algorithmic Problem Solving", topic: "Graphs, Trees & Dynamic Programming", createdBy: "VediQ System", live: true, memberCount: 1 },
  { id: "room_gate_303", name: "GATE / Exam Prep Lounge", topic: "Computer Networks & OS", createdBy: "VediQ System", live: true, memberCount: 1 }
];
const activeRoomUsers: Record<string, Array<{ socketId: string; name: string; userCode?: string }>> = {};
const globalUsers: GlobalUser[] = [];

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  // ── Send current room list to the newly connected client immediately ──
  socket.emit("room-list-update", serverRooms);

  // ── Register user as globally online ──
  socket.on("user-online", ({ name, userCode, hours, streak }: { name: string; userCode?: string; hours?: number; streak?: number }) => {
    const existing = globalUsers.find((u) => u.userCode === userCode || (userCode && u.userCode === userCode) || u.socketId === socket.id);
    if (!existing) {
      globalUsers.push({
        socketId: socket.id,
        name: name || "Student",
        userCode: userCode || `U-${Math.floor(1000 + Math.random() * 9000)}`,
        hours: hours || 0,
        streak: streak || 0,
        active: true,
      });
    } else {
      existing.socketId = socket.id;
      existing.name = name || existing.name;
      if (userCode) existing.userCode = userCode;
      if (hours !== undefined) existing.hours = hours;
      if (streak !== undefined) existing.streak = streak;
      existing.active = true;
    }
    io.emit("global-users-update", globalUsers);
    console.log(`🌐 ${name} online`);
  });

  // ── Create a new room — store on server, broadcast to EVERYONE ──
  socket.on("create-room", (room: StudyRoom) => {
    if (!serverRooms.find((r) => r.id === room.id)) {
      room.memberCount = 0;
      serverRooms.push(room);
      console.log(`🏫 Room created: ${room.name} by ${room.createdBy}`);
    }
    io.emit("room-list-update", serverRooms);   // send to ALL sockets
  });

  // Join a personal notification room
  socket.on("join-room", (userId: string) => {
    socket.join(userId);
    console.log(`👤 Socket ${socket.id} joined user room: ${userId}`);
  });

  // ── Join a collaborative study room ──
  socket.on("join-study-room", ({ roomId, userName, userCode }: { roomId: string; userName: string; userCode?: string }) => {
    socket.join(`study_${roomId}`);
    if (!activeRoomUsers[roomId]) activeRoomUsers[roomId] = [];
    if (!activeRoomUsers[roomId].some((u) => u.socketId === socket.id)) {
      activeRoomUsers[roomId].push({ socketId: socket.id, name: userName || "Student", userCode });
    }
    // Update memberCount in serverRooms
    const room = serverRooms.find((r) => r.id === roomId);
    if (room) room.memberCount = activeRoomUsers[roomId].length;
    console.log(`📚 ${userName} joined room: ${roomId}`);
    io.to(`study_${roomId}`).emit("room-users-update", activeRoomUsers[roomId]);
    io.emit("room-list-update", serverRooms);  // refresh member counts for all
  });

  // ── Leave a study room ──
  socket.on("leave-study-room", ({ roomId }: { roomId: string }) => {
    socket.leave(`study_${roomId}`);
    if (activeRoomUsers[roomId]) {
      activeRoomUsers[roomId] = activeRoomUsers[roomId].filter((u) => u.socketId !== socket.id);
      const room = serverRooms.find((r) => r.id === roomId);
      if (room) room.memberCount = activeRoomUsers[roomId].length;
      io.to(`study_${roomId}`).emit("room-users-update", activeRoomUsers[roomId]);
      io.emit("room-list-update", serverRooms);
    }
  });

  // Send real-time chat message inside study room
  socket.on("send-room-message", (data) => {
    const { roomId, message } = data;
    console.log(`💬 Message in ${roomId} from ${message.from}: ${message.text}`);
    io.to(`study_${roomId}`).emit("receive-room-message", message);
  });

  socket.on("disconnect", () => {
    console.log("🔌 Client disconnected:", socket.id);
    // Mark user as offline (active: false) instead of deleting them from leaderboard
    const user = globalUsers.find((u) => u.socketId === socket.id);
    if (user) {
      user.active = false;
      io.emit("global-users-update", globalUsers);
    }
    // Clean up user from active study rooms
    Object.keys(activeRoomUsers).forEach((roomId) => {
      if (activeRoomUsers[roomId].some((u) => u.socketId === socket.id)) {
        activeRoomUsers[roomId] = activeRoomUsers[roomId].filter((u) => u.socketId !== socket.id);
        io.to(`study_${roomId}`).emit("room-users-update", activeRoomUsers[roomId]);
      }
    });
  });
});

app.set("io", io);

// Start Nodemailer study digest cron scheduler
startCron();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/alarms", alarmsRouter);
app.use("/api/study", studyRouter);
app.use("/api/ai", aiRouter);
app.use("/api/ml", mlRouter);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", time: new Date() });
});

// Root path fallback
app.get("/", (req, res) => {
  res.send("NeuroWake AI Study Alarm Backend API");
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start listening
httpServer.listen(PORT, () => {
  console.log(`🚀 NeuroWake backend running on http://localhost:${PORT}`);
});
