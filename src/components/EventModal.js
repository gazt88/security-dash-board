import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

export function EventModal({ open, onClose, onSave, onDelete, initial }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [desc, setDesc] = useState(initial?.description || '');

  function handleSave() {
    onSave({ ...initial, title, description: desc });
  }

  function handleDelete() {
    if (onDelete) onDelete(initial);
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? '이벤트 수정' : '이벤트 추가'}>
      <div className="mb-4">
        <input
          className="w-full border p-2 rounded mb-2"
          placeholder="제목"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          className="w-full border p-2 rounded"
          placeholder="상세 설명"
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />
      </div>
      <div className="flex gap-2 justify-end">
        {initial && <Button variant="danger" onClick={handleDelete}>삭제</Button>}
        <Button onClick={handleSave}>{initial ? '수정' : '추가'}</Button>
      </div>
    </Modal>
  );
} 