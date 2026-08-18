import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

// القيم الافتراضية أدناه هي القيم الحالية للمشروع، ويُفضّل نقلها لملف
// .env.local باسم NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY
// حتى يسهل تبديلها بين بيئة التطوير والإنتاج دون تعديل الكود.
const FALLBACK_URL = 'https://ykccdnigbxgreszfqfui.supabase.co';
const FALLBACK_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrY2NkbmlnYnhncmVzemZxZnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NTIyMTQsImV4cCI6MjA5NjQyODIxNH0.ZUo-SoNA_kJfIb4C_A0QL0vNhX73R87mCkHGE3LeE6U';

export const getSupabase = (): SupabaseClient => {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('يرجى إضافة إعدادات Supabase (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) في إعدادات البيئة.');
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};
