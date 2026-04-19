import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckSquare, Clock, Star, User, AlertCircle, ChevronRight } from 'lucide-react'
import { formatScore, formatDate } from '@/lib/utils/format'

export default async function ReviewPage() {
  const supabase = await createClient()

  // Fetch review queue with salon details
  const { data: reviews, error } = await supabase
    .from('review_queue')
    .select(`
      *,
      salons (
        id,
        name,
        brand_name,
        status,
        salon_locations (
          city,
          state_province
        )
      ),
      salon_scores!score_id (
        total_score
      ),
      profiles!assigned_to (
        full_name,
        email
      )
    `)
    .is('decision', null)
    .order('priority', { ascending: false })
    .order('added_to_queue_at', { ascending: true })

  const getPriorityBadge = (priority: number) => {
    if (priority >= 3) return { variant: 'destructive' as const, label: 'High Priority' }
    if (priority >= 2) return { variant: 'default' as const, label: 'Medium Priority' }
    return { variant: 'secondary' as const, label: 'Low Priority' }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  // Get stats
  const totalPending = reviews?.length || 0
  const assignedCount = reviews?.filter(r => r.assigned_to)?.length || 0
  const highPriorityCount = reviews?.filter(r => r.priority >= 3)?.length || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Review Queue</h1>
        <p className="text-slate-600 mt-2">
          Review and approve salons for partnership
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalPending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Assigned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{assignedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{highPriorityCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Review Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Salons Awaiting Review</CardTitle>
          <CardDescription>
            Review each salon and make a decision
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => {
                const priorityBadge = getPriorityBadge(review.priority)
                const score = review.salon_scores?.total_score

                return (
                  <div
                    key={review.id}
                    className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-slate-900">
                            {review.salons?.name}
                          </h3>
                          <Badge variant={priorityBadge.variant}>
                            {priorityBadge.label}
                          </Badge>
                          {review.follow_up_required && (
                            <Badge variant="outline">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Follow-up Required
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          {review.salons?.salon_locations?.[0] && (
                            <div className="flex items-center gap-1">
                              <span>
                                {review.salons.salon_locations[0].city},{' '}
                                {review.salons.salon_locations[0].state_province}
                              </span>
                            </div>
                          )}

                          {score && (
                            <div className="flex items-center gap-1">
                              <Star className={`h-4 w-4 ${getScoreColor(score)}`} />
                              <span className={`font-semibold ${getScoreColor(score)}`}>
                                {formatScore(score)}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Added {formatDate(review.added_to_queue_at)}</span>
                          </div>

                          {review.profiles && (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>Assigned to {review.profiles.full_name}</span>
                            </div>
                          )}
                        </div>

                        {review.internal_notes && (
                          <p className="text-sm text-slate-600 mt-2 italic">
                            Note: {review.internal_notes}
                          </p>
                        )}
                      </div>

                      <Link href={`/salons/${review.salons?.id}?tab=review`}>
                        <Button variant="outline" size="sm">
                          Review
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No Salons to Review</h3>
              <p className="text-slate-600">
                Salons will appear here when they're ready for review
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}