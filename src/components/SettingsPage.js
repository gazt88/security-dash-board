import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const SettingsPage = () => {
  const [profile, setProfile] = useState({ email: '', name: '', role: '' });
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [notifySlack, setNotifySlack] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // 유저 정보 및 설정 fetch (예시)
    const fetchSettings = async () => {
      const user = supabase.auth.user();
      if (!user) return;
      setProfile({ email: user.email, name: user.user_metadata?.name || '', role: user.user_metadata?.role || '' });
      const { data } = await supabase.from('user_settings').select('*').eq('email', user.email).single();
      if (data) {
        setNotifyEmail(!!data.notify_email);
        setNotifySlack(!!data.notify_slack);
        setTheme(data.theme || 'light');
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    await supabase.from('user_settings').upsert({
      email: profile.email,
      notify_email: notifyEmail,
      notify_slack: notifySlack,
      theme
    });
    alert('설정이 저장되었습니다.');
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="max-w-xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-4">설정</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">이메일</label>
          <input type="email" value={profile.email} disabled className="w-full px-3 py-2 border rounded bg-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">이름</label>
          <input type="text" value={profile.name} disabled className="w-full px-3 py-2 border rounded bg-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">역할</label>
          <input type="text" value={profile.role} disabled className="w-full px-3 py-2 border rounded bg-gray-100" />
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="font-semibold">알림 설정</h3>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={notifyEmail} onChange={e => setNotifyEmail(e.target.checked)} />
          <span>이메일 알림</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={notifySlack} onChange={e => setNotifySlack(e.target.checked)} />
          <span>Slack 알림</span>
        </label>
      </div>
      <div className="space-y-4">
        <h3 className="font-semibold">테마</h3>
        <label className="flex items-center space-x-2">
          <input type="radio" name="theme" value="light" checked={theme === 'light'} onChange={() => setTheme('light')} />
          <span>라이트</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="radio" name="theme" value="dark" checked={theme === 'dark'} onChange={() => setTheme('dark')} />
          <span>다크</span>
        </label>
      </div>
      <button onClick={handleSave} className="mt-6 px-6 py-2 bg-primary text-white rounded hover:bg-primary-600">저장</button>
    </div>
  );
};

export default SettingsPage; 