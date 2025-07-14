import React, { useState, useEffect } from 'react';
import { CalendarGrid } from '../components/CalendarGrid';
import { EventModal } from '../components/EventModal';
import { fetchEvents, addEvent, updateEvent, deleteEvent, subscribeEvents } from '../api/events';
import { useGlobal } from '../components/GlobalContext';
import { NaverAuthForm } from '../components/NaverAuthForm';
import { NaverSyncButton } from '../components/NaverSyncButton';
import { addNaverSchedule } from '../api/naver';

function getTodayYM() {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

function CalendarPage() {
  const { user } = useGlobal();
  const [{ year, month }, setYM] = useState(getTodayYM());
  const [events, setEvents] = useState([]);
  const [modal, setModal] = useState({ open: false, date: null, event: null });
  const [naverToken, setNaverToken] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents(year, month).then(setEvents);
    const sub = subscribeEvents(() => fetchEvents(year, month).then(setEvents));
    return () => { sub.unsubscribe && sub.unsubscribe(); };
  }, [year, month]);

  function handleDayClick(date) {
    setModal({ open: true, date, event: null });
  }
  function handleEventClick(event) {
    setModal({ open: true, date: event.date, event });
    setSelectedEvent(event);
  }
  async function handleSave(ev) {
    if (ev.id) {
      await updateEvent(ev.id, ev);
    } else {
      await addEvent({ ...ev, date: modal.date, created_by: user?.id });
    }
    setModal({ open: false, date: null, event: null });
  }
  async function handleDelete(ev) {
    await deleteEvent(ev.id);
    setModal({ open: false, date: null, event: null });
  }
  async function handleNaverSync() {
    if (!naverToken || !selectedEvent) return alert('토큰과 이벤트를 선택하세요');
    // iCal 변환 샘플 (실제 변환 로직 필요)
    const ical = `BEGIN:VCALENDAR\nSUMMARY:${selectedEvent.title}\nDESCRIPTION:${selectedEvent.description || ''}\nEND:VCALENDAR`;
    try {
      await addNaverSchedule(naverToken, ical);
      alert('네이버 캘린더 전송 성공!');
    } catch (e) {
      alert('네이버 캘린더 전송 실패: ' + e.message);
    }
  }

  // 날짜별로 events를 변환
  const dayEvents = events.map(ev => ({ ...ev, date: ev.start_at?.slice(0, 10) }));

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">월간 캘린더</h2>
      <div className="mb-4 flex gap-2">
        <button onClick={() => setYM(y => ({ year: y.month === 1 ? y.year - 1 : y.year, month: y.month === 1 ? 12 : y.month - 1 }))}>&lt;</button>
        <span>{year}년 {month}월</span>
        <button onClick={() => setYM(y => ({ year: y.month === 12 ? y.year + 1 : y.year, month: y.month === 12 ? 1 : y.month + 1 }))}>&gt;</button>
      </div>
      <NaverAuthForm onSave={setNaverToken} />
      <NaverSyncButton onSync={handleNaverSync} disabled={!naverToken || !selectedEvent} />
      <CalendarGrid year={year} month={month} events={dayEvents} onDayClick={handleDayClick} />
      <EventModal
        open={modal.open}
        onClose={() => setModal({ open: false, date: null, event: null })}
        onSave={handleSave}
        onDelete={modal.event ? handleDelete : undefined}
        initial={modal.event}
      />
    </div>
  );
}

export default CalendarPage; 