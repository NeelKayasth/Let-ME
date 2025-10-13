import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Area {
  AreaID: number
  AreaName: string
}

export interface Address {
  AddressId: number
  Address: string
}

export interface Property {
  PropertyID: number
  Properties?: string
  AreaID: number
  AddressID: number
  PlusCode: string
  Images: string
  Description: string
  image_url?: string
  areas?: Area
  addresses?: Address
}

export interface Unit {
  UnitID: number
  PropertyID: number
  UnitName: string
  MonthlyPrice: number
  Available: boolean
  Images: string
  Description: string
  image_url?: string
  properties?: Property
}
