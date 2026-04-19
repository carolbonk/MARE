import { createClient } from '@/lib/supabase/server'

export interface SignalWeight {
  category: string
  weight: number
}

export interface ScoreWeights {
  luxury_aesthetic: number
  revenue_likelihood: number
  retail_readiness: number
  wellness_alignment: number
  growth_potential: number
  digital_presence: number
  partnership_fit: number
}

export const DEFAULT_WEIGHTS: ScoreWeights = {
  luxury_aesthetic: 0.25,
  revenue_likelihood: 0.20,
  retail_readiness: 0.15,
  wellness_alignment: 0.15,
  growth_potential: 0.10,
  digital_presence: 0.10,
  partnership_fit: 0.05,
}

// Signal type to score mapping rules
export const SIGNAL_SCORING_RULES: Record<string, (value: any) => number> = {
  // Luxury & Aesthetic signals
  'price_range_high': (value: number) => Math.min(100, (value / 500) * 100),
  'interior_quality': (value: string) => {
    const scores: Record<string, number> = {
      'luxury': 100,
      'upscale': 80,
      'modern': 60,
      'standard': 40,
      'basic': 20,
    }
    return scores[value] || 30
  },
  'brand_partnerships': (value: string[]) => Math.min(100, value.length * 20),
  'luxury_neighborhood': (value: boolean) => value ? 90 : 30,

  // Revenue likelihood signals
  'avg_transaction_value': (value: number) => Math.min(100, (value / 300) * 100),
  'client_retention_rate': (value: number) => value,
  'booking_frequency': (value: number) => Math.min(100, (value / 30) * 100),
  'review_count': (value: number) => Math.min(100, (value / 500) * 100),

  // Retail readiness signals
  'has_retail_space': (value: boolean) => value ? 80 : 20,
  'current_retail_brands': (value: number) => Math.min(100, value * 10),
  'retail_sales_percentage': (value: number) => Math.min(100, value * 2),

  // Wellness alignment signals
  'has_scalp_treatment': (value: boolean) => value ? 90 : 10,
  'wellness_menu_items': (value: number) => Math.min(100, value * 15),
  'organic_focus': (value: boolean) => value ? 80 : 20,
  'holistic_approach': (value: boolean) => value ? 85 : 25,

  // Growth potential signals
  'location_count': (value: number) => {
    if (value === 1) return 40
    if (value <= 3) return 60
    if (value <= 5) return 80
    return 100
  },
  'years_in_business': (value: number) => {
    if (value < 2) return 30
    if (value < 5) return 60
    if (value < 10) return 80
    return 90
  },
  'expansion_plans': (value: boolean) => value ? 80 : 40,

  // Digital presence signals
  'website_quality': (value: string) => {
    const scores: Record<string, number> = {
      'excellent': 100,
      'good': 75,
      'average': 50,
      'poor': 25,
      'none': 0,
    }
    return scores[value] || 30
  },
  'social_media_followers': (value: number) => Math.min(100, (value / 10000) * 100),
  'online_booking': (value: boolean) => value ? 90 : 30,
  'review_rating': (value: number) => (value / 5) * 100,

  // Partnership fit signals
  'brand_alignment': (value: number) => value,
  'management_quality': (value: string) => {
    const scores: Record<string, number> = {
      'excellent': 100,
      'good': 75,
      'average': 50,
      'poor': 25,
    }
    return scores[value] || 50
  },
  'innovation_openness': (value: boolean) => value ? 85 : 40,
}

export class ScoringEngine {
  private supabase: any
  private weights: ScoreWeights

  constructor(weights: ScoreWeights = DEFAULT_WEIGHTS) {
    this.weights = weights
  }

  async initializeSupabase() {
    this.supabase = await createClient()
  }

  /**
   * Calculate score for a salon based on its signals
   */
  async calculateSalonScore(salonId: string) {
    if (!this.supabase) {
      await this.initializeSupabase()
    }

    // Fetch all signals for the salon
    const { data: signals, error } = await this.supabase
      .from('salon_signals')
      .select('*')
      .eq('salon_id', salonId)

    if (error) {
      throw new Error(`Failed to fetch signals: ${error.message}`)
    }

    if (!signals || signals.length === 0) {
      throw new Error('No signals found for salon')
    }

    // Group signals by category
    const signalsByCategory = this.groupSignalsByCategory(signals)

    // Calculate sub-scores for each category
    const subScores = this.calculateSubScores(signalsByCategory)

    // Calculate total weighted score
    const totalScore = this.calculateWeightedTotal(subScores)

    // Generate score reasons
    const reasons = this.generateScoreReasons(signalsByCategory, subScores)

    // Get current user
    const { data: { user } } = await this.supabase.auth.getUser()

    // Mark previous scores as not current
    await this.supabase
      .from('salon_scores')
      .update({ is_current: false })
      .eq('salon_id', salonId)

    // Insert new score
    const { data: newScore, error: scoreError } = await this.supabase
      .from('salon_scores')
      .insert({
        salon_id: salonId,
        luxury_aesthetic_score: subScores.luxury_aesthetic,
        revenue_likelihood_score: subScores.revenue_likelihood,
        retail_readiness_score: subScores.retail_readiness,
        wellness_alignment_score: subScores.wellness_alignment,
        growth_potential_score: subScores.growth_potential,
        digital_presence_score: subScores.digital_presence,
        partnership_fit_score: subScores.partnership_fit,
        total_score: totalScore,
        computed_by: user?.id,
        is_current: true,
      })
      .select()
      .single()

    if (scoreError) {
      throw new Error(`Failed to save score: ${scoreError.message}`)
    }

    // Insert score reasons
    if (reasons.length > 0) {
      await this.supabase
        .from('salon_score_reasons')
        .insert(
          reasons.map(reason => ({
            ...reason,
            score_id: newScore.id,
          }))
        )
    }

    return {
      score: newScore,
      reasons,
    }
  }

