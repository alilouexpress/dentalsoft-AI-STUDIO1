import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient } from '../../types';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertTriangle,
  Heart,
  Shield,
  Clock,
  FileText,
  DollarSign,
  CreditCard,
  CheckCircle2,
  ExternalLink,
  Plus,
  Printer,
  X,
  Sparkles,
  Stethoscope,
  ChevronRight,
  Activity,
  AlertCircle,
  Pill,
} from 'lucide-react';

interface PatientSummaryViewProps {
  patientId?: string;
  onOpenWorkspace?: () => void;
  onCloseModal?: () => void;
  isEmbeddedInModal?: boolean;
}

export const PatientSummaryView: React.FC<PatientSummaryViewProps> = ({
  patientId,
  onOpenWorkspace,
  onCloseModal,
  isEmbeddedInModal = false,
}) => {
  const {
    patients,
    activePatientId,
    appointments,
    invoices,
    debts,
    patientTreatments,
    prescriptions,
    teethData,
    addPayment,
    addAppointment,
    openPatientWorkspace,
    t,
  } = useApp();

  const targetId = patientId || activePatientId;
  const patient = patients.find((p) => p.id === targetId) || patients[0];

  // Modals / Actions state within Summary
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Espèces' | 'Chèque' | 'Carte'>('Espèces');

  const [isAddApptModalOpen, setIsAddApptModalOpen] = useState(false);
  const [newApptDate, setNewApptDate] = useState(new Date().toISOString().split('T')[0]);
  const [newApptTime, setNewApptTime] = useState('10:00');
  const [newApptType, setNewApptType] = useState<'Consultation' | 'Détartrage' | 'Extraction' | 'Soin' | 'Contrôle' | 'Urgence'>('Consultation');

  if (!patient) return null;

  // 1. Patient Appointments
  const patientAppointments = appointments.filter((a) => a.patientId === patient.id);
  const upcomingAppointments = patientAppointments.filter(
    (a) => a.status === 'Programmé' || a.status === 'En cours'
  );

  // 2. Patient Invoices & Debts
  const patientInvoices = invoices.filter((inv) => inv.patientId === patient.id);
  const outstandingInvoices = patientInvoices.filter(
    (inv) => inv.status === 'Overdue' || inv.status === 'Pending' || inv.remainingAmount > 0
  );

  const patientDebt = debts.find((d) => d.patientId === patient.id);
  const totalOutstandingBalance =
    patient.balance > 0
      ? patient.balance
      : outstandingInvoices.reduce((acc, curr) => acc + curr.remainingAmount, 0);

  // 3. Patient Medical & Treatment History
  const patientTreats = patientTreatments.filter((t) => t.patientId === patient.id);
  const patientPrescs = prescriptions.filter((p) => p.patientId === patient.id);
  const patientTeeth = teethData[patient.id] || {};

  // Handle settling an invoice
  const handleOpenSettleInvoice = (inv: any) => {
    setSelectedInvoice(inv);
    setPaymentAmount(inv.remainingAmount || inv.totalAmount);
    setIsSettleModalOpen(true);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentAmount) return;

    addPayment({
      patientId: patient.id,
      patientName: patient.name,
      amount: paymentAmount,
      method: paymentMethod,
      date: new Date().toLocaleString('fr-FR'),
      linkedInvoiceId: selectedInvoice?.id,
      notes: `Règlement facture ${selectedInvoice?.number || ''}`,
    });

    setIsSettleModalOpen(false);
  };

  // Handle Quick Add Appointment from Summary
  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    addAppointment({
      patientId: patient.id,
      patientName: patient.name,
      doctorName: 'Dr. Amrani Samir',
      date: newApptDate,
      time: newApptTime,
      durationMinutes: 45,
      type: newApptType,
      notes: 'Programmé via Synthèse Patient',
    });
    setIsAddApptModalOpen(false);
  };

  const handleNavigateWorkspace = () => {
    if (onCloseModal) onCloseModal();
    openPatientWorkspace(patient.id);
    if (onOpenWorkspace) onOpenWorkspace();
  };

  return (
    <div className="space-y-6">
      {/* ---------------- PATIENT PROFILE HEADER CARD ---------------- */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden border border-sky-800/40">
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-sky-500/15 blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          {/* Main Info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-sky-400 to-sky-600 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-sky-500/30 ring-4 ring-white/10 shrink-0">
              {patient.name.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {patient.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-sky-200 text-xs font-mono font-bold border border-white/15">
                  {patient.code}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    patient.status === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : patient.status === 'En traitement'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {patient.status}
                </span>

                {patient.isHighRisk && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-500/30 text-rose-200 border border-rose-500/40 flex items-center gap-1 animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Haut Risque Médical
                  </span>
                )}
              </div>

              <p className="text-xs text-sky-200/80 font-medium flex items-center gap-3 flex-wrap">
                <span>{patient.age} ans</span>
                <span>•</span>
                <span>{patient.gender === 'Male' ? 'Homme' : 'Femme'}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-sky-400" />
                  {patient.phone}
                </span>
                {patient.email && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-sky-400" />
                      {patient.email}
                    </span>
                  </>
                )}
              </p>

              {/* Extra Badges: Blood & Insurance */}
              <div className="flex items-center gap-2 pt-1 flex-wrap text-[11px]">
                {patient.bloodGroup && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-rose-500/20 text-rose-200 font-bold border border-rose-500/30">
                    <Heart className="w-3 h-3 text-rose-400" />
                    Groupe {patient.bloodGroup}
                  </span>
                )}
                {patient.insuranceName && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-200 font-medium border border-indigo-500/30">
                    <Shield className="w-3 h-3 text-indigo-400" />
                    Assurance: {patient.insuranceName} ({patient.insuranceNumber || 'N/A'})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              onClick={() => setIsAddApptModalOpen(true)}
              className="px-3.5 py-2.5 text-xs font-bold text-sky-900 bg-sky-200 hover:bg-white rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-sky-700" />
              <span>Nouveau RDV</span>
            </button>

            <button
              onClick={handleNavigateWorkspace}
              className="px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 rounded-xl shadow-lg shadow-sky-500/30 transition-all flex items-center gap-2 cursor-pointer ring-2 ring-white/20"
            >
              <span>{t('view_full_workspace')}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- 3 CORE METRIC HIGHLIGHT CARDS ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Solde Dû / Outstanding */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              SOLDE DÛ TOTAL
            </p>
            <p
              className={`text-2xl font-black ${
                totalOutstandingBalance > 0 ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {totalOutstandingBalance.toFixed(2)} DA
            </p>
            <p className="text-[11px] font-semibold text-slate-500">
              {totalOutstandingBalance > 0
                ? `${outstandingInvoices.length} facture(s) impayée(s)`
                : 'Compte entièrement à jour'}
            </p>
          </div>
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              totalOutstandingBalance > 0
                ? 'bg-rose-50 text-rose-600'
                : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Prochain Rendez-vous */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              PROCHAIN RENDEZ-VOUS
            </p>
            <p className="text-base font-black text-slate-900">
              {upcomingAppointments.length > 0
                ? `${upcomingAppointments[0].date} à ${upcomingAppointments[0].time}`
                : 'Aucun prévu'}
            </p>
            <p className="text-[11px] font-semibold text-sky-600">
              {upcomingAppointments.length > 0
                ? upcomingAppointments[0].type
                : 'Cliquez pour programmer'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Soins En Cours & Consultations */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              DERNIÈRE VISITE
            </p>
            <p className="text-base font-black text-slate-900">{patient.lastVisit}</p>
            <p className="text-[11px] font-semibold text-slate-500">
              {patientTreats.length} soin(s) au dossier
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Stethoscope className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ---------------- MAIN 3 CORE SECTIONS ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Medical History & Outstanding Invoices */}
        <div className="lg:col-span-7 space-y-6">
          {/* ================= SECTION 1: MEDICAL HISTORY ================= */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    {t('medical_history')}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Antécédents cliniques, allergies & traitements dentaires.
                  </p>
                </div>
              </div>

              {patient.bloodGroup && (
                <span className="px-3 py-1 rounded-xl bg-rose-100 text-rose-800 text-xs font-black">
                  {patient.bloodGroup}
                </span>
              )}
            </div>

            {/* Allergies & Medical Conditions Alert Box */}
            <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Alertes Médicales & Allergies</span>
              </div>
              <p className="text-xs font-medium text-amber-900/90 pl-6 leading-relaxed">
                {patient.notes || 'Aucune contre-indication majeure enregistrée dans le dossier.'}
              </p>
            </div>

            {/* Teeth Condition Summary */}
            {Object.keys(patientTeeth).length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
                  <span>Dents avec Pathologies / Traitements Traités</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {Object.entries(patientTeeth).map(([toothNum, tooth]: [string, any]) => (
                    <div
                      key={toothNum}
                      className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-black text-slate-900">
                          Dent #{toothNum}
                        </span>
                        <p className="text-[11px] font-medium text-slate-500">
                          {tooth.notes || tooth.treatmentNeeded || 'En observation'}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          tooth.status === 'carie'
                            ? 'bg-rose-100 text-rose-800'
                            : tooth.status === 'couronne'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {tooth.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Treatments & Procedures Table */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-sky-600" />
                <span>Historique des Soins & Interventions</span>
              </h4>

              {patientTreats.length === 0 ? (
                <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl text-center text-xs text-slate-500 font-medium">
                  Aucun acte de soin répertorié.
                </div>
              ) : (
                <div className="border border-slate-200/80 rounded-2xl overflow-hidden">
                  <table className="w-full text-left rtl:text-right text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Soin / Acte</th>
                        <th className="p-3">Dent</th>
                        <th className="p-3">Statut</th>
                        <th className="p-3 text-right">Coût</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                      {patientTreats.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/60">
                          <td className="p-3 font-bold text-slate-900">{t.name}</td>
                          <td className="p-3 text-slate-500">
                            {t.toothId ? `#${t.toothId}` : 'Général'}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                t.status === 'Terminé'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-sky-100 text-sky-800'
                              }`}
                            >
                              {t.status}
                            </span>
                          </td>
                          <td className="p-3 text-right font-bold text-slate-900">
                            {t.cost.toFixed(2)} DA
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Prescriptions History */}
            {patientPrescs.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <Pill className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Dernière Ordonnance</span>
                </h4>
                <div className="p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-950">
                    <span>Date: {patientPrescs[0].date}</span>
                    <span className="text-[11px] text-indigo-600 font-normal">
                      Par {patientPrescs[0].doctorName}
                    </span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-indigo-900 space-y-1">
                    {patientPrescs[0].medications.map((m, idx) => (
                      <li key={idx} className="font-semibold">
                        {m.name} — <span className="font-normal text-slate-600">{m.dosage} ({m.duration})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* ================= SECTION 3: OUTSTANDING INVOICES ================= */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    {t('outstanding_invoices')}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Suivi de la facturation, des acomptes et des impayés.
                  </p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-xl text-xs font-black ${
                  totalOutstandingBalance > 0
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                Reste: {totalOutstandingBalance.toFixed(2)} DA
              </span>
            </div>

            {/* Outstanding Invoices List */}
            {outstandingInvoices.length === 0 ? (
              <div className="py-8 text-center bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="text-xs font-black text-emerald-900">
                  {t('no_outstanding_invoices')}
                </h4>
                <p className="text-[11px] font-medium text-emerald-700">
                  Le patient n'a aucune dette ni facture en souffrance.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {outstandingInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-sky-300 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-xs">
                          Facture #{inv.number}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            inv.status === 'Overdue'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {inv.status === 'Overdue' ? 'En Retard' : 'En Attente'}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 font-medium">
                        Émise le {inv.issueDate} • Échéance: {inv.dueDate}
                      </p>

                      <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 pt-1">
                        <span>Total: {inv.totalAmount.toFixed(2)} DA</span>
                        <span>•</span>
                        <span className="text-emerald-700">Payé: {inv.paidAmount.toFixed(2)} DA</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Reste dû</p>
                        <p className="text-sm font-black text-rose-600">
                          {inv.remainingAmount.toFixed(2)} DA
                        </p>
                      </div>

                      <button
                        onClick={() => handleOpenSettleInvoice(inv)}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Régler</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Upcoming Appointments & Quick Contact */}
        <div className="lg:col-span-5 space-y-6">
          {/* ================= SECTION 2: UPCOMING APPOINTMENTS ================= */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    {t('upcoming_appointments')}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Prochains rendez-vous programmés.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddApptModalOpen(true)}
                className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-600 transition-colors cursor-pointer"
                title="Programmer un rendez-vous"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Upcoming Appointments List */}
            {upcomingAppointments.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
                <h4 className="text-xs font-bold text-slate-700">
                  {t('no_upcoming_appointments')}
                </h4>
                <p className="text-[11px] text-slate-400">
                  Aucune consultation future programmée.
                </p>
                <button
                  onClick={() => setIsAddApptModalOpen(true)}
                  className="mt-2 px-3.5 py-1.5 text-xs font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nouveau Rendez-vous</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="p-4 bg-sky-50/60 border border-slate-100 rounded-2xl space-y-2 hover:bg-sky-50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-sky-500 text-white font-black text-[10px]">
                          {appt.time}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {appt.date}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-200/80 text-sky-900">
                        {appt.type}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-800">
                        Praticien: {appt.doctorName}
                      </p>
                      {appt.notes && (
                        <p className="text-[11px] text-slate-500 italic line-clamp-2">
                          "{appt.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Contact & Emergency Details Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-sky-600" />
              <span>Coordonnées & Urgences</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Téléphone Principal</span>
                <span className="font-bold text-slate-900">{patient.phone}</span>
              </div>

              {patient.emergencyContact && (
                <div className="p-3 bg-rose-50/80 border border-rose-100 rounded-xl space-y-1">
                  <div className="flex items-center justify-between font-bold text-rose-950">
                    <span>{t('emergency_contact')}</span>
                    <span>{patient.emergencyContact}</span>
                  </div>
                  <p className="text-[11px] font-semibold text-rose-700">
                    Tél: {patient.emergencyPhone || patient.phone}
                  </p>
                </div>
              )}

              {patient.address && (
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Adresse</span>
                  <span className="font-bold text-slate-900 text-right">{patient.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL: SETTLE INVOICE / RECORD PAYMENT ================= */}
      {isSettleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden space-y-4 p-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Régler la facture</h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Facture #{selectedInvoice?.number}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSettleModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Montant à Régler (DA)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mode de Paiement</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 cursor-pointer"
                >
                  <option value="Espèces">Espèces</option>
                  <option value="Carte">Carte CIB / Edahabia</option>
                  <option value="Chèque">Chèque Bancaire</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSettleModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20"
                >
                  Valider le Paiement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: QUICK ADD APPOINTMENT ================= */}
      {isAddApptModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden space-y-4 p-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Programmer un Rendez-vous</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Pour {patient.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddApptModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newApptDate}
                    onChange={(e) => setNewApptDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Heure</label>
                  <input
                    type="time"
                    required
                    value={newApptTime}
                    onChange={(e) => setNewApptTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Type d'acte</label>
                <select
                  value={newApptType}
                  onChange={(e) => setNewApptType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 cursor-pointer"
                >
                  <option value="Consultation">Consultation</option>
                  <option value="Détartrage">Détartrage</option>
                  <option value="Soin">Soin Dentaire</option>
                  <option value="Extraction">Extraction</option>
                  <option value="Contrôle">Contrôle</option>
                  <option value="Urgence">Urgence</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddApptModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md shadow-sky-600/20"
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
