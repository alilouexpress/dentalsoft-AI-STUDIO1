import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Bell,
  Clock,
  Users,
  Shield,
  Save,
  Check,
  LayoutGrid,
  Palette,
  FileText,
  Upload,
  Image,
  Sparkles,
  Eye,
  Printer,
  Trash2,
  FileCheck,
  Plus,
  Pencil,
  UserPlus,
  X,
  AlertTriangle,
  Key,
  BellRing,
  Send,
  History as HistoryIcon,
} from 'lucide-react';
import {
  DashboardConfig,
  PrescriptionTemplateSettings,
  PrescriptionTemplateStyle,
  StaffMember,
  UserAccount,
} from '../../types';

const navColors = [
  { id: 'sky', bg: 'bg-sky-500', name: 'Bleu' },
  { id: 'emerald', bg: 'bg-emerald-500', name: 'Émeraude' },
  { id: 'rose', bg: 'bg-rose-500', name: 'Rose' },
  { id: 'indigo', bg: 'bg-indigo-500', name: 'Indigo' },
  { id: 'amber', bg: 'bg-amber-500', name: 'Ambre' },
  { id: 'slate', bg: 'bg-slate-700', name: 'Gris' },
];

export const SettingsView: React.FC = () => {
  const {
    staffMembers,
    addStaffMember,
    updateStaffMember,
    deleteStaffMember,
    userAccounts,
    addUserAccount,
    updateUserAccount,
    deleteUserAccount,
    t,
    currentUser,
    currentUserRole,
    updateRolePassword,
    dashboardConfig,
    updateDashboardConfig,
    workspaceNavColor,
    setWorkspaceNavColor,
    prescriptionTemplate,
    updatePrescriptionTemplate,
    autoReminderSettings,
    updateAutoReminderSettings,
    triggerAutomatedRemindersNow,
    recallLogs,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'Général' | 'Ordonnance' | 'Horaire' | 'Notifications' | 'Personnel' | 'Utilisateurs' | 'Tableau de bord'
  >('Ordonnance');

  // Password Modification State (Admin only)
  const [roleToChange, setRoleToChange] = useState<'admin' | 'doctor' | 'assistant'>('admin');
  const [newRolePass, setNewRolePass] = useState<string>('');
  const [confirmRolePass, setConfirmRolePass] = useState<string>('');
  const [passChangeError, setPassChangeError] = useState<string>('');
  const [passChangeSuccess, setPassChangeSuccess] = useState<string>('');

  const handleUpdateRolePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassChangeError('');
    setPassChangeSuccess('');

    if (currentUserRole !== 'admin') {
      setPassChangeError("Seul l'Administrateur est autorisé à modifier les mots de passe.");
      return;
    }

    if (!newRolePass.trim()) {
      setPassChangeError('Veuillez saisir un nouveau mot de passe.');
      return;
    }

    if (newRolePass !== confirmRolePass) {
      setPassChangeError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (newRolePass.length < 4) {
      setPassChangeError('Le mot de passe doit contenir au moins 4 caractères.');
      return;
    }

    updateRolePassword(roleToChange, newRolePass);
    setNewRolePass('');
    setConfirmRolePass('');
    const roleLabels = { admin: 'Administrateur', doctor: 'Médecin', assistant: 'Assistant' };
    const label = roleLabels[roleToChange];
    setPassChangeSuccess(`Le mot de passe du rôle ${label} a été mis à jour avec succès !`);
    if (showToast) {
      showToast(`Mot de passe du rôle ${label} mis à jour avec succès !`, 'success');
    }
  };

  // Staff Modal state
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [staffForm, setStaffForm] = useState<{
    name: string;
    role: 'Admin' | 'Médecin' | 'Assistant' | 'Réceptionniste';
    email: string;
    phone: string;
    specialty: string;
    commissionPercent: number;
  }>({
    name: '',
    role: 'Médecin',
    email: '',
    phone: '',
    specialty: '',
    commissionPercent: 0,
  });

  // User Account Modal state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userForm, setUserForm] = useState<{
    username: string;
    password?: string;
    role: 'Admin' | 'Médecin' | 'Assistant' | 'Réceptionniste';
    staffMemberId: string;
    status: 'Actif' | 'Inactif';
  }>({
    username: '',
    password: '',
    role: 'Médecin',
    staffMemberId: '',
    status: 'Actif',
  });

  // Delete Confirmation Modal state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'staff' | 'user';
    id: string;
    name: string;
  } | null>(null);

  // Staff Handlers
  const handleOpenAddStaff = () => {
    setEditingStaffId(null);
    setStaffForm({
      name: '',
      role: 'Médecin',
      email: '',
      phone: '',
      specialty: 'Chirurgien Dentiste',
      commissionPercent: 0,
    });
    setIsStaffModalOpen(true);
  };

  const handleOpenEditStaff = (staff: StaffMember) => {
    setEditingStaffId(staff.id);
    setStaffForm({
      name: staff.name,
      role: staff.role,
      email: staff.email,
      phone: staff.phone,
      specialty: staff.specialty || '',
      commissionPercent: staff.commissionPercent,
    });
    setIsStaffModalOpen(true);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.name.trim()) return;

    if (editingStaffId) {
      updateStaffMember(editingStaffId, staffForm);
      if (showToast) showToast('Membre du personnel mis à jour avec succès', 'success');
    } else {
      addStaffMember(staffForm);
      if (showToast) showToast('Nouveau membre du personnel ajouté', 'success');
    }
    setIsStaffModalOpen(false);
  };

  // User Handlers
  const handleOpenAddUser = () => {
    setEditingUserId(null);
    setUserForm({
      username: '',
      password: '',
      role: 'Médecin',
      staffMemberId: staffMembers[0]?.id || '',
      status: 'Actif',
    });
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (user: UserAccount) => {
    setEditingUserId(user.id);
    setUserForm({
      username: user.username,
      password: user.password || '',
      role: user.role,
      staffMemberId: user.staffMemberId || '',
      status: user.status,
    });
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.username.trim()) return;

    const linkedStaff = staffMembers.find((s) => s.id === userForm.staffMemberId);

    if (editingUserId) {
      updateUserAccount(editingUserId, {
        ...userForm,
        staffMemberName: linkedStaff ? linkedStaff.name : undefined,
      });
      if (showToast) showToast('Compte utilisateur mis à jour', 'success');
    } else {
      addUserAccount({
        ...userForm,
        staffMemberName: linkedStaff ? linkedStaff.name : undefined,
      });
      if (showToast) showToast('Nouveau compte utilisateur créé', 'success');
    }
    setIsUserModalOpen(false);
  };

  const handleDeleteConfirmed = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'staff') {
      deleteStaffMember(deleteConfirm.id);
      if (showToast) showToast('Membre du personnel supprimé', 'info');
    } else {
      deleteUserAccount(deleteConfirm.id);
      if (showToast) showToast('Compte utilisateur supprimé', 'info');
    }
    setDeleteConfirm(null);
  };

  // Notification toggles
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [apptReminders, setApptReminders] = useState(true);
  const [marketingEmail, setMarketingEmail] = useState(false);

  // Dashboard personalization states
  const [localDashboardConfig, setLocalDashboardConfig] = useState<DashboardConfig>(dashboardConfig);
  const [selectedConfigRole, setSelectedConfigRole] = useState<'Admin' | 'Médecin' | 'Assistant' | 'Réceptionniste'>('Médecin');
  const [dashboardSaved, setDashboardSaved] = useState(false);

  // Prescription template local state
  const [localPrescriptionTemplate, setLocalPrescriptionTemplate] =
    useState<PrescriptionTemplateSettings>(prescriptionTemplate);
  const [prescriptionSaved, setPrescriptionSaved] = useState(false);

  useEffect(() => {
    setLocalDashboardConfig(dashboardConfig);
  }, [dashboardConfig]);

  useEffect(() => {
    setLocalPrescriptionTemplate(prescriptionTemplate);
  }, [prescriptionTemplate]);

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveDashboard = () => {
    updateDashboardConfig(localDashboardConfig);
    setDashboardSaved(true);
    setTimeout(() => setDashboardSaved(false), 2000);
  };

  const handleSavePrescriptionTemplate = () => {
    updatePrescriptionTemplate(localPrescriptionTemplate);
    setPrescriptionSaved(true);
    setTimeout(() => setPrescriptionSaved(false), 2500);
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLocalPrescriptionTemplate((prev) => ({
            ...prev,
            clinicLogoUrl: event.target?.result as string,
            showLogo: true,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundPaperFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLocalPrescriptionTemplate((prev) => ({
            ...prev,
            backgroundPaperUrl: event.target?.result as string,
            templateStyle: 'custom_background',
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('settings')}</h1>
          <p className="text-xs font-semibold text-slate-500">
            Configurer les paramètres globaux du cabinet dentaire et personnaliser le modèle d'ordonnance médicale.
          </p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="bg-white p-2 rounded-[28px] border border-sky-100 shadow-sm flex items-center gap-2 overflow-x-auto">
        {(
          [
            'Ordonnance',
            'Général',
            'Horaire',
            'Notifications',
            'Personnel',
            'Utilisateurs',
            'Tableau de bord',
          ] as const
        ).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === tab
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab === 'Ordonnance' && <FileText className="w-3.5 h-3.5 text-sky-200" />}
            {tab === 'Ordonnance' ? 'Ordonnance & En-tête' : tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="bg-white p-6 rounded-[28px] border border-sky-100 shadow-sm space-y-6">
        {/* ORDONNANCE & EN-TÊTE CONFIGURATION TAB */}
        {activeTab === 'Ordonnance' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-sky-600" />
                  <span>Personnalisation de l'En-tête & Formulaire d'Ordonnance</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Modifiez le nom du cabinet, le titre du médecin, le logo, l'en-tête officiel ou importez une photo/scan de votre ordonnance pré-imprimée.
                </p>
              </div>

              <button
                onClick={handleSavePrescriptionTemplate}
                className="px-6 py-2.5 text-xs font-black text-white bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 rounded-xl shadow-md shadow-sky-600/20 transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
              >
                {prescriptionSaved ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300 animate-bounce" />
                    <span>Modèle Enregistré !</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Enregistrer le Modèle d'Ordonnance</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT FORM CONTROLS (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Style / Template Selector */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-wider block flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    <span>1. Style de Mise en Page de l'Ordonnance</span>
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        id: 'official_border',
                        title: 'Bordure Officielle Encadrée',
                        desc: 'Bannière de la République, cadre structuré et référence.',
                      },
                      {
                        id: 'modern',
                        title: 'En-tête Moderne Épuré',
                        desc: 'Ligne de couleur accentuée et typographie moderne.',
                      },
                      {
                        id: 'classic',
                        title: 'Format Classique Médical',
                        desc: 'Disposition traditionnelle centrée, sobre et élégante.',
                      },
                      {
                        id: 'custom_background',
                        title: 'Papier Pré-imprimé / Photo',
                        desc: 'Utilise une photo de votre papier d\'ordonnance física.',
                      },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() =>
                          setLocalPrescriptionTemplate((prev) => ({
                            ...prev,
                            templateStyle: st.id as PrescriptionTemplateStyle,
                          }))
                        }
                        className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                          localPrescriptionTemplate.templateStyle === st.id
                            ? 'bg-white border-sky-500 ring-2 ring-sky-500/20 shadow-sm'
                            : 'bg-white/60 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{st.title}</span>
                          {localPrescriptionTemplate.templateStyle === st.id && (
                            <span className="w-2 h-2 rounded-full bg-sky-500" />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 leading-snug">{st.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Doctor & Clinic Header Information */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-4">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                    2. En-tête & Titres du Médecin
                  </label>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Bannière Officielle Supérieure
                      </label>
                      <input
                        type="text"
                        value={localPrescriptionTemplate.headerBannerText}
                        onChange={(e) =>
                          setLocalPrescriptionTemplate({
                            ...localPrescriptionTemplate,
                            headerBannerText: e.target.value,
                          })
                        }
                        placeholder="ex: RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE"
                        className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Nom du Cabinet Dentaire
                      </label>
                      <input
                        type="text"
                        value={localPrescriptionTemplate.clinicName}
                        onChange={(e) =>
                          setLocalPrescriptionTemplate({
                            ...localPrescriptionTemplate,
                            clinicName: e.target.value,
                          })
                        }
                        placeholder="ex: CABINET DE CHIRURGIE DENTAIRE & D'IMPLANTOLOGIE"
                        className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl font-black text-sky-900 focus:ring-2 focus:ring-sky-500/30"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          Nom & Prénom du Praticien
                        </label>
                        <input
                          type="text"
                          value={localPrescriptionTemplate.doctorName}
                          onChange={(e) =>
                            setLocalPrescriptionTemplate({
                              ...localPrescriptionTemplate,
                              doctorName: e.target.value,
                            })
                          }
                          placeholder="ex: Dr. Amrani Samir"
                          className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30 text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          Titre & N° d'Ordre des Médecins
                        </label>
                        <input
                          type="text"
                          value={localPrescriptionTemplate.doctorTitle}
                          onChange={(e) =>
                            setLocalPrescriptionTemplate({
                              ...localPrescriptionTemplate,
                              doctorTitle: e.target.value,
                            })
                          }
                          placeholder="ex: Chirurgien Dentiste — Ordre N° 16/4892"
                          className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-sky-500/30 text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Spécialités / Compétences Mentionnées
                      </label>
                      <input
                        type="text"
                        value={localPrescriptionTemplate.specialtyText}
                        onChange={(e) =>
                          setLocalPrescriptionTemplate({
                            ...localPrescriptionTemplate,
                            specialtyText: e.target.value,
                          })
                        }
                        placeholder="ex: Implantologie • Orthodontie • Parodontologie"
                        className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-sky-500/30 text-slate-900"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-1">
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Téléphone</label>
                        <input
                          type="text"
                          value={localPrescriptionTemplate.phone}
                          onChange={(e) =>
                            setLocalPrescriptionTemplate({
                              ...localPrescriptionTemplate,
                              phone: e.target.value,
                            })
                          }
                          className="w-full p-2 py-1.5 text-xs bg-white border border-slate-200 rounded-xl font-medium"
                        />
                      </div>

                      <div className="sm:col-span-1">
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">E-mail</label>
                        <input
                          type="text"
                          value={localPrescriptionTemplate.email}
                          onChange={(e) =>
                            setLocalPrescriptionTemplate({
                              ...localPrescriptionTemplate,
                              email: e.target.value,
                            })
                          }
                          className="w-full p-2 py-1.5 text-xs bg-white border border-slate-200 rounded-xl font-medium"
                        />
                      </div>

                      <div className="sm:col-span-1">
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Adresse / Ville</label>
                        <input
                          type="text"
                          value={localPrescriptionTemplate.address}
                          onChange={(e) =>
                            setLocalPrescriptionTemplate({
                              ...localPrescriptionTemplate,
                              address: e.target.value,
                            })
                          }
                          className="w-full p-2 py-1.5 text-xs bg-white border border-slate-200 rounded-xl font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Clinic Logo & Photo of Custom Prescription Form */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-4">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                    3. Logo du Cabinet & Photo d'Ordonnance de Référence
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Logo upload box */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                      <span className="text-[11px] font-bold text-slate-800 block">Logo du Cabinet</span>
                      {localPrescriptionTemplate.clinicLogoUrl ? (
                        <div className="flex items-center justify-between gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                          <img
                            src={localPrescriptionTemplate.clinicLogoUrl}
                            alt="Logo"
                            className="h-10 object-contain rounded"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setLocalPrescriptionTemplate((prev) => ({
                                ...prev,
                                clinicLogoUrl: '',
                              }))
                            }
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center p-3 border-2 border-dashed border-slate-200 rounded-xl">
                          <Image className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                          <label className="cursor-pointer text-[11px] font-bold text-sky-600 hover:underline">
                            <span>Charger un fichier image logo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Custom Background Photo / Scan upload box */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                      <span className="text-[11px] font-bold text-slate-800 block">
                        Photo / Scan de votre Ordonnance Physique
                      </span>
                      {localPrescriptionTemplate.backgroundPaperUrl ? (
                        <div className="flex items-center justify-between gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                          <img
                            src={localPrescriptionTemplate.backgroundPaperUrl}
                            alt="Scan Papier"
                            className="h-12 w-16 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setLocalPrescriptionTemplate((prev) => ({
                                ...prev,
                                backgroundPaperUrl: '',
                              }))
                            }
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center p-3 border-2 border-dashed border-slate-200 rounded-xl">
                          <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                          <label className="cursor-pointer text-[11px] font-bold text-sky-600 hover:underline">
                            <span>Charger la photo de votre ordonnance</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleBackgroundPaperFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. Footer & Additional Options */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                    4. Options & Pied de Page
                  </label>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-800">Afficher l'encadré Cachet & Signature</span>
                      <input
                        type="checkbox"
                        checked={localPrescriptionTemplate.showStampBox}
                        onChange={(e) =>
                          setLocalPrescriptionTemplate({
                            ...localPrescriptionTemplate,
                            showStampBox: e.target.checked,
                          })
                        }
                        className="w-4 h-4 accent-sky-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Mention du Pied de Page
                      </label>
                      <textarea
                        rows={2}
                        value={localPrescriptionTemplate.footerText}
                        onChange={(e) =>
                          setLocalPrescriptionTemplate({
                            ...localPrescriptionTemplate,
                            footerText: e.target.value,
                          })
                        }
                        className="w-full p-2 text-xs bg-white border border-slate-200 rounded-xl font-medium focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT LIVE PREVIEW (5 Cols) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-sky-600" /> Aperçu d'Impression Live (Ordonnance A5)
                  </span>
                  <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-mono">
                    {localPrescriptionTemplate.templateStyle.toUpperCase()}
                  </span>
                </div>

                {/* MINIATURE PRESCRIPTION SHEET PREVIEW */}
                <div className="bg-slate-900/10 p-3 rounded-2xl border border-slate-300">
                  <div className="bg-white rounded-xl shadow-md p-6 space-y-5 text-slate-900 font-sans text-[11px] relative overflow-hidden min-h-[460px] border border-slate-200">
                    {/* Background photo paper reference preview if uploaded */}
                    {localPrescriptionTemplate.templateStyle === 'custom_background' &&
                      localPrescriptionTemplate.backgroundPaperUrl && (
                        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                          <img
                            src={localPrescriptionTemplate.backgroundPaperUrl}
                            alt="Background Paper"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                    {/* HEADER RENDERING BY STYLE */}
                    <div className="relative z-10 border-b border-slate-800 pb-3 space-y-2">
                      {localPrescriptionTemplate.templateStyle === 'official_border' ? (
                        <div>
                          <div className="flex justify-between items-start border-b border-slate-900 pb-2">
                            <div>
                              <h4 className="font-black text-slate-900 uppercase text-[12px] leading-tight">
                                {localPrescriptionTemplate.clinicName}
                              </h4>
                              <p className="font-extrabold text-sky-800 text-[11px]">
                                {localPrescriptionTemplate.doctorName}
                              </p>
                              <p className="text-[9px] text-slate-600">{localPrescriptionTemplate.doctorTitle}</p>
                              <p className="text-[8px] text-slate-500">{localPrescriptionTemplate.address}</p>
                            </div>
                            <div className="text-right">
                              <span className="inline-block border border-slate-900 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider">
                                {localPrescriptionTemplate.headerBannerText || 'RÉPUBLIQUE ALGÉRIENNE'}
                              </span>
                              <p className="text-[9px] font-bold text-slate-700 mt-1">Date: 25/07/2026</p>
                              <p className="text-[8px] text-slate-400 font-mono">Réf: ORD-8021</p>
                            </div>
                          </div>
                          {localPrescriptionTemplate.specialtyText && (
                            <p className="text-[8px] text-slate-500 italic mt-1 text-center font-serif">
                              {localPrescriptionTemplate.specialtyText}
                            </p>
                          )}
                        </div>
                      ) : localPrescriptionTemplate.templateStyle === 'modern' ? (
                        <div>
                          <div className="h-1.5 bg-sky-600 rounded-full mb-2" />
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-black text-slate-900 text-xs">
                                {localPrescriptionTemplate.doctorName}
                              </h4>
                              <p className="text-[9px] font-bold text-sky-700">
                                {localPrescriptionTemplate.clinicName}
                              </p>
                              <p className="text-[8px] text-slate-500">{localPrescriptionTemplate.doctorTitle}</p>
                            </div>
                            <div className="text-right text-[8px] text-slate-500">
                              <p>{localPrescriptionTemplate.phone}</p>
                              <p>{localPrescriptionTemplate.address}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center space-y-0.5">
                          <h4 className="font-black uppercase text-xs">{localPrescriptionTemplate.clinicName}</h4>
                          <p className="font-bold text-sky-800">{localPrescriptionTemplate.doctorName}</p>
                          <p className="text-[8px] text-slate-500">{localPrescriptionTemplate.doctorTitle}</p>
                          <p className="text-[8px] text-slate-400">Tél: {localPrescriptionTemplate.phone}</p>
                        </div>
                      )}
                    </div>

                    {/* PATIENT BAR */}
                    <div className="relative z-10 bg-slate-50 p-2 rounded border border-slate-200 flex justify-between text-[10px] font-medium">
                      <span>
                        Nom: <strong>BENAISSA Karim</strong>
                      </span>
                      <span>Âge: 34 ans</span>
                      <span>Code: P-084</span>
                    </div>

                    {/* DOCUMENT TITLE */}
                    <div className="relative z-10 text-center my-3">
                      <span className="font-black uppercase tracking-wider text-xs border-b border-slate-900 pb-0.5 inline-block">
                        ORDONNANCE MÉDICALE
                      </span>
                    </div>

                    {/* RX ITEMS PREVIEW */}
                    <div className="relative z-10 space-y-3 min-h-[140px] pl-2 border-l-2 border-sky-600">
                      <div>
                        <p className="font-black uppercase text-[10px]">1. Amoxicilline 1g (Comprimés dispersibles)</p>
                        <p className="font-bold text-slate-700 text-[9px] ml-2">
                          👉 1 comprimé matin et soir — pendant 6 jours
                        </p>
                      </div>
                      <div>
                        <p className="font-black uppercase text-[10px]">2. Doliprane 1g (Paracétamol)</p>
                        <p className="font-bold text-slate-700 text-[9px] ml-2">
                          👉 1 comprimé toutes les 6 heures si douleur
                        </p>
                      </div>
                    </div>

                    {/* FOOTER & STAMP BOX */}
                    <div className="relative z-10 pt-4 border-t border-slate-800 flex items-end justify-between text-[8px] text-slate-500">
                      <div className="max-w-[180px]">
                        <p>{localPrescriptionTemplate.footerText}</p>
                      </div>

                      {localPrescriptionTemplate.showStampBox && (
                        <div className="w-28 h-16 border border-dashed border-slate-400 rounded p-1 text-center flex items-center justify-center text-[8px] font-bold text-slate-400">
                          {localPrescriptionTemplate.stampBoxText || 'Cachet & Signature'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'Notifications' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <BellRing className="w-5 h-5 text-sky-500" />
                Service de Rappels Automatiques & Notifications
              </h3>
              <p className="text-xs text-slate-500">
                Configurez le service en arrière-plan qui génère et transmet automatiquement les confirmations de rendez-vous aux patients.
              </p>
            </div>

            {/* AUTOMATED APPOINTMENT REMINDERS CONTROL CARD */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">Rappels Automatiques de Rendez-vous</h4>
                    <p className="text-[11px] text-slate-300">Service d'arrière-plan intelligent basé sur l'heure programmée</p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoReminderSettings ? autoReminderSettings.enabled : true}
                    onChange={(e) => {
                      updateAutoReminderSettings({ enabled: e.target.checked });
                      if (showToast) {
                        showToast(
                          e.target.checked
                            ? 'Service de rappels automatiques activé'
                            : 'Service de rappels automatiques désactivé',
                          e.target.checked ? 'success' : 'info'
                        );
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Délai de notification</label>
                  <select
                    value={autoReminderSettings ? autoReminderSettings.noticeHours : '24h'}
                    onChange={(e) => updateAutoReminderSettings({ noticeHours: e.target.value })}
                    className="w-full p-2.5 text-xs bg-slate-800/80 border border-slate-700 rounded-xl text-white font-bold focus:ring-2 focus:ring-sky-500/50"
                  >
                    <option value="24h">24 heures avant le RDV</option>
                    <option value="2h">2 heures avant le RDV</option>
                    <option value="Même jour">Le jour même du RDV (Matin)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Canal d'envoi principal</label>
                  <select
                    value={autoReminderSettings ? autoReminderSettings.channel : 'Multi-canal (SMS & WhatsApp)'}
                    onChange={(e) => updateAutoReminderSettings({ channel: e.target.value })}
                    className="w-full p-2.5 text-xs bg-slate-800/80 border border-slate-700 rounded-xl text-white font-bold focus:ring-2 focus:ring-sky-500/50"
                  >
                    <option value="Multi-canal (SMS & WhatsApp)">Multi-canal (SMS & WhatsApp)</option>
                    <option value="SMS">SMS Uniquement</option>
                    <option value="WhatsApp">WhatsApp Uniquement</option>
                    <option value="E-mail">E-mail Uniquement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Modèle de message personnalisé
                </label>
                <p className="text-[10px] text-slate-400 mb-2">
                  Variables disponibles : <code className="text-sky-300 font-mono">{'{PATIENT}'}</code>,{' '}
                  <code className="text-sky-300 font-mono">{'{DATE}'}</code>,{' '}
                  <code className="text-sky-300 font-mono">{'{TIME}'}</code>,{' '}
                  <code className="text-sky-300 font-mono">{'{DOCTOR}'}</code>,{' '}
                  <code className="text-sky-300 font-mono">{'{CLINIC}'}</code>
                </p>
                <textarea
                  rows={3}
                  value={
                    autoReminderSettings
                      ? autoReminderSettings.messageTemplate
                      : 'Bonjour {PATIENT}, votre rendez-vous au {CLINIC} est confirmé pour le {DATE} à {TIME} avec {DOCTOR}.'
                  }
                  onChange={(e) => updateAutoReminderSettings({ messageTemplate: e.target.value })}
                  className="w-full p-3 text-xs bg-slate-800/90 border border-slate-700 rounded-2xl text-slate-100 font-medium focus:ring-2 focus:ring-sky-500/50 leading-relaxed"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Statut : <span className="text-emerald-400 font-bold">Service d'arrière-plan actif</span>
                </p>

                <button
                  onClick={() => {
                    const count = triggerAutomatedRemindersNow();
                    if (showToast) {
                      if (count > 0) {
                        showToast(`Rappels déclenchés ! ${count} confirmation(s) de RDV envoyée(s).`, 'success');
                      } else {
                        showToast('Tous les rappels pour les RDV programmés ont déjà été traités.', 'info');
                      }
                    }
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Exécuter les rappels maintenant</span>
                </button>
              </div>
            </div>

            {/* STANDARD NOTIFICATION SWITCHES */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-500">
                Alertes Systèmes
              </h4>

              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Notifications e-mail cabinet</h4>
                  <p className="text-[11px] text-slate-500">Recevoir un rapport récapitulatif quotidien par e-mail</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotif}
                  onChange={(e) => setEmailNotif(e.target.checked)}
                  className="w-5 h-5 accent-sky-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Alertes SMS d'urgence</h4>
                  <p className="text-[11px] text-slate-500">Alerter immédiatement le praticien lors des annulations tardives</p>
                </div>
                <input
                  type="checkbox"
                  checked={smsNotif}
                  onChange={(e) => setSmsNotif(e.target.checked)}
                  className="w-5 h-5 accent-sky-500 cursor-pointer"
                />
              </div>
            </div>

            {/* RECENT AUTOMATED REMINDERS ACTIVITY LOG */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <HistoryIcon className="w-4 h-4 text-sky-500" />
                Historique des Derniers Rappels Automatiques Envoyés
              </h4>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                  {(recallLogs || []).slice(0, 5).map((log) => (
                    <div key={log.id} className="p-3 text-xs flex items-center justify-between hover:bg-slate-50">
                      <div>
                        <p className="font-bold text-slate-900">{log.patientName}</p>
                        <p className="text-[10px] text-slate-500 truncate max-w-xs">
                          {log.messagePreview || log.notes}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {log.method || 'SMS'} • {log.status || 'Envoyé'}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">{log.sentDate}</p>
                      </div>
                    </div>
                  ))}
                  {(!recallLogs || recallLogs.length === 0) && (
                    <div className="p-6 text-center text-xs text-slate-400">
                      Aucun rappel automatique enregistré pour le moment.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PERSONNEL TAB */}
        {activeTab === 'Personnel' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-500" />
                  Membres du Personnel ({staffMembers.length} membres)
                </h3>
                <p className="text-xs text-slate-500">
                  Ajoutez, modifiez ou supprimez les praticiens et le personnel médical / administratif.
                </p>
              </div>
              <button
                onClick={handleOpenAddStaff}
                className="px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 rounded-xl shadow-md shadow-sky-500/20 flex items-center gap-2 transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un membre</span>
              </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
              <table className="w-full text-left rtl:text-right text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="p-3.5">MEMBRE</th>
                    <th className="p-3.5">RÔLE</th>
                    <th className="p-3.5">E-MAIL</th>
                    <th className="p-3.5">TÉLÉPHONE</th>
                    <th className="p-3.5">SPÉCIALITÉ</th>
                    <th className="p-3.5">COMMISSION</th>
                    <th className="p-3.5 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {staffMembers.map((s) => (
                    <tr key={s.id} className="hover:bg-sky-50/50 transition-colors">
                      <td className="p-3.5 font-black text-slate-900">{s.name}</td>
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            s.role === 'Admin'
                              ? 'bg-purple-100 text-purple-800'
                              : s.role === 'Médecin'
                              ? 'bg-sky-100 text-sky-800'
                              : s.role === 'Assistant'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {s.role}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500">{s.email || '-'}</td>
                      <td className="p-3.5 text-slate-500">{s.phone || '-'}</td>
                      <td className="p-3.5 text-slate-600 font-semibold">{s.specialty || '-'}</td>
                      <td className="p-3.5 font-bold text-slate-900">{s.commissionPercent}%</td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditStaff(s)}
                            className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                            title="Modifier ce membre"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                type: 'staff',
                                id: s.id,
                                name: s.name,
                              })
                            }
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Supprimer ce membre"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {staffMembers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                        Aucun membre du personnel enregistré. Cliquez sur "+ Ajouter un membre".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* UTILISATEURS TAB */}
        {activeTab === 'Utilisateurs' && (
          <div className="space-y-6">
            {/* ADMIN PASSWORD CHANGE FORM */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-xl space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-700/60 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    Modification des Mots de Passe par l'Administrateur
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Définissez ou modifiez les mots de passe d'accès sécurisés pour chaque rôle d'utilisateur
                  </p>
                </div>
              </div>

              {currentUserRole !== 'admin' ? (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-300 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Réservé exclusivement à l'Administrateur. Seul l'administrateur du cabinet peut modifier les mots de passe.</span>
                </div>
              ) : (
                <form onSubmit={handleUpdateRolePassword} className="space-y-4 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Rôle Utilisateur</label>
                      <select
                        value={roleToChange}
                        onChange={(e) => setRoleToChange(e.target.value as 'admin' | 'doctor' | 'assistant')}
                        className="w-full p-2.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white font-bold focus:ring-2 focus:ring-sky-500/50"
                      >
                        <option value="admin">Administrateur (Admin)</option>
                        <option value="doctor">Médecin / Docteur (Praticien)</option>
                        <option value="assistant">Assistant(e) (Secrétariat)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Nouveau Mot de Passe</label>
                      <input
                        type="password"
                        required
                        value={newRolePass}
                        onChange={(e) => {
                          setNewRolePass(e.target.value);
                          setPassChangeError('');
                          setPassChangeSuccess('');
                        }}
                        placeholder="Saisir nouveau mot de passe"
                        className="w-full p-2.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white font-mono font-bold focus:ring-2 focus:ring-sky-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Confirmer le Mot de Passe</label>
                      <input
                        type="password"
                        required
                        value={confirmRolePass}
                        onChange={(e) => {
                          setConfirmRolePass(e.target.value);
                          setPassChangeError('');
                          setPassChangeSuccess('');
                        }}
                        placeholder="Confirmer nouveau mot de passe"
                        className="w-full p-2.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white font-mono font-bold focus:ring-2 focus:ring-sky-500/50"
                      />
                    </div>
                  </div>

                  {passChangeError && (
                    <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-200 text-xs font-medium flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{passChangeError}</span>
                    </div>
                  )}

                  {passChangeSuccess && (
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs font-bold flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{passChangeSuccess}</span>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-xs font-bold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-xl shadow-lg shadow-sky-500/20 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Enregistrer le Nouveau Mot de Passe</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* ACCOUNTS TABLE */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-sky-500" />
                    Comptes Utilisateurs ({userAccounts ? userAccounts.length : 0})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Gérez les identifiants de connexion, rôles et autorisations d'accès.
                  </p>
                </div>
                {currentUserRole === 'admin' && (
                  <button
                    onClick={handleOpenAddUser}
                    className="px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 rounded-xl shadow-md shadow-sky-500/20 flex items-center gap-2 transition-all cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Ajouter un utilisateur</span>
                  </button>
                )}
              </div>

              <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
                <table className="w-full text-left rtl:text-right text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="p-3.5">NOM D'UTILISATEUR</th>
                      <th className="p-3.5">RÔLE</th>
                      <th className="p-3.5">MEMBRE DU PERSONNEL LIÉ</th>
                      <th className="p-3.5">STATUT</th>
                      <th className="p-3.5">DATE CRÉATION</th>
                      <th className="p-3.5 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {(userAccounts || []).map((u) => (
                      <tr key={u.id} className="hover:bg-sky-50/50 transition-colors">
                        <td className="p-3.5 font-black text-slate-900 flex items-center gap-2">
                          <Key className="w-3.5 h-3.5 text-sky-500" />
                          {u.username}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              u.role === 'Admin'
                                ? 'bg-purple-100 text-purple-800'
                                : u.role === 'Médecin'
                                ? 'bg-sky-100 text-sky-800'
                                : u.role === 'Assistant'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600 font-semibold">{u.staffMemberName || '-'}</td>
                        <td className="p-3.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.status === 'Actif'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500">{u.createdAt || '-'}</td>
                        <td className="p-3.5 text-right">
                          {currentUserRole === 'admin' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditUser(u)}
                                className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                                title="Modifier l'utilisateur"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteConfirm({
                                    type: 'user',
                                    id: u.id,
                                    name: u.username,
                                  })
                                }
                                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Supprimer l'utilisateur"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-semibold">Lecture seule</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {(!userAccounts || userAccounts.length === 0) && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                          Aucun compte utilisateur configuré.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}


        {/* GENERAL & HORAIRE TAB */}
        {(activeTab === 'Général' || activeTab === 'Horaire') && (
          <div className="max-w-md space-y-4">
            <h3 className="text-base font-black text-slate-900">Information du Cabinet</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nom du Cabinet</label>
              <input
                type="text"
                defaultValue={prescriptionTemplate.clinicName || 'Cabinet Dentaire DentalSoft'}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone fixe / Mobile</label>
              <input
                type="text"
                defaultValue={prescriptionTemplate.phone || '0699000099'}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30"
              />
            </div>

            <div className="pt-4 border-t border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-sky-500" />
                Couleur de la barre de navigation du patient
              </label>
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {navColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setWorkspaceNavColor(color.id)}
                    title={color.name}
                    className={`w-8 h-8 rounded-full ${color.bg} transition-all cursor-pointer shadow-sm ${
                      workspaceNavColor === color.id
                        ? 'ring-2 ring-offset-2 ring-slate-400 scale-110'
                        : 'hover:scale-110 opacity-70 hover:opacity-100'
                    }`}
                    aria-label={`Changer le thème pour ${color.name}`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleSave}
              className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 rounded-xl shadow-md shadow-sky-500/20 cursor-pointer transition-all"
            >
              Sauvegarder
            </button>
          </div>
        )}

        {/* TABLEAU DE BORD TAB */}
        {activeTab === 'Tableau de bord' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-sky-500 animate-pulse" />
                Personnalisation du Tableau de Bord
              </h3>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-2xl border border-slate-100 max-w-lg">
              {(['Admin', 'Médecin', 'Assistant', 'Réceptionniste'] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedConfigRole(role)}
                  className={`flex-1 py-1.5 text-[11px] font-black rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    selectedConfigRole === role
                      ? 'bg-white text-sky-600 shadow-sm border border-sky-100'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {role === 'Admin' ? 'Administrateur' : role}
                </button>
              ))}
            </div>

            <button
              onClick={handleSaveDashboard}
              className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 rounded-xl shadow-md shadow-sky-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer la configuration</span>
            </button>
          </div>
        )}
      </div>

      {/* MODAL AJOUT / EDITION MEMBRE DU PERSONNEL */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 animate-in fade-in zoom-in duration-150 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">
                    {editingStaffId ? 'Modifier le membre du personnel' : 'Nouveau membre du personnel'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Renseignez les détails du profil médical ou administratif.</p>
                </div>
              </div>
              <button
                onClick={() => setIsStaffModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nom et Prénom *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Dr. Benali Yasmine"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rôle *</label>
                  <select
                    value={staffForm.role}
                    onChange={(e) =>
                      setStaffForm({
                        ...staffForm,
                        role: e.target.value as 'Admin' | 'Médecin' | 'Assistant' | 'Réceptionniste',
                      })
                    }
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Médecin">Médecin / Praticien</option>
                    <option value="Assistant">Assistant(e)</option>
                    <option value="Réceptionniste">Réceptionniste</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Commission (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={staffForm.commissionPercent}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, commissionPercent: Number(e.target.value) || 0 })
                    }
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Spécialité / Qualification</label>
                <input
                  type="text"
                  placeholder="ex: Chirurgien Dentiste, Orthodontiste..."
                  value={staffForm.specialty}
                  onChange={(e) => setStaffForm({ ...staffForm, specialty: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-sky-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    placeholder="adresse@email.com"
                    value={staffForm.email}
                    onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-sky-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    placeholder="0699000000"
                    value={staffForm.phone}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-sky-500/30"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-xl shadow-md shadow-sky-500/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingStaffId ? 'Enregistrer les modifications' : 'Ajouter le membre'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL AJOUT / EDITION UTILISATEUR */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 animate-in fade-in zoom-in duration-150 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">
                    {editingUserId ? "Modifier le compte utilisateur" : "Créer un compte utilisateur"}
                  </h3>
                  <p className="text-[11px] text-slate-500">Configurez l'identifiant et les permissions de connexion.</p>
                </div>
              </div>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nom d'utilisateur *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: dr.benali ou reception"
                  value={userForm.username}
                  onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mot de passe / Code PIN</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-sky-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rôle *</label>
                  <select
                    value={userForm.role}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        role: e.target.value as 'Admin' | 'Médecin' | 'Assistant' | 'Réceptionniste',
                      })
                    }
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Médecin">Médecin</option>
                    <option value="Assistant">Assistant</option>
                    <option value="Réceptionniste">Réceptionniste</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Statut du compte</label>
                  <select
                    value={userForm.status}
                    onChange={(e) =>
                      setUserForm({ ...userForm, status: e.target.value as 'Actif' | 'Inactif' })
                    }
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30"
                  >
                    <option value="Actif">Actif</option>
                    <option value="Inactif">Inactif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Membre du personnel associé</label>
                <select
                  value={userForm.staffMemberId}
                  onChange={(e) => setUserForm({ ...userForm, staffMemberId: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30"
                >
                  <option value="">-- Aucun membre lié --</option>
                  {staffMembers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-xl shadow-md shadow-sky-500/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingUserId ? 'Mettre à jour' : 'Créer le compte'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SUPPRESSION CONFIRMATION */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-sm w-full p-6 animate-in fade-in zoom-in duration-150 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0 font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-sm">Confirmer la suppression</h3>
                <p className="text-[11px] text-slate-500">Cette action est irréversible.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Voulez-vous vraiment supprimer {deleteConfirm.type === 'staff' ? 'le membre' : "l'utilisateur"}{' '}
              <strong className="text-slate-900">{deleteConfirm.name}</strong> ?
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/20 cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Oui, supprimer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
