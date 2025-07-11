import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';

function App() {
  const [scheduleData, setScheduleData] = useState([]);

  // URL에서 공유된 데이터 로드
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('data');
    
    if (sharedData) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(sharedData));
        setScheduleData(decodedData);
      } catch (error) {
        console.error('공유된 데이터를 불러오는 중 오류가 발생했습니다:', error);
      }
    } else {
      // 로컬 스토리지에서 데이터 로드
      const savedData = localStorage.getItem('scheduleData');
      if (savedData) {
        try {
          setScheduleData(JSON.parse(savedData));
        } catch (error) {
          console.error('저장된 데이터를 불러오는 중 오류가 발생했습니다:', error);
        }
      }
    }
  }, []);

  // 데이터 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
  }, [scheduleData]);

  const handleScheduleUpdate = (newData) => {
    setScheduleData(newData);
  };

  const handleAddEvent = (eventData) => {
    setScheduleData(prev => [...prev, eventData]);
  };

  const handleEditEvent = (eventId, updatedData) => {
    setScheduleData(prev => 
      prev.map(event => 
        event.id === eventId ? { ...event, ...updatedData } : event
      )
    );
  };

  const handleDeleteEvent = (eventId) => {
    setScheduleData(prev => prev.filter(event => event.id !== eventId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-dashboard mx-auto px-4 py-8">
        <Dashboard 
          scheduleData={scheduleData}
          onScheduleUpdate={handleScheduleUpdate}
          onAddEvent={handleAddEvent}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      </main>
    </div>
  );
}

export default App; 