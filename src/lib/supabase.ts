import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const createClientComponentClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export type Database = {
  public: {
    Tables: {
      notes: {
        Row: {
          id: string
          user_id: string
          content: string
          reminder_time: string | null
          is_recurring: boolean
          recurring_interval: number | null
          recurring_unit: 'minutes' | 'hours' | 'days' | null
          visual_effect: 'shake' | 'blink' | 'bounce' | 'pulse' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          reminder_time?: string | null
          is_recurring?: boolean
          recurring_interval?: number | null
          recurring_unit?: 'minutes' | 'hours' | 'days' | null
          visual_effect?: 'shake' | 'blink' | 'bounce' | 'pulse' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          reminder_time?: string | null
          is_recurring?: boolean
          recurring_interval?: number | null
          recurring_unit?: 'minutes' | 'hours' | 'days' | null
          visual_effect?: 'shake' | 'blink' | 'bounce' | 'pulse' | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}