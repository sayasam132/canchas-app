import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://toiafoxboonmacowjggb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvaWFmb3hib29ubWFjb3dqZ2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5Mjk3MzQsImV4cCI6MjA4ODUwNTczNH0.fjcSaEioY4qGlna2Fgf1B5py4rZZX6Ec7RJVM5i7Qhg'
export const supabase = createClient(supabaseUrl, supabaseKey)
