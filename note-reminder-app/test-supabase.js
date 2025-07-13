const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...\n')
  
  // Check if environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Environment variables not set!')
    console.log('Please update your .env.local file with your Supabase credentials')
    return false
  }
  
  if (supabaseUrl.includes('your-project-ref')) {
    console.error('❌ Please replace placeholder values in .env.local with your actual Supabase credentials')
    return false
  }
  
  console.log('✅ Environment variables found')
  console.log(`📍 URL: ${supabaseUrl}`)
  console.log(`🔑 Key: ${supabaseKey.substring(0, 20)}...`)
  
  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Test database connection
    const { data, error } = await supabase
      .from('notes')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Database connection failed:', error.message)
      return false
    }
    
    console.log('✅ Database connection successful!')
    console.log('✅ Notes table accessible')
    
    // Test auth
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.error('❌ Auth connection failed:', authError.message)
      return false
    }
    
    console.log('✅ Auth connection successful!')
    console.log('\n🎉 Supabase setup is complete and working!')
    
    return true
    
  } catch (err) {
    console.error('❌ Connection test failed:', err.message)
    return false
  }
}

// Run the test
testSupabaseConnection().then((success) => {
  if (success) {
    console.log('\n✅ You can now use your Note Reminder App!')
    console.log('👉 Visit: http://localhost:3000')
  } else {
    console.log('\n❌ Setup incomplete. Please check your Supabase configuration.')
  }
})