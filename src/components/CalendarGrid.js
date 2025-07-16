import React from 'react';

const daysKo = ['일', '월', '화', '수', '목', '금', '토'];

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

const CalendarGrid = ({ year, month, events = [], onDateClick, holidayMap = {}, rosterMap = {} }) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = new Date(year, month - 1, 1).getDay();
  const eventMap = {};
  events.forEach(ev => {
    const d = new Date(ev.date).getDate();
    if (!eventMap[d]) eventMap[d] = [];
    eventMap[d].push(ev);
  });

  return (
    <div className="overflow-x-auto w-full">
      <div className="grid grid-cols-7 gap-2 text-center text-gray-600 mb-2 min-w-[350px]">
        {daysKo.map(d => <div key={d} className="font-semibold">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-2 min-h-[420px] min-w-[350px]">
        {Array(firstDay).fill(null).map((_, i) => <div key={i}></div>)}
        {Array(daysInMonth).fill(null).map((_, i) => {
          const day = i + 1;
          return (
            <div
              key={day}
              className="border rounded min-h-[60px] p-1 bg-gray-50 hover:bg-blue-50 cursor-pointer flex flex-col"
              onClick={() => onDateClick && onDateClick(day)}
            >
              <div className="text-xs font-bold text-gray-700 mb-1">{day}</div>
              {holidayMap[day] && (
                <div className="text-xs text-red-500 mb-1 font-semibold">{holidayMap[day]}</div>
              )}
              {eventMap[day] && eventMap[day].map((ev, idx) => (
                <div key={idx} className="bg-blue-100 text-blue-800 rounded px-1 py-0.5 text-xs mb-1 truncate" title={ev.title}>
                  {ev.title}
                </div>
              ))}
              {rosterMap[day] && (
                <div className="mt-auto text-xs bg-yellow-200 text-yellow-900 rounded px-1 py-0.5 font-semibold inline-block">
                  당직: {rosterMap[day]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid; 