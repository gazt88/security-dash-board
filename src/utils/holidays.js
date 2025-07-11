// 대한민국 공휴일 데이터 (네이버 캘린더 기준)
// 2024-2025년 공휴일 정보

const HOLIDAY_TYPES = {
  PUBLIC: 'public',        // 법정공휴일
  SUBSTITUTE: 'substitute', // 대체공휴일
  ELECTION: 'election',    // 선거일
  MEMORIAL: 'memorial',    // 기념일
  COMPANY: 'company'       // 회사 지정 휴일
};

const holidays = {
  2024: [
    // 신정
    { 
      uid: '2024010101',
      date: '2024-01-01', 
      name: '신정', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: null
    },
    
    // 설날 연휴
    { 
      uid: '2024020901',
      date: '2024-02-09', 
      name: '설날 연휴', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: null
    },
    { 
      uid: '2024021001',
      date: '2024-02-10', 
      name: '설날', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: null
    },
    { 
      uid: '2024021101',
      date: '2024-02-11', 
      name: '설날 연휴', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: null
    },
    { 
      uid: '2024021201',
      date: '2024-02-12', 
      name: '설날 대체공휴일', 
      type: HOLIDAY_TYPES.SUBSTITUTE,
      rrule: null
    },
    
    // 삼일절
    { 
      uid: '2024030101',
      date: '2024-03-01', 
      name: '삼일절', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: 'FREQ=YEARLY;BYMONTHDAY=1;BYMONTH=3'
    },
    
    // 국회의원선거
    { 
      uid: '2024041001',
      date: '2024-04-10', 
      name: '제22대 국회의원선거', 
      type: HOLIDAY_TYPES.ELECTION,
      rrule: null
    },
    
    // 어린이날
    { 
      uid: '2024050501',
      date: '2024-05-05', 
      name: '어린이날', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: 'FREQ=YEARLY;BYMONTHDAY=5;BYMONTH=5'
    },
    { 
      uid: '2024050601',
      date: '2024-05-06', 
      name: '어린이날 대체공휴일', 
      type: HOLIDAY_TYPES.SUBSTITUTE,
      rrule: null
    },
    
    // 석가탄신일
    { 
      uid: '2024051501',
      date: '2024-05-15', 
      name: '석가탄신일', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: null
    },
    
    // 현충일
    { 
      uid: '2024060601',
      date: '2024-06-06', 
      name: '현충일', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: 'FREQ=YEARLY;BYMONTHDAY=6;BYMONTH=6'
    },
    
    // 광복절
    { 
      uid: '2024081501',
      date: '2024-08-15', 
      name: '광복절', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: 'FREQ=YEARLY;BYMONTHDAY=15;BYMONTH=8'
    },
    
    // 추석 연휴
    { 
      uid: '2024091601',
      date: '2024-09-16', 
      name: '추석 연휴', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: null
    },
    { 
      uid: '2024091701',
      date: '2024-09-17', 
      name: '추석', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: null
    },
    { 
      uid: '2024091801',
      date: '2024-09-18', 
      name: '추석 연휴', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: null
    },
    
    // 개천절
    { 
      uid: '2024100301',
      date: '2024-10-03', 
      name: '개천절', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: 'FREQ=YEARLY;BYMONTHDAY=3;BYMONTH=10'
    },
    
    // 한글날
    { 
      uid: '2024100901',
      date: '2024-10-09', 
      name: '한글날', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: 'FREQ=YEARLY;BYMONTHDAY=9;BYMONTH=10'
    },
    
    // 성탄절
    { 
      uid: '2024122501',
      date: '2024-12-25', 
      name: '성탄절', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: 'FREQ=YEARLY;BYMONTHDAY=25;BYMONTH=12'
    }
  ],
  
  2025: [
    // 신정
    { 
      uid: '2025010101',
      date: '2025-01-01', 
      name: '신정', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: 'FREQ=YEARLY;BYMONTHDAY=1;BYMONTH=1'
    },
    
    // 설날 연휴
    { 
      uid: '2025012801',
      date: '2025-01-28', 
      name: '설날 연휴', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: null
    },
    { 
      uid: '2025012901',
      date: '2025-01-29', 
      name: '설날', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: null
    },
    { 
      uid: '2025013001',
      date: '2025-01-30', 
      name: '설날 연휴', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: null
    },
    
    // 삼일절
    { 
      uid: '2025030101',
      date: '2025-03-01', 
      name: '삼일절', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: 'FREQ=YEARLY;BYMONTHDAY=1;BYMONTH=3'
    },
    { 
      uid: '2025030301',
      date: '2025-03-03', 
      name: '삼일절 대체공휴일', 
      type: HOLIDAY_TYPES.SUBSTITUTE,
      rrule: null
    },
    
    // 어린이날
    { 
      uid: '2025050501',
      date: '2025-05-05', 
      name: '어린이날', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: 'FREQ=YEARLY;BYMONTHDAY=5;BYMONTH=5'
    },
    
    // 어버이날 (공휴일 아님, 기념일)
    { 
      uid: '2025050801',
      date: '2025-05-08', 
      name: '어버이날', 
      type: HOLIDAY_TYPES.MEMORIAL,
      rrule: null
    },
    
    // 석가탄신일
    { 
      uid: '2025050501',
      date: '2025-05-05', 
      name: '석가탄신일', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: null
    },
    
    // 현충일
    { 
      uid: '2025060601',
      date: '2025-06-06', 
      name: '현충일', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: 'FREQ=YEARLY;BYMONTHDAY=6;BYMONTH=6'
    },
    
    // 광복절
    { 
      uid: '2025081501',
      date: '2025-08-15', 
      name: '광복절', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: 'FREQ=YEARLY;BYMONTHDAY=15;BYMONTH=8'
    },
    
    // 추석 연휴
    { 
      uid: '2025100501',
      date: '2025-10-05', 
      name: '추석 연휴', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: null
    },
    { 
      uid: '2025100601',
      date: '2025-10-06', 
      name: '추석', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: null
    },
    { 
      uid: '2025100701',
      date: '2025-10-07', 
      name: '추석 연휴', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: null
    },
    { 
      uid: '2025100801',
      date: '2025-10-08', 
      name: '추석 연휴', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: null
    },
    
    // 개천절
    { 
      uid: '2025100301',
      date: '2025-10-03', 
      name: '개천절', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: 'FREQ=YEARLY;BYMONTHDAY=3;BYMONTH=10'
    },
    
    // 한글날
    { 
      uid: '2025100901',
      date: '2025-10-09', 
      name: '한글날', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: 'FREQ=YEARLY;BYMONTHDAY=9;BYMONTH=10'
    },
    
    // 성탄절
    { 
      uid: '2025122501',
      date: '2025-12-25', 
      name: '성탄절', 
      type: HOLIDAY_TYPES.PUBLIC,
      rrule: 'FREQ=YEARLY;BYMONTHDAY=25;BYMONTH=12'
    }
  ]
};

