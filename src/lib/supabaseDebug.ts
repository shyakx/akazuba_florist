// Supabase Debug Utilities
import { supabase } from './supabase';

export const debugSupabaseConnection = async () => {
  try {
    console.log('🔍 Debugging Supabase Connection...');
    
    // Check environment variables
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    console.log('📋 Environment Variables:');
    console.log('- VITE_SUPABASE_URL:', url ? '✅ Set' : '❌ Missing');
    console.log('- VITE_SUPABASE_ANON_KEY:', key ? '✅ Set' : '❌ Missing');
    
    if (!url || !key) {
      console.error('❌ Missing Supabase environment variables');
      return false;
    }
    
    // Test basic connection
    console.log('🔗 Testing Supabase connection...');
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('❌ Supabase connection error:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    
    // Check auth status
    const { data: { session } } = await supabase.auth.getSession();
    console.log('🔐 Auth status:', session ? '✅ Logged in' : '❌ Not logged in');
    
    return true;
  } catch (error) {
    console.error('❌ Debug error:', error);
    return false;
  }
};

// Call this function in development to debug connection issues
if (import.meta.env.DEV) {
  // Uncomment the line below to run debug on page load
  // debugSupabaseConnection();
}
