var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(async (config) => {
  try {
    const { getAuth } = await import("firebase/auth");
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    }
  } catch (e) {
    // Firebase not initialized yet
  }

  const token = typeof window !== "undefined" ? window.localStorage.getItem("nw_token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---------- Auth ----------
export const authApi = {
  register: async (payload) => {
    const res = await apiClient.post("/auth/register", payload);
    if (res.data.token) {
      localStorage.setItem("nw_token", res.data.token);
      localStorage.setItem("nw_userId", res.data.userId);
      localStorage.setItem("nw_user", JSON.stringify(res.data.user));
    }
    return res.data;
  },
  login: async (payload) => {
    const res = await apiClient.post("/auth/login", payload);
    if (res.data.token) {
      localStorage.setItem("nw_token", res.data.token);
      localStorage.setItem("nw_userId", res.data.userId);
      localStorage.setItem("nw_user", JSON.stringify(res.data.user));
    }
    return res.data;
  },
};

// ---------- Alarms ----------
export const alarmApi = {
  set: (payload) => apiClient.post("/alarms/set", payload).then((r) => r.data),
  list: (userId) => apiClient.get(`/alarms/${userId}`).then((r) => r.data),
  logWake: (payload) => apiClient.post("/alarms/log-wake", payload).then((r) => r.data),
};

// ---------- Study ----------
export const studyApi = {
  startSession: (payload) => apiClient.post("/study/session/start", payload).then((r) => r.data),
  endSession: (payload) => apiClient.post("/study/session/end", payload).then((r) => r.data),
  analytics: (userId) => apiClient.get(`/study/analytics/${userId}`).then((r) => r.data),
};

// ---------- AI (Google Gemini) ----------
export const aiApi = {
  generatePlan: (payload) => apiClient.post("/ai/generate-plan", payload).then((r) => r.data),
  summarizeNotes: (payload) => apiClient.post("/ai/summarize-notes", payload).then((r) => r.data),
  generateQuiz: (payload) => apiClient.post("/ai/generate-quiz", payload).then((r) => r.data),
  chatbot: (payload) => apiClient.post("/ai/chatbot", payload).then((r) => r.data),
};

// ---------- ML predictions ----------
const ML_DIRECT_URL = "http://localhost:8000";

async function mlDirect(path, payload) {
  const res = await fetch(`${ML_DIRECT_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`ML service returned ${res.status}`);
  return res.json();
}

export const mlApi = {
  predictSnoozeRisk: (payload) => mlDirect("/predict/snooze-risk", payload),
  predictBestSlot: (payload) => apiClient.post("/ml/predict/best-slot", payload).then((r) => r.data),
  predictFocusScore: (payload) => mlDirect("/predict/focus-score", payload),
  predictImageVerify: (payload) => mlDirect("/predict/image-verify", payload),
};