/**
 * 특정 날짜가 공휴일인지 확인
 * @param {Date} date - 확인할 날짜
 * @returns {Object|null} 공휴일 정보 또는 null
 */
export const isHoliday = (date) => {
  const year = date.getFullYear();
  const dateString = date.toISOString().split('T')[0];
  
  if (!holidays[year]) {
    return null;
  }
  
  return holidays[year].find(holiday => holiday.date === dateString) || null;
};

/**
 * 특정 날짜가 평일인지 확인 (주말과 공휴일 제외)
 * @param {Date} date - 확인할 날짜
 * @param {Array} customHolidays - 사용자 정의 휴일 목록
 * @returns {boolean} 평일 여부
 */
export const isWeekday = (date, customHolidays = []) => {
  // 시간대 문제를 방지하기 위해 정오(12시)로 설정한 날짜 생성
  const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
  const dayOfWeek = normalizedDate.getDay();
  const dateString = normalizedDate.toISOString().split('T')[0];
  
  // 주말 체크
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }
  
  // 공휴일 체크
  if (isHoliday(normalizedDate)) {
    return false;
  }
  
  // 사용자 정의 휴일 체크
  if (customHolidays.some(holiday => holiday.date === dateString)) {
    return false;
  }
  
  return true;
};

/**
 * 특정 월의 모든 평일 가져오기
 * @param {number} year - 연도
 * @param {number} month - 월 (1-12)
 * @param {Array} customHolidays - 사용자 정의 휴일 목록
 * @returns {Array} 평일 날짜 배열
 */
export const getWeekdaysInMonth = (year, month, customHolidays = []) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const weekdays = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    // 시간대 문제를 방지하기 위해 정오(12시)로 설정
    const date = new Date(year, month - 1, day, 12, 0, 0, 0);
    if (isWeekday(date, customHolidays)) {
      weekdays.push({
        date: date,
        dateString: date.toISOString().split('T')[0],
        day: day,
        dayOfWeek: date.getDay(),
        dayName: date.toLocaleDateString('ko-KR', { weekday: 'short' })
      });
    }
  }
  
  return weekdays;
};

/**
 * 특정 월의 공휴일 목록 가져오기
 * @param {number} year - 연도
 * @param {number} month - 월 (1-12)
 * @returns {Array} 공휴일 목록
 */
