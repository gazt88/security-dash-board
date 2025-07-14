import React, { useState, useRef, useEffect } from 'react';
import CalendarGrid from './CalendarGrid';
import StatusLegend from './StatusLegend';
import AddEventModal from './AddEventModal';
import ShareModal from './ShareModal';
import DutyScheduleModal from './DutyScheduleModal';
import PdfPreview from './PdfPreview';
import { Plus, Share2, Shield, Download } from 'lucide-react';
import {
  getEvents, addEvent, updateEvent, deleteEvent,
  getRoster, addRoster, updateRoster, deleteRoster,
  getHolidays, subscribeEvents, subscribeRoster, subscribeHolidays
} from '../api/supabase';
import { syncHolidaysWithNaver } from '../api/naverCalendar';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [roster, setRoster] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterBy, setFilterBy] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDutyModal, setShowDutyModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const calendarRef = useRef(null);
  const [isSyncingHolidays, setIsSyncingHolidays] = useState(false);

  // 데이터 fetch 및 실시간 구독
  useEffect(() => {
    getEvents().then(res => setEvents(res.data || []));
    getRoster().then(res => setRoster(res.data || []));
    getHolidays().then(res => setHolidays(res.data || []));
    const evSub = subscribeEvents(() => getEvents().then(res => setEvents(res.data || [])));
    const roSub = subscribeRoster(() => getRoster().then(res => setRoster(res.data || [])));
    const hoSub = subscribeHolidays(() => getHolidays().then(res => setHolidays(res.data || [])));
    return () => {
      evSub.unsubscribe && evSub.unsubscribe();
      roSub.unsubscribe && roSub.unsubscribe();
      hoSub.unsubscribe && hoSub.unsubscribe();
    };
  }, []);

  const handleDateClick = (dateInfo) => {
    setSelectedDate(dateInfo);
  };

  const handleCloseModal = () => {
    setSelectedDate(null);
    setEditEvent(null);
  };

  const handleAddClick = () => {
    setEditEvent(null);
    setShowAddModal(true);
  };

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  const handleDutyClick = () => {
    setShowDutyModal(true);
  };

  // PDF 내보내기 버튼 대신 PdfPreview 사용
  const handleExportPDF = async () => {
    if (calendarRef.current) {
      await calendarRef.current.exportToPDF();
    }
  };

  // 당직 자동 생성
  const handleDutyScheduleGenerate = async (dutyData) => {
    const { teamMembers, year, month, weekdays } = dutyData;
    // 해당 월 기존 당직 삭제
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    const toDelete = roster.filter(r => r.shift_date.startsWith(monthStr));
    for (const r of toDelete) await deleteRoster(r.id);
    // 새 당직 생성
    for (let i = 0; i < weekdays.length; i++) {
      const memberIndex = i % teamMembers.length;
      await addRoster({
        shift_date: weekdays[i].dateString,
        assignee_name: teamMembers[memberIndex],
        status: 'scheduled'
      });
    }
    setShowDutyModal(false);
  };

  // 일정 추가/수정/삭제
  const handleEventSave = async (data) => {
    if (editEvent) {
      await updateEvent(editEvent.id, data);
    } else {
      await addEvent(data);
    }
    setShowAddModal(false);
    setEditEvent(null);
  };
  const handleEventDelete = async (event) => {
    await deleteEvent(event.id);
    setSelectedDate(null);
    setEditEvent(null);
  };
  const handleEditClick = (event) => {
    setEditEvent(event);
    setShowAddModal(true);
  };

  // 필터링
  const filteredEvents = events.filter(event => {
    if (filterBy === 'all') return true;
    return event.type === filterBy;
  });

  // 공휴일 네이버 API 동기화
  const handleSyncHolidays = async () => {
    setIsSyncingHolidays(true);
    const year = new Date().getFullYear();
    await syncHolidaysWithNaver(year);
    await getHolidays().then(res => setHolidays(res.data || []));
    setIsSyncingHolidays(false);
    alert(`${year}년 공휴일 동기화 완료!`);
  };

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
          {/* PDF 내보내기 버튼 대신 PdfPreview 사용 */}
          <PdfPreview calendarRef={calendarRef} fileName="정보보안팀_일정.pdf" />
          <button
            onClick={handleSyncHolidays}
            disabled={isSyncingHolidays}
            className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-900 transition-colors"
          >
            {isSyncingHolidays ? '동기화 중...' : '공휴일 동기화'}
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
          roster={roster}
          holidays={holidays}
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
          onClose={() => { setShowAddModal(false); setEditEvent(null); }}
          onAdd={handleEventSave}
          onDelete={handleEventDelete}
          editData={editEvent}
          isEdit={!!editEvent}
        />
      )}
      {showShareModal && (
        <ShareModal
          onClose={() => setShowShareModal(false)}
          scheduleData={events}
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
                    <span className="font-medium">{event.title || event.name}</span>
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
                      onClick={() => handleEventDelete(event)}
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