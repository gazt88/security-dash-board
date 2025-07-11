import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AddEventModal = ({ onClose, onAdd, editData, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'annual',
    date: '',
    description: ''
  });

  useEffect(() => {
    if (isEdit && editData) {
      setFormData({
        name: editData.name || '',
        type: editData.type || 'annual',
        date: editData.date || '',
        description: editData.description || ''
      });
    }
  }, [isEdit, editData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date) {
      alert('이름과 날짜를 입력해주세요.');
      return;
    }

    onAdd(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const typeOptions = [
    { value: 'annual', label: '연차', color: 'bg-status-annual' },
    { value: 'half', label: '반차', color: 'bg-status-half' },
    { value: 'duty', label: '당직', color: 'bg-status-duty' },
    { value: 'meeting', label: '회의', color: 'bg-status-meeting' },
    { value: 'business', label: '외근/출장', color: 'bg-status-business' },
    { value: 'weekly', label: '주간간담회', color: 'bg-status-weekly' },
    { value: 'monthly', label: '월간간담회', color: 'bg-status-monthly' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-dark">
            {isEdit ? '일정 편집' : '새 일정 추가'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이름 입력 */}
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">
              이름 *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="예: 김보안, 팀 회의"
              required
            />
          </div>

          {/* 일정 유형 선택 */}
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">
              일정 유형 *
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {typeOptions.map(option => (
                <label
                  key={option.value}
                  className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                    formData.type === option.value
                      ? 'border-primary bg-red-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={option.value}
                    checked={formData.type === option.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-3 h-3 rounded-full ${option.color} mr-2`} />
                  <span className="text-sm font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 날짜 선택 */}
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">
              날짜 *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              required
            />
          </div>

          {/* 설명 입력 */}
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">
              설명 (선택사항)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="추가 설명이나 메모를 입력하세요"
            />
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-red-600 transition-colors"
            >
              {isEdit ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal; 