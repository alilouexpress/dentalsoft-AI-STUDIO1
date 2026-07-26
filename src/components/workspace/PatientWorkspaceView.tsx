import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Odontogram } from './Odontogram';
import { PatientSummaryView } from '../patients/PatientSummaryView';
import { ClinicalNotesEditor } from './ClinicalNotesEditor';
import { MedicalAlertBanner } from './MedicalAlertBanner';
import { PrescriptionGeneratorModal } from '../prescriptions/PrescriptionGeneratorModal';
import { PatientInsuranceView } from '../insurance/PatientInsuranceView';
import {
  Phone,
  Mail,
  Calendar,
  Edit,
  Edit3,
  Printer,
  Plus,
  FileText,
  Image as ImageIcon,
  ClipboardList,
  CreditCard,
  History,
  FolderOpen,
  DollarSign,
  AlertCircle,
  CheckCircle,
  X,
  Upload,
  Sparkles,
  Stethoscope,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const getNavThemeClasses = (color: string) => {
  switch (color) {
    case 'emerald':
      return {
        outerBg: 'bg-emerald-50/90',
        outerBorder: 'border-emerald-200/50',
        innerBorder: 'border-emerald-200',
        activeTabBg: 'bg-emerald-600 text-white shadow-emerald-600/30',
        activeBadgeText: 'text-emerald-800',
        activeMarkerBg: 'bg-emerald-600',
        hoverArrowText: 'hover:text-emerald-600'
      };
    case 'indigo':
      return {
        outerBg: 'bg-indigo-50/90',
        outerBorder: 'border-indigo-200/50',
        innerBorder: 'border-indigo-200',
        activeTabBg: 'bg-indigo-600 text-white shadow-indigo-600/30',
        activeBadgeText: 'text-indigo-800',
        activeMarkerBg: 'bg-indigo-600',
        hoverArrowText: 'hover:text-indigo-600'
      };
    case 'rose':
      return {
        outerBg: 'bg-rose-50/90',
        outerBorder: 'border-rose-200/50',
        innerBorder: 'border-rose-200',
        activeTabBg: 'bg-rose-500 text-white shadow-rose-500/30',
        activeBadgeText: 'text-rose-800',
        activeMarkerBg: 'bg-rose-500',
        hoverArrowText: 'hover:text-rose-600'
      };
    case 'amber':
      return {
        outerBg: 'bg-amber-50/90',
        outerBorder: 'border-amber-200/50',
        innerBorder: 'border-amber-200',
        activeTabBg: 'bg-amber-500 text-white shadow-amber-500/30',
        activeBadgeText: 'text-amber-800',
        activeMarkerBg: 'bg-amber-500',
        hoverArrowText: 'hover:text-amber-600'
      };
    case 'slate':
      return {
        outerBg: 'bg-slate-100/90',
        outerBorder: 'border-slate-300/50',
        innerBorder: 'border-slate-300',
        activeTabBg: 'bg-slate-700 text-white shadow-slate-700/30',
        activeBadgeText: 'text-slate-800',
        activeMarkerBg: 'bg-slate-700',
        hoverArrowText: 'hover:text-slate-700'
      };
    case 'sky':
    default:
      return {
        outerBg: 'bg-sky-50/80',
        outerBorder: 'border-sky-100/30',
        innerBorder: 'border-sky-100',
        activeTabBg: 'bg-sky-500 text-white shadow-sky-500/20',
        activeBadgeText: 'text-sky-800',
        activeMarkerBg: 'bg-sky-500',
        hoverArrowText: 'hover:text-sky-600'
      };
  }
};

export const PatientWorkspaceView: React.FC = () => {
  const {
    patients,
    activePatientId,
    updatePatient,
    images,
    addImage,
    patientTreatments,
    addPatientTreatment,
    prescriptions,
    addPrescription,
    payments,
    addPayment,
    clinicalNotes,
    insurancePolicies,
    insuranceClaims,
    auditLogs,
    addAppointment,
    treatmentCatalog,
    t,
    workspaceNavColor,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'summary' | 'notes' | 'odontogram' | 'imaging' | 'care-plan' | 'prescriptions' | 'payments' | 'insurance' | 'chronology' | 'documents'
  >('summary');

  const patient = patients.find((p) => p.id === activePatientId) || patients[0];

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddImageModalOpen, setIsAddImageModalOpen] = useState(false);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [isPrescriptionGeneratorOpen, setIsPrescriptionGeneratorOpen] = useState(false);
  
  // New Modals state
  const [isAddTreatmentModalOpen, setIsAddTreatmentModalOpen] = useState(false);
  const [isAddApptModalOpen, setIsAddApptModalOpen] = useState(false);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<any | null>(null);

  // Form states
  const [editPhone, setEditPhone] = useState(patient?.phone || '');
  const [editEmail, setEditEmail] = useState(patient?.email || '');
  const [paymentAmount, setPaymentAmount] = useState<number>(15000);
  const [paymentMethod, setPaymentMethod] = useState<'Espèces' | 'Chèque' | 'Carte'>('Espèces');

  // Sync state when active patient changes
  React.useEffect(() => {
    if (patient) {
      setEditPhone(patient.phone || '');
      setEditEmail(patient.email || '');
    }
  }, [patient]);

  // Image form states
  const [imgTooth, setImgTooth] = useState(17);
  const [imgTag, setImgTag] = useState('carie_couronne');
  const [imgType, setImgType] = useState<'Périapicale' | 'Panoramique' | 'Bitewing' | 'CBCT'>('Périapicale');
  const [imgTitle, setImgTitle] = useState('');
  const [imgNotes, setImgNotes] = useState('');
  const [imgPreviewUrl, setImgPreviewUrl] = useState<string | null>(null);

  // Appointment form states
  const [apptDate, setApptDate] = useState('2026-07-25');
  const [apptTime, setApptTime] = useState('10:00');
  const [apptType, setApptType] = useState('Consultation');
  const [apptDoctor, setApptDoctor] = useState('Dr. Amrani Samir');
  const [apptNotes, setApptNotes] = useState('');

  // Treatment form states
  const [treatToothId, setTreatToothId] = useState<number | ''>('');
  const [treatCategory, setTreatCategory] = useState<string>('');
  const [treatName, setTreatName] = useState('');
  const [treatCost, setTreatCost] = useState<number | ''>('');
  const [selectedProcedureId, setSelectedProcedureId] = useState<string>('');
  const [treatStatus, setTreatStatus] = useState<string>('Planifié');
  const [treatPriority, setTreatPriority] = useState<string>('Moyenne');
  const [treatDoctor, setTreatDoctor] = useState<string>('Dr. Amrani Samir');

  // Scroll tracking and indicator states for the horizontal menu bar
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  
  const navTheme = getNavThemeClasses(workspaceNavColor);

  const checkScroll = () => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setShowLeftArrow(scrollLeft > 5);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    const container = tabsContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      checkScroll();
      
      const timer = setTimeout(checkScroll, 300);
      window.addEventListener('resize', checkScroll);

      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
        clearTimeout(timer);
      };
    }
  }, [activePatientId, activeTab]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (tabsContainerRef.current) {
      const scrollAmount = 240;
      tabsContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!patient) return null;

  const patientImages = images.filter((img) => img.patientId === patient.id);
  const patientPrescriptions = prescriptions.filter((p) => p.patientId === patient.id);
  const patientPayments = payments.filter((p) => p.patientId === patient.id);
  const patientTreats = patientTreatments.filter((p) => p.patientId === patient.id);
  const patientNotes = clinicalNotes.filter((n) => n.patientId === patient.id);
  const patientClaims = insuranceClaims.filter((c) => c.patientId === patient.id);
  const patientPolicies = insurancePolicies.filter((p) => p.patientId === patient.id);

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatient({
      ...patient,
      phone: editPhone,
      email: editEmail,
    });
    setIsEditModalOpen(false);
  };

  const handleAddPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPayment({
      patientId: patient.id,
      patientName: patient.name,
      amount: paymentAmount,
      method: paymentMethod,
      date: new Date().toLocaleString('fr-FR'),
      notes: 'Paiement acompte enregistré',
    });
    setIsAddPaymentModalOpen(false);
  };

  const handleAddImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addImage({
      patientId: patient.id,
      title: imgTitle || `Radiographie Dent #${imgTooth}`,
      type: imgType,
      toothId: imgTooth,
      tag: imgTag,
      date: new Date().toLocaleDateString('fr-FR'),
      url: imgPreviewUrl || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400',
      notes: imgNotes || 'Radiographie importée',
    });
    setIsAddImageModalOpen(false);
    // Reset image states
    setImgTitle('');
    setImgNotes('');
    setImgPreviewUrl(null);
  };

  const handleAddTreatmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPatientTreatment({
      patientId: patient.id,
      toothId: treatToothId ? Number(treatToothId) : undefined,
      category: (treatCategory || 'Soins Généraux') as any,
      name: treatName || 'Soin dentaire',
      cost: treatCost === '' ? 0 : Number(treatCost),
      status: treatStatus as any,
      priority: treatPriority as any,
      doctorName: treatDoctor,
      date: new Date().toLocaleDateString('fr-FR'),
    });
    setIsAddTreatmentModalOpen(false);
    // Reset treatment states
    setTreatToothId('');
    setTreatCategory('');
    setTreatName('');
    setTreatCost('');
    setSelectedProcedureId('');
    setTreatStatus('Planifié');
    setTreatPriority('Moyenne');
  };

  const handleAddApptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAppointment({
      patientId: patient.id,
      patientName: patient.name,
      doctorName: apptDoctor,
      date: apptDate,
      time: apptTime,
      durationMinutes: 45,
      type: apptType as any,
      notes: apptNotes || 'Planifié via le dossier patient',
    });
    setIsAddApptModalOpen(false);
    // Reset appointment states
    setApptDate('2026-07-25');
    setApptTime('10:00');
    setApptType('Consultation');
    setApptNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* High Risk Patient Medical Alert Banner */}
      <MedicalAlertBanner patient={patient} />

      {/* Patient Header Banner Card */}
      <div className="bg-white rounded-[28px] border border-sky-100 shadow-sm p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Patient Details */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-sky-700 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-sky-500/20 ring-4 ring-sky-50 shrink-0">
              {patient.name.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-black text-slate-900">{patient.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800">
                  + Actif
                </span>
                <span className="text-xs font-bold text-slate-400">{patient.code}</span>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 flex-wrap pt-1">
                <span>{patient.age} ans • {patient.gender}</span>
                <span className="flex items-center gap-1 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-sky-600" /> {patient.phone}
                </span>
                <span className="flex items-center gap-1 text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-sky-600" /> {patient.email}
                </span>
              </div>

              <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400 pt-1">
                <span>Dernière visite: <strong className="text-slate-700">{patient.lastVisit}</strong></span>
                <span>Prochain RDV: <strong className="text-sky-600">Aucun</strong></span>
              </div>
            </div>
          </div>

          {/* Action Buttons & Balance Card */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="px-4 py-3 bg-slate-50 rounded-2xl border border-sky-100 flex items-center justify-between sm:justify-start gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">SOLDE DU PATIENT</p>
                <p className="text-lg font-black text-emerald-600">{patient.balance.toFixed(2)} DA</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Aucune dette
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsPrescriptionGeneratorOpen(true)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 rounded-xl shadow-md shadow-sky-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Générer Ordonnance</span>
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className="px-3.5 py-2 text-xs font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200/80 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Notes Cliniques</span>
              </button>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-3 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Modifier</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Tabs Bar (Floating with backdrop blur for persistent navigation and discoverability) */}
      <div className={`sticky -top-4 sm:-top-6 lg:-top-8 z-30 ${navTheme.outerBg} backdrop-blur-md py-4 mb-6 border-b ${navTheme.outerBorder} -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 transition-all duration-300`}>
        <div className="relative flex flex-col w-full gap-2">
          
          <div className="relative flex items-center w-full">
            {/* Scroll Indicator Arrow Left */}
            {showLeftArrow && (
              <div className="absolute left-0 top-0 bottom-0 w-14 bg-gradient-to-r from-white via-white/95 to-transparent pointer-events-none z-10 rounded-l-3xl flex items-center pl-1">
                <button
                  type="button"
                  onClick={() => handleScroll('left')}
                  className={`pointer-events-auto p-1.5 rounded-full bg-white shadow-md border border-slate-100 hover:bg-slate-50 transition-all text-slate-700 ${navTheme.hoverArrowText} flex items-center justify-center cursor-pointer active:scale-95`}
                  aria-label="Faire défiler à gauche"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Scrollable Tabs Viewport */}
            <div
              ref={tabsContainerRef}
              className={`w-full overflow-x-auto scroll-smooth custom-scrollbar flex items-center gap-2 p-1.5 bg-white border ${navTheme.innerBorder} shadow-sm rounded-3xl transition-colors duration-300`}
            >
              {[
                { id: 'summary', label: 'Résumé Général', icon: Sparkles, badge: null },
                { id: 'notes', label: 'Notes Cliniques', icon: Edit3, badge: patientNotes.length },
                { id: 'odontogram', label: 'Odontogramme', icon: ClipboardList, badge: null },
                { id: 'imaging', label: 'Imagerie', icon: ImageIcon, badge: patientImages.length },
                { id: 'care-plan', label: 'Plan de soins', icon: FileText, badge: patientTreats.length },
                { id: 'prescriptions', label: 'Ordonnances', icon: FileText, badge: patientPrescriptions.length },
                { id: 'payments', label: 'Paiements', icon: CreditCard, badge: patientPayments.length },
                { id: 'insurance', label: 'Assurance & Tiers-Payant', icon: Shield, badge: patientClaims.length > 0 ? patientClaims.length : (patientPolicies.length > 0 ? 'Actif' : null) },
                { id: 'chronology', label: 'Chronologie', icon: History, badge: null },
                { id: 'documents', label: 'Documents', icon: FolderOpen, badge: null },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0 ${
                      isActive
                        ? navTheme.activeTabBg
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.badge !== null && (
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] font-black transition-colors duration-300 ${
                          isActive ? `bg-white ${navTheme.activeBadgeText}` : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Scroll Indicator Arrow Right */}
            {showRightArrow && (
              <div className="absolute right-0 top-0 bottom-0 w-14 bg-gradient-to-l from-white via-white/95 to-transparent pointer-events-none z-10 rounded-r-3xl flex items-center justify-end pr-1">
                <button
                  type="button"
                  onClick={() => handleScroll('right')}
                  className={`pointer-events-auto p-1.5 rounded-full bg-white shadow-md border border-slate-100 hover:bg-slate-50 transition-all text-slate-700 ${navTheme.hoverArrowText} flex items-center justify-center cursor-pointer active:scale-95`}
                  aria-label="Faire défiler à droite"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
            
          </div>

          {/* Sequence Markers / Pagination dots showing full available menu scope */}
          <div className="flex justify-between items-center px-2 mt-2">
            <div className="flex justify-center items-center gap-1.5 select-none flex-wrap flex-1">
              {[
                { id: 'summary', label: 'Résumé Général' },
                { id: 'notes', label: 'Notes Cliniques' },
                { id: 'odontogram', label: 'Odontogramme' },
                { id: 'imaging', label: 'Imagerie' },
                { id: 'care-plan', label: 'Plan de soins' },
                { id: 'prescriptions', label: 'Ordonnances' },
                { id: 'payments', label: 'Paiements' },
                { id: 'insurance', label: 'Assurance' },
                { id: 'chronology', label: 'Chronologie' },
                { id: 'documents', label: 'Documents' },
              ].map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={`marker-${item.id}`}
                    onClick={() => setActiveTab(item.id as any)}
                    className="group py-1 cursor-pointer"
                    title={item.label}
                  >
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        isActive
                          ? `w-6 ${navTheme.activeMarkerBg}`
                          : 'w-1.5 bg-slate-300 group-hover:bg-slate-400 group-hover:w-3'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid: Workspace Tabs + Clinical Summary Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Workspace Tabs Column */}
        <div className={activeTab === 'summary' || activeTab === 'notes' || activeTab === 'insurance' ? 'lg:col-span-12 space-y-4' : 'lg:col-span-8 space-y-4'}>
          
          {/* Tab Content Container */}
          <div className="bg-slate-50/50 min-h-[400px]">
            {/* Tab 0: Patient Summary */}
            {activeTab === 'summary' && <PatientSummaryView patientId={patient.id} />}

            {/* Tab 1: Clinical Rich Text Notes */}
            {activeTab === 'notes' && <ClinicalNotesEditor patientId={patient.id} />}

            {/* Tab 2: Odontogramme */}
            {activeTab === 'odontogram' && (
              <Odontogram 
                patientId={patient.id} 
                onAddTreatmentClick={(toothId, defaultProc) => {
                  setTreatToothId(toothId);
                  
                  // Try to find the selected treatment in treatmentCatalog
                  const matched = treatmentCatalog.find(
                    (tc) => tc.name.toLowerCase() === defaultProc?.toLowerCase()
                  );
                  
                  if (matched) {
                    setSelectedProcedureId(matched.id);
                    setTreatName(matched.name);
                    setTreatCategory(matched.category);
                    setTreatCost(matched.price);
                  } else {
                    // Look for a partial/smart match or default to custom
                    const partialMatch = treatmentCatalog.find(
                      (tc) => tc.name.toLowerCase().includes(defaultProc?.toLowerCase() || '') ||
                              (defaultProc || '').toLowerCase().includes(tc.name.toLowerCase())
                    );
                    if (partialMatch) {
                      setSelectedProcedureId(partialMatch.id);
                      setTreatName(partialMatch.name);
                      setTreatCategory(partialMatch.category);
                      setTreatCost(partialMatch.price);
                    } else {
                      setSelectedProcedureId('custom');
                      setTreatName(defaultProc || '');
                      setTreatCategory('Soins Généraux');
                      setTreatCost('');
                    }
                  }
                  
                  setIsAddTreatmentModalOpen(true);
                }}
              />
            )}

            {/* Tab 2: Imagerie */}
            {activeTab === 'imaging' && (
              <div className="bg-white p-6 rounded-[28px] border border-sky-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900">Radiographies & Imagerie Dentaire</h3>
                  <button
                    onClick={() => setIsAddImageModalOpen(true)}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 rounded-xl shadow-md shadow-sky-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter une image</span>
                  </button>
                </div>

                {patientImages.length === 0 ? (
                  <div className="py-12 text-center border-2 border-dashed border-sky-200/70 rounded-2xl bg-sky-50/30">
                    <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-600">Aucune image enregistrée</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {patientImages.map((img) => (
                      <div
                        key={img.id}
                        onClick={() => setSelectedPreviewImage(img)}
                        className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 overflow-hidden group hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="h-44 rounded-xl bg-slate-900 overflow-hidden mb-3 relative">
                          <img
                            src={img.url}
                            alt={img.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                            {img.type}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">{img.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{img.date} • Tag: {img.tag}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Care Plan */}
            {activeTab === 'care-plan' && (
              <div className="bg-white p-6 rounded-[28px] border border-sky-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900">Plan de soins et Procédures</h3>
                  <button
                    onClick={() => setIsAddTreatmentModalOpen(true)}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 rounded-xl shadow-md shadow-sky-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nouveau traitement</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left rtl:text-right text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-3">Dent</th>
                        <th className="p-3">Traitement</th>
                        <th className="p-3">Statut</th>
                        <th className="p-3">Priorité</th>
                        <th className="p-3">Coût (DA)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                      {patientTreats.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-sky-700">Dent #{t.toothId || '—'}</td>
                          <td className="p-3 font-bold">{t.name}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              {t.status}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-slate-600">{t.priority}</td>
                          <td className="p-3 font-black text-slate-900">{t.cost} DA</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 4: Prescriptions */}
            {activeTab === 'prescriptions' && (
              <div className="bg-white p-6 rounded-[28px] border border-sky-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Ordonnances Médicales & Prescription</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Historique des ordonnances délivrées à {patient.name} ({patientPrescriptions.length} enregistrée(s))
                    </p>
                  </div>
                  <button
                    onClick={() => setIsPrescriptionGeneratorOpen(true)}
                    className="px-4 py-2 text-xs font-black text-white bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 rounded-xl shadow-md shadow-sky-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Générer Nouvelle Ordonnance</span>
                  </button>
                </div>

                {patientPrescriptions.length === 0 ? (
                  <div className="py-12 text-center border-2 border-dashed border-sky-200/70 rounded-2xl bg-sky-50/20 space-y-3">
                    <FileText className="w-10 h-10 text-sky-400 mx-auto" />
                    <div>
                      <p className="text-xs font-bold text-slate-700">Aucune ordonnance délivrée pour ce patient</p>
                      <p className="text-[11px] text-slate-400">
                        Utilisez le générateur d'ordonnance pour sélectionner des posologies dentaires et générer un reçu médical imprimable.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsPrescriptionGeneratorOpen(true)}
                      className="px-4 py-2 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Ouvrir le Générateur d'Ordonnance</span>
                    </button>
                  </div>
                ) : (
                  patientPrescriptions.map((ord) => (
                    <div key={ord.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <div>
                          <span className="text-xs font-black text-sky-700">ORDONNANCE DE DENTISTERIE</span>
                          <p className="text-[11px] text-slate-500 font-medium">{ord.date} • Praticien: {ord.doctorName}</p>
                        </div>
                        <button
                          onClick={() => setIsPrescriptionGeneratorOpen(true)}
                          className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Printer className="w-3.5 h-3.5 text-sky-600" />
                          <span>Aperçu & Réimprimer</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {ord.medications.map((m, i) => (
                          <div key={i} className="p-3 bg-white rounded-xl border border-slate-100 text-xs flex items-start justify-between gap-3">
                            <div>
                              <p className="font-black text-slate-900">{m.name}</p>
                              <p className="text-[11px] text-slate-700 font-medium">{m.dosage} — Durée: {m.duration}</p>
                              {m.instructions && (
                                <p className="text-[10px] text-slate-500 italic mt-0.5">Note: {m.instructions}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 5: Payments */}
            {activeTab === 'payments' && (
              <div className="bg-white p-6 rounded-[28px] border border-sky-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900">Paiements & Encaissements</h3>
                  <button
                    onClick={() => setIsAddPaymentModalOpen(true)}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 rounded-xl shadow-md shadow-sky-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nouveau paiement</span>
                  </button>
                </div>

                {patientPayments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-8 text-center">Aucun paiement enregistré pour ce patient.</p>
                ) : (
                  <div className="space-y-2">
                    {patientPayments.map((p) => (
                      <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-black text-slate-900">{p.amount.toLocaleString()} DA</p>
                          <p className="text-[11px] text-slate-500">{p.date} • {p.method}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Reçu
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 5.5: Insurance & Tiers-Payant */}
            {activeTab === 'insurance' && (
              <PatientInsuranceView patient={patient} />
            )}

            {/* Tab 6: Chronology */}
            {activeTab === 'chronology' && (
              <div className="bg-white p-6 rounded-[28px] border border-sky-100 shadow-sm space-y-4">
                <h3 className="text-base font-black text-slate-900">Historique Chronologique</h3>
                <div className="space-y-3 relative border-l-2 border-slate-200 pl-4 ml-2">
                  {auditLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-sky-500 ring-4 ring-white"></div>
                      <p className="text-xs font-bold text-slate-800">{log.details}</p>
                      <p className="text-[10px] text-slate-400">{log.timestamp} • {log.user}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 7: Documents */}
            {activeTab === 'documents' && (
              <div className="bg-white p-12 text-center rounded-[28px] border border-sky-100 shadow-sm">
                <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-800">Documents administratifs</h4>
                <p className="text-xs text-slate-400 mt-1 mb-4">Certificats médicaux, consentements éclairés.</p>
                <button className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 rounded-xl cursor-pointer shadow-md shadow-sky-500/20">
                  Importer un document
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Clinical Summary Sidebar (Hidden when in Summary, Notes or Insurance Tab) */}
        {activeTab !== 'summary' && activeTab !== 'notes' && activeTab !== 'insurance' && (
          <div className="lg:col-span-4 space-y-4">
            
            {/* Clinical Summary Widget */}
            <div className="bg-white p-5 rounded-[28px] border border-sky-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Résumé Clinique</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] text-slate-400">Visites</p>
                <p className="text-base font-black text-slate-900">1</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] text-slate-400">Traitements</p>
                <p className="text-base font-black text-slate-900">1 (1 actif)</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] text-slate-400">Prescriptions</p>
                <p className="text-base font-black text-slate-900">1</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] text-slate-400">Solde</p>
                <p className="text-base font-black text-emerald-600">0,00 DA</p>
              </div>
            </div>
          </div>

          {/* Prochain RDV Card */}
          <div className="bg-white p-5 rounded-[28px] border border-sky-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prochain RDV</h3>
            <p className="text-xs text-slate-500">Aucun rendez-vous planifié</p>
            <button
              onClick={() => setIsAddApptModalOpen(true)}
              className="w-full py-2.5 text-xs font-bold bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-xl shadow-md shadow-sky-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" /> Planifier un RDV
            </button>
          </div>

          {/* Active Treatments */}
          <div className="bg-white p-5 rounded-[28px] border border-sky-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Traitements Actifs</h3>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
              <p className="font-bold text-amber-900">Appareil dentaire / Soins carie</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] font-bold uppercase">
                Planifié
              </span>
            </div>
          </div>

          {/* Alerts & Reminders */}
          <div className="bg-white p-5 rounded-[28px] border border-sky-100 shadow-sm space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alertes & Rappels</h3>
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold pt-1">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Aucune alerte active</span>
            </div>
          </div>

          {/* Payment History Quick Button */}
          <div className="bg-white p-5 rounded-[28px] border border-sky-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Historique Paiements</h3>
            <button
              onClick={() => setIsAddPaymentModalOpen(true)}
              className="w-full py-2.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter un paiement</span>
            </button>
          </div>
        </div>
      )}
      </div>

      {/* Modal: Edit Info */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-black text-slate-900">Modifier les informations</h3>
            <form onSubmit={handleEditSave} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">E-mail</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-xl shadow-md shadow-sky-500/20 cursor-pointer"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Payment */}
      {isAddPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-black text-slate-900">Nouveau Paiement</h3>
            <form onSubmit={handleAddPaymentSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Montant (DA) *</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mode de paiement *</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="Espèces">Espèces</option>
                  <option value="Chèque">Chèque</option>
                  <option value="Carte">Carte bancaire</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddPaymentModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-xl shadow-md shadow-sky-500/20 cursor-pointer"
                >
                  Enregistrer & Imprimer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Image */}
      {isAddImageModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Ajouter une image / Radiographie</h3>
              <button 
                onClick={() => {
                  setIsAddImageModalOpen(false);
                  setImgPreviewUrl(null);
                }} 
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddImageSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Titre de l'image *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Radiographie Panoramique Pré-op"
                  value={imgTitle}
                  onChange={(e) => setImgTitle(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-sky-500/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dent FDI #</label>
                  <input
                    type="number"
                    value={imgTooth}
                    onChange={(e) => setImgTooth(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-sky-500/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type d'image</label>
                  <select
                    value={imgType}
                    onChange={(e) => setImgType(e.target.value as any)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-sky-500/20 outline-none"
                  >
                    <option value="Périapicale">Périapicale</option>
                    <option value="Panoramique">Panoramique</option>
                    <option value="Bitewing">Bitewing</option>
                    <option value="CBCT">CBCT Scanner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tag / Note de diagnostic</label>
                <select
                  value={imgTag}
                  onChange={(e) => setImgTag(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:ring-2 focus:ring-sky-500/20 outline-none"
                >
                  <option value="carie_couronne">Carie / Couronne</option>
                  <option value="post_op">Suivi Post-Opératoire</option>
                  <option value="implant">Planification Implant</option>
                  <option value="endodontie">Canal / Endodontie</option>
                  <option value="sain">Sain / Contrôle</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fichier radiographique *</label>
                {imgPreviewUrl ? (
                  <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-2 flex flex-col items-center">
                    <img 
                      src={imgPreviewUrl} 
                      alt="Preview" 
                      className="max-h-40 rounded-xl object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      onClick={() => setImgPreviewUrl(null)}
                      className="absolute top-4 right-4 bg-rose-500 text-white p-1.5 rounded-full hover:bg-rose-600 transition-colors shadow"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] text-emerald-600 font-bold mt-2">Fichier chargé avec succès !</span>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-sky-200 hover:border-sky-400 bg-sky-50/20 hover:bg-sky-50/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all">
                    <Upload className="w-8 h-8 text-sky-500" />
                    <span className="text-xs font-bold text-slate-600">Sélectionner un fichier image</span>
                    <span className="text-[10px] text-slate-400">Glissez-déposez ou cliquez pour parcourir</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setImgPreviewUrl(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Observations</label>
                <textarea
                  rows={2}
                  value={imgNotes}
                  onChange={(e) => setImgNotes(e.target.value)}
                  placeholder="Notes cliniques complémentaires..."
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/20 outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddImageModalOpen(false);
                    setImgPreviewUrl(null);
                  }}
                  className="px-4 py-2 text-xs font-bold bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!imgPreviewUrl}
                  className={`px-5 py-2 text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer ${
                    imgPreviewUrl 
                      ? 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-sky-500/20' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Importer & Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Full-Screen Image Lightbox */}
      {selectedPreviewImage && (
        <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 select-none">
          {/* Header Controls */}
          <div className="flex items-center justify-between text-white pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-black tracking-tight">{selectedPreviewImage.title}</h3>
              <p className="text-xs text-slate-400 font-semibold">{selectedPreviewImage.date} • Dent #{selectedPreviewImage.toothId || '—'} ({selectedPreviewImage.type})</p>
            </div>
            
            <button 
              onClick={() => setSelectedPreviewImage(null)}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Centered Image display */}
          <div className="flex-1 flex items-center justify-center p-4">
            <img 
              src={selectedPreviewImage.url} 
              alt={selectedPreviewImage.title}
              className="max-h-[75vh] max-w-full rounded-2xl object-contain border border-slate-700 shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Footer Diagnostic Panel */}
          <div className="bg-slate-800/80 backdrop-blur-md text-white p-4 rounded-2xl border border-slate-700/50 max-w-xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500 text-white uppercase">
                Tag: {selectedPreviewImage.tag}
              </span>
              <p className="text-xs font-medium text-slate-300 pt-1">
                {selectedPreviewImage.notes || 'Aucune note diagnostique ajoutée.'}
              </p>
            </div>

            <div className="flex gap-2 shrink-0">
              <button 
                onClick={() => window.print()} 
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer</span>
              </button>
              <button 
                onClick={() => setSelectedPreviewImage(null)} 
                className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-xs font-black rounded-xl transition-all cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Treatment */}
      {isAddTreatmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Nouveau Traitement Clinique</h3>
              <button onClick={() => setIsAddTreatmentModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTreatmentSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sélectionner la procédure clinique *</label>
                <select
                  required
                  value={selectedProcedureId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedProcedureId(id);
                    if (id === 'custom') {
                      setTreatName('');
                      setTreatCategory('Soins Généraux');
                      setTreatCost('');
                    } else if (id) {
                      const item = treatmentCatalog.find((tc) => tc.id === id);
                      if (item) {
                        setTreatName(item.name);
                        setTreatCategory(item.category);
                        setTreatCost(item.price);
                      }
                    } else {
                      setTreatName('');
                      setTreatCategory('');
                      setTreatCost('');
                    }
                  }}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-sky-500/20 outline-none text-slate-800"
                >
                  <option value="">-- Choisir une procédure --</option>
                  {treatmentCatalog.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.category}) — {item.price} DA
                    </option>
                  ))}
                  <option value="custom">Autre / Soin personnalisé...</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nom de la procédure (Personnalisable) *</label>
                <input
                  type="text"
                  required
                  placeholder="Sélectionnez une procédure ou saisissez-en une"
                  value={treatName}
                  onChange={(e) => setTreatName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-sky-500/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dent FDI # (Optionnel)</label>
                  <input
                    type="number"
                    placeholder="Ex: 17, 24"
                    value={treatToothId}
                    onChange={(e) => setTreatToothId(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-sky-500/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Catégorie *</label>
                  <select
                    required
                    value={treatCategory}
                    onChange={(e) => setTreatCategory(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-sky-500/20 outline-none"
                  >
                    <option value="">-- Choisir la catégorie --</option>
                    <option value="Soins Généraux">Soins Généraux</option>
                    <option value="Chirurgie">Chirurgie Buccale</option>
                    <option value="Orthodontie">Orthodontie</option>
                    <option value="Prothèse">Prothèse & Couronnes</option>
                    <option value="Implantologie">Implantologie</option>
                    <option value="Parodontologie">Parodontologie</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Honoraires / Coût (DA) *</label>
                  <input
                    type="number"
                    required
                    placeholder="Saisir le coût"
                    value={treatCost}
                    onChange={(e) => setTreatCost(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-black text-sky-700 focus:bg-white focus:ring-2 focus:ring-sky-500/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priorité clinique</label>
                  <select
                    value={treatPriority}
                    onChange={(e) => setTreatPriority(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:ring-2 focus:ring-sky-500/20 outline-none"
                  >
                    <option value="Basse">Basse</option>
                    <option value="Moyenne">Moyenne</option>
                    <option value="Haute">Haute</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Statut Initial</label>
                  <select
                    value={treatStatus}
                    onChange={(e) => setTreatStatus(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:ring-2 focus:ring-sky-500/20 outline-none"
                  >
                    <option value="Planifié">Planifié</option>
                    <option value="En cours">En cours</option>
                    <option value="Terminé">Terminé</option>
                    <option value="Annulé">Annulé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Praticien responsable</label>
                  <select
                    value={treatDoctor}
                    onChange={(e) => setTreatDoctor(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:ring-2 focus:ring-sky-500/20 outline-none"
                  >
                    <option value="Dr. Amrani Samir">Dr. Amrani Samir</option>
                    <option value="Dr. Benali Meriem">Dr. Benali Meriem</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTreatmentModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-xl shadow-md shadow-sky-500/20 cursor-pointer"
                >
                  Ajouter au Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Plan Appointment */}
      {isAddApptModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Planifier un Rendez-vous</h3>
              <button onClick={() => setIsAddApptModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddApptSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date de la séance *</label>
                <input
                  type="date"
                  required
                  value={apptDate}
                  onChange={(e) => setApptDate(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-sky-500/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Heure de début *</label>
                  <input
                    type="time"
                    required
                    value={apptTime}
                    onChange={(e) => setApptTime(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-sky-500/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type de consultation</label>
                  <select
                    value={apptType}
                    onChange={(e) => setApptType(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-sky-500/20 outline-none"
                  >
                    <option value="Consultation">Consultation Générale</option>
                    <option value="Détartrage">Détartrage & Nettoyage</option>
                    <option value="Chirurgie">Chirurgie / Extraction</option>
                    <option value="Orthodontie">Contrôle Ortho</option>
                    <option value="Urgence">Urgence Dentaire</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dentiste désigné</label>
                <select
                  value={apptDoctor}
                  onChange={(e) => setApptDoctor(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:ring-2 focus:ring-sky-500/20 outline-none"
                >
                  <option value="Dr. Amrani Samir">Dr. Amrani Samir</option>
                  <option value="Dr. Benali Meriem">Dr. Benali Meriem</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Motif / Notes</label>
                <textarea
                  rows={2}
                  value={apptNotes}
                  onChange={(e) => setApptNotes(e.target.value)}
                  placeholder="Ex: Première consultation pour implants ou suivi caries"
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/20 outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddApptModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-xl shadow-md shadow-sky-500/20 cursor-pointer"
                >
                  Planifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prescription Generator Modal */}
      {isPrescriptionGeneratorOpen && (
        <PrescriptionGeneratorModal
          patient={patient}
          onClose={() => setIsPrescriptionGeneratorOpen(false)}
        />
      )}
    </div>
  );
};
