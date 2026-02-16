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

  const contextSection = data.edges
    .map((edge, index) => {
      return `
Connection ${index + 1}: ${edge.from} → ${edge.to}
- Shared Company: ${edge.sharedCompany}
- Shared Education: ${edge.sharedEducation}
- Mutual Follow: ${edge.mutualFollow}
- Total Messages: ${edge.messages}
- Last Interaction: ${edge.lastInteraction ?? "None"}
`
    })
    .join("\n")

  const prompt = `
You are a professional networking intelligence copilot.

Your job is to analyze introduction paths between professionals
and provide strategic insight.

-----------------------------------
INTRODUCTION PATH:
${data.path.join(" → ")}

OVERALL STRENGTH SCORE:
${data.totalStrength.toFixed(2)}

BASE SYSTEM SUMMARY:
${data.deterministicSummary}

RELATIONSHIP DETAILS:
${contextSection}
-----------------------------------

Write a high-quality professional analysis in natural paragraph form.

Your response must include:

1. Why this path is structurally strong or weak.
2. Which relationship is the critical bottleneck and why.
3. What shared context (company, education, interaction, follow patterns) strengthens credibility.
4. A strategic recommendation: Is this a smart introduction route?
5. If appropriate, suggest how to improve the weakest relationship before requesting the intro.

Tone:
- Professional
- Analytical
- Insightful
- Clear and confident

Do NOT repeat raw data.
Do NOT mention "JSON" or "data".
Do NOT list bullet points.
Write in cohesive paragraphs.
`

  const result = await model.generateContent(prompt)
  const response = await result.response

  return response.text()
}
