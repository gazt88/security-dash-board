import React from 'react';
import { Button } from './Button';

export function NaverSyncButton({ onSync, disabled }) {
  return (
    <Button onClick={onSync} disabled={disabled} variant="outline">네이버 캘린더로 전송</Button>
  );
} 