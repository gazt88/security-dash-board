import React, { useState } from 'react';

export function NotificationToggles({ settings, onChange }) {
  const [email, setEmail] = useState(settings?.notify_email || false);
  const [slack, setSlack] = useState(settings?.notify_slack || false);
  function handleChange(type, value) {
    if (type === 'email') { setEmail(value); onChange({ ...settings, notify_email: value }); }
    if (type === 'slack') { setSlack(value); onChange({ ...settings, notify_slack: value }); }
  }
  return (
    <div className="mb-4">
      <label className="flex items-center gap-2 mb-2">
        <input type="checkbox" checked={email} onChange={e => handleChange('email', e.target.checked)} /> 이메일 알림
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={slack} onChange={e => handleChange('slack', e.target.checked)} /> Slack 알림
      </label>
    </div>
  );
} 