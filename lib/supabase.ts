import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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

export async function getPermits(searchParams: SearchParams = {}) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase credentials not configured')
  }

  let query = supabase
    .from('permit_leads')
    .select('*')
    .order('issuedate', { ascending: false })
    .limit(200)

  // Apply filters based on search params
  if (searchParams.startDate) {
    query = query.gte('issuedate', searchParams.startDate)
  }
  if (searchParams.endDate) {
    query = query.lte('issuedate', searchParams.endDate)
  }
  if (searchParams.codes) {
    const codes = searchParams.codes.split(',')
    query = query.in('code', codes)
  }
  if (searchParams.keyword) {
    query = query.ilike('address', `%${searchParams.keyword}%`)
  }
  if (searchParams.minValue) {
    query = query.gte('value', parseInt(searchParams.minValue))
  }
  if (searchParams.maxValue) {
    query = query.lte('value', parseInt(searchParams.maxValue))
  }
  if (searchParams.status) {
    query = query.eq('status', searchParams.status)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data || []
}

// Auth helper functions for future use
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
