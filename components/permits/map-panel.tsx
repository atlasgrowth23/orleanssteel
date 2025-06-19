'use client'

import { useState } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { Map, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Permit } from '@/types'

const mapContainerStyle = {
  width: '100%',
  height: '100%'
}

const defaultCenter = {
  lat: 39.8283,
  lng: -98.5795
}

interface MapPanelProps {
  permits: Permit[]
}

export function MapPanel({ permits }: MapPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return (
      <div className={`bg-white border-l border-gray-200 transition-all duration-300 ${
        isCollapsed ? 'w-12' : 'w-96'
      }`}>
        <div className="h-full flex items-center justify-center">
          <div className="text-center p-4">
            <Map className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              Google Maps API key not configured
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-4 left-4"
        >
          {isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
    )
  }

  // Filter permits that have valid coordinates
  const mappablePermits = permits.filter(permit => 
    permit.latitude && permit.longitude
  )

  return (
    <div className={`bg-white border-l border-gray-200 transition-all duration-300 relative ${
      isCollapsed ? 'w-12' : 'w-96'
    }`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-4 left-4 z-10 bg-white shadow-sm"
      >
        {isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>

      {!isCollapsed && (
        <div className="h-full">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Map className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-gray-900">Map View</h3>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {mappablePermits.length} permits with locations
            </p>
          </div>
          
          <div className="h-[calc(100%-80px)]">
            <LoadScript googleMapsApiKey={apiKey}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={defaultCenter}
                zoom={4}
                options={{
                  disableDefaultUI: true,
                  zoomControl: true,
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                }}
              >
                {mappablePermits.map((permit, index) => (
                  <Marker
                    key={permit.id || index}
                    position={{
                      lat: permit.latitude!,
                      lng: permit.longitude!
                    }}
                    title={permit.address}
                    icon={{
                      url: 'data:image/svg+xml;base64,' + btoa(`
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="10" cy="10" r="8" fill="#C8102E" stroke="white" stroke-width="2"/>
                        </svg>
                      `),
                      scaledSize: new window.google.maps.Size(20, 20),
                    }}
                  />
                ))}
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      )}
    </div>
  )
}
