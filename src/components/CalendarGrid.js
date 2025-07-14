import React, { useRef, forwardRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getHolidayEvents, isHoliday } from '../utils/holidays';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// events, roster, holidays를 모두 props로 받아서 FullCalendar에 표시
const CalendarGrid = forwardRef(({ events, roster, holidays, onDateClick, isPrinting = false }, ref) => {
  const calendarRef = useRef(null);

  // 이벤트 데이터를 FullCalendar 형식으로 변환
  const formattedEvents = [
    ...(events || []).map(event => ({
      id: event.id,
      title: event.title,
      start: event.start_at || event.date,
      end: event.end_at || event.date,
      backgroundColor: '#60A5FA', // 기본 색상(회의 등)
      borderColor: '#60A5FA',
      textColor: 'white',
      extendedProps: { ...event, type: 'event' }
    })),
    ...(roster || []).map(shift => ({
      id: shift.id,
      title: `🛡️ ${shift.assignee_name || shift.user_id}`,
      start: shift.shift_date,
      backgroundColor: '#F97316',
      borderColor: '#F97316',
      textColor: 'white',
      extendedProps: { ...shift, type: 'duty' }
    })),
    ...(holidays || []).map(holiday => ({
      id: holiday.id,
      title: `🎌 ${holiday.name}`,
      start: holiday.date,
      backgroundColor: '#F87171',
      borderColor: '#F87171',
      textColor: 'white',
      extendedProps: { ...holiday, type: 'holiday' },
      display: 'background'
    }))
  ];

  // 휴일 이벤트 가져오기
  const holidayEvents = getHolidayEvents();

  // 모든 이벤트 합치기 (휴일 + 일반 이벤트)
  const allEvents = [...holidayEvents, ...formattedEvents];

  const handleDateClick = (info) => {
    if (isPrinting) return;
    const dateStr = info.dateStr;
    // 해당 날짜의 모든 이벤트/당직/공휴일 모아 전달
    const dateEvents = formattedEvents.filter(ev => ev.start === dateStr);
    onDateClick({ dateStr, events: dateEvents });
  };

  const handleEventClick = (info) => {
    if (isPrinting) return;
    const event = info.event;
    const dateStr = event.startStr.split('T')[0];
    // 해당 날짜의 모든 이벤트/당직/공휴일 모아 전달
    const dateEvents = formattedEvents.filter(ev => ev.start === dateStr);
    onDateClick({ dateStr, events: dateEvents });
  };

  // PDF 내보내기 함수
  const exportToPDF = async () => {
    // FullCalendar 인스턴스 참조
    const calendarApi = calendarRef.current.getApi();

    // 1) 기존 옵션 백업
    const originalAspectRatio = calendarApi.getOption('aspectRatio');

    // 2) PDF 출력 시 셀을 큼직하게 만들기 위해 aspectRatio를 0.6으로 임시 변경 (값이 작을수록 세로로 더 넓어짐)
    calendarApi.setOption('aspectRatio', 0.6);
    // 필요시 아래처럼 height도 강제로 지정 가능 (예: calendarApi.setOption('height', 700);)
    calendarApi.updateSize();

    // 3) 레이아웃이 반영될 시간을 조금 줌
    await new Promise((resolve) => setTimeout(resolve, 150));

    const calendarEl = calendarRef.current.getApi().el;
    const containerEl = calendarEl.closest('.calendar-container');

    // 프린팅 클래스 임시 추가
    containerEl.classList.add('printing');

    try {
      const canvas = await html2canvas(calendarEl, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      // A4 가로(Landscape) PDF 생성 – 반드시 가로로 출력
      const pdf = new jsPDF('l', 'mm', 'a4');
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 5; // 여백 최소화

      const availableWidth = pageWidth - margin * 2;
      const availableHeight = pageHeight - margin * 2;

      // 항상 페이지 높이에 맞추어 스케일 – 상·하를 꽉 채움
      let imgHeight = availableHeight;
      let imgWidth = imgHeight * (canvas.width / canvas.height);

      // 너비가 페이지를 초과하면 다시 조정
      if (imgWidth > availableWidth) {
        imgWidth = availableWidth;
        imgHeight = imgWidth * (canvas.height / canvas.width);
      }

      // 중앙 정렬 좌표
      const x = margin + (availableWidth - imgWidth) / 2;
      const y = margin + (availableHeight - imgHeight) / 2;
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      
      const today = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\./g, '').trim().replace(/ /g, '');
      
      pdf.save(`정보보안팀_일정_${today}.pdf`);
    } catch (error) {
      console.error('PDF 생성 중 오류 발생:', error);
      alert('PDF 생성에 실패했습니다. 콘솔 로그를 확인해주세요.');
    } finally {
      // 프린팅 클래스 제거
      containerEl.classList.remove('printing');

      // 4) 원래 옵션 복원
      calendarApi.setOption('aspectRatio', originalAspectRatio);
      calendarApi.updateSize();
    }
  };

  // 외부에서 PDF 내보내기 함수 접근 가능하도록 설정
  React.useImperativeHandle(ref, () => ({
    exportToPDF
  }));

  return (
    <div className={`calendar-container w-full ${isPrinting ? 'printing' : ''}`}>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        firstDay={0}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth'
        }}
        events={formattedEvents}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height={isPrinting ? 850 : 'auto'}
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
          const dayOfWeek = date.getDay();
          // 공휴일/주말 강조
          let classes = ['hover:bg-gray-50', 'cursor-pointer'];
          if (dayOfWeek === 0 || dayOfWeek === 6) {
            classes.push('text-red-600', 'bg-red-50');
          }
          if ((holidays || []).some(h => h.date === date.toISOString().slice(0, 10))) {
            classes.push('text-red-600', 'bg-red-50');
          }
          return classes;
        }}
        aspectRatio={isPrinting ? 1.4 : 1.8}
        eventOrder="start,title"
        eventOrderStrict={true}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
      />
    </div>
  );
});

export default CalendarGrid; 