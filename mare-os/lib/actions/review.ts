'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const reviewDecisionSchema = z.object({
  decision: z.enum(['approve', 'reject', 'hold', 'request_info']),
  decision_rationale: z.string().min(1, 'Rationale is required'),
  internal_notes: z.string().optional(),
  follow_up_required: z.boolean().default(false),
  follow_up_date: z.string().optional(),
})

export type ReviewDecisionInput = z.infer<typeof reviewDecisionSchema>

export async function makeReviewDecision(
  salonId: string,
  reviewId: string,
  data: ReviewDecisionInput
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
      return { error: 'Insufficient permissions to make review decisions' }
    }

    const validatedData = reviewDecisionSchema.parse(data)

    // Update review queue
    const { data: review, error: reviewError } = await supabase
      .from('review_queue')
      .update({
        decision: validatedData.decision,
        decision_made_by: user.id,
        decision_made_at: new Date().toISOString(),
        decision_rationale: validatedData.decision_rationale,
        internal_notes: validatedData.internal_notes,
        follow_up_required: validatedData.follow_up_required,
        follow_up_date: validatedData.follow_up_date,
        review_completed_at: validatedData.decision !== 'request_info'
          ? new Date().toISOString()
          : null,
      })
      .eq('id', reviewId)
      .select()
      .single()

    if (reviewError) {
      return { error: reviewError.message }
    }

    // Update salon status based on decision
    const newStatus =
      validatedData.decision === 'approve' ? 'approved' :
      validatedData.decision === 'reject' ? 'rejected' :
      validatedData.decision === 'hold' ? 'on_hold' :
      'review' // request_info keeps it in review

    await supabase
      .from('salons')
      .update({ status: newStatus })
      .eq('id', salonId)

    // If approved, create outreach profile stub
    if (validatedData.decision === 'approve') {
      const { data: existingProfile } = await supabase
        .from('outreach_profiles')
        .select('id')
        .eq('salon_id', salonId)
        .single()

      if (!existingProfile) {
        await supabase
          .from('outreach_profiles')
          .insert({
            salon_id: salonId,
            review_id: reviewId,
            executive_summary: 'To be generated',
            key_strengths: [],
            partnership_angle: 'To be determined',
            suggested_approach: 'To be developed',
            created_by: user.id,
          })
      }
    }

    revalidatePath('/review')
    revalidatePath('/salons')
    revalidatePath(`/salons/${salonId}`)

    return { data: review }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: 'Failed to make review decision' }
  }
}

export async function addReviewComment(
  reviewId: string,
  comment: string,
  isInternal: boolean = true
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    const { data, error } = await supabase
      .from('review_comments')
      .insert({
        review_id: reviewId,
        author_id: user.id,
        comment_text: comment,
        is_internal: isInternal,
      })
      .select(`
        *,
        profiles!author_id (
          full_name,
          email,
          avatar_url
        )
      `)
      .single()

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/review')

    return { data }
  } catch (error) {
    return { error: 'Failed to add comment' }
  }
}

export async function assignReviewer(reviewId: string, reviewerId: string | null) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    // Check permissions (only admin can assign)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return { error: 'Only admins can assign reviewers' }
    }

    const { data, error } = await supabase
      .from('review_queue')
      .update({
        assigned_to: reviewerId,
        review_started_at: reviewerId ? new Date().toISOString() : null,
      })
      .eq('id', reviewId)
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/review')

    return { data }
  } catch (error) {
    return { error: 'Failed to assign reviewer' }
  }
}

export async function updateReviewPriority(reviewId: string, priority: number) {
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
      return { error: 'Insufficient permissions' }
    }

    const { data, error } = await supabase
      .from('review_queue')
      .update({ priority })
      .eq('id', reviewId)
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/review')

    return { data }
  } catch (error) {
    return { error: 'Failed to update priority' }
  }
}