import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Receipt, Plus, X, DollarSign, Clock, AlertTriangle } from 'lucide-react';

export const BillingView: React.FC = () => {
  const { invoices, patients, addInvoice, t } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [totalAmount, setTotalAmount] = useState(3000);
  const [paidAmount, setPaidAmount] = useState(3000);
  const [dueDate, setDueDate] = useState('2026-08-15');

  const totalCollected = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  const pendingAmount = invoices
    .filter((inv) => inv.status === 'Pending')
    .reduce((acc, inv) => acc + inv.remainingAmount, 0);
  const overdueAmount = invoices
    .filter((inv) => inv.status === 'Overdue')
    .reduce((acc, inv) => acc + inv.remainingAmount, 0);
  const grandTotal = 9700;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selP = patients.find((p) => p.id === patientId) || patients[0];
    if (!selP) return;

    addInvoice({
      patientId: selP.id,
      patientName: selP.name,
      totalAmount,
      paidAmount,
      issueDate: new Date().toLocaleDateString('fr-FR'),
      dueDate,
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('billing')}</h1>
          <p className="text-xs font-semibold text-slate-500">Gérer les factures et les encaissements.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md shadow-sky-500/20 hover:from-sky-600 hover:to-sky-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle facture</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-[28px] border border-sky-100 border-b-4 border-b-emerald-500 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Encaissé</p>
          <p className="text-2xl font-black text-emerald-600">{totalCollected.toLocaleString()} DA</p>
        </div>

        <div className="bg-white p-4 rounded-[28px] border border-sky-100 border-b-4 border-b-sky-500 shadow-sm">
          <p className="text-[10px] font-bold text-sky-500 uppercase">En attente</p>
          <p className="text-2xl font-black text-sky-600">{pendingAmount.toLocaleString()} DA</p>
        </div>

        <div className="bg-white p-4 rounded-[28px] border border-sky-100 border-b-4 border-b-rose-500 shadow-sm">
          <p className="text-[10px] font-bold text-rose-500 uppercase">En retard</p>
          <p className="text-2xl font-black text-rose-600">{overdueAmount.toLocaleString()} DA</p>
        </div>

        <div className="bg-white p-4 rounded-[28px] border border-sky-100 border-b-4 border-b-slate-400 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase">Total Général</p>
          <p className="text-2xl font-black text-slate-900">{grandTotal.toLocaleString()} DA</p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-[28px] border border-sky-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">FACTURE</th>
                <th className="p-4">PATIENT</th>
                <th className="p-4">MONTANT</th>
                <th className="p-4">PAYÉ</th>
                <th className="p-4">RESTANT</th>
                <th className="p-4">ÉCHÉANCE</th>
                <th className="p-4">STATUT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-sky-50/50 transition-colors">
                  <td className="p-4 font-black text-sky-700">{inv.number}</td>
                  <td className="p-4 font-bold text-slate-900">{inv.patientName}</td>
                  <td className="p-4 font-black text-slate-900">{inv.totalAmount} DA</td>
                  <td className="p-4 text-emerald-600 font-bold">{inv.paidAmount} DA</td>
                  <td className="p-4 text-rose-600 font-bold">{inv.remainingAmount} DA</td>
                  <td className="p-4 text-slate-500">{inv.dueDate}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inv.status === 'Overdue'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Nouvelle facture</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Patient</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:ring-2 focus:ring-sky-500/30"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total (DA)</label>
                  <input
                    type="number"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Payé (DA)</label>
                  <input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date d'échéance</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-sky-500/30"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-xl shadow-md shadow-sky-500/20 cursor-pointer transition-all"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
