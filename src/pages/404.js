import AppLayout from '../components/AppLayout';

export default function NotFoundPage() {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-lg text-gray-500 mb-6">페이지를 찾을 수 없습니다.</p>
        <a href="/dashboard" className="text-blue-600 hover:underline font-semibold">대시보드로 돌아가기</a>
      </div>
    </AppLayout>
  );
} 