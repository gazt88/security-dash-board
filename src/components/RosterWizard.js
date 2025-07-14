import React, { useState } from 'react';
import { Button } from './Button';

export function RosterWizard({ onGenerate }) {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  function handleSubmit(e) {
    e.preventDefault();
    onGenerate(month);
  }

  return (
    <form className="flex gap-2 items-end mb-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-xs mb-1">월 선택</label>
        <input type="month" value={month} onChange={e => setMonth(e.target.value)} className="border p-2 rounded" />
      </div>
      <Button type="submit">로스터 자동 생성</Button>
    </form>
  );
} 