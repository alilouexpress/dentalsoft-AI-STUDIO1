import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient, MedicalAlert } from '../../types';
import {
  AlertTriangle,
  ShieldAlert,
  Biohazard,
  HeartPulse,
  Syringe,
  Pill,
  Plus,
  Trash2,
  X,
  Check,
  Edit3,
  ChevronDown,
  ChevronUp,
  Info,
  Sparkles,
  ShieldCheck,
  Activity,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface MedicalAlertBannerProps {
  patient: Patient;
}

export const MedicalAlertBanner: React.FC<MedicalAlertBannerProps> = ({ patient }) => {
  const { updatePatient, t } = useApp();

  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  // Local state for editing modal
  const [isHighRisk, setIsHighRisk] = useState<boolean>(patient.isHighRisk || false);
  const [riskLevel, setRiskLevel] = useState<Patient['riskLevel']>(patient.riskLevel || 'Modéré');
  const [allergies, setAllergies] = useState<string[]>(patient.allergies || []);
  const [newAllergyInput, setNewAllergyInput] = useState('');
  const [medicalConditions, setMedicalConditions] = useState<string[]>(patient.medicalConditions || []);
  const [newConditionInput, setNewConditionInput] = useState('');
  const [precautionNotes, setPrecautionNotes] = useState(patient.precautionNotes || '');
  const [alerts, setAlerts] = useState<MedicalAlert[]>(patient.medicalAlerts || []);

  // Quick preset chips for rapid dental triage
  const PRESET_ALLERGIES = [
    'Pénicilline / Amoxicilline',
    'AINS (Ibuprofène, Kétoprofène)',
    'Latex',
    'Anesthésique Local avec Adrénaline',
    'Aspirine',
    'Codéine',
  ];

  const PRESET_CONDITIONS = [
    'Hypertension Artérielle Sévère',
    'Traitements Anticoagulants (Sintrom / AVK)',
    'Diabète Type I / II',
    'Porteur de Pacemaker',
    'Prothèse Valvulaire (Risque d\'Endocardite)',
    'Insuffisance Rénale Chronique',
    'Asthme Sévère',
    'Femme Enceinte (1er / 3ème Trimestre)',
  ];

  const hasAlerts =
    patient.isHighRisk ||
    (patient.allergies && patient.allergies.length > 0) ||
    (patient.medicalConditions && patient.medicalConditions.length > 0) ||
    (patient.medicalAlerts && patient.medicalAlerts.length > 0) ||
    patient.precautionNotes;

  const handleAddAllergy = (allergy: string) => {
    if (allergy.trim() && !allergies.includes(allergy.trim())) {
      setAllergies([...allergies, allergy.trim()]);
      setNewAllergyInput('');
    }
  };

  const handleRemoveAllergy = (allergy: string) => {
    setAllergies(allergies.filter((a) => a !== allergy));
  };

  const handleAddCondition = (cond: string) => {
    if (cond.trim() && !medicalConditions.includes(cond.trim())) {
      setMedicalConditions([...medicalConditions, cond.trim()]);
      setNewConditionInput('');
    }
  };

  const handleRemoveCondition = (cond: string) => {
    setMedicalConditions(medicalConditions.filter((c) => c !== cond));
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatient({
      ...patient,
      isHighRisk,
      riskLevel: isHighRisk ? riskLevel : 'Faible',
      allergies,
      medicalConditions,
      precautionNotes,
      medicalAlerts: alerts,
    });
    setIsEditModalOpen(false);
  };

  // Color theme generator based on severity
  const getSeverityBadge = (level?: Patient['riskLevel']) => {
    switch (level) {
      case 'Critique':
        return {
          bg: 'bg-rose-600',
          border: 'border-rose-700',
          text: 'text-white',
          bannerBg: 'bg-gradient-to-r from-rose-900 via-red-900 to-rose-950',
          bannerBorder: 'border-rose-500/50',
          badgeText: 'CRITIQUE / URGENCE VITAL',
        };
      case 'Élevé':
        return {
          bg: 'bg-amber-500',
          border: 'border-amber-600',
          text: 'text-white',
          bannerBg: 'bg-gradient-to-r from-amber-950 via-red-950 to-slate-900',
          bannerBorder: 'border-amber-500/50',
          badgeText: 'RISQUE ÉLEVÉ',
        };
      case 'Modéré':
        return {
          bg: 'bg-orange-500',
          border: 'border-orange-600',
          text: 'text-white',
          bannerBg: 'bg-gradient-to-r from-slate-900 via-orange-950 to-slate-900',
          bannerBorder: 'border-orange-500/40',
          badgeText: 'RISQUE MODÉRÉ',
        };
      default:
        return {
          bg: 'bg-sky-600',
          border: 'border-sky-700',
          text: 'text-white',
          bannerBg: 'bg-slate-900',
          bannerBorder: 'border-slate-700',
          badgeText: 'RISQUE FAIBLE',
        };
    }
  };

  const theme = getSeverityBadge(patient.riskLevel || (patient.isHighRisk ? 'Élevé' : 'Faible'));

  // If patient has NO alerts registered
  if (!hasAlerts) {
    return (
      <>
        <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-emerald-900 flex items-center gap-2">
                <span>Dossier Médical: Aucun Risque ni Allergie Majeure Déclarée</span>
              </p>
              <p className="text-[11px] font-medium text-emerald-700">
                Patient sans antécédents médicaux particuliers enregistrés.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsHighRisk(true);
              setRiskLevel('Modéré');
              setIsEditModalOpen(true);
            }}
            className="px-3.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Déclarer Alerte / Allergie</span>
          </button>
        </div>

        {/* Modal rendering */}
        {isEditModalOpen && renderModal()}
      </>
    );
  }

  return (
    <>
      {/* HIGH IMPACT MEDICAL ALERT BANNER */}
      <div
        className={`${theme.bannerBg} text-white rounded-[26px] p-5 shadow-xl border ${theme.bannerBorder} relative overflow-hidden transition-all`}
      >
        {/* Glow ambient background effect */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-4 relative z-10">
          {/* Top Row: Main Status Pill & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center justify-center font-black animate-pulse shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${theme.bg} ${theme.text} shadow-sm border ${theme.border}`}
                  >
                    ⚠️ {theme.badgeText}
                  </span>
                  {acknowledged && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Précautions Validées pour Consultation
                    </span>
                  )}
                </div>
                <h3 className="text-base font-black text-white tracking-tight mt-0.5">
                  ALERTES MÉDICALES & RISQUES CLINIQUE — {patient.name}
                </h3>
              </div>
            </div>

            {/* Top Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setAcknowledged(!acknowledged)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  acknowledged
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                }`}
                title="Confirmer que vous avez pris connaissance des alertes médicales avant le soin"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{acknowledged ? 'Validé' : 'Valider Prise en Compte'}</span>
              </button>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-3 py-1.5 text-xs font-bold bg-sky-500/30 hover:bg-sky-500/50 text-sky-200 border border-sky-400/40 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Gérer Profil</span>
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-300 hover:text-white rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                title={isExpanded ? 'Réduire le panneau' : 'Développer les détails'}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Collapsible Content Area */}
          {isExpanded && (
            <div className="space-y-3 pt-1 animate-in fade-in duration-200">
              {/* Badges Row: Allergies & Conditions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Allergies Block */}
                <div className="bg-rose-950/40 border border-rose-500/30 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-rose-300 uppercase tracking-wider">
                    <Syringe className="w-4 h-4 text-rose-400" />
                    <span>Allergies Déclarées ({patient.allergies?.length || 0})</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {patient.allergies && patient.allergies.length > 0 ? (
                      patient.allergies.map((allergy, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-xl bg-rose-500/25 border border-rose-400/50 text-rose-100 font-extrabold text-xs shadow-sm flex items-center gap-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                          {allergy}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">Aucune allergie médicamenteuse spécifiée.</span>
                    )}
                  </div>
                </div>

                {/* Medical Conditions Block */}
                <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-300 uppercase tracking-wider">
                    <HeartPulse className="w-4 h-4 text-amber-400" />
                    <span>Conditions Médicales & Antécédents ({patient.medicalConditions?.length || 0})</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {patient.medicalConditions && patient.medicalConditions.length > 0 ? (
                      patient.medicalConditions.map((cond, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-xl bg-amber-500/25 border border-amber-400/50 text-amber-100 font-extrabold text-xs shadow-sm flex items-center gap-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                          {cond}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">Aucune maladie systémique notée.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Precaution Clinical Guidelines / Red Box Instructions */}
              {patient.precautionNotes && (
                <div className="bg-slate-950/70 border-l-4 border-rose-500 border-y border-r border-slate-800 rounded-2xl p-4 text-xs leading-relaxed space-y-1">
                  <p className="font-black text-rose-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Biohazard className="w-4 h-4 text-rose-400" />
                    <span>Consignes & Recommandations Cliniques Importantes:</span>
                  </p>
                  <p className="text-slate-200 font-medium whitespace-pre-line bg-slate-900/80 p-2.5 rounded-xl border border-white/5 font-mono text-[11px]">
                    {patient.precautionNotes}
                  </p>
                </div>
              )}

              {/* Structured Medical Alerts Table / Cards */}
              {patient.medicalAlerts && patient.medicalAlerts.length > 0 && (
                <div className="space-y-2 pt-1">
                  <p className="text-[11px] font-bold text-sky-200 uppercase tracking-wider flex items-center gap-1">
                    <Pill className="w-3.5 h-3.5 text-sky-400" />
                    <span>Détails & Protocoles de Prise en Charge ({patient.medicalAlerts.length}):</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {patient.medicalAlerts.map((alt) => (
                      <div
                        key={alt.id}
                        className="p-3 bg-white/5 border border-white/10 rounded-2xl space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-black text-white">{alt.title}</span>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-rose-500/30 text-rose-200 uppercase">
                            {alt.severity}
                          </span>
                        </div>
                        {alt.description && <p className="text-[11px] text-slate-300">{alt.description}</p>}
                        {alt.clinicalInstruction && (
                          <div className="mt-1 text-[10px] text-amber-200 font-bold bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/20">
                            👉 {alt.clinicalInstruction}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RENDER EDIT MODAL */}
      {isEditModalOpen && renderModal()}
    </>
  );

  function renderModal() {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-[28px] max-w-2xl w-full p-6 shadow-2xl border border-slate-100 space-y-6 my-8 animate-in fade-in">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Gestion des Alertes Médicales & Risques
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Patient: <strong className="text-slate-800">{patient.name}</strong> ({patient.code})
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditModalOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Controls */}
          <form onSubmit={handleSaveModal} className="space-y-5">
            {/* High Risk Toggle & Severity Selector */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-black text-slate-900 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isHighRisk}
                      onChange={(e) => setIsHighRisk(e.target.checked)}
                      className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500 cursor-pointer"
                    />
                    <span>Classer comme Patient à Haut Risque Médical</span>
                  </label>
                  <p className="text-[11px] text-slate-500 ml-6">
                    Affiche un bandeau d'avertissement prioritaire en haut de la fiche clinique.
                  </p>
                </div>

                {isHighRisk && (
                  <select
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value as any)}
                    className="py-1.5 px-3 text-xs font-black bg-rose-600 text-white rounded-xl focus:outline-none cursor-pointer"
                  >
                    <option value="Faible">Niveau: Faible</option>
                    <option value="Modéré">Niveau: Modéré</option>
                    <option value="Élevé">Niveau: Élevé</option>
                    <option value="Critique">Niveau: Critique</option>
                  </select>
                )}
              </div>
            </div>

            {/* Allergies Section */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Syringe className="w-4 h-4 text-rose-600" />
                <span>Allergies Déclarées</span>
              </label>

              {/* Preset buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Rapides:</span>
                {PRESET_ALLERGIES.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleAddAllergy(preset)}
                    className="px-2 py-0.5 text-[10px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                  >
                    + {preset}
                  </button>
                ))}
              </div>

              {/* Tag pills */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {allergies.map((alg) => (
                  <span
                    key={alg}
                    className="px-2.5 py-1 rounded-xl bg-rose-100 text-rose-900 font-extrabold text-xs flex items-center gap-1 border border-rose-300"
                  >
                    <span>{alg}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAllergy(alg)}
                      className="hover:text-rose-600 font-bold ml-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Input custom allergy */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Autre allergie (ex: Penicilline, Latex)..."
                  value={newAllergyInput}
                  onChange={(e) => setNewAllergyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddAllergy(newAllergyInput);
                    }
                  }}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:outline-none font-medium"
                />
                <button
                  type="button"
                  onClick={() => handleAddAllergy(newAllergyInput)}
                  className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Ajouter
                </button>
              </div>
            </div>

            {/* Medical Conditions Section */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-amber-600" />
                <span>Conditions Médicales & Pathologies</span>
              </label>

              {/* Preset buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Rapides:</span>
                {PRESET_CONDITIONS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleAddCondition(preset)}
                    className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg border border-amber-200 transition-colors cursor-pointer"
                  >
                    + {preset}
                  </button>
                ))}
              </div>

              {/* Tag pills */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {medicalConditions.map((cond) => (
                  <span
                    key={cond}
                    className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 font-extrabold text-xs flex items-center gap-1 border border-amber-300"
                  >
                    <span>{cond}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCondition(cond)}
                      className="hover:text-rose-600 font-bold ml-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Input custom condition */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Autre maladie systémique (ex: Asthme, Insuffisance rénale)..."
                  value={newConditionInput}
                  onChange={(e) => setNewConditionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCondition(newConditionInput);
                    }
                  }}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:outline-none font-medium"
                />
                <button
                  type="button"
                  onClick={() => handleAddCondition(newConditionInput)}
                  className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Ajouter
                </button>
              </div>
            </div>

            {/* Precautions & Clinical Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-sky-600" />
                <span>Consignes Cliniques & Précautions Particulières</span>
              </label>
              <textarea
                rows={3}
                value={precautionNotes}
                onChange={(e) => setPrecautionNotes(e.target.value)}
                placeholder="Rédigez les contre-indications spécifiques (ex: Éviter vasoconstricteurs, Exiger INR récent, Prescrire Clindamycine 600mg avant soin)..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/30 focus:outline-none font-sans leading-relaxed"
              />
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-black text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Enregistrer Profil de Risque</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
};
