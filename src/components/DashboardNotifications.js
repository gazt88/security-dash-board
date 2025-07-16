import React from 'react';
import Link from 'next/link';

const DashboardNotifications = ({ notifications }) => (
  <Link href="/notifications" legacyBehavior passHref>
    <a
      className="block bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-8 cursor-pointer hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-400"
      aria-label="최근 알림/이벤트 로그 상세로 이동"
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click(); }}
    >
      <h2 className="text-xl font-bold mb-4">최근 알림/이벤트 로그</h2>
      {notifications.length === 0 ? (
        <div className="text-gray-500">알림이 없습니다.</div>
      ) : (
        <ul className="divide-y">
          {notifications.map((n, i) => (
            <li key={i} className="py-2 flex flex-col md:flex-row md:justify-between md:items-center">
              <span className="font-medium">{n.message}</span>
              <span className="text-gray-500 text-sm">{n.created_at?.slice(0, 19).replace('T', ' ')}</span>
            </li>
          ))}
        </ul>
      )}
    </a>
  </Link>
);

export default DashboardNotifications; 