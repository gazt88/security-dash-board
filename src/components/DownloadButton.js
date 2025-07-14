import React from 'react';
import { Button } from './Button';

export function DownloadButton({ onDownload, disabled }) {
  return (
    <Button onClick={onDownload} disabled={disabled} className="mt-4">PDF 다운로드</Button>
  );
} 