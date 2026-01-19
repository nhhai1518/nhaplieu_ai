
import React, { useState, useEffect, useCallback } from 'react';
import { DataForm } from './components/DataForm';
import { DataTable } from './components/DataTable';
import { SettingsPanel } from './components/SettingsPanel';
import { EducationEntry, AppSettings } from './types';
import { validateAndFormatData } from './services/geminiService';

const App: React.FC = () => {
  const [entries, setEntries] = useState<EducationEntry[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    googleSheetUrl: '',
    webhookUrl: ''
  });
  const [view, setView] = useState<'form' | 'table' | 'settings'>('form');
  const [isSyncing, setIsSyncing] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Load initial data from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('edu_entries');
    const savedSettings = localStorage.getItem('edu_settings');
    if (savedEntries) setEntries(JSON.parse(savedEntries));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('edu_entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('edu_settings', JSON.stringify(settings));
  }, [settings]);

  const addEntry = async (entryData: Omit<EducationEntry, 'id' | 'order' | 'timestamp'>) => {
    const newEntry: EducationEntry = {
      ...entryData,
      id: crypto.randomUUID(),
      order: entries.length + 1,
      timestamp: new Date().toLocaleString('vi-VN')
    };

    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    showNotification('Đã thêm dữ liệu thành công!', 'success');

    // Automatically attempt sync if webhook is configured
    if (settings.webhookUrl) {
      syncToGoogleSheets(newEntry);
    }
  };

  const syncToGoogleSheets = async (entry: EducationEntry) => {
    if (!settings.webhookUrl) {
      showNotification('Vui lòng cấu hình URL Google Webhook trong phần cài đặt!', 'error');
      return;
    }

    setIsSyncing(true);
    try {
      // Simulate/Trigger a POST request to Google Apps Script Web App
      const response = await fetch(settings.webhookUrl, {
        method: 'POST',
        mode: 'no-cors', // standard for Apps Script web apps without CORS setup
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
      
      showNotification('Dữ liệu đã được đồng bộ lên Google Sheets!', 'success');
    } catch (error) {
      console.error('Sync error:', error);
      showNotification('Lỗi đồng bộ. Vui lòng kiểm tra lại URL App Script.', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const clearAllData = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ dữ liệu?')) {
      setEntries([]);
      showNotification('Đã xóa sạch dữ liệu.', 'success');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-indigo-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg">
              <i className="fas fa-graduation-cap text-indigo-700 text-2xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">PHÒNG GIÁO DỤC PHỔ THÔNG</h1>
              <p className="text-xs text-indigo-100 uppercase tracking-widest">Hệ thống Thu thập Dữ liệu</p>
            </div>
          </div>
          
          <nav className="flex bg-indigo-800/50 p-1 rounded-xl">
            <button 
              onClick={() => setView('form')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'form' ? 'bg-white text-indigo-700 shadow-sm' : 'hover:bg-indigo-600'}`}
            >
              <i className="fas fa-plus-circle mr-2"></i>Nhập liệu
            </button>
            <button 
              onClick={() => setView('table')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'table' ? 'bg-white text-indigo-700 shadow-sm' : 'hover:bg-indigo-600'}`}
            >
              <i className="fas fa-table mr-2"></i>Danh sách ({entries.length})
            </button>
            <button 
              onClick={() => setView('settings')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'settings' ? 'bg-white text-indigo-700 shadow-sm' : 'hover:bg-indigo-600'}`}
            >
              <i className="fas fa-cog mr-2"></i>Cài đặt
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-8">
        {notification && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-bounce shadow-md ${notification.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
            <i className={`fas ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          {view === 'form' && (
            <div className="p-6 md:p-10">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-slate-800">Thêm mới Thông tin</h2>
                <p className="text-slate-500">Vui lòng nhập đầy đủ các thông tin theo yêu cầu bên dưới</p>
              </div>
              <DataForm onSubmit={addEntry} />
            </div>
          )}

          {view === 'table' && (
            <div className="p-0">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Dữ liệu đã thu thập</h2>
                  <p className="text-sm text-slate-500">Tổng cộng {entries.length} bản ghi</p>
                </div>
                <div className="flex gap-2">
                   <button 
                    onClick={clearAllData}
                    className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                  >
                    <i className="fas fa-trash"></i>Xóa tất cả
                  </button>
                </div>
              </div>
              <DataTable entries={entries} />
            </div>
          )}

          {view === 'settings' && (
            <div className="p-6 md:p-10">
              <SettingsPanel settings={settings} onUpdate={setSettings} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-400 py-6 text-center text-sm">
        <div className="max-w-6xl mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} Phòng Giáo dục Phổ thông. Được phát triển với công nghệ AI.</p>
        </div>
      </footer>

      {/* Global Loading Overlay */}
      {isSyncing && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex flex-col items-center justify-center text-white">
          <div className="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-medium animate-pulse">Đang đồng bộ dữ liệu lên Google Sheets...</p>
        </div>
      )}
    </div>
  );
};

export default App;
