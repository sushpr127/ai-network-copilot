import { supabase } from "@/lib/supabase"
import { calculateConnectionStrength } from "@/lib/strength"

type PathResult = {
  path: string[]
  strength: number
}

/**
 * Build adjacency list from connections table
 */
async function buildAdjacencyMap(): Promise<Map<string, Set<string>>> {
  const { data, error } = await supabase
    .from("connections")
    .select("user_id_1, user_id_2")

  if (error) {
    throw new Error("Failed to fetch connections")
  }

  const adjacency = new Map<string, Set<string>>()

  for (const row of data || []) {
    const { user_id_1, user_id_2 } = row

    if (!adjacency.has(user_id_1)) {
      adjacency.set(user_id_1, new Set())
    }
    if (!adjacency.has(user_id_2)) {
      adjacency.set(user_id_2, new Set())
    }

    adjacency.get(user_id_1)!.add(user_id_2)
    adjacency.get(user_id_2)!.add(user_id_1)
  }

  return adjacency
}
/**
 * Cached edge strength calculator
 */
async function getEdgeStrengthCached(
  userA: string,
  userB: string,
  cache: Map<string, number>
): Promise<number> {
  const key =
    userA < userB ? `${userA}-${userB}` : `${userB}-${userA}`

  if (cache.has(key)) {
    return cache.get(key)!
  }

  const strength = await calculateConnectionStrength(userA, userB)
  cache.set(key, strength)

  return strength
}
export async function findIntroductionPaths(
  source: string,
  target: string
): Promise<PathResult[]> {
  if (source === target) return []

  const adjacency = await buildAdjacencyMap()
  const strengthCache = new Map<string, number>()
  const results: PathResult[] = []

  const neighborsOfSource = adjacency.get(source) || new Set()

  // 1️⃣ Direct connection
  if (neighborsOfSource.has(target)) {
    const strength = await getEdgeStrengthCached(
      source,
      target,
      strengthCache
    )

    results.push({
      path: [source, target],
      strength,
    })
  }

  // 2️⃣ Depth 2 paths (X → A → Y)
  for (const a of neighborsOfSource) {
    if (a === target) continue

    const neighborsOfA = adjacency.get(a) || new Set()

    if (neighborsOfA.has(target)) {
      const s1 = await getEdgeStrengthCached(source, a, strengthCache)
      const s2 = await getEdgeStrengthCached(a, target, strengthCache)

      const weakest = Math.min(s1, s2)
      const strength = weakest * 0.9

      results.push({
        path: [source, a, target],
        strength,
      })
    }
  }

  // 3️⃣ Depth 3 paths (X → A → B → Y)
  for (const a of neighborsOfSource) {
    if (a === target) continue

    const neighborsOfA = adjacency.get(a) || new Set()

    for (const b of neighborsOfA) {
      if (b === source || b === target) continue

      const neighborsOfB = adjacency.get(b) || new Set()

      if (neighborsOfB.has(target)) {
        const s1 = await getEdgeStrengthCached(source, a, strengthCache)
        const s2 = await getEdgeStrengthCached(a, b, strengthCache)
        const s3 = await getEdgeStrengthCached(b, target, strengthCache)

        const weakest = Math.min(s1, s2, s3)
        const strength = weakest * 0.81

        results.push({
          path: [source, a, b, target],
          strength,
        })
      }
    }
  }

  // Sort strongest first
  results.sort((a, b) => b.strength - a.strength)

  // Return top 3
  return results.slice(0, 3)
}
