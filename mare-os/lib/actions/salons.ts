'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Validation schemas
export const createSalonSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  brand_name: z.string().nullable().optional(),
  website: z.string().url('Invalid URL').nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().email('Invalid email').nullable().optional(),
})

export const createLocationSchema = z.object({
  salon_id: z.string().uuid(),
  address_line1: z.string().min(1, 'Address is required'),
  address_line2: z.string().nullable().optional(),
  city: z.string().min(1, 'City is required'),
  state_province: z.string().min(1, 'State is required'),
  postal_code: z.string().nullable().optional(),
  country: z.string().default('USA'),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  neighborhood: z.string().nullable().optional(),
  is_primary: z.boolean().default(false),
  location_type: z.string().nullable().optional(),
  square_footage: z.number().nullable().optional(),
})

export type CreateSalonInput = z.infer<typeof createSalonSchema>
export type CreateLocationInput = z.infer<typeof createLocationSchema>

export async function createSalon(data: CreateSalonInput) {
  try {
    const supabase = await createClient()
    // DEMO MODE: Skip auth check
    const validatedData = createSalonSchema.parse(data)

    const { data: salon, error } = await supabase
      .from('salons')
      .insert({
        ...validatedData,
        created_by: null, // Demo mode: no user ID
      } as any)
      .select()
      .single()

    if (error) {
      console.error('Error creating salon:', error)
      return { error: error.message }
    }

    revalidatePath('/salons')
    return { data: salon }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message }
    }
    return { error: 'Failed to create salon' }
  }
}

export async function updateSalon(id: string, data: Partial<CreateSalonInput>) {
  try {
    const supabase = await createClient()
    // DEMO MODE: Skip auth check

    // @ts-ignore - Supabase types need database connection
    const { data: salon, error } = await supabase
      .from('salons')
      .update(data as any)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating salon:', error)
      return { error: error.message }
    }

    revalidatePath('/salons')
    revalidatePath(`/salons/${id}`)
    return { data: salon }
  } catch (error) {
    return { error: 'Failed to update salon' }
  }
}

export async function deleteSalon(id: string) {
  try {
    const supabase = await createClient()
    // DEMO MODE: Skip auth and role checks

    const { error } = await supabase
      .from('salons')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting salon:', error)
      return { error: error.message }
    }

    revalidatePath('/salons')
    return { success: true }
  } catch (error) {
    return { error: 'Failed to delete salon' }
  }
}

export async function addSalonLocation(data: CreateLocationInput) {
  try {
    const supabase = await createClient()
    // DEMO MODE: Skip auth check

    const validatedData = createLocationSchema.parse(data)

    // If setting as primary, unset other primary locations
    if (validatedData.is_primary) {
      // @ts-ignore - Supabase types need database connection
      await supabase
        .from('salon_locations')
        .update({ is_primary: false } as any)
        .eq('salon_id', validatedData.salon_id)
    }

    // @ts-ignore - Supabase types need database connection
    const { data: location, error } = await supabase
      .from('salon_locations')
      .insert([validatedData] as any)
      .select()
      .single()

    if (error) {
      console.error('Error adding location:', error)
      return { error: error.message }
    }

    revalidatePath(`/salons/${validatedData.salon_id}`)
    return { data: location }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message }
    }
    return { error: 'Failed to add location' }
  }
}

export async function updateSalonStatus(id: string, status: string) {
  try {
    const supabase = await createClient()
    // DEMO MODE: Skip auth check

    // @ts-ignore - Supabase types need database connection
    const { data: salon, error } = await supabase
      .from('salons')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating salon status:', error)
      return { error: error.message }
    }

    // If moving to review, add to review queue
    if (status === 'review') {
      // @ts-ignore - Supabase types need database connection
      await supabase
        .from('review_queue')
        .insert({
          salon_id: id,
        } as any)
    }

    revalidatePath('/salons')
    revalidatePath(`/salons/${id}`)
    return { data: salon }
  } catch (error) {
    return { error: 'Failed to update salon status' }
  }
}

export async function getSalonWithDetails(id: string) {
  try {
    const supabase = await createClient()

    const { data: salon, error } = await supabase
      .from('salons')
      .select(`
        *,
        salon_locations (*),
        salon_scores (
          *,
          salon_score_reasons (*)
        ),
        salon_signals (*),
        review_queue (*),
        outreach_profiles (*),
        profiles!created_by (
          full_name,
          email
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching salon:', error)
      return { error: error.message }
    }

    return { data: salon }
  } catch (error) {
    return { error: 'Failed to fetch salon' }
  }
}