'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Loader2, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const signalSchema = z.object({
  signal_type: z.string().min(1, 'Signal type is required'),
  signal_category: z.enum([
    'luxury_aesthetic',
    'revenue_likelihood',
    'retail_readiness',
    'wellness_alignment',
    'growth_potential',
    'digital_presence',
    'partnership_fit',
  ]),
  raw_value: z.any(),
  confidence_score: z.number().min(0).max(1),
})

type SignalFormData = z.infer<typeof signalSchema>

interface AddSignalFormProps {
  salonId: string
  onSuccess?: () => void
  onCancel?: () => void
}

// Signal templates for common signal types
const SIGNAL_TEMPLATES = {
  luxury_aesthetic: [
    { type: 'price_range_high', label: 'Average Service Price', inputType: 'number', unit: '$' },
    { type: 'interior_quality', label: 'Interior Quality', inputType: 'select', options: ['luxury', 'upscale', 'modern', 'standard', 'basic'] },
    { type: 'luxury_neighborhood', label: 'Luxury Neighborhood', inputType: 'boolean' },
    { type: 'brand_partnerships', label: 'Premium Brand Partners', inputType: 'array' },
  ],
  revenue_likelihood: [
    { type: 'avg_transaction_value', label: 'Average Transaction Value', inputType: 'number', unit: '$' },
    { type: 'client_retention_rate', label: 'Client Retention Rate', inputType: 'percentage' },
    { type: 'booking_frequency', label: 'Avg Bookings/Month', inputType: 'number' },
    { type: 'review_count', label: 'Total Review Count', inputType: 'number' },
  ],
  retail_readiness: [
    { type: 'has_retail_space', label: 'Has Retail Space', inputType: 'boolean' },
    { type: 'current_retail_brands', label: 'Current Retail Brands Count', inputType: 'number' },
    { type: 'retail_sales_percentage', label: 'Retail Sales %', inputType: 'percentage' },
  ],
  wellness_alignment: [
    { type: 'has_scalp_treatment', label: 'Offers Scalp Treatments', inputType: 'boolean' },
    { type: 'wellness_menu_items', label: 'Wellness Services Count', inputType: 'number' },
    { type: 'organic_focus', label: 'Organic/Natural Focus', inputType: 'boolean' },
    { type: 'holistic_approach', label: 'Holistic Approach', inputType: 'boolean' },
  ],
  growth_potential: [
    { type: 'location_count', label: 'Number of Locations', inputType: 'number' },
    { type: 'years_in_business', label: 'Years in Business', inputType: 'number' },
    { type: 'expansion_plans', label: 'Has Expansion Plans', inputType: 'boolean' },
  ],
  digital_presence: [
    { type: 'website_quality', label: 'Website Quality', inputType: 'select', options: ['excellent', 'good', 'average', 'poor', 'none'] },
    { type: 'social_media_followers', label: 'Total Social Followers', inputType: 'number' },
    { type: 'online_booking', label: 'Has Online Booking', inputType: 'boolean' },
    { type: 'review_rating', label: 'Average Review Rating', inputType: 'rating' },
  ],
  partnership_fit: [
    { type: 'brand_alignment', label: 'Brand Alignment Score', inputType: 'slider', min: 0, max: 100 },
    { type: 'management_quality', label: 'Management Quality', inputType: 'select', options: ['excellent', 'good', 'average', 'poor'] },
    { type: 'innovation_openness', label: 'Open to Innovation', inputType: 'boolean' },
  ],
}