  /**
   * Group signals by their category
   */
  private groupSignalsByCategory(signals: any[]) {
    return signals.reduce((acc, signal) => {
      if (!acc[signal.signal_category]) {
        acc[signal.signal_category] = []
      }
      acc[signal.signal_category].push(signal)
      return acc
    }, {} as Record<string, any[]>)
  }

  /**
   * Calculate sub-scores for each category
   */
  private calculateSubScores(signalsByCategory: Record<string, any[]>): ScoreWeights {
    const subScores: any = {}

    for (const category of Object.keys(DEFAULT_WEIGHTS)) {
      const categorySignals = signalsByCategory[category] || []

      if (categorySignals.length === 0) {
        subScores[category] = 0
        continue
      }

      // Calculate average score for this category
      let totalScore = 0
      let totalWeight = 0

      for (const signal of categorySignals) {
        const scoringRule = SIGNAL_SCORING_RULES[signal.signal_type]

        if (scoringRule) {
          // Apply the scoring rule to get normalized score
          const score = scoringRule(signal.raw_value)
          const weight = signal.confidence_score || 1.0

          totalScore += score * weight
          totalWeight += weight
        } else if (signal.normalized_value !== null) {
          // Use pre-normalized value if no rule exists
          totalScore += signal.normalized_value * (signal.confidence_score || 1.0)
          totalWeight += signal.confidence_score || 1.0
        }
      }

      subScores[category] = totalWeight > 0 ? totalScore / totalWeight : 0
    }

    return subScores
  }

  /**
   * Calculate weighted total score
   */
  private calculateWeightedTotal(subScores: ScoreWeights): number {
    let total = 0

    for (const [category, weight] of Object.entries(this.weights)) {
      total += (subScores[category as keyof ScoreWeights] || 0) * weight
    }

    return Math.round(total * 10) / 10 // Round to 1 decimal place
  }

  /**
   * Generate human-readable reasons for the score
   */
  private generateScoreReasons(
    signalsByCategory: Record<string, any[]>,
    subScores: ScoreWeights
  ): any[] {
    const reasons = []

    // Add positive reasons for high scores
    for (const [category, score] of Object.entries(subScores)) {
      if (score >= 80) {
        reasons.push({
          category,
          reason_type: 'positive',
          reason_text: this.getPositiveReason(category, signalsByCategory[category]),
          impact_value: (score * this.weights[category as keyof ScoreWeights]),
        })
      } else if (score <= 40) {
        reasons.push({
          category,
          reason_type: 'negative',
          reason_text: this.getNegativeReason(category, signalsByCategory[category]),
          impact_value: -(100 - score) * this.weights[category as keyof ScoreWeights],
        })
      }
    }

    // Add neutral observations
    if (signalsByCategory['luxury_aesthetic']?.some(s => s.signal_type === 'luxury_neighborhood')) {
      reasons.push({
        category: 'luxury_aesthetic',
        reason_type: 'neutral',
        reason_text: 'Location in luxury neighborhood positively impacts brand perception',
        impact_value: 0,
      })
    }

    return reasons
  }

  private getPositiveReason(category: string, signals: any[]): string {
    const reasons: Record<string, string> = {
      luxury_aesthetic: 'Excellent luxury positioning with premium pricing and aesthetic',
      revenue_likelihood: 'Strong revenue indicators with high transaction values',
      retail_readiness: 'Well-prepared for retail with existing infrastructure',
      wellness_alignment: 'Strong alignment with wellness and scalp health focus',
      growth_potential: 'High growth potential with multi-location presence',
      digital_presence: 'Excellent digital presence and online engagement',
      partnership_fit: 'Strong alignment with MaRe brand values',
    }
    return reasons[category] || `Strong performance in ${category.replace('_', ' ')}`
  }

  private getNegativeReason(category: string, signals: any[]): string {
    const reasons: Record<string, string> = {
      luxury_aesthetic: 'Limited luxury positioning may require brand elevation',
      revenue_likelihood: 'Revenue indicators suggest room for growth',
      retail_readiness: 'Retail infrastructure needs development',
      wellness_alignment: 'Limited wellness focus requires education and training',
      growth_potential: 'Single location limits immediate growth potential',
      digital_presence: 'Digital presence needs enhancement',
      partnership_fit: 'Partnership alignment requires further discussion',
    }
    return reasons[category] || `Improvement needed in ${category.replace('_', ' ')}`
  }

  /**
   * Recalculate scores for all salons with signals
   */
  async recalculateAllScores() {
    if (!this.supabase) {
      await this.initializeSupabase()
    }

    // Get all salons with signals
    const { data: salons, error } = await this.supabase
      .from('salons')
      .select('id, name')
      .in('status', ['scoring', 'review', 'approved'])

    if (error) {
      throw new Error(`Failed to fetch salons: ${error.message}`)
    }

    const results = []
    for (const salon of salons) {
      try {
        const result = await this.calculateSalonScore(salon.id)
        results.push({
          salon_id: salon.id,
          salon_name: salon.name,
          success: true,
          score: result.score.total_score,
        })
      } catch (err) {
        results.push({
          salon_id: salon.id,
          salon_name: salon.name,
          success: false,
          error: (err as Error).message,
        })
      }
    }

    return results
  }
}