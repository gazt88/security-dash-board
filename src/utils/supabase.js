import { createClient } from '@supabase/supabase-js';

// 반드시 REACT_APP_ 접두사 환경변수만 사용
const url = process.env.REACT_APP_SUPABASE_URL;
const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!url || !key) {
  // eslint-disable-next-line no-console
  console.error('[supabase.js] 환경변수 누락: .env(.local)에 REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY를 정확히 입력하세요.');
  alert('환경설정 오류: .env(.local)에 REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY가 누락되었습니다. 관리자에게 문의하세요.');
  throw new Error('[supabase.js] 환경변수 누락: .env(.local)에 REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY를 정확히 입력하세요.');
}

export const supabase = createClient(url, key); 