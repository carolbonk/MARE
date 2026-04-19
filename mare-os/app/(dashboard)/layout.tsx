import { ReactNode } from 'react'
import Sidebar from '@/components/dashboard/sidebar'
import Header from '@/components/dashboard/header'

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  // DEMO MODE: Use mock user data instead of Supabase
  const mockProfile = {
    id: 'demo-user',
    email: 'demo@mareos.com',
    full_name: 'Demo User',
    role: 'admin' as const,
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar userRole={mockProfile.role} />
      <div className="pl-64">
        <Header user={mockProfile} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}