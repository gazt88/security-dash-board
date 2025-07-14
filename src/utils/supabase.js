import { createClient } from '@supabase/supabase-js';

// 반드시 REACT_APP_ 접두사 환경변수만 사용
const url = process.env.REACT_APP_SUPABASE_URL;
const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

let supabase = null;
if (!url || !key) {
  // eslint-disable-next-line no-console
  console.error('[supabase.js] 환경변수 누락: .env(.local)에 REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY를 정확히 입력하세요. (앱은 제한 모드로 동작)');
  // supabase는 null로 둠, 앱에서 null 체크 후 안내
} else {
  supabase = createClient(url, key);
}

export { supabase }; 