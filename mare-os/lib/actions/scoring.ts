'use server'

import { createClient } from '@/lib/supabase/server'
import { ScoringEngine } from '@/services/scoring/engine'
import { revalidatePath } from 'next/cache'

export async function calculateSalonScore(salonId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    // Check user permissions
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'reviewer', 'analyst'].includes(profile.role)) {
      return { error: 'Insufficient permissions to calculate scores' }
    }

    // Initialize scoring engine
    const scoringEngine = new ScoringEngine()
    const result = await scoringEngine.calculateSalonScore(salonId)

    // Update salon status to 'review' if it was 'scoring'
    const { data: salon } = await supabase
      .from('salons')
      .select('status')
      .eq('id', salonId)
      .single()

    if (salon?.status === 'scoring') {
      await supabase
        .from('salons')
        .update({ status: 'review' })
        .eq('id', salonId)

      // Add to review queue
      await supabase
        .from('review_queue')
        .insert({
          salon_id: salonId,
          score_id: result.score.id,
        })
    }

    revalidatePath(`/salons/${salonId}`)
    revalidatePath('/salons')

    return {
      data: result.score,
      reasons: result.reasons,
    }
  } catch (error) {
    console.error('Error calculating score:', error)
    return { error: (error as Error).message }
  }
}

export async function recalculateAllScores() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    // Check admin permissions
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return { error: 'Only admins can recalculate all scores' }
    }

    const scoringEngine = new ScoringEngine()
    const results = await scoringEngine.recalculateAllScores()

    revalidatePath('/salons')
    revalidatePath('/scoring')

    return { data: results }
  } catch (error) {
    console.error('Error recalculating scores:', error)
    return { error: (error as Error).message }
  }
}

export async function adjustSalonScore(
  salonId: string,
  adjustment: number,
  reason: string
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    // Check permissions
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'reviewer'].includes(profile.role)) {
      return { error: 'Insufficient permissions to adjust scores' }
    }

    // Get current score
    const { data: currentScore, error: scoreError } = await supabase
      .from('salon_scores')
      .select('*')
      .eq('salon_id', salonId)
      .eq('is_current', true)
      .single()

    if (scoreError || !currentScore) {
      return { error: 'No current score found for salon' }
    }

    // Calculate new total with adjustment
    const baseTotal = currentScore.total_score - currentScore.manual_adjustment
    const newTotal = Math.max(0, Math.min(100, baseTotal + adjustment))

    // Update score with adjustment
    const { data: updatedScore, error: updateError } = await supabase
      .from('salon_scores')
      .update({
        manual_adjustment: adjustment,
        adjustment_reason: reason,
        adjusted_by: user.id,
        total_score: newTotal,
      })
      .eq('id', currentScore.id)
      .select()
      .single()

    if (updateError) {
      return { error: updateError.message }
    }

    revalidatePath(`/salons/${salonId}`)

    return { data: updatedScore }
  } catch (error) {
    console.error('Error adjusting score:', error)
    return { error: (error as Error).message }
  }
}