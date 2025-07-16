import React from 'react';

const NotificationToggles = ({ settings, onChange }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <span className="font-medium">이메일 알림</span>
      <input
        type="checkbox"
        checked={!!settings.notify_email}
        onChange={e => onChange({ ...settings, notify_email: e.target.checked })}
        className="w-5 h-5"
      />
    </div>
    <div className="flex items-center justify-between">
      <span className="font-medium">Slack 알림</span>
      <input
        type="checkbox"
        checked={!!settings.notify_slack}
        onChange={e => onChange({ ...settings, notify_slack: e.target.checked })}
        className="w-5 h-5"
      />
    </div>
  </div>
);

export default NotificationToggles; 