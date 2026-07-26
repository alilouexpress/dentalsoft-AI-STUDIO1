import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { History, Filter, Search } from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditLogs, t } = useApp();
  const [filterAction, setFilterAction] = useState('all');

  const filteredLogs = auditLogs.filter((log) => {
    if (filterAction === 'all') return true;
    return log.action === filterAction;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('audit')}</h1>
          <p className="text-xs font-semibold text-slate-500">
            Journal de traçabilité et d'audit des actions utilisateurs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="py-2 px-3 text-xs font-bold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 text-slate-700 shadow-sm cursor-pointer"
          >
            <option value="all">Toutes les actions</option>
            <option value="created">Créations (created)</option>
            <option value="updated">Modifications (updated)</option>
            <option value="deleted">Suppressions (deleted)</option>
            <option value="image_uploaded">Photos / X-Ray (uploaded)</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">HORODATAGE</th>
                <th className="p-4">UTILISATEUR</th>
                <th className="p-4">ACTION</th>
                <th className="p-4">TYPE D'ENTITÉ</th>
                <th className="p-4">DÉTAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-sky-50/50 transition-colors">
                  <td className="p-4 text-slate-500 font-mono">{log.timestamp}</td>
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-500"></span> {log.user}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        log.action === 'created'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.action === 'deleted'
                          ? 'bg-rose-100 text-rose-800'
                          : log.action === 'image_uploaded'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 font-semibold">{log.entityType}</td>
                  <td className="p-4 font-bold text-slate-800">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
