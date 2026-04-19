'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react'

interface SalonLocationsListProps {
  salonId: string
  locations: any[]
}

export default function SalonLocationsList({ salonId, locations }: SalonLocationsListProps) {
  const [showAddForm, setShowAddForm] = useState(false)

  if (locations.length === 0 && !showAddForm) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No Locations Added</h3>
          <p className="text-slate-600 mb-4">
            Add location information for this salon
          </p>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Location
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Locations</CardTitle>
              <CardDescription>
                {locations.length} location{locations.length !== 1 ? 's' : ''} on file
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {locations.map((location) => (
              <div
                key={location.id}
                className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      {location.is_primary && (
                        <Badge variant="default" className="text-xs">
                          Primary
                        </Badge>
                      )}
                      {location.location_type && (
                        <Badge variant="outline" className="text-xs">
                          {location.location_type}
                        </Badge>
                      )}
                    </div>
                    <p className="font-medium text-slate-900">
                      {location.address_line1}
                    </p>
                    {location.address_line2 && (
                      <p className="text-slate-900">{location.address_line2}</p>
                    )}
                    <p className="text-slate-900">
                      {location.city}, {location.state_province} {location.postal_code}
                    </p>
                    {location.neighborhood && (
                      <p className="text-sm text-slate-600 mt-1">
                        Neighborhood: {location.neighborhood}
                      </p>
                    )}
                    {location.square_footage && (
                      <p className="text-sm text-slate-600">
                        Size: {location.square_footage.toLocaleString()} sq ft
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Location</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">Location form will be implemented here</p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button>Save Location</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}