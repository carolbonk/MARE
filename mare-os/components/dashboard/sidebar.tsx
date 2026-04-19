'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Building2,
  Database,
  TrendingUp,
  CheckSquare,
  Send,
  Settings,
  FileBarChart,
} from 'lucide-react'

interface SidebarProps {
  userRole: string
}

const menuItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'reviewer', 'analyst', 'growth_lead', 'viewer'],
  },
  {
    name: 'Salons',
    href: '/salons',
    icon: Building2,
    roles: ['admin', 'reviewer', 'analyst', 'growth_lead', 'viewer'],
  },
  {
    name: 'Data Sources',
    href: '/data-sources',
    icon: Database,
    roles: ['admin', 'analyst'],
  },
  {
    name: 'Scoring',
    href: '/scoring',
    icon: TrendingUp,
    roles: ['admin', 'reviewer', 'analyst'],
  },
  {
    name: 'Review Queue',
    href: '/review',
    icon: CheckSquare,
    roles: ['admin', 'reviewer'],
  },
  {
    name: 'Outreach',
    href: '/outreach',
    icon: Send,
    roles: ['admin', 'growth_lead'],
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: FileBarChart,
    roles: ['admin', 'reviewer', 'growth_lead'],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['admin'],
  },
]

export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()

  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(userRole)
  )

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-900">MaRe OS</h1>
        <p className="text-sm text-slate-600 mt-1">Luxury Fit Score</p>
      </div>

      <nav className="px-4 pb-6">
        <ul className="space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}