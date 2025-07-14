import React, { useState } from 'react';

export function ProfileForm({ user, onSave }) {
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  function handleSubmit(e) {
    e.preventDefault();
    onSave({ name });
  }
  return (
    <form className="mb-4" onSubmit={handleSubmit}>
      <div className="mb-2">
        <label className="block text-xs mb-1">이름</label>
        <input className="border p-2 rounded w-64" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className="mb-2">
        <label className="block text-xs mb-1">이메일</label>
        <input className="border p-2 rounded w-64 bg-neutral-800/10" value={email} disabled />
      </div>
      <button type="submit" className="bg-primary-500 text-base-white px-4 py-2 rounded">저장</button>
    </form>
  );
} 