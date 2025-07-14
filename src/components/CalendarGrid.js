import React from 'react';

const days = ['일', '월', '화', '수', '목', '금', '토'];

export function CalendarGrid({ year, month, events, onDayClick }) {
  // month: 1~12
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const startDay = firstDay.getDay();
  const totalDays = lastDay.getDate();
  const weeks = [];
  let day = 1 - startDay;
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++, day++) {
      if (day < 1 || day > totalDays) {
        week.push(<td key={d} className="bg-neutral-800/10"></td>);
      } else {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = events.filter(e => e.date === dateStr);
        week.push(
          <td key={d} className="h-20 align-top p-1 border" onClick={() => onDayClick(dateStr)}>
            <div className="font-bold text-xs mb-1">{day}</div>
            {dayEvents.map(ev => (
              <div key={ev.id} className="text-xs bg-primary-500 text-base-white rounded px-1 mb-1 truncate">{ev.title}</div>
            ))}
          </td>
        );
      }
    }
    weeks.push(<tr key={w}>{week}</tr>);
  }
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>{days.map(d => <th key={d} className="py-2 text-xs font-bold text-neutral-800">{d}</th>)}</tr>
      </thead>
      <tbody>{weeks}</tbody>
    </table>
  );
} 