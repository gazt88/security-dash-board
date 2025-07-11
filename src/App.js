import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';

function App() {
  const [scheduleData, setScheduleData] = useState(() => {
    // 로컬 스토리지에서 데이터 불러오기
    const savedData = localStorage.getItem('scheduleData');
    return savedData ? JSON.parse(savedData) : [];
  });

  // 데이터가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
  }, [scheduleData]);

  const handleScheduleUpdate = (newScheduleData) => {
    setScheduleData(newScheduleData);
  };

  const handleAddEvent = (newEvent) => {
    setScheduleData([...scheduleData, newEvent]);
  };

  const handleEditEvent = (eventId, updatedEvent) => {
    setScheduleData(scheduleData.map(event => 
      event.id === eventId ? { ...event, ...updatedEvent } : event
    ));
  };

  const handleDeleteEvent = (eventId) => {
    setScheduleData(scheduleData.filter(event => event.id !== eventId));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            정보보안팀 일정관리
          </h1>
        </header>
        
        <Dashboard
          scheduleData={scheduleData}
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