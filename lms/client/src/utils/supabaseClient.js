import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://zddropyytlxznhnomwll.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkZHJvcHl5dGx4em5obm9td2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MjkyNjYsImV4cCI6MjA2NjMwNTI2Nn0.g643ZfB7ZpnYN4QMydKN-tcsK_wB4ZoBvXvhVO49gg0'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase 