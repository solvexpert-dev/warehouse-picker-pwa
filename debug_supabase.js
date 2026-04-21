import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nnfadujqrswcyonqimxu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uZmFkdWpxcnN3Y3lvbnFpbXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MjM3NDIsImV4cCI6MjA5MjA5OTc0Mn0.iTiJFo9P949OahiNME6H0s87H5CzHCETRAshybNAZng'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debug() {
  console.log('Checking Supabase connection...')
  const { data: initialData, error: fetchError } = await supabase.from('staff').select('*')
  
  if (fetchError) {
    console.error('Error fetching staff table:', fetchError.message)
    return
  }

  if (initialData.length === 0) {
    console.log('Staff table is EMPTY. Attempting to seed Admin User...')
    const { data: insertData, error: insertError } = await supabase
      .from('staff')
      .insert([{ name: 'Admin User', pin: '1234', role: 'PICKER' }])
      .select()
    
    if (insertError) {
      console.error('Insert failed (likely RLS):', insertError.message)
    } else {
      console.log('SUCCESS! Admin User seeded:', insertData[0])
    }
  } else {
    console.log('Found staff members:', initialData.length)
    initialData.forEach(s => {
      console.log(`- Name: ${s.name}, PIN: ${s.pin}, Role: ${s.role}`)
    })
  }
}

debug()
