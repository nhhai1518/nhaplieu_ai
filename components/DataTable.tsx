
import React from 'react';
import { EducationEntry } from '../types';

interface DataTableProps {
  entries: EducationEntry[];
}

export const DataTable: React.FC<DataTableProps> = ({ entries }) => {
  if (entries.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400">
        <i className="fas fa-folder-open text-5xl mb-4 opacity-20"></i>
        <p>Chưa có dữ liệu nào được thu thập</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-16">STT</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Họ và Tên</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Đơn vị</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Số điện thoại</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Thời gian</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {entries.map((entry, index) => (
            <tr key={entry.id} className="hover:bg-indigo-50/30 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-bold text-slate-900">{entry.fullName}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-600">
                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {entry.unit}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-600 flex items-center gap-2">
                  <i className="fas fa-mobile-alt text-slate-400"></i>
                  {entry.phoneNumber}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                {entry.timestamp}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
