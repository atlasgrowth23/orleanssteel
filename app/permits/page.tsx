import { Suspense } from 'react'
import { FilterRibbon } from '@/components/permits/filter-ribbon'
import { DataTable } from '@/components/permits/data-table'
import { NavigationTabs } from '@/components/permits/navigation-tabs'
import { getPermits } from '@/lib/supabase'
import stubPermits from '@/data/stub-permits.json'

interface SearchParams {
  startDate?: string
  endDate?: string
  codes?: string
  keyword?: string
  minValue?: string
  maxValue?: string
  radius?: string
  status?: string
}

interface PermitsPageProps {
  searchParams: Promise<SearchParams>
}

async function getPermitsData(searchParams: SearchParams) {
  try {
    // Try to fetch from Supabase first
    const permits = await getPermits(searchParams)
    return permits
  } catch (error) {
    console.warn('Failed to fetch from Supabase, using stub data:', error)
    // Fallback to stub data
    return stubPermits
  }
}

export default async function PermitsPage({ searchParams }: PermitsPageProps) {
  const resolvedSearchParams = await searchParams
  const permits = await getPermitsData(resolvedSearchParams)

  return (
    <div className="h-full flex flex-col">
      <NavigationTabs />
      <FilterRibbon searchParams={resolvedSearchParams} />
      <div className="flex-1 p-6 overflow-auto">
        <Suspense fallback={<div>Loading permits...</div>}>
          <DataTable data={permits} />
        </Suspense>
      </div>
    </div>
  )
}
