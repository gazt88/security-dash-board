import { supabase } from '../api/supabase';

// 현재 사용자 정보 가져오기
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// 이메일 도메인 체크 (*@company.com)
export const checkEmailDomain = (email) => {
  return email && email.endsWith('@company.com');
};

// 권한 레벨 체크
export const checkPermission = (user, requiredRole = 'member') => {
  if (!user) return false;
  if (!checkEmailDomain(user.email)) return false;
  if (requiredRole === 'manager' && user.user_metadata?.role !== 'manager') return false;
  return true;
};

// 과거 30일 이전 일정 수정 권한 (관리자만)
export const canEditPastEvents = (user, eventDate) => {
  if (!user) return false;
  if (user.user_metadata?.role === 'manager') return true;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return new Date(eventDate) >= thirtyDaysAgo;
};

// 로그인 상태 체크
export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return !!user && checkEmailDomain(user.email);
};

// 로그아웃
export const logout = async () => {
  await supabase.auth.signOut();
}; 