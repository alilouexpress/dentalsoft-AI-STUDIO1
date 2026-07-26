import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Calendar,
  FlaskConical,
  DollarSign,
  TrendingUp,
  Plus,
  Clock,
  ArrowUpRight,
  ChevronRight,
  UserPlus,
  CheckCircle2,
  Circle,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    patients,
    appointments,
    labCases,
    tasks,
    toggleTaskStatus,
    setActivePage,
    openPatientWorkspace,
    staffMembers,
    updatePatient,
    addStaffNotification,
    addStaffMessage,
    currentUser,
    dashboardConfig,
    t,
  } = useApp();

  const roleConfig = dashboardConfig[currentUser?.role || 'Médecin'] || {
    showMetrics: true,
    showFinancials: true,
    showWaitingRoom: true,
    showVisitsChart: true,
    showTodaySchedule: true,
    showRecentPatients: true,
    showTasks: true,
  };

  const totalPatients = patients.length;
  const todayAppointments = appointments.filter((a) => a.date === '2026-07-24');
  const pendingLabCases = labCases.filter((l) => l.status === 'En cours' || l.status === 'En attente').length;
  const totalRevenue = 9700; // DA

  const showChart = roleConfig.showVisitsChart;
  const showScheduleCol = roleConfig.showTodaySchedule || roleConfig.showRecentPatients || roleConfig.showTasks;

  const waitingPatients = patients.filter((p) => p.isWaiting);

  const handleCallPatient = (p: any) => {
    updatePatient({
      ...p,
      waitingStatus: 'En consultation',
    });
    
    // Notify the doctor assigned (in case they called from dashboard)
    const activeDoc = staffMembers.find((s) => s.id === p.treatingDoctorId);
    
    addStaffNotification({
      type: 'urgent_task',
      title: 'Patient en cabine 🦷',
      message: `Le patient ${p.name} est entré en cabine avec ${activeDoc ? activeDoc.name : 'le Docteur'}.`,
      targetDoctorId: p.treatingDoctorId,
      patientId: p.id,
    });

    addStaffMessage(
      `🦷 EN CABINE : Le patient ${p.name} est maintenant en consultation avec ${activeDoc ? activeDoc.name : 'le Docteur'}.`,
      'flow'
    );
  };

  const handleReleasePatient = (p: any) => {
    updatePatient({
      ...p,
      isWaiting: false,
      waitingSince: undefined,
      waitingNotes: undefined,
      waitingStatus: undefined,
      treatingDoctorId: undefined,
    });

    addStaffMessage(
      `✅ LIBÉRÉ : Le patient ${p.name} a terminé sa consultation et libéré le cabinet.`,
      'flow'
    );
  };

  const handleCancelWaiting = (p: any) => {
    updatePatient({
      ...p,
      isWaiting: false,
      waitingSince: undefined,
      waitingNotes: undefined,
      waitingStatus: undefined,
      treatingDoctorId: undefined,
    });

    addStaffMessage(
      `❌ RETIRÉ : Le patient ${p.name} a été retiré de la file d'attente.`,
      'flow'
    );
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Page Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded tracking-widest border border-slate-200/50">
              Stitch Console
            </span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Cabinet Synchrone
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">{t('dashboard')}</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Tableau de commande clinique — Vue d'ensemble de l'activité, de l'aiguillage des urgences et de l'état de garde.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActivePage('patients')}
            className="px-4 py-2.5 text-xs font-bold rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs hover:shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <UserPlus className="w-4 h-4 text-slate-400" />
            <span>Nouveau patient</span>
          </button>

          <button
            onClick={() => setActivePage('appointments')}
            className="px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 text-sky-400" />
            <span>{t('new_appointment')}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      {roleConfig.showMetrics && (
        <div className={`grid gap-6 ${
          roleConfig.showFinancials 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' 
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}>
          {/* Card 1: Patients */}
          <div className="bg-white p-6 rounded-[20px] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {t('total_patients')}
              </span>
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">{totalPatients}</span>
              <span className="text-[9px] font-black text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5" /> +12%
              </span>
            </div>
            <div className="border-t border-slate-50 mt-5 pt-3.5 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Dossiers d'activité</span>
              <span className="text-sky-500">Fiches actives</span>
            </div>
          </div>

          {/* Card 2: Today Appointments */}
          <div className="bg-white p-6 rounded-[20px] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {t('today_appointments')}
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">{todayAppointments.length}</span>
              <div className="flex items-center gap-1 text-[9px] font-black">
                <span className="px-1.5 py-0.5 rounded bg-slate-50 text-slate-500">0 Prog</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600">0 Fini</span>
              </div>
            </div>
            <div className="border-t border-slate-50 mt-5 pt-3.5 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Aujourd'hui</span>
              <span className="text-emerald-500">Planifié</span>
            </div>
          </div>

          {/* Card 3: Lab Cases */}
          <div className="bg-white p-6 rounded-[20px] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {t('pending_lab')}
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FlaskConical className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">{pendingLabCases}</span>
              <span className="text-[9px] font-black text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                Actifs
              </span>
            </div>
            <div className="border-t border-slate-50 mt-5 pt-3.5 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Prothèses</span>
              <span className="text-amber-500">En cours</span>
            </div>
          </div>

          {/* Card 4: Revenue */}
          {roleConfig.showFinancials && (
            <div className="bg-white p-6 rounded-[20px] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {t('revenue')}
                </span>
                <div className="w-8 h-8 rounded-lg bg-slate-900/10 text-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 tracking-tight">{totalRevenue.toLocaleString()}</span>
                <span className="text-xs font-bold text-slate-400">DA</span>
              </div>
              <div className="border-t border-slate-50 mt-5 pt-3.5 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Honoraires mensuels</span>
                <span className="text-slate-900">Clôture</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Salle d'Attente / Waiting Room & Handoff Panel */}
      {roleConfig.showWaitingRoom && (
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                <Clock className="w-4.5 h-4.5 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Salle d'Attente & Flux Clinique</h3>
                  <span className="text-[8px] font-black uppercase text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full animate-pulse tracking-widest">
                    Live
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Gestion immédiate de l'aiguillage des patients de la réception vers les cabinets de soin.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 self-start sm:self-center">
              <span className="text-slate-400">Files d'attente actives :</span>
              <span className="text-emerald-600 font-black px-2 py-0.5 bg-emerald-500/10 rounded-lg">
                {waitingPatients.length} patient{waitingPatients.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {waitingPatients.length === 0 ? (
            <div className="py-12 px-4 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/20">
              <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-4.5 h-4.5" />
              </div>
              <p className="font-bold text-slate-600 text-xs">Aucun patient en attente dans la file</p>
              <p className="text-[10px] text-slate-400 mt-1 max-w-sm mx-auto font-semibold">
                Les patients ajoutés depuis le module de réception avec l'option d'aiguillage actif apparaîtront ici pour la prise en charge clinique.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-slate-400 font-black uppercase text-[9px] tracking-widest border-b border-slate-100 pb-3">
                    <th className="pb-3 pl-1">Identifiant & Patient</th>
                    <th className="pb-3">Arrivée</th>
                    <th className="pb-3">Spécialiste assigné</th>
                    <th className="pb-3">Motif de consultation</th>
                    <th className="pb-3">Statut du flux</th>
                    <th className="pb-3 text-right pr-1">Aiguillage de garde</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {waitingPatients.map((p) => {
                    const treatingDoc = staffMembers.find((s) => s.id === p.treatingDoctorId);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-4 pl-1 font-bold text-slate-900">
                          <button
                            onClick={() => openPatientWorkspace(p.id)}
                            className="hover:text-sky-600 transition-colors text-left flex items-center gap-2.5 cursor-pointer"
                          >
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[9px] font-black">
                              {p.code}
                            </span>
                            <span className="font-extrabold text-slate-800 hover:underline">{p.name}</span>
                            <span className="text-slate-400 text-[10px] font-bold">({p.age} ans)</span>
                          </button>
                        </td>
                        <td className="py-4 font-bold text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{p.waitingSince || '10:00'}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="font-bold text-slate-700 bg-slate-50 border border-slate-200/50 px-2.5 py-1 rounded-lg text-[11px]">
                            {treatingDoc ? treatingDoc.name : 'Docteur de garde'}
                          </span>
                        </td>
                        <td className="py-4 font-bold text-slate-400 max-w-[180px] truncate">
                          {p.waitingNotes || 'Contrôle général'}
                        </td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full font-black text-[9px] uppercase tracking-wider border ${
                            p.waitingStatus === 'En consultation'
                              ? 'bg-sky-500/10 text-sky-600 border-sky-500/20 animate-pulse'
                              : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          }`}>
                            {p.waitingStatus || 'En attente'}
                          </span>
                        </td>
                        <td className="py-4 text-right pr-1">
                          <div className="flex items-center justify-end gap-2">
                            {p.waitingStatus !== 'En consultation' ? (
                              <button
                                onClick={() => handleCallPatient(p)}
                                className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-[10px] cursor-pointer transition-all active:scale-95 shadow-xs"
                              >
                                Appeler en cabine
                              </button>
                            ) : (
                              <button
                                onClick={() => handleReleasePatient(p)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] cursor-pointer transition-all active:scale-95 shadow-xs"
                              >
                                Terminer soin
                              </button>
                            )}
                            <button
                              onClick={() => handleCancelWaiting(p)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-400 border border-slate-200/60 font-extrabold text-[10px] cursor-pointer transition-all active:scale-95"
                              title="Retirer du flux de garde"
                            >
                              Retirer
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Main Grid Layout: Interactive Chart & Agenda Panel */}
      {(showChart || showScheduleCol) && (
        <div className={`grid gap-6 ${
          showChart && showScheduleCol ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'
        }`}>
          
          {/* Weekly Visits Comparison Chart */}
          {showChart && (
            <div className={`${showScheduleCol ? 'lg:col-span-8' : 'lg:col-span-12'} bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col justify-between space-y-6`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{t('patient_visits')}</h3>
                  <p className="text-xs text-slate-400 font-bold">{t('weekly_comparison')}</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold shrink-0">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-sky-500"></span> Visites
                  </span>
                  {roleConfig.showFinancials && (
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Recettes
                    </span>
                  )}
                </div>
              </div>

              {/* Bar Chart Visualization - High-End Minimalist look */}
              <div className="h-60 flex items-end justify-between gap-4 pt-8 pb-3 border-b border-slate-100 px-4 relative">
                {/* Horizontal Guide Lines */}
                <div className="absolute inset-x-0 top-1/4 border-b border-slate-100/60 pointer-events-none"></div>
                <div className="absolute inset-x-0 top-2/4 border-b border-slate-100/60 pointer-events-none"></div>
                <div className="absolute inset-x-0 top-3/4 border-b border-slate-100/60 pointer-events-none"></div>

                {[
                  { day: 'Lun', visits: 1.2, rev: 0.8, valVis: 12, valRev: '8K' },
                  { day: 'Mar', visits: 1.8, rev: 1.5, valVis: 18, valRev: '15K' },
                  { day: 'Mer', visits: 0.9, rev: 0.6, valVis: 9, valRev: '6K' },
                  { day: 'Jeu', visits: 2.2, rev: 2.1, valVis: 22, valRev: '21K' },
                  { day: 'Ven', visits: 0.5, rev: 0.4, valVis: 5, valRev: '4K' },
                  { day: 'Sam', visits: 1.6, rev: 1.2, valVis: 16, valRev: '12K' },
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative z-10">
                    {/* Tooltip on Hover */}
                    <div className="absolute -top-6 bg-slate-900 text-white text-[9px] font-black px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none whitespace-nowrap shadow-md">
                      Vis: {item.valVis} • R: {item.valRev} DA
                    </div>

                    <div className="w-full max-w-[32px] flex items-end justify-center gap-1.5 h-full">
                      <div
                        style={{ height: `${(item.visits / 2.5) * 100}%` }}
                        className={`${roleConfig.showFinancials ? 'w-1/2' : 'w-2/3'} bg-sky-500 rounded-t-md group-hover:bg-sky-600 transition-all duration-200`}
                      ></div>
                      {roleConfig.showFinancials && (
                        <div
                          style={{ height: `${(item.rev / 2.5) * 100}%` }}
                          className="w-1/2 bg-emerald-500 rounded-t-md group-hover:bg-emerald-600 transition-all duration-200"
                        ></div>
                      )}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 mt-3 uppercase tracking-wider">{item.day}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold text-slate-500 pt-1">
                <span>Volume moyen quotidien de garde: <strong className="text-slate-800 font-extrabold">1.8 consultations</strong></span>
                <button
                  onClick={() => setActivePage('reports')}
                  className="text-sky-600 hover:text-sky-700 flex items-center gap-1 font-black cursor-pointer group text-xs"
                >
                  <span>Consulter les rapports détaillés</span>
                  <ChevronRight className="w-4 h-4 rtl:rotate-180 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          )}

          {/* Today's Schedule Panel & Activities (Right sidebar column) */}
          {showScheduleCol && (
            <div className={`${showChart ? 'lg:col-span-4' : 'lg:col-span-12'} bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col justify-between space-y-6`}>
              
              {/* TODAY'S SCHEDULE */}
              {roleConfig.showTodaySchedule && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900">{t('day_schedule')}</h3>
                    <span className="text-[9px] font-black text-sky-600 bg-sky-500/10 border border-sky-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {todayAppointments.length} RDV
                    </span>
                  </div>

                  {todayAppointments.length === 0 ? (
                    <div className="py-8 px-3 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/20">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                        <Clock className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-700 mb-0.5">{t('no_appointments_today')}</h4>
                      <p className="text-[10px] text-slate-400 mb-3 font-semibold">{t('plan_first_appointment')}</p>
                      <button
                        onClick={() => setActivePage('appointments')}
                        className="px-3 py-1.5 text-[9px] font-bold rounded-lg bg-sky-600 hover:bg-sky-700 text-white transition-all cursor-pointer shadow-xs"
                      >
                        Créer un rendez-vous
                      </button>
                    </div>
                  ) : (
                    <div className="relative pl-5 space-y-4 max-h-[220px] overflow-y-auto pr-1">
                      {/* Timeline Vertical Axis line */}
                      <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-slate-100"></div>

                      {todayAppointments.map((app) => (
                        <div
                          key={app.id}
                          onClick={() => openPatientWorkspace(app.patientId)}
                          className="relative group cursor-pointer"
                        >
                          {/* Circle marker pin */}
                          <span className="absolute -left-5 top-1.5 w-3 h-3 rounded-full bg-sky-500 border-2 border-white shadow-sm ring-4 ring-sky-500/10 group-hover:bg-sky-600 transition-colors z-10"></span>
                          
                          <div className="p-3 bg-slate-50 hover:bg-slate-100/60 rounded-xl border border-slate-200/50 transition-all flex items-center justify-between gap-2">
                            <div>
                              <p className="text-xs font-bold text-slate-800 group-hover:text-sky-600 transition-colors leading-tight">
                                {app.patientName}
                              </p>
                              <p className="text-[9px] font-bold text-slate-400 mt-1">
                                {app.type} • {app.durationMinutes} min
                              </p>
                            </div>
                            <span className="text-[9px] font-black text-sky-600 bg-sky-500/10 border border-sky-500/10 px-2 py-0.5 rounded-md shrink-0">
                              {app.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* RECENT PATIENTS */}
              {roleConfig.showRecentPatients && (
                <div className={`space-y-4 pt-4 ${roleConfig.showTodaySchedule ? 'border-t border-slate-100' : ''}`}>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Patients Récents
                  </h4>
                  <div className="space-y-2">
                    {patients.slice(0, 3).map((p) => (
                      <div
                        key={p.id}
                        onClick={() => openPatientWorkspace(p.id)}
                        className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-all cursor-pointer group border border-transparent hover:border-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-700 font-extrabold text-xs flex items-center justify-center border border-slate-200/60 group-hover:bg-sky-500/10 group-hover:text-sky-600 group-hover:border-sky-500/20 transition-all shrink-0">
                            {p.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 group-hover:text-sky-600 transition-colors truncate leading-tight">
                              {p.name}
                            </p>
                            <p className="text-[9px] font-bold text-slate-400 mt-1">{p.code} • {p.age} ans</p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TASKS LIST */}
              {roleConfig.showTasks && (
                <div className={`space-y-4 pt-4 ${(roleConfig.showTodaySchedule || roleConfig.showRecentPatients) ? 'border-t border-slate-100' : ''}`}>
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Tâches de garde
                    </h4>
                    <button 
                      onClick={() => setActivePage('tasks')}
                      className="text-[10px] font-black text-sky-600 hover:text-sky-700 cursor-pointer uppercase tracking-widest"
                    >
                      Voir tout
                    </button>
                  </div>
                  <div className="space-y-2">
                    {tasks.filter(t => t.status === 'En attente' || (t.status as string) === 'pending').slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-xl transition-all group cursor-pointer border border-slate-100/40 hover:border-slate-100"
                        onClick={() => toggleTaskStatus(task.id)}
                      >
                        <button className="mt-0.5 text-slate-300 group-hover:text-sky-500 transition-colors shrink-0">
                          <Circle className="w-4 h-4" />
                        </button>
                        <div className="space-y-1 min-w-0">
                          <p className="text-xs font-bold text-slate-700 leading-tight group-hover:text-slate-900 transition-colors line-clamp-2">{task.title}</p>
                          <span className={`inline-block text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${
                            task.priority === 'Haute' 
                              ? 'bg-rose-500/10 text-rose-600 border border-rose-500/10' 
                              : task.priority === 'Moyenne' 
                              ? 'bg-amber-500/10 text-amber-600 border border-amber-500/10' 
                              : 'bg-slate-100 text-slate-500 border border-slate-200/50'
                          }`}>
                            {task.priority === 'Haute' ? 'Urgent' : task.priority === 'Moyenne' ? 'Moyen' : 'Bas'}
                          </span>
                        </div>
                      </div>
                    ))}
                    {tasks.filter(t => t.status === 'En attente' || (t.status as string) === 'pending').length === 0 && (
                      <p className="text-[10px] text-slate-400 text-center py-4 italic font-bold">Aucune tâche active</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
