import { NextRequest, NextResponse } from "next/server"
import { calculateConnectionStrength } from "@/lib/strength"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

const userA = searchParams.get("userA")?.trim()
const userB = searchParams.get("userB")?.trim()


  if (!userA || !userB) {
    return NextResponse.json({
      error: "Provide userA and userB query params",
    })
  }

  try {
    const strength = await calculateConnectionStrength(userA, userB)

    return NextResponse.json({ strength })
  } catch (err: any) {
    return NextResponse.json({ error: err.message })
  }
}
