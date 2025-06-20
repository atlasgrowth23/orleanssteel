'use client'

import { useState } from 'react'
import { GoogleMap, useLoadScript, Marker, Circle } from '@react-google-maps/api'
import { Map, ChevronLeft, ChevronRight } from 'lucide-react'
import { ORLEANS_STEEL_LOCATION } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Permit } from '@/types'

const mapContainerStyle = {
  width: '100%',
  height: '100%'
}

const defaultCenter = {
  lat: ORLEANS_STEEL_LOCATION.lat,
  lng: ORLEANS_STEEL_LOCATION.lng
}

interface MapPanelProps {
  permits: Permit[]
  radius?: number
}

export function MapPanel({ permits, radius = 25 }: MapPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || '',
    libraries: ['places']
  })

  if (!apiKey) {
    return (
      <div className="h-full bg-card border-t border-border flex items-center justify-center relative">
        <div className="text-center p-4">
          <Map className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Google Maps API key not configured
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Map view will appear here when API key is added
          </p>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="h-full bg-card border-t border-border flex items-center justify-center relative">
        <div className="text-center p-4">
          <Map className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Error loading maps
          </p>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="h-full bg-card border-t border-border flex items-center justify-center relative">
        <div className="text-center p-4">
          <Map className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Loading maps...
          </p>
        </div>
      </div>
    )
  }

  // Filter permits that have valid coordinates
  const mappablePermits = permits.filter(permit => 
    permit.latitude && permit.longitude
  )

  return (
    <div className="h-full bg-card relative">
      <div className="h-full">
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Map className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Lead Map</h3>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {mappablePermits.length} construction leads within {radius} miles
          </p>
          <p className="text-xs text-muted-foreground">
            📍 Centered on Orleans Steel - {ORLEANS_STEEL_LOCATION.address}
          </p>
        </div>
        
        <div className="h-[calc(100%-80px)]">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={defaultCenter}
            zoom={11}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            {/* Orleans Steel location marker */}
            <Marker
              position={defaultCenter}
              title="Orleans Steel - Your Business Location"
              icon={{
                url: 'data:image/svg+xml;base64,' + btoa(`
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="14" fill="#ef4444" stroke="white" stroke-width="4"/>
                    <circle cx="16" cy="16" r="6" fill="white"/>
                  </svg>
                `)
              }}
            />
            
            {/* Radius circle */}
            <Circle
              center={defaultCenter}
              radius={radius * 1609.34} // Convert miles to meters
              options={{
                fillColor: '#ef4444',
                fillOpacity: 0.1,
                strokeColor: '#ef4444',
                strokeOpacity: 0.3,
                strokeWeight: 2,
              }}
            />
            
            {/* Permit/lead markers */}
            {mappablePermits.map((permit, index) => (
              <Marker
                key={permit.id || index}
                position={{
                  lat: permit.latitude!,
                  lng: permit.longitude!
                }}
                title={`${permit.address} - ${permit.type || permit.code}
Value: $${permit.value?.toLocaleString() || 'N/A'}
Distance: ${permit.distance || 'N/A'} miles
Applicant: ${permit.applicant || 'N/A'}`}
                icon={{
                  url: 'data:image/svg+xml;base64,' + btoa(`
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" fill="${
                        permit.steelCategory === 'Fencing & Gates' ? '#22c55e' :
                        permit.steelCategory === 'Metal Roofing' ? '#3b82f6' :
                        permit.steelCategory === 'Structural Steel' ? '#ef4444' :
                        permit.steelCategory === 'General Construction' ? '#f59e0b' :
                        permit.steelCategory === 'Opportunity' ? '#6b7280' : '#6b7280'
                      }" stroke="white" stroke-width="2"/>
                      ${permit.isSteelRelevant ? '<circle cx="12" cy="12" r="4" fill="white"/>' : ''}
                    </svg>
                  `)
                }}
              />
            ))}
          </GoogleMap>
        </div>
      </div>
    </div>
  )
}
