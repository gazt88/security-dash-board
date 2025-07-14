import React, { useState } from 'react';

export function NaverAuthForm({ onSave }) {
  const [token, setToken] = useState('');
  function handleSubmit(e) {
    e.preventDefault();
    onSave(token);
  }
  return (
    <form className="flex gap-2 items-end mb-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-xs mb-1">네이버 Access Token</label>
        <input type="text" value={token} onChange={e => setToken(e.target.value)} className="border p-2 rounded w-64" />
      </div>
      <button type="submit" className="bg-primary-500 text-base-white px-4 py-2 rounded">저장</button>
    </form>
  );
} 