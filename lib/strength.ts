// /lib/strength/calculate.ts

import { supabase } from "@/lib/supabase"

export type RelationshipSignals = {
  is_connected: boolean
  sent_count: number
  received_count: number
  last_interaction: string | null
  shared_company: boolean
  shared_education: boolean
  a_follows_b: boolean
  b_follows_a: boolean
}

/**
 * Calculate recency decay factor
 * Returns 0.3 baseline if never interacted (but connected)
 * Decays exponentially with 90-day half-life
 */
function calculateRecencyFactor(daysSinceLast: number | null): number {
  if (daysSinceLast === null) {
    return 0.3  // Baseline for connections without interactions
  }
  
  const halfLife = 90
  return Math.pow(0.5, daysSinceLast / halfLife)
}

/**
 * Calculate interaction engagement score
 * Bidirectional interactions are valued more highly
 */
function calculateInteractionScore(sent: number, received: number): number {
  const total = sent + received
  
  if (total === 0) return 0
  
  // Both parties engaged: stronger signal
  if (sent > 0 && received > 0) {
    return Math.min(total / 15, 1.0)
  }
  
  // One-way only: weaker signal
  return Math.min(total / 20, 1.0)
}

/**
 * Calculate connection strength between two users
 * Returns 0 if not directly connected
 * Returns 0-1 score based on interactions, recency, and shared context
 */
export async function calculateConnectionStrength(
  userA: string,
  userB: string
): Promise<number> {
  const { data, error } = await supabase.rpc("get_relationship_signals", {
    user_a: userA,
    user_b: userB,
  })

  if (error) {
    throw new Error(`Failed to get relationship signals: ${error.message}`)
  }

  if (!data || data.length === 0) {
    return 0  // No data = no connection
  }

  const signals: RelationshipSignals = data[0]

  // Critical gate: only connected users form edges
  if (!signals.is_connected) {
    return 0
  }

  // Interaction metrics
  const sent = signals.sent_count || 0
  const received = signals.received_count || 0
  const interactionScore = calculateInteractionScore(sent, received)

  // Recency decay
  let daysSinceLast: number | null = null
  if (signals.last_interaction) {
    const lastInteraction = new Date(signals.last_interaction)
    daysSinceLast = (Date.now() - lastInteraction.getTime()) / (1000 * 60 * 60 * 24)
  }
  const recencyScore = calculateRecencyFactor(daysSinceLast)

  // Base strength from engagement
  const baseScore = 0.6 * interactionScore + 0.4 * recencyScore

  // Shared context amplifies base strength
  let contextMultiplier = 1.0
  
  if (signals.shared_company) {
    contextMultiplier += 0.3  // +30% for working together
  }
  
  if (signals.shared_education) {
    contextMultiplier += 0.2  // +20% for alma mater
  }
  
  if (signals.a_follows_b && signals.b_follows_a) {
    contextMultiplier += 0.1  // +10% for mutual follow
  }

  // Final score capped at 1.0
  return Math.min(baseScore * contextMultiplier, 1.0)
}

/**
 * Helper to get relationship signals without calculating strength
 * Useful for debugging or displaying raw data
 */
export async function getRelationshipSignals(
  userA: string,
  userB: string
): Promise<RelationshipSignals | null> {
  const { data, error } = await supabase.rpc("get_relationship_signals", {
    user_a: userA,
    user_b: userB,
  })

  if (error) {
    throw new Error(`Failed to get relationship signals: ${error.message}`)
  }
  
  if (!data || data.length === 0) {
    return null
  }

  return data[0]
}