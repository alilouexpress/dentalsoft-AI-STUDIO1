import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarDays,
  Clock,
  MessageSquare,
  Search,
  BellRing,
  CheckCircle2,
  AlertTriangle,
  History,
  Send,
  Sparkles,
  Smartphone,
  Mail,
  Phone,
  ToggleLeft,
  ToggleRight,
  Filter,
} from 'lucide-react';
import { Patient, RecallLog } from '../../types';

export const RecallsView: React.FC = () => {
  const {
    patients,
    recallLogs,
    toggleAutoRecall,
    sendManualRecall,
    addStaffNotification,
    addStaffMessage,
    openPatientWorkspace,
    t,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'due' | 'sent'>('all');

  // Parse checkup status. A patient is "due" if they have no future appointment and their last visit is > 6 months ago (approx 180 days)
  // For safety and reliability, we can compute days since last checkup or last visit.
  const getDaysSinceLastVisit = (dateStr: string): number => {
    try {
      // Expecting DD/MM/YYYY or YYYY-MM-DD
      let parts: string[] = [];
      if (dateStr.includes('/')) {
        parts = dateStr.split('/');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const lastDate = new Date(year, month, day);
        const diffTime = Math.abs(new Date().getTime() - lastDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      } else if (dateStr.includes('-')) {
        parts = dateStr.split('-');
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const lastDate = new Date(year, month, day);
        const diffTime = Math.abs(new Date().getTime() - lastDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
    } catch (e) {
      // Fallback
    }
    return 190; // default to >6 months
  };

  // Flag patients who are due
  const enrichedPatients = patients.map((p) => {
    const days = getDaysSinceLastVisit(p.lastVisit);
    const isOverdue = days >= 180;
    
    // Auto status determination
    let status = p.recallStatus || 'À jour';
    if (isOverdue && (!p.recallStatus || p.recallStatus === 'À jour')) {
      status = 'À rappeler';
    }

    return {
      ...p,
      daysSinceLastCheckup: days,
      calculatedRecallStatus: status,
    };
  });

  // Filters
  const filteredPatients = enrichedPatients.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'due') {
      return matchesSearch && p.calculatedRecallStatus === 'À rappeler';
    }
    if (filterStatus === 'sent') {
      return matchesSearch && p.calculatedRecallStatus === 'Rappel envoyé';
    }
    return matchesSearch;
  });

  // Send manually trigger reminder
  const handleSendReminder = (p: any, method: 'SMS' | 'WhatsApp' | 'Email' | 'Téléphone') => {
    sendManualRecall(p.id, method);
    
    addStaffNotification({
      type: 'urgent_task',
      title: 'Rappel patient envoyé 📨',
      message: `Rappel de contrôle de 6 mois envoyé à ${p.name} par ${method}.`,
      patientId: p.id,
    });
  };

  // Helper for contact icons
  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'SMS':
        return <Smartphone className="w-3.5 h-3.5" />;
      case 'Email':
        return <Mail className="w-3.5 h-3.5" />;
      case 'WhatsApp':
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <Phone className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Rappels Cliniques (6 mois)
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Identifiez et relancez les patients n'ayant pas réalisé de contrôle semestriel.
          </p>
        </div>

        {/* Action Counters */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>
              À rappeler : {enrichedPatients.filter((p) => p.calculatedRecallStatus === 'À rappeler').length}
            </span>
          </div>
          <div className="px-3 py-1.5 bg-sky-50 border border-sky-100 rounded-xl text-sky-700 text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              Taux de retour : 78%
            </span>
          </div>
        </div>
      </div>

      {/* Control Filters and Search */}
      <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un patient (code, nom)..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto shrink-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
              filterStatus === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tous ({enrichedPatients.length})
          </button>
          <button
            onClick={() => setFilterStatus('due')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
              filterStatus === 'due'
                ? 'bg-rose-500 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            Dûs ({enrichedPatients.filter((p) => p.calculatedRecallStatus === 'À rappeler').length})
          </button>
          <button
            onClick={() => setFilterStatus('sent')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
              filterStatus === 'sent'
                ? 'bg-sky-500 text-white'
                : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
            }`}
          >
            Rappels Envoyés ({enrichedPatients.filter((p) => p.calculatedRecallStatus === 'Rappel envoyé').length})
          </button>
        </div>
      </div>

      {/* Two-Column Grid: Patients to Recall vs sent History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Patients Table */}
        <div className="lg:col-span-8 bg-white p-5 rounded-[28px] border border-sky-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-800">Patients & Suivi Semestriel</h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              Affichage de {filteredPatients.length} dossier(s)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="pb-3 pl-2">Patient</th>
                  <th className="pb-3">Dernier Contrôle</th>
                  <th className="pb-3">Fréquence</th>
                  <th className="pb-3 text-center">Rappel Auto</th>
                  <th className="pb-3 text-right pr-2">Alerte & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-bold text-xs">
                      Aucun patient ne correspond aux filtres sélectionnés.
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 pl-2 font-bold text-slate-900">
                        <button
                          onClick={() => openPatientWorkspace(p.id)}
                          className="hover:text-sky-600 transition-colors text-left flex items-center gap-2 cursor-pointer"
                        >
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[9px] font-bold">
                            {p.code}
                          </span>
                          <span className="font-black">{p.name}</span>
                        </button>
                        <p className="text-[10px] text-slate-400 font-medium pl-8">{p.phone}</p>
                      </td>
                      <td className="py-3 font-semibold text-slate-600">
                        <div className="flex flex-col">
                          <span>{p.lastVisit}</span>
                          <span className="text-[10px] text-rose-500 font-black">
                            {p.daysSinceLastCheckup} jours écoulés
                          </span>
                        </div>
                      </td>
                      <td className="py-3 font-semibold text-slate-500">
                        Chaque {p.recallIntervalMonths || 6} mois
                      </td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => toggleAutoRecall(p.id)}
                          className="inline-flex items-center justify-center cursor-pointer text-slate-600 hover:text-sky-600 transition-colors"
                          title="Basculer le rappel automatique"
                        >
                          {p.autoRecallNotificationEnabled ? (
                            <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg text-[10px] font-black">
                              <ToggleRight className="w-4 h-4 text-emerald-600" />
                              Actif
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 text-slate-400 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                              <ToggleLeft className="w-4 h-4 text-slate-400" />
                              Désactivé
                            </div>
                          )}
                        </button>
                      </td>
                      <td className="py-3 text-right pr-2">
                        <div className="flex items-center justify-end gap-2">
                          {p.calculatedRecallStatus === 'Rappel envoyé' ? (
                            <div className="flex flex-col items-end">
                              <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100 text-[9px] font-black uppercase">
                                Envoyé ({p.lastRecallSentDate})
                              </span>
                              <button
                                onClick={() => handleSendReminder(p, p.recallMethodPreference || 'SMS')}
                                className="text-[10px] font-extrabold text-sky-500 hover:text-sky-700 mt-1"
                              >
                                Renvoyer
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100 text-[9px] font-black uppercase">
                                À relancer
                              </span>
                              
                              <button
                                onClick={() => handleSendReminder(p, p.recallMethodPreference || 'SMS')}
                                className="px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-black text-[10px] flex items-center gap-1 cursor-pointer transition-all hover:scale-103"
                              >
                                <Send className="w-3 h-3" />
                                Rappeler
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Sent Logs Timeline */}
        <div className="lg:col-span-4 bg-white p-5 rounded-[28px] border border-sky-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <History className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-extrabold text-slate-800">Logs des Rappels Envoyés</h3>
          </div>

          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
            {recallLogs.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <p className="font-bold text-xs">Aucun rappel envoyé pour le moment.</p>
              </div>
            ) : (
              recallLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 hover:bg-sky-50/20 border border-slate-200/60 rounded-xl space-y-1.5 transition-colors">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-extrabold text-slate-900 text-[11px] truncate">
                      {log.patientName}
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold shrink-0">
                      {log.sentDate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1 text-slate-500 font-bold">
                      {getMethodIcon(log.method)}
                      <span>{log.method}</span>
                    </div>
                    <span className={`px-1.5 py-0.2 rounded-md font-black text-[9px] ${
                      log.status === 'Délivré' || log.status === 'Rendez-vous Fixé'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-sky-50 text-sky-700'
                    }`}>
                      {log.status}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-600 leading-snug font-medium border-l-2 border-slate-200 pl-2 py-0.5 break-words">
                    {log.messagePreview}
                  </p>
                  
                  {log.notes && (
                    <p className="text-[9px] text-slate-400 italic">
                      Note : {log.notes}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
