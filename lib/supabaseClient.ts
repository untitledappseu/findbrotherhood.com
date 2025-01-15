import { createClient } from './supabase/client'

// Create a single supabase client for interacting with your database
const supabase = createClient( )

export { supabase }
