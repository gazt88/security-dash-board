import { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import PdfPreview from '../../components/PdfPreview';
import DownloadButton from '../../components/DownloadButton';
import { supabase } from '../../utils/supabaseClient';
import { PDFDocument, rgb } from 'pdf-lib';

export default function ExportPdfPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [events, setEvents] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const fetchData = async (y, m) => {
    setLoading(true);
    const start = `${y}-${String(m).padStart(2, '0')}-01`;
    const end = new Date(y, m, 0).toISOString().slice(0, 10);
    const { data: eventData } = await supabase.from('events').select('*').gte('date', start).lte('date', end);
    const { data: holidayData } = await supabase.from('holidays').select('*').gte('date', start).lte('date', end);
    const { data: rosterData } = await supabase.from('roster').select('*').gte('date', start).lte('date', end);
    setEvents(eventData || []);
    setHolidays(holidayData || []);
    setRoster(rosterData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData(year, month);
  }, [year, month]);

  const handleDownload = async () => {
    setMsg('');
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4
    const fontSize = 12;
    let y = 800;
    page.drawText(`${year}년 ${month}월 근무 캘린더`, { x: 50, y, size: 18, color: rgb(0,0,0) });
    y -= 30;
    page.drawText('날짜        공휴일        이벤트        당직자', { x: 50, y, size: fontSize });
    y -= 20;
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const holiday = holidays.find(h => h.date === dateStr)?.name || '';
      const eventTitles = events.filter(ev => ev.date === dateStr).map(ev => ev.title).join(', ');
      const assignee = roster.find(r => r.date === dateStr)?.assignee_email || '';
      page.drawText(`${dateStr}   ${holiday}   ${eventTitles}   ${assignee}`, { x: 50, y, size: fontSize });
      y -= 18;
      if (y < 50) break; // 한 페이지에 다 못 들어가면 자름(간단 처리)
    }
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${year}-${String(month).padStart(2, '0')}-근무캘린더.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    // 로그 저장
    const user = supabase.auth.user();
    await supabase.from('pdfexportlog').insert({
      month: `${year}-${String(month).padStart(2, '0')}-01`,
      generated_by: user?.id || null,
      url: null // 실제 업로드 시 S3/Storage URL 기록
    });
    setMsg('다운로드 및 로그 저장 완료');
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">PDF 내보내기</h1>
        <div className="flex items-center space-x-4 mb-4">
          <label>연도
            <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="border rounded px-2 py-1 ml-2 w-20" />
          </label>
          <label>월
            <input type="number" value={month} min={1} max={12} onChange={e => setMonth(Number(e.target.value))} className="border rounded px-2 py-1 ml-2 w-12" />
          </label>
          <DownloadButton onClick={handleDownload} disabled={loading} />
        </div>
        {msg && <div className="mb-4 text-green-600">{msg}</div>}
        {loading ? (
          <div className="text-gray-500 py-8">로딩 중...</div>
        ) : (
          <PdfPreview year={year} month={month} events={events} holidays={holidays} roster={roster} />
        )}
      </div>
    </AppLayout>
  );
} 