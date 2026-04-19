'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TrendingUp, Loader2, Calculator, RefreshCw } from 'lucide-react'
import { calculateSalonScore } from '@/lib/actions/scoring'

interface SalonScoringActionsProps {
  salonId: string
  hasSignals: boolean
  hasCurrentScore: boolean
}

export default function SalonScoringActions({
  salonId,
  hasSignals,
  hasCurrentScore
}: SalonScoringActionsProps) {
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const handleCalculateScore = async () => {
    setError(null)
    setSuccess(null)
    setIsCalculating(true)

    try {
      const result = await calculateSalonScore(salonId)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(
          hasCurrentScore
            ? 'Score recalculated successfully!'
            : 'Score calculated successfully!'
        )
        setTimeout(() => {
          router.refresh()
        }, 1500)
      }
    } catch (err) {
      setError('Failed to calculate score')
    } finally {
      setIsCalculating(false)
    }
  }

  if (!hasSignals) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center space-y-4">
            <TrendingUp className="h-12 w-12 text-slate-300 mx-auto" />
            <div>
              <h3 className="text-lg font-medium text-slate-900">No Signals Available</h3>
              <p className="text-sm text-slate-600 mt-1">
                Add data signals before calculating the score
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scoring Actions</CardTitle>
        <CardDescription>
          Calculate or update the luxury fit score based on current signals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription className="text-green-600">{success}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleCalculateScore}
            disabled={isCalculating}
            className="flex-1"
          >
            {isCalculating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : hasCurrentScore ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Recalculate Score
              </>
            ) : (
              <>
                <Calculator className="mr-2 h-4 w-4" />
                Calculate Score
              </>
            )}
          </Button>
        </div>

        <p className="text-sm text-slate-500">
          {hasCurrentScore
            ? 'Recalculating will update the score based on the latest signals.'
            : 'This will generate a luxury fit score based on all available signals.'}
        </p>
      </CardContent>
    </Card>
  )
}