import React, { useState, useRef } from 'react';
import CalendarGrid from './CalendarGrid';
import StatusLegend from './StatusLegend';
import AddEventModal from './AddEventModal';
import ShareModal from './ShareModal';
import DutyScheduleModal from './DutyScheduleModal';
import { Plus, Share2, Shield, Download } from 'lucide-react';

const Dashboard = ({ scheduleData, onScheduleUpdate, onAddEvent, onEditEvent, onDeleteEvent }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterBy, setFilterBy] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDutyModal, setShowDutyModal] = useState(false);
  const [selectedEventForEdit, setSelectedEventForEdit] = useState(null);
  const calendarRef = useRef(null);

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

  const handleExportPDF = async () => {
    if (calendarRef.current) {
      await calendarRef.current.exportToPDF();
    }
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
      {/* 상단 버튼 영역 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleAddClick}
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-red-600 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            일정 추가
          </button>
          
          <button
            onClick={handleDutyClick}
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            <Shield className="w-5 h-5 mr-2" />
            당직 생성
          </button>
          
          <button
            onClick={handleShareClick}
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <Share2 className="w-5 h-5 mr-2" />
            공유하기
          </button>

          <button
            onClick={handleExportPDF}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            PDF 내보내기
          </button>
        </div>

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

      {/* 캘린더 영역 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <CalendarGrid 
          ref={calendarRef}
          events={filteredEvents}
          onDateClick={handleDateClick}
        />
      </div>

      {/* 상태 범례 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <StatusLegend />
      </div>

      {/* 모달 */}
      {showAddModal && (
        <AddEventModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleEventAdd}
        />
      )}

      {showShareModal && (
        <ShareModal
          onClose={() => setShowShareModal(false)}
          scheduleData={scheduleData}
        />
      )}

      {showDutyModal && (
        <DutyScheduleModal
          onClose={() => setShowDutyModal(false)}
          onGenerate={handleDutyScheduleGenerate}
        />
      )}

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
                  <div>
                    <span className="font-medium">{event.name}</span>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClick(event)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleEventDelete(event.id)}
                      className="text-red-600 hover:text-red-800"
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
    </div>
  );
};

export default Dashboard; 