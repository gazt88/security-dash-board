import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getHolidayEvents, isHoliday } from '../utils/holidays';

const CalendarGrid = ({ events, onDateClick }) => {
  const calendarRef = useRef(null);

  // 이벤트 데이터를 FullCalendar 형식으로 변환
  const formattedEvents = events.map(event => ({
    title: event.type === 'duty' ? `🛡️ ${event.name}` : `${event.name} (${getTypeLabel(event.type)})`,
    start: event.date,
    backgroundColor: getTypeColor(event.type),
    borderColor: getTypeColor(event.type),
    textColor: 'white',
    order: event.type === 'duty' ? 0 : 1, // 당직을 맨 앞에 표시
    extendedProps: {
      name: event.name,
      type: event.type,
      originalEvent: event
    }
  }));

  // 휴일 이벤트 가져오기
  const holidayEvents = getHolidayEvents();

  // 모든 이벤트 합치기 (휴일 + 일반 이벤트)
  const allEvents = [...holidayEvents, ...formattedEvents];

  function getTypeLabel(type) {
    switch (type) {
      case 'annual': return '연차';
      case 'half': return '반차';
      case 'duty': return '당직';
      case 'meeting': return '회의';
      case 'business': return '외근/출장';
      case 'weekly': return '주간간담회';
      case 'monthly': return '월간간담회';
      default: return '';
    }
  }

  function getTypeColor(type) {
    switch (type) {
      case 'annual': return '#F87171';
      case 'half': return '#FACC15';
      case 'duty': return '#F97316';
      case 'meeting': return '#60A5FA';
      case 'business': return '#A855F7';
      case 'weekly': return '#9333EA';
      case 'monthly': return '#0891B2';
      default: return '#6B7280';
    }
  }

  const handleDateClick = (info) => {
    const dateStr = info.dateStr;
    const dateEvents = events.filter(event => 
      event.date === dateStr || 
      (event.startDate && event.endDate && 
       new Date(dateStr) >= new Date(event.startDate) && 
       new Date(dateStr) <= new Date(event.endDate))
    );

    if (dateEvents.length > 0) {
      onDateClick({
        dateStr,
        events: dateEvents
      });
    }
  };

  const handleEventClick = (info) => {
    const event = info.event;
    const dateStr = event.startStr.split('T')[0];
    const dateEvents = events.filter(e => e.date === dateStr);
    
    onDateClick({
      dateStr,
      events: dateEvents
    });
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        firstDay={1}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth'
        }}
        events={allEvents}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="auto"
        locale="ko"
        buttonText={{
          today: '오늘',
          month: '월',
          week: '주',
          day: '일'
        }}
        dayHeaderFormat={{
          weekday: 'short'
        }}
        eventDisplay="block"
        eventMaxStack={3}
        moreLinkText="더보기"
        dayMaxEvents={3}
        eventClassNames="cursor-pointer"
        dayCellClassNames={(arg) => {
          const date = arg.date;
          const holiday = isHoliday(date);
          const dayOfWeek = date.getDay();
          const isWeekendDay = dayOfWeek === 0 || dayOfWeek === 6;
          
          let classes = ['hover:bg-gray-50', 'cursor-pointer'];
          
          if (holiday) {
            classes.push('holiday-cell');
          }
          
          if (isWeekendDay) {
            classes.push('weekend-cell');
          }
          
          return classes.join(' ');
        }}
        aspectRatio={1.8}
        eventOrder="order,start,title"
        eventOrderStrict={true}
      />
    </div>
  );
};

export default CalendarGrid; 