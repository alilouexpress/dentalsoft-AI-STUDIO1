import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient, Prescription } from '../../types';
import {
  fontDentalMedications,
  DENTAL_PRESCRIPTION_PRESETS,
  DentalMedication,
  PrescriptionPreset,
} from '../../data/medicationCatalog';
import {
  FileText,
  Plus,
  Trash2,
  Printer,
  Download,
  X,
  Check,
  AlertTriangle,
  Search,
  Sparkles,
  ShieldAlert,
  Syringe,
  Pill,
  Clock,
  Info,
  ChevronRight,
  Eye,
  RefreshCw,
} from 'lucide-react';

import { PrescriptionDocumentPreview } from './PrescriptionDocumentPreview';

interface PrescriptionGeneratorModalProps {
  patient: Patient;
  onClose: () => void;
  onSaved?: (presc: Prescription) => void;
}

export interface PrescriptionItem {
  id: string;
  name: string;
  form: string;
  dosage: string;
  duration: string;
  instructions: string;
  isPenicillin?: boolean;
  isNSAID?: boolean;
}

export const PrescriptionGeneratorModal: React.FC<PrescriptionGeneratorModalProps> = ({
  patient,
  onClose,
  onSaved,
}) => {
  const { addPrescription, t, prescriptionTemplate, updatePrescriptionTemplate, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'builder' | 'preview'>('builder');
  const [showQuickCustomizer, setShowQuickCustomizer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [doctorName, setDoctorName] = useState(prescriptionTemplate.doctorName || 'Dr. Amrani Samir');
  const [prescriptionNotes, setPrescriptionNotes] = useState('');
  const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>([
    {
      id: 'init-1',
      name: 'Amoxicilline 1g',
      form: 'Comprimés dispersibles 1000mg',
      dosage: '1 comprimé matin et soir',
      duration: '6 jours',
      instructions: 'Au milieu des repas avec un grand verre d\'eau',
      isPenicillin: true,
    },
    {
      id: 'init-2',
      name: 'Doliprane 1g (Paracétamol)',
      form: 'Comprimés 1000mg',
      dosage: '1 comprimé toutes les 6 heures si douleur',
      duration: '4 jours',
      instructions: 'Espacer les prises d\'au moins 4h',
    },
  ]);

  // Check patient allergies against selected items
  const patientAllergiesUpper = (patient.allergies || []).map((a) => a.toUpperCase());
  const hasPenicillinAllergy = patientAllergiesUpper.some(
    (a) => a.includes('PÉNICILLINE') || a.includes('PENICILLINE') || a.includes('AMOXICILLINE')
  );
  const hasNSAIDAllergy = patientAllergiesUpper.some(
    (a) => a.includes('AINS') || a.includes('IBUPROFÈNE') || a.includes('PROFENID') || a.includes('ASPIRINE')
  );

  const allergyWarnings = prescriptionItems.filter((item) => {
    if (item.isPenicillin && hasPenicillinAllergy) return true;
    if (item.isNSAID && hasNSAIDAllergy) return true;
    return false;
  });

  // Filter catalog drugs
  const filteredCatalog = fontDentalMedications.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = selectedCategory === 'Tous' || med.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAddMedication = (med: DentalMedication) => {
    const newItem: PrescriptionItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      name: med.name,
      form: med.defaultForm,
      dosage: med.defaultDosage,
      duration: med.defaultDuration,
      instructions: med.defaultInstructions,
      isPenicillin: med.isPenicillin,
      isNSAID: med.isNSAID,
    };
    setPrescriptionItems([...prescriptionItems, newItem]);
  };

  const handleApplyPreset = (preset: PrescriptionPreset) => {
    const newItems: PrescriptionItem[] = preset.medications.map((m, idx) => ({
      id: `preset-item-${Date.now()}-${idx}`,
      name: m.name,
      form: m.form,
      dosage: m.dosage,
      duration: m.duration,
      instructions: m.instructions,
      isPenicillin: m.name.toLowerCase().includes('amoxicilline') || m.name.toLowerCase().includes('augmentin'),
      isNSAID: m.name.toLowerCase().includes('profenid') || m.name.toLowerCase().includes('ibuprofène'),
    }));
    setPrescriptionItems(newItems);
  };

  const handleRemoveItem = (id: string) => {
    setPrescriptionItems(prescriptionItems.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof PrescriptionItem, value: string) => {
    setPrescriptionItems(
      prescriptionItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSavePrescription = () => {
    if (prescriptionItems.length === 0) {
      showToast('Veuillez ajouter au moins un médicament à l\'ordonnance.', 'warning');
      return;
    }

    const todayStr = new Date().toLocaleDateString('fr-FR');
    const newPresc: Omit<Prescription, 'id'> = {
      patientId: patient.id,
      doctorName,
      date: todayStr,
      medications: prescriptionItems.map((item) => ({
        name: `${item.name} (${item.form})`,
        dosage: item.dosage,
        duration: item.duration,
        instructions: item.instructions,
      })),
      notes: prescriptionNotes,
    };

    addPrescription(newPresc);
    if (onSaved) {
      onSaved({
        id: `presc-${Date.now()}`,
        ...newPresc,
      });
    }
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full border border-slate-200 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in">
        {/* Modal Header Bar */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center font-black">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight text-white">GÉNÉRATEUR D'ORDONNANCE MÉDICALE</h2>
                <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 text-[10px] font-bold border border-sky-500/30">
                  Odontologie
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Patient: <strong className="text-sky-200">{patient.name}</strong> ({patient.code}) • Dr. {doctorName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-800 p-1 rounded-xl flex items-center gap-1 border border-slate-700">
              <button
                type="button"
                onClick={() => setActiveTab('builder')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'builder'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Pill className="w-3.5 h-3.5" /> Éditeur
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Aperçu Ordonnance
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Patient Medical Alerts & Allergy Warning Top Ribbon */}
        {((patient.allergies && patient.allergies.length > 0) || allergyWarnings.length > 0) && (
          <div className="bg-rose-950 text-rose-100 px-5 py-2.5 border-b border-rose-800/80 flex items-center justify-between gap-3 shrink-0 text-xs font-medium">
            <div className="flex items-center gap-2 flex-wrap">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 animate-bounce" />
              <span className="font-black text-rose-200 uppercase tracking-wider">Allergies Patient:</span>
              <span className="bg-rose-900/80 px-2 py-0.5 rounded-md border border-rose-700/60 font-bold text-white">
                {patient.allergies?.join(', ') || 'Aucune'}
              </span>

              {allergyWarnings.length > 0 && (
                <span className="bg-rose-600 text-white px-2.5 py-0.5 rounded-full font-black animate-pulse flex items-center gap-1">
                  ⚠️ ATTENTION: {allergyWarnings.map((w) => w.name).join(', ')} en conflit avec les allergies!
                </span>
              )}
            </div>

            {hasPenicillinAllergy && (
              <span className="text-[11px] text-amber-300 font-bold hidden md:inline-block">
                👉 Prescrire Clindamycine ou Spiramycine à la place de l'Amoxicilline
              </span>
            )}
          </div>
        )}

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 space-y-6">
          {activeTab === 'builder' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT COLUMN: Presets & Medication Search Catalog (5 cols) */}
              <div className="lg:col-span-5 space-y-5">
                {/* Protocol Quick Presets */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Protocoles & Presets Rapides</span>
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {DENTAL_PRESCRIPTION_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 transition-all group cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 group-hover:text-sky-700">
                            {preset.title}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 transition-transform group-hover:translate-x-0.5" />
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{preset.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Medication Catalog Search */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Search className="w-4 h-4 text-sky-600" />
                    <span>Catalogue de Médicaments Dentaires</span>
                  </h3>

                  {/* Search input */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Rechercher (Amoxicilline, Doliprane, Eludril...)"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/30 focus:outline-none font-medium"
                    />
                  </div>

                  {/* Category Filter Chips */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                    {['Tous', 'Antibiotique', 'Antalgique / AINS', 'Bain de bouche / Antiseptique', 'Corticoïde'].map(
                      (cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                            selectedCategory === cat
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {cat}
                        </button>
                      )
                    )}
                  </div>

                  {/* Filtered Medication list */}
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {filteredCatalog.map((med) => {
                      const isAllergyConflict =
                        (med.isPenicillin && hasPenicillinAllergy) || (med.isNSAID && hasNSAIDAllergy);

                      return (
                        <div
                          key={med.id}
                          className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                            isAllergyConflict
                              ? 'bg-rose-50 border-rose-300'
                              : 'bg-slate-50 hover:bg-sky-50/50 border-slate-200/80 hover:border-sky-300'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900">{med.name}</span>
                              {isAllergyConflict && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-600 text-white">
                                  ALLERGIE
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500">
                              {med.defaultForm} • {med.defaultDosage}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddMedication(med)}
                            className="px-2.5 py-1 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors shrink-0 flex items-center gap-1 cursor-pointer shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Ajouter</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Active Prescription Builder Items (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Médicaments Sélectionnés sur l'Ordonnance</h3>
                      <p className="text-[11px] text-slate-500">
                        Ajustez les formes, posologies et durées de prise pour chaque ligne.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPrescriptionItems([])}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
                    >
                      Tout Effacer
                    </button>
                  </div>

                  {/* Active Items List */}
                  {prescriptionItems.length === 0 ? (
                    <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                      <Pill className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-600">Aucun médicament sélectionné</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Cliquez sur un médicament du catalogue à gauche ou utilisez un protocole rapide.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {prescriptionItems.map((item, index) => {
                        const isConflict =
                          (item.isPenicillin && hasPenicillinAllergy) || (item.isNSAID && hasNSAIDAllergy);

                        return (
                          <div
                            key={item.id}
                            className={`p-3.5 rounded-2xl border space-y-3 transition-all ${
                              isConflict
                                ? 'bg-rose-50/90 border-rose-300'
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            {/* Item Title Bar */}
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                                  {index + 1}
                                </span>
                                <input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                                  className="text-xs font-black text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none"
                                />
                                {isConflict && (
                                  <span className="text-[10px] font-bold text-rose-700 bg-rose-200/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3 text-rose-600" /> Risque d'allergie
                                  </span>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Item Edit Fields Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Forme</label>
                                <input
                                  type="text"
                                  value={item.form}
                                  onChange={(e) => handleUpdateItem(item.id, 'form', e.target.value)}
                                  placeholder="Forme galénique"
                                  className="w-full mt-0.5 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl font-medium focus:ring-1 focus:ring-sky-500 focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Posologie / Prise</label>
                                <input
                                  type="text"
                                  value={item.dosage}
                                  onChange={(e) => handleUpdateItem(item.id, 'dosage', e.target.value)}
                                  placeholder="ex: 1 cp matin et soir"
                                  className="w-full mt-0.5 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl font-medium focus:ring-1 focus:ring-sky-500 focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Durée du soin</label>
                                <input
                                  type="text"
                                  value={item.duration}
                                  onChange={(e) => handleUpdateItem(item.id, 'duration', e.target.value)}
                                  placeholder="ex: 6 jours"
                                  className="w-full mt-0.5 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl font-medium focus:ring-1 focus:ring-sky-500 focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* Special Instructions Line */}
                            <div>
                              <input
                                type="text"
                                value={item.instructions}
                                onChange={(e) => handleUpdateItem(item.id, 'instructions', e.target.value)}
                                placeholder="Instructions complémentaires (ex: Pendant le repas avec un grand verre d'eau)..."
                                className="w-full px-2.5 py-1.5 text-[11px] bg-white border border-slate-200 rounded-xl italic font-medium text-slate-600 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Doctor Notes / Diagnosis note on prescription */}
                  <div className="space-y-1 pt-2">
                    <label className="text-xs font-bold text-slate-700">Remarques ou Conseils Particuliers au Patient</label>
                    <textarea
                      rows={2}
                      value={prescriptionNotes}
                      onChange={(e) => setPrescriptionNotes(e.target.value)}
                      placeholder="Note complémentaire (ex: Revenir en consultation si persistance de la douleur ou fièvre)..."
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* PREVIEW TAB: OFFICIAL PRINTABLE PRESCRIPTION SHEET */
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="flex flex-wrap items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm gap-2">
                <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <span>📄 Aperçu d'impression de l'Ordonnance Médicale</span>
                  <span className="text-[10px] bg-sky-100 text-sky-800 font-mono px-2 py-0.5 rounded-full uppercase">
                    {prescriptionTemplate.templateStyle.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-sky-400" />
                    <span>Imprimer Ordonnance (PDF)</span>
                  </button>
                </div>
              </div>

              {/* PRINTABLE PRESCRIPTION DOCUMENT WRAPPER */}
              <div id="printable-prescription-area">
                <PrescriptionDocumentPreview
                  prescriptionTemplate={prescriptionTemplate}
                  doctorName={doctorName}
                  patient={patient}
                  prescriptionItems={prescriptionItems}
                  prescriptionNotes={prescriptionNotes}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="bg-white p-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Fermer
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-700" />
              <span>Imprimer</span>
            </button>

            <button
              type="button"
              onClick={handleSavePrescription}
              className="px-5 py-2.5 text-xs font-black bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 text-sky-200" />
              <span>Enregistrer dans le Dossier</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
