import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreditCard, Bell, AlertTriangle, CheckCircle, Send, Check } from 'lucide-react';

export const DebtsView: React.FC = () => {
  const { debts, t } = useApp();
  const [notifSent, setNotifSent] = useState(false);

  const totalDebtors = debts.length;
  const overdueDebtors = debts.filter((d) => d.status === 'En retard').length;
  const totalBalanceDue = debts.reduce((acc, d) => acc + d.balanceDue, 0);

  const handleSendNotifications = () => {
    setNotifSent(true);
    setTimeout(() => setNotifSent(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('debts')}</h1>
          <p className="text-xs font-semibold text-slate-500">
            Suivi des dettes des patients et des paiements en retard.
          </p>
        </div>

        <button
          onClick={handleSendNotifications}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200/80"
        >
          {notifSent ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700">Rappels envoyés !</span>
            </>
          ) : (
            <>
              <Bell className="w-4 h-4 text-sky-600" />
              <span>{t('generate_notifications')}</span>
            </>
          )}
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-[28px] border border-sky-100 border-b-4 border-b-sky-500 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Nombre total de débiteurs</p>
            <p className="text-2xl font-black text-slate-900">{totalDebtors}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[28px] border border-sky-100 border-b-4 border-b-rose-500 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-rose-500 uppercase">Patients en retard</p>
            <p className="text-2xl font-black text-rose-600">{overdueDebtors}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[28px] border border-sky-100 border-b-4 border-b-amber-500 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Total Solde Dû</p>
            <p className="text-2xl font-black text-slate-900">{totalBalanceDue} DZD</p>
          </div>
        </div>
      </div>

      {/* Debts Table */}
      <div className="bg-white rounded-[28px] border border-sky-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">NOM</th>
                <th className="p-4">TOTAL FACTURÉ</th>
                <th className="p-4">TOTAL PAYÉ</th>
                <th className="p-4">SOLDE</th>
                <th className="p-4">STATUT</th>
                <th className="p-4">JOURS DE RETARD</th>
                <th className="p-4">DATE D'ÉCHÉANCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {debts.map((d) => (
                <tr key={d.id} className="hover:bg-sky-50/50 transition-colors">
                  <td className="p-4 font-black text-slate-900">{d.patientName}</td>
                  <td className="p-4 font-bold text-slate-700">{d.totalInvoiced} DZD</td>
                  <td className="p-4 text-emerald-600 font-bold">{d.totalPaid} DZD</td>
                  <td className="p-4 text-rose-600 font-black">{d.balanceDue} DZD</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        d.status === 'En retard'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-rose-600">
                    {d.daysOverdue > 0 ? `⚠️ ${d.daysOverdue}j` : '—'}
                  </td>
                  <td className="p-4 text-slate-500">{d.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
