'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Eye, Edit, Trash2, MoreVertical, MapPin, Star, Globe } from 'lucide-react'
import { formatScore, formatDate } from '@/lib/utils/format'

interface SalonTableProps {
  salons: any[]
  currentPage: number
  totalPages: number
}

export default function SalonTable({ salons, currentPage, totalPages }: SalonTableProps) {
  const router = useRouter()

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; label: string }> = {
      draft: { variant: 'secondary', label: 'Draft' },
      enriching: { variant: 'outline', label: 'Enriching' },
      scoring: { variant: 'default', label: 'Scoring' },
      review: { variant: 'default', label: 'In Review' },
      approved: { variant: 'default', label: 'Approved' },
      rejected: { variant: 'destructive', label: 'Rejected' },
      on_hold: { variant: 'secondary', label: 'On Hold' },
    }

    const config = statusConfig[status] || statusConfig.draft
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search)
    params.set('page', page.toString())
    router.push(`/salons?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Salon</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Added</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salons.map((salon) => (
              <TableRow key={salon.id} className="hover:bg-slate-50">
                <TableCell>
                  <Link
                    href={`/salons/${salon.id}`}
                    className="hover:underline"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{salon.name}</p>
                      {salon.brand_name && (
                        <p className="text-sm text-slate-600">{salon.brand_name}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1">
                        {salon.website && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Globe className="h-3 w-3" />
                            <span>Website</span>
                          </div>
                        )}
                        {salon.email && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <span>Email</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  {salon.salon_locations?.[0] && (
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <MapPin className="h-3 w-3" />
                      <span>
                        {salon.salon_locations[0].city}, {salon.salon_locations[0].state_province}
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {getStatusBadge(salon.status)}
                </TableCell>
                <TableCell>
                  {salon.salon_scores?.[0] ? (
                    <div className="flex items-center gap-1">
                      <Star className={`h-4 w-4 ${getScoreColor(salon.salon_scores[0].total_score)}`} />
                      <span className={`font-semibold ${getScoreColor(salon.salon_scores[0].total_score)}`}>
                        {formatScore(salon.salon_scores[0].total_score)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">Not scored</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-slate-600">
                    {formatDate(salon.created_at)}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded">
                      <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/salons/${salon.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/salons/${salon.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 hover:text-red-700"
                        onClick={() => {
                          // TODO: Add delete confirmation
                          console.log('Delete salon:', salon.id)
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}