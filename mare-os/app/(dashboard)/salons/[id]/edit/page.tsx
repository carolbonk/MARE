import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Edit } from 'lucide-react'

export default function EditSalonPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/salons/${params.id}`}
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Salon
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Edit Salon</h1>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <Edit className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Coming Soon</h3>
          <p className="text-slate-600 mb-4">
            Salon editing will be available in the next release
          </p>
          <Link href={`/salons/${params.id}`}>
            <Button variant="outline">Back to Salon</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}