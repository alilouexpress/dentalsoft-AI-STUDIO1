import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Plus, X, Search } from 'lucide-react';

export const QuotationsView: React.FC = () => {
  const { quotations, patients, addQuotation, t } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [doctor, setDoctor] = useState('Dr. Amrani Samir');
  const [amount, setAmount] = useState(300);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [validUntil, setValidUntil] = useState('2026-08-24');

  const total = amount - discount + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selP = patients.find((p) => p.id === patientId) || patients[0];
    if (!selP) return;

    addQuotation({
      patientId: selP.id,
      patientName: selP.name,
      doctorName: doctor,
      amount,
      discount,
      tax,
      total,
      validUntil,
      status: 'Envoyé',
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('quotations')}</h1>
          <p className="text-xs font-semibold text-slate-500">
            Gérer les devis et propositions d'honoraires.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md shadow-sky-500/20 hover:from-sky-600 hover:to-sky-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau devis</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">NUMÉRO</th>
                <th className="p-4">PATIENT</th>
                <th className="p-4">MÉDECIN</th>
                <th className="p-4">MONTANT</th>
                <th className="p-4">REMISE</th>
                <th className="p-4">TAXE</th>
                <th className="p-4">TOTAL (DA)</th>
                <th className="p-4">STATUT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {quotations.map((q) => (
                <tr key={q.id} className="hover:bg-sky-50/50 transition-colors">
                  <td className="p-4 font-black text-sky-700">{q.number}</td>
                  <td className="p-4 font-bold text-slate-900">{q.patientName}</td>
                  <td className="p-4 text-slate-600">{q.doctorName}</td>
                  <td className="p-4 font-semibold text-slate-700">{q.amount} DA</td>
                  <td className="p-4 text-slate-500">{q.discount} DA</td>
                  <td className="p-4 text-slate-500">{q.tax} DA</td>
                  <td className="p-4 font-black text-slate-900">{q.total} DA</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 uppercase">
                      {q.status}
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
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Créer un devis</h3>
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

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Médecin</label>
                <input
                  type="text"
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Montant (DA)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Remise</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total (DA)</label>
                  <input
                    type="number"
                    disabled
                    value={total}
                    className="w-full p-2.5 text-xs bg-sky-50 border border-sky-200 rounded-xl font-black text-sky-800"
                  />
                </div>
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
