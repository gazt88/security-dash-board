import { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout';
import NotificationToggles from '../../components/NotificationToggles';
import { supabase } from '../../utils/supabaseClient';

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState({ notify_email: false, notify_slack: false });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const user = supabase.auth.user();
      if (!user) return;
      const { data } = await supabase.from('user_settings').select('*').eq('email', user.email).single();
      if (data) setSettings(data);
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleChange = async (next) => {
    setSettings(next);
    setMsg('');
    const user = supabase.auth.user();
    if (!user) return;
    const { error } = await supabase.from('user_settings').upsert({ ...next, email: user.email });
    if (error) setMsg('저장 실패');
    else setMsg('저장됨');
  };

  const handleTest = async () => {
    setMsg('');
    const user = supabase.auth.user();
    if (!user) return;
    const res = await fetch('/functions/send-notification', { method: 'POST', body: JSON.stringify({ email: user.email }) });
    if (res.ok) setMsg('알림 테스트 전송 성공');
    else setMsg('알림 테스트 실패');
  };

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">알림 설정</h1>
        {loading ? (
          <div className="text-gray-500 py-8">로딩 중...</div>
        ) : (
          <>
            <NotificationToggles settings={settings} onChange={handleChange} />
            <button onClick={handleTest} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold">알림 테스트</button>
          </>
        )}
        {msg && <div className="mt-4 text-green-600">{msg}</div>}
      </div>
    </AppLayout>
  );
} 