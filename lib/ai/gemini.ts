import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  throw new Error("GEMINI_API_KEY not found in environment variables")
}

const genAI = new GoogleGenerativeAI(apiKey)

type EdgeDetail = {
  from: string
  to: string
  isConnected: boolean
  sharedCompany: boolean
  sharedEducation: boolean
  mutualFollow: boolean
  messages: number
  lastInteraction: string | null
}

export async function generatePathExplanation(data: {
  path: string[]
  totalStrength: number
  edges: EdgeDetail[]
  deterministicSummary: string
}) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  })

  // Compact context (cleaner for model + cheaper tokens)
  const relationshipContext = data.edges
    .map((edge) => {
      return `${edge.from} → ${edge.to} | 
SharedCompany:${edge.sharedCompany} 
SharedEducation:${edge.sharedEducation} 
MutualFollow:${edge.mutualFollow} 
Messages:${edge.messages}`
    })
    .join("\n")

  const prompt = `
You are an expert professional networking strategist.

The system has already generated a factual analysis of an introduction path.
Your job is to provide deeper strategic insight — NOT to repeat the base summary.

--------------------------------------------------

INTRODUCTION PATH:
${data.path.join(" → ")}

OVERALL STRENGTH:
${data.totalStrength.toFixed(2)}

BASE SYSTEM ANALYSIS:
${data.deterministicSummary}

RELATIONSHIP SIGNALS:
${relationshipContext}

--------------------------------------------------

Instructions:

• Build on the base analysis — do NOT restate it.
• Identify structural strengths and weaknesses.
• Clearly explain why the weakest link matters.
• Evaluate credibility of the introduction chain.
• Give a strategic recommendation:
  - Is this a smart introduction path?
  - Should the source strengthen a specific relationship first?

Tone:
Professional, analytical, confident, strategic.

Style:
Write 2–4 well-structured paragraphs.
No bullet points.
No data repetition.
No mentioning of raw fields.
No referencing JSON or system input.
`

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.6,      // Balanced creativity
      topP: 0.9,
      maxOutputTokens: 500,
    },
  })

  const response = await result.response
  const text = response.text()

  // Safety fallback (never return empty string)
  return text?.trim() || "Strategic analysis unavailable."
}
