import React, { useState, useEffect } from 'react';
import { X, Shield, Plus, Minus, Calendar, Users, AlertTriangle } from 'lucide-react';
import { getWeekdaysInMonth, getHolidaysInMonth } from '../utils/holidays';

const DutyScheduleModal = ({ onClose, onGenerate }) => {
  // 로컬스토리지에서 팀원 목록 불러오기
  const loadTeamMembers = () => {
    const saved = localStorage.getItem('dutyTeamMembers');
    return saved ? JSON.parse(saved) : ['김보안', '이감사', '박관제', '최보안'];
  };

  const [teamMembers, setTeamMembers] = useState(loadTeamMembers());
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [newMemberName, setNewMemberName] = useState('');
  const [customHolidays, setCustomHolidays] = useState([]);
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newHolidayName, setNewHolidayName] = useState('');

  // 팀원 목록이 변경될 때마다 로컬스토리지에 저장
  const updateTeamMembers = (newMembers) => {
    setTeamMembers(newMembers);
    localStorage.setItem('dutyTeamMembers', JSON.stringify(newMembers));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (teamMembers.length === 0) {
      alert('최소 1명의 팀원을 입력해주세요.');
      return;
    }

    const weekdays = getWeekdaysInMonth(year, month, customHolidays);
    
    onGenerate({
      teamMembers,
      year,
      month,
      weekdays,
      customHolidays
    });
  };

  const addCustomHoliday = () => {
    if (!newHolidayDate || !newHolidayName.trim()) {
      alert('날짜와 휴일명을 모두 입력해주세요.');
      return;
    }

    const holidayDate = new Date(newHolidayDate);
    if (holidayDate.getMonth() !== month - 1 || holidayDate.getFullYear() !== year) {
      alert('선택한 연도와 월에 해당하는 날짜를 입력해주세요.');
      return;
    }

    const newHoliday = {
      date: newHolidayDate,
      name: newHolidayName.trim(),
      custom: true
    };

    if (!customHolidays.some(h => h.date === newHolidayDate)) {
      setCustomHolidays([...customHolidays, newHoliday]);
      setNewHolidayDate('');
      setNewHolidayName('');
    } else {
      alert('이미 추가된 날짜입니다.');
    }
  };

  const removeCustomHoliday = (dateToRemove) => {
    setCustomHolidays(customHolidays.filter(h => h.date !== dateToRemove));
  };

  const addMember = () => {
    if (newMemberName.trim() && !teamMembers.includes(newMemberName.trim())) {
      updateTeamMembers([...teamMembers, newMemberName.trim()]);
      setNewMemberName('');
    }
  };

  const removeMember = (index) => {
    updateTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const moveMemberUp = (index) => {
    if (index > 0) {
      const newMembers = [...teamMembers];
      [newMembers[index - 1], newMembers[index]] = [newMembers[index], newMembers[index - 1]];
      updateTeamMembers(newMembers);
    }
  };

  const moveMemberDown = (index) => {
    if (index < teamMembers.length - 1) {
      const newMembers = [...teamMembers];
      [newMembers[index], newMembers[index + 1]] = [newMembers[index + 1], newMembers[index]];
      updateTeamMembers(newMembers);
    }
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const generatePreview = () => {
    if (teamMembers.length === 0) return { weekdays: [], summary: null };
    
    const weekdays = getWeekdaysInMonth(year, month, customHolidays);
    const holidays = getHolidaysInMonth(year, month);
    const allHolidays = [...holidays, ...customHolidays];
    const daysInMonth = getDaysInMonth(year, month);
    
    const preview = weekdays.slice(0, 7).map((weekday, index) => {
      const memberIndex = index % teamMembers.length;
      return {
        day: weekday.day,
        date: weekday.date.toLocaleDateString('ko-KR', { 
          month: 'short', 
          day: 'numeric', 
          weekday: 'short' 
        }),
        member: teamMembers[memberIndex],
        dateString: weekday.dateString,
        dayName: weekday.dayName
      };
    });
    
    // 주말 계산 (전체 일수에서 평일과 휴일 제외)
    let weekendCount = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendCount++;
      }
    }
    
    const summary = {
      totalDays: daysInMonth,
      weekdays: weekdays.length,
      weekends: weekendCount,
      holidays: allHolidays.length,
      dutyDays: weekdays.length
    };
    
    return { weekdays: preview, summary, holidays: allHolidays };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-text-dark flex items-center">
            <Shield className="w-6 h-6 mr-2 text-status-duty" />
            당직 일정 자동 생성
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 연/월 선택 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                연도
              </label>
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-status-duty focus:border-status-duty"
              >
                {Array.from({ length: 3 }, (_, i) => {
                  const y = new Date().getFullYear() + i - 1;
                  return <option key={y} value={y}>{y}년</option>;
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">
                월
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-status-duty focus:border-status-duty"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}월</option>
                ))}
              </select>
            </div>
          </div>

          {/* 팀원 관리 */}
          <div>
            <label className="block text-sm font-medium text-text-dark mb-3 flex items-center">
              <Users className="w-4 h-4 mr-1" />
              당직 팀원 순서 (총 {teamMembers.length}명)
            </label>
            
            {/* 팀원 추가 */}
            <div className="flex mb-4">
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="팀원 이름 입력"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-status-duty focus:border-status-duty"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMember())}
              />
              <button
                type="button"
                onClick={addMember}
                className="px-4 py-2 bg-status-duty text-white rounded-r-md hover:bg-orange-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* 팀원 목록 */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 bg-status-duty text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="font-medium">{member}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => moveMemberUp(index)}
                      disabled={index === 0}
                      className={`p-1 rounded ${
                        index === 0 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-gray-600 hover:text-status-duty'
                      }`}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveMemberDown(index)}
                      disabled={index === teamMembers.length - 1}
                      className={`p-1 rounded ${
                        index === teamMembers.length - 1 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-gray-600 hover:text-status-duty'
                      }`}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 사용자 정의 휴일 관리 */}
          <div>
            <label className="block text-sm font-medium text-text-dark mb-3 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1" />
              추가 휴일 설정 (총 {customHolidays.length}일)
            </label>
            
            {/* 휴일 추가 */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              <input
                type="date"
                value={newHolidayDate}
                onChange={(e) => setNewHolidayDate(e.target.value)}
                min={`${year}-${String(month).padStart(2, '0')}-01`}
                max={`${year}-${String(month).padStart(2, '0')}-${getDaysInMonth(year, month)}`}
                className="col-span-2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              />
              <input
                type="text"
                value={newHolidayName}
                onChange={(e) => setNewHolidayName(e.target.value)}
                placeholder="휴일명 (예: 회사창립일)"
                className="col-span-2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomHoliday())}
              />
              <button
                type="button"
                onClick={addCustomHoliday}
                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* 추가된 휴일 목록 */}
            {customHolidays.length > 0 && (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {customHolidays.map((holiday, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-red-50 rounded-lg border border-red-200"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-red-600 text-sm font-medium">
                        {new Date(holiday.date).toLocaleDateString('ko-KR', { 
                          month: 'short', 
                          day: 'numeric', 
                          weekday: 'short' 
                        })}
                      </span>
                      <span className="text-red-700 text-sm">{holiday.name}</span>
                      <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded">사용자 정의</span>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeCustomHoliday(holiday.date)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-xs text-gray-500 mt-2">
              💡 공휴일이 누락되었거나 회사 고유 휴일이 있는 경우 직접 추가할 수 있습니다.
            </div>
          </div>

          {/* 미리보기 */}
          {teamMembers.length > 0 && (() => {
            const previewData = generatePreview();
            return (
              <div>
                <h4 className="text-sm font-medium text-text-dark mb-3">
                  📅 {year}년 {month}월 당직 미리보기
                </h4>
                
                {/* 월 통계 */}
                {previewData.summary && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-blue-800">{previewData.summary.totalDays}일</div>
                        <div className="text-blue-600 text-xs">총 일수</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-status-duty">{previewData.summary.dutyDays}일</div>
                        <div className="text-orange-600 text-xs">당직 일수</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-600">{previewData.summary.weekends}일</div>
                        <div className="text-gray-500 text-xs">주말</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-red-600">{previewData.summary.holidays}일</div>
                        <div className="text-red-500 text-xs">공휴일</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 당직 미리보기 */}
                {previewData.weekdays.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">
                      🛡️ 평일 당직 배정 (첫 {previewData.weekdays.length}일)
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      {previewData.weekdays.map((item) => (
                        <div key={item.day} className="flex justify-between items-center py-1">
                          <span className="text-gray-600">{item.date}</span>
                          <span className="font-medium text-status-duty">{item.member} 당직</span>
                        </div>
                      ))}
                      {previewData.summary.dutyDays > previewData.weekdays.length && (
                        <div className="col-span-full text-center text-gray-500 text-xs pt-2">
                          ... 총 {previewData.summary.dutyDays}일 간 평일 순환 배정
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* 공휴일 안내 */}
                {previewData.holidays && previewData.holidays.length > 0 && (
                  <div className="bg-red-50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-red-700 mb-2 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {month}월 휴일 ({previewData.holidays.length}일)
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-red-600">
                      {previewData.holidays.map((holiday, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{new Date(holiday.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' })}</span>
                          <div className="flex items-center space-x-1">
                            <span>{holiday.name}</span>
                            {holiday.custom && (
                              <span className="text-xs bg-red-200 text-red-700 px-1 rounded">사용자</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-red-500 mt-2">
                      ※ 위 날짜들은 당직에서 제외됩니다
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* 안내 메시지 */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="text-sm font-semibold text-blue-800 mb-2">🛡️ 평일 당직 생성 안내</h5>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• <strong>평일에만</strong> 팀원 순서대로 당직이 배정됩니다 (토요일, 일요일 제외)</li>
              <li>• <strong>대한민국 공휴일</strong>도 자동으로 제외됩니다 (네이버 캘린더 기준)</li>
              <li>• 기존 당직 일정은 모두 삭제되고 새로 생성됩니다</li>
              <li>• 팀원 순서는 위/아래 화살표로 조정할 수 있습니다</li>
              <li>• 당직은 평일 24시간 정보보안 모니터링 업무입니다</li>
            </ul>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={teamMembers.length === 0}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                teamMembers.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-status-duty text-white hover:bg-orange-600'
              }`}
            >
              당직 일정 생성
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DutyScheduleModal; 