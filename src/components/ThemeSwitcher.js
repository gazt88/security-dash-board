import React, { useEffect, useState } from 'react';

const ThemeSwitcher = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (dark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-semibold ml-2"
      aria-label="다크모드 토글"
    >
      {dark ? '라이트 모드' : '다크 모드'}
    </button>
  );
};

export default ThemeSwitcher; 