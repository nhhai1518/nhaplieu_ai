
import React, { useState, useEffect } from 'react';
import { DataForm } from './components/DataForm';
import { DataTable } from './components/DataTable';
import { SettingsPanel } from './components/SettingsPanel';
import { EducationEntry, AppSettings } from './types';

const App: React.FC = () => {
  const [entries, setEntries] = useState<EducationEntry[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    googleSheetUrl: '',
    webhookUrl: ''
  });
  const [view, setView] = useState<'form' | 'table' | 'settings'>('form');
  const [isSyncing, setIsSyncing] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    const savedEntries = localStorage.getItem('edu_data_v2');
    const savedSettings = localStorage.getItem('edu_settings_v2');
    if (savedEntries) setEntries(JSON.parse(savedEntries));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  useEffect(() => {
    localStorage.setItem('edu_data_v2', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('edu_settings_v2', JSON.stringify(settings));
  }, [settings]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const addEntry = async (entryData: Omit<EducationEntry, 'id' | 'order' | 'timestamp'>) => {
    // Sử dụng self.crypto.randomUUID() chuẩn của trình duyệt
    const newEntry: EducationEntry = {
      ...entryData,
      id: self.crypto.randomUUID(),
      order: entries.length + 1,
      timestamp: new Date().toLocaleString('vi-VN')
    };

    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    showNotification('Đã thêm thông tin thành công!', 'success');

    if (settings.webhookUrl) {
      await syncToGoogleSheets(newEntry);
    }
  };

  const syncToGoogleSheets = async (entry: EducationEntry) => {
    setIsSyncing(true);
    try {
      // Dùng fetch với mode no-cors là bắt buộc cho Google Apps Script Web App khi không cấu hình CORS phức tạp
      await fetch(settings.webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
      showNotification('Đã đồng bộ lên Google Sheets!', 'success');
    } catch (error) {
      console.error('Sync error:', error);
      showNotification('Lỗi đồng bộ. Vui lòng kiểm tra lại cấu hình Webhook.', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col antialiased">
      <header className="bg-indigo-700 text-white shadow-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView('form')}>
            <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-md border border-white/20">
              <i className="fas fa-university text-2xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight leading-none">PHÒNG GIÁO DỤC</h1>
              <p className="text-[10px] text-indigo-200 uppercase tracking-[0.2em] font-medium mt-1">Dữ liệu phổ thông trực tuyến</p>
            </div>
          </div>
          
          <nav className="flex bg-indigo-900/40 p-1.5 rounded-2xl border border-white/10 backdrop-blur-sm">
            {[
              { id: 'form', icon: 'fa-plus-circle', label: 'Nhập liệu' },
              { id: 'table', icon: 'fa-list-ul', label: `Danh sách (${entries.length})` },
              { id: 'settings', icon: 'fa-sliders-h', label: 'Cấu hình' }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setView(item.id as any)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${view === item.id ? 'bg-white text-indigo-700 shadow-lg scale-105' : 'hover:bg-white/10 text-indigo-100'}`}
              >
                <i className={`fas ${item.icon}`}></i>
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto w-full px-6 py-10">
        {notification && (
          <div className={`fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-slide-up border ${notification.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
              <i className={`fas ${notification.type === 'success' ? 'fa-check' : 'fa-times'}`}></i>
            </div>
            <div>
              <p className="font-bold text-sm">Thông báo hệ thống</p>
              <p className="text-xs opacity-80">{notification.message}</p>
            </div>
          </div>
        )}

        <div className="glass-morphism rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[500px]">
          {view === 'form' && (
            <div className="p-8 md:p-14">
              <div className="mb-12 text-center max-w-md mx-auto">
                <h2 className="text-3xl font-black text-slate-800 mb-2">Thông Tin Mới</h2>
                <p className="text-slate-500 text-sm">Hệ thống sẽ tự động đồng bộ hóa dữ liệu lên Google Sheets sau khi bạn lưu thành công.</p>
              </div>
              <DataForm onSubmit={addEntry} />
            </div>
          )}

          {view === 'table' && (
            <div className="p-0">
              <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Kho Dữ Liệu</h2>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">Đã ghi nhận {entries.length} hồ sơ</p>
                </div>
                <div className="flex gap-3">
                   <button 
                    onClick={() => { if(confirm('Xóa hết dữ liệu?')) setEntries([]); }}
                    className="px-6 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-rose-100"
                  >
                    <i className="fas fa-trash-alt"></i>XÓA TOÀN BỘ
                  </button>
                </div>
              </div>
              <DataTable entries={entries} />
            </div>
          )}

          {view === 'settings' && (
            <div className="p-8 md:p-14">
              <SettingsPanel settings={settings} onUpdate={setSettings} />
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 text-center">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
          <p>© 2025 PHÒNG GIÁO DỤC PHỔ THÔNG</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>HỆ THỐNG TRỰC TUYẾN</span>
            <span>PHIÊN BẢN 2.0.1</span>
          </div>
        </div>
      </footer>

      {isSyncing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex flex-col items-center justify-center text-white p-6">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-white/20 border-t-indigo-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <i className="fas fa-cloud-upload-alt text-xl animate-bounce"></i>
            </div>
          </div>
          <h3 className="mt-8 text-xl font-bold">Đang đồng bộ dữ liệu...</h3>
          <p className="mt-2 text-indigo-200 text-sm max-w-xs text-center">Vui lòng không đóng trình duyệt trong khi quá trình đang diễn ra.</p>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
