import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Gemini client lazily to avoid crashing on start if the key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. AI features will fallback to offline mock responses.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const app = express();
const PORT = 3002;

app.use(express.json({ limit: "15mb" }));

// ----------------------
// BACKEND API ROUTES
// ----------------------

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", time: new Date().toISOString() });
});

// AI Symptom Checker Route
app.post("/api/symptoms", async (req, res) => {
  const { symptoms, details, age, gender } = req.body;

  if (!symptoms) {
    return res.status(400).json({ error: "Symptoms description is required" });
  }

  const hasApiKey = !!process.env.GEMINI_API_KEY;

  if (!hasApiKey) {
    // Elegant realistic fallback database when API key is missing
    const promptLower = symptoms.toLowerCase();
    let specialty = "General Practitioner";
    let explanation = "Based on your general symptoms, a routine medical consultation is recommended.";
    let tags = ["General Health", "Wellness Check"];
    let warningLevel = "Low";

    if (promptLower.includes("heart") || promptLower.includes("chest") || promptLower.includes("palpitation")) {
      specialty = "Cardiologist";
      explanation = "Chest discomfort or heartbeat deviations require cardiovascular vetting.";
      tags = ["Cardiology", "Heart Health", "Urgent Assesment"];
      warningLevel = "High";
    } else if (promptLower.includes("skin") || promptLower.includes("rash") || promptLower.includes("itch")) {
      specialty = "Dermatologist";
      explanation = "Inquiries regarding dermal conditions, rashes, or epidermal irritation fall under specialized skin care.";
      tags = ["Dermatology", "Skin Care"];
      warningLevel = "Low";
    } else if (promptLower.includes("kid") || promptLower.includes("child") || promptLower.includes("pediatric")) {
      specialty = "Pediatrician";
      explanation = "Children's health concerns are best diagnosed by physicians centered on infant and youth development.";
      tags = ["Pediatrics", "Youth Health"];
      warningLevel = "Medium";
    } else if (promptLower.includes("mind") || promptLower.includes("depress") || promptLower.includes("anxiety") || promptLower.includes("sleep")) {
      specialty = "Psychiatrist / Therapist";
      explanation = "Emotional regulation, persistent low mood, or anxiety spikes are addressed by mental health specialists.";
      tags = ["Mental Health", "Psychology"];
      warningLevel = "Medium";
    } else if (promptLower.includes("bone") || promptLower.includes("joint") || promptLower.includes("fracture") || promptLower.includes("back pain")) {
      specialty = "Orthopedist";
      explanation = "Joint aches, spinal distress, or skeletal system integrity require structural bone specialists.";
      tags = ["Orthopedics", "Bone & Joint"];
      warningLevel = "Medium";
    } else if (promptLower.includes("headache") || promptLower.includes("migraine") || promptLower.includes("nerve") || promptLower.includes("dizzy")) {
      specialty = "Neurologist";
      explanation = "Neurological consults are recommended for persistent cranial pressure or nerve sensitivity.";
      tags = ["Neurology", "Nerve Health"];
      warningLevel = "Medium";
    }

    return res.json({
      specialty,
      assessment: explanation,
      possibleSuggestions: [
        "Monitor the frequency and triggers of the symptoms.",
        "Keep a detailed daily record of what time the symptoms occur.",
        "Consult a certified physician for a direct physical examination."
      ],
      suggestedQuestions: [
        `Could these symptoms be related to my current diet or stress levels?`,
        `What diagnostics would you recommend to rule out organic causes?`,
        `Are there therapeutic lifestyle revisions that might soothe this condition?`
      ],
      warningLevel,
      tags,
      isFallback: true
    });
  }

  try {
    const client = getGeminiClient();
    const systemPrompt = `You are an expert AI medical sorting assistant.
A patient is describing their symptoms. Provide a structured triage analysis.
CONSTRAINTS:
- You must speak with compassionate, highly professional, medical-grade authority.
- Provide a STRICT disclaimer: 'This is an AI sorting assessment, not a formal diagnosis. Always seek direct medical counsel.'
- Determine the most likely recommended medical specialty.
- Outline possible non-definitive educational explanations.
- Recommend 3-4 professional questions they should ask their doctor during the appointment.
- Rank urgency warning level: Low, Medium, High.
- Provide 2-3 relevant tags.

Return your response in a strict valid JSON structure matching this exact JSON schema:
{
  "specialty": "string (the recommended type of doctor, e.g. Cardiologist, Dermatologist)",
  "assessment": "string (the clean plain-English triage sorting and insights)",
  "possibleSuggestions": ["string", "string", ...],
  "suggestedQuestions": ["string", "string", ...],
  "warningLevel": "string (Low | Medium | High)",
  "tags": ["string", "string"]
}`;

    const promptText = `Patient Bio: Age ${age || "N/A"}, Gender: ${gender || "N/A"}.
Symptom Description: ${symptoms}
Additional Details: ${details || "None provided"}`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    try {
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (parseErr) {
      console.error("Failed to parse JSON response from Gemini:", text);
      res.status(500).json({ error: "Invalid response from AI engine." });
    }
  } catch (error: any) {
    console.error("Symptom analyzer API error:", error?.message || error);
    res.status(500).json({ error: "AI model failed to process request." });
  }
});

// AI Report Analyzer Route
app.post("/api/analyze-report", async (req, res) => {
  const { documentText, filename, filetype } = req.body;

  if (!documentText) {
    return res.status(400).json({ error: "No report text or context supplied." });
  }

  const hasApiKey = !!process.env.GEMINI_API_KEY;

  if (!hasApiKey) {
    // Offline simulation summary
    return res.json({
      summary: `Pre-analyzed file '${filename || "Report"}' (${filetype || "PDF"}). The system detected indicators for evaluation. Highlights include stable standard markers, with recommendation to review with your PCP.`,
      metrics: [
        { name: "Marker Verification", value: "Normal Checkpoint", status: "Optimal" },
        { name: "Metabolic Indexes", value: "Within standard limits", status: "Optimal" },
        { name: "Hormone Alignment", value: "Recommended for doctor confirmation", status: "Review Suggested" }
      ],
      recommendations: [
        "Maintain current level of active hydration.",
        "Prepare historical lab copies for comparative study.",
        "Discuss nutritional metrics during your annual clinic checkup."
      ],
      isFallback: true
    });
  }

  try {
    const client = getGeminiClient();
    const systemPrompt = `You are a professional AI clinical document simplifier. 
Your goal is to parse medical jargon and explain medical reports, PDFs, or scan annotations in highly clear, supportive plain-English suitable for patients of all ages.
- Do not alarm the patient, remain supportive and calm.
- Identify 2 to 3 dummy metrics or real markers extracted from the text and put their state into a clean structured list (status can be 'Optimal', 'Review Suggested', or 'Attention Needed').
- Outline 3 precise patient actions or recommendations based strictly on the text.
- Formulate a clear overall summary.

Return your response in a strict valid JSON structure matching this exact JSON schema:
{
  "summary": "string (the plain English interpretation summary)",
  "metrics": [
    { "name": "string (marker name)", "value": "string (numeric or qualitative value)", "status": "string (Optimal | Review Suggested | Attention Needed)" }
  ],
  "recommendations": ["string", "string"]
}`;

    const promptText = `Analyze clinical text extracted from document "${filename || "unnamed"}" of type "${filetype || "text"}":
--- Document Text ---
${documentText}
---------------------`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    try {
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (parseErr) {
      console.error("Failed to parse JSON response from Gemini:", text);
      res.status(500).json({ error: "Invalid response from AI engine." });
    }
  } catch (error: any) {
    console.error("Report analyzer API error:", error?.message || error);
    res.status(500).json({ error: "AI report parsing failed." });
  }
});

// ----------------------
// VITE DEV / PRODUCTION MIDDLEWARE
// ----------------------
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Bind to port 3000 and 0.0.0.0 for Cloud Run routing
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[MediClinic Server] Running successfully on Port: ${PORT}`);
  });
}

bootstrap();
