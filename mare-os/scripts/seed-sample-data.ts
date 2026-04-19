/**
 * Sample Data Seeder for MaRe OS
 * Run this script to populate the database with sample data for testing
 *
 * Usage: npx tsx scripts/seed-sample-data.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
})

// Sample salon data
const SAMPLE_SALONS = [
  {
    name: 'Luxe Beauty Lounge',
    brand_name: 'Luxe Beauty',
    website: 'https://luxebeautylounge.com',
    phone: '(212) 555-0101',
    email: 'info@luxebeautylounge.com',
    status: 'scoring',
  },
  {
    name: 'Serenity Spa & Salon',
    brand_name: null,
    website: 'https://serenityspa.com',
    phone: '(310) 555-0102',
    email: 'hello@serenityspa.com',
    status: 'review',
  },
  {
    name: 'The Velvet Chair',
    brand_name: 'Velvet',
    website: 'https://velvetchair.com',
    phone: '(415) 555-0103',
    email: 'contact@velvetchair.com',
    status: 'approved',
  },
  {
    name: 'Bloom Wellness Studio',
    brand_name: 'Bloom',
    website: 'https://bloomwellness.com',
    phone: '(305) 555-0104',
    email: 'info@bloomwellness.com',
    status: 'enriching',
  },
  {
    name: 'Fifth Avenue Salon',
    brand_name: null,
    website: 'https://fifthavesalon.com',
    phone: '(212) 555-0105',
    email: 'bookings@fifthavesalon.com',
    status: 'draft',
  },
]

// Sample locations
const SAMPLE_LOCATIONS = [
  {
    address_line1: '123 Madison Avenue',
    city: 'New York',
    state_province: 'NY',
    postal_code: '10016',
    neighborhood: 'Midtown Manhattan',
    is_primary: true,
    location_type: 'flagship',
  },
  {
    address_line1: '456 Rodeo Drive',
    city: 'Beverly Hills',
    state_province: 'CA',
    postal_code: '90210',
    neighborhood: 'Golden Triangle',
    is_primary: true,
    location_type: 'boutique',
  },
  {
    address_line1: '789 Union Square',
    city: 'San Francisco',
    state_province: 'CA',
    postal_code: '94108',
    neighborhood: 'Union Square',
    is_primary: true,
    location_type: 'flagship',
  },
  {
    address_line1: '321 Ocean Drive',
    city: 'Miami Beach',
    state_province: 'FL',
    postal_code: '33139',
    neighborhood: 'South Beach',
    is_primary: true,
    location_type: 'resort',
  },
  {
    address_line1: '555 Fifth Avenue',
    city: 'New York',
    state_province: 'NY',
    postal_code: '10017',
    neighborhood: 'Midtown',
    is_primary: true,
    location_type: 'flagship',
  },
]

// Sample signals for different categories
const SAMPLE_SIGNALS = [
  // Luxury & Aesthetic signals
  {
    signal_type: 'price_range_high',
    signal_category: 'luxury_aesthetic',
    raw_value: 250,
    normalized_value: 50,
    confidence_score: 0.9,
  },
  {
    signal_type: 'interior_quality',
    signal_category: 'luxury_aesthetic',
    raw_value: 'upscale',
    normalized_value: 80,
    confidence_score: 0.85,
  },
  {
    signal_type: 'luxury_neighborhood',
    signal_category: 'luxury_aesthetic',
    raw_value: true,
    normalized_value: 90,
    confidence_score: 1.0,
  },
  // Revenue likelihood signals
  {
    signal_type: 'avg_transaction_value',
    signal_category: 'revenue_likelihood',
    raw_value: 185,
    normalized_value: 61,
    confidence_score: 0.9,
  },
  {
    signal_type: 'client_retention_rate',
    signal_category: 'revenue_likelihood',
    raw_value: 75,
    normalized_value: 75,
    confidence_score: 0.8,
  },
  {
    signal_type: 'review_count',
    signal_category: 'revenue_likelihood',
    raw_value: 350,
    normalized_value: 70,
    confidence_score: 1.0,
  },
  // Retail readiness signals
  {
    signal_type: 'has_retail_space',
    signal_category: 'retail_readiness',
    raw_value: true,
    normalized_value: 80,
    confidence_score: 1.0,
  },
  {
    signal_type: 'current_retail_brands',
    signal_category: 'retail_readiness',
    raw_value: 5,
    normalized_value: 50,
    confidence_score: 0.9,
  },
  // Wellness alignment signals
  {
    signal_type: 'has_scalp_treatment',
    signal_category: 'wellness_alignment',
    raw_value: true,
    normalized_value: 90,
    confidence_score: 1.0,
  },
  {
    signal_type: 'organic_focus',
    signal_category: 'wellness_alignment',
    raw_value: true,
    normalized_value: 80,
    confidence_score: 0.85,
  },
  // Growth potential signals
  {
    signal_type: 'location_count',
    signal_category: 'growth_potential',
    raw_value: 2,
    normalized_value: 60,
    confidence_score: 1.0,
  },
  {
    signal_type: 'years_in_business',
    signal_category: 'growth_potential',
    raw_value: 7,
    normalized_value: 70,
    confidence_score: 0.95,
  },
  // Digital presence signals
  {
    signal_type: 'website_quality',
    signal_category: 'digital_presence',
    raw_value: 'good',
    normalized_value: 75,
    confidence_score: 0.8,
  },
  {
    signal_type: 'social_media_followers',
    signal_category: 'digital_presence',
    raw_value: 5500,
    normalized_value: 55,
    confidence_score: 1.0,
  },
  {
    signal_type: 'online_booking',
    signal_category: 'digital_presence',
    raw_value: true,
    normalized_value: 90,
    confidence_score: 1.0,
  },
  // Partnership fit signals
  {
    signal_type: 'brand_alignment',
    signal_category: 'partnership_fit',
    raw_value: 75,
    normalized_value: 75,
    confidence_score: 0.7,
  },
  {
    signal_type: 'innovation_openness',
    signal_category: 'partnership_fit',
    raw_value: true,
    normalized_value: 85,
    confidence_score: 0.8,
  },
]

async function seedSampleData() {
  console.log('🌱 Starting sample data seed...')

  try {
    // Get the first user to use as creator
    const { data: users, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)

    if (userError || !users || users.length === 0) {
      console.error('❌ No users found. Please create a user first.')
      return
    }

    const userId = users[0].id
    console.log(`✓ Using user ID: ${userId}`)

    // Insert salons
    console.log('📍 Creating sample salons...')
    const salonIds = []

    for (let i = 0; i < SAMPLE_SALONS.length; i++) {
      const salon = SAMPLE_SALONS[i]
      const { data, error } = await supabase
        .from('salons')
        .insert({
          ...salon,
          created_by: userId,
        })
        .select()
        .single()

      if (error) {
        console.error(`Failed to create salon ${salon.name}:`, error.message)
      } else {
        salonIds.push(data.id)
        console.log(`  ✓ Created salon: ${salon.name}`)

        // Add location
        const location = SAMPLE_LOCATIONS[i]
        await supabase
          .from('salon_locations')
          .insert({
            ...location,
            salon_id: data.id,
            country: 'USA',
          })
      }
    }

    // Add signals to first 3 salons
    console.log('📊 Adding sample signals...')
    for (let i = 0; i < 3 && i < salonIds.length; i++) {
      const salonId = salonIds[i]
      const signalCount = Math.floor(Math.random() * 5) + 10 // 10-15 signals per salon

      for (let j = 0; j < signalCount && j < SAMPLE_SIGNALS.length; j++) {
        const signal = SAMPLE_SIGNALS[j]
        await supabase
          .from('salon_signals')
          .insert({
            ...signal,
            salon_id: salonId,
          })
      }
      console.log(`  ✓ Added ${signalCount} signals to salon ${i + 1}`)
    }

    // Calculate scores for salons with signals
    console.log('🔢 Calculating sample scores...')
    for (let i = 0; i < 2 && i < salonIds.length; i++) {
      const salonId = salonIds[i]

      // Calculate sub-scores (simplified)
      const subScores = {
        luxury_aesthetic_score: 70 + Math.random() * 20,
        revenue_likelihood_score: 60 + Math.random() * 30,
        retail_readiness_score: 50 + Math.random() * 40,
        wellness_alignment_score: 70 + Math.random() * 25,
        growth_potential_score: 60 + Math.random() * 30,
        digital_presence_score: 65 + Math.random() * 25,
        partnership_fit_score: 70 + Math.random() * 20,
      }

      const totalScore =
        subScores.luxury_aesthetic_score * 0.25 +
        subScores.revenue_likelihood_score * 0.20 +
        subScores.retail_readiness_score * 0.15 +
        subScores.wellness_alignment_score * 0.15 +
        subScores.growth_potential_score * 0.10 +
        subScores.digital_presence_score * 0.10 +
        subScores.partnership_fit_score * 0.05

      const { data: score, error: scoreError } = await supabase
        .from('salon_scores')
        .insert({
          salon_id: salonId,
          ...subScores,
          total_score: Math.round(totalScore * 10) / 10,
          computed_by: userId,
          is_current: true,
        })
        .select()
        .single()

      if (!scoreError && score) {
        console.log(`  ✓ Calculated score for salon ${i + 1}: ${score.total_score}`)

        // Add to review queue if status is 'review'
        const salon = SAMPLE_SALONS[i]
        if (salon.status === 'review') {
          await supabase
            .from('review_queue')
            .insert({
              salon_id: salonId,
              score_id: score.id,
              priority: Math.floor(Math.random() * 3) + 1,
            })
          console.log(`  ✓ Added salon ${i + 1} to review queue`)
        }
      }
    }

    console.log('\n✅ Sample data seeding complete!')
    console.log('📝 Summary:')
    console.log(`  - ${SAMPLE_SALONS.length} salons created`)
    console.log(`  - ${SAMPLE_LOCATIONS.length} locations added`)
    console.log(`  - Signals added to 3 salons`)
    console.log(`  - Scores calculated for 2 salons`)
    console.log('\n🚀 You can now test the application with sample data!')

  } catch (error) {
    console.error('❌ Error seeding data:', error)
  }
}

// Run the seeder
seedSampleData()