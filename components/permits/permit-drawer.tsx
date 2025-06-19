'use client'

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Permit } from '@/types'
import { format } from 'date-fns'

const miniMapStyle = {
  width: '100%',
  height: '200px'
}

interface PermitDrawerProps {
  permit: Permit | null
  open: boolean
  onClose: () => void
}

export function PermitDrawer({ permit, open, onClose }: PermitDrawerProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!permit) return null

  const center = permit.latitude && permit.longitude 
    ? { lat: permit.latitude, lng: permit.longitude }
    : { lat: 39.8283, lng: -98.5795 }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Permit Details</SheetTitle>
          <SheetDescription>
            Issued on {format(new Date(permit.issuedate), 'MMMM dd, yyyy')}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Permit Code</label>
                  <div className="mt-1">
                    <Badge variant="outline">{permit.code}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Value</label>
                  <div className="mt-1 text-lg font-semibold">
                    {permit.value ? `$${permit.value.toLocaleString()}` : 'N/A'}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                <div className="mt-1 text-sm">{permit.address}</div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section - Blank for now */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500 italic">
                Contact information will be available in a future update.
              </div>
            </CardContent>
          </Card>

          {/* Mini Map */}
          {apiKey && permit.latitude && permit.longitude && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg overflow-hidden border">
                  <LoadScript googleMapsApiKey={apiKey}>
                    <GoogleMap
                      mapContainerStyle={miniMapStyle}
                      center={center}
                      zoom={15}
                      options={{
                        disableDefaultUI: true,
                        zoomControl: true,
                      }}
                    >
                      <Marker
                        position={center}
                        icon={{
                          url: 'data:image/svg+xml;base64,' + btoa(`
                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="15" cy="15" r="12" fill="#C8102E" stroke="white" stroke-width="3"/>
                            </svg>
                          `),
                          scaledSize: new window.google.maps.Size(30, 30),
                        }}
                      />
                    </GoogleMap>
                  </LoadScript>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Raw Data */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Raw Permit Data</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto">
                {JSON.stringify(permit, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  )
}
