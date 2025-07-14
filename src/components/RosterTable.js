import React from 'react';

export function RosterTable({ shifts }) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="py-2 border">날짜</th>
          <th className="py-2 border">담당자</th>
          <th className="py-2 border">상태</th>
        </tr>
      </thead>
      <tbody>
        {shifts.map(shift => (
          <tr key={shift.id}>
            <td className="border px-2 py-1">{shift.shift_date}</td>
            <td className="border px-2 py-1">{shift.user_name}</td>
            <td className="border px-2 py-1">{shift.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
} 