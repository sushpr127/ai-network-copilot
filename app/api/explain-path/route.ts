import { NextRequest, NextResponse } from "next/server"
import { generatePathExplanation } from "@/lib/ai/gemini"
import { getRelationshipSignals } from "@/lib/strength"
import { supabase } from "@/lib/supabase"

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { path, totalStrength } = body

    if (!path || path.length < 2) {
      return NextResponse.json(
        { error: "Invalid path" },
        { status: 400 }
      )
    }

    /* ---------------------------------------------------- */
    /* 1️⃣ Resolve User Names (Never send UUIDs to AI)      */
    /* ---------------------------------------------------- */

    const { data: users } = await supabase
      .from("users")
      .select("id, first_name, last_name")
      .in("id", path)

    const userMap = new Map(
      users?.map((u) => [
        u.id,
        `${u.first_name} ${u.last_name}`,
      ])
    )

    const namedPath = path.map(
      (id: string) => userMap.get(id) || id
    )

    /* ---------------------------------------------------- */
    /* 2️⃣ Collect Relationship Signals Per Edge            */
    /* ---------------------------------------------------- */

    const edgeDetails: EdgeDetail[] = []

    for (let i = 0; i < path.length - 1; i++) {
      const userA = path[i]
      const userB = path[i + 1]

      const signals = await getRelationshipSignals(userA, userB)

      edgeDetails.push({
        from: userMap.get(userA) || userA,
        to: userMap.get(userB) || userB,
        isConnected: signals?.is_connected ?? false,
        sharedCompany: signals?.shared_company ?? false,
        sharedEducation: signals?.shared_education ?? false,
        mutualFollow:
          (signals?.a_follows_b ?? false) &&
          (signals?.b_follows_a ?? false),
        messages:
          (signals?.sent_count || 0) +
          (signals?.received_count || 0),
        lastInteraction:
          signals?.last_interaction || null,
      })
    }

    /* ---------------------------------------------------- */
    /* 3️⃣ Improved Deterministic Explanation (Hop-by-Hop)  */
    /* ---------------------------------------------------- */

    const hopBreakdown = edgeDetails
      .map((edge) => {
        const contextSignals = []

        if (edge.sharedCompany) contextSignals.push("shared company")
        if (edge.sharedEducation) contextSignals.push("shared education")
        if (edge.mutualFollow) contextSignals.push("mutual follow")

        const contextText =
          contextSignals.length > 0
            ? `They share ${contextSignals.join(" and ")}.`
            : "They do not share strong contextual overlap."

        let engagementText = ""
        if (edge.messages > 10) {
          engagementText = "They have strong interaction history."
        } else if (edge.messages > 3) {
          engagementText = "They show moderate engagement."
        } else if (edge.messages > 0) {
          engagementText = "They have light interaction."
        } else {
          engagementText = "There is minimal engagement between them."
        }

        return `
• ${edge.from} → ${edge.to}:
  ${engagementText} ${contextText}
`
      })
      .join("\n")

    const weakestEdge = edgeDetails.reduce((min, current) =>
      current.messages < min.messages ? current : min
    )

    const deterministicSummary = `
This is a ${path.length - 1}-hop introduction path between 
${namedPath.join(" → ")}.

The overall path strength is ${totalStrength.toFixed(2)}.

Relationship breakdown:
${hopBreakdown}

The weakest link in this chain appears between 
${weakestEdge.from} and ${weakestEdge.to}, 
as it has the lowest engagement signal.
`

    /* ---------------------------------------------------- */
    /* 4️⃣ AI Enhancement Layer                             */
    /* ---------------------------------------------------- */

    const aiExplanation = await generatePathExplanation({
      path: namedPath,
      totalStrength,
      edges: edgeDetails,
      deterministicSummary,
    })

    return NextResponse.json({
      deterministic: deterministicSummary,
      ai: aiExplanation,
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
