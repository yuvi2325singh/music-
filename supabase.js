import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://YOUR_SUPABASE_URL.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

let supabaseClient = null;

if (!SUPABASE_URL.includes('YOUR_SUPABASE_URL') && !SUPABASE_ANON_KEY.includes('YOUR_SUPABASE_ANON_KEY')) {
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.warn('Supabase not configured. Using demo mode with local storage.');
}

export const supabase = supabaseClient;
