import React from 'react';

const PdfPreview = ({ year, month, events, holidays, roster }) => {
  // 날짜별 데이터 맵핑
  const daysInMonth = new Date(year, month, 0).getDate();
  const eventMap = {};
  events.forEach(ev => {
    const d = new Date(ev.date).getDate();
    if (!eventMap[d]) eventMap[d] = [];
    eventMap[d].push(ev);
  });
  const holidayMap = {};
  holidays.forEach(h => {
    const d = new Date(h.date).getDate();
    holidayMap[d] = h.name;
  });
  const rosterMap = {};
  roster.forEach(r => {
    const d = new Date(r.date).getDate();
    rosterMap[d] = r.assignee_email;
  });

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-[600px] border text-xs">
        <thead>
          <tr>
            <th className="border px-2 py-1">날짜</th>
            <th className="border px-2 py-1">공휴일</th>
            <th className="border px-2 py-1">이벤트</th>
            <th className="border px-2 py-1">당직자</th>
          </tr>
        </thead>
        <tbody>
          {Array(daysInMonth).fill(null).map((_, i) => {
            const day = i + 1;
            return (
              <tr key={day}>
                <td className="border px-2 py-1">{year}-{String(month).padStart(2, '0')}-{String(day).padStart(2, '0')}</td>
                <td className="border px-2 py-1 text-red-500">{holidayMap[day] || ''}</td>
                <td className="border px-2 py-1">{eventMap[day] ? eventMap[day].map(ev => ev.title).join(', ') : ''}</td>
                <td className="border px-2 py-1 text-yellow-700">{rosterMap[day] || ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PdfPreview; 