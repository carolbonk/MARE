/**
 * Demo Page - View the UI without Supabase configuration
 * Access at: http://localhost:3005/demo
 */

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Building2, Star, TrendingUp, CheckCircle, Clock,
  Database, Send, ChevronRight, Sparkles, Target,
  ShoppingBag, Globe, Handshake
} from 'lucide-react'

export default function DemoPage() {
  // Sample demo data
  const demoSalons = [
    {
      id: '1',
      name: 'Luxe Beauty Lounge',
      location: 'New York, NY',
      status: 'review',
      score: 85.3,
    },
    {
      id: '2',
      name: 'Serenity Spa & Salon',
      location: 'Beverly Hills, CA',
      status: 'approved',
      score: 92.1,
    },
    {
      id: '3',
      name: 'The Velvet Chair',
      location: 'San Francisco, CA',
      status: 'scoring',
      score: 78.5,
    },
  ]

  const scoreCategories = [
    { name: 'Luxury & Aesthetic', score: 88, icon: Star, color: 'text-purple-600' },
    { name: 'Revenue Likelihood', score: 75, icon: TrendingUp, color: 'text-green-600' },
    { name: 'Retail Readiness', score: 82, icon: ShoppingBag, color: 'text-blue-600' },
    { name: 'Wellness Alignment', score: 90, icon: Sparkles, color: 'text-teal-600' },
    { name: 'Growth Potential', score: 70, icon: Target, color: 'text-orange-600' },
    { name: 'Digital Presence', score: 85, icon: Globe, color: 'text-indigo-600' },
    { name: 'Partnership Fit', score: 95, icon: Handshake, color: 'text-pink-600' },
  ]

  const getStatusBadge = (status: string) => {
    const config: Record<string, any> = {
      review: { variant: 'default', label: 'In Review' },
      approved: { variant: 'default', label: 'Approved', className: 'bg-green-100 text-green-700' },
      scoring: { variant: 'secondary', label: 'Scoring' },
    }
    return config[status] || config.review
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Demo Banner */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-yellow-900 mb-1">Demo Mode</h2>
          <p className="text-yellow-700 text-sm">
            This is a preview of MaRe OS without database connection.
            To enable full functionality, set up Supabase credentials in .env.local
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900">MaRe OS</h1>
          <p className="text-lg text-slate-600 mt-2">
            Luxury Fit Score System - Premium Salon Partnership Platform
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Salons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">247</div>
              <p className="text-xs text-slate-600 mt-1">Salons in pipeline</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">85.3</div>
              <p className="text-xs text-slate-600 mt-1">Across all salons</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Approval Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">73%</div>
              <p className="text-xs text-slate-600 mt-1">Of reviewed salons</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">12</div>
              <p className="text-xs text-slate-600 mt-1">Awaiting decision</p>
            </CardContent>
          </Card>
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
              {demoSalons.map((salon) => {
                const statusConfig = getStatusBadge(salon.status)
                return (
                  <div
                    key={salon.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-slate-900">
                          {salon.name}
                        </h3>
                        <Badge
                          variant={statusConfig.variant}
                          className={statusConfig.className}
                        >
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        {salon.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold text-slate-900">
                            {salon.score}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Fit Score</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Score Breakdown Example */}
        <Card>
          <CardHeader>
            <CardTitle>Score Breakdown Example</CardTitle>
            <CardDescription>
              How the luxury fit score is calculated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scoreCategories.map((category) => {
                const Icon = category.icon
                return (
                  <div key={category.name} className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-slate-50`}>
                      <Icon className={`h-5 w-5 ${category.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">
                        {category.name}
                      </p>
                      <p className={`text-lg font-bold ${category.color}`}>
                        {category.score}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Database className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Data Enrichment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Collect signals from multiple sources to build comprehensive salon profiles.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Smart Scoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                AI-powered scoring with explainable results across 7 key categories.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Send className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Outreach Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Generate talking points and export approved salons for partnership outreach.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Setup Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Ready to Get Started?</CardTitle>
            <CardDescription>
              Set up your Supabase account to enable full functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900">Quick Setup Steps:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-slate-700">
                <li>Create a free account at https://supabase.com</li>
                <li>Create a new project (takes 2 minutes)</li>
                <li>Go to Settings → API and copy your credentials</li>
                <li>Update the .env.local file with your credentials</li>
                <li>Restart the development server</li>
                <li>Run the database schema (found in /supabase/schema.sql)</li>
              </ol>
            </div>
            <div className="flex gap-4">
              <Button asChild>
                <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">
                  Go to Supabase
                </a>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/login">
                  Try Login Page
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}