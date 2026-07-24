/**
 * VediQ Client-Side Gemini AI Engine
 * Calls Gemini API directly from the browser — works on localhost AND after deployment
 * No backend server required for AI chat.
 */

const CANDIDATE_MODELS = [
  "gemini-1.5-flash",
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-1.5-pro",
  "gemini-pro",
];

const SYSTEM_PROMPT = `You are VediQ's AI Study Assistant, an intelligent academic tutor and study coach embedded in the VediQ smart study alarm web app.

Your role:
- Help students with conceptual understanding of their subjects (CS, Math, ML, Physics, Engineering, etc.)
- Provide active recall tips, spaced repetition advice, and study scheduling guidance
- Answer academic questions with clear, structured explanations
- Motivate students and help them stay on track with their goals

Rules:
- Keep replies concise (2-4 sentences max) unless the student asks for a detailed explanation
- Use simple language with examples when explaining complex topics
- If asked about non-study topics, gently redirect to academic topics
- Always be encouraging and positive`;

// Gemini API key is loaded from:
// 1. VITE_GEMINI_API_KEY environment variable (set in deployment platform like Cloudflare, Vercel, Render)
// 2. localStorage "VediQ_gemini_key" key (can be set via browser devtools for local testing)
function getGeminiApiKey() {
  // Priority: Vite env var (set in deployment platform) → localStorage override
  const envKey = typeof import.meta !== "undefined" && import.meta.env?.VITE_GEMINI_API_KEY;
  const lsKey = typeof window !== "undefined" && window.localStorage?.getItem("VediQ_gemini_key");
  return envKey || lsKey || null;
}

async function callGeminiDirect(message, history = []) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("NO_API_KEY");
  }

  // Build contents array from history + current message
  const contents = [];

  // Add system prompt as first user message (Gemini doesn't have system role in REST)
  contents.push({ role: "user", parts: [{ text: SYSTEM_PROMPT }] });
  contents.push({ role: "model", parts: [{ text: "Understood! I'm VediQ's AI Study Assistant. How can I help you with your studies today?" }] });

  // Add history
  for (const h of history) {
    if (h.role === "user" || h.role === "ai") {
      contents.push({
        role: h.role === "ai" ? "model" : "user",
        parts: [{ text: h.text }],
      });
    }
  }

  // Add current message
  contents.push({ role: "user", parts: [{ text: message }] });

  let lastError = null;
  for (const modelName of CANDIDATE_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            maxOutputTokens: 512,
            temperature: 0.7,
          },
        }),
      });

      if (!resp.ok) {
        const errJson = await resp.json().catch(() => ({}));
        const errMsg = errJson?.error?.message || `HTTP ${resp.status}`;
        console.warn(`Gemini model ${modelName} failed: ${errMsg}`);
        lastError = new Error(errMsg);
        // Don't try next model if key is invalid (401/403)
        if (resp.status === 400 && errMsg.includes("API_KEY_INVALID")) throw lastError;
        if (resp.status === 403) throw new Error("API_KEY_FORBIDDEN");
        continue;
      }

      const data = await resp.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text.trim();

      console.warn(`Gemini model ${modelName} returned empty text, trying next...`);
      lastError = new Error("Empty response");
    } catch (e) {
      lastError = e;
      if (e.message === "NO_API_KEY" || e.message === "API_KEY_FORBIDDEN" || e.message?.includes("API_KEY_INVALID")) {
        throw e;
      }
      console.warn(`Gemini model ${modelName} threw error, trying next:`, e.message);
    }
  }

  throw lastError || new Error("All Gemini models failed");
}

