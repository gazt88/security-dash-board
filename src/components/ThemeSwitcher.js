import React, { useState } from 'react';

export function ThemeSwitcher() {
  const [dark, setDark] = useState(false);
  function toggleTheme() {
    setDark(d => {
      document.documentElement.classList.toggle('dark', !d);
      return !d;
    });
  }
  return (
    <button type="button" onClick={toggleTheme} className="px-4 py-2 rounded bg-neutral-800 text-base-white">
      {dark ? '라이트 모드' : '다크 모드'}
    </button>
  );
} 