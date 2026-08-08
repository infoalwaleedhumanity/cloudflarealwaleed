import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (!supabaseInstance) {
    const supabaseUrl = 'https://ykccdnigbxgreszfqfui.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrY2NkbmlnYnhncmVzemZxZnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NTIyMTQsImV4cCI6MjA5NjQyODIxNH0.ZUo-SoNA_kJfIb4C_A0QL0vNhX73R87mCkHGE3LeE6U';

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('يرجى إضافة إعدادات Supabase (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) في إعدادات البيئة.');
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};