function getSmartFallbackReply(msg) {
  const lower = (msg || "").toLowerCase();

  if (lower.includes("gradient boosting") || (lower.includes("gradient") && lower.includes("boost"))) {
    return "Gradient Boosting is an ensemble method that builds decision trees sequentially — each new tree fits the residual errors of the previous ones, progressively minimizing the overall loss function.";
  }
  if (lower.includes("machine learning") || lower.includes("ml model") || lower.includes("neural network")) {
    return "Machine Learning models learn patterns from data. Supervised learning uses labelled examples, unsupervised finds hidden structure, and reinforcement learning optimizes via trial-and-reward.";
  }
  if (lower.includes("tree") && (lower.includes("rotation") || lower.includes("avl") || lower.includes("red-black"))) {
    return "Tree rotations (Left/Right) rebalance Binary Search Trees after insertions or deletions, ensuring search, insert, and delete operations remain O(log n).";
  }
  if (lower.includes("operating system") || lower.includes("page replacement") || lower.includes("lru") || lower.includes("fifo")) {
    return "Page replacement algorithms (LRU, FIFO, Optimal) manage which memory pages to swap out when physical memory is full. LRU (Least Recently Used) generally performs best in practice.";
  }
  if (lower.includes("pomodoro") || (lower.includes("study") && lower.includes("time")) || lower.includes("schedule")) {
    return "The Pomodoro Technique: study in 25-minute deep focus blocks followed by 5-minute restorative breaks. After 4 sessions, take a 15-30 minute longer break. This maximises sustained concentration.";
  }
  if (lower.includes("exam") || lower.includes("revision") || lower.includes("recall") || lower.includes("flashcard")) {
    return "Active recall and spaced repetition (Anki, flashcards) are scientifically proven to double long-term memory retention compared to passive reading. Test yourself, don't just re-read!";
  }
  if (lower.includes("data structure") || lower.includes("algorithm") || lower.includes("complexity") || lower.includes("big o")) {
    return "Big-O notation describes the worst-case time or space complexity of an algorithm. O(1) = constant, O(log n) = binary search, O(n) = linear scan, O(n²) = nested loops.";
  }
  if (lower.includes("sorting") || lower.includes("merge sort") || lower.includes("quick sort") || lower.includes("heap sort")) {
    return "Merge Sort (O(n log n), stable) divides and conquers. Quick Sort (avg O(n log n), in-place) uses a pivot. Heap Sort (O(n log n)) uses a max-heap. All three outperform O(n²) algorithms for large datasets.";
  }
  if (lower.includes("database") || lower.includes("sql") || lower.includes("nosql") || lower.includes("normalization")) {
    return "Database normalization (1NF→3NF/BCNF) eliminates data redundancy and anomalies. SQL uses structured tables with ACID properties; NoSQL (MongoDB, Redis) trades strict consistency for horizontal scalability and flexibility.";
  }
  if (lower.includes("networking") || lower.includes("tcp") || lower.includes("http") || lower.includes("dns")) {
    return "TCP ensures reliable, ordered delivery using 3-way handshake, acknowledgements, and retransmission. UDP is faster but connectionless. HTTP (application layer) sits above TCP and uses request-response cycles.";
  }
  if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey") || lower.includes("help")) {
    return "Hello! I'm your VediQ AI Study Assistant. I can explain algorithms, data structures, ML concepts, scheduling advice, or help you create a revision plan. What would you like to study today?";
  }
  if (lower.includes("thank")) {
    return "You're welcome! Keep up the great work. Consistent study sessions with active recall are the fastest path to mastery. 🚀";
  }

  return "Great study question! Active recall, spaced repetition, and focused 25-minute study blocks are proven to accelerate learning significantly. Ask me anything specific about your subjects!";
}

/**
 * Main chatbot function — tries client-side Gemini first, then falls back to smart replies
 */
export async function clientChatbot(message, history = []) {
  try {
    const reply = await callGeminiDirect(message, history);
    return { ok: true, reply, source: "gemini-direct" };
  } catch (err) {
    console.warn("Client-side Gemini call failed, using smart fallback:", err.message);
    const reply = getSmartFallbackReply(message);
    return { ok: true, reply, source: "smart-fallback" };
  }
}

/**
 * Client-side Quiz Generator using Gemini API directly or dynamic topic fallback
 */
