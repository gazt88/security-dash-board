import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase 환경변수가 누락되었습니다. .env.local 및 Vercel 환경변수를 확인하세요.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 