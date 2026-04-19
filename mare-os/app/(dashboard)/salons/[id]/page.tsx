import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Star,
  TrendingUp,
  Database,
  CheckCircle,
  Clock,
  Edit,
  Plus,
  FileText,
  Send
} from 'lucide-react'
import { formatScore, formatDate, formatPhoneNumber } from '@/lib/utils/format'
import SalonScoreCard from '@/components/salons/salon-score-card'
import SalonLocationsList from '@/components/salons/salon-locations-list'
import SalonSignalsList from '@/components/salons/salon-signals-list'
import SalonStatusActions from '@/components/salons/salon-status-actions'
import SalonScoringActions from '@/components/salons/salon-scoring-actions'

export default async function SalonDetailPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { addLocation?: string }
}) {
  const supabase = await createClient()

  const { data: salon, error } = await supabase
    .from('salons')
    .select(`
      *,
      salon_locations (*),
      salon_scores!inner (
        *,
        salon_score_reasons (*)
      ),
      salon_signals (*),
      review_queue (*),
      outreach_profiles (*),
      profiles!created_by (
        full_name,
        email
      )
    `)
    .eq('id', params.id)
    .eq('salon_scores.is_current', true)
    .single()

  if (error || !salon) {
    notFound()
  }

  const currentScore = salon.salon_scores?.find((s: any) => s.is_current)

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-slate-100 text-slate-700',
      enriching: 'bg-blue-100 text-blue-700',
      scoring: 'bg-purple-100 text-purple-700',
      review: 'bg-orange-100 text-orange-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      on_hold: 'bg-yellow-100 text-yellow-700',
    }
    return colors[status] || colors.draft
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/salons"
            className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Salons
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900">{salon.name}</h1>
            <Badge className={getStatusColor(salon.status)}>
              {salon.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          {salon.brand_name && (
            <p className="text-lg text-slate-600 mt-1">Brand: {salon.brand_name}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Link href={`/salons/${salon.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <SalonStatusActions salon={salon} />
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {currentScore && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Fit Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-2xl font-bold text-slate-900">
                  {formatScore(currentScore.total_score)}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold text-slate-900">
                {salon.salon_locations?.length || 0}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Signals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-500" />
              <span className="text-2xl font-bold text-slate-900">
                {salon.salon_signals?.length || 0}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Added
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-slate-500" />
              <span className="text-lg font-medium text-slate-900">
                {formatDate(salon.created_at)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="scoring">Scoring</TabsTrigger>
          <TabsTrigger value="signals">Signals</TabsTrigger>
          {salon.review_queue?.length > 0 && (
            <TabsTrigger value="review">Review</TabsTrigger>
          )}
          {salon.outreach_profiles?.length > 0 && (
            <TabsTrigger value="outreach">Outreach</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {salon.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-600">Website</p>
                      <a
                        href={salon.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {salon.website}
                      </a>
                    </div>
                  </div>
                )}

                {salon.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-600">Email</p>
                      <a
                        href={`mailto:${salon.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {salon.email}
                      </a>
                    </div>
                  </div>
                )}

                {salon.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-600">Phone</p>
                      <p className="text-slate-900">{formatPhoneNumber(salon.phone)}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-600">Created By</p>
                    <p className="text-slate-900">
                      {salon.profiles?.full_name || salon.profiles?.email || 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Primary Location */}
          {salon.salon_locations?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Primary Location</CardTitle>
              </CardHeader>
              <CardContent>
                {salon.salon_locations.find((l: any) => l.is_primary) || salon.salon_locations[0] ? (
                  <div className="space-y-2">
                    {(() => {
                      const location = salon.salon_locations.find((l: any) => l.is_primary) || salon.salon_locations[0]
                      return (
                        <>
                          <p className="text-slate-900">{location.address_line1}</p>
                          {location.address_line2 && (
                            <p className="text-slate-900">{location.address_line2}</p>
                          )}
                          <p className="text-slate-900">
                            {location.city}, {location.state_province} {location.postal_code}
                          </p>
                          {location.neighborhood && (
                            <p className="text-sm text-slate-600">
                              Neighborhood: {location.neighborhood}
                            </p>
                          )}
                        </>
                      )
                    })()}
                  </div>
                ) : (
                  <p className="text-slate-500">No locations added</p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="locations">
          <SalonLocationsList salonId={salon.id} locations={salon.salon_locations || []} />
        </TabsContent>

        <TabsContent value="scoring" className="space-y-4">
          {currentScore && (
            <SalonScoreCard score={currentScore} />
          )}
          <SalonScoringActions
            salonId={salon.id}
            hasSignals={(salon.salon_signals?.length || 0) > 0}
            hasCurrentScore={!!currentScore}
          />
        </TabsContent>

        <TabsContent value="signals">
          <SalonSignalsList salonId={salon.id} signals={salon.salon_signals || []} />
        </TabsContent>

        {salon.review_queue?.length > 0 && (
          <TabsContent value="review">
            <Card>
              <CardHeader>
                <CardTitle>Review Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Review queue details will be shown here</p>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {salon.outreach_profiles?.length > 0 && (
          <TabsContent value="outreach">
            <Card>
              <CardHeader>
                <CardTitle>Outreach Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Outreach profile details will be shown here</p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Add Location Modal Trigger */}
      {searchParams.addLocation === 'true' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Add Location</CardTitle>
              <CardDescription>
                Add the primary location for {salon.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">Location form will be implemented here</p>
              <div className="mt-4">
                <Link href={`/salons/${salon.id}`}>
                  <Button variant="outline">Skip for Now</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}