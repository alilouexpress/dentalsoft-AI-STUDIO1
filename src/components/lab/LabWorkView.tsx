import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FlaskConical, Plus, X, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const LabWorkView: React.FC = () => {
  const { labCases, patients, staffMembers, addLabCase, t } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [doctor, setDoctor] = useState('Dr. Amrani Samir');
  const [labName, setLabName] = useState('DentaTechLab');
  const [type, setType] = useState<'Prothèse' | 'Couronne' | 'Bridge' | 'Gouttière' | 'Implant'>('Couronne');
  const [dueDate, setDueDate] = useState('2026-07-30');
  const [description, setDescription] = useState('');

  const totalCases = labCases.length;
  const inProgress = labCases.filter((c) => c.status === 'En cours').length;
  const completed = labCases.filter((c) => c.status === 'Terminé').length;
  const urgent = labCases.filter((c) => c.status === 'Urgent').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selP = patients.find((p) => p.id === patientId) || patients[0];
    if (!selP) return;

    addLabCase({
      patientId: selP.id,
      patientName: selP.name,
      doctorName: doctor,
      labName,
      type,
      status: 'En cours',
      dueDate,
      description,
    });

    setIsModalOpen(false);
    setDescription('');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('lab_work')}</h1>
          <p className="text-xs font-semibold text-slate-500">Suivre les travaux de laboratoire dentaire.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md shadow-sky-500/20 hover:from-sky-600 hover:to-sky-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle commande</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total des cas</p>
          <p className="text-2xl font-black text-slate-900">{totalCases}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <p className="text-[10px] font-bold text-amber-500 uppercase">En cours</p>
          <p className="text-2xl font-black text-amber-600">{inProgress}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <p className="text-[10px] font-bold text-emerald-500 uppercase">Terminés</p>
          <p className="text-2xl font-black text-emerald-600">{completed}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <p className="text-[10px] font-bold text-rose-500 uppercase">Urgents</p>
          <p className="text-2xl font-black text-rose-600">{urgent}</p>
        </div>
      </div>

      {/* Lab cases Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {labCases.length === 0 ? (
          <div className="py-16 text-center">
            <FlaskConical className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">Aucun cas de laboratoire</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">CAS</th>
                  <th className="p-4">PATIENT</th>
                  <th className="p-4">MÉDECIN</th>
                  <th className="p-4">LABORATOIRE</th>
                  <th className="p-4">TYPE</th>
                  <th className="p-4">STATUT</th>
                  <th className="p-4">DATE D'ÉCHÉANCE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {labCases.map((lc) => (
                  <tr key={lc.id} className="hover:bg-sky-50/50 transition-colors">
                    <td className="p-4 font-black text-sky-700">{lc.code}</td>
                    <td className="p-4 font-bold text-slate-900">{lc.patientName}</td>
                    <td className="p-4 text-slate-600">{lc.doctorName}</td>
                    <td className="p-4 text-slate-600">{lc.labName}</td>
                    <td className="p-4 font-bold text-slate-800">{lc.type}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          lc.status === 'Terminé'
                            ? 'bg-emerald-100 text-emerald-800'
                            : lc.status === 'Urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {lc.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{lc.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Nouvelle commande laboratoire</h3>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Laboratoire</label>
                  <select
                    value={labName}
                    onChange={(e) => setLabName(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30"
                  >
                    <option value="DentaTechLab">DentaTechLab</option>
                    <option value="BioDental">BioDental</option>
                    <option value="Laboratoire Zenith">Laboratoire Zenith</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type de prothèse</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30"
                  >
                    <option value="Couronne">Couronne</option>
                    <option value="Prothèse">Prothèse résine</option>
                    <option value="Bridge">Bridge</option>
                    <option value="Gouttière">Gouttière</option>
                    <option value="Implant">Pilier Implant</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date d'échéance</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description / Instruction</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Teinte A2, limite cervicale..."
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/30"
                ></textarea>
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
