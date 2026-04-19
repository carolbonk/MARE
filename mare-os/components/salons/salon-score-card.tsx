import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatScore, formatDate } from '@/lib/utils/format'
import { Star, TrendingUp, ShoppingBag, Sparkles, Target, Globe, Handshake } from 'lucide-react'

interface SalonScoreCardProps {
  score: any
}

const scoreCategories = [
  {
    key: 'luxury_aesthetic_score',
    label: 'Luxury & Aesthetic',
    icon: Star,
    weight: 25,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    key: 'revenue_likelihood_score',
    label: 'Revenue Likelihood',
    icon: TrendingUp,
    weight: 20,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    key: 'retail_readiness_score',
    label: 'Retail Readiness',
    icon: ShoppingBag,
    weight: 15,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    key: 'wellness_alignment_score',
    label: 'Wellness Alignment',
    icon: Sparkles,
    weight: 15,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
  },
  {
    key: 'growth_potential_score',
    label: 'Growth Potential',
    icon: Target,
    weight: 10,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    key: 'digital_presence_score',
    label: 'Digital Presence',
    icon: Globe,
    weight: 10,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  {
    key: 'partnership_fit_score',
    label: 'Partnership Fit',
    icon: Handshake,
    weight: 5,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
  },
]

export default function SalonScoreCard({ score }: SalonScoreCardProps) {
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-green-600'
    if (value >= 60) return 'text-yellow-600'
    if (value >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreBadge = (value: number) => {
    if (value >= 80) return { label: 'Excellent', variant: 'default' as const }
    if (value >= 60) return { label: 'Good', variant: 'secondary' as const }
    if (value >= 40) return { label: 'Fair', variant: 'outline' as const }
    return { label: 'Poor', variant: 'destructive' as const }
  }

  const overallBadge = getScoreBadge(score.total_score)

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Overall Fit Score</CardTitle>
              <CardDescription>
                Computed on {formatDate(score.computed_at)}
              </CardDescription>
            </div>
            <Badge variant={overallBadge.variant}>{overallBadge.label}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-5xl font-bold" style={{ color: getScoreColor(score.total_score) }}>
              {formatScore(score.total_score)}
            </div>
            <div className="flex-1">
              <Progress value={score.total_score} className="h-3" />
              <p className="text-sm text-slate-600 mt-2">
                Score Version: {score.score_version}
              </p>
            </div>
          </div>

          {score.manual_adjustment !== 0 && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                Manual adjustment applied: {score.manual_adjustment > 0 ? '+' : ''}{score.manual_adjustment}
              </p>
              {score.adjustment_reason && (
                <p className="text-sm text-yellow-700 mt-1">
                  Reason: {score.adjustment_reason}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Score Breakdown</CardTitle>
          <CardDescription>
            Individual category scores and weights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scoreCategories.map((category) => {
              const Icon = category.icon
              const categoryScore = score[category.key] || 0
              const contribution = (categoryScore * category.weight) / 100

              return (
                <div key={category.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${category.bgColor}`}>
                        <Icon className={`h-4 w-4 ${category.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{category.label}</p>
                        <p className="text-sm text-slate-600">
                          Weight: {category.weight}% • Contribution: {contribution.toFixed(1)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        {formatScore(categoryScore)}
                      </p>
                    </div>
                  </div>
                  <Progress value={categoryScore} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Score Reasons */}
      {score.salon_score_reasons && score.salon_score_reasons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Scoring Insights</CardTitle>
            <CardDescription>
              Key factors influencing the score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {score.salon_score_reasons.map((reason: any) => (
                <div
                  key={reason.id}
                  className={`p-3 rounded-lg border ${
                    reason.reason_type === 'positive'
                      ? 'border-green-200 bg-green-50'
                      : reason.reason_type === 'negative'
                      ? 'border-red-200 bg-red-50'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={`text-lg ${
                        reason.reason_type === 'positive'
                          ? 'text-green-600'
                          : reason.reason_type === 'negative'
                          ? 'text-red-600'
                          : 'text-slate-600'
                      }`}
                    >
                      {reason.reason_type === 'positive' ? '✓' : reason.reason_type === 'negative' ? '✗' : '•'}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        {reason.reason_text}
                      </p>
                      {reason.impact_value && (
                        <p className="text-xs text-slate-600 mt-1">
                          Impact: {reason.impact_value > 0 ? '+' : ''}{reason.impact_value.toFixed(1)} points
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}