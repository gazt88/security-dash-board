import React from 'react';
import AppLayout from '../components/AppLayout';
import DashboardPage from './index';
import CalendarPage from './calendar';
import DutySchedulePage from './roster';

export default function TestPage() {
  return (
    <AppLayout>
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-2">[대시보드 컴포넌트]</h2>
        <DashboardPage />
      </section>
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-2">[캘린더 컴포넌트]</h2>
        <CalendarPage />
      </section>
      <section>
        <h2 className="text-xl font-bold mb-2">[당직일정(로스터) 컴포넌트]</h2>
        <DutySchedulePage />
      </section>
    </AppLayout>
  );
} 