import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { supabase } from '../utils/supabaseClient';

export default function RosterPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [requests, setRequests] = useState([]);
  const [user, setUser] = useState(null);

  const fetchRoster = async (y, m) => {
    setLoading(true);
    const start = `${y}-${String(m).padStart(2, '0')}-01`;
    const end = new Date(y, m, 0).toISOString().slice(0, 10);
    const { data } = await supabase.from('roster').select('*').gte('date', start).lte('date', end);
    setRoster(data || []);
    setLoading(false);
  };

  const fetchRequests = async () => {
    const { data } = await supabase.from('roster_shift_requests').select('*').order('created_at', { ascending: false }).limit(10);
    setRequests(data || []);
  };

  useEffect(() => {
    fetchRoster(year, month);
    fetchRequests();
    setUser(supabase.auth.user());
  }, [year, month]);

  const handleAutoAssign = async () => {
    setMsg('');
    setLoading(true);
    const { data: users } = await supabase.from('user').select('*').order('rotation_order');
    if (!users || users.length === 0) {
      setMsg('팀원 정보 없음');
      setLoading(false);
      return;
    }
    const start = `${year}-${String(month).padStart(2, '0')}-01`;
    const end = new Date(year, month, 0).toISOString().slice(0, 10);
    const { data: holidays } = await supabase.from('holidays').select('date').gte('date', start).lte('date', end);
    const holidaySet = new Set((holidays || []).map(h => h.date));
    const daysInMonth = new Date(year, month, 0).getDate();
    let userIdx = 0;
    const shifts = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const d = new Date(date);
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      if (isWeekend || holidaySet.has(date)) continue;
      shifts.push({ date, assignee_email: users[userIdx % users.length].email });
      userIdx++;
    }
    await supabase.from('roster').delete().gte('date', start).lte('date', end);
    const { error } = await supabase.from('roster').insert(shifts);
    if (error) setMsg('자동 배정 실패');
    else setMsg('자동 배정 완료');
    await fetchRoster(year, month);
    setLoading(false);
  };

  const handleRequestShift = async (date) => {
    if (!user) return;
    const { error } = await supabase.from('roster_shift_requests').insert({
      date,
      requester: user.email,
      status: 'pending',
    });
    if (!error) setMsg('교대 요청 완료');
    else setMsg('요청 실패');
    await fetchRequests();
  };

  const handleApprove = async (id) => {
    await supabase.from('roster_shift_requests').update({ status: 'approved' }).eq('id', id);
    setMsg('승인 완료');
    await fetchRequests();
  };
  const handleReject = async (id) => {
    await supabase.from('roster_shift_requests').update({ status: 'rejected' }).eq('id', id);
    setMsg('거절 완료');
    await fetchRequests();
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">로스터(당직자) 관리</h1>
        <div className="flex items-center space-x-4 mb-4">
          <label>연도
            <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="border rounded px-2 py-1 ml-2 w-20" />
          </label>
          <label>월
            <input type="number" value={month} min={1} max={12} onChange={e => setMonth(Number(e.target.value))} className="border rounded px-2 py-1 ml-2 w-12" />
          </label>
          <button onClick={handleAutoAssign} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold">자동 배정</button>
        </div>
        {msg && <div className="mb-4 text-green-600">{msg}</div>}
        <div className="overflow-x-auto w-full mb-8">
          <table className="min-w-[500px] border text-xs mb-8">
            <thead>
              <tr>
                <th className="border px-2 py-1">날짜</th>
                <th className="border px-2 py-1">당직자</th>
                <th className="border px-2 py-1">교대 요청</th>
              </tr>
            </thead>
            <tbody>
              {roster.map(r => (
                <tr key={r.date}>
                  <td className="border px-2 py-1">{r.date}</td>
                  <td className="border px-2 py-1">{r.assignee_email}</td>
                  <td className="border px-2 py-1">
                    <button onClick={() => handleRequestShift(r.date)} className="bg-yellow-200 px-2 py-1 rounded text-xs">교대 요청</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2 className="text-lg font-bold mb-2">교대 요청 내역</h2>
        <div className="overflow-x-auto w-full">
          <table className="min-w-[500px] border text-xs">
            <thead>
              <tr>
                <th className="border px-2 py-1">날짜</th>
                <th className="border px-2 py-1">요청자</th>
                <th className="border px-2 py-1">상태</th>
                <th className="border px-2 py-1">승인/거절</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id}>
                  <td className="border px-2 py-1">{req.date}</td>
                  <td className="border px-2 py-1">{req.requester}</td>
                  <td className="border px-2 py-1">{req.status}</td>
                  <td className="border px-2 py-1 space-x-2">
                    <button onClick={() => handleApprove(req.id)} className="bg-green-200 px-2 py-1 rounded text-xs">승인</button>
                    <button onClick={() => handleReject(req.id)} className="bg-red-200 px-2 py-1 rounded text-xs">거절</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
} 