import React from 'react';

function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-white">
      <h2 className="text-xl font-bold mb-4">로그인</h2>
      {/* 이메일 입력/매직링크 등 구현 예정 */}
      <form className="w-full max-w-xs bg-white p-6 rounded shadow">
        <input type="email" className="w-full border p-2 rounded mb-4" placeholder="@company.com 이메일" />
        <button type="submit" className="w-full bg-primary-500 text-base-white py-2 rounded font-semibold">로그인</button>
      </form>
    </div>
  );
}

export default LoginPage; 