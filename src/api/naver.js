// 네이버 캘린더 일정 추가 API
// accessToken, icalString을 받아 일정 생성
export async function addNaverSchedule(accessToken, scheduleIcalString) {
  const res = await fetch('https://openapi.naver.com/calendar/createSchedule.json', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `calendarId=defaultCalendarId&scheduleIcalString=${encodeURIComponent(scheduleIcalString)}`,
  });
  if (!res.ok) throw new Error('네이버 일정 추가 실패');
  return res.json();
} 