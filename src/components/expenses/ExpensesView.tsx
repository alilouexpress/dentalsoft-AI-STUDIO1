import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingDown, Plus, X, PieChart, DollarSign } from 'lucide-react';

export const ExpensesView: React.FC = () => {
  const { expenses, addExpense, t } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [category, setCategory] = useState<'Fournitures' | 'Loyer' | 'Électricité' | 'Laboratoire' | 'Salaires' | 'Autre'>('Fournitures');
  const [amount, setAmount] = useState(15000);
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'Fixe' | 'Variable'>('Variable');
  const [isRecurring, setIsRecurring] = useState(false);

  const totalExp = expenses.reduce((acc, e) => acc + e.amount, 0);
  const fixedExp = expenses.filter((e) => e.type === 'Fixe').reduce((acc, e) => acc + e.amount, 0);
  const variableExp = expenses.filter((e) => e.type === 'Variable').reduce((acc, e) => acc + e.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      category,
      amount,
      description: description || `Achat ${category}`,
      date: new Date().toISOString().split('T')[0],
      type,
      isRecurring,
    });
    setIsModalOpen(false);
    setDescription('');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('expenses')}</h1>
          <p className="text-xs font-semibold text-slate-500">Gérer et analyser les dépenses du cabinet.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md shadow-sky-500/20 hover:from-sky-600 hover:to-sky-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une dépense</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Dépenses</p>
          <p className="text-2xl font-black text-slate-900">{totalExp.toLocaleString()} DA</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <p className="text-[10px] font-bold text-sky-500 uppercase">Dépenses Fixes</p>
          <p className="text-2xl font-black text-sky-600">{fixedExp.toLocaleString()} DA</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <p className="text-[10px] font-bold text-amber-500 uppercase">Variables</p>
          <p className="text-2xl font-black text-amber-600">{variableExp.toLocaleString()} DA</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <p className="text-[10px] font-bold text-emerald-500 uppercase">Profit Est. (Bénéfice)</p>
          <p className="text-2xl font-black text-emerald-600">9 700 DA</p>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">CATÉGORIE</th>
                <th className="p-4">DESCRIPTION</th>
                <th className="p-4">DATE</th>
                <th className="p-4">TYPE</th>
                <th className="p-4">MONTANT (DA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-sky-50/50 transition-colors">
                  <td className="p-4 font-bold text-sky-700">{exp.category}</td>
                  <td className="p-4 font-semibold text-slate-900">{exp.description}</td>
                  <td className="p-4 text-slate-500">{exp.date}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {exp.type}
                    </span>
                  </td>
                  <td className="p-4 font-black text-rose-600">{exp.amount.toLocaleString()} DA</td>
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
              <h3 className="text-base font-black text-slate-900">Ajouter une dépense</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Catégorie</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30"
                >
                  <option value="Fournitures">Fournitures de bureau / Soins</option>
                  <option value="Loyer">Loyer du cabinet</option>
                  <option value="Électricité">Électricité & Eau</option>
                  <option value="Laboratoire">Frais Laboratoire</option>
                  <option value="Salaires">Salaires personnel</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Montant (DA)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Ex: Fournitures de bureau"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/30"
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
