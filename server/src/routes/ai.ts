import { Router, Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();
const getGenAI = (): GoogleGenerativeAI | null => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

// Generate Plan
router.post("/generate-plan", async (req: Request, res: Response) => {
  try {
    const { goals, examDate } = req.body;
    if (!goals) {
      return res.status(400).json({ error: "Missing goals" });
    }

    const genAI = getGenAI();
    if (genAI) {
      const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
      const model = genAI.getGenerativeModel({ model: modelName });
      const prompt = `You are a professional student advisor and study coach.
Create a structured weekly study plan based on the goals: "${goals}"${examDate ? ` and targeted for an exam on ${examDate}` : ""}.
Provide 3-5 key focus areas, study slot recommendations, and specific topics to cover. Keep it concise, structured, and student-focused.`;
      
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return res.status(200).json({ ok: true, planId: "plan_" + Date.now(), plan: text });
    } else {
      // Simulation mode
      const simulatedText = `**VediQ AI Study Planner (Simulation Mode)**
Based on your goals: *${goals}*, here is your optimized revision plan:
1. **Morning Focus Blocks (06:45 - 08:15):** Data Structures (Tree rotations, Graph traversals) - *Peak brain efficiency slots*.
2. **Afternoon Spaced Repetition (14:30 - 15:15):** Machine Learning (Gradient boosting, regularization formulas).
3. **Evening Synthesis (20:15 - 21:00):** Operating Systems paper summary & flashcard drills.
*Note: To enable real Gemini generation, add your GEMINI_API_KEY to server/.env.*`;
      return res.status(200).json({ ok: true, planId: "plan_sim", plan: simulatedText });
    }
  } catch (error) {
    console.error("AI Generate Plan error:", error);
    return res.status(500).json({ error: "Failed to generate study plan" });
  }
});

// Summarize Notes
router.post("/summarize-notes", async (req: Request, res: Response) => {
  try {
    const { text, fileName } = req.body;
    if (!text && !fileName) {
      return res.status(400).json({ error: "Missing notes content or filename" });
    }

    const contentToSummarize = text || `Content from file ${fileName}`;

    const genAI = getGenAI();
    if (genAI) {
      const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
      const model = genAI.getGenerativeModel({ model: modelName });
      const prompt = `Summarize the following student notes in a concise study-friendly format. Use bullet points for key takeaways, define any complex terminology, and add a quick 'exam tip':\n\n${contentToSummarize}`;
      
      const result = await model.generateContent(prompt);
      const summary = result.response.text();
      return res.status(200).json({ ok: true, summary });
    } else {
      // Simulation mode
      const simulatedSummary = `### **AI Notes Summary (Simulation Mode)**
*Source: ${fileName || "Text Paste"}*

**Key Takeaways:**
* **Gradient Boosting:** An ensemble ML technique that builds trees sequentially. Each new tree corrects errors made by previous trees.
* **Red-Black Trees:** Self-balancing binary search trees. Guarantee $O(\\log n)$ time complexity for search, insertion, and deletion.
* **Page Replacement:** Operating system memory management technique (e.g., LRU, FIFO) used when a page fault occurs.

**Exam Tip:** Be prepared to trace tree rotations and calculate learning rates on final papers!
*Note: To enable real Gemini generation, add your GEMINI_API_KEY to server/.env.*`;
      return res.status(200).json({ ok: true, summary: simulatedSummary });
    }
  } catch (error) {
    console.error("AI Summarize Notes error:", error);
    return res.status(500).json({ error: "Failed to summarize notes" });
  }
});

// Generate Quiz
router.post("/generate-quiz", async (req: Request, res: Response) => {
  try {
    const { topic, count, context } = req.body;
    if (!topic && !context) {
      return res.status(400).json({ error: "Missing quiz topic or context" });
    }
    const qCount = count || 3;

    const genAI = getGenAI();
    if (genAI) {
      const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
      const model = genAI.getGenerativeModel({ model: modelName });
      
      let prompt = "";
      if (context) {
        prompt = `You are an examiner. Generate an interactive quiz with exactly ${qCount} multiple-choice questions based on the following study notes context:\n\n"${context}"\n\nOutput ONLY a JSON array, with no markdown tags (no \`\`\`json blocks), in the following structure:
[
  {
    "question": "The question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answerIndex": 0
  }
]`;
      } else {
        prompt = `You are an examiner. Generate an interactive quiz with exactly ${qCount} multiple-choice questions about the topic: "${topic}".
Output ONLY a JSON array, with no markdown tags (no \`\`\`json blocks), in the following structure:
[
  {
    "question": "The question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answerIndex": 0
  }
]`;
      }
      
      const result = await model.generateContent(prompt);
      let responseText = result.response.text().trim();
      
      // Clean up markdown wrapper if model accidentally outputs it
      if (responseText.startsWith("```json")) {
        responseText = responseText.replace("```json", "").replace("```", "").trim();
      } else if (responseText.startsWith("```")) {
        responseText = responseText.replace(/```/g, "").trim();
      }

      const quizData = JSON.parse(responseText);
      return res.status(200).json({ ok: true, quiz: quizData });
    } else {
      // Simulation mode
      const simulatedQuiz = [
        {
          question: `In the context of ${topic || "your notes"}, which of the following best describes its core purpose?`,
          options: [
            "To optimize compute resources during high load",
            "To structure complex problem solving patterns",
            "To minimize error margins sequentially",
            "All of the above"
          ],
          answerIndex: 3
        },
        {
          question: `Which metric is typically used to evaluate the efficiency of a ${topic || "your notes"} algorithm?`,
          options: [
            "Big O time/space complexity",
            "F1 focus score ratio",
            "Memory footprint in bytes",
            "Latency of first response"
          ],
          answerIndex: 0
        }
      ];
      return res.status(200).json({ ok: true, quiz: simulatedQuiz });
    }
  } catch (error) {
    console.error("AI Generate Quiz error:", error);
    return res.status(500).json({ error: "Failed to generate quiz questions" });
  }
});

// Chatbot
router.post("/chatbot", async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    const genAI = getGenAI();
    if (genAI) {
      const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
      const model = genAI.getGenerativeModel({ model: modelName });
      
      // Translate frontend history layout to Gemini format
      const formattedHistory = (history || []).map((h: { role: string; text: string }) => ({
        role: h.role === "ai" ? "model" : "user",
        parts: [{ text: h.text }],
      }));

      const chat = model.startChat({
        history: formattedHistory,
        systemInstruction: {
          role: "user",
          parts: [{ text: "You are VediQ's AI Study Assistant. Help the student with conceptual study questions, scheduling advice, active recall, and study science. Keep replies engaging, encouraging, and under 4 sentences." }],
        },
      });

      const result = await chat.sendMessage(message);
      const text = result.response.text();
      return res.status(200).json({ ok: true, reply: text });
    } else {
      // Simulation mode
      let reply = `That is an interesting question about study habits! In general, breaking study blocks into 25-minute Pomodoro sessions helps maximize your attention span. Would you like me to generate a quick active recall quiz to test your memory?`;
      if (message.toLowerCase().includes("boosting")) {
        reply = `Gradient boosting builds trees sequentially, fitting each new model to the residual errors of the previous ones. This differs from Random Forests, which build trees in parallel.`;
      } else if (message.toLowerCase().includes("rotation")) {
        reply = `Red-Black tree rotations (Left or Right) are done during insertion/deletion to preserve the balancing properties, ensuring search operations remain O(log n).`;
      }
      return res.status(200).json({ ok: true, reply });
    }
  } catch (error) {
    console.error("AI Chatbot error:", error);
    return res.status(500).json({ error: "Failed to connect to AI assistant" });
  }
});

export default router;
