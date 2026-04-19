# Luxury Fit Score Build Plan
**MaRe OS - Implementation Plan**
**Date:** April 19, 2026
**Version:** 1.0

---

## Table of Contents
1. [Current Architecture Overview](#current-architecture-overview)
2. [Existing Infrastructure](#existing-infrastructure)
3. [Implementation Phases](#implementation-phases)
4. [Technical Specifications](#technical-specifications)
5. [Integration Points](#integration-points)
6. [Risk Assessment](#risk-assessment)

---

## Current Architecture Overview

### Tech Stack
- **Framework**: Next.js 16.2.4 (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: Supabase (PostgreSQL with RLS)
- **Styling**: Tailwind CSS v4
- **UI Library**: shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **Authentication**: Supabase Auth (currently in demo mode)

### Directory Structure
```
mare-os/
├── app/
│   ├── (auth)/              # Authentication pages (login/signup)
│   ├── (dashboard)/         # Protected dashboard routes
│   │   ├── salons/         # Salon management
│   │   ├── scoring/        # Scoring configuration (placeholder)
│   │   ├── review/         # Review queue (placeholder)
│   │   └── outreach/       # Outreach management (placeholder)
│   └── page.tsx            # Root redirect
├── components/
│   ├── ui/                 # shadcn components (20+ components)
│   ├── dashboard/          # Layout components
│   └── salons/             # Salon-specific components
├── lib/
│   ├── supabase/          # Supabase client configuration
│   ├── actions/           # Server actions (salons, review, scoring)
│   ├── types/             # Database types
│   └── utils/             # Utilities
├── services/
│   └── scoring/
│       └── engine.ts      # Scoring engine implementation
├── supabase/
│   └── schema.sql         # Complete database schema
└── middleware.ts          # Auth protection
```

---

## Existing Infrastructure

### Database Schema (Already Implemented)

#### Core Tables
1. **profiles** - User management with role-based access
2. **salons** - Main salon entities
3. **salon_locations** - Multi-location support with geo data
4. **data_sources** - Data source configuration
5. **salon_signals** - Raw signal storage (flexible JSONB)
6. **salon_scores** - Computed scores with history
7. **salon_score_reasons** - Score explanations
8. **review_queue** - Review workflow
9. **outreach_profiles** - Approved salon talking points
10. **activity_logs** - Audit trail

#### Signal Categories (Already Defined)
```sql
CREATE TYPE signal_category AS ENUM (
  'luxury_aesthetic',
  'revenue_likelihood',
  'retail_readiness',
  'wellness_alignment',
  'growth_potential',
  'digital_presence',
  'partnership_fit'
);
```

#### Scoring Weights (Database Function)
```sql
-- Already implemented in schema.sql:362-382
luxury_aesthetic:    25%
revenue_likelihood:  20%
retail_readiness:    15%
wellness_alignment:  15%
growth_potential:    10%
digital_presence:    10%
partnership_fit:      5%
```

### Existing Components

#### Salon Management (Complete)
- `salon-table.tsx` - Salon listing with filters
- `salon-score-card.tsx` - Score visualization (ready for data)
- `salon-locations-list.tsx` - Location management
- `salon-signals-list.tsx` - Signal display and management
- `salon-status-actions.tsx` - Workflow state management
- `add-signal-form.tsx` - Manual signal input

#### Server Actions (Implemented)
1. **lib/actions/salons.ts**
   - createSalon()
   - updateSalon()
   - deleteSalon()
   - addSalonLocation()
   - updateSalonStatus()
   - getSalonWithDetails()

2. **lib/actions/scoring.ts**
   - calculateSalonScore()
   - recalculateAllScores()
   - adjustSalonScore()

3. **lib/actions/review.ts**
   - Placeholder for review actions

#### Scoring Engine (Partial Implementation)
**File**: `services/scoring/engine.ts`

**Status**: Core logic implemented but needs:
- Signal normalization improvements
- Additional scoring rules
- Better error handling
- Integration testing

**Current Features**:
- Signal scoring rules for 20+ signal types
- Category aggregation
- Weighted score calculation
- Reason generation
- Bulk recalculation

---

## Implementation Phases

### Phase 1: Complete Scoring Engine (Priority 1)
**Goal**: Make the scoring system fully operational

#### 1.1 Enhance Scoring Engine
**File**: `services/scoring/engine.ts`

**Tasks**:
- Add missing signal scoring rules
- Implement confidence-weighted aggregation
- Add validation for missing/incomplete signals
- Add error recovery mechanisms
- Implement caching for expensive calculations
- Add scoring version management

**Signal Types to Add**:
```typescript
// Additional luxury signals
'celebrity_clientele': (value: boolean) => value ? 95 : 30
'awards_recognition': (value: number) => Math.min(100, value * 20)
'press_mentions': (value: number) => Math.min(100, value * 10)
'price_point_comparison': (value: number) => value // 0-100 pre-normalized

// Additional revenue signals
'monthly_revenue': (value: number) => Math.min(100, (value / 50000) * 100)
'payment_methods': (value: string[]) => Math.min(100, value.length * 15)
'membership_program': (value: boolean) => value ? 85 : 40

// Additional wellness signals
'product_ingredients': (value: string) => /* organic/natural scoring */
'treatment_duration': (value: number) => /* longer = more premium */
'consultation_process': (value: boolean) => value ? 80 : 30
```

#### 1.2 Build Signal Input System
**New Component**: `components/salons/signal-input-wizard.tsx`

**Features**:
- Multi-step form for signal collection
- Category-based input screens
- Real-time score preview
- Validation and confidence indicators
- Data source tracking

**Integration**:
- Add to salon detail page as new tab
- Connect to `add-signal-form.tsx`
- Update `salon-signals-list.tsx` for bulk editing

#### 1.3 Scoring Dashboard
**File**: `app/(dashboard)/scoring/page.tsx` (currently placeholder)

**Features**:
- Weight configuration (admin only)
- Score distribution visualization
- Batch scoring interface
- Score version comparison
- Scoring rule documentation

---

### Phase 2: Review Workflow (Priority 2)
**Goal**: Enable human review and approval process

#### 2.1 Review Queue Page
**File**: `app/(dashboard)/review/page.tsx`

**Features**:
- Pending reviews list with priority sorting
- Salon preview cards with scores
- Assignment management
- Quick actions (approve/reject/hold)
- Bulk operations
- Filter by status, priority, assignee

#### 2.2 Review Detail View
**New Component**: `components/review/review-detail-panel.tsx`

**Features**:
- Full salon information display
- Score breakdown with reasons
- Signal evidence viewer
- Decision form with rationale
- Comment thread
- Follow-up scheduling
- History timeline

#### 2.3 Review Actions
**File**: `lib/actions/review.ts` (needs implementation)

**Functions**:
```typescript
async function assignReview(reviewId: string, userId: string)
async function submitReviewDecision(reviewId: string, decision: ReviewDecision)
async function addReviewComment(reviewId: string, comment: string)
async function updateReviewPriority(reviewId: string, priority: number)
async function scheduleFollowUp(reviewId: string, date: Date)
async function getReviewStats() // for dashboard KPIs
```

---

### Phase 3: Data Enrichment (Priority 3)
**Goal**: Automate signal collection from external sources

#### 3.1 Data Source Configuration
**File**: `app/(dashboard)/data-sources/page.tsx`

**Features**:
- Data source connection management
- API key configuration (encrypted storage)
- Sync schedule settings
- Status monitoring
- Error logs
- Test connection functionality

#### 3.2 Integration Services
**New Directory**: `services/integrations/`

**Files to Create**:
- `google-places.ts` - Google Places API client
- `yelp.ts` - Yelp Fusion API client
- `instagram.ts` - Instagram Basic Display API
- `web-scraper.ts` - Website metadata extraction
- `base-integration.ts` - Abstract base class

**Each Integration Should**:
- Fetch raw data
- Transform to signal format
- Store with confidence scores
- Handle rate limiting
- Log errors
- Support retry logic

#### 3.3 Bulk Enrichment UI
**New Component**: `components/data-sources/bulk-enrichment-wizard.tsx`

**Features**:
- Select salons for enrichment
- Choose data sources
- Progress monitoring
- Error handling
- Results summary
- Automatic re-scoring trigger

#### 3.4 Scheduler Service
**New File**: `services/scheduler/enrichment-scheduler.ts`

**Features**:
- Periodic data refresh based on `expires_at`
- Configurable refresh intervals per signal type
- Queue management
- Priority scheduling
- Background job processing (consider using Vercel Cron or Inngest)

---

### Phase 4: Outreach Module (Priority 4)
**Goal**: Generate actionable outreach profiles

#### 4.1 Outreach Profile Generation
**New File**: `services/outreach/profile-generator.ts`

**Features**:
- AI-generated executive summaries (consider OpenAI API)
- Key strengths extraction from signals
- Partnership angle recommendations
- Personalized talking points
- Tier assignment logic (Platinum/Gold/Silver)
- LTV estimation

**Algorithm**:
```typescript
interface OutreachProfile {
  tier: 'platinum' | 'gold' | 'silver'
  executiveSummary: string
  keyStrengths: string[]
  partnershipAngle: string
  suggestedApproach: string
  expectedLTV: number
  urgencyLevel: number
}

// Tier assignment:
// Platinum: total_score >= 80
// Gold: total_score >= 60
// Silver: total_score >= 40
```

#### 4.2 Outreach Dashboard
**File**: `app/(dashboard)/outreach/page.tsx`

**Features**:
- Approved salons list
- Tier-based filtering
- Status tracking (pending, contacted, negotiating, etc.)
- Contact history timeline
- Export to CRM format (CSV, JSON)
- Follow-up reminders

#### 4.3 Profile Export
**New Component**: `components/outreach/export-options.tsx`

**Export Formats**:
- PDF one-pager for sales team
- CSV for CRM import (Salesforce, HubSpot)
- JSON for API integrations
- Email template

---

### Phase 5: Advanced Features (Priority 5)

#### 5.1 Analytics & Reporting
**File**: `app/(dashboard)/reports/page.tsx`

**Features**:
- Score distribution over time
- Signal coverage analysis
- Review throughput metrics
- Conversion funnel visualization
- Data quality indicators
- Comparative analysis between tiers

#### 5.2 AI Enhancements
**New Service**: `services/ai/`

**Features**:
- Website screenshot analysis (vision model)
- Social media sentiment analysis
- Automated signal extraction from text
- Brand alignment scoring
- Competitive positioning analysis

#### 5.3 Mobile Optimization
**Tasks**:
- Responsive design audit
- Touch-friendly controls
- Offline support for review workflow
- Progressive Web App (PWA) setup
- Mobile-optimized data entry

#### 5.4 Collaboration Features
**Features**:
- Real-time comments
- @mentions and notifications
- Shared review sessions
- Activity feed
- Team performance metrics

---

## Technical Specifications

### API Routes to Create

#### Scoring APIs
```
POST /api/salons/[id]/score
  - Trigger score calculation
  - Returns: Score object

POST /api/salons/[id]/score/adjust
  - Manual score adjustment
  - Requires: adjustment value, reason
  - Auth: reviewer+

GET /api/salons/[id]/score/history
  - Score history
  - Returns: Array of historical scores

POST /api/scoring/recalculate-all
  - Bulk recalculation
  - Auth: admin only
```

#### Review APIs
```
GET /api/review/queue
  - Get review queue
  - Params: status, assignee, priority
  - Returns: Paginated reviews

POST /api/review/[id]/assign
  - Assign review to user
  - Auth: reviewer+

POST /api/review/[id]/decide
  - Submit review decision
  - Requires: decision, rationale
  - Auth: reviewer+

POST /api/review/[id]/comments
  - Add comment
  - Auth: authenticated
```

#### Data Enrichment APIs
```
POST /api/enrichment/[salonId]/fetch
  - Trigger data fetch
  - Params: data_sources[]
  - Returns: Job ID

GET /api/enrichment/jobs/[jobId]
  - Check enrichment status
  - Returns: Progress, errors

POST /api/data-sources/[id]/test
  - Test data source connection
  - Auth: admin only
```

### Environment Variables to Add
```env
# External APIs
GOOGLE_PLACES_API_KEY=
YELP_API_KEY=
INSTAGRAM_CLIENT_ID=
INSTAGRAM_CLIENT_SECRET=

# AI Services (optional)
OPENAI_API_KEY=

# Job Queue (optional)
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# Monitoring (optional)
SENTRY_DSN=
POSTHOG_API_KEY=
```

### Database Indexes to Add
```sql
-- For performance optimization
CREATE INDEX idx_salon_signals_expires ON salon_signals(expires_at)
  WHERE expires_at IS NOT NULL;

CREATE INDEX idx_review_queue_priority_pending ON review_queue(priority DESC, added_to_queue_at)
  WHERE decision IS NULL;

CREATE INDEX idx_outreach_profiles_next_followup ON outreach_profiles(next_follow_up_date)
  WHERE next_follow_up_date IS NOT NULL;

-- For analytics
CREATE INDEX idx_salon_scores_computed_at ON salon_scores(computed_at);
CREATE INDEX idx_activity_logs_action ON activity_logs(action, created_at);
```

---

## Integration Points

### 1. Salon Detail Page Enhancement
**File**: `app/(dashboard)/salons/[id]/page.tsx`

**Current Tabs**:
- Overview
- Score (using `salon-score-card.tsx`)
- Locations (using `salon-locations-list.tsx`)
- Signals (using `salon-signals-list.tsx`)

**Add Tabs**:
- **Enrichment**: Trigger data fetching, view enrichment jobs
- **History**: Timeline of all changes
- **Review**: View review status and comments (if in review)
- **Outreach**: View outreach profile (if approved)

### 2. Dashboard KPIs
**File**: `app/(dashboard)/dashboard/page.tsx`

**Current Metrics** (working):
- Total Salons
- Average Score
- Approval Rate
- Pending Reviews

**Add Metrics**:
- Data Coverage % (salons with complete signals)
- Score Trends (week over week)
- Review Time (avg time to decision)
- Outreach Pipeline Value

### 3. Sidebar Navigation
**File**: `components/dashboard/sidebar.tsx`

**Current**: All routes present but some are placeholders

**Enhancements**:
- Add notification badges for pending items
- Add role-based visibility
- Add quick stats per section

### 4. Status Workflow
**File**: `components/salons/salon-status-actions.tsx`

**Current Flow**:
```
draft → enriching → scoring → review → approved/rejected/on_hold
```

**Enhancements**:
- Auto-transition from enriching to scoring when minimum signals met
- Auto-transition from scoring to review when score calculated
- Add confirmation modals for status changes
- Add validation rules per transition

---

## Risk Assessment

### Technical Risks

#### 1. **Supabase Connection Not Set Up**
**Risk Level**: HIGH
**Impact**: Application cannot function
**Mitigation**:
- Provide clear setup documentation
- Add health check endpoint
- Add fallback demo mode with mock data
- Validate environment variables on startup

#### 2. **External API Rate Limits**
**Risk Level**: MEDIUM
**Impact**: Data enrichment throttling
**Mitigation**:
- Implement rate limiting
- Add exponential backoff
- Queue system for batch processing
- Cache API responses
- Consider API proxy service

#### 3. **Score Calculation Performance**
**Risk Level**: MEDIUM
**Impact**: Slow page loads, timeouts
**Mitigation**:
- Move scoring to background jobs
- Add caching layer (Redis or Supabase Edge Functions)
- Optimize database queries
- Add loading states
- Consider pre-computation

#### 4. **Type Safety Issues**
**Risk Level**: LOW
**Impact**: Build errors, runtime bugs
**Mitigation**:
- Generate Supabase types automatically
- Remove @ts-ignore comments
- Add runtime validation with Zod
- Strict TypeScript configuration

### Business Risks

#### 1. **Incomplete Signal Data**
**Risk Level**: HIGH
**Impact**: Inaccurate scores
**Mitigation**:
- Implement minimum signal requirements
- Add confidence scoring
- Display data completeness metrics
- Allow manual overrides
- Show "incomplete data" warnings

#### 2. **Score Interpretation Confusion**
**Risk Level**: MEDIUM
**Impact**: Wrong prioritization
**Mitigation**:
- Add contextual help text
- Create scoring documentation
- Add reason explanations
- Provide score comparisons
- Train users on scoring methodology

#### 3. **Review Bottleneck**
**Risk Level**: MEDIUM
**Impact**: Slow pipeline throughput
**Mitigation**:
- Add bulk operations
- Implement smart assignment
- Add review SLAs
- Monitor queue metrics
- Consider automated pre-filtering

#### 4. **Data Source Changes**
**Risk Level**: MEDIUM
**Impact**: Integration breakage
**Mitigation**:
- Version API clients
- Add error monitoring
- Implement graceful degradation
- Regular integration tests
- Maintain fallback options

### Security Risks

#### 1. **API Key Exposure**
**Risk Level**: HIGH
**Impact**: Unauthorized access, cost overruns
**Mitigation**:
- Store keys in Supabase Vault or environment variables
- Implement API key rotation
- Monitor usage
- Add IP restrictions where possible
- Use separate keys per environment

#### 2. **Row Level Security (RLS) Gaps**
**Risk Level**: HIGH
**Impact**: Unauthorized data access
**Mitigation**:
- Complete RLS policy implementation
- Test policies thoroughly
- Audit policy effectiveness
- Add integration tests for auth
- Monitor unauthorized access attempts

#### 3. **Data Privacy Compliance**
**Risk Level**: MEDIUM
**Impact**: Legal issues, fines
**Mitigation**:
- Implement data retention policies
- Add audit logging
- Provide data export/deletion
- Document data handling
- Add consent management

---

## Dependencies to Add

### Production Dependencies
```json
{
  "inngest": "^3.x", // Background jobs (optional)
  "ai": "^3.x", // Vercel AI SDK for LLM features (optional)
  "openai": "^4.x", // OpenAI API client (optional)
  "pdf-lib": "^1.x", // PDF generation
  "papaparse": "^5.x", // CSV parsing/generation
  "recharts": "^2.x", // Charts and analytics
  "date-fns": "^4.x" // Already installed
}
```

### Development Dependencies
```json
{
  "vitest": "^2.x", // Testing
  "@testing-library/react": "^16.x",
  "@testing-library/jest-dom": "^6.x",
  "@playwright/test": "^1.x", // E2E testing
  "msw": "^2.x" // API mocking
}
```

---

## Testing Strategy

### Unit Tests
- Scoring engine calculations
- Signal normalization functions
- Weight calculation logic
- Reason generation

### Integration Tests
- Supabase queries
- Server actions
- API routes
- External API clients

### E2E Tests
- Complete scoring workflow
- Review approval flow
- Data enrichment process
- Outreach generation

### Performance Tests
- Bulk scoring operations
- Large dataset handling
- Concurrent user actions
- Database query optimization

---

## Deployment Considerations

### Environment Setup
1. **Development**: Local Supabase + local Next.js
2. **Staging**: Supabase staging project + Vercel preview
3. **Production**: Supabase production + Vercel production

### CI/CD Pipeline
```yaml
# Suggested GitHub Actions workflow
- Lint and type check
- Run unit tests
- Build Next.js app
- Run E2E tests
- Deploy to staging (on PR)
- Deploy to production (on main merge)
```

### Monitoring
- **Application**: Vercel Analytics, Sentry
- **Database**: Supabase Dashboard, Query performance
- **APIs**: External API usage tracking
- **Business**: Custom analytics dashboard

### Backups
- Supabase automatic daily backups
- Activity logs for audit trail
- Score history preservation
- Export critical data regularly

---

## Success Metrics

### Technical KPIs
- Page load time < 2s
- Score calculation time < 5s
- API uptime > 99.5%
- Test coverage > 80%
- Zero critical security vulnerabilities

### Business KPIs
- Time to score new salon < 15 minutes
- Review decision time < 24 hours
- Data completeness > 85%
- Score accuracy (manual validation) > 90%
- User satisfaction score > 4.0/5.0

---

## Timeline Estimate

### Phase 1: Scoring Engine (1-2 weeks)
- Week 1: Engine enhancements, signal input system
- Week 2: Scoring dashboard, testing

### Phase 2: Review Workflow (1-2 weeks)
- Week 1: Review queue UI, detail view
- Week 2: Review actions, testing

### Phase 3: Data Enrichment (2-3 weeks)
- Week 1: Integration setup, Google Places + Yelp
- Week 2: Additional integrations, bulk enrichment
- Week 3: Scheduler, testing

### Phase 4: Outreach Module (1-2 weeks)
- Week 1: Profile generation, dashboard
- Week 2: Export functionality, testing

### Phase 5: Advanced Features (2-3 weeks)
- Ongoing: Analytics, AI enhancements, optimizations

**Total Estimated Timeline**: 7-12 weeks for complete implementation

---

## Notes

- The database schema is production-ready and comprehensive
- Core scoring logic exists but needs enhancement
- UI components are built and styled professionally
- Auth system is in demo mode and needs production setup
- Most placeholder pages have clear data models to implement against
- The architecture supports incremental feature delivery
- Existing code quality is high with TypeScript strict mode

---

**End of Build Plan**
