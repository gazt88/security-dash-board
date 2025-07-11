import React, { useRef, forwardRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getHolidayEvents, isHoliday } from '../utils/holidays';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CalendarGrid = forwardRef(({ events, onDateClick, isPrinting = false }, ref) => {
  const calendarRef = useRef(null);

  // 이벤트 데이터를 FullCalendar 형식으로 변환
  const formattedEvents = events.map(event => ({
    title: event.type === 'duty' ? `🛡️ ${event.name}` : `${event.name} (${getTypeLabel(event.type)})`,
    start: event.date,
    backgroundColor: getTypeColor(event.type),
    borderColor: getTypeColor(event.type),
    textColor: 'white',
    order: event.type === 'duty' ? 0 : 1,
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
    if (isPrinting) return;
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
    if (isPrinting) return;
    const event = info.event;
    const dateStr = event.startStr.split('T')[0];
    const dateEvents = events.filter(e => e.date === dateStr);
    
    onDateClick({
      dateStr,
      events: dateEvents
    });
  };

  // PDF 내보내기 함수
  const exportToPDF = async () => {
    const calendarElement = calendarRef.current.elRef.current;
    
    // 캘린더의 현재 크기 저장
    const originalWidth = calendarElement.style.width;
    const originalHeight = calendarElement.style.height;
    const originalStyle = calendarElement.getAttribute('style');
    
    try {
      // PDF 출력을 위한 스타일 설정
      calendarElement.style.width = '1200px';
      calendarElement.style.height = '850px';
      calendarElement.style.margin = '0';
      calendarElement.style.padding = '0';
      calendarElement.style.overflow = 'hidden';
      
      // 캘린더 컨테이너에 프린팅 클래스 추가
      calendarElement.closest('.calendar-container').classList.add('printing');
      
      // html2canvas 옵션
      const canvas = await html2canvas(calendarElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: 1200,
        windowHeight: 850,
        foreignObjectRendering: true,
        removeContainer: false,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('.fc');
          if (clonedElement) {
            clonedElement.style.width = '1200px';
            clonedElement.style.height = '850px';
          }
        }
      });
      
      // A4 가로 방향 PDF 생성
      const pdf = new jsPDF('l', 'mm', 'a4');
      
      // A4 크기 및 여백 설정 (mm)
      const pageWidth = 297;
      const pageHeight = 210;
      const margin = 20;
      
      // 여백을 제외한 실제 이미지 크기 계산
      const availableWidth = pageWidth - (margin * 2);
      const availableHeight = pageHeight - (margin * 2);
      
      // 이미지 비율 계산
      const imageRatio = canvas.height / canvas.width;
      const pageRatio = availableHeight / availableWidth;
      
      let imgWidth, imgHeight;
      
      if (imageRatio > pageRatio) {
        // 높이에 맞춤
        imgHeight = availableHeight;
        imgWidth = (canvas.width * imgHeight) / canvas.height;
      } else {
        // 너비에 맞춤
        imgWidth = availableWidth;
        imgHeight = (canvas.height * imgWidth) / canvas.width;
      }
      
      // 중앙 정렬을 위한 X, Y 좌표 계산
      const x = margin + (availableWidth - imgWidth) / 2;
      const y = margin + (availableHeight - imgHeight) / 2;
      
      // 캔버스를 이미지로 변환하여 PDF에 추가
      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      
      // PDF 저장
      const today = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\./g, '').trim().replace(/ /g, '');
      
      pdf.save(`정보보안팀_일정_${today}.pdf`);
    } catch (error) {
      console.error('PDF 생성 중 오류 발생:', error);
    } finally {
      // 원래 스타일로 복원
      if (originalStyle) {
        calendarElement.setAttribute('style', originalStyle);
      } else {
        calendarElement.style.width = originalWidth;
        calendarElement.style.height = originalHeight;
      }
      
      // 프린팅 클래스 제거
      calendarElement.closest('.calendar-container').classList.remove('printing');
    }
  };

  // 외부에서 PDF 내보내기 함수 접근 가능하도록 설정
  React.useImperativeHandle(ref, () => ({
    exportToPDF
  }));

  return (
    <div className={`calendar-container ${isPrinting ? 'printing' : ''}`}>
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
        events={allEvents}
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
          const holiday = isHoliday(date);
          
          let classes = ['hover:bg-gray-50', 'cursor-pointer'];
          
          if (dayOfWeek === 0 || dayOfWeek === 6) {
            classes.push('weekend-cell');
          }
          
          if (holiday) {
            classes.push('holiday-cell');
          }
          
          return classes;
        }}
        aspectRatio={isPrinting ? 1.4 : 1.8}
        eventOrder="order,start,title"
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