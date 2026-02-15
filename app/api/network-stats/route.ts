import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "userId required" },
        { status: 400 }
      )
    }

    // Total users
    const { count: totalUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })

    // Connections for this user only
    const { data: userConnections } = await supabase
      .from("connections")
      .select("connection_context")
      .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)

    const totalConnections = userConnections?.length || 0

    // Fast strong logic (no RPC calls)
    const strongConnections =
      userConnections?.filter(
        (c) => c.connection_context === "industry_peer"
      ).length || 0

    const avgConnections =
      totalUsers && totalUsers > 0
        ? ((totalConnections * 2) / totalUsers)
        : 0

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      totalConnections,
      strongConnections,
      averageConnectionsPerUser: Number(avgConnections.toFixed(2)),
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
