import { Badge } from '@/components/ui/badge'

interface HeaderProps {
  user: any
}

export default function Header({ user }: HeaderProps) {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive'
      case 'reviewer':
        return 'default'
      case 'analyst':
        return 'secondary'
      case 'growth_lead':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Welcome back, {user?.full_name?.split(' ')[0] || 'User'}
        </h2>
        <Badge variant={getRoleBadgeColor(user?.role)}>
          {user?.role?.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>

      <div className="text-sm text-slate-600">
        {user?.email}
      </div>
    </header>
  )
}