import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-dashboard mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 및 타이틀 */}
          <div className="flex items-center space-x-4">
            <img 
              src="/images/로고_OK금융그룹_03.png" 
              alt="OK금융그룹 로고" 
              className="h-8 w-auto"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <h1 className="text-xl font-bold text-text-dark">
              정보보안팀 일정관리 대시보드
            </h1>
          </div>
          
          {/* 우측 정보 */}
          <div className="text-sm text-gray-600">
            클릭하여 일정을 추가하고 편집하세요
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 