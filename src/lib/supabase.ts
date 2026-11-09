import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabasePublishableKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project')
);

// Gracefully initialize Supabase client
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey)
  : createClient(
      supabaseUrl.startsWith('http') ? supabaseUrl : 'https://placeholder.supabase.co',
      supabasePublishableKey || 'placeholder-anon-key'
    );
