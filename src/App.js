import React, { useState, useEffect, useRef } from 'react';
import Dashboard from './components/Dashboard';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [scheduleData, setScheduleData] = useState([]);
  const [pendingData, setPendingData] = useState([]); // 임시 입력 데이터
  const pollingRef = useRef();

  // 일정 데이터 불러오기 (API)
  const fetchSchedule = async () => {
    try {
      const res = await fetch('/api/schedule');
      const data = await res.json();
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
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: dataToSave })
      });
      if (res.ok) {
        alert('DB 저장에 성공했습니다!');
      } else {
        const err = await res.json();
        alert('DB 저장 실패: ' + (err.error || '알 수 없는 오류'));
      }
    } catch (e) {
      alert('DB 저장 중 네트워크 오류가 발생했습니다.');
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