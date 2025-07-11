import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Download, Upload } from 'lucide-react';

const ShareModal = ({ onClose, scheduleData }) => {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [importData, setImportData] = useState('');

  useEffect(() => {
    if (scheduleData.length > 0) {
      const encodedData = encodeURIComponent(JSON.stringify(scheduleData));
      const url = `${window.location.origin}${window.location.pathname}?data=${encodedData}`;
      setShareUrl(url);
    }
  }, [scheduleData]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
      // 대체 방법
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadJson = () => {
    const dataStr = JSON.stringify(scheduleData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `일정표_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    try {
      const parsedData = JSON.parse(importData);
      if (Array.isArray(parsedData)) {
        const encodedData = encodeURIComponent(JSON.stringify(parsedData));
        const url = `${window.location.origin}${window.location.pathname}?data=${encodedData}`;
        window.location.href = url;
      } else {
        alert('올바른 JSON 형식이 아닙니다.');
      }
    } catch (error) {
      alert('JSON 파싱 오류: ' + error.message);
    }
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImportData(e.target.result);
      };
      reader.readAsText(file);
    } else {
      alert('JSON 파일만 선택할 수 있습니다.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-dark">
            일정 공유 및 가져오기
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* URL 공유 섹션 */}
          <div>
            <h4 className="text-md font-semibold text-text-dark mb-3 flex items-center">
              <Copy className="w-4 h-4 mr-2" />
              URL로 공유하기
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              현재 일정을 다른 사람과 공유할 수 있는 링크를 생성합니다.
            </p>
            
            {scheduleData.length === 0 ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  공유할 일정이 없습니다. 일정을 추가한 후 다시 시도해주세요.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className={`px-4 py-2 rounded-r-md transition-colors ${
                      copied
                        ? 'bg-green-600 text-white'
                        : 'bg-primary text-white hover:bg-red-600'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  이 링크를 복사하여 다른 사람과 공유하세요. 링크를 통해 접속하면 현재 일정을 볼 수 있습니다.
                </p>
              </div>
            )}
          </div>

          {/* JSON 내보내기 섹션 */}
          <div>
            <h4 className="text-md font-semibold text-text-dark mb-3 flex items-center">
              <Download className="w-4 h-4 mr-2" />
              JSON 파일로 내보내기
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              일정 데이터를 JSON 파일로 다운로드하여 백업하거나 다른 곳에서 사용할 수 있습니다.
            </p>
            
            <button
              onClick={handleDownloadJson}
              disabled={scheduleData.length === 0}
              className={`w-full px-4 py-2 rounded-md transition-colors ${
                scheduleData.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-accent-yellow text-white hover:bg-yellow-500'
              }`}
            >
              JSON 파일 다운로드
            </button>
          </div>

          {/* JSON 가져오기 섹션 */}
          <div>
            <h4 className="text-md font-semibold text-text-dark mb-3 flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              JSON 파일에서 가져오기
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              이전에 내보낸 JSON 파일을 업로드하여 일정을 가져올 수 있습니다.
            </p>
            
            <div className="space-y-3">
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                  id="json-file-input"
                />
                <label
                  htmlFor="json-file-input"
                  className="block w-full px-4 py-2 bg-gray-100 text-center rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  JSON 파일 선택
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  또는 JSON 데이터를 직접 입력:
                </label>
                <textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder='[{"name":"김보안","type":"annual","date":"2024-01-15"}]'
                />
              </div>
              
              <button
                onClick={handleImportData}
                disabled={!importData.trim()}
                className={`w-full px-4 py-2 rounded-md transition-colors ${
                  !importData.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-red-600'
                }`}
              >
                데이터 가져오기
              </button>
            </div>
          </div>

          {/* 주의사항 */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="text-sm font-semibold text-blue-800 mb-2">📋 사용법 안내</h5>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• URL 공유: 링크를 복사하여 다른 사람과 공유</li>
              <li>• JSON 내보내기: 데이터 백업 및 다른 시스템으로 이전</li>
              <li>• JSON 가져오기: 백업된 데이터를 복원 (현재 데이터를 덮어씀)</li>
              <li>• 공유된 링크는 URL 길이 제한이 있을 수 있습니다</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal; 