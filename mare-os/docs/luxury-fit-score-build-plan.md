# Luxury Fit Score - Hackathon Build Plan
**MaRe OS - ONE DAY Implementation**
**Date:** April 19, 2026

---

## Current State (What's Already Done)

### ✅ Complete
- Database schema with all tables
- Scoring engine with weights (25%, 20%, 15%, 15%, 10%, 10%, 5%)
- Salon CRUD operations
- UI components (forms, tables, cards)
- Score visualization component
- Basic dashboard

### ⚠️ Incomplete
- Supabase not connected (using demo mode)
- Scoring engine not wired to UI
- No test data
- Signal input is basic
- Review workflow is placeholder

---

## TODAY'S GOAL
**Build a working demo**: Create salon → Add signals → Calculate score → See results

---

## Hackathon Sprint Plan (8 hours)

### Hour 1-2: Setup & Data (CRITICAL)
**Goal**: Get database running with test data

1. **Supabase Quick Setup** (30 min)
   - Create Supabase project at supabase.com
   - Run `supabase/schema.sql` in SQL editor
   - Copy URL + keys to `.env.local`
   - Test connection

2. **Seed Script** (30 min)
   ```bash
   npm run seed
   ```
   - Create `scripts/seed-demo-data.ts`
   - Add 5 sample salons
   - Add 50+ signals across categories
   - Add 2 pre-calculated scores

3. **Fix Auth** (30 min)
   - Keep demo mode ON (skip auth for speed)
   - Remove auth checks temporarily
   - Focus on functionality only

4. **Test Everything Loads** (30 min)
   - Salons list shows data
   - Dashboard KPIs populate
   - No console errors

---

### Hour 3-4: Scoring Integration
**Goal**: Wire up score calculation button

1. **Add "Calculate Score" Button** (30 min)
   - In salon detail page
   - Call `calculateSalonScore()` action
   - Show loading state
   - Handle errors

2. **Improve Scoring Engine** (45 min)
   - Add null checks for missing signals
   - Set minimum signal requirement (5 signals)
   - Better error messages
   - Add default scores for empty categories

3. **Fix Score Display** (15 min)
   - Ensure `salon-score-card.tsx` gets data
   - Show "No score yet" state
   - Add "Recalculate" option

4. **Test Flow** (30 min)
   - Create new salon
   - Add 10 signals
   - Calculate score
   - Verify breakdown shows correctly

---

### Hour 5-6: Signal Input UX
**Goal**: Make adding signals fast and easy

1. **Bulk Signal Form** (60 min)
   - Create `components/salons/quick-signal-form.tsx`
   - One form with all common signals
   - Pre-filled dropdowns for common values
   - Submit all at once

2. **Signal Templates** (30 min)
   - "Luxury Salon" preset (high-end defaults)
   - "Standard Salon" preset (mid-tier defaults)
   - "Wellness Focused" preset
   - One-click apply

3. **Signal Validation** (30 min)
   - Required fields per category
   - Min 2 signals per category
   - Visual indicators for completeness

---

### Hour 7: Demo Polish
**Goal**: Make it look impressive

1. **Dashboard Improvements** (20 min)
   - Add score distribution chart
   - Show top-scored salons
   - Add "Recent Activity" feed

2. **Visual Polish** (20 min)
   - Add loading skeletons
   - Smooth transitions
   - Success toasts
   - Error states

3. **Scoring Page** (20 min)
   - Convert placeholder to working page
   - Show scoring weights
   - Add "Score All" button
   - Show results table

---

### Hour 8: Demo Prep
**Goal**: Prepare presentation

1. **Demo Data** (15 min)
   - 10 salons with variety of scores
   - Mix of complete/incomplete data
   - Some with calculated scores

2. **Demo Script** (15 min)
   - Create new salon flow
   - Show quick-add signals
   - Calculate score
   - Review breakdown
   - Show dashboard

3. **Cleanup** (15 min)
   - Remove console.logs
   - Fix any TypeScript errors
   - Quick smoke test
   - Deploy to Vercel

4. **Buffer** (15 min)
   - Fix any last-minute bugs

---

## What We're SKIPPING for Speed

### Skip Entirely
- ❌ Real authentication (use demo mode)
- ❌ Review workflow
- ❌ External API integrations (Google Places, Yelp)
- ❌ Outreach profiles
- ❌ Data source management
- ❌ Role-based permissions
- ❌ Activity logs
- ❌ Advanced analytics
- ❌ Tests
- ❌ Error monitoring

### Simplify
- ✂️ Manual signal entry only (no automation)
- ✂️ Basic validation (not comprehensive)
- ✂️ Hardcoded scoring weights (no UI config)
- ✂️ Simple success/error messages (no detailed feedback)
- ✂️ Desktop-only (skip mobile optimization)

---

## Critical Files to Modify

### 1. Create Seed Script
**File**: `scripts/seed-demo-data.ts`
```typescript
// Create 10 salons with signals
// 5 with pre-calculated scores
// Variety of score ranges (40-95)
```

### 2. Enhance Scoring Engine
**File**: `services/scoring/engine.ts`
- Add minimum signal validation
- Better error handling
- Default values for missing categories

### 3. New Component: Quick Signal Entry
**File**: `components/salons/quick-signal-form.tsx`
- All signal types in one form
- Preset templates
- Bulk submit

### 4. Update Salon Detail Page
**File**: `app/(dashboard)/salons/[id]/page.tsx`
- Add "Calculate Score" CTA
- Show signal completeness
- Better empty states

### 5. Fix Scoring Page
**File**: `app/(dashboard)/scoring/page.tsx`
- Show current weights
- Add batch scoring
- Results table

