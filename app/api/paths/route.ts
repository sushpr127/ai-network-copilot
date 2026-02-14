import { NextRequest, NextResponse } from "next/server"
import { findIntroductionPaths } from "@/lib/pathfinder"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const source = searchParams.get("source")?.trim()
  const target = searchParams.get("target")?.trim()

  if (!source || !target) {
    return NextResponse.json(
      { error: "Both 'source' and 'target' are required" },
      { status: 400 }
    )
  }

  if (source === target) {
    return NextResponse.json(
      { error: "Source and target cannot be the same" },
      { status: 400 }
    )
  }

  try {
    const result = await findIntroductionPaths(source, target)
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
