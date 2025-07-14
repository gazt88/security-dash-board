import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PdfPreview = ({ calendarRef, fileName = '정보보안팀_일정.pdf' }) => {
  const handleDownload = async () => {
    if (!calendarRef.current) return;
    const calendarEl = calendarRef.current.getApi().el;
    const canvas = await html2canvas(calendarEl, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#fff',
    });
    const pdf = new jsPDF('l', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 5;
    let imgHeight = pageHeight - margin * 2;
    let imgWidth = imgHeight * (canvas.width / canvas.height);
    if (imgWidth > pageWidth - margin * 2) {
      imgWidth = pageWidth - margin * 2;
      imgHeight = imgWidth * (canvas.height / canvas.width);
    }
    const x = margin + (pageWidth - imgWidth) / 2;
    const y = margin + (pageHeight - imgHeight) / 2;
    const imgData = canvas.toDataURL('image/png', 1.0);
    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    pdf.save(fileName);
  };
  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
      aria-label="PDF 다운로드"
    >
      PDF 다운로드
    </button>
  );
};
export default PdfPreview; 