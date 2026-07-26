import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment } from '../../types';
import {
  Calendar as CalendarIcon,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  X,
  Check,
  GripVertical,
  RotateCcw,
  Sparkles,
  LayoutGrid,
  CalendarDays,
  ListFilter,
  Eye,
  Trash2,
  Stethoscope,
  Move,
  AlertCircle,
  FileText,
} from 'lucide-react';

export const AppointmentsView: React.FC = () => {
  const {
    appointments,
    patients,
    staffMembers,
    addAppointment,
    updateAppointmentStatus,
    rescheduleAppointment,
    openPatientWorkspace,
    t,
  } = useApp();

  const [selectedDate, setSelectedDate] = useState('2026-07-24');
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month' | 'list'>('day');
  const [filterDoctor, setFilterDoctor] = useState('all');
  const [patientSearch, setPatientSearch] = useState('');

  // Drag and Drop States
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<{ date: string; time: string } | null>(null);
  const [toastNotification, setToastNotification] = useState<{
    message: string;
    prevApp: Appointment;
  } | null>(null);

  // Selected appointment detail drawer/modal
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // New appointment form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formPatientId, setFormPatientId] = useState(patients[0]?.id || '');
  const [formDoctor, setFormDoctor] = useState('Dr. Amrani Samir');
  const [formDate, setFormDate] = useState('2026-07-24');
  const [formTime, setFormTime] = useState('10:00');
  const [formDuration, setFormDuration] = useState(45);
  const [formType, setFormType] = useState<Appointment['type']>('Consultation');
  const [formNotes, setFormNotes] = useState('');

  const hours = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
  ];

  // Helper: Open Modal pre-filled with date & time
  const handleOpenNewModalWithSlot = (date: string, time: string) => {
    setFormDate(date);
    setFormTime(time);
    setIsModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selPatient = patients.find((p) => p.id === formPatientId) || patients[0];
    if (!selPatient) return;

    addAppointment({
      patientId: selPatient.id,
      patientName: selPatient.name,
      doctorName: formDoctor,
      date: formDate,
      time: formTime,
      durationMinutes: formDuration,
      type: formType,
      notes: formNotes,
    });

    setIsModalOpen(false);
    setFormNotes('');
  };

  // Drag and Drop Event Handlers
  const handleDragStart = (e: React.DragEvent, app: Appointment) => {
    e.dataTransfer.setData('text/plain', app.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedAppId(app.id);
  };

  const handleDragEnd = () => {
    setDraggedAppId(null);
    setDragOverTarget(null);
  };

  const handleDragOver = (e: React.DragEvent, targetDate: string, targetTime: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverTarget?.date !== targetDate || dragOverTarget?.time !== targetTime) {
      setDragOverTarget({ date: targetDate, time: targetTime });
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetDate: string, targetTime: string) => {
    e.preventDefault();
    const appId = e.dataTransfer.getData('text/plain') || draggedAppId;
    setDraggedAppId(null);
    setDragOverTarget(null);

    if (!appId) return;

    const existingApp = appointments.find((a) => a.id === appId);
    if (!existingApp) return;

    // Avoid redundant drop
    if (existingApp.date === targetDate && existingApp.time === targetTime) return;

    const prevSnapshot = { ...existingApp };

    // Execute reschedule
    rescheduleAppointment(appId, targetDate, targetTime);

    // Show undo toast
    setToastNotification({
      message: `Rendez-vous de ${existingApp.patientName} reprogrammé au ${targetDate} à ${targetTime}`,
      prevApp: prevSnapshot,
    });

    // Auto dismiss toast after 8s
    setTimeout(() => {
      setToastNotification(null);
    }, 8000);
  };

  const handleUndo = () => {
    if (!toastNotification) return;
    const { prevApp } = toastNotification;
    rescheduleAppointment(prevApp.id, prevApp.date, prevApp.time, prevApp.doctorName);
    setToastNotification(null);
  };

  // Color helper based on appointment type
  const getTypeBadgeClass = (type: Appointment['type']) => {
    switch (type) {
      case 'Consultation':
        return 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100';
      case 'Détartrage':
        return 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100';
      case 'Extraction':
        return 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100';
      case 'Soin':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100';
      case 'Contrôle':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
      case 'Urgence':
        return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Filtering
  const filteredAppointments = appointments.filter((app) => {
    const matchesDoc = filterDoctor === 'all' || app.doctorName === filterDoctor;
    const matchesPatient =
      !patientSearch ||
      app.patientName.toLowerCase().includes(patientSearch.toLowerCase());
    return matchesDoc && matchesPatient;
  });

  // Helper for Week View Days
  const getWeekDays = (baseDateStr: string) => {
    const curr = new Date(baseDateStr);
    const dayOfWeek = curr.getDay(); // 0 is Sunday
    // Adjust to Monday start
    const distanceToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(curr);
    monday.setDate(curr.getDate() + distanceToMon);

    const days = [];
    const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      days.push({
        dateStr: iso,
        dayName: dayNames[i],
        dayNumber: d.getDate(),
        monthShort: d.toLocaleString('fr-FR', { month: 'short' }),
        isToday: iso === '2026-07-24',
        isSelected: iso === selectedDate,
      });
    }
    return days;
  };

  // Helper for Month View Days
  const getMonthDays = (baseDateStr: string) => {
    const curr = new Date(baseDateStr);
    const year = curr.getFullYear();
    const month = curr.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    let startDayOfWeek = firstDayOfMonth.getDay(); // 0 Sunday
    if (startDayOfWeek === 0) startDayOfWeek = 7; // Convert to Monday start (1..7)

    const totalDays = lastDayOfMonth.getDate();
    const daysArr = [];

    // Padding before 1st of month
    for (let p = 1; p < startDayOfWeek; p++) {
      daysArr.push(null);
    }

    // Days of the month
    for (let d = 1; d <= totalDays; d++) {
      const dayObj = new Date(year, month, d);
      // Format as YYYY-MM-DD
      const monthFormatted = (month + 1).toString().padStart(2, '0');
      const dayFormatted = d.toString().padStart(2, '0');
      const iso = `${year}-${monthFormatted}-${dayFormatted}`;
      daysArr.push({
        dayNumber: d,
        dateStr: iso,
        isToday: iso === '2026-07-24',
        isSelected: iso === selectedDate,
      });
    }

    return daysArr;
  };

  const weekDays = getWeekDays(selectedDate);
  const monthDays = getMonthDays(selectedDate);

  return (
    <div className="space-y-6 pb-12">
      {/* Undo Toast Notification */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-sky-500/40 flex items-center gap-4 animate-in slide-in-from-bottom duration-200 max-w-md">
          <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
            <Move className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <p className="font-bold text-white">{toastNotification.message}</p>
            <p className="text-[10px] text-slate-300">Modifications sauvegardées avec succès.</p>
          </div>
          <button
            onClick={handleUndo}
            className="px-3 py-1.5 text-xs font-bold text-sky-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Annuler</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {t('appointments')}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold text-[11px] border border-sky-200/80 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-600" />
              Glisser-Déposer Actif
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500">
            Faites glisser n'importe quel rendez-vous vers un nouveau créneau ou jour pour le reprogrammer.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('new_appointment')}</span>
        </button>
      </div>

      {/* Toolbar & View Mode Switcher */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Left: View Mode Tabs */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl w-full lg:w-auto overflow-x-auto">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                viewMode === 'day'
                  ? 'bg-white text-sky-900 shadow-sm border border-slate-100 font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Jour (Horaire)</span>
            </button>

            <button
              onClick={() => setViewMode('week')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                viewMode === 'week'
                  ? 'bg-white text-sky-900 shadow-sm border border-slate-100 font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Semaine</span>
            </button>

            <button
              onClick={() => setViewMode('month')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-white text-sky-900 shadow-sm border border-slate-100 font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Mois</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-sky-900 shadow-sm border border-slate-100 font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Liste</span>
            </button>
          </div>

          {/* Right: Date Navigation Controls */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
            <button
              onClick={() => {
                const d = new Date(selectedDate);
                if (viewMode === 'week') d.setDate(d.getDate() - 7);
                else if (viewMode === 'month') d.setMonth(d.getMonth() - 1);
                else d.setDate(d.getDate() - 1);
                setSelectedDate(d.toISOString().split('T')[0]);
              }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="Précédent"
            >
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            </button>

            <div className="relative flex items-center">
              <CalendarIcon className="w-4 h-4 text-sky-600 absolute left-3 pointer-events-none rtl:right-3 rtl:left-auto" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-9 pr-3 rtl:pr-9 rtl:pl-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 text-slate-800"
              />
            </div>

            <button
              onClick={() => {
                const d = new Date(selectedDate);
                if (viewMode === 'week') d.setDate(d.getDate() + 7);
                else if (viewMode === 'month') d.setMonth(d.getMonth() + 1);
                else d.setDate(d.getDate() + 1);
                setSelectedDate(d.toISOString().split('T')[0]);
              }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="Suivant"
            >
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </button>

            <button
              onClick={() => setSelectedDate('2026-07-24')}
              className="px-3 py-2 text-xs font-bold bg-sky-50 text-sky-700 rounded-xl border border-sky-200 hover:bg-sky-100 transition-colors cursor-pointer"
            >
              Aujourd'hui
            </button>
          </div>
        </div>

        {/* Filters Bar: Search & Doctor */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1 w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:right-3 rtl:left-auto" />
            <input
              type="text"
              placeholder="Rechercher par nom de patient..."
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              className="w-full pl-9 pr-3 rtl:pr-9 rtl:pl-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 shrink-0">Praticien:</span>
            <select
              value={filterDoctor}
              onChange={(e) => setFilterDoctor(e.target.value)}
              className="w-full sm:w-auto py-2 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 text-slate-700 cursor-pointer"
            >
              <option value="all">Tous les médecins</option>
              {staffMembers
                .filter((s) => s.role === 'Médecin' || s.role === 'Admin')
                .map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* ================= MODE 1: DAY VIEW (HOURLY TIMETABLE GRID WITH DRAG DROP) ================= */}
      {viewMode === 'day' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between font-bold text-xs text-slate-600 uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>HORAIRE DU JOUR ({selectedDate})</span>
            </span>
            <span className="text-[11px] text-sky-700 font-semibold normal-case">
              💡 Astuce: Attrapez n'importe quelle carte pour la déposer sur un autre horaire.
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {hours.map((hour) => {
              const slotApps = filteredAppointments.filter(
                (a) => a.date === selectedDate && a.time === hour
              );

              const isTargetSlot =
                dragOverTarget?.date === selectedDate && dragOverTarget?.time === hour;

              return (
                <div
                  key={hour}
                  onDragOver={(e) => handleDragOver(e, selectedDate, hour)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, selectedDate, hour)}
                  className={`flex min-h-[72px] transition-all relative ${
                    isTargetSlot
                      ? 'bg-sky-100/70 border-2 border-dashed border-sky-500'
                      : 'hover:bg-slate-50/50'
                  }`}
                >
                  {/* Hour Label */}
                  <div
                    onClick={() => handleOpenNewModalWithSlot(selectedDate, hour)}
                    className="w-24 p-3 border-r border-slate-100 flex flex-col items-center justify-center font-bold text-xs text-slate-500 bg-slate-50/30 shrink-0 cursor-pointer hover:bg-sky-50 transition-colors group"
                    title="Cliquer pour ajouter un RDV à cet horaire"
                  >
                    <span className="group-hover:text-sky-600 transition-colors">{hour}</span>
                    <span className="text-[9px] text-slate-400 group-hover:text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      + Ajouter
                    </span>
                  </div>

                  {/* Slot Appointments Container */}
                  <div className="flex-1 p-2.5 flex flex-wrap items-center gap-2.5 min-h-[72px]">
                    {isTargetSlot && (
                      <div className="w-full p-2 rounded-2xl bg-sky-200/60 border-2 border-dashed border-sky-600 text-sky-900 text-xs font-bold flex items-center justify-center gap-2 animate-pulse">
                        <Sparkles className="w-4 h-4 text-sky-600" />
                        <span>Déposer le rendez-vous ici pour reprogrammer à {hour}</span>
                      </div>
                    )}

                    {slotApps.length === 0 && !isTargetSlot ? (
                      <div
                        onClick={() => handleOpenNewModalWithSlot(selectedDate, hour)}
                        className="w-full h-full min-h-[44px] flex items-center justify-between text-[11px] text-slate-300 hover:text-sky-600 italic px-3 py-1.5 rounded-xl hover:bg-sky-50/50 cursor-pointer border border-transparent hover:border-sky-200/60 transition-all group"
                      >
                        <span>Créneau disponible</span>
                        <span className="text-xs font-bold text-sky-600 opacity-0 group-hover:opacity-100 flex items-center gap-1">
                          <Plus className="w-3.5 h-3.5" /> Programmer
                        </span>
                      </div>
                    ) : (
                      slotApps.map((app) => (
                        <div
                          key={app.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, app)}
                          onDragEnd={handleDragEnd}
                          onClick={() => setSelectedAppointment(app)}
                          className={`flex-1 min-w-[260px] p-3 rounded-2xl border flex items-center justify-between shadow-sm cursor-grab active:cursor-grabbing transition-all hover:shadow-md ${getTypeBadgeClass(
                            app.type
                          )} ${draggedAppId === app.id ? 'opacity-40 scale-95 border-dashed border-sky-500' : ''}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing">
                              <GripVertical className="w-4 h-4" />
                            </div>

                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-xs text-slate-900">
                                  {app.patientName}
                                </span>
                                <span className="px-2 py-0.2 rounded-md bg-white/80 text-[10px] font-bold border border-slate-200">
                                  {app.durationMinutes} min
                                </span>
                              </div>
                              <p className="text-[11px] font-semibold text-slate-600">
                                {app.doctorName} • <span className="font-bold">{app.type}</span>
                              </p>
                              {app.notes && (
                                <p className="text-[10px] text-slate-500 italic line-clamp-1">
                                  "{app.notes}"
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                app.status === 'Terminé'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : app.status === 'En cours'
                                  ? 'bg-amber-100 text-amber-800 animate-pulse'
                                  : 'bg-sky-100 text-sky-800'
                              }`}
                            >
                              {app.status}
                            </span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateAppointmentStatus(
                                  app.id,
                                  app.status === 'Terminé' ? 'Programmé' : 'Terminé'
                                );
                              }}
                              className="p-1.5 rounded-lg hover:bg-white/80 text-slate-700 transition-colors cursor-pointer"
                              title="Changer statut"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= MODE 2: WEEK VIEW (7 DAYS MATRIX DRAG & DROP) ================= */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden space-y-2">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between font-bold text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-sky-600" />
              <span>
                VUE SEMAINE (Du {weekDays[0].dateStr} au {weekDays[6].dateStr})
              </span>
            </div>
            <p className="text-[11px] text-sky-700 font-semibold">
              Déplacez un RDV entre n'importe quel jour et créneau horaire.
            </p>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Day Columns Headers */}
              <div className="grid grid-cols-8 bg-slate-100/70 border-b border-slate-200 text-center text-xs font-bold text-slate-700 divide-x divide-slate-200">
                <div className="p-3 text-slate-400 uppercase text-[10px]">HORAIRE</div>
                {weekDays.map((day) => (
                  <div
                    key={day.dateStr}
                    onClick={() => setSelectedDate(day.dateStr)}
                    className={`p-2.5 cursor-pointer transition-colors ${
                      day.isSelected
                        ? 'bg-sky-50 text-sky-900 border-b-2 border-sky-600 font-black'
                        : 'hover:bg-slate-200/50'
                    }`}
                  >
                    <p className="text-[11px] uppercase">{day.dayName}</p>
                    <p className="text-sm font-black">
                      {day.dayNumber} {day.monthShort}
                    </p>
                  </div>
                ))}
              </div>

              {/* Weekly Time Grid */}
              <div className="divide-y divide-slate-100">
                {hours.map((hour) => (
                  <div key={hour} className="grid grid-cols-8 divide-x divide-slate-100 min-h-[60px]">
                    {/* Time Label */}
                    <div className="p-2 bg-slate-50/40 text-center font-bold text-[11px] text-slate-400 flex items-center justify-center">
                      {hour}
                    </div>

                    {/* 7 Days Columns for this hour */}
                    {weekDays.map((day) => {
                      const dayApps = filteredAppointments.filter(
                        (a) => a.date === day.dateStr && a.time === hour
                      );
                      const isTarget =
                        dragOverTarget?.date === day.dateStr && dragOverTarget?.time === hour;

                      return (
                        <div
                          key={day.dateStr}
                          onDragOver={(e) => handleDragOver(e, day.dateStr, hour)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, day.dateStr, hour)}
                          onClick={() => handleOpenNewModalWithSlot(day.dateStr, hour)}
                          className={`p-1.5 transition-all relative group cursor-pointer ${
                            isTarget
                              ? 'bg-sky-200/80 border-2 border-dashed border-sky-600'
                              : 'hover:bg-sky-50/30'
                          }`}
                        >
                          {isTarget && (
                            <div className="p-1 rounded-lg bg-sky-600 text-white text-[9px] font-black text-center shadow">
                              Lâcher à {hour}
                            </div>
                          )}

                          {dayApps.map((app) => (
                            <div
                              key={app.id}
                              draggable
                              onDragStart={(e) => {
                                e.stopPropagation();
                                handleDragStart(e, app);
                              }}
                              onDragEnd={handleDragEnd}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAppointment(app);
                              }}
                              className={`p-1.5 mb-1 rounded-xl border text-[11px] font-bold shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${getTypeBadgeClass(
                                app.type
                              )} ${draggedAppId === app.id ? 'opacity-40 border-dashed' : ''}`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="truncate text-slate-900 font-black">
                                  {app.patientName}
                                </span>
                                <GripVertical className="w-3 h-3 text-slate-400 shrink-0" />
                              </div>
                              <p className="text-[9px] text-slate-600 font-medium truncate">
                                {app.type}
                              </p>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODE 3: MONTH VIEW (CALENDAR GRID DRAG & DROP) ================= */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-sky-600" />
              <span>VUE MENSUELLE DE PLANIFICATION</span>
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              Glissez un rendez-vous sur n'importe quelle case de jour pour modifier sa date.
            </p>
          </div>

          <div className="grid grid-cols-7 text-center font-bold text-xs text-slate-500 py-2 border-b border-slate-100">
            <span>Lun</span>
            <span>Mar</span>
            <span>Mer</span>
            <span>Jeu</span>
            <span>Ven</span>
            <span>Sam</span>
            <span>Dim</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {monthDays.map((day, idx) => {
              if (!day) {
                return <div key={`pad-${idx}`} className="h-28 bg-slate-50/30 rounded-2xl"></div>;
              }

              const dayApps = filteredAppointments.filter((a) => a.date === day.dateStr);
              const isTarget = dragOverTarget?.date === day.dateStr;

              return (
                <div
                  key={day.dateStr}
                  onDragOver={(e) => handleDragOver(e, day.dateStr, '09:00')}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, day.dateStr, '09:00')}
                  onClick={() => setSelectedDate(day.dateStr)}
                  className={`h-28 p-2 rounded-2xl border transition-all overflow-y-auto custom-scrollbar flex flex-col justify-between cursor-pointer ${
                    isTarget
                      ? 'bg-sky-100 border-2 border-dashed border-sky-600 ring-2 ring-sky-400'
                      : day.isSelected
                      ? 'bg-sky-50/80 border-sky-300'
                      : 'bg-white border-slate-200/80 hover:border-sky-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center ${
                        day.isToday
                          ? 'bg-sky-600 text-white'
                          : day.isSelected
                          ? 'bg-sky-200 text-sky-900'
                          : 'text-slate-700'
                      }`}
                    >
                      {day.dayNumber}
                    </span>
                    {dayApps.length > 0 && (
                      <span className="px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {dayApps.length} RDV
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 flex-1">
                    {dayApps.slice(0, 2).map((app) => (
                      <div
                        key={app.id}
                        draggable
                        onDragStart={(e) => {
                          e.stopPropagation();
                          handleDragStart(e, app);
                        }}
                        onDragEnd={handleDragEnd}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAppointment(app);
                        }}
                        className={`p-1 rounded-lg border text-[10px] font-bold truncate cursor-grab active:cursor-grabbing shadow-2xs ${getTypeBadgeClass(
                          app.type
                        )}`}
                      >
                        {app.time} - {app.patientName}
                      </div>
                    ))}
                    {dayApps.length > 2 && (
                      <p className="text-[9px] font-bold text-sky-600 text-center">
                        +{dayApps.length - 2} autres...
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= MODE 4: LIST VIEW ================= */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900">
              LISTE DES RENDEZ-VOUS DU {selectedDate}
            </h3>
            <span className="text-xs font-bold text-slate-500">
              Total: {filteredAppointments.filter((a) => a.date === selectedDate).length} RDV
            </span>
          </div>

          <div className="border border-slate-200/80 rounded-2xl overflow-hidden">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Horaire</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Praticien</th>
                  <th className="p-3">Acte / Soin</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredAppointments.filter((a) => a.date === selectedDate).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                      Aucun rendez-vous programmé pour cette date.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments
                    .filter((a) => a.date === selectedDate)
                    .map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/60">
                        <td className="p-3 font-black text-sky-600">{app.time}</td>
                        <td className="p-3 font-bold text-slate-900">{app.patientName}</td>
                        <td className="p-3 text-slate-600">{app.doctorName}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${getTypeBadgeClass(
                              app.type
                            )}`}
                          >
                            {app.type} ({app.durationMinutes} min)
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              app.status === 'Terminé'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-sky-100 text-sky-800'
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedAppointment(app)}
                            className="px-2.5 py-1 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors cursor-pointer"
                          >
                            Détails
                          </button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODAL: SELECTED APPOINTMENT INSPECTOR ================= */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden space-y-4 p-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Fiche Rendez-vous</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedAppointment.patientName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>Date & Horaire:</span>
                  <span className="text-sky-700 font-black text-sm">
                    {selectedAppointment.date} à {selectedAppointment.time}
                  </span>
                </div>
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>Praticien:</span>
                  <span>{selectedAppointment.doctorName}</span>
                </div>
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>Type d'acte:</span>
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold border ${getTypeBadgeClass(
                      selectedAppointment.type
                    )}`}
                  >
                    {selectedAppointment.type} ({selectedAppointment.durationMinutes} min)
                  </span>
                </div>
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>Statut:</span>
                  <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold">
                    {selectedAppointment.status}
                  </span>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl space-y-1">
                  <p className="font-bold text-amber-900">Notes du praticien:</p>
                  <p className="text-amber-800 font-medium">"{selectedAppointment.notes}"</p>
                </div>
              )}

              {/* Quick Reschedule Dropdown inside modal */}
              <div className="p-3.5 bg-sky-50/60 border border-slate-100 rounded-2xl space-y-2">
                <p className="font-bold text-sky-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  <span>Reprogrammer manuellement</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={selectedAppointment.date}
                    onChange={(e) => {
                      rescheduleAppointment(selectedAppointment.id, e.target.value, selectedAppointment.time);
                      setSelectedAppointment({ ...selectedAppointment, date: e.target.value });
                    }}
                    className="p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs"
                  />
                  <select
                    value={selectedAppointment.time}
                    onChange={(e) => {
                      rescheduleAppointment(selectedAppointment.id, selectedAppointment.date, e.target.value);
                      setSelectedAppointment({ ...selectedAppointment, time: e.target.value });
                    }}
                    className="p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs cursor-pointer"
                  >
                    {hours.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={() => {
                  openPatientWorkspace(selectedAppointment.patientId);
                  setSelectedAppointment(null);
                }}
                className="px-3.5 py-2 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Ouvrir Dossier Patient</span>
              </button>

              <button
                onClick={() => {
                  updateAppointmentStatus(
                    selectedAppointment.id,
                    selectedAppointment.status === 'Terminé' ? 'Programmé' : 'Terminé'
                  );
                  setSelectedAppointment(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20"
              >
                {selectedAppointment.status === 'Terminé'
                  ? 'Marquer comme non-terminé'
                  : 'Marquer comme Terminé'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE APPOINTMENT ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">{t('create_appointment')}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('patient')}</label>
                <select
                  required
                  value={formPatientId}
                  onChange={(e) => setFormPatientId(e.target.value)}
                  className="w-full py-2.5 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/30 cursor-pointer"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('doctor')}</label>
                <select
                  value={formDoctor}
                  onChange={(e) => setFormDoctor(e.target.value)}
                  className="w-full py-2.5 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/30 cursor-pointer"
                >
                  {staffMembers
                    .filter((s) => s.role === 'Médecin' || s.role === 'Admin')
                    .map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('date')}</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full py-2.5 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('duration')}</label>
                  <select
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full py-2.5 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/30 cursor-pointer"
                  >
                    <option value={15}>15 min</option>
                    <option value={30}>30 min</option>
                    <option value={45}>45 min</option>
                    <option value={60}>60 min</option>
                    <option value={90}>90 min</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('time')}</label>
                  <select
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full py-2.5 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/30 cursor-pointer"
                  >
                    {hours.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('type')}</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as Appointment['type'])}
                    className="w-full py-2.5 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/30 cursor-pointer"
                  >
                    <option value="Consultation">Consultation</option>
                    <option value="Détartrage">Détartrage</option>
                    <option value="Extraction">Extraction</option>
                    <option value="Soin">Soin dentaire</option>
                    <option value="Contrôle">Contrôle</option>
                    <option value="Urgence">Urgence</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('notes')}</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Notes optionnelles..."
                  className="w-full p-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/30"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 rounded-xl shadow-md shadow-sky-500/20 transition-all cursor-pointer"
                >
                  {t('book_appointment')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
