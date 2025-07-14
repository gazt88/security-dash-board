import React from 'react';

export function PdfPreview({ events, roster }) {
  return (
    <div className="border rounded bg-base-white p-4 min-h-[300px]">
      <div className="text-neutral-800 mb-2">PDF 미리보기 (샘플)</div>
      <div className="text-xs">이벤트 수: {events?.length || 0}, 로스터 수: {roster?.length || 0}</div>
      {/* 실제 PDF 렌더링은 추후 구현 */}
    </div>
  );
} 