<div align="center">

<img src="https://img.shields.io/badge/NeuroWake-AI%20Smart%20Study%20%26%20Alarm%20System-6366f1?style=for-the-badge&logo=brain&logoColor=white" />

# 🧠 NeuroWake — AI Smart Study Planner

**An alarm that understands your brain, not just your clock.**

Adaptive wake prediction · AI study planning · Focus analytics · Real-time collaboration

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TanStack](https://img.shields.io/badge/TanStack_Start-Latest-ff4154?style=flat-square)](https://tanstack.com/start)
[![Firebase](https://img.shields.io/badge/Firebase_Auth-Enabled-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-ML_Service-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![Gemini](https://img.shields.io/badge/Google_Gemini-AI_Planner-4285F4?style=flat-square&logo=google)](https://ai.google.dev)

</div>

---

## 📌 Overview

**NeuroWake** is a full-stack capstone project that combines a custom ML sleep model, Google Gemini AI, and real-time collaboration to help students optimise both their mornings and their study sessions.

- 🔔 **Smart Alarms** — ML model predicts your lightest sleep phase and rings at the optimal moment within your chosen wake window
- 🎯 **Snooze Risk Score** — Live prediction before each alarm triggers progressive volume and puzzle dismissal when risk is high
- 📅 **AI Study Planner** — Google Gemini generates spaced-repetition schedules around your real focus data and exam deadlines
- 💬 **AI Learning Assistant** — Chat with your notes, generate quizzes, summarise PDFs, build flashcards in seconds
- 📊 **Study Analytics** — Sleep-vs-focus correlation heatmaps, subject mastery radar charts, and trend lines
- 🌤️ **Weather & Traffic Buffers** — Alarm shifts earlier automatically on bad travel days
- 👥 **Study Rooms** — Real-time collaborative study sessions powered by Socket.io

---

## 🏗️ Project Architecture

```
AI Study Alarm/
├── client/                     # Frontend — TanStack Start (React + Vite, pure JS/JSX)
│   ├── src/
│   │   ├── routes/             # File-based routing (TanStack Router)
│   │   │   ├── __root.jsx      # Root layout + AuthProvider wrapper
│   │   │   ├── index.jsx       # Landing page
│   │   │   ├── login.jsx       # Firebase Email + Google login
│   │   │   ├── register.jsx    # Firebase Email + Google register
│   │   │   ├── forgot-password.jsx
│   │   │   ├── otp.jsx
│   │   │   └── app/            # Protected dashboard routes
│   │   │       ├── app.jsx     # Auth guard + AppShell layout
│   │   │       ├── app.index.jsx       # Dashboard overview
│   │   │       ├── app.alarms.jsx      # Smart alarm manager
│   │   │       ├── app.planner.jsx     # AI study planner
│   │   │       ├── app.ai.jsx          # AI tools & chatbot
│   │   │       ├── app.analytics.jsx   # Focus analytics
│   │   │       └── app.rooms.jsx       # Study rooms (live)
│   │   ├── components/
│   │   │   ├── AppShell.jsx    # Sidebar + topbar (Firebase user, logout)
│   │   │   ├── AuthLayout.jsx  # Split-screen auth wrapper
│   │   │   └── ui/             # shadcn/ui component library (JSX)
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Firebase auth state + provider
│   │   ├── lib/
│   │   │   ├── firebase.js     # Firebase app init + auth + Google provider
│   │   │   ├── mock-data.js    # Demo data for UI development
│   │   │   └── utils.js        # cn() + helpers
│   │   ├── api/
│   │   │   └── client.js       # Axios instance — auto-injects Firebase ID tokens
│   │   └── styles.css          # Global design system (Tailwind v4 CSS vars)
│   ├── vite.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── server/                     # Backend — Node.js + Express + TypeScript
│   ├── src/
│   │   ├── index.ts            # Express app entry, Socket.io setup
│   │   ├── db.ts               # MongoDB/Mongoose connection
│   │   ├── models/
│   │   │   ├── User.ts         # Firebase UID as primary key
│   │   │   ├── AlarmLog.ts
│   │   │   ├── StudySession.ts
│   │   │   ├── StudyPlan.ts
│   │   │   └── Flashcard.ts
│   │   ├── routes/
│   │   │   ├── auth.ts         # User profile sync
│   │   │   ├── alarms.ts       # Alarm CRUD + snooze risk
│   │   │   ├── study.ts        # Study sessions
│   │   │   ├── planner.ts      # Gemini AI study plan
│   │   │   ├── flashcards.ts   # Spaced-repetition cards
│   │   │   └── analytics.ts    # Focus & sleep analytics
│   │   └── middleware/
│   │       └── auth.ts         # Firebase ID token verification (RS256 JWKS)
│   ├── .env
│   └── package.json
│
└── ml-service/                 # ML Service — Python + FastAPI
    ├── main.py                 # FastAPI app entry
    ├── models/
    │   ├── wake_predictor.py   # Sleep-phase wake window prediction
    │   └── snooze_risk.py      # Snooze risk score model
    ├── requirements.txt
    └── venv/
```

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TanStack Start, TanStack Router, Vite 8, Pure JS/JSX |
| **Styling** | Tailwind CSS v4, shadcn/ui components, Framer Motion, GSAP |
| **Authentication** | Firebase Auth (Email/Password + Google OAuth) |
| **State / Fetching** | TanStack Query (React Query) |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | MongoDB Atlas + Mongoose ODM |
| **Real-time** | Socket.io (study rooms & live notifications) |
| **ML Service** | Python, FastAPI, scikit-learn, uvicorn |
| **AI Planning** | Google Gemini API |
| **Charts** | Recharts |

---

## 🔐 Authentication Flow

```
User → Firebase Auth (Email/Password or Google popup)
     → Firebase issues ID Token (JWT, RS256)
     → Client injects token in every API request header
     → Server verifies token using Google JWKS public keys
     → Auto-creates/syncs MongoDB user profile on first login
     → Protected /app routes redirect to /login if unauthenticated
```

---

## 🗃️ MongoDB Schema Design

```js
// User
{ firebaseUid, name, email, preferences: { wakeWindowStart, wakeWindowEnd, dailyStudyHours },
  streak, badges: [String], createdAt }

// AlarmLog
{ userId, alarmSetTime, actualWakeTime, snoozeCount,
  sleepDurationPrevNight, dismissMethod, date }

// StudySession
{ userId, subject, startTime, endTime, durationMinutes,
  focusScoreSelfRated, breaksTaken, focusScoreComputed, date }

// StudyPlan
{ userId, examDate, syllabusTopics: [String],
  generatedPlan: [{ day, topic, hours }], generatedBy: "gemini" }

// Flashcard
{ userId, topic, question, answer, nextReviewDate, reviewInterval }
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- Python ≥ 3.10
- MongoDB Atlas account
- Firebase project with **Email/Password** and **Google** sign-in enabled

---

### 1. Clone the repository

```bash
git clone https://github.com/sanketthakare-26/AI-Smart-Study-Planner.git
cd AI-Smart-Study-Planner
```

---

### 2. Backend (`server/`)

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGO_URL=your_mongodb_atlas_connection_string
FIREBASE_PROJECT_ID=your_firebase_project_id
GEMINI_API_KEY=your_google_gemini_api_key
JWT_SECRET=any_random_secret_string
```

```bash
npm run dev        # starts on http://localhost:5000
```

---

### 3. ML Service (`ml-service/`)

```bash
cd ml-service
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn main:app --port 8000 --reload
```

---

### 4. Frontend (`client/`)

```bash
cd client
npm install
npm run dev        # starts on http://localhost:8081
```

---

### 5. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) → your project
2. **Authentication → Sign-in method** → Enable:
   - ✅ Email/Password
   - ✅ Google
3. Copy your Firebase config into `client/src/lib/firebase.js`

---

## 🌐 API Endpoints

All endpoints require `Authorization: Bearer <firebase-id-token>` header.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/auth/me` | Get current user profile |
| `GET/POST` | `/api/alarms` | List / create alarms |
| `GET/POST` | `/api/study/sessions` | Study session logs |
| `POST` | `/api/planner/generate` | Generate AI study plan (Gemini) |
| `GET/POST` | `/api/flashcards` | Flashcard CRUD |
| `GET` | `/api/analytics/focus` | Focus score over time |
| `GET` | `/api/analytics/sleep` | Sleep duration trend |
| `POST` | `/api/ml/snooze-risk` | Snooze risk prediction |
| `POST` | `/api/ml/wake-window` | Optimal wake window prediction |

---

## 🔌 Real-time Events (Socket.io)

| Event | Direction | Description |
|---|---|---|
| `join-room` | Client → Server | Join a study room |
| `leave-room` | Client → Server | Leave a study room |
| `room-update` | Server → Client | Room participant list update |
| `alarm-trigger` | Server → Client | Push alarm notification |
| `focus-update` | Client → Server | Broadcast live focus score |

---

## 📁 Environment Variables Reference

### `server/.env`

| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | Express server port (default: 5000) |
| `MONGO_URL` | Yes | MongoDB Atlas connection string |
| `FIREBASE_PROJECT_ID` | Yes | Your Firebase project ID |
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `JWT_SECRET` | Optional | Legacy JWT secret (unused when Firebase auth active) |

---

## 🛠️ Scripts

| Directory | Command | Description |
|---|---|---|
| `client/` | `npm run dev` | Start Vite dev server (port 8081) |
| `server/` | `npm run dev` | Start Express dev server with ts-node (port 5000) |
| `ml-service/` | `uvicorn main:app --port 8000` | Start FastAPI ML service |

---

## 👨‍💻 Author

**Sanket Thakare**

[![GitHub](https://img.shields.io/badge/GitHub-sanketthakare--26-181717?style=flat-square&logo=github)](https://github.com/sanketthakare-26)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ as a Capstone 2026 project · Powered by **Custom ML + Google Gemini**

</div>

#   A I _ S m a r t _ S t u d y 1  
 