import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Database } from 'lucide-react'

export default function DataSourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Data Sources</h1>
        <p className="text-slate-600 mt-2">
          Manage external data integrations and enrichment sources
        </p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <Database className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Coming Soon</h3>
          <p className="text-slate-600">
            Data source management will be available in the next release
          </p>
        </CardContent>
      </Card>
    </div>
  )
}