export default function AddSignalForm({ salonId, onSuccess, onCancel }: AddSignalFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('luxury_aesthetic')
  const [selectedSignalType, setSelectedSignalType] = useState<string>('')
  const [rawValue, setRawValue] = useState<any>('')
  const [confidenceScore, setConfidenceScore] = useState(0.8)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const supabase = createClient()

      // Process raw value based on signal type
      let processedValue = rawValue
      const template = SIGNAL_TEMPLATES[selectedCategory as keyof typeof SIGNAL_TEMPLATES]
        ?.find(t => t.type === selectedSignalType)

      if (template?.inputType === 'number' || template?.inputType === 'percentage') {
        processedValue = parseFloat(rawValue)
      } else if (template?.inputType === 'boolean') {
        processedValue = rawValue === 'true' || rawValue === true
      } else if (template?.inputType === 'array') {
        processedValue = rawValue.split(',').map((s: string) => s.trim()).filter(Boolean)
      }

      // Insert signal
      const { data, error: insertError } = await supabase
        .from('salon_signals')
        .insert({
          salon_id: salonId,
          signal_type: selectedSignalType,
          signal_category: selectedCategory,
          raw_value: processedValue,
          confidence_score: confidenceScore,
        })
        .select()
        .single()

      if (insertError) {
        // Check if it's a duplicate
        if (insertError.code === '23505') {
          setError('This signal already exists for this salon')
        } else {
          setError(insertError.message)
        }
      } else {
        router.refresh()
        if (onSuccess) onSuccess()

        // Reset form
        setSelectedSignalType('')
        setRawValue('')
        setConfidenceScore(0.8)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentTemplate = SIGNAL_TEMPLATES[selectedCategory as keyof typeof SIGNAL_TEMPLATES]
    ?.find(t => t.type === selectedSignalType)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Data Signal</CardTitle>
        <CardDescription>
          Enrich the salon with data points for scoring
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="category">Signal Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                setSelectedCategory(value)
                setSelectedSignalType('')
                setRawValue('')
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="luxury_aesthetic">Luxury & Aesthetic</SelectItem>
                <SelectItem value="revenue_likelihood">Revenue Likelihood</SelectItem>
                <SelectItem value="retail_readiness">Retail Readiness</SelectItem>
                <SelectItem value="wellness_alignment">Wellness Alignment</SelectItem>
                <SelectItem value="growth_potential">Growth Potential</SelectItem>
                <SelectItem value="digital_presence">Digital Presence</SelectItem>
                <SelectItem value="partnership_fit">Partnership Fit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signal_type">Signal Type</Label>
            <Select
              value={selectedSignalType}
              onValueChange={(value) => {
                setSelectedSignalType(value)
                setRawValue('')
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a signal type" />
              </SelectTrigger>
              <SelectContent>
                {SIGNAL_TEMPLATES[selectedCategory as keyof typeof SIGNAL_TEMPLATES]?.map((template) => (
                  <SelectItem key={template.type} value={template.type}>
                    {template.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSignalType && currentTemplate && (
            <div className="space-y-2">
              <Label htmlFor="value">{currentTemplate.label} Value</Label>

              {currentTemplate.inputType === 'number' && (
                <div className="flex gap-2">
                  {currentTemplate.unit && (
                    <span className="flex items-center px-3 bg-slate-100 rounded-l-md">
                      {currentTemplate.unit}
                    </span>
                  )}
                  <Input
                    type="number"
                    value={rawValue}
                    onChange={(e) => setRawValue(e.target.value)}
                    placeholder="Enter value"
                    required
                  />
                </div>
              )}

              {currentTemplate.inputType === 'percentage' && (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={rawValue}
                    onChange={(e) => setRawValue(e.target.value)}
                    placeholder="0-100"
                    required
                  />
                  <span className="flex items-center px-3 bg-slate-100 rounded-r-md">%</span>
                </div>
              )}

              {currentTemplate.inputType === 'boolean' && (
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={rawValue === true || rawValue === 'true'}
                    onCheckedChange={(checked) => setRawValue(checked)}
                  />
                  <Label>{rawValue ? 'Yes' : 'No'}</Label>
                </div>
              )}

              {currentTemplate.inputType === 'select' && (
                <Select value={rawValue} onValueChange={setRawValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentTemplate.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {currentTemplate.inputType === 'array' && (
                <Textarea
                  value={rawValue}
                  onChange={(e) => setRawValue(e.target.value)}
                  placeholder="Enter comma-separated values"
                  rows={3}
                />
              )}

              {currentTemplate.inputType === 'rating' && (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={rawValue}
                    onChange={(e) => setRawValue(e.target.value)}
                    placeholder="0.0 - 5.0"
                    required
                  />
                  <span className="flex items-center px-3 bg-slate-100 rounded-r-md">/ 5.0</span>
                </div>
              )}

              {currentTemplate.inputType === 'slider' && (
                <div className="space-y-2">
                  <Slider
                    value={[rawValue || 50]}
                    onValueChange={([value]) => setRawValue(value)}
                    min={currentTemplate.min || 0}
                    max={currentTemplate.max || 100}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{currentTemplate.min || 0}</span>
                    <span className="font-medium text-slate-900">{rawValue || 50}</span>
                    <span>{currentTemplate.max || 100}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="confidence">
              Confidence Score: {Math.round(confidenceScore * 100)}%
            </Label>
            <Slider
              value={[confidenceScore]}
              onValueChange={([value]) => setConfidenceScore(value)}
              min={0}
              max={1}
              step={0.1}
            />
            <p className="text-xs text-slate-500">
              How confident are you in the accuracy of this data?
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting || !selectedSignalType || rawValue === ''}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Signal
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}