### 6. Enhance Dashboard
**File**: `app/(dashboard)/dashboard/page.tsx`
- Score distribution chart
- Top salons list
- Better KPI cards

---

## Simplified Data Model

### Just Focus On
1. **Salons** - Basic info only
2. **Signals** - 3-5 signals per category minimum
3. **Scores** - Current score only (skip history)

### Signal Priority List (20 signals total)
Pick the easiest to input manually:

**Luxury Aesthetic** (5):
- price_range_high: number (50-500)
- interior_quality: dropdown (luxury/upscale/modern/standard)
- luxury_neighborhood: boolean
- brand_partnerships: number (0-10)
- press_mentions: number (0-20)

**Revenue Likelihood** (4):
- avg_transaction_value: number (50-300)
- review_count: number (10-1000)
- review_rating: number (1-5)
- client_retention_rate: number (0-100)

**Retail Readiness** (3):
- has_retail_space: boolean
- current_retail_brands: number (0-15)
- retail_sales_percentage: number (0-50)

**Wellness Alignment** (3):
- has_scalp_treatment: boolean
- wellness_menu_items: number (0-10)
- organic_focus: boolean

**Growth Potential** (2):
- location_count: number (1-20)
- years_in_business: number (1-30)

**Digital Presence** (2):
- website_quality: dropdown (excellent/good/average/poor)
- social_media_followers: number (0-50000)

**Partnership Fit** (1):
- brand_alignment: number (0-100)

---

## Demo Flow

### The 5-Minute Demo

1. **Dashboard** (30 sec)
   - "Here's our luxury salon scoring dashboard"
   - Show KPIs, recent salons

2. **Browse Salons** (30 sec)
   - "We have 10 salons in the system"
   - Filter by score range
   - Click on a high-scoring salon

3. **Show Score Breakdown** (60 sec)
   - "This is Élite Hair Studio - scored 87/100"
   - Walk through 7 category scores
   - Show scoring reasons
   - Explain weights

4. **Create New Salon** (90 sec)
   - "Let's add a new salon"
   - Quick form fill
   - Use signal template "Luxury Salon"
   - Calculate score
   - "Scored 78 - good fit!"

5. **Scoring Dashboard** (60 sec)
   - "We can score multiple salons at once"
   - Show weight configuration
   - Explain methodology
   - Show how scores inform outreach

6. **Wrap Up** (30 sec)
   - "This helps us identify best-fit luxury salons"
   - "Replaces manual evaluation"
   - "Next: integrate APIs for automation"

---

## Success Criteria

### Must Have
- ✅ 10 salons with data visible
- ✅ Can calculate a score end-to-end
- ✅ Score visualization works
- ✅ Can add signals via form
- ✅ Dashboard shows real data
- ✅ No critical errors
- ✅ Deployed and shareable URL

### Nice to Have
- 📊 Score distribution chart
- ⚡ Signal templates working
- 🎨 Smooth animations
- 📱 Mobile not breaking (but not optimized)

### Don't Worry About
- ❌ Perfect data validation
- ❌ Error recovery
- ❌ Edge cases
- ❌ Performance optimization
- ❌ Code quality
- ❌ Tests

---

## Assumptions (Hackathon Edition)

1. **Using mock/seed data** - Real API integrations later
2. **Auth disabled** - Focus on core functionality
3. **Desktop browser only** - Chrome, good internet
4. **Manual data entry** - No imports/exports needed
5. **Single user** - No collaboration features
6. **Happy path only** - Minimal error handling
7. **Hardcoded business logic** - No admin configuration
8. **SQLite or Supabase** - Whatever works fastest

---

## Blockers (Must Fix First)

### Before Hour 1
1. ❗ Supabase project created
2. ❗ Schema deployed
3. ❗ Environment variables set
4. ❗ `npm install` completed
5. ❗ Dev server running

### Quick Blocker Solutions
- **Can't connect to Supabase?** → Use SQLite with Prisma instead
- **Schema won't run?** → Copy-paste table by table
- **Scoring engine errors?** → Add try-catch, return dummy score
- **Type errors?** → Add `@ts-ignore`, fix later
- **Build fails?** → Comment out broken imports, ship what works

---

## Recommended First Coding Phase (Next 2 Hours)

### Right Now (30 min)
1. Verify Supabase connection
2. Run schema
3. Create seed script skeleton
4. Add 1 test salon manually in Supabase UI

### Next (30 min)
5. Write seed script with 5 salons
6. Add signals programmatically
7. Run seed script
8. Verify data shows in UI

### Then (30 min)
9. Add "Calculate Score" button
10. Test scoring flow
11. Fix any errors

### Finally (30 min)
12. Add quick signal form
13. Test creating + scoring new salon
14. Fix score display

**After these 2 hours, you should have a working demo flow.**

---

## Final Hour Checklist

- [ ] 10 salons in database
- [ ] All salons have 10+ signals
- [ ] 5+ salons have calculated scores
- [ ] Can create new salon via UI
- [ ] Can add signals via form
- [ ] Calculate score button works
- [ ] Score breakdown displays
- [ ] Dashboard KPIs accurate
- [ ] No console errors
- [ ] Deployed to Vercel
- [ ] Demo URL works
- [ ] Screenshots taken
- [ ] Demo script practiced

---

## Quick Deploy

```bash
# Push to GitHub
git add .
git commit -m "Hackathon demo ready"
git push

# Deploy to Vercel (2 minutes)
# Connect repo at vercel.com
# Add environment variables
# Deploy

# Share URL
https://mare-os-yourname.vercel.app
```

---

**Remember**:
- **Shipped > Perfect**
- **Working demo > Complete features**
- **Show value > Show code**
- **Manual is fine > Automated**

**GO BUILD!** 🚀
