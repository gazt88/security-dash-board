import React, { useState } from 'react';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

const AppLayout = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Topbar onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout; 