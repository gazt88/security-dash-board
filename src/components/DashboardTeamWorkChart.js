import React from 'react';
import { Bar } from 'react-chartjs-2';
import Link from 'next/link';

const DashboardTeamWorkChart = ({ teamWorkData }) => {
  if (!teamWorkData || teamWorkData.length === 0) return null;
  const data = {
    labels: teamWorkData.map(item => item.name),
    datasets: [
      {
        label: '근무 횟수',
        data: teamWorkData.map(item => item.count),
        backgroundColor: '#2563eb',
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: '팀원별 근무 분포' },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };
  return (
    <Link href="/roster" legacyBehavior passHref>
      <a
        className="block bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 cursor-pointer hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="팀원별 근무 분포 상세로 이동"
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click(); }}
      >
        <Bar data={data} options={options} />
      </a>
    </Link>
  );
};

export default DashboardTeamWorkChart; 