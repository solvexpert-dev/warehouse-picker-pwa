import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nnfadujqrswcyonqimxu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uZmFkdWpxcnN3Y3lvbnFpbXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MjM3NDIsImV4cCI6MjA5MjA5OTc0Mn0.iTiJFo9P949OahiNME6H0s87H5CzHCETRAshybNAZng'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
