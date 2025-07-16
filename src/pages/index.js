import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AppLayout from '../components/AppLayout';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);
  return (
    <AppLayout>
      <div className="text-center text-gray-500 mt-20">대시보드로 이동 중...</div>
    </AppLayout>
  );
} 