// DEMO MODE: Commented out for demo
// import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, TrendingUp, CheckCircle, Clock, AlertCircle, Star } from 'lucide-react'
import { formatScore, formatPercentage } from '@/lib/utils/format'

export default async function DashboardPage() {
  // DEMO MODE: Use mock data instead of Supabase
  const totalSalons = 247
  const approvedSalons = 180
  const pendingReview = 12
  const averageScore = 85.3
  const approvalRate = 73

  // Mock recent salons data
  const recentSalons = [
    {
      id: '1',
      name: 'Luxe Beauty Lounge',
      brand_name: 'Luxe Beauty',
      status: 'review',
      created_at: new Date().toISOString(),
      salon_scores: [{ total_score: 85.3 }]
    },
    {
      id: '2',
      name: 'Serenity Spa & Salon',
      brand_name: null,
      status: 'approved',
      created_at: new Date().toISOString(),
      salon_scores: [{ total_score: 92.1 }]
    },
    {
      id: '3',
      name: 'The Velvet Chair',
      brand_name: 'Velvet',
      status: 'scoring',
      created_at: new Date().toISOString(),
      salon_scores: [{ total_score: 78.5 }]
    },
    {
      id: '4',
      name: 'Bloom Wellness Studio',
      brand_name: 'Bloom',
      status: 'enriching',
      created_at: new Date().toISOString(),
      salon_scores: []
    },
    {
      id: '5',
      name: 'Fifth Avenue Salon',
      brand_name: null,
      status: 'draft',
      created_at: new Date().toISOString(),
      salon_scores: []
    }
  ]

  const kpis = [
    {
      title: 'Total Salons',
      value: totalSalons?.toString() || '0',
      description: 'Salons in pipeline',
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Average Fit Score',
      value: formatScore(averageScore),
      description: 'Across all scored salons',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Approval Rate',
      value: formatPercentage(approvalRate),
      description: 'Of reviewed salons',
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Pending Review',
      value: pendingReview?.toString() || '0',
      description: 'Awaiting decision',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; label: string }> = {
      draft: { variant: 'secondary', label: 'Draft' },
      enriching: { variant: 'outline', label: 'Enriching' },
      scoring: { variant: 'default', label: 'Scoring' },
      review: { variant: 'default', label: 'In Review' },
      approved: { variant: 'default', label: 'Approved' },
      rejected: { variant: 'destructive', label: 'Rejected' },
      on_hold: { variant: 'secondary', label: 'On Hold' },
    }

    const config = statusConfig[status] || statusConfig.draft
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    if (score >= 40) return 'text-orange-600 bg-orange-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">
          Monitor your salon pipeline and key metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {kpi.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                  <Icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{kpi.value}</div>
                <p className="text-xs text-slate-600 mt-1">
                  {kpi.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Salons */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Salons</CardTitle>
          <CardDescription>
            Latest salons added to the pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSalons && recentSalons.length > 0 ? (
              recentSalons.map((salon: any) => (
                <div
                  key={salon.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-slate-900">
                        {salon.name}
                      </h3>
                      {getStatusBadge(salon.status)}
                    </div>
                    {salon.brand_name && (
                      <p className="text-sm text-slate-600 mt-1">
                        Brand: {salon.brand_name}
                      </p>
                    )}
                  </div>
                  {salon.salon_scores?.[0] && (
                    <div className="flex items-center gap-4">
                      <div
                        className={`px-3 py-1 rounded-full ${getScoreColor(
                          salon.salon_scores[0].total_score
                        )}`}
                      >
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          <span className="font-semibold">
                            {formatScore(salon.salon_scores[0].total_score)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Building2 className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>No salons added yet</p>
                <p className="text-sm mt-1">Start by adding your first salon</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Status */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Status</CardTitle>
          <CardDescription>
            Distribution of salons across stages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <PipelineStage
              stage="Draft"
              count={0}
              total={totalSalons || 0}
              color="bg-slate-500"
            />
            <PipelineStage
              stage="Enriching"
              count={0}
              total={totalSalons || 0}
              color="bg-blue-500"
            />
            <PipelineStage
              stage="Scoring"
              count={0}
              total={totalSalons || 0}
              color="bg-purple-500"
            />
            <PipelineStage
              stage="Review"
              count={pendingReview || 0}
              total={totalSalons || 0}
              color="bg-orange-500"
            />
            <PipelineStage
              stage="Approved"
              count={approvedSalons || 0}
              total={totalSalons || 0}
              color="bg-green-500"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PipelineStage({
  stage,
  count,
  total,
  color,
}: {
  stage: string
  count: number
  total: number
  color: string
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-slate-700">{stage}</span>
        <span className="text-sm text-slate-600">
          {count} ({formatPercentage(percentage)})
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}