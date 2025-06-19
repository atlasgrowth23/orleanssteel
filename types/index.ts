export interface Permit {
  id?: string
  issuedate: string
  code: string
  value?: number
  address: string
  latitude?: number
  longitude?: number
  status?: string
  [key: string]: any // Allow for additional fields from Supabase
}

export interface PipelineCard {
  id: string
  company: string
  city: string
  phone?: string
  email?: string
  status: string
  createdAt: string
}

export interface PipelineData {
  id: string
  name: string
  cards: PipelineCard[]
}
