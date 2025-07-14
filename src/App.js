import React, { useState, useEffect, useRef } from 'react';
import Dashboard from './components/Dashboard';
import { v4 as uuidv4 } from 'uuid';
import { getEvents } from './api/supabase';
import { supabase } from './utils/supabase';

function App() {
  const [scheduleData, setScheduleData] = useState([]);
  const [pendingData, setPendingData] = useState([]); // 임시 입력 데이터
  const pollingRef = useRef();

  // 일정 데이터 불러오기 (Supabase 직접 호출)
  const fetchSchedule = async () => {
    try {
      const { data, error } = await getEvents();
      if (error) throw error;
      setScheduleData(Array.isArray(data) ? data : []);
      setPendingData(Array.isArray(data) ? data : []); // 불러올 때 임시데이터도 동기화
    } catch (e) {
      // 에러 무시(네트워크 등)
    }
  };

  useEffect(() => {
    fetchSchedule();
    // 5초마다 폴링
    pollingRef.current = setInterval(fetchSchedule, 5000);
    return () => clearInterval(pollingRef.current);
  }, []);

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">환경설정 오류</h2>
          <p className="mb-2">Supabase 환경변수가 누락되어 앱을 실행할 수 없습니다.</p>
          <p className="text-gray-500">관리자에게 문의하거나 .env(.local)에 REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY를 정확히 입력하세요.</p>
        </div>
      </div>
    );
  }

  // 임시 상태에만 반영 (DB 저장 X)
  const handleScheduleUpdate = (newScheduleData) => {
    setPendingData(newScheduleData);
  };

  const handleAddEvent = (newEvent) => {
    setPendingData([...pendingData, newEvent]);
  };

  const handleEditEvent = (eventId, updatedEvent) => {
    setPendingData(pendingData.map(event =>
      event.id === eventId ? { ...event, ...updatedEvent } : event
    ));
  };

  const handleDeleteEvent = (eventId) => {
    setPendingData(pendingData.filter(event => event.id !== eventId));
  };

  // 'DB로 저장' 버튼 클릭 시 Supabase에 저장 (id 없으면 uuid 자동 부여)
  const handleSaveToDB = async () => {
    const dataToSave = pendingData.map(event =>
      event.id ? event : { ...event, id: uuidv4() }
    );
    setScheduleData(dataToSave);
    try {
      // 기존 데이터 삭제 후 새 데이터 삽입 (supabase.js에 맞게 구현 필요)
      // delete all events
      await import('./api/supabase').then(mod => mod.deleteAllEvents && mod.deleteAllEvents());
      // insert new events
      if (dataToSave.length > 0) {
        await import('./api/supabase').then(mod => mod.insertEvents && mod.insertEvents(dataToSave));
      }
      alert('DB 저장에 성공했습니다!');
    } catch (e) {
      alert('DB 저장 실패: ' + (e.message || '알 수 없는 오류'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            정보보안팀 일정관리
          </h1>
        </header>
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleSaveToDB}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
          >
            DB로 저장
          </button>
        </div>
        <Dashboard
          scheduleData={pendingData}
          onScheduleUpdate={handleScheduleUpdate}
          onAddEvent={handleAddEvent}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      </div>
    </div>
  );
}

export default App; 