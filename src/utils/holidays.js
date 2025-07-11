// 대한민국 공휴일 데이터 (네이버 캘린더 기준)
// 2024-2025년 공휴일 정보

const holidays = {
  2024: [
    // 신정
    { date: '2024-01-01', name: '신정' },
    
    // 설날 연휴 (2024년 2월 9일~12일)
    { date: '2024-02-09', name: '설날 연휴' },
    { date: '2024-02-10', name: '설날' },
    { date: '2024-02-11', name: '설날 연휴' },
    { date: '2024-02-12', name: '설날 대체공휴일' },
    
    // 삼일절
    { date: '2024-03-01', name: '삼일절' },
    
    // 어린이날
    { date: '2024-05-05', name: '어린이날' },
    { date: '2024-05-06', name: '어린이날 대체공휴일' },
    
    // 석가탄신일
    { date: '2024-05-15', name: '석가탄신일' },
    
    // 현충일
    { date: '2024-06-06', name: '현충일' },
    
    // 광복절
    { date: '2024-08-15', name: '광복절' },
    
    // 추석 연휴 (2024년 9월 16일~18일)
    { date: '2024-09-16', name: '추석 연휴' },
    { date: '2024-09-17', name: '추석' },
    { date: '2024-09-18', name: '추석 연휴' },
    
    // 개천절
    { date: '2024-10-03', name: '개천절' },
    
    // 한글날
    { date: '2024-10-09', name: '한글날' },
    
    // 성탄절
    { date: '2024-12-25', name: '성탄절' },
  ],
  
  2025: [
    // 신정
    { date: '2025-01-01', name: '신정' },
    
    // 설날 연휴 (2025년 1월 28일~30일)
    { date: '2025-01-28', name: '설날 연휴' },
    { date: '2025-01-29', name: '설날' },
    { date: '2025-01-30', name: '설날 연휴' },
    
    // 삼일절
    { date: '2025-03-01', name: '삼일절' },
    { date: '2025-03-03', name: '삼일절 대체공휴일' },
    
    // 어린이날
    { date: '2025-05-05', name: '어린이날' },
    
    // 석가탄신일
    { date: '2025-05-05', name: '석가탄신일' },
    
    // 현충일
    { date: '2025-06-06', name: '현충일' },
    
    // 광복절
    { date: '2025-08-15', name: '광복절' },
    
    // 추석 연휴 (2025년 10월 5일~8일)
    { date: '2025-10-05', name: '추석 연휴' },
    { date: '2025-10-06', name: '추석' },
    { date: '2025-10-07', name: '추석 연휴' },
    { date: '2025-10-08', name: '추석 연휴' },
    
    // 개천절
    { date: '2025-10-03', name: '개천절' },
    
    // 한글날
    { date: '2025-10-09', name: '한글날' },
    
    // 성탄절
    { date: '2025-12-25', name: '성탄절' },
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
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const normalizedDate = new Date(year, month, day, 12, 0, 0, 0);
  
  const dayOfWeek = normalizedDate.getDay(); // 0=일요일, 1=월요일, ..., 6=토요일
  const dateString = date.toISOString().split('T')[0];
  
  // 주말 체크: 일요일(0), 토요일(6)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }
  
  // 기본 공휴일 체크
  if (isHoliday(date)) {
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
 * 날짜가 주말인지 확인
 * @param {Date} date - 확인할 날짜
 * @returns {boolean} 주말 여부
 */
export const isWeekend = (date) => {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

export default {
  isHoliday,
  isWeekday,
  getWeekdaysInMonth,
  getHolidaysInMonth,
  isWeekend
}; 