import React, { useState, useEffect } from 'react';

const EventModal = ({ open, onClose, onSave, onDelete, event, date }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setDescription(event.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [event, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">{event ? '이벤트 수정' : '이벤트 추가'}</h2>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">제목</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="이벤트 제목"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">설명</label>
          <textarea
            className="w-full border rounded px-2 py-1"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="이벤트 설명"
          />
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          {event && (
            <button
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              onClick={() => onDelete && onDelete(event)}
            >
              삭제
            </button>
          )}
          <button
            className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            onClick={() => onSave && onSave({ title, description, date })}
            disabled={!title.trim()}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal; 