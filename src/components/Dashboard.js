import React, { useState } from 'react';
import CalendarGrid from './CalendarGrid';
import StatusLegend from './StatusLegend';
import AddEventModal from './AddEventModal';
import ShareModal from './ShareModal';
import DutyScheduleModal from './DutyScheduleModal';
import { Plus, Share2, Shield } from 'lucide-react';

const Dashboard = ({ scheduleData, onScheduleUpdate, onAddEvent, onEditEvent, onDeleteEvent }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterBy, setFilterBy] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDutyModal, setShowDutyModal] = useState(false);
  const [selectedEventForEdit, setSelectedEventForEdit] = useState(null);

  const handleDateClick = (dateInfo) => {
    setSelectedDate(dateInfo);
  };

  const handleCloseModal = () => {
    setSelectedDate(null);
  };

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  const handleDutyClick = () => {
    setShowDutyModal(true);
  };

  const handleDutyScheduleGenerate = (dutyData) => {
    const { teamMembers, year, month, weekdays, customHolidays } = dutyData;
    
    // 기존 당직 일정 제거 (해당 월만)
    const filteredScheduleData = scheduleData.filter(event => {
      if (event.type !== 'duty') return true;
      const eventDate = new Date(event.date);
      return !(eventDate.getFullYear() === year && eventDate.getMonth() === month - 1);
    });
    
    // 새로운 당직 일정 생성 (평일만)
    const newDutyEvents = weekdays.map((weekday, index) => {
      const memberIndex = index % teamMembers.length;
      const dutyMember = teamMembers[memberIndex];
      
      return {
        id: `duty_${weekday.dateString}`,
        name: `${dutyMember} 당직`,
        type: 'duty',
        date: weekday.dateString,
        description: '정보보안팀 평일 당직 업무'
      };
    });
    
    // 전체 일정 업데이트
    const updatedScheduleData = [...filteredScheduleData, ...newDutyEvents];
    onScheduleUpdate(updatedScheduleData);
    setShowDutyModal(false);
  };

  const handleEventAdd = (eventData) => {
    // ID 생성
    const newEvent = {
      ...eventData,
      id: Date.now().toString()
    };
    onAddEvent(newEvent);
    setShowAddModal(false);
  };

  const handleEventEdit = (eventData) => {
    onEditEvent(selectedEventForEdit.id, eventData);
    setSelectedEventForEdit(null);
    setSelectedDate(null);
  };

  const handleEventDelete = (eventId) => {
    onDeleteEvent(eventId);
    setSelectedDate(null);
  };

  const handleEditClick = (event) => {
    setSelectedEventForEdit(event);
    setSelectedDate(null);
  };

  const filteredEvents = scheduleData.filter(event => {
    if (filterBy === 'all') return true;
    return event.type === filterBy;
  });

  return (
    <div className="space-y-6">
      {/* 대시보드 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-dark">팀 일정 캘린더</h2>
          <p className="text-gray-600 mt-1">
            {scheduleData.length > 0 
              ? `총 ${scheduleData.length}개의 일정이 등록되어 있습니다.`
              : '일정을 추가해보세요!'
            }
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleDutyClick}
            className="bg-status-duty text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors font-medium flex items-center space-x-2"
          >
            <Shield className="w-4 h-4" />
            <span>당직 넣기</span>
          </button>
          <button
            onClick={handleShareClick}
            className="bg-accent-yellow text-white px-6 py-2 rounded-md hover:bg-yellow-500 transition-colors font-medium flex items-center space-x-2"
          >
            <Share2 className="w-4 h-4" />
            <span>공유</span>
          </button>
          <button
            onClick={handleAddClick}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors font-medium flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>일정 추가</span>
          </button>
        </div>
      </div>

      {/* 필터 및 범례 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-dark">일정 필터</h3>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="all">전체</option>
            <option value="annual">연차</option>
            <option value="half">반차</option>
            <option value="duty">당직</option>
            <option value="meeting">회의</option>
            <option value="business">외근/출장</option>
            <option value="weekly">주간간담회</option>
            <option value="monthly">월간간담회</option>
          </select>
        </div>
        
        <StatusLegend />
      </div>

      {/* 캘린더 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <CalendarGrid 
          events={filteredEvents}
          onDateClick={handleDateClick}
        />
      </div>

      {/* 일정 상세 모달 */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-dark">
                {selectedDate.dateStr} 일정
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              {selectedDate.events.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className={`w-3 h-3 rounded-full ${
                        event.type === 'annual' ? 'bg-status-annual' :
                        event.type === 'half' ? 'bg-status-half' :
                        event.type === 'duty' ? 'bg-status-duty' :
                        event.type === 'meeting' ? 'bg-status-meeting' :
                        event.type === 'business' ? 'bg-status-business' :
                        event.type === 'weekly' ? 'bg-status-weekly' :
                        event.type === 'monthly' ? 'bg-status-monthly' :
                        'bg-gray-500'
                      }`}
                    />
                    <div>
                      <span className="font-medium">{event.name}</span>
                      <div className="text-sm text-gray-600">
                        {event.type === 'annual' ? '연차' :
                         event.type === 'half' ? '반차' :
                         event.type === 'duty' ? '당직' :
                         event.type === 'meeting' ? '회의' :
                         event.type === 'business' ? '외근/출장' :
                         event.type === 'weekly' ? '주간간담회' :
                         event.type === 'monthly' ? '월간간담회' :
                         '기타'}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClick(event)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      편집
                    </button>
                    <button
                      onClick={() => handleEventDelete(event.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 일정 추가 모달 */}
      {showAddModal && (
        <AddEventModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleEventAdd}
        />
      )}

      {/* 일정 편집 모달 */}
      {selectedEventForEdit && (
        <AddEventModal
          onClose={() => setSelectedEventForEdit(null)}
          onAdd={handleEventEdit}
          editData={selectedEventForEdit}
          isEdit={true}
        />
      )}

      {/* 당직 생성 모달 */}
      {showDutyModal && (
        <DutyScheduleModal
          onClose={() => setShowDutyModal(false)}
          onGenerate={handleDutyScheduleGenerate}
        />
      )}

      {/* 공유 모달 */}
      {showShareModal && (
        <ShareModal
          onClose={() => setShowShareModal(false)}
          scheduleData={scheduleData}
        />
      )}
    </div>
  );
};

export default Dashboard; 