'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Database, Plus, TrendingUp, Sparkles } from 'lucide-react'
import { formatDate } from '@/lib/utils/format'
import AddSignalForm from './add-signal-form'

interface SalonSignalsListProps {
  salonId: string
  signals: any[]
}

const categoryLabels: Record<string, string> = {
  luxury_aesthetic: 'Luxury & Aesthetic',
  revenue_likelihood: 'Revenue Likelihood',
  retail_readiness: 'Retail Readiness',
  wellness_alignment: 'Wellness Alignment',
  growth_potential: 'Growth Potential',
  digital_presence: 'Digital Presence',
  partnership_fit: 'Partnership Fit',
}

const categoryColors: Record<string, string> = {
  luxury_aesthetic: 'bg-purple-100 text-purple-700',
  revenue_likelihood: 'bg-green-100 text-green-700',
  retail_readiness: 'bg-blue-100 text-blue-700',
  wellness_alignment: 'bg-teal-100 text-teal-700',
  growth_potential: 'bg-orange-100 text-orange-700',
  digital_presence: 'bg-indigo-100 text-indigo-700',
  partnership_fit: 'bg-pink-100 text-pink-700',
}

export default function SalonSignalsList({ salonId, signals }: SalonSignalsListProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Group signals by category
  const signalsByCategory = signals.reduce((acc, signal) => {
    const category = signal.signal_category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(signal)
    return acc
  }, {} as Record<string, any[]>)

  const filteredSignals = selectedCategory === 'all'
    ? signals
    : signals.filter(s => s.signal_category === selectedCategory)

  if (signals.length === 0 && !showAddForm) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Database className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No Signals Collected</h3>
          <p className="text-slate-600 mb-4">
            Enrich this salon with data signals to enable scoring
          </p>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Signal
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Signals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{signals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Categories Covered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {Object.keys(signalsByCategory).length} / 7
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Avg Confidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {signals.length > 0
                ? (signals.reduce((acc, s) => acc + s.confidence_score, 0) / signals.length * 100).toFixed(0)
                : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Signals List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Data Signals</CardTitle>
              <CardDescription>
                Raw data points collected for scoring
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Signal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({signals.length})</TabsTrigger>
              {Object.entries(signalsByCategory).map(([category, categorySignals]) => (
                <TabsTrigger key={category} value={category}>
                  {categoryLabels[category]} ({categorySignals.length})
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="space-y-3">
              {filteredSignals.map((signal) => (
                <div
                  key={signal.id}
                  className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={categoryColors[signal.signal_category]}>
                          {categoryLabels[signal.signal_category]}
                        </Badge>
                        <Badge variant="outline">
                          {signal.signal_type.replace(/_/g, ' ')}
                        </Badge>
                        {signal.confidence_score < 0.8 && (
                          <Badge variant="secondary" className="text-xs">
                            Low Confidence
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-1">
                        {typeof signal.raw_value === 'object' ? (
                          <div className="text-sm">
                            {Object.entries(signal.raw_value as Record<string, any>).map(([key, value]) => (
                              <p key={key} className="text-slate-700">
                                <span className="font-medium">{key}:</span> {String(value)}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-slate-700">{String(signal.raw_value)}</p>
                        )}
                      </div>

                      {signal.normalized_value !== null && (
                        <div className="mt-2 flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-slate-400" />
                            <span className="text-sm text-slate-600">
                              Normalized: {signal.normalized_value}/100
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-slate-400" />
                            <span className="text-sm text-slate-600">
                              Confidence: {(signal.confidence_score * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-slate-500 mt-2">
                        Collected {formatDate(signal.collected_at)}
                        {signal.expires_at && ` • Expires ${formatDate(signal.expires_at)}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {showAddForm && (
        <AddSignalForm
          salonId={salonId}
          onSuccess={() => setShowAddForm(false)}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  )
}