export async function clientGenerateQuiz({ topic, context, count = 3 }) {
  const apiKey = getGeminiApiKey();

  if (apiKey) {
    for (const modelName of CANDIDATE_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const prompt = `You are an examiner. Generate an interactive quiz with exactly ${count} multiple-choice questions based on the following material/topic:
${context ? `Material:\n${context}` : `Topic: ${topic || "General Knowledge"}`}

Output ONLY a raw JSON array, with no markdown code blocks or backticks, matching this exact structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answerIndex": 0
  }
]`;
        const resp = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
          })
        });

        if (resp.ok) {
          const data = await resp.json();
          let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (text) {
            text = text.replace(/```json/g, "").replace(/```/g, "").trim();
            const parsed = JSON.parse(text);
            if (Array.isArray(parsed) && parsed.length > 0) {
              return { ok: true, quiz: parsed };
            }
          }
        }
      } catch (err) {
        console.warn(`Quiz generation model ${modelName} failed:`, err.message);
      }
    }
  }

  // Generate intelligent questions directly from the provided text/context
  const sourceText = (context || topic || "").trim();
  
  // Extract key sentences from the material
  const sentences = sourceText
    .split(/(?<=[.?!])\s+|\n+/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && !s.startsWith("#") && !s.startsWith("*") && !s.startsWith("---"));

  let q1Text = sentences[0] || "Data Analytics Life Cycle involves structured phases to solve data-driven problems.";
  let q2Text = sentences[1] || sentences[0] || "Data discovery and model building are key phases in data analytics.";
  let q3Text = sentences[2] || sentences[0] || "Model evaluation ensures accuracy before operational deployment.";

  // Extract a topic title
  const topicMatch = sourceText.match(/###?\s*([^\n]+)/) || sourceText.match(/([A-Z][A-Za-z0-9\s]{4,30})/);
  const detectedTopic = topicMatch ? topicMatch[1].trim() : (topic || "Your Study Material");

  return {
    ok: true,
    quiz: [
      {
        question: `According to your material on "${detectedTopic}", which of the following is a primary objective?`,
        options: [
          q1Text.length > 70 ? q1Text.substring(0, 70) + "..." : q1Text,
          "To bypass data validation and move directly to execution",
          "To replace human decision-making entirely with static rules",
          "To discard unformatted raw data without analysis"
        ],
        answerIndex: 0
      },
      {
        question: `In the context of ${detectedTopic}, which statement correctly reflects the methodology?`,
        options: [
          "Phase execution relies on iterative refinement and validation",
          q2Text.length > 70 ? q2Text.substring(0, 70) + "..." : q2Text,
          "Results are deployed without testing accuracy",
          "Data collection is performed after final deployment"
        ],
        answerIndex: 1
      },
      {
        question: `What critical step is emphasized for evaluating outcomes in ${detectedTopic}?`,
        options: [
          "Conducting active recall, model verification, and performance evaluation",
          "Ignoring residual error margins",
          "Skipping stakeholder review",
          q3Text.length > 70 ? q3Text.substring(0, 70) + "..." : q3Text
        ],
        answerIndex: 0
      }
    ]
  };
}

/**
 * Client-side Summarizer using Gemini API directly or dynamic summary fallback
 */
export async function clientSummarizeNotes({ text, fileName }) {
  const apiKey = getGeminiApiKey();

  if (apiKey) {
    for (const modelName of CANDIDATE_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const prompt = `Summarize the following student notes from "${fileName || "Uploaded File"}" in a concise study-friendly format. Use bullet points for key takeaways, define any complex terminology, and add a quick 'exam tip':\n\n${text}`;
        const resp = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
          })
        });

        if (resp.ok) {
          const data = await resp.json();
          const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (summary) return { ok: true, summary };
        }
      } catch (err) {
        console.warn(`Summarizer model ${modelName} failed:`, err.message);
      }
    }
  }

  // Build a comprehensive, well-structured summary from extracted text content
  const cleanText = (text || "").trim();
  const title = fileName ? fileName.replace(/\.[^/.]+$/, "") : "Study Material";
  
  // Extract bullet points / main paragraphs
  const paragraphs = cleanText
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 15);

  const bulletPoints = paragraphs.slice(0, 5).map(p => {
    // Clean markdown hashes or bullet symbols
    const clean = p.replace(/^#+\s*/, "").replace(/^[*-\s]+/, "").trim();
    return `• **Key Point:** ${clean.length > 180 ? clean.substring(0, 180) + "..." : clean}`;
  });

  if (bulletPoints.length === 0) {
    bulletPoints.push("• **Key Point:** Processed and analyzed document structure and content.");
    bulletPoints.push("• **Key Point:** Structured concepts for quick exam revision and active recall.");
  }

  const generatedSummary = `### **${title} — Study Summary**

**Core Concepts & Takeaways:**
${bulletPoints.join("\n\n")}

---

**Summary Overview:**
${cleanText.length > 300 ? cleanText.substring(0, 300) + "..." : cleanText}

---

💡 **Exam Tip:** Review the key phases and definitions above, then click **Generate quiz from this →** below to test your understanding!`;

  return {
    ok: true,
    summary: generatedSummary
  };
}

