import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '../components/AppLayout';
import CalendarGrid from '../components/CalendarGrid';
import EventModal from '../components/EventModal';
import { supabase } from '../utils/supabaseClient';

function getMonthRange(year, month) {
  const start = `${year}-${String(month).padStart(2, '0')}-01`;
  const end = new Date(year, month, 0).toISOString().slice(0, 10);
  return { start, end };
}

function WeekView({ year, month, events, holidays, roster }) {
  // 임시: 1주차만 표시
  const weekDays = [1,2,3,4,5,6,7];
  return (
    <div className="border rounded-lg bg-white dark:bg-gray-800 p-4">
      <div className="font-bold mb-2">주간 뷰 (1주차 예시)</div>
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map(day => (
          <div key={day} className="border rounded min-h-[60px] p-1">
            <div className="text-xs font-bold">{year}-{String(month).padStart(2, '0')}-{String(day).padStart(2, '0')}</div>
            {/* 이벤트/공휴일/로스터 표시 생략 */}
          </div>
        ))}
      </div>
    </div>
  );
}

function DayView({ year, month, day, events, holidays, roster }) {
  return (
    <div className="border rounded-lg bg-white dark:bg-gray-800 p-4">
      <div className="font-bold mb-2">일간 뷰</div>
      <div>{year}-{String(month).padStart(2, '0')}-{String(day).padStart(2, '0')}</div>
      {/* 이벤트/공휴일/로스터 상세 표시 생략 */}
    </div>
  );
}

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1-indexed
  const [events, setEvents] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState('month');
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const fetchEvents = async (y, m) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { start, end } = getMonthRange(y, m);
      // 이벤트
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .gte('date', start)
        .lte('date', end);
      if (eventError) throw eventError;
      setEvents(eventData || []);
      // 공휴일
      const { data: holidayData, error: holidayError } = await supabase
        .from('holidays')
        .select('*')
        .gte('date', start)
        .lte('date', end);
      if (holidayError) throw holidayError;
      setHolidays(holidayData || []);
      // 로스터
      const { data: rosterData, error: rosterError } = await supabase
        .from('roster')
        .select('*')
        .gte('date', start)
        .lte('date', end);
      if (rosterError) throw rosterError;
      setRoster(rosterData || []);
    } catch (err) {
      setErrorMsg('이벤트/공휴일/로스터 데이터를 불러오는 중 오류가 발생했습니다.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents(year, month);
  }, [year, month]);

  useEffect(() => {
    const eventSub = supabase
      .channel('events-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
        setTimeout(() => fetchEvents(year, month), 500);
      })
      .subscribe();
    const rosterSub = supabase
      .channel('roster-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'roster' }, () => {
        setTimeout(() => fetchEvents(year, month), 500);
      })
      .subscribe();
    return () => {
      supabase.removeChannel(eventSub);
      supabase.removeChannel(rosterSub);
    };
  }, [year, month]);

  const prevMonth = () => {
    if (month === 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
  };
  const nextMonth = () => {
    if (month === 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleDateClick = (day) => {
    setSelectedDay(day);
    setView('day');
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    const ev = events.find(ev => ev.date === dateStr);
    setSelectedEvent(ev || null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedDate(null);
    setSelectedEvent(null);
  };

  const handleSave = async ({ title, description, date }) => {
    setLoading(true);
    try {
      if (selectedEvent) {
        // 수정
        const { error } = await supabase
          .from('events')
          .update({ title, description })
          .eq('id', selectedEvent.id);
        if (error) throw error;
      } else {
        // 추가
        const { error } = await supabase
          .from('events')
          .insert([{ title, description, date }]);
        if (error) throw error;
      }
      await fetchEvents(year, month);
    } catch (err) {
      setErrorMsg('이벤트 저장 중 오류가 발생했습니다.');
    }
    setLoading(false);
    handleModalClose();
  };

  const handleDelete = async (event) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', event.id);
      if (error) throw error;
      await fetchEvents(year, month);
    } catch (err) {
      setErrorMsg('이벤트 삭제 중 오류가 발생했습니다.');
    }
    setLoading(false);
    handleModalClose();
  };

  // 공휴일 맵 생성 (date: name)
  const holidayMap = {};
  holidays.forEach(item => {
    const d = new Date(item.date).getDate();
    holidayMap[d] = item.name;
  });
  // 로스터 맵 생성 (date: assignee_email)
  const rosterMap = {};
  roster.forEach(item => {
    const d = new Date(item.date).getDate();
    rosterMap[d] = item.assignee_email;
  });

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto mt-8">
        <div className="flex items-center justify-between mb-4">
          <Link href="/dashboard" legacyBehavior>
            <a className="text-blue-600 hover:underline font-semibold">← 대시보드로</a>
          </Link>
          <div className="flex items-center space-x-4">
            <button onClick={prevMonth} className="px-2 py-1 text-gray-500 hover:text-blue-600" aria-label="이전 달">◀</button>
            <h1 className="text-2xl font-bold">{year}년 {month}월</h1>
            <button onClick={nextMonth} className="px-2 py-1 text-gray-500 hover:text-blue-600" aria-label="다음 달">▶</button>
          </div>
          <div style={{ width: 80 }} />
        </div>
        <div className="flex space-x-2 mb-4">
          <button onClick={() => setView('month')} className={`px-3 py-1 rounded ${view==='month' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>월간</button>
          <button onClick={() => setView('week')} className={`px-3 py-1 rounded ${view==='week' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>주간</button>
          <button onClick={() => setView('day')} className={`px-3 py-1 rounded ${view==='day' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>일간</button>
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-500">로딩 중...</div>
        ) : errorMsg ? (
          <div className="text-center py-8 text-red-500">{errorMsg}</div>
        ) : (
          <>
            {view === 'month' && (
              <CalendarGrid
                year={year}
                month={month}
                events={events}
                onDateClick={handleDateClick}
                holidayMap={holidayMap}
                rosterMap={rosterMap}
              />
            )}
            {view === 'week' && (
              <WeekView year={year} month={month} events={events} holidays={holidays} roster={roster} />
            )}
            {view === 'day' && (
              <DayView year={year} month={month} day={selectedDay} events={events} holidays={holidays} roster={roster} />
            )}
          </>
        )}
      </div>
      <EventModal
        open={modalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
        onDelete={handleDelete}
        event={selectedEvent}
        date={selectedDate}
      />
    </AppLayout>
  );
} 