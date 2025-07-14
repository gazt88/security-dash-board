import axios from 'axios';
import { supabase } from '../utils/supabase';

// 네이버 캘린더 일정 추가 (iCalendar 포맷)
export async function addNaverSchedule(token, icalString) {
  const res = await axios.post(
    'https://openapi.naver.com/calendar/createSchedule.json',
    `calendarId=defaultCalendarId&scheduleIcalString=${encodeURIComponent(icalString)}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return res.data;
}

// iCalendar 포맷 변환 예시 (간단 버전)
export function makeICalString({ title, description, location, start, end, uid }) {
  return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:Naver Calendar\nCALSCALE:GREGORIAN\nBEGIN:VEVENT\nUID:${uid}\nDTSTART;TZID=Asia/Seoul:${start}\nDTEND;TZID=Asia/Seoul:${end}\nSUMMARY:${title}\nDESCRIPTION:${description}\nLOCATION:${location}\nEND:VEVENT\nEND:VCALENDAR`;
}

// (추후) 네이버 API에서 공휴일 동기화 함수 추가 예정 

// 네이버 공휴일 API에서 공휴일 fetch (mock 예시)
export async function fetchNaverHolidays(year) {
  // 실제로는 네이버 OpenAPI 호출 필요, 여기선 mock 데이터
  // 예: [{ date: '2024-01-01', name: '신정' }, ...]
  return [
    { date: `${year}-01-01`, name: '신정' },
    { date: `${year}-03-01`, name: '삼일절' },
    { date: `${year}-05-05`, name: '어린이날' },
    { date: `${year}-08-15`, name: '광복절' },
    { date: `${year}-10-03`, name: '개천절' },
    { date: `${year}-10-09`, name: '한글날' },
    { date: `${year}-12-25`, name: '성탄절' }
  ];
}

// Supabase holidays 테이블에 upsert
export async function syncHolidaysWithNaver(year) {
  const holidays = await fetchNaverHolidays(year);
  for (const h of holidays) {
    await supabase.from('holiday').upsert({
      date: h.date,
      name: h.name,
      source: 'NAVER',
      imported_at: new Date().toISOString()
    }, { onConflict: ['date'] });
  }
  return holidays.length;
} 