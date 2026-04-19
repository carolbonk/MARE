'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Define the schema directly here for the form
const createSalonSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  brand_name: z.string().nullable().optional(),
  website: z.string().optional().refine(
    (val) => !val || val === '' || /^https?:\/\/.+/.test(val),
    'Invalid URL'
  ),
  phone: z.string().optional(),
  email: z.string().optional().refine(
    (val) => !val || val === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    'Invalid email'
  ),
})

type CreateSalonInput = z.infer<typeof createSalonSchema>
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Loader2, Building2, Globe, Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function NewSalonPage() {
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showLocation, setShowLocation] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateSalonInput>({
    resolver: zodResolver(createSalonSchema),
  })

  const onSubmit = async (data: CreateSalonInput) => {
    setError(null)
    setIsSubmitting(true)

    try {
      // DEMO MODE: Simulate salon creation
      console.log('Demo Mode: Creating salon with data:', data)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Generate a random ID for the new salon
      const newSalonId = Math.random().toString(36).substr(2, 9)

      // Redirect to salons list page after "creation"
      router.push('/salons')
      router.refresh()
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/salons"
            className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Salons
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Add New Salon</h1>
          <p className="text-slate-600 mt-2">
            Enter salon information to start the enrichment process
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Core details about the salon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Salon Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="e.g., Luxe Beauty Salon"
                      className="pl-10"
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand_name">Brand Name</Label>
                  <Input
                    id="brand_name"
                    {...register('brand_name')}
                    placeholder="If different from salon name"
                    disabled={isSubmitting}
                  />
                  {errors.brand_name && (
                    <p className="text-sm text-red-600">{errors.brand_name.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                How to reach the salon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="website"
                    type="url"
                    {...register('website')}
                    placeholder="https://example.com"
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.website && (
                  <p className="text-sm text-red-600">{errors.website.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="contact@salon.com"
                      className="pl-10"
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      placeholder="(555) 123-4567"
                      className="pl-10"
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Option */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
              <CardDescription>
                Add location information after creating the salon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="addLocation"
                  checked={showLocation}
                  onChange={(e) => setShowLocation(e.target.checked)}
                  className="rounded border-slate-300"
                  disabled={isSubmitting}
                />
                <Label htmlFor="addLocation" className="font-normal cursor-pointer">
                  Add location details after creating salon
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/salons')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Salon'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}