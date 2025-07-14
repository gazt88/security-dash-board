import React, { useState } from 'react';
import { useGlobal } from '../components/GlobalContext';
import { ProfileForm } from '../components/ProfileForm';
import { NotificationToggles } from '../components/NotificationToggles';
import { ThemeSwitcher } from '../components/ThemeSwitcher';

function SettingsPage() {
  const { user } = useGlobal();
  const [profile, setProfile] = useState(user);
  const [notify, setNotify] = useState({ notify_email: false, notify_slack: false });

  function handleProfileSave(data) {
    setProfile(p => ({ ...p, ...data }));
    alert('프로필 저장(샘플)');
  }
  function handleNotifyChange(data) {
    setNotify(data);
    alert('알림 설정 저장(샘플)');
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">설정</h2>
      <ProfileForm user={profile} onSave={handleProfileSave} />
      <NotificationToggles settings={notify} onChange={handleNotifyChange} />
      <div className="mt-6">
        <ThemeSwitcher />
      </div>
    </div>
  );
}

export default SettingsPage; 