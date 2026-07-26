import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserPlus,
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  Shield,
  FileText,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Command,
  Clock,
  Save,
  RotateCcw,
  Trash2,
} from 'lucide-react';

const DRAFT_STORAGE_KEY = 'ds_patient_registration_draft';

export const QuickAddPatientModal: React.FC = () => {
  const {
    isQuickAddPatientOpen,
    closeQuickAddPatient,
    addPatient,
    addAppointment,
    openPatientWorkspace,
    staffMembers,
    addStaffNotification,
    addStaffMessage,
    t,
  } = useApp();

  const nameInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [birthDate, setBirthDate] = useState('');
  const [notes, setNotes] = useState('');
  const [insuranceName, setInsuranceName] = useState('');

  // Waiting Room / Doctor Handoff State
  const doctors = staffMembers.filter((s) => s.role === 'Médecin' || s.role === 'Admin');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors[0]?.id || 'staff-1');
  const [addToWaitingList, setAddToWaitingList] = useState<boolean>(true);
  const [waitingNotes, setWaitingNotes] = useState<string>('');

  // Quick Appointment Option
  const [createInitialAppt, setCreateInitialAppt] = useState(false);
  const [apptDate, setApptDate] = useState(new Date().toISOString().split('T')[0]);
  const [apptTime, setApptTime] = useState('09:00');
  const [apptType, setApptType] = useState('Consultation');

  // Success Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Draft Auto-Save State
  const [isDraftRestored, setIsDraftRestored] = useState<boolean>(false);
  const [lastDraftTime, setLastDraftTime] = useState<string | null>(null);

  // Load draft from localStorage when modal opens or on mount
  useEffect(() => {
    if (isQuickAddPatientOpen) {
      const savedDraftRaw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraftRaw) {
        try {
          const draft = JSON.parse(savedDraftRaw);
          if (draft && (draft.name || draft.phone || draft.email || draft.notes || draft.waitingNotes)) {
            setName(draft.name || '');
            setPhone(draft.phone || '');
            setAge(typeof draft.age === 'number' ? draft.age : 30);
            setGender(draft.gender === 'Female' ? 'Female' : 'Male');
            setEmail(draft.email || '');
            setAddress(draft.address || '');
            setBloodGroup(draft.bloodGroup || 'O+');
            setBirthDate(draft.birthDate || '');
            setNotes(draft.notes || '');
            setInsuranceName(draft.insuranceName || '');
            if (draft.selectedDoctorId) setSelectedDoctorId(draft.selectedDoctorId);
            if (typeof draft.addToWaitingList === 'boolean') setAddToWaitingList(draft.addToWaitingList);
            setWaitingNotes(draft.waitingNotes || '');
            if (typeof draft.createInitialAppt === 'boolean') setCreateInitialAppt(draft.createInitialAppt);
            if (draft.apptDate) setApptDate(draft.apptDate);
            if (draft.apptTime) setApptTime(draft.apptTime);
            if (draft.apptType) setApptType(draft.apptType);
            setIsDraftRestored(true);
            setLastDraftTime(draft.updatedAt || 'Récent');
          }
        } catch (e) {
          console.error('Error parsing patient registration draft', e);
        }
      }
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [isQuickAddPatientOpen]);

  // Auto-save form inputs to localStorage as user types
  useEffect(() => {
    if (!isQuickAddPatientOpen) return;

    const hasContent =
      name.trim() !== '' ||
      phone.trim() !== '' ||
      email.trim() !== '' ||
      address.trim() !== '' ||
      notes.trim() !== '' ||
      insuranceName.trim() !== '' ||
      waitingNotes.trim() !== '';

    if (hasContent) {
      const timeStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      const draftData = {
        name,
        phone,
        age,
        gender,
        email,
        address,
        bloodGroup,
        birthDate,
        notes,
        insuranceName,
        selectedDoctorId,
        addToWaitingList,
        waitingNotes,
        createInitialAppt,
        apptDate,
        apptTime,
        apptType,
        updatedAt: timeStr,
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
      setLastDraftTime(timeStr);
    }
  }, [
    isQuickAddPatientOpen,
    name,
    phone,
    age,
    gender,
    email,
    address,
    bloodGroup,
    birthDate,
    notes,
    insuranceName,
    selectedDoctorId,
    addToWaitingList,
    waitingNotes,
    createInitialAppt,
    apptDate,
    apptTime,
    apptType,
  ]);

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setIsDraftRestored(false);
    setLastDraftTime(null);
    resetForm();
  };

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isQuickAddPatientOpen) {
        closeQuickAddPatient();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isQuickAddPatientOpen, closeQuickAddPatient]);

  const resetForm = () => {
    setName('');
    setPhone('');
    setAge(30);
    setGender('Male');
    setEmail('');
    setAddress('');
    setBloodGroup('O+');
    setBirthDate('');
    setNotes('');
    setInsuranceName('');
    setCreateInitialAppt(false);
    setSelectedDoctorId(doctors[0]?.id || 'staff-1');
    setAddToWaitingList(true);
    setWaitingNotes('');
  };

  const handleCreatePatient = (openWorkspaceAfter: boolean) => {
    if (!name.trim()) return;

    // Clear draft upon successful creation
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setIsDraftRestored(false);
    setLastDraftTime(null);

    const formattedPhone = phone.trim() || '06 55 12 34 56';
    const formattedEmail =
      email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`;

    const newP = addPatient({
      name: name.trim(),
      age: age || 30,
      gender,
      phone: formattedPhone,
      email: formattedEmail,
      address: address.trim() || 'Alger, Algérie',
      bloodGroup,
      birthDate,
      insuranceName,
      notes: notes.trim(),
      // Waiting room info
      treatingDoctorId: selectedDoctorId,
      isWaiting: addToWaitingList,
      waitingSince: addToWaitingList ? new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : undefined,
      waitingNotes: addToWaitingList ? (waitingNotes.trim() || 'Contrôle général') : undefined,
      waitingStatus: addToWaitingList ? 'En attente' : undefined,
    });

    const activeDoc = staffMembers.find((s) => s.id === selectedDoctorId);

    if (addToWaitingList) {
      // 1. Send system notification to Doctor on duty
      addStaffNotification({
        type: 'patient_waiting',
        title: 'Nouveau patient en attente 🕒',
        message: `Le patient ${newP.name} est enregistré et vous attend en salle d'attente.`,
        targetDoctorId: selectedDoctorId,
        patientId: newP.id,
      });

      // 2. Dispatch internal staff message to the chat channel "#flow"
      addStaffMessage(
        `📢 ARRIVÉE : Le patient ${newP.name} (${newP.code}) est en salle d'attente pour ${activeDoc ? activeDoc.name : 'le Docteur de garde'}.${waitingNotes ? ` (Notes : ${waitingNotes})` : ''}`,
        'flow'
      );
    }

    // Optionally create initial appointment
    if (createInitialAppt && apptDate && apptTime) {
      addAppointment({
        patientId: newP.id,
        patientName: newP.name,
        doctorName: activeDoc ? activeDoc.name : 'Dr. Amrani Samir',
        date: apptDate,
        time: apptTime,
        durationMinutes: 30,
        type: apptType as any,
        notes: `RDV initial créé via ajout rapide. ${notes}`,
      });
    }

    if (openWorkspaceAfter) {
      closeQuickAddPatient();
      openPatientWorkspace(newP.id);
    } else {
      setToastMessage(`Patient "${newP.name}" enregistré (${newP.code}) !`);
      setTimeout(() => {
        setToastMessage(null);
        closeQuickAddPatient();
      }, 1500);
    }
  };

  if (!isQuickAddPatientOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] transition-all">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white flex items-center justify-between shrink-0 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-sky-500/20 blur-2xl pointer-events-none"></div>

          <div className="flex items-center gap-3.5 relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-400 to-sky-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 ring-2 ring-white/20 shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white">
                  {t('quick_add_patient')}
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 text-sky-200 text-[10px] font-mono border border-white/10">
                  Alt + P
                </span>
              </div>
              <p className="text-xs text-sky-200/80 font-medium line-clamp-1">
                {t('quick_add_subtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={closeQuickAddPatient}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer relative z-10"
            title="Fermer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Feedback */}
        {toastMessage ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">{toastMessage}</h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                Le dossier du patient est prêt.
              </p>
            </div>
          </div>
        ) : (
          /* Form Content */
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreatePatient(true);
            }}
            className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar text-xs"
          >
            {/* Draft Auto-Save Banner */}
            {(name.trim() !== '' ||
              phone.trim() !== '' ||
              email.trim() !== '' ||
              notes.trim() !== '' ||
              waitingNotes.trim() !== '' ||
              isDraftRestored) && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 bg-amber-50/90 border border-amber-200/80 rounded-2xl text-amber-950 font-medium animate-in fade-in duration-150">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold">
                    <Save className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-[11px] font-black text-amber-900">
                        {isDraftRestored ? 'Brouillon restauré' : 'Brouillon enregistré en temps réel'}
                      </p>
                      {lastDraftTime && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md">
                          à {lastDraftTime}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-amber-800/80">
                      Vos données saisies sont conservées en cas de fermeture ou rafraîchissement de la page.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={clearDraft}
                  className="px-2.5 py-1 text-[11px] font-bold text-amber-800 hover:text-rose-700 bg-amber-200/50 hover:bg-rose-100/80 rounded-xl transition-colors flex items-center gap-1 cursor-pointer shrink-0 self-end sm:self-auto"
                  title="Effacer le brouillon sauvegardé"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Effacer</span>
                </button>
              </div>
            )}

            {/* Primary Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-sky-600" />
                  <span>Nom complet *</span>
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Benali Mourad"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all placeholder:font-normal placeholder:text-slate-400"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-sky-600" />
                  <span>Téléphone *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06 55 12 34 56"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all placeholder:font-normal placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Age, Gender & Blood Group Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Âge</label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Sexe</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 cursor-pointer"
                >
                  <option value="Male">Homme</option>
                  <option value="Female">Femme</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-500" />
                  <span>Sang</span>
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 cursor-pointer"
                >
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            {/* Email & Address Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>E-mail</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patient@email.com (optionnel)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>Assurance</span>
                </label>
                <input
                  type="text"
                  value={insuranceName}
                  onChange={(e) => setInsuranceName(e.target.value)}
                  placeholder="ex: CNAS, CASNOS (optionnel)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                />
              </div>
            </div>

            {/* Medical Notes / Allergies */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                <span>Notes médicales / Allergies importantes</span>
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Allergie Pénicilline, Diabète, Hypertension, Peur du dentiste..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30"
              ></textarea>
            </div>

            {/* Waiting Room & Doctor Assignment (Handoff system) */}
            <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl space-y-3.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer font-bold text-emerald-950">
                  <input
                    type="checkbox"
                    checked={addToWaitingList}
                    onChange={(e) => setAddToWaitingList(e.target.checked)}
                    className="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5 text-emerald-900 text-xs font-bold">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    Mettre directement en salle d'attente
                  </span>
                </label>
                <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                  Aiguillage Médecin
                </span>
              </div>

              {addToWaitingList && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 animate-in fade-in duration-150 text-xs">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      Docteur en charge *
                    </label>
                    <select
                      value={selectedDoctorId}
                      onChange={(e) => setSelectedDoctorId(e.target.value)}
                      className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
                    >
                      {doctors.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name} ({doc.specialty || doc.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      Motif de visite / d'urgence
                    </label>
                    <input
                      type="text"
                      value={waitingNotes}
                      onChange={(e) => setWaitingNotes(e.target.value)}
                      placeholder="ex: Détartrage, Douleur intense, Contrôle..."
                      className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl font-semibold text-slate-900 placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Optional Initial Appointment Toggle */}
            <div className="p-3.5 bg-sky-50/70 border border-slate-100 rounded-2xl space-y-3">
              <label className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={createInitialAppt}
                  onChange={(e) => setCreateInitialAppt(e.target.checked)}
                  className="w-4 h-4 rounded accent-sky-500 cursor-pointer"
                />
                <span className="flex items-center gap-1.5 text-sky-900">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  Programmer un rendez-vous immédiat
                </span>
              </label>

              {createInitialAppt && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 animate-in fade-in duration-150">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                      Date
                    </label>
                    <input
                      type="date"
                      value={apptDate}
                      onChange={(e) => setApptDate(e.target.value)}
                      className="w-full p-2 bg-white border border-sky-200 rounded-xl font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                      Horaire
                    </label>
                    <input
                      type="time"
                      value={apptTime}
                      onChange={(e) => setApptTime(e.target.value)}
                      className="w-full p-2 bg-white border border-sky-200 rounded-xl font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                      Type
                    </label>
                    <select
                      value={apptType}
                      onChange={(e) => setApptType(e.target.value)}
                      className="w-full p-2 bg-white border border-sky-200 rounded-xl font-bold text-slate-800 cursor-pointer"
                    >
                      <option value="Consultation">Consultation</option>
                      <option value="Détartrage">Détartrage</option>
                      <option value="Urgence">Urgence</option>
                      <option value="Extraction">Extraction</option>
                      <option value="Orthodontie">Orthodontie</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={closeQuickAddPatient}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                {t('cancel')}
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => handleCreatePatient(false)}
                  disabled={!name.trim()}
                  className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  {t('save_only')}
                </button>

                <button
                  type="button"
                  onClick={() => handleCreatePatient(true)}
                  disabled={!name.trim()}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 rounded-xl shadow-md shadow-sky-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{t('save_and_open')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
