import React from 'react';
import { Pie } from 'react-chartjs-2';
import Link from 'next/link';

const statList = [
  { key: 'events', label: '전체 일정', color: 'bg-blue-500', text: 'text-white', href: '/calendar' },
  { key: 'roster', label: '당직자', color: 'bg-yellow-400', text: 'text-gray-900', href: '/roster' },
  { key: 'holidays', label: '공휴일', color: 'bg-gray-800', text: 'text-white', href: '/holidays' },
];

const DashboardStats = ({ stats, chartData }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {statList.map(stat => (
        <Link key={stat.key} href={stat.href} legacyBehavior passHref>
          <a
            className={`${stat.color} ${stat.text} rounded-xl p-6 shadow flex flex-col items-center cursor-pointer hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-400`}
            aria-label={`${stat.label} 상세로 이동`}
            role="button"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click(); }}
          >
            <div className="text-lg font-semibold mb-2">{stat.label}</div>
            <div className="text-3xl font-bold">{stats[stat.key] ?? 0}</div>
          </a>
        </Link>
      ))}
    </div>
    {chartData && (
      <div className="max-w-xs mx-auto mb-8">
        <Pie data={chartData} />
      </div>
    )}
  </>
);

export default DashboardStats; 