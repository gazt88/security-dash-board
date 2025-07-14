import React, { useState, useEffect } from 'react';
import { RosterTable } from '../components/RosterTable';
import { RosterWizard } from '../components/RosterWizard';
import { fetchRoster, generateRoster, subscribeRoster } from '../api/roster';
import { fetchHolidays } from '../api/holidays';
import { useGlobal } from '../components/GlobalContext';
import { supabase } from '../utils/supabase';

function getThisMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

async function fetchUsers() {
  const { data, error } = await supabase.from('user').select('id, name, rotation_order').order('rotation_order');
  if (error) throw error;
  return data;
}

function RosterPage() {
  const { user } = useGlobal();
  const [month, setMonth] = useState(getThisMonth());
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    fetchRoster(month).then(setShifts);
    const sub = subscribeRoster(() => fetchRoster(month).then(setShifts));
    return () => { sub.unsubscribe && sub.unsubscribe(); };
  }, [month]);

  async function handleGenerate(m) {
    const [users, holidays] = await Promise.all([
      fetchUsers(),
      fetchHolidays(Number(m.slice(0, 4)), Number(m.slice(5, 7)))
    ]);
    const holidayDates = holidays.map(h => h.date);
    await generateRoster(m, users, holidayDates);
    alert('로스터 자동생성 완료!');
  }

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">당직 로스터</h2>
      <RosterWizard onGenerate={handleGenerate} />
      <RosterTable shifts={shifts} />
    </div>
  );
}

export default RosterPage; 