var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};


const getStoredUser = () => {
      if (typeof window === "undefined") return null;
      try {
        const stored = window.localStorage.getItem("nw_user");
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        return null;
      }
    };
    const defaultUser = {
      id: "u_2481",
      name: "Student",
      email: "student@vedi.q",
      avatarInitials: "ST",
      streakDays: 0,
      focusScore: 84,
      sleepScore: 76,
      plan: "Free Student"
    };
    const currentUser = getStoredUser() || defaultUser;
    
    const alarms = [
      {
        id: "a1",
        label: "Morning Deep Work",
        time: "06:15",
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        enabled: true,
        adaptive: true,
        snoozeRisk: 22,
        wakeWindow: "06:05 \u2013 06:30",
        dismissMode: "Math Puzzle",
        buffers: ["Weather +10m", "Traffic +8m"]
      },
      {
        id: "a2",
        label: "DSA Exam Prep",
        time: "07:30",
        days: ["Sat", "Sun"],
        enabled: true,
        adaptive: true,
        snoozeRisk: 48,
        wakeWindow: "07:15 \u2013 07:45",
        dismissMode: "Pattern Puzzle",
        buffers: ["Weather +10m"]
      },
      {
        id: "a3",
        label: "Evening Revision",
        time: "18:00",
        days: ["Mon", "Wed", "Fri"],
        enabled: false,
        adaptive: false,
        snoozeRisk: 64,
        wakeWindow: "\u2014",
        dismissMode: "Standard",
        buffers: []
      }
    ];
    
    const alarmHistory = [
      { date: "Today", time: "06:18", label: "Morning Deep Work", result: "Woke on first ring", snoozes: 0, latency: "3 min" },
      { date: "Yesterday", time: "06:24", label: "Morning Deep Work", result: "Solved math puzzle", snoozes: 1, latency: "9 min" },
      { date: "Wed, Jul 8", time: "06:15", label: "Morning Deep Work", result: "Woke on first ring", snoozes: 0, latency: "1 min" },
      { date: "Tue, Jul 7", time: "07:41", label: "DSA Exam Prep", result: "Snoozed twice", snoozes: 2, latency: "26 min" },
      { date: "Mon, Jul 6", time: "06:12", label: "Morning Deep Work", result: "Woke inside optimal window", snoozes: 0, latency: "2 min" }
    ];
    
    const subjects = [
      { id: "s1", name: "Data Structures", color: "var(--chart-1)", hours: 24.5, mastery: 78, nextTopic: "Red-Black Trees", status: "revision", examDate: "" },
      { id: "s2", name: "Machine Learning", color: "var(--chart-2)", hours: 31.2, mastery: 64, nextTopic: "Gradient Boosting", status: "exam", examDate: "2026-07-28" },
      { id: "s3", name: "Operating Systems", color: "var(--chart-3)", hours: 14.8, mastery: 52, nextTopic: "Page Replacement", status: "preparation", examDate: "" },
      { id: "s4", name: "Discrete Math", color: "var(--chart-4)", hours: 9.3, mastery: 71, nextTopic: "Graph Coloring", status: "preparation", examDate: "" }
    ];
    
    const todayPlan = [
      { id: "t1", time: "06:45", title: "ML \u2014 Gradient Boosting notes", duration: "50 min", type: "Deep focus", done: true },
      { id: "t2", time: "08:00", title: "DSA \u2014 Tree rotation drills", duration: "45 min", type: "Practice", done: true },
      { id: "t3", time: "14:30", title: "OS \u2014 Scheduling flashcards", duration: "25 min", type: "Spaced repetition", done: false },
      { id: "t4", time: "17:00", title: "Mock quiz \u2014 Discrete Math", duration: "30 min", type: "Assessment", done: false },
      { id: "t5", time: "20:15", title: "ML \u2014 Paper summary with AI", duration: "40 min", type: "AI-assisted", done: false }
    ];
    
    const sessionHistory = [
      { id: "h1", subject: "Machine Learning", date: "Jul 10", duration: "1h 40m", focus: 91, pomodoros: 4 },
      { id: "h2", subject: "Data Structures", date: "Jul 10", duration: "55m", focus: 84, pomodoros: 2 },
      { id: "h3", subject: "Operating Systems", date: "Jul 9", duration: "1h 10m", focus: 72, pomodoros: 3 },
      { id: "h4", subject: "Discrete Math", date: "Jul 8", duration: "45m", focus: 88, pomodoros: 2 },
      { id: "h5", subject: "Machine Learning", date: "Jul 7", duration: "2h 05m", focus: 79, pomodoros: 5 }
    ];
    
    const sleepVsFocus = [
      { day: "Mon", sleep: 6.2, focus: 68 },
      { day: "Tue", sleep: 7.1, focus: 78 },
      { day: "Wed", sleep: 7.8, focus: 88 },
      { day: "Thu", sleep: 6.5, focus: 71 },
      { day: "Fri", sleep: 8, focus: 92 },
      { day: "Sat", sleep: 7.4, focus: 85 },
      { day: "Sun", sleep: 6.9, focus: 80 }
    ];
    
    const studyHours = [
      { week: "W1", hours: 14 },
      { week: "W2", hours: 18 },
      { week: "W3", hours: 16 },
      { week: "W4", hours: 22 },
      { week: "W5", hours: 20 },
      { week: "W6", hours: 26 }
    ];
    
    const focusTrend = [
      { date: "Jun 12", score: 62 },
      { date: "Jun 16", score: 68 },
      { date: "Jun 20", score: 65 },
      { date: "Jun 24", score: 74 },
      { date: "Jun 28", score: 71 },
      { date: "Jul 2", score: 79 },
      { date: "Jul 6", score: 83 },
      { date: "Jul 10", score: 84 }
    ];
    
    const monthlyProgress = [
      { month: "Feb", planned: 60, completed: 42 },
      { month: "Mar", planned: 70, completed: 55 },
      { month: "Apr", planned: 72, completed: 61 },
      { month: "May", planned: 80, completed: 68 },
      { month: "Jun", planned: 84, completed: 77 },
      { month: "Jul", planned: 88, completed: 81 }
    ];
    
    const heatmap = Array.from(
      { length: 12 },
      (_, w) => Array.from({ length: 7 }, (_2, d) => {
        const seed = (w * 7 + d * 13) % 17;
        if (seed < 3) return 0;
        if (seed < 7) return 1;
        if (seed < 11) return 2;
        if (seed < 15) return 3;
        return 4;
      })
    );
    
    const badges = [
      { id: "b1", name: "Early Riser", desc: "7 wake-ups inside the optimal window", icon: "sunrise", earned: true },
      { id: "b2", name: "Deep Diver", desc: "5 sessions above 90 focus score", icon: "brain", earned: true },
      { id: "b3", name: "Streak Master", desc: "14-day study streak", icon: "flame", earned: true },
      { id: "b4", name: "Quiz Champion", desc: "Score 90%+ on 10 AI quizzes", icon: "trophy", earned: false },
      { id: "b5", name: "Zero Snooze", desc: "One week without snoozing", icon: "alarm", earned: false },
      { id: "b6", name: "Night Owl Reformed", desc: "Shift bedtime earlier by 1 hour", icon: "moon", earned: true }
    ];
    
    const leaderboard = [
      { rank: 1, name: "Priya Nair", hours: 34.5, streak: 22, you: false },
      { rank: 2, name: "Aarav Sharma", hours: 31.2, streak: 17, you: true },
      { rank: 3, name: "Kenji Tanaka", hours: 29.8, streak: 15, you: false },
      { rank: 4, name: "Sara Malik", hours: 27.1, streak: 19, you: false },
      { rank: 5, name: "Diego Ruiz", hours: 24.6, streak: 9, you: false }
    ];
    
    const studyRooms = [
      { id: "r1", name: "ML Final Sprint", members: 6, online: 4, topic: "Machine Learning", live: true },
      { id: "r2", name: "DSA Grinders", members: 12, online: 7, topic: "Data Structures", live: true },
      { id: "r3", name: "OS Midnight Club", members: 4, online: 0, topic: "Operating Systems", live: false }
    ];
    
    const friends = [
      { id: "f1", name: "Priya Nair", status: "In focus session \u2014 ML", online: true },
      { id: "f2", name: "Kenji Tanaka", status: "Idle", online: true },
      { id: "f3", name: "Sara Malik", status: "In room: DSA Grinders", online: true },
      { id: "f4", name: "Diego Ruiz", status: "Offline", online: false }
    ];
    
    const roomChat = [
      { id: "m1", from: "Priya Nair", text: "Starting a 50-min pomodoro at :00, join in!", time: "14:52", me: false },
      { id: "m2", from: "Aarav Sharma", text: "In. Covering gradient boosting today.", time: "14:54", me: true },
      { id: "m3", from: "Kenji Tanaka", text: "Same \u2014 sharing my flashcard deck after.", time: "14:55", me: false }
    ];
    
    const testimonials = [
      { name: "Meera K.", role: "CS Undergrad, IIT Delhi", text: "My snooze count dropped from 4 to 0 in two weeks. The adaptive wake window is genuinely smart." },
      { name: "Jonas B.", role: "Med Student, Berlin", text: "The AI planner rebuilt my exam schedule around my actual focus data. It feels like having a coach." },
      { name: "Alicia T.", role: "Bootcamp Grad", text: "Notes summarizer + quiz generator turned my messy PDFs into a real revision system." }
    ];
    
    const faqs = [
      { q: "How does the adaptive wake prediction work?", a: "A custom ML model learns from your wake latency, snooze history, and sleep duration to predict the lightest phase of your sleep inside your wake window, then fires the alarm at the optimal moment." },
      { q: "What does the Snooze Risk Score mean?", a: "Before each alarm, the model estimates the probability you'll snooze based on bedtime, day of week, and past behavior. High risk automatically enables progressive volume and puzzle dismissal." },
      { q: "Is my study data used to train the AI?", a: "Your data stays on your account. Models are fine-tuned per user; nothing is shared across accounts." },
      { q: "Which AI powers the study tools?", a: "The learning assistant, summarizer, and quiz generator run on Google Gemini. Predictions (snooze risk, best study slot, focus score) run on custom ML models." },
      { q: "Does it work offline?", a: "Alarms and timers work offline. AI tools require a connection and gracefully queue requests until you're back online." }
    ];
    
    const landingStats = [
      { value: "38%", label: "fewer snoozes in week one" },
      { value: "2.4h", label: "extra deep-work hours weekly" },
      { value: "92%", label: "of plans completed on time" },
      { value: "15k+", label: "students onboard" }
    ];
    
    const notifications = [
      { id: "n1", title: "Snooze risk high tomorrow", body: "Late bedtime detected. Progressive alarm enabled for 06:15.", time: "2h ago", unread: true },
      { id: "n2", title: "Quiz ready", body: "Your ML flashcard deck generated 12 new questions.", time: "5h ago", unread: true },
      { id: "n3", title: "Streak milestone", body: "17 days! You unlocked the Streak Master badge.", time: "1d ago", unread: false }
    ];
export { currentUser, alarms, alarmHistory, subjects, todayPlan, sessionHistory, sleepVsFocus, studyHours, focusTrend, monthlyProgress, heatmap, badges, leaderboard, studyRooms, friends, roomChat, testimonials, faqs, landingStats, notifications };
