import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import DashboardStats from '../components/DashboardStats';
import DashboardRecentEvents from '../components/DashboardRecentEvents';
import DashboardNotifications from '../components/DashboardNotifications';
import DashboardTeamWorkChart from '../components/DashboardTeamWorkChart';
import DashboardMonthlyWorkLineChart from '../components/DashboardMonthlyWorkLineChart';
import { supabase } from '../utils/supabaseClient';

export default function DashboardPage() {
  const [stats, setStats] = useState({ events: 0, roster: 0, holidays: 0 });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('member');
  const [chartData, setChartData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [teamWorkData, setTeamWorkData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const u = supabase.auth.user();
      setUser(u);
      if (u) {
        const { data } = await supabase.from('user').select('role').eq('email', u.email).single();
        setRole(data?.role || 'member');
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        let events = [];
        if (role === 'manager') {
          const { count: eventCnt } = await supabase.from('events').select('*', { count: 'exact', head: true });
          const { count: rosterCnt } = await supabase.from('roster').select('*', { count: 'exact', head: true });
          const { count: holidayCnt } = await supabase.from('holidays').select('*', { count: 'exact', head: true });
          const { data: recent } = await supabase.from('events').select('*').order('start', { ascending: false }).limit(5);
          setStats({ events: eventCnt || 0, roster: rosterCnt || 0, holidays: holidayCnt || 0 });
          setRecentEvents(recent || []);
          const { data: allEvents } = await supabase.from('events').select('*');
          events = allEvents || [];
          // 팀원별 근무 분포 fetch
          const { data: team } = await supabase.from('user').select('id, name, email');
          const teamWork = [];
          for (const member of team || []) {
            const { count } = await supabase.from('events').select('*', { count: 'exact', head: true }).eq('created_by', member.id).like('title', '%근무%');
            teamWork.push({ name: member.name || member.email, count: count || 0 });
          }
          setTeamWorkData(teamWork);
          // 월별 근무/휴가 추이 fetch (최근 6개월)
          const now = new Date();
          const months = Array.from({ length: 6 }, (_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          });
          const monthly = [];
          for (const m of months) {
            const { count: work } = await supabase.from('events').select('*', { count: 'exact', head: true }).like('title', '%근무%').gte('start', `${m}-01`).lt('start', `${m}-32`);
            const { count: vacation } = await supabase.from('events').select('*', { count: 'exact', head: true }).like('title', '%휴가%').gte('start', `${m}-01`).lt('start', `${m}-32`);
            monthly.push({ month: m, work: work || 0, vacation: vacation || 0 });
          }
          setMonthlyData(monthly);
        } else if (user) {
          const { count: eventCnt } = await supabase.from('events').select('*', { count: 'exact', head: true }).eq('created_by', user.id);
          const { count: rosterCnt } = await supabase.from('roster').select('*', { count: 'exact', head: true }).eq('assignee_email', user.email);
          const { count: holidayCnt } = await supabase.from('holidays').select('*', { count: 'exact', head: true });
          const { data: recent } = await supabase.from('events').select('*').eq('created_by', user.id).order('start', { ascending: false }).limit(5);
          setStats({ events: eventCnt || 0, roster: rosterCnt || 0, holidays: holidayCnt || 0 });
          setRecentEvents(recent || []);
          const { data: myEvents } = await supabase.from('events').select('*').eq('created_by', user.id);
          events = myEvents || [];
        }
        // Pie 차트 데이터 생성
        const work = events.filter(e => e.title?.includes('근무')).length;
        const vacation = events.filter(e => e.title?.includes('휴가')).length;
        const other = events.length - work - vacation;
        setChartData({
          labels: ['근무', '휴가', '기타'],
          datasets: [{
            data: [work, vacation, other],
            backgroundColor: ['#2563eb', '#fbbf24', '#6b7280'],
          }],
        });
        // 알림/이벤트 로그 fetch
        const { data: noti } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(5);
        setNotifications(noti || []);
      } catch (err) {
        setErrorMsg('대시보드 데이터를 불러오는 중 오류가 발생했습니다.');
      }
      setLoading(false);
    };
    fetchData();
  }, [role, user]);

  return (
    <AppLayout>
      <section className="max-w-4xl mx-auto mt-8 overflow-x-auto w-full min-w-[350px]">
        <h1 className="text-2xl font-bold mb-6">OK금융그룹 보안팀 대시보드</h1>
        {loading ? (
          <div className="text-gray-500 py-8">로딩 중...</div>
        ) : errorMsg ? (
          <div className="text-red-500 py-8">{errorMsg}</div>
        ) : (
          <>
            <DashboardStats stats={stats} chartData={chartData} />
            {role === 'manager' && <DashboardTeamWorkChart teamWorkData={teamWorkData} />}
            {role === 'manager' && <DashboardMonthlyWorkLineChart monthlyData={monthlyData} />}
            <DashboardRecentEvents events={recentEvents} />
            <DashboardNotifications notifications={notifications} />
            {role === 'manager' ? (
              <div className="mt-8 text-blue-700 font-semibold">관리자: 전체 팀 현황을 보고 있습니다.</div>
            ) : (
              <div className="mt-8 text-green-700 font-semibold">개인: 본인 일정/근무만 강조 표시 중입니다.</div>
            )}
          </>
        )}
      </section>
    </AppLayout>
  );
} 