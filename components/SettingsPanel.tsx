
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
    alert('Đã lưu cấu hình hệ thống thành công!');
  };

  const scriptTemplate = `// ======================================================
// ĐOẠN MÃ MỚI - ĐÃ FIX LỖI "KHÔNG TÌM THẤY doGet"
// ======================================================

// Hàm này xử lý khi bạn nhấn trực tiếp vào link (Fix lỗi doGet)
function doGet(e) {
  var html = "<h3>Hệ thống đang hoạt động!</h3>" +
             "<p>Webhook này đã sẵn sàng nhận dữ liệu từ ứng dụng của bạn.</p>" +
             "<p style='color: green;'>Trạng thái: <b>Sẵn sàng</b></p>";
  return HtmlService.createHtmlOutput(html);
}

// Hàm này xử lý khi ứng dụng gửi dữ liệu lưu trữ lên
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0];
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date(),
      data.fullName,
      data.unit,
      data.phoneNumber
    ]);
    
    return ContentService.createTextOutput("Success")
      .setMimeType(ContentService.MimeType.TEXT);
  } catch(err) {
    return ContentService.createTextOutput("Error: " + err.message)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}`.trim();

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <i className="fas fa-link text-xl"></i>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Cấu hình Webhook</h3>
            <p className="text-slate-500 text-sm">Kết nối ứng dụng với Google Sheets của bạn</p>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-[2rem] border border-indigo-100 shadow-xl shadow-indigo-50/50 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">Webhook URL (Lấy từ Apps Script)</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                className="flex-grow px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all font-mono text-sm"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={localSettings.webhookUrl}
                onChange={e => setLocalSettings({ ...localSettings, webhookUrl: e.target.value })}
              />
              <button
                onClick={handleSave}
                className="px-10 py-4 bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl font-black transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 whitespace-nowrap active:scale-95"
              >
                <i className="fas fa-save"></i>
                LƯU CẤU HÌNH
              </button>
            </div>
          </div>
          
          <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
            <div className="w-10 h-10 bg-amber-500 text-white rounded-full flex-shrink-0 flex items-center justify-center shadow-lg shadow-amber-200">
              <i className="fas fa-tools"></i>
            </div>
            <div>
              <h4 className="font-bold text-amber-800 text-sm mb-1">Cách sửa lỗi "Không tìm thấy doGet"</h4>
              <p className="text-amber-700/80 text-xs leading-relaxed">
                Copy đoạn mã ở khung bên dưới, dán vào Apps Script, sau đó <b>Triển khai bản mới</b> (New Version). 
                Lỗi này chỉ xuất hiện khi bạn nhấn trực tiếp vào link Webhook, nó không ảnh hưởng đến việc lưu dữ liệu, nhưng nên sửa để dễ kiểm tra.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
            <span className="w-10 h-10 bg-slate-800 text-white rounded-xl flex items-center justify-center text-sm shadow-lg shadow-slate-200">1</span>
            Mã nguồn cập nhật
          </h3>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
              <pre className="bg-slate-900 text-indigo-300 p-8 rounded-[2rem] text-[11px] leading-relaxed overflow-x-auto h-[400px] border border-slate-800 shadow-2xl custom-scrollbar">
                {scriptTemplate}
              </pre>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(scriptTemplate);
                  const btn = document.getElementById('copy-btn');
                  if (btn) btn.innerHTML = '<i class="fas fa-check"></i> ĐÃ COPY';
                  setTimeout(() => {
                    if (btn) btn.innerHTML = '<i class="fas fa-copy"></i> SAO CHÉP MÃ';
                  }, 2000);
                }}
                id="copy-btn"
                className="absolute top-6 right-6 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-xl transition-all border border-indigo-400/30 flex items-center gap-2 text-xs font-black uppercase tracking-wider"
              >
                <i className="fas fa-copy"></i> SAO CHÉP MÃ
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
            <span className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-sm shadow-lg shadow-indigo-50">2</span>
            Các bước dán mã
          </h3>
          <div className="space-y-3">
            {[
              { text: "Nhấn nút 'SAO CHÉP MÃ' ở bên trái.", icon: "fa-copy" },
              { text: "Mở trang Google Apps Script của bạn.", icon: "fa-external-link-alt" },
              { text: "Xóa hết mã cũ và dán mã mới vừa copy vào.", icon: "fa-paste" },
              { text: "Nhấn biểu tượng Lưu (hình đĩa mềm).", icon: "fa-save" },
              { text: "Vào Triển khai > Quản lý bản triển khai.", icon: "fa-cog" },
              { text: "Chọn Sửa (bút chì) > Phiên bản: Mới.", icon: "fa-plus" },
              { text: "Nhấn Triển khai để hoàn tất.", icon: "fa-rocket" }
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 text-xs">
                  <i className={`fas ${step.icon}`}></i>
                </div>
                <span className="text-sm font-semibold text-slate-600">{step.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0f172a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  );
};
