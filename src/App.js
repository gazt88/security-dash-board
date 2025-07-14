import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CalendarPage from './pages/CalendarPage';
import RosterPage from './pages/RosterPage';
import ExportPdfPage from './pages/ExportPdfPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';

function Topbar() {
  return (
    <header className="w-full h-14 flex items-center px-6 bg-neutral-800 text-base-white shadow">
      <span className="font-bold text-lg">OK금융그룹 InfoSec 대시보드</span>
      <span className="ml-auto">User</span>
    </header>
  );
}

function Sidebar() {
  return (
    <nav className="w-48 min-h-screen bg-primary-500 text-base-white flex flex-col py-6 px-2">
      <a href="/calendar" className="mb-4 font-semibold hover:text-accent-yellow">캘린더</a>
      <a href="/roster" className="mb-4 font-semibold hover:text-accent-yellow">로스터</a>
      <a href="/export/pdf" className="mb-4 font-semibold hover:text-accent-yellow">PDF 내보내기</a>
      <a href="/settings" className="font-semibold hover:text-accent-yellow">설정</a>
    </nav>
  );
}

function PageContainer({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-base-white">{children}</main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Topbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <PageContainer>
              <Routes>
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/roster" element={<RosterPage />} />
                <Route path="/export/pdf" element={<ExportPdfPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/calendar" replace />} />
              </Routes>
            </PageContainer>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