export const getHolidaysInMonth = (year, month) => {
  if (!holidays[year]) {
    return [];
  }
  
  return holidays[year].filter(holiday => {
    const holidayDate = new Date(holiday.date);
    return holidayDate.getMonth() === month - 1;
  });
};

/**
 * 전체 휴일 목록을 캘린더 이벤트 형식으로 변환
 * @param {number} year - 연도 (선택사항, 없으면 모든 해의 휴일 반환)
 * @returns {Array} 캘린더 이벤트 형식의 휴일 목록
 */
export const getHolidayEvents = (year = null) => {
  const holidayEvents = [];
  const yearsToInclude = year ? [year] : Object.keys(holidays);
  
  yearsToInclude.forEach(yr => {
    if (holidays[yr]) {
      holidays[yr].forEach(holiday => {
        const event = {
          id: holiday.uid,
          title: `🏮 ${holiday.name}`,
          start: holiday.date,
          backgroundColor: getHolidayColor(holiday.type),
          borderColor: getHolidayColor(holiday.type),
          textColor: 'white',
          display: 'background',
          classNames: ['holiday-event'],
          extendedProps: {
            type: 'holiday',
            holidayType: holiday.type,
            originalHoliday: holiday,
            isHoliday: true
          }
        };

        // RRULE이 있는 경우 반복 설정 추가
        if (holiday.rrule) {
          event.rrule = holiday.rrule;
        }

        holidayEvents.push(event);
      });
    }
  });
  
  return holidayEvents;
};

/**
 * 휴일 타입에 따른 색상 반환
 * @param {string} type - 휴일 타입
 * @returns {string} 색상 코드
 */
function getHolidayColor(type) {
  switch (type) {
    case HOLIDAY_TYPES.PUBLIC: return '#DC2626';     // 빨간색 (공휴일)
    case HOLIDAY_TYPES.SUBSTITUTE: return '#EA580C'; // 주황색 (대체공휴일)
    case HOLIDAY_TYPES.ELECTION: return '#7C3AED';   // 보라색 (선거일)
    case HOLIDAY_TYPES.MEMORIAL: return '#EC4899';   // 핑크색 (기념일)
    case HOLIDAY_TYPES.COMPANY: return '#059669';    // 초록색 (회사 지정 휴일)
    default: return '#DC2626';
  }
}

/**
 * 특정 날짜 범위의 휴일 목록 가져오기
 * @param {Date} startDate - 시작 날짜
 * @param {Date} endDate - 종료 날짜
 * @returns {Array} 휴일 목록
 */
export const getHolidaysInRange = (startDate, endDate) => {
  const holidayEvents = [];
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  
  for (let year = startYear; year <= endYear; year++) {
    if (holidays[year]) {
      holidays[year].forEach(holiday => {
        const holidayDate = new Date(holiday.date);
        if (holidayDate >= startDate && holidayDate <= endDate) {
          holidayEvents.push(holiday);
        }
      });
    }
  }
  
  return holidayEvents;
};

/**
 * 날짜가 주말인지 확인
 * @param {Date} date - 확인할 날짜
 * @returns {boolean} 주말 여부
 */
export const isWeekend = (date) => {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

/**
 * iCalendar 형식의 문자열 생성
 * @param {Object} holiday - 휴일 정보
 * @returns {string} iCalendar 형식 문자열
 */
export const generateICalString = (holiday) => {
  const dtStart = holiday.date.replace(/-/g, '');
  const dtEnd = holiday.date.replace(/-/g, '');
  
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:OK금융그룹-보안팀-대시보드
CALSCALE:GREGORIAN
BEGIN:VTIMEZONE
TZID:Asia/Seoul
BEGIN:STANDARD
DTSTART:19700101T000000
TZNAME:GMT+09:00
TZOFFSETFROM:+0900
TZOFFSETTO:+0900
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
SEQUENCE:0
CLASS:PUBLIC
TRANSP:OPAQUE
UID:${holiday.uid}
DTSTART;TZID=Asia/Seoul:${dtStart}
DTEND;TZID=Asia/Seoul:${dtEnd}
SUMMARY:${holiday.name}
DESCRIPTION:OK금융그룹 보안팀 휴일
${holiday.rrule ? 'RRULE:' + holiday.rrule : ''}
CREATED:${new Date().toISOString().replace(/[-:.]/g, '').split('T')[0]}
LAST-MODIFIED:${new Date().toISOString().replace(/[-:.]/g, '').split('T')[0]}
DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, '').split('T')[0]}
END:VEVENT
END:VCALENDAR`;
};

export default {
  HOLIDAY_TYPES,
  isHoliday,
  isWeekday,
  getWeekdaysInMonth,
  getHolidaysInMonth,
  getHolidayEvents,
  getHolidaysInRange,
  isWeekend,
  generateICalString
}; 