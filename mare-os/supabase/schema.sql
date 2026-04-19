-- MaRe OS Database Schema
-- Luxury Fit Score Module

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- Custom types
CREATE TYPE user_role AS ENUM ('admin', 'reviewer', 'analyst', 'growth_lead', 'viewer');
CREATE TYPE salon_status AS ENUM ('draft', 'enriching', 'scoring', 'review', 'approved', 'rejected', 'on_hold');
CREATE TYPE data_source_type AS ENUM ('manual', 'google_places', 'yelp', 'instagram', 'website', 'booking_platform', 'other');
CREATE TYPE signal_category AS ENUM (
  'luxury_aesthetic',
  'revenue_likelihood',
  'retail_readiness',
  'wellness_alignment',
  'growth_potential',
  'digital_presence',
  'partnership_fit'
);
CREATE TYPE review_decision AS ENUM ('approve', 'reject', 'hold', 'request_info');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'viewer',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User roles audit table
CREATE TABLE user_role_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  old_role user_role,
  new_role user_role NOT NULL,
  changed_by UUID REFERENCES profiles(id),
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  reason TEXT
);

-- Salons main table
CREATE TABLE salons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  brand_name TEXT, -- If different from operating name
  website TEXT,
  phone TEXT,
  email TEXT,
  status salon_status DEFAULT 'draft',

  -- Metadata
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Search optimization
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(brand_name, '')), 'B')
  ) STORED,

  CONSTRAINT unique_salon_name_brand UNIQUE(name, brand_name)
);

-- Create search index
CREATE INDEX idx_salons_search ON salons USING GIN(search_vector);

-- Salon locations (supports multi-location)
CREATE TABLE salon_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,

  -- Address
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state_province TEXT NOT NULL,
  postal_code TEXT,
  country TEXT DEFAULT 'USA',

  -- Geo data
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  neighborhood TEXT,

  -- Location metadata
  is_primary BOOLEAN DEFAULT FALSE,
  location_type TEXT, -- flagship, boutique, express, etc.
  opened_date DATE,
  square_footage INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_primary_per_salon UNIQUE(salon_id, is_primary) WHERE is_primary = TRUE
);

-- Create geo index
CREATE INDEX idx_salon_locations_geo ON salon_locations(latitude, longitude);
CREATE INDEX idx_salon_locations_city_state ON salon_locations(city, state_province);

-- Data sources configuration
CREATE TABLE data_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  type data_source_type NOT NULL,
  config JSONB DEFAULT '{}', -- API keys, endpoints, etc.
  is_active BOOLEAN DEFAULT TRUE,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Raw signals from data sources
CREATE TABLE salon_signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  location_id UUID REFERENCES salon_locations(id) ON DELETE CASCADE,
  data_source_id UUID REFERENCES data_sources(id),

  -- Signal data
  signal_type TEXT NOT NULL, -- e.g., 'review_count', 'avg_price', 'has_scalp_treatment'
  signal_category signal_category NOT NULL,
  raw_value JSONB NOT NULL, -- Flexible storage for any signal type
  normalized_value DECIMAL(5, 2), -- 0-100 normalized score

  -- Metadata
  confidence_score DECIMAL(3, 2) DEFAULT 1.0, -- 0-1 confidence
  collected_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- When this signal should be refreshed

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate signals
  CONSTRAINT unique_salon_signal UNIQUE(salon_id, location_id, signal_type, data_source_id)
);

CREATE INDEX idx_salon_signals_salon ON salon_signals(salon_id);
CREATE INDEX idx_salon_signals_category ON salon_signals(signal_category);

-- Computed scores
CREATE TABLE salon_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,

  -- Sub-scores (0-100)
  luxury_aesthetic_score DECIMAL(5, 2),
  revenue_likelihood_score DECIMAL(5, 2),
  retail_readiness_score DECIMAL(5, 2),
  wellness_alignment_score DECIMAL(5, 2),
  growth_potential_score DECIMAL(5, 2),
  digital_presence_score DECIMAL(5, 2),
  partnership_fit_score DECIMAL(5, 2),

  -- Total weighted score
  total_score DECIMAL(5, 2) NOT NULL,

  -- Score metadata
  score_version TEXT DEFAULT 'v1.0',
  computed_at TIMESTAMPTZ DEFAULT NOW(),
  computed_by UUID REFERENCES profiles(id),
  is_current BOOLEAN DEFAULT TRUE,

  -- Manual adjustments
  manual_adjustment DECIMAL(5, 2) DEFAULT 0,
  adjustment_reason TEXT,
  adjusted_by UUID REFERENCES profiles(id),

  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Only one current score per salon
  CONSTRAINT unique_current_score UNIQUE(salon_id, is_current) WHERE is_current = TRUE
);

CREATE INDEX idx_salon_scores_current ON salon_scores(salon_id) WHERE is_current = TRUE;
CREATE INDEX idx_salon_scores_total ON salon_scores(total_score DESC);

-- Score explanations/reasons
CREATE TABLE salon_score_reasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  score_id UUID NOT NULL REFERENCES salon_scores(id) ON DELETE CASCADE,
  category signal_category NOT NULL,

  -- Reason details
  reason_type TEXT NOT NULL, -- 'positive', 'negative', 'neutral'
  reason_text TEXT NOT NULL,
  impact_value DECIMAL(5, 2), -- How much this affected the score
  signal_ids UUID[], -- References to signals that contributed

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_score_reasons_score ON salon_score_reasons(score_id);

