'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { getPermits } from '@/lib/supabase'
import { MapPanel } from '@/components/permits/map-panel'
import { FilterRibbon } from '@/components/permits/filter-ribbon'
import { NavigationTabs } from '@/components/permits/navigation-tabs'
import { Permit } from '@/types'

export default function PermitsMapPage() {
  const [permits, setPermits] = useState<Permit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  // Extract filter parameters for API call
  const filters = {
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    codes: searchParams.get('codes') || '',
    keyword: searchParams.get('keyword') || '',
    minValue: searchParams.get('minValue') || '',
    maxValue: searchParams.get('maxValue') || '',
    radius: searchParams.get('radius') || '25',
    status: searchParams.get('status') || ''
  }

  // Convert to object for FilterRibbon compatibility
  const searchParamsObj = {
    startDate: searchParams.get('startDate'),
    endDate: searchParams.get('endDate'),
    codes: searchParams.get('codes'),
    keyword: searchParams.get('keyword'),
    minValue: searchParams.get('minValue'),
    maxValue: searchParams.get('maxValue'),
    radius: searchParams.get('radius'),
    status: searchParams.get('status')
  }

  const fetchPermits = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getPermits(filters)
      setPermits(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch permits')
      console.error('Error fetching permits:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPermits()
  }, [searchParams])

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-destructive mb-2">Error Loading Permits</h2>
          <p className="text-sm text-destructive/80">{error}</p>
          <button 
            onClick={fetchPermits}
            className="mt-2 px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Navigation Tabs */}
      <NavigationTabs />
      
      {/* Filter Ribbon */}
      <div className="flex-shrink-0 border-b border-border bg-background">
        <FilterRibbon searchParams={searchParamsObj} />
      </div>

      {/* Map Panel - Full Height */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading permits...</p>
            </div>
          </div>
        ) : (
          <MapPanel 
            permits={permits} 
            radius={parseInt(filters.radius)} 
          />
        )}
      </div>
    </div>
  )
}