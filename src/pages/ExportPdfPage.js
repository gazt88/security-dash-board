import React, { useState, useEffect } from 'react';
import { PdfPreview } from '../components/PdfPreview';
import { DownloadButton } from '../components/DownloadButton';
import { fetchEvents } from '../api/events';
import { fetchRoster } from '../api/roster';

function getThisMonth() {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

function ExportPdfPage() {
  const [{ year, month }] = useState(getThisMonth());
  const [events, setEvents] = useState([]);
  const [roster, setRoster] = useState([]);

  useEffect(() => {
    fetchEvents(year, month).then(setEvents);
    fetchRoster(`${year}-${String(month).padStart(2, '0')}`).then(setRoster);
  }, [year, month]);

  function handleDownload() {
    // 실제 PDF 변환/다운로드는 추후 구현
    alert('PDF 다운로드 기능은 추후 구현 예정');
  }

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">PDF 내보내기</h2>
      <PdfPreview events={events} roster={roster} />
      <DownloadButton onDownload={handleDownload} />
    </div>
  );
}

export default ExportPdfPage; 