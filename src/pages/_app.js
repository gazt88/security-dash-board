import '../styles/global.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    const publicPages = ['/login'];
    const user = supabase.auth.user();
    if (!user && !publicPages.includes(router.pathname)) {
      router.replace('/login');
    }
  }, [router.pathname]);
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp; 