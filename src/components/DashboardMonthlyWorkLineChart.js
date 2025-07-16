import React from 'react';
import { Line } from 'react-chartjs-2';
import Link from 'next/link';

const DashboardMonthlyWorkLineChart = ({ monthlyData }) => {
  if (!monthlyData || monthlyData.length === 0) return null;
  const data = {
    labels: monthlyData.map(item => item.month),
    datasets: [
      {
        label: '근무',
        data: monthlyData.map(item => item.work),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: '휴가',
        data: monthlyData.map(item => item.vacation),
        borderColor: '#fbbf24',
        backgroundColor: 'rgba(251,191,36,0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '월별 근무/휴가 추이' },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };
  return (
    <Link href="/calendar" legacyBehavior passHref>
      <a
        className="block bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 cursor-pointer hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="월별 근무/휴가 추이 상세로 이동"
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click(); }}
      >
        <Line data={data} options={options} />
      </a>
    </Link>
  );
};

export default DashboardMonthlyWorkLineChart; 