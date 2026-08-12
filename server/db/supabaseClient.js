import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('⚡ Connected to Supabase Cloud PostgreSQL DB at:', supabaseUrl);
  } catch (err) {
    console.error('⚠️ Error initializing Supabase client:', err.message);
  }
} else {
  console.log('ℹ️ Supabase environment variables missing. Running in local SQLite mode.');
}

export default supabase;
