import { supabase } from "@/lib/supabase"
import { calculateConnectionStrength } from "@/lib/strength"

type PathResult = {
  path: string[]
  strength: number
  hops: number
  edgeStrengths: number[]
}

type PathSearchResult = {
  paths: PathResult[]
  pathsFound: number
  searchDepth: number
  status: 'success' | 'no_path_found' | 'source_not_in_graph' | 'target_not_in_graph'
}

// Constants
const MAX_PATHS_TO_RETURN = 5
const MIN_STRENGTH_THRESHOLD = 0.1
const LENGTH_PENALTY_BASE = 0.9

/**
 * Build adjacency list from connections table
 */
async function buildAdjacencyMap(): Promise<Map<string, Set<string>>> {
  const { data, error } = await supabase
    .from("connections")
    .select("user_id_1, user_id_2")

  if (error) {
    throw new Error(`Failed to fetch connections: ${error.message}`)
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
async function getEdgeStrength(
  userA: string,
  userB: string,
  cache: Map<string, number>
): Promise<number> {
  // Create consistent cache key (alphabetically sorted)
  const key = userA < userB ? `${userA}:${userB}` : `${userB}:${userA}`
  
  if (cache.has(key)) {
    return cache.get(key)!
  }

  const strength = await calculateConnectionStrength(userA, userB)
  cache.set(key, strength)
  
  return strength
}

/**
 * Calculate path strength with length penalty
 */
function calculatePathStrength(edgeStrengths: number[], hops: number): number {
  const weakestLink = Math.min(...edgeStrengths)
  const lengthPenalty = Math.pow(LENGTH_PENALTY_BASE, hops - 1)
  return weakestLink * lengthPenalty
}

/**
 * Find all introduction paths up to depth 3
 */
export async function findIntroductionPaths(
  source: string,
  target: string
): Promise<PathSearchResult> {
  // Edge case: same user
  if (source === target) {
    return {
      paths: [],
      pathsFound: 0,
      searchDepth: 0,
      status: 'no_path_found'
    }
  }

  // Build graph
  const adjacency = await buildAdjacencyMap()

  // Check if users exist in graph
  if (!adjacency.has(source)) {
    return {
      paths: [],
      pathsFound: 0,
      searchDepth: 3,
      status: 'source_not_in_graph'
    }
  }

  if (!adjacency.has(target)) {
    return {
      paths: [],
      pathsFound: 0,
      searchDepth: 3,
      status: 'target_not_in_graph'
    }
  }

  const strengthCache = new Map<string, number>()
  const results: PathResult[] = []

  const sourceNeighbors = adjacency.get(source)!

  // ========================================
  // DEPTH 1: Direct connection (X → Y)
  // ========================================
  if (sourceNeighbors.has(target)) {
    const strength = await getEdgeStrength(source, target, strengthCache)
    
    results.push({
      path: [source, target],
      strength,
      hops: 1,
      edgeStrengths: [strength]
    })
  }

  // ========================================
  // DEPTH 2: One intermediary (X → A → Y)
  // ========================================
  for (const a of sourceNeighbors) {
    if (a === target) continue  // Skip direct connection (already handled)

    const aNeighbors = adjacency.get(a) || new Set()
    
    if (aNeighbors.has(target)) {
      const s1 = await getEdgeStrength(source, a, strengthCache)
      const s2 = await getEdgeStrength(a, target, strengthCache)
      
      const edgeStrengths = [s1, s2]
      const strength = calculatePathStrength(edgeStrengths, 2)

      results.push({
        path: [source, a, target],
        strength,
        hops: 2,
        edgeStrengths
      })
    }
  }

  // ========================================
  // DEPTH 3: Two intermediaries (X → A → B → Y)
  // ========================================
  for (const a of sourceNeighbors) {
    if (a === target) continue

    const aNeighbors = adjacency.get(a) || new Set()

    for (const b of aNeighbors) {
      // Critical: Prevent cycles and backtracking
      if (b === source) continue  // Don't go back to source
      if (b === target) continue  // Don't skip to target (handled in depth 2)
      if (b === a) continue       // Prevent self-loop (shouldn't happen, but safe)

      const bNeighbors = adjacency.get(b) || new Set()

      if (bNeighbors.has(target)) {
        const s1 = await getEdgeStrength(source, a, strengthCache)
        const s2 = await getEdgeStrength(a, b, strengthCache)
        const s3 = await getEdgeStrength(b, target, strengthCache)

        const edgeStrengths = [s1, s2, s3]
        const strength = calculatePathStrength(edgeStrengths, 3)

        results.push({
          path: [source, a, b, target],
          strength,
          hops: 3,
          edgeStrengths
        })
      }
    }
  }

  // ========================================
  // Filter, Sort, and Return
  // ========================================

  // Filter by minimum strength threshold
  const strongPaths = results.filter(p => p.strength >= MIN_STRENGTH_THRESHOLD)

  // Sort by strength descending
  strongPaths.sort((a, b) => {
    // Primary: strength
    if (b.strength !== a.strength) {
      return b.strength - a.strength
    }
    // Tiebreaker: prefer shorter paths
    return a.hops - b.hops
  })

  // Return top N paths
  const topPaths = strongPaths.slice(0, MAX_PATHS_TO_RETURN)

  return {
    paths: topPaths,
    pathsFound: results.length,
    searchDepth: 3,
    status: topPaths.length > 0 ? 'success' : 'no_path_found'
  }
}