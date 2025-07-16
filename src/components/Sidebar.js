import React, { useState } from 'react';
import Link from 'next/link';

const navItems = [
  { href: '/dashboard', label: '대시보드' },
  { href: '/calendar', label: '캘린더' },
  { href: '/roster', label: '로스터' },
  { href: '/export/pdf', label: 'PDF 내보내기' },
  { href: '/settings', label: '설정' },
];

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      {/* 오버레이(모바일) */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 sm:hidden transition-opacity ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden={!mobileOpen}
      />
      {/* 사이드바 */}
      <aside
        className={`sm:static fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col py-4 z-50 transition-transform duration-200 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}
        aria-label="메인 메뉴"
      >
        <nav className="flex-1 flex flex-col space-y-2 px-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} legacyBehavior>
              <a className="block py-2 px-3 rounded hover:bg-blue-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100 font-medium">
                {item.label}
              </a>
            </Link>
          ))}
        </nav>
        {/* 모바일에서 닫기 버튼 */}
        <button
          className="sm:hidden mt-4 mx-4 py-2 px-3 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-semibold"
          onClick={onClose}
          aria-label="사이드바 닫기"
        >
          닫기
        </button>
      </aside>
    </>
  );
} 