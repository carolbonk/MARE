import { Card, CardContent } from '@/components/ui/card'
import { Send } from 'lucide-react'

export default function OutreachPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Outreach</h1>
        <p className="text-slate-600 mt-2">
          Manage approved salon outreach and talking points
        </p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <Send className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No Outreach Profiles</h3>
          <p className="text-slate-600">
            Approved salons will appear here for outreach
          </p>
        </CardContent>
      </Card>
    </div>
  )
}