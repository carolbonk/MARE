# MaRe OS - Setup Instructions

## Quick Start

### 1. Set up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Once created, go to Settings > API and copy:
   - Project URL
   - anon/public key
   - service_role key (keep this secret!)

### 2. Configure Environment Variables

Edit `.env.local` and add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 3. Set up Database

1. Go to Supabase Dashboard > SQL Editor
2. Copy the entire contents of `supabase/schema.sql`
3. Paste and run the SQL to create all tables and functions

### 4. Run the Application

```bash
# Install dependencies (if not already done)
npm install

# Run development server
npm run dev
```

Open http://localhost:3000

### 5. Create Your First User

1. Navigate to http://localhost:3000/signup
2. Create an account with your email
3. You'll be automatically logged in

### 6. Set Admin Role (First User)

Run this SQL in Supabase SQL Editor after creating your first user:

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

## Project Structure

- `/app` - Next.js app router pages
  - `/(auth)` - Authentication pages (login/signup)
  - `/(dashboard)` - Main application pages
- `/components` - React components
  - `/ui` - shadcn/ui components
  - `/dashboard` - Dashboard-specific components
- `/lib` - Utilities and configurations
  - `/supabase` - Supabase client setup
  - `/types` - TypeScript type definitions
  - `/utils` - Helper functions
- `/supabase` - Database schema and migrations

## Features Implemented

✅ Authentication (login/signup)
✅ Role-based access control
✅ Dashboard with KPIs
✅ Database schema for all entities
✅ Responsive premium UI

## Next Steps

The following features are ready to be implemented:
- Salon management (CRUD operations)
- Data enrichment system
- Scoring engine
- Review workflow
- Outreach profiles

## Development Status

Current Phase: **Phase 2 Complete**
- Project setup ✅
- Authentication ✅
- Dashboard UI ✅
- Database schema ✅

Next: Salon management features