'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { updateSalonStatus } from '@/lib/actions/salons'
import { ChevronDown, Database, TrendingUp, CheckSquare, Send, XCircle, PauseCircle } from 'lucide-react'

interface SalonStatusActionsProps {
  salon: any
}

export default function SalonStatusActions({ salon }: SalonStatusActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      const result = await updateSalonStatus(salon.id, newStatus)
      if (result.data) {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getNextActions = () => {
    switch (salon.status) {
      case 'draft':
        return [
          { label: 'Start Enrichment', value: 'enriching', icon: Database },
        ]
      case 'enriching':
        return [
          { label: 'Calculate Score', value: 'scoring', icon: TrendingUp },
          { label: 'Back to Draft', value: 'draft', icon: null },
        ]
      case 'scoring':
        return [
          { label: 'Send to Review', value: 'review', icon: CheckSquare },
          { label: 'Back to Enrichment', value: 'enriching', icon: Database },
        ]
      case 'review':
        return [
          { label: 'Approve', value: 'approved', icon: CheckSquare },
          { label: 'Reject', value: 'rejected', icon: XCircle },
          { label: 'Put On Hold', value: 'on_hold', icon: PauseCircle },
        ]
      case 'approved':
        return [
          { label: 'Create Outreach', value: 'outreach', icon: Send },
          { label: 'Back to Review', value: 'review', icon: CheckSquare },
        ]
      case 'rejected':
        return [
          { label: 'Reopen for Review', value: 'review', icon: CheckSquare },
        ]
      case 'on_hold':
        return [
          { label: 'Resume Review', value: 'review', icon: CheckSquare },
        ]
      default:
        return []
    }
  }

  const nextActions = getNextActions()

  if (nextActions.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={isUpdating}>
          Change Status
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {nextActions.map((action) => {
          const Icon = action.icon
          return (
            <DropdownMenuItem
              key={action.value}
              onClick={() => handleStatusChange(action.value)}
            >
              {Icon && <Icon className="mr-2 h-4 w-4" />}
              {action.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}