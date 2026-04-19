# MaRe OS - Luxury Fit Score Module Implementation Plan

## Project Overview
Building a premium internal SaaS tool for MaRe, a luxury scalp-health brand, to evaluate and onboard high-end salons as partners. This is module 1 of 3 planned modules.

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Forms**: React Hook Form + Zod
- **Tables**: TanStack Table
- **Deployment**: Vercel (Hobby) + Supabase (Free tier)

### Database Schema

#### Core Tables
1. **profiles** - User management
2. **user_roles** - Role-based access control
3. **salons** - Main salon entities
4. **salon_locations** - Multi-location support
5. **data_sources** - External data integrations
6. **salon_signals** - Raw enrichment data
7. **salon_scores** - Computed fit scores
8. **salon_score_reasons** - Score explanations
9. **outreach_profiles** - Approved salon talking points
10. **review_queue** - Approval workflow

## Implementation Phases

### Phase 1: Project Setup & Infrastructure (Day 1)
1. Initialize Next.js project with TypeScript
2. Configure Tailwind CSS and shadcn/ui
3. Set up Supabase project
4. Create database schema and migrations
5. Configure environment variables
6. Set up basic folder structure

**Deliverables:**
- Working Next.js app
- Connected Supabase instance
- Database schema deployed
- Basic project structure

### Phase 2: Authentication & Authorization (Day 2)
1. Implement Supabase Auth
2. Create login/signup pages
3. Set up protected routes
4. Implement role-based middleware
5. Create user profile management

**Deliverables:**
- /login page with premium design
- Session management
- Role-based route protection
- User profile system

### Phase 3: Core Data Models & APIs (Day 3)
1. Generate TypeScript types from database
2. Create data access layers (DAL)
3. Implement server actions for CRUD operations
4. Set up API route handlers
5. Create reusable data hooks

**Deliverables:**
- Type-safe database queries
- Server actions for all entities
- API endpoints
- Custom React hooks

### Phase 4: Dashboard & Analytics (Day 4)
1. Build dashboard layout
2. Create KPI components
3. Implement pipeline analytics
4. Add recent activity feed
5. Create data visualizations

**Deliverables:**
- /dashboard with KPI cards
- Pipeline status charts
- Activity timeline
- Average score metrics

### Phase 5: Salon Management (Day 5-6)
1. Create salon listing page
2. Implement search and filters
3. Build salon detail views
4. Add salon creation/import
5. Implement location management

**Deliverables:**
- /salons listing with TanStack Table
- Advanced filtering
- /salons/[id] detail page
- /salons/new creation form
- Bulk import capability

### Phase 6: Data Enrichment System (Day 7)
1. Create data source management
2. Build signal ingestion forms
3. Implement manual signal entry
4. Create bulk enrichment UI
5. Add data source integrations

**Deliverables:**
- /data-sources management
- Signal entry interface
- Bulk enrichment tools
- Integration status monitoring

### Phase 7: Scoring Engine (Day 8-9)
1. Implement weighted scoring algorithm
2. Create sub-score calculations
3. Build score reason generator
4. Add manual adjustment capability
5. Create score history tracking

**Scoring Weights:**
- Luxury/aesthetic: 25%
- Revenue likelihood: 20%
- Retail readiness: 15%
- Wellness alignment: 15%
- Growth potential: 10%
- Digital presence: 10%
- Partnership fit: 5%

**Deliverables:**
- Scoring service
- Real-time score calculation
- Score breakdown UI
- Historical score tracking

### Phase 8: Review & Approval Workflow (Day 10)
1. Build review queue interface
2. Create approval/rejection flow
3. Add reviewer comments
4. Implement status transitions
5. Add notification system

**Deliverables:**
- /review queue page
- Approval workflow
- Comment system
- Status management
- Activity notifications

### Phase 9: Outreach Profiles (Day 11)
1. Generate talking points
2. Create outreach templates
3. Build export functionality
4. Add CRM integration prep
5. Create handoff checklist

**Deliverables:**
- Outreach profile generator
- Export to various formats
- Integration-ready data
- Handoff documentation

### Phase 10: Polish & Testing (Day 12)
1. UI/UX refinements
2. Performance optimization
3. Error handling
4. Testing suite
5. Documentation

**Deliverables:**
- Polished UI
- Optimized performance
- Comprehensive error handling
- Test coverage
- User documentation

## Project Structure

```
mare-os/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── salons/
│   │   ├── data-sources/
│   │   ├── review/
│   │   └── settings/
│   ├── api/
│   │   ├── salons/
│   │   ├── scores/
│   │   └── enrichment/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/           # shadcn components
│   ├── dashboard/
│   ├── salons/
│   ├── scoring/
│   └── shared/
├── lib/
│   ├── supabase/
│   ├── actions/
│   ├── hooks/
│   ├── utils/
│   └── types/
├── services/
│   ├── scoring/
│   ├── enrichment/
│   └── outreach/
├── migrations/
└── public/
```

## Key Design Decisions

### 1. Server Components First
- Use Server Components by default
- Client Components only for interactivity
- Server Actions for mutations

### 2. Type Safety
- Strict TypeScript configuration
- Generated types from database
- Zod schemas for all forms

### 3. Premium Design System
- Consistent spacing and typography
- Subtle animations and transitions
- Professional color palette
- Clean, minimal interface

### 4. Performance Optimization
- Streaming SSR where applicable
- Optimistic updates
- Proper caching strategies
- Lazy loading for heavy components

### 5. Security
- Row-level security in Supabase
- Input validation at all layers
- CSRF protection
- Rate limiting on API routes

## Success Criteria

1. **Functional Requirements**
   - All user stories implemented
   - Scoring algorithm working correctly
   - Review workflow operational
   - Data enrichment functional

2. **Non-Functional Requirements**
   - Page loads under 2 seconds
   - Mobile responsive
   - Accessible (WCAG 2.1 AA)
   - Deployable on free tiers

3. **Code Quality**
   - TypeScript strict mode
   - 80%+ test coverage
   - ESLint/Prettier configured
   - Documented API endpoints

## Risk Mitigation

1. **Supabase Free Tier Limits**
   - Monitor usage closely
   - Implement efficient queries
   - Use connection pooling

2. **Complex Scoring Logic**
   - Start with simple rules
   - Add complexity incrementally
   - Maintain score audit trail

3. **Data Quality**
   - Validation at entry points
   - Data cleaning utilities
   - Manual review capabilities

## Next Steps

1. Review and approve this plan
2. Set up development environment
3. Begin Phase 1 implementation
4. Daily progress updates
5. Weekly demos

---

**Ready to proceed?** Please review this plan and let me know if you'd like any adjustments before we begin implementation.