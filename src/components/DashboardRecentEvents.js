import React from 'react';
import Link from 'next/link';

const DashboardRecentEvents = ({ events }) => (
  <Link href="/calendar" legacyBehavior passHref>
    <a
      className="block bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-400"
      aria-label="최근 일정 상세로 이동"
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click(); }}
    >
      <h2 className="text-xl font-bold mb-4">최근 일정</h2>
      {events.length === 0 ? (
        <div className="text-gray-500">일정이 없습니다.</div>
      ) : (
        <ul className="divide-y">
          {events.map(ev => (
            <li key={ev.id || ev.date} className="py-2 flex flex-col md:flex-row md:justify-between md:items-center">
              <span className="font-medium">{ev.title}</span>
              <span className="text-gray-500 text-sm">{ev.date?.slice(0, 10)}</span>
            </li>
          ))}
        </ul>
      )}
    </a>
  </Link>
);

export default DashboardRecentEvents; 