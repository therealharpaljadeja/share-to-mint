import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for better TypeScript support
export interface Database {
  public: {
    Tables: {
      user_mints: {
        Row: {
          id: string
          user_fid: number
          cast_hash: string
          coin_description: string | null
          coin_image: string
          coin_address: string
          coin_name: string
          coin_symbol: string
          transaction_hash: string
          referrer: string | null
          zora_link: string
          created_at: string
        }
        Insert: {
          id?: string
          user_fid: number
          cast_hash: string
          coin_description: string | null
          coin_image: string
          coin_address: string
          coin_name: string
          coin_symbol: string
          transaction_hash: string
          referrer?: string | null
          zora_link?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_fid?: number
          cast_hash?: string
          coin_description: string | null
          coin_image?: string
          coin_address?: string
          coin_name?: string
          coin_symbol?: string
          transaction_hash?: string
          referrer?: string | null
          zora_link?: string
          created_at?: string
        }
      }
    }
  }
} 