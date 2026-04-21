import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nnfadujqrswcyonqimxu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uZmFkdWpxcnN3Y3lvbnFpbXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MjM3NDIsImV4cCI6MjA5MjA5OTc0Mn0.iTiJFo9P949OahiNME6H0s87H5CzHCETRAshybNAZng'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debug() {
  console.log('Checking Channels...')
  const { data: channels } = await supabase.from('channels').select('*')
  console.log('Channels:', channels?.map(c => c.name).join(', ') || 'None')

  console.log('Checking pending picks...')
  const { data: items } = await supabase
    .from('pick_items')
    .select('*, order_items(*, orders(*, channels(*)), products(*)), locations(*)')
    .eq('picked', false)
    .limit(5);
  
  if (items) {
    console.log(`Found ${items.length} pending items. Sample:`)
    items.forEach(i => {
      console.log(`- Product: ${i.order_items?.products?.name}, Channel: ${i.order_items?.orders?.channels?.name}, Loc: ${i.locations?.location_code}`)
    })
  }
}

debug()
