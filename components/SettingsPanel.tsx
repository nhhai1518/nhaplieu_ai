
import React, { useState } from 'react';
import { AppSettings } from '../types';

interface SettingsPanelProps {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdate }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onUpdate(localSettings);
    alert('Đã lưu cài đặt hệ thống!');
  };

  const scriptTemplate = `
function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];
  var data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(),
    data.fullName,
    data.unit,
    data.phoneNumber
  ]);
  
  return ContentService.createTextOutput("Success");
}
  `.trim();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <i className="fas fa-link text-indigo-500"></i>
          Kết nối Google Sheets
        </h3>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Webhook URL (Google Apps Script)</label>
          <input
            type="url"
            className="block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            placeholder="https://script.google.com/macros/s/.../exec"
            value={localSettings.webhookUrl}
            onChange={e => setLocalSettings({ ...localSettings, webhookUrl: e.target.value })}
          />
          <p className="text-xs text-slate-500">Đây là URL của Web App tạo từ Google Apps Script để nhận dữ liệu.</p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-bold transition-all shadow-md"
        >
          Lưu Cài đặt
        </button>
      </div>

      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
        <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
          <i className="fas fa-book-open text-amber-500"></i>
          Hướng dẫn kết nối Google Sheets
        </h3>
        <ol className="text-sm text-slate-600 space-y-3 list-decimal list-inside">
          <li>Mở một Google Sheet mới.</li>
          <li>Chọn <strong>Tiện ích mở rộng</strong> &gt; <strong>Apps Script</strong>.</li>
          <li>Dán đoạn mã phía dưới vào trình soạn thảo.</li>
          <li>Nhấn <strong>Triển khai</strong> &gt; <strong>Tùy chọn triển khai mới</strong>.</li>
          <li>Chọn loại là <strong>Ứng dụng web</strong>.</li>
          <li>Cấu hình: <i>Người có quyền truy cập</i> chọn <strong>Bất kỳ ai (Anyone)</strong>.</li>
          <li>Sao chép URL nhận được và dán vào ô Webhook URL phía trên.</li>
        </ol>

        <div className="mt-4">
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Mã nguồn Apps Script (Mẫu)</label>
          <pre className="bg-slate-800 text-slate-200 p-4 rounded-xl text-xs overflow-x-auto">
            {scriptTemplate}
          </pre>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(scriptTemplate);
              alert('Đã copy mã nguồn!');
            }}
            className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <i className="fas fa-copy"></i> Sao chép mã
          </button>
        </div>
      </div>
    </div>
  );
};
