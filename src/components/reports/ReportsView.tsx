import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, Download, Printer, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { t, showToast } = useApp();

  const proceduresList = [
    { name: 'Dévitalisation', pct: 6, color: 'bg-emerald-500' },
    { name: 'Traitement carie', pct: 6, color: 'bg-teal-500' },
    { name: 'Extraction simple', pct: 6, color: 'bg-rose-500' },
    { name: 'Détartrage', pct: 6, color: 'bg-sky-500' },
    { name: 'Blanchiment', pct: 6, color: 'bg-purple-500' },
    { name: 'Couronne dentaire', pct: 6, color: 'bg-amber-500' },
    { name: 'Appareil dentaire', pct: 6, color: 'bg-cyan-500' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('reports')}</h1>
          <p className="text-xs font-semibold text-slate-500">
            Analyser les performances et activités financières de la clinique.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('Rapport exporté en CSV avec succès !', 'success')}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200/80"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('export')}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-sky-500/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-[28px] border border-sky-100 border-b-4 border-b-emerald-500 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Chiffre d'affaires</p>
          <p className="text-2xl font-black text-slate-900">9 700 DA</p>
          <p className="text-[10px] font-bold text-emerald-600 mt-1">Cumulé ce mois</p>
        </div>

        <div className="bg-white p-4 rounded-[28px] border border-sky-100 border-b-4 border-b-rose-500 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Mois dernier</p>
          <p className="text-2xl font-black text-slate-900">8 730 DA</p>
          <p className="text-[10px] font-bold text-rose-500 mt-1 flex items-center gap-0.5">
            <TrendingDown className="w-3 h-3" /> -10% vs période
          </p>
        </div>

        <div className="bg-white p-4 rounded-[28px] border border-sky-100 border-b-4 border-b-sky-500 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Moyenne quotidienne</p>
          <p className="text-2xl font-black text-sky-600">0.1</p>
          <p className="text-[10px] text-slate-400 mt-1">Patients par jour</p>
        </div>

        <div className="bg-white p-4 rounded-[28px] border border-sky-100 border-b-4 border-b-emerald-500 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Taux d'achèvement</p>
          <p className="text-2xl font-black text-emerald-600">100%</p>
          <p className="text-[10px] text-slate-400 mt-1">Traitements finalisés</p>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Revenu Mensuel Curve */}
        <div className="bg-white p-5 rounded-[28px] border border-sky-100 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900">{t('monthly_revenue')}</h3>

          <div className="h-56 relative flex items-end pt-6 pb-2 border-b border-slate-100">
            {/* SVG Trendline */}
            <svg className="w-full h-full absolute inset-0 overflow-visible" viewBox="0 0 500 150">
              <path
                d="M 0 140 Q 100 130, 200 110 T 350 40 T 500 20"
                fill="none"
                stroke="#0284c7"
                strokeWidth="4"
              />
              <path
                d="M 0 140 Q 100 130, 200 110 T 350 40 T 500 20 L 500 150 L 0 150 Z"
                fill="url(#skyGradient)"
                opacity="0.15"
              />
              <defs>
                <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
            </svg>

            {/* Months labels */}
            <div className="w-full flex items-center justify-between text-[10px] font-bold text-slate-400 relative z-10 pt-32">
              {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'].map(
                (m) => (
                  <span key={m}>{m}</span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Chart 2: Procedure Distribution */}
        <div className="bg-white p-5 rounded-[28px] border border-sky-100 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900">{t('procedure_distribution')}</h3>

          <div className="space-y-2.5 py-2">
            {proceduresList.map((proc, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">{proc.name}</span>
                  <span className="text-slate-500">{proc.pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${proc.pct * 10}%` }}
                    className={`h-full rounded-full ${proc.color}`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
