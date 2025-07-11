import React from 'react';

const StatusLegend = () => {
  const statusTypes = [
    { type: 'annual', label: '연차', color: 'bg-status-annual' },
    { type: 'half', label: '반차', color: 'bg-status-half' },
    { type: 'duty', label: '당직', color: 'bg-status-duty' },
    { type: 'meeting', label: '회의', color: 'bg-status-meeting' },
    { type: 'business', label: '외근/출장', color: 'bg-status-business' },
    { type: 'weekly', label: '주간간담회', color: 'bg-status-weekly' },
    { type: 'monthly', label: '월간간담회', color: 'bg-status-monthly' }
  ];

  return (
    <div className="flex flex-wrap gap-6">
      {statusTypes.map(({ type, label, color }) => (
        <div key={type} className="flex items-center space-x-2">
          <div className={`w-4 h-4 rounded-full ${color}`} />
          <span className="text-sm font-medium text-text-dark">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default StatusLegend; 