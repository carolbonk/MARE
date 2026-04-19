import { Card, CardContent } from '@/components/ui/card'
import { FileBarChart } from 'lucide-react'

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
        <p className="text-slate-600 mt-2">
          Analytics and performance reports
        </p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <FileBarChart className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Coming Soon</h3>
          <p className="text-slate-600">
            Reporting features will be available in the next release
          </p>
        </CardContent>
      </Card>
    </div>
  )
}