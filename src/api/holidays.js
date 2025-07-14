import { supabase } from '../utils/supabase';

export async function fetchHolidays(year, month) {
  // 해당 월의 모든 공휴일 조회
  const from = `${year}-${String(month).padStart(2, '0')}-01`;
  const to = `${year}-${String(month).padStart(2, '0')}-31`;
  const { data, error } = await supabase
    .from('holiday')
    .select('*')
    .gte('date', from)
    .lte('date', to);
  if (error) throw error;
  return data;
}

// 네이버 API에서 공휴일 수집(샘플, 실제 연동은 서버/Edge Function 권장)
export async function fetchNaverHolidays(year) {
  // 실제 구현 시 네이버 OpenAPI 호출 필요
  // 예시: fetch('https://openapi.naver.com/calendar/holidays?...')
  throw new Error('네이버 공휴일 API는 서버에서 연동 필요');
} 