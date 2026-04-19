import { Suspense } from 'react'
import Link from 'next/link'
// DEMO MODE: Commented out for demo
// import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Plus, Search, Filter, Star, MapPin, Globe } from 'lucide-react'
import SalonFilters from '@/components/salons/salon-filters'
import SalonTable from '@/components/salons/salon-table'
import { formatScore } from '@/lib/utils/format'

interface SearchParams {
  search?: string
  status?: string
  sort?: string
  page?: string
}

export default async function SalonsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  // DEMO MODE: Use mock data
  const mockSalons = [
    {
      id: '1',
      name: 'Luxe Beauty Lounge',
      brand_name: 'Luxe Beauty',
      website: 'https://luxebeautylounge.com',
      phone: '(212) 555-0101',
      email: 'info@luxebeautylounge.com',
      status: 'review',
      created_at: new Date().toISOString(),
      salon_locations: [{ city: 'New York', state_province: 'NY' }],
      salon_scores: [{ total_score: 85.3, is_current: true }]
    },
    {
      id: '2',
      name: 'Serenity Spa & Salon',
      brand_name: null,
      website: 'https://serenityspa.com',
      phone: '(310) 555-0102',
      email: 'hello@serenityspa.com',
      status: 'approved',
      created_at: new Date().toISOString(),
      salon_locations: [{ city: 'Beverly Hills', state_province: 'CA' }],
      salon_scores: [{ total_score: 92.1, is_current: true }]
    },
    {
      id: '3',
      name: 'The Velvet Chair',
      brand_name: 'Velvet',
      website: 'https://velvetchair.com',
      phone: '(415) 555-0103',
      email: 'contact@velvetchair.com',
      status: 'scoring',
      created_at: new Date().toISOString(),
      salon_locations: [{ city: 'San Francisco', state_province: 'CA' }],
      salon_scores: [{ total_score: 78.5, is_current: true }]
    },
    {
      id: '4',
      name: 'Bloom Wellness Studio',
      brand_name: 'Bloom',
      website: 'https://bloomwellness.com',
      phone: '(305) 555-0104',
      email: 'info@bloomwellness.com',
      status: 'enriching',
      created_at: new Date().toISOString(),
      salon_locations: [{ city: 'Miami Beach', state_province: 'FL' }],
      salon_scores: []
    },
    {
      id: '5',
      name: 'Fifth Avenue Salon',
      brand_name: null,
      website: 'https://fifthavesalon.com',
      phone: '(212) 555-0105',
      email: 'bookings@fifthavesalon.com',
      status: 'draft',
      created_at: new Date().toISOString(),
      salon_locations: [{ city: 'New York', state_province: 'NY' }],
      salon_scores: []
    }
  ]

  // Filter salons based on search params
  let salons = mockSalons
  if (searchParams.search) {
    salons = salons.filter(s =>
      s.name.toLowerCase().includes(searchParams.search!.toLowerCase()) ||
      s.brand_name?.toLowerCase().includes(searchParams.search!.toLowerCase())
    )
  }
  if (searchParams.status) {
    salons = salons.filter(s => s.status === searchParams.status)
  }

  const count = salons.length
  const statusCounts = {
    review: 1,
    approved: 1,
    scoring: 1,
    enriching: 1,
    draft: 1
  }
  const totalPages = 1
  const page = parseInt(searchParams.page || '1')
  const pageSize = 10
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Salons</h1>
          <p className="text-slate-600 mt-2">
            Manage and track salon partnerships
          </p>
        </div>
        <Link href="/salons/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Salon
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Salons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{count || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              In Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {statusCounts?.review || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statusCounts?.approved || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {statusCounts?.rejected || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-20 animate-pulse bg-slate-100 rounded" />}>
            <SalonFilters />
          </Suspense>
        </CardContent>
      </Card>

      {/* Salons List */}
      <Card>
        <CardHeader>
          <CardTitle>All Salons</CardTitle>
          <CardDescription>
            {count ? `Showing ${from + 1}-${Math.min(to + 1, count)} of ${count} salons` : 'No salons found'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {salons && salons.length > 0 ? (
            <SalonTable salons={salons} currentPage={page} totalPages={totalPages} />
          ) : (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No salons found</h3>
              <p className="text-slate-600 mb-4">
                {searchParams.search || searchParams.status
                  ? 'Try adjusting your filters'
                  : 'Get started by adding your first salon'}
              </p>
              {!searchParams.search && !searchParams.status && (
                <Link href="/salons/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Salon
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}