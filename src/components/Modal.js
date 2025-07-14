import React from 'react';

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" role="dialog" aria-modal="true">
      <div className="bg-base-white rounded-xl shadow-lg p-6 min-w-[320px] max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-primary-500">{title}</h3>
          <button onClick={onClose} className="text-neutral-800 hover:text-accent-red text-xl font-bold">×</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
} 