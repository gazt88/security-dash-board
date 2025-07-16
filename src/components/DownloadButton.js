import React from 'react';

const DownloadButton = ({ onClick, disabled }) => (
  <button
    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold shadow disabled:opacity-50"
    onClick={onClick}
    disabled={disabled}
  >
    PDF 다운로드
  </button>
);

export default DownloadButton; 