-- Review queue and workflow
CREATE TABLE review_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  score_id UUID REFERENCES salon_scores(id),

  -- Review state
  assigned_to UUID REFERENCES profiles(id),
  priority INTEGER DEFAULT 0, -- Higher = more urgent
  decision review_decision,
  decision_made_by UUID REFERENCES profiles(id),
  decision_made_at TIMESTAMPTZ,

  -- Review notes
  internal_notes TEXT,
  decision_rationale TEXT,
  follow_up_required BOOLEAN DEFAULT FALSE,
  follow_up_date DATE,

  -- Timestamps
  added_to_queue_at TIMESTAMPTZ DEFAULT NOW(),
  review_started_at TIMESTAMPTZ,
  review_completed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate queue entries
  CONSTRAINT unique_active_review UNIQUE(salon_id, decision_made_at) WHERE decision_made_at IS NULL
);

CREATE INDEX idx_review_queue_pending ON review_queue(priority DESC) WHERE decision IS NULL;
CREATE INDEX idx_review_queue_assigned ON review_queue(assigned_to) WHERE decision IS NULL;

-- Review comments/activity
CREATE TABLE review_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES review_queue(id) ON DELETE CASCADE,

  author_id UUID NOT NULL REFERENCES profiles(id),
  comment_text TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT TRUE, -- Internal vs. shareable with salon

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Outreach profiles for approved salons
CREATE TABLE outreach_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  review_id UUID REFERENCES review_queue(id),

  -- Key talking points
  executive_summary TEXT NOT NULL,
  key_strengths JSONB NOT NULL, -- Array of strength points
  partnership_angle TEXT NOT NULL,
  suggested_approach TEXT NOT NULL,

  -- Contact strategy
  primary_contact_method TEXT,
  best_time_to_contact TEXT,
  decision_maker_profile JSONB, -- Name, role, etc.

  -- Outreach metadata
  tier TEXT, -- 'platinum', 'gold', 'silver'
  expected_ltv DECIMAL(12, 2),
  urgency_level INTEGER DEFAULT 0,

  -- Status tracking
  outreach_status TEXT DEFAULT 'pending', -- pending, in_progress, contacted, negotiating, closed_won, closed_lost
  last_contact_date DATE,
  next_follow_up_date DATE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),

  CONSTRAINT unique_salon_outreach UNIQUE(salon_id)
);

CREATE INDEX idx_outreach_profiles_status ON outreach_profiles(outreach_status);
CREATE INDEX idx_outreach_profiles_tier ON outreach_profiles(tier);

-- Activity log for audit trail
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- What happened
  entity_type TEXT NOT NULL, -- 'salon', 'review', 'score', etc.
  entity_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'created', 'updated', 'approved', etc.

  -- Who did it
  user_id UUID REFERENCES profiles(id),

  -- Additional context
  old_values JSONB,
  new_values JSONB,
  metadata JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);

-- Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE salon_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE salon_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE salon_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_profiles ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (to be expanded based on requirements)
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Authenticated users can view salons" ON salons
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Analysts and above can insert salons" ON salons
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'reviewer', 'analyst', 'growth_lead')
    )
  );

-- Helper functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_salons_updated_at BEFORE UPDATE ON salons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_salon_locations_updated_at BEFORE UPDATE ON salon_locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_review_queue_updated_at BEFORE UPDATE ON review_queue
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_outreach_profiles_updated_at BEFORE UPDATE ON outreach_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to compute weighted score
CREATE OR REPLACE FUNCTION compute_weighted_score(
  p_luxury DECIMAL,
  p_revenue DECIMAL,
  p_retail DECIMAL,
  p_wellness DECIMAL,
  p_growth DECIMAL,
  p_digital DECIMAL,
  p_partnership DECIMAL
) RETURNS DECIMAL AS $$
BEGIN
  RETURN (
    (COALESCE(p_luxury, 0) * 0.25) +
    (COALESCE(p_revenue, 0) * 0.20) +
    (COALESCE(p_retail, 0) * 0.15) +
    (COALESCE(p_wellness, 0) * 0.15) +
    (COALESCE(p_growth, 0) * 0.10) +
    (COALESCE(p_digital, 0) * 0.10) +
    (COALESCE(p_partnership, 0) * 0.05)
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Initial seed data for data sources
INSERT INTO data_sources (name, type, config, is_active) VALUES
  ('Manual Entry', 'manual', '{}', true),
  ('Google Places API', 'google_places', '{"requires_api_key": true}', false),
  ('Yelp Fusion API', 'yelp', '{"requires_api_key": true}', false),
  ('Instagram Basic Display', 'instagram', '{"requires_oauth": true}', false),
  ('Website Scraper', 'website', '{"user_agent": "MaReOS/1.0"}', false);

-- Indexes for performance
CREATE INDEX idx_salons_status ON salons(status);
CREATE INDEX idx_salons_created_at ON salons(created_at DESC);
CREATE INDEX idx_review_queue_salon ON review_queue(salon_id);
CREATE INDEX idx_outreach_profiles_salon ON outreach_profiles(salon_id);

-- Comments for documentation
COMMENT ON TABLE salons IS 'Main salon entities tracked in the system';
COMMENT ON TABLE salon_scores IS 'Computed luxury fit scores with sub-category breakdowns';
COMMENT ON TABLE review_queue IS 'Workflow for reviewing and approving salons';
COMMENT ON TABLE outreach_profiles IS 'Approved salon talking points and outreach strategy';
COMMENT ON COLUMN salon_signals.normalized_value IS 'Signal value normalized to 0-100 scale for scoring';
COMMENT ON COLUMN salon_scores.total_score IS 'Weighted average of all sub-scores (0-100)';