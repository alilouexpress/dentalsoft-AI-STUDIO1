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
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('dashboard')}</h1>
          <p className="text-xs font-semibold text-slate-500">
            Bon retour, voici l'aperçu général de votre clinique dentaire.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage('patients')}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-white hover:bg-sky-50 text-slate-700 border border-sky-100 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5 text-sky-600" />
            <span>Nouveau patient</span>
          </button>

          <button
            onClick={() => setActivePage('appointments')}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-md shadow-sky-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('new_appointment')}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row with Vibrant Bottom Accent Borders */}
      {roleConfig.showMetrics && (
        <div className={`grid gap-4 ${
          roleConfig.showFinancials 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' 
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}>
          {/* Card 1: Patients */}
          <div className="bg-white p-5 rounded-[28px] border border-sky-100 border-b-4 border-b-sky-500 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t('total_patients')}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{totalPatients}</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +12%
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 mt-2">Dossiers patients actifs</p>
          </div>

          {/* Card 2: Today Appointments */}
          <div className="bg-white p-5 rounded-[28px] border border-sky-100 border-b-4 border-b-emerald-500 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t('today_appointments')}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{todayAppointments.length}</span>
              <div className="flex items-center gap-1.5 text-[10px] font-bold">
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">0 programmé</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">0 terminé</span>
              </div>
            </div>
            <p className="text-[11px] font-medium text-slate-400 mt-2">Planifiés pour aujourd'hui</p>
          </div>

          {/* Card 3: Lab Cases */}
          <div className="bg-white p-5 rounded-[28px] border border-sky-100 border-b-4 border-b-amber-500 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t('pending_lab')}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FlaskConical className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{pendingLabCases}</span>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                En attente
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 mt-2">Travaux prothèses / labo</p>
          </div>

          {/* Card 4: Revenue */}
          {roleConfig.showFinancials && (
            <div className="bg-white p-5 rounded-[28px] border border-sky-100 border-b-4 border-b-sky-700 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t('revenue')}
                </span>
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">{totalRevenue.toLocaleString()}</span>
                <span className="text-xs font-black text-slate-500">DA</span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 mt-2">Recettes enregistrées ce mois</p>
            </div>
          )}
        </div>
      )}

      {/* Salle d'Attente / Waiting Room & Handoff Panel */}
      {roleConfig.showWaitingRoom && (
        <div className="bg-white p-6 rounded-[28px] border border-emerald-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Clock className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  Salle d'Attente & Flux Clinique
                  <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full animate-pulse">
                    Live
                  </span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Aiguillage immédiat des patients de la réception vers les cabinets de soin de garde.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-extrabold text-slate-700">Patients en attente :</span>
              <span className="font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-lg">
                {waitingPatients.length}
              </span>
            </div>
          </div>

          {waitingPatients.length === 0 ? (
            <div className="py-8 px-4 text-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
              <p className="font-bold text-slate-500 text-xs">Aucun patient en salle d'attente actuellement</p>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                Les patients ajoutés par le réceptionniste avec l'option d'aiguillage apparaîtront ici en temps réel.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="pb-3 pl-2">Patient</th>
                    <th className="pb-3">Heure d'arrivée</th>
                    <th className="pb-3">Docteur Demandé</th>
                    <th className="pb-3">Motif d'urgence</th>
                    <th className="pb-3">Statut du flux</th>
                    <th className="pb-3 text-right pr-2">Actions de garde</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {waitingPatients.map((p) => {
                    const treatingDoc = staffMembers.find((s) => s.id === p.treatingDoctorId);
                    return (
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
                            <span className="text-slate-400 text-[11px] font-semibold">({p.age} ans)</span>
                          </button>
                        </td>
                        <td className="py-3 font-semibold text-slate-600 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>{p.waitingSince || '10:00'}</span>
                        </td>
                        <td className="py-3 font-extrabold text-sky-700">
                          {treatingDoc ? treatingDoc.name : 'Docteur de garde'}
                        </td>
                        <td className="py-3 font-bold text-slate-500 max-w-[180px] truncate">
                          {p.waitingNotes || 'Contrôle général'}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full font-black text-[9px] uppercase tracking-wide border ${
                            p.waitingStatus === 'En consultation'
                              ? 'bg-sky-50 text-sky-700 border-sky-100 animate-pulse'
                              : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            {p.waitingStatus || 'En attente'}
                          </span>
                        </td>
                        <td className="py-3 text-right pr-2">
                          <div className="flex items-center justify-end gap-1.5">
                            {p.waitingStatus !== 'En consultation' ? (
                              <button
                                onClick={() => handleCallPatient(p)}
                                className="px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-black text-[10px] shadow-sm cursor-pointer transition-all active:scale-95"
                              >
                                Appeler en Cabine 🦷
                              </button>
                            ) : (
                              <button
                                onClick={() => handleReleasePatient(p)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] shadow-sm cursor-pointer transition-all active:scale-95"
                              >
                                Terminer & Libérer
                              </button>
                            )}
                            <button
                              onClick={() => handleCancelWaiting(p)}
                              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 font-bold text-[10px] cursor-pointer transition-colors"
                              title="Retirer de la salle d'attente"
                            >
                              Annuler
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

      {/* Main Grid: Chart & Schedule */}
      {(showChart || showScheduleCol) && (
        <div className={`grid gap-6 ${
          showChart && showScheduleCol ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'
        }`}>
          
          {/* Weekly Visits Comparison Chart */}
          {showChart && (
            <div className={`${showScheduleCol ? 'lg:col-span-8' : 'lg:col-span-12'} bg-white p-6 rounded-[28px] border border-sky-100 shadow-sm flex flex-col justify-between`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{t('patient_visits')}</h3>
                  <p className="text-xs text-slate-500">{t('weekly_comparison')}</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-3 h-3 rounded-full bg-sky-500 inline-block"></span> Visites
                  </span>
                  {roleConfig.showFinancials && (
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Revenu
                    </span>
                  )}
                </div>
              </div>

              {/* Bar Chart Visualization */}
              <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-100 px-2">
                {[
                  { day: 'Lun', visits: 1.2, rev: 0.8 },
                  { day: 'Mar', visits: 1.8, rev: 1.5 },
                  { day: 'Mer', visits: 0.9, rev: 0.6 },
                  { day: 'Jeu', visits: 2.2, rev: 2.1 },
                  { day: 'Ven', visits: 0.5, rev: 0.4 },
                  { day: 'Sam', visits: 1.6, rev: 1.2 },
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full max-w-[36px] flex items-end justify-center gap-1 h-full">
                      <div
                        style={{ height: `${(item.visits / 2.5) * 100}%` }}
                        className={`${roleConfig.showFinancials ? 'w-1/2' : 'w-2/3'} bg-sky-500 rounded-t-md group-hover:bg-sky-600 transition-all relative`}
                      ></div>
                      {roleConfig.showFinancials && (
                        <div
                          style={{ height: `${(item.rev / 2.5) * 100}%` }}
                          className="w-1/2 bg-emerald-500 rounded-t-md group-hover:bg-emerald-600 transition-all"
                        ></div>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-slate-500">{item.day}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 text-xs font-semibold text-slate-500">
                <span>Volume quotidien moyen: 1.8 consultations</span>
                <button
                  onClick={() => setActivePage('reports')}
                  className="text-sky-600 hover:text-sky-700 flex items-center gap-1 font-bold cursor-pointer"
                >
                  <span>Voir le rapport complet</span>
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* Today's Schedule Panel & Recent Patients */}
          {showScheduleCol && (
            <div className={`${showChart ? 'lg:col-span-4' : 'lg:col-span-12'} bg-white p-6 rounded-[28px] border border-sky-100 shadow-sm flex flex-col justify-between space-y-6`}>
              
              {roleConfig.showTodaySchedule && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-900">{t('day_schedule')}</h3>
                    <span className="text-xs font-bold text-slate-400">{todayAppointments.length} rdv</span>
                  </div>

                  {todayAppointments.length === 0 ? (
                    <div className="py-12 px-4 text-center border-2 border-dashed border-sky-200/70 rounded-2xl my-4 bg-sky-50/30">
                      <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-3">
                        <Clock className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 mb-1">{t('no_appointments_today')}</h4>
                      <p className="text-xs text-slate-500 mb-4">{t('plan_first_appointment')}</p>
                      <button
                        onClick={() => setActivePage('appointments')}
                        className="px-4 py-2 text-xs font-bold rounded-xl bg-sky-500 hover:bg-sky-600 text-white shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{t('new_appointment')}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 my-4">
                      {todayAppointments.map((app) => (
                        <div
                          key={app.id}
                          onClick={() => openPatientWorkspace(app.patientId)}
                          className="p-3 bg-slate-50 hover:bg-sky-50/60 rounded-2xl border-r-4 border-sky-500 border border-slate-200/80 transition-all cursor-pointer flex items-center justify-between animate-fade-in"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-900">{app.patientName}</p>
                            <p className="text-[11px] text-slate-500">{app.type} • {app.durationMinutes} min</p>
                          </div>
                          <span className="text-xs font-extrabold text-sky-700 bg-sky-100 px-2 py-1 rounded-lg">
                            {app.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Quick Access Patient Row */}
              {roleConfig.showRecentPatients && (
                <div className={`pt-4 ${roleConfig.showTodaySchedule ? 'border-t border-slate-100' : ''}`}>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Patients récents
                  </h4>
                  <div className="space-y-2">
                    {patients.slice(0, 3).map((p) => (
                      <div
                        key={p.id}
                        onClick={() => openPatientWorkspace(p.id)}
                        className="flex items-center justify-between p-2 hover:bg-sky-50/60 rounded-2xl transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center">
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                              {p.name}
                            </p>
                            <p className="text-[10px] text-slate-400">{p.code} • {p.age} ans</p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 rtl:rotate-90" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks Row */}
              {roleConfig.showTasks && (
                <div className={`pt-4 ${(roleConfig.showTodaySchedule || roleConfig.showRecentPatients) ? 'border-t border-slate-100' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Tâches
                    </h4>
                    <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full cursor-pointer hover:bg-sky-100" onClick={() => setActivePage('tasks')}>
                      Voir tout
                    </span>
                  </div>
                  <div className="space-y-2">
                    {tasks.filter(t => t.status === 'En attente' || (t.status as string) === 'pending').slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start gap-2.5 p-2 hover:bg-slate-50 rounded-2xl transition-colors group cursor-pointer"
                        onClick={() => toggleTaskStatus(task.id)}
                      >
                        <button className="mt-0.5 text-slate-300 group-hover:text-sky-500 transition-colors">
                          <Circle className="w-4 h-4" />
                        </button>
                        <div>
                          <p className="text-xs font-bold text-slate-800 line-clamp-1">{task.title}</p>
                          <p className="text-[10px] text-slate-400">{task.priority === 'Haute' ? 'Urgent' : task.priority === 'Moyenne' ? 'Moyenne' : 'Basse'}</p>
                        </div>
                      </div>
                    ))}
                    {tasks.filter(t => t.status === 'En attente' || (t.status as string) === 'pending').length === 0 && (
                      <p className="text-xs text-slate-500 text-center py-2 italic">Aucune tâche en attente</p>
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
