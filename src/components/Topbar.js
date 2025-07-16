import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';

const Topbar = ({ onMenuClick }) => {
  return (
    <header className="h-14 flex items-center justify-between px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* 햄버거 버튼(모바일) */}
      <button
        className="sm:hidden mr-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={onMenuClick}
        aria-label="메뉴 열기"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 dark:text-gray-200"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
      </button>
      <div className="font-bold text-lg text-blue-600">OK금융 InfoSec</div>
      <div className="text-gray-700 dark:text-gray-200 text-base font-semibold">대시보드</div>
      <div className="flex items-center space-x-4">
        {/* 추후: 알림, 프로필 등 */}
        <span className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 inline-block" />
        <ThemeSwitcher />
      </div>
    </header>
  );
};

export default Topbar; 