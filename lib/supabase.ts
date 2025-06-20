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

// Orleans Steel location for radius calculations
const ORLEANS_STEEL_LOCATION = {
  lat: 29.9584,
  lng: -90.0192,
  address: "1641 Poland Ave, New Orleans, LA 70117"
}

// Orleans Steel product-relevant permit codes (based on actual database)
const ORLEANS_STEEL_RELEVANT_CODES = {
  // ROOFING & SIDING - Direct product match (BLUE)
  'ROOF': { category: 'Metal Roofing', priority: 'high', description: 'Roofing - Metal panels, trim, accessories', color: '#3b82f6' },
  
  // STRUCTURAL STEEL - High-value projects (RED)
  'RNVS': { category: 'Structural Steel', priority: 'high', description: 'Structural Renovation - Steel reinforcement, framing', color: '#ef4444' },
  'NEWC': { category: 'Structural Steel', priority: 'high', description: 'New Commercial - Steel buildings, framing', color: '#ef4444' },
  
  // GENERAL CONSTRUCTION - Good opportunities (AMBER)
  'RNVN': { category: 'General Construction', priority: 'medium', description: 'Non-structural Renovation - Metal roofing, siding, trim', color: '#f59e0b' },
  
  // DEMOLITION - Future opportunities (PURPLE)
  'DEMO': { category: 'Opportunity', priority: 'medium', description: 'Demolition - Often leads to new construction', color: '#a855f7' },
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959 // Radius of Earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

function calculateLeadScore(permit: any): number {
  let score = 0
  
  // Base score from construction value
  score += Math.min(permit.constrval / 10000, 30) // Max 30 points for value
  
  // Orleans Steel product relevance scoring
  const codeInfo = ORLEANS_STEEL_RELEVANT_CODES[permit.code]
  if (codeInfo) {
    switch (codeInfo.priority) {
      case 'highest': score += 50; break // FENC (direct product match)
      case 'high': score += 40; break    // ROOF, RERR, MBLD, RNVS, NEWC, NIND, ADDN
      case 'medium': score += 25; break  // RNVN, DEMO
    }
    
    // Extra bonus for direct product matches
    if (codeInfo.category === 'Fencing & Gates') score += 20
    if (codeInfo.category === 'Metal Roofing') score += 15
    if (codeInfo.category === 'Structural Steel') score += 15
  }
  
  // High-value project bonuses
  if (permit.constrval >= 50000) score += 10   // $50k+
  if (permit.constrval >= 100000) score += 15  // $100k+
  if (permit.constrval >= 250000) score += 20  // $250k+
  if (permit.constrval >= 500000) score += 25  // $500k+
  
  // Distance scoring (closer is much better for delivery)
  if (permit.distance <= 5) score += 25       // Very close
  else if (permit.distance <= 10) score += 20 // Close
  else if (permit.distance <= 15) score += 15 // Moderate
  else if (permit.distance <= 25) score += 10 // Acceptable
  else if (permit.distance <= 35) score += 5  // Far but doable
  
  return Math.round(score)
}

export async function getPermits(searchParams: SearchParams = {}) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase credentials not configured')
  }

  // Get only relevant permit codes
  const relevantCodes = Object.keys(ORLEANS_STEEL_RELEVANT_CODES)
  
  let query = supabase
    .from('permit_leads')
    .select('*')
    .not('location_1', 'is', null) // Only permits with locations
    .gte('constrval', 0) // Include permits with no value listed
    .in('code', relevantCodes) // Only relevant permit types
    .order('constrval', { ascending: false }) // Start with highest value
    .limit(300)

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
    query = query.or(`address.ilike.%${searchParams.keyword}%,contractors.ilike.%${searchParams.keyword}%,description.ilike.%${searchParams.keyword}%`)
  }
  if (searchParams.minValue) {
    query = query.gte('constrval', parseInt(searchParams.minValue))
  }
  if (searchParams.maxValue) {
    query = query.lte('constrval', parseInt(searchParams.maxValue))
  }
  if (searchParams.status) {
    query = query.eq('currentstatus', searchParams.status)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  // Transform data and calculate distances/scores
  const transformedData = data?.map(permit => {
    let latitude = null
    let longitude = null
    let distance = null
    
    if (permit.location_1) {
      try {
        const location = typeof permit.location_1 === 'string' 
          ? JSON.parse(permit.location_1) 
          : permit.location_1
        latitude = parseFloat(location.latitude)
        longitude = parseFloat(location.longitude)
        
        if (latitude && longitude) {
          distance = calculateDistance(
            ORLEANS_STEEL_LOCATION.lat, 
            ORLEANS_STEEL_LOCATION.lng, 
            latitude, 
            longitude
          )
        }
      } catch (e) {
        console.warn('Could not parse location for permit:', permit.permit_id)
      }
    }

    const codeInfo = ORLEANS_STEEL_RELEVANT_CODES[permit.code]
    
    const transformedPermit = {
      id: permit.permit_id,
      address: permit.address,
      issuedate: permit.issuedate,
      code: permit.code,
      type: permit.type,
      description: permit.description,
      value: permit.constrval || 0,
      applicant: permit.applicant,
      contractor: permit.contractors,
      status: permit.currentstatus,
      latitude,
      longitude,
      distance: distance ? Math.round(distance * 10) / 10 : null,
      isSteelRelevant: !!codeInfo,
      steelCategory: codeInfo?.category || 'Other',
      steelPriority: codeInfo?.priority || 'none',
      steelDescription: codeInfo?.description || '',
      raw: permit
    }

    transformedPermit.leadScore = calculateLeadScore({ ...transformedPermit, constrval: permit.constrval })

    return transformedPermit
  }) || []

  // Filter by radius if specified
  const radius = searchParams.radius ? parseInt(searchParams.radius) : 25
  const filteredData = transformedData.filter(permit => 
    permit.distance === null || permit.distance <= radius
  )

  // Sort by lead score (best leads first)
  filteredData.sort((a, b) => b.leadScore - a.leadScore)

  return filteredData
}

export { ORLEANS_STEEL_LOCATION }

// Pipeline functions
export async function getContractorPipelines() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase credentials not configured')
  }

  try {
    // Get fence contractors
    const { data: fenceContractors, error: fenceError } = await supabase
      .from('fence_contractors_raw')
      .select('*')

    if (fenceError) throw fenceError

    // Get GC contractors  
    const { data: gcContractors, error: gcError } = await supabase
      .from('gc_contractors_raw')
      .select('*')

    if (gcError) throw gcError

    // Organize into pipelines
    const pipelines = [
      {
        id: 'fence-mobile',
        name: 'Fence – Mobile',
        cards: fenceContractors
          .filter(c => c.phone && c['phone.phones_enricher.carrier_type'] === 'mobile')
          .map(transformContractor)
      },
      {
        id: 'fence-no-mobile', 
        name: 'Fence – No Mobile',
        cards: fenceContractors
          .filter(c => !c.phone || c['phone.phones_enricher.carrier_type'] !== 'mobile')
          .map(transformContractor)
      },
      {
        id: 'gc-mobile',
        name: 'GC – Mobile', 
        cards: gcContractors
          .filter(c => c.phone && c['phone.phones_enricher.carrier_type'] === 'mobile')
          .map(transformContractor)
      },
      {
        id: 'gc-no-mobile',
        name: 'GC – No Mobile',
        cards: gcContractors
          .filter(c => !c.phone || c['phone.phones_enricher.carrier_type'] !== 'mobile')
          .map(transformContractor)
      }
    ]

    return pipelines
  } catch (error) {
    console.warn('Failed to fetch contractor data:', error)
    return []
  }
}

function transformContractor(contractor: any) {
  return {
    id: contractor.id,
    company: contractor.company_name,
    city: contractor.city,
    phone: contractor.phone,
    website: contractor.site,
    email: contractor.email_1,
    address: contractor.full_address,
    rating: contractor.rating,
    reviews: contractor.reviews,
    status: 'new', // All start in new stage
    createdAt: new Date().toISOString(),
    // Store full contractor data for detail view
    fullData: contractor
  }
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
