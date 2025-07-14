import { createClient } from '@supabase/supabase-js';

// 프론트/백 모두 호환: REACT_APP_ 우선, 없으면 기존 값
const url = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  // eslint-disable-next-line no-console
  console.error('[supabase.js] 환경변수 누락: SUPABASE_URL, SUPABASE_ANON_KEY 또는 REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY를 확인하세요.');
  throw new Error('[supabase.js] 환경변수 누락: SUPABASE_URL, SUPABASE_ANON_KEY 또는 REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY를 확인하세요.');
}

export const supabase = createClient(url, key); 