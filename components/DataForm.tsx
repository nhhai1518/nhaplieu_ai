
import React, { useState } from 'react';
import { validateAndFormatData } from '../services/geminiService';

interface DataFormProps {
  onSubmit: (data: { fullName: string; unit: string; phoneNumber: string }) => void;
}

export const DataForm: React.FC<DataFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    unit: '',
    phoneNumber: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{ isValid: boolean; suggestions: string[] } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.unit || !formData.phoneNumber) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    onSubmit(formData);
    setFormData({ fullName: '', unit: '', phoneNumber: '' });
    setAnalysis(null);
  };

  const handleSmartCheck = async () => {
    if (!formData.fullName && !formData.phoneNumber) return;
    
    setIsAnalyzing(true);
    const result = await validateAndFormatData(formData.fullName, formData.unit, formData.phoneNumber);
    setAnalysis(result);
    if (result.normalizedName) {
      setFormData(prev => ({ ...prev, fullName: result.normalizedName }));
    }
    setIsAnalyzing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700">Họ và Tên</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <i className="fas fa-user"></i>
            </span>
            <input
              type="text"
              required
              className="block w-full pl-10 pr-3 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Nguyễn Văn A"
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Đơn vị (Trường/Phòng)</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <i className="fas fa-school"></i>
            </span>
            <input
              type="text"
              required
              className="block w-full pl-10 pr-3 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Trường THPT Chuyên..."
              value={formData.unit}
              onChange={e => setFormData({ ...formData, unit: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Số điện thoại</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <i className="fas fa-phone"></i>
            </span>
            <input
              type="tel"
              required
              className="block w-full pl-10 pr-3 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="0912 345 678"
              value={formData.phoneNumber}
              onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          type="button"
          onClick={handleSmartCheck}
          disabled={isAnalyzing}
          className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-slate-200"
        >
          {isAnalyzing ? (
            <><i className="fas fa-circle-notch animate-spin"></i>Đang kiểm tra...</>
          ) : (
            <><i className="fas fa-magic text-indigo-500"></i>Kiểm tra thông minh</>
          )}
        </button>

        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
        >
          <i className="fas fa-save"></i>Lưu và Đồng bộ
        </button>
      </div>

      {analysis && (
        <div className={`mt-4 p-4 rounded-xl border ${analysis.isValid ? 'bg-indigo-50 border-indigo-100' : 'bg-amber-50 border-amber-100'}`}>
          <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
            <i className={`fas ${analysis.isValid ? 'fa-info-circle text-indigo-500' : 'fa-exclamation-triangle text-amber-500'}`}></i>
            Nhận xét từ AI Assistant:
          </h4>
          <ul className="text-sm space-y-1">
            {analysis.suggestions.map((s, i) => (
              <li key={i} className="text-slate-600">• {s}</li>
            ))}
            {analysis.suggestions.length === 0 && (
              <li className="text-emerald-600">Dữ liệu có vẻ rất tốt!</li>
            )}
          </ul>
        </div>
      )}
    </form>
  );
};
