import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { calculateConnectionStrength } from "@/lib/strength"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      )
    }

    // 1️⃣ Get direct connections
    const { data: connections, error } = await supabase
      .from("connections")
      .select("user_id_1, user_id_2")
      .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)

    if (error) {
      throw new Error(error.message)
    }

    if (!connections || connections.length === 0) {
      return NextResponse.json({ connections: [] })
    }

    // 2️⃣ Extract connected user IDs
    const connectedIds = connections.map((c) =>
      c.user_id_1 === userId ? c.user_id_2 : c.user_id_1
    )

    // 3️⃣ Fetch user details
    const { data: users } = await supabase
      .from("users")
      .select("id, first_name, last_name, job_title, industry")
      .in("id", connectedIds)

    // 4️⃣ Calculate strength for each connection
    const enrichedConnections = []

    for (const u of users || []) {
      const strength = await calculateConnectionStrength(
        userId,
        u.id
      )

      enrichedConnections.push({
        id: u.id,
        name: `${u.first_name} ${u.last_name}`,
        job_title: u.job_title,
        industry: u.industry,
        strength,
      })
    }

    // 5️⃣ Sort strongest first
    enrichedConnections.sort((a, b) => b.strength - a.strength)

    return NextResponse.json({
      connections: enrichedConnections,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
