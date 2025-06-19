import { NextRequest, NextResponse } from 'next/server'
import { getPermits } from '@/lib/supabase'
import stubPermits from '@/data/stub-permits.json'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = {
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      codes: searchParams.get('codes') || undefined,
      keyword: searchParams.get('keyword') || undefined,
      minValue: searchParams.get('minValue') || undefined,
      maxValue: searchParams.get('maxValue') || undefined,
      radius: searchParams.get('radius') || undefined,
      status: searchParams.get('status') || undefined,
    }

    try {
      const permits = await getPermits(filters)
      return NextResponse.json(permits)
    } catch (error) {
      console.warn('Failed to fetch from Supabase, using stub data:', error)
      return NextResponse.json(stubPermits)
    }
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(stubPermits)
  }
}
