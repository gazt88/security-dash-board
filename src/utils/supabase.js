import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  // eslint-disable-next-line no-console
  console.error('[supabase.js] 환경변수 누락: SUPABASE_URL, SUPABASE_ANON_KEY를 확인하세요.');
  throw new Error('[supabase.js] 환경변수 누락: SUPABASE_URL, SUPABASE_ANON_KEY를 확인하세요.');
}

export const supabase = createClient(url, key); 