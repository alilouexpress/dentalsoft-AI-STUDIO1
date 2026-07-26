import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Language,
  PageView,
  Patient,
  Appointment,
  TreatmentCatalogItem,
  DentalImage,
  Prescription,
  Payment,
  LabCase,
  Quotation,
  InventoryItem,
  Invoice,
  DebtItem,
  Expense,
  TaskItem,
  AuditLogItem,
  StaffMember,
  UserAccount,
  ToothData,
  TreatmentItem,
  ClinicalNote,
  InsurancePolicy,
  InsuranceClaim,
  StaffMessage,
  StaffNotification,
  RecallLog,
  DashboardConfig,
  RoleDashboardConfig,
  PrescriptionTemplateSettings,
  UserRole,
} from '../types';
import {
  getStoredRolePasswords,
  saveRolePasswords,
} from '../config/passwords';
import {
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_TREATMENT_CATALOG,
  INITIAL_IMAGES,
  INITIAL_PRESCRIPTIONS,
  INITIAL_PAYMENTS,
  INITIAL_LAB_CASES,
  INITIAL_QUOTATIONS,
  INITIAL_INVENTORY,
  INITIAL_INVOICES,
  INITIAL_DEBTS,
  INITIAL_EXPENSES,
  INITIAL_TASKS,
  INITIAL_AUDIT_LOGS,
  INITIAL_STAFF,
  INITIAL_PATIENT_TREATMENTS,
  INITIAL_CLINICAL_NOTES,
  INITIAL_INSURANCE_POLICIES,
  INITIAL_INSURANCE_CLAIMS,
  INITIAL_STAFF_MESSAGES,
  INITIAL_STAFF_NOTIFICATIONS,
} from '../data/initialData';
import { translations } from '../locales/translations';

export interface ToastNotification {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  // Toast notifications
  toast: ToastNotification | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  hideToast: () => void;

  // Auth & Cabinet Intro Tour
  isAuthenticated: boolean;
  showCabinetIntro: boolean;
  setShowCabinetIntro: (show: boolean) => void;
  currentUserRole: UserRole;
  rolePasswords: Record<UserRole, string>;
  login: (role?: UserRole) => void;
  logout: () => void;
  verifyRolePassword: (role: UserRole, inputPass: string) => boolean;
  updateRolePassword: (role: UserRole, newPass: string) => void;
  isRoleAllowed: (page: PageView) => boolean;

  // View & Nav
  activePage: PageView;
  setActivePage: (page: PageView) => void;
  activePatientId: string | null;
  openPatientWorkspace: (patientId: string) => void;

  // Quick Add Patient Modal
  isQuickAddPatientOpen: boolean;
  setIsQuickAddPatientOpen: (open: boolean) => void;
  openQuickAddPatient: () => void;
  closeQuickAddPatient: () => void;

  // Patient Summary Modal
  summaryPatientId: string | null;
  isPatientSummaryOpen: boolean;
  openPatientSummary: (patientId: string) => void;
  closePatientSummary: () => void;

  // Staff Chat Drawer
  isStaffChatOpen: boolean;
  setIsStaffChatOpen: (open: boolean) => void;

  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Clinic Data
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'code' | 'lastVisit' | 'balance' | 'status'>) => Patient;
  updatePatient: (patient: Patient) => void;
  deletePatient: (id: string) => void;

  appointments: Appointment[];
  addAppointment: (app: Omit<Appointment, 'id' | 'status'>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  rescheduleAppointment: (id: string, newDate: string, newTime: string, newDoctor?: string) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;

  teethData: Record<string, Record<number, ToothData>>; // patientId -> toothId -> ToothData
  updateToothData: (patientId: string, toothId: number, data: Partial<ToothData>) => void;

  clinicalNotes: ClinicalNote[];
  addClinicalNote: (note: Omit<ClinicalNote, 'id'>) => void;
  updateClinicalNote: (id: string, updates: Partial<ClinicalNote>) => void;
  deleteClinicalNote: (id: string) => void;

  patientTreatments: TreatmentItem[];
  addPatientTreatment: (treatment: Omit<TreatmentItem, 'id'>) => void;

  images: DentalImage[];
  addImage: (img: Omit<DentalImage, 'id'>) => void;

  prescriptions: Prescription[];
  addPrescription: (presc: Omit<Prescription, 'id'>) => void;

  payments: Payment[];
  addPayment: (payment: Omit<Payment, 'id'>) => void;

  labCases: LabCase[];
  addLabCase: (lab: Omit<LabCase, 'id' | 'code'>) => void;

  quotations: Quotation[];
  addQuotation: (quo: Omit<Quotation, 'id' | 'number'>) => void;

  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;

  invoices: Invoice[];
  addInvoice: (inv: Omit<Invoice, 'id' | 'number' | 'remainingAmount' | 'status'>) => void;

  debts: DebtItem[];

  expenses: Expense[];
  addExpense: (exp: Omit<Expense, 'id'>) => void;

  tasks: TaskItem[];
  addTask: (task: Omit<TaskItem, 'id' | 'status'>) => void;
  toggleTaskStatus: (id: string) => void;

  auditLogs: AuditLogItem[];
  logAudit: (action: AuditLogItem['action'], entityType: string, details: string) => void;

  treatmentCatalog: TreatmentCatalogItem[];
  addTreatmentCatalogItem: (item: Omit<TreatmentCatalogItem, 'id'>) => void;

  staffMembers: StaffMember[];
  addStaffMember: (member: Omit<StaffMember, 'id'>) => void;
  updateStaffMember: (id: string, updates: Partial<StaffMember>) => void;
  deleteStaffMember: (id: string) => void;

  userAccounts: UserAccount[];
  addUserAccount: (user: Omit<UserAccount, 'id'>) => void;
  updateUserAccount: (id: string, updates: Partial<UserAccount>) => void;
  deleteUserAccount: (id: string) => void;

  // Insurance & Tiers-Payant Management
  insurancePolicies: InsurancePolicy[];
  insuranceClaims: InsuranceClaim[];
  addInsurancePolicy: (policy: Omit<InsurancePolicy, 'id'>) => void;
  updateInsurancePolicy: (id: string, updates: Partial<InsurancePolicy>) => void;
  deleteInsurancePolicy: (id: string) => void;
  addInsuranceClaim: (claim: Omit<InsuranceClaim, 'id' | 'claimNumber' | 'submissionDate'>) => void;
  updateInsuranceClaimStatus: (
    id: string,
    status: InsuranceClaim['status'],
    approvedAmount?: number,
    rejectionReason?: string
  ) => void;
  deleteInsuranceClaim: (id: string) => void;

  // User, Staff Messaging & Handoff
  currentUser: StaffMember;
  setCurrentUser: (member: StaffMember) => void;
  staffMessages: StaffMessage[];
  addStaffMessage: (content: string, channelId: string, isUrgent?: boolean) => void;
  clearStaffMessages: () => void;
  staffNotifications: StaffNotification[];
  addStaffNotification: (notif: Omit<StaffNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Patient Recalls & Automated Reminders System
  recallLogs: RecallLog[];
  addRecallLog: (log: Omit<RecallLog, 'id' | 'sentDate'>) => void;
  toggleAutoRecall: (patientId: string) => void;
  sendManualRecall: (patientId: string, method: 'SMS' | 'WhatsApp' | 'Email' | 'Téléphone') => void;
  autoReminderSettings: {
    enabled: boolean;
    noticeHours: string;
    channel: string;
    messageTemplate: string;
  };
  updateAutoReminderSettings: (settings: Partial<{ enabled: boolean; noticeHours: string; channel: string; messageTemplate: string }>) => void;
  triggerAutomatedRemindersNow: () => number;

  // Dashboard customization settings
  dashboardConfig: DashboardConfig;
  updateDashboardConfig: (config: DashboardConfig) => void;

  // Prescription template settings
  prescriptionTemplate: PrescriptionTemplateSettings;
  updatePrescriptionTemplate: (template: PrescriptionTemplateSettings) => void;

  // Workspace Nav Color
  workspaceNavColor: string;
  setWorkspaceNavColor: (color: string) => void;
}

const DEFAULT_DASHBOARD_CONFIG: DashboardConfig = {
  Admin: {
    showMetrics: true,
    showFinancials: true,
    showWaitingRoom: true,
    showVisitsChart: true,
    showTodaySchedule: true,
    showRecentPatients: true,
    showTasks: true,
  },
  Médecin: {
    showMetrics: true,
    showFinancials: false,
    showWaitingRoom: true,
    showVisitsChart: true,
    showTodaySchedule: true,
    showRecentPatients: true,
    showTasks: true,
  },
  Assistant: {
    showMetrics: true,
    showFinancials: false,
    showWaitingRoom: true,
    showVisitsChart: false,
    showTodaySchedule: true,
    showRecentPatients: true,
    showTasks: true,
  },
  Réceptionniste: {
    showMetrics: true,
    showFinancials: false,
    showWaitingRoom: true,
    showVisitsChart: false,
    showTodaySchedule: true,
    showRecentPatients: true,
    showTasks: true,
  },
};

const DEFAULT_PRESCRIPTION_TEMPLATE: PrescriptionTemplateSettings = {
  templateStyle: 'official_border',
  clinicName: 'CABINET DE CHIRURGIE DENTAIRE & D\'IMPLANTOLOGIE',
  doctorName: 'Dr. Amrani Samir',
  doctorTitle: 'Chirurgien Dentiste — Ordre des Médecins N° 16/4892',
  headerBannerText: 'RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE',
  specialtyText: 'Chirurgie Buccale • Implantologie • Orthodontie • Parodontologie',
  address: 'Val d\'Hydra, Alger, Algérie',
  phone: '+213 (0) 23 45 67 89 / 06 99 00 00 99',
  email: 'contact@cabinet-amrani.dz',
  clinicLogoUrl: '',
  backgroundPaperUrl: '',
  showLogo: true,
  showStampBox: true,
  stampBoxText: 'Cachet & Signature du Praticien',
  footerText: 'Ordonnance médicale établie conformément aux normes de déontologie dentaire.',
  accentColor: '#0284c7',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastNotification | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4000);
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  const [workspaceNavColor, setWorkspaceNavColor] = useState<string>('sky');
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>(() => {
    const saved = localStorage.getItem('ds_dashboard_config');
    return saved ? JSON.parse(saved) : DEFAULT_DASHBOARD_CONFIG;
  });

  const updateDashboardConfig = (config: DashboardConfig) => {
    setDashboardConfig(config);
    logAudit('updated', 'system', `Configuration globale du tableau de bord mise à jour`);
  };

  const [prescriptionTemplate, setPrescriptionTemplate] = useState<PrescriptionTemplateSettings>(() => {
    const saved = localStorage.getItem('ds_prescription_template');
    return saved ? JSON.parse(saved) : DEFAULT_PRESCRIPTION_TEMPLATE;
  });

  const updatePrescriptionTemplate = (template: PrescriptionTemplateSettings) => {
    setPrescriptionTemplate(template);
    logAudit('updated', 'system', `Modèle et en-tête d'ordonnance médicale personnalisés`);
  };

  useEffect(() => {
    localStorage.setItem('ds_prescription_template', JSON.stringify(prescriptionTemplate));
  }, [prescriptionTemplate]);

  const [showCabinetIntro, setShowCabinetIntro] = useState<boolean>(() => {
    return localStorage.getItem('ds_authenticated') !== 'true';
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ds_authenticated') === 'true';
  });
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('ds_user_role') as UserRole;
    return saved || 'admin';
  });
  const [rolePasswords, setRolePasswords] = useState<Record<UserRole, string>>(() =>
    getStoredRolePasswords()
  );

  const [activePage, setActivePage] = useState<PageView>('dashboard');
  const [activePatientId, setActivePatientId] = useState<string | null>(
    '620540e5-137c-49b5-9c0e-d3098e74bd63' // AuditFix by default
  );
  const [isQuickAddPatientOpen, setIsQuickAddPatientOpen] = useState<boolean>(false);
  const [summaryPatientId, setSummaryPatientId] = useState<string | null>(null);
  const [isPatientSummaryOpen, setIsPatientSummaryOpen] = useState<boolean>(false);
  const [isStaffChatOpen, setIsStaffChatOpen] = useState<boolean>(false);
  const [language, setLanguageState] = useState<Language>('fr');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Main State collections
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('ds_patients');
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('ds_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [teethData, setTeethData] = useState<Record<string, Record<number, ToothData>>>(() => {
    const map: Record<string, Record<number, ToothData>> = {};
    INITIAL_PATIENTS.forEach((p) => {
      if (p.teethData) {
        map[p.id] = p.teethData;
      }
    });
    return map;
  });

  const [patientTreatments, setPatientTreatments] = useState<TreatmentItem[]>(INITIAL_PATIENT_TREATMENTS);
  const [images, setImages] = useState<DentalImage[]>(INITIAL_IMAGES);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [labCases, setLabCases] = useState<LabCase[]>(INITIAL_LAB_CASES);
  const [quotations, setQuotations] = useState<Quotation[]>(INITIAL_QUOTATIONS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [debts] = useState<DebtItem[]>(INITIAL_DEBTS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [treatmentCatalog, setTreatmentCatalog] = useState<TreatmentCatalogItem[]>(INITIAL_TREATMENT_CATALOG);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('ds_staff_members');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('ds_user_accounts');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'usr-1',
            username: 'admin',
            role: 'Admin',
            staffMemberId: 'staff-1',
            staffMemberName: 'Dr. Amrani Samir',
            status: 'Actif',
            createdAt: '2026-01-10',
          },
          {
            id: 'usr-2',
            username: 'dr.benali',
            role: 'Médecin',
            staffMemberId: 'staff-2',
            staffMemberName: 'Dr. Yasmine Benali',
            status: 'Actif',
            createdAt: '2026-02-15',
          },
          {
            id: 'usr-3',
            username: 'assistant',
            role: 'Assistant',
            staffMemberId: 'staff-3',
            staffMemberName: 'Sarah Mansouri',
            status: 'Actif',
            createdAt: '2026-03-01',
          },
          {
            id: 'usr-4',
            username: 'reception',
            role: 'Réceptionniste',
            staffMemberId: 'staff-4',
            staffMemberName: 'Amel Mansouri',
            status: 'Actif',
            createdAt: '2026-03-10',
          },
        ];
  });
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNote[]>(INITIAL_CLINICAL_NOTES);

  const [recallLogs, setRecallLogs] = useState<RecallLog[]>(() => {
    const saved = localStorage.getItem('ds_recall_logs');
    return saved ? JSON.parse(saved) : [
      {
        id: 'rec-1',
        patientId: '620540e5-137c-49b5-9c0e-d3098e74bd63',
        patientName: 'Karim Benaissa',
        patientPhone: '0550 12 34 56',
        patientEmail: 'k.benaissa@gmail.com',
        sentDate: '2026-07-20 10:15',
        method: 'SMS',
        status: 'Délivré',
        messagePreview: 'Cher Karim, votre contrôle dentaire semestriel est prévu ce mois-ci. Prenez RDV en ligne ou par téléphone.',
        notes: 'Envoi automatique programmé.'
      },
      {
        id: 'rec-2',
        patientId: 'e20540e5-137c-49b5-9c0e-d3098e74bd65',
        patientName: 'Fatiha Belkacem',
        patientPhone: '0661 98 76 54',
        patientEmail: 'fatiha.b@yahoo.com',
        sentDate: '2026-07-22 14:30',
        method: 'Email',
        status: 'Envoyé',
        messagePreview: 'Bonjour Fatiha, cela fait 6 mois depuis votre dernier détartrage. Nous vous invitons à planifier votre prochain RDV.',
        notes: 'Manuel par réceptionniste.'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('ds_recall_logs', JSON.stringify(recallLogs));
  }, [recallLogs]);

  // Automated Appointment Confirmation Reminder Settings state
  const [autoReminderSettings, setAutoReminderSettings] = useState<{
    enabled: boolean;
    noticeHours: string;
    channel: string;
    messageTemplate: string;
  }>(() => {
    const saved = localStorage.getItem('ds_auto_reminder_settings');
    return saved
      ? JSON.parse(saved)
      : {
          enabled: true,
          noticeHours: '24h',
          channel: 'Multi-canal (SMS & WhatsApp)',
          messageTemplate:
            'Bonjour {PATIENT}, votre rendez-vous au {CLINIC} est confirmé pour le {DATE} à {TIME} avec {DOCTOR}. En cas de besoin de report, contactez-nous au 0699000099.',
        };
  });

  const updateAutoReminderSettings = (
    updates: Partial<{ enabled: boolean; noticeHours: string; channel: string; messageTemplate: string }>
  ) => {
    setAutoReminderSettings((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('ds_auto_reminder_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const [insurancePolicies, setInsurancePolicies] = useState<InsurancePolicy[]>(() => {
    const saved = localStorage.getItem('ds_insurance_policies');
    return saved ? JSON.parse(saved) : INITIAL_INSURANCE_POLICIES;
  });

  const [insuranceClaims, setInsuranceClaims] = useState<InsuranceClaim[]>(() => {
    const saved = localStorage.getItem('ds_insurance_claims');
    return saved ? JSON.parse(saved) : INITIAL_INSURANCE_CLAIMS;
  });

  const [currentUser, setCurrentUserState] = useState<StaffMember>(() => {
    const saved = localStorage.getItem('ds_current_user');
    return saved ? JSON.parse(saved) : INITIAL_STAFF[0];
  });

  const [staffMessages, setStaffMessages] = useState<StaffMessage[]>(() => {
    const saved = localStorage.getItem('ds_staff_messages');
    return saved ? JSON.parse(saved) : INITIAL_STAFF_MESSAGES;
  });

  const [staffNotifications, setStaffNotifications] = useState<StaffNotification[]>(() => {
    const saved = localStorage.getItem('ds_staff_notifications');
    return saved ? JSON.parse(saved) : INITIAL_STAFF_NOTIFICATIONS;
  });

  // Debounced localStorage sync helper to prevent UI lag on frequent state updates
  const saveDebounced = useCallback((key: string, value: any) => {
    const handler = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error(`Failed to save ${key} in localStorage`, e);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, []);

  // Sync to localStorage
  useEffect(() => saveDebounced('ds_patients', patients), [patients, saveDebounced]);
  useEffect(() => saveDebounced('ds_appointments', appointments), [appointments, saveDebounced]);
  useEffect(() => saveDebounced('ds_insurance_policies', insurancePolicies), [insurancePolicies, saveDebounced]);
  useEffect(() => saveDebounced('ds_insurance_claims', insuranceClaims), [insuranceClaims, saveDebounced]);
  useEffect(() => saveDebounced('ds_staff_members', staffMembers), [staffMembers, saveDebounced]);
  useEffect(() => saveDebounced('ds_user_accounts', userAccounts), [userAccounts, saveDebounced]);
  useEffect(() => saveDebounced('ds_current_user', currentUser), [currentUser, saveDebounced]);
  useEffect(() => saveDebounced('ds_staff_messages', staffMessages), [staffMessages, saveDebounced]);
  useEffect(() => saveDebounced('ds_staff_notifications', staffNotifications), [staffNotifications, saveDebounced]);
  useEffect(() => saveDebounced('ds_prescription_template', prescriptionTemplate), [prescriptionTemplate, saveDebounced]);
  useEffect(() => saveDebounced('ds_dashboard_config', dashboardConfig), [dashboardConfig, saveDebounced]);

  // Staff Members CRUD handlers
  const addStaffMember = (member: Omit<StaffMember, 'id'>) => {
    const newMember: StaffMember = {
      ...member,
      id: `staff-${Date.now()}`,
    };
    setStaffMembers((prev) => [newMember, ...prev]);
    logAudit('created', 'staff', `Ajout du membre du personnel : ${member.name} (${member.role})`);
  };

  const updateStaffMember = (id: string, updates: Partial<StaffMember>) => {
    setStaffMembers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    logAudit('updated', 'staff', `Mise à jour du membre du personnel ID: ${id}`);
  };

  const deleteStaffMember = (id: string) => {
    setStaffMembers((prev) => prev.filter((s) => s.id !== id));
    logAudit('deleted', 'staff', `Suppression du membre du personnel ID: ${id}`);
  };

  // User Accounts CRUD handlers
  const addUserAccount = (user: Omit<UserAccount, 'id'>) => {
    const newUser: UserAccount = {
      ...user,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUserAccounts((prev) => [newUser, ...prev]);
    logAudit('created', 'user', `Création du compte utilisateur : ${user.username} (${user.role})`);
  };

  const updateUserAccount = (id: string, updates: Partial<UserAccount>) => {
    setUserAccounts((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
    logAudit('updated', 'user', `Modification du compte utilisateur ID: ${id}`);
  };

  const deleteUserAccount = (id: string) => {
    setUserAccounts((prev) => prev.filter((u) => u.id !== id));
    logAudit('deleted', 'user', `Suppression du compte utilisateur ID: ${id}`);
  };

  const setCurrentUser = (member: StaffMember) => {
    setCurrentUserState(member);
    logAudit('updated', 'system', `Session utilisateur changée : ${member.name} (${member.role})`);
  };

  const addStaffMessage = (content: string, channelId: string, isUrgent?: boolean) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const newMessage: StaffMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      content,
      timestamp: timeStr,
      channelId,
      isUrgent,
    };
    setStaffMessages((prev) => [...prev, newMessage]);
    
    // If it's urgent, also trigger an internal notification for other staff members
    if (isUrgent) {
      addStaffNotification({
        type: 'urgent_task',
        title: `Message urgent de ${currentUser.name}`,
        message: content,
      });
    }
  };

  const clearStaffMessages = () => {
    setStaffMessages([]);
  };

  const addStaffNotification = (notif: Omit<StaffNotification, 'id' | 'timestamp' | 'read'>) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const newNotif: StaffNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: timeStr,
      read: false,
    };
    setStaffNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setStaffNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setStaffNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Set html document direction LTR/RTL on language change
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  };

  const t = (key: string): string => {
    const langDict = translations[language] || translations.fr;
    return langDict[key] || translations.fr[key] || key;
  };

  const login = (role: UserRole = 'admin') => {
    setCurrentUserRole(role);
    setIsAuthenticated(true);
    setShowCabinetIntro(false);
    localStorage.setItem('ds_authenticated', 'true');
    localStorage.setItem('ds_user_role', role);

    // Sync active staff member profile matching the role
    const matchingStaff = staffMembers.find((s) => {
      if (role === 'admin') return s.role === 'Admin';
      if (role === 'doctor') return s.role === 'Médecin';
      if (role === 'assistant') return s.role === 'Assistant';
      return false;
    });
    if (matchingStaff) {
      setCurrentUser(matchingStaff);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ds_authenticated');
    setShowCabinetIntro(false);
  };

  const verifyRolePassword = (role: UserRole, inputPass: string): boolean => {
    const currentPass = rolePasswords[role] || 'admin123';
    return inputPass.trim() === currentPass.trim();
  };

  const updateRolePassword = (role: UserRole, newPass: string): void => {
    const updated = {
      ...rolePasswords,
      [role]: newPass.trim(),
    };
    setRolePasswords(updated);
    saveRolePasswords(updated);
    logAudit(
      'updated',
      'security',
      `Modification du mot de passe pour le rôle ${role.toUpperCase()} par l'administrateur`
    );
  };

  const isRoleAllowed = (page: PageView): boolean => {
    if (currentUserRole === 'admin') return true;

    if (currentUserRole === 'doctor') {
      if (page === 'audit' || page === 'audit-log' || page === 'settings') return false;
      return true;
    }

    if (currentUserRole === 'assistant') {
      if (
        page === 'audit' ||
        page === 'audit-log' ||
        page === 'settings' ||
        page === 'expenses'
      )
        return false;
      return true;
    }

    return true;
  };

  // Automated Appointment Confirmation Reminder background service
  const runAutomatedAppointmentReminders = useCallback(() => {
    if (!autoReminderSettings.enabled) return 0;

    const savedReminders = localStorage.getItem('ds_processed_24h_reminders');
    const processedIds: string[] = savedReminders ? JSON.parse(savedReminders) : [];

    const scheduledApps = appointments.filter((a) => a.status === 'Programmé');
    if (scheduledApps.length === 0) return 0;

    const nextProcessedIds = [...processedIds];
    let processedCount = 0;

    scheduledApps.forEach((app) => {
      if (!nextProcessedIds.includes(app.id)) {
        nextProcessedIds.push(app.id);
        processedCount++;

        const formattedMsg = (autoReminderSettings.messageTemplate || '')
          .replace('{PATIENT}', app.patientName)
          .replace('{DATE}', app.date)
          .replace('{TIME}', app.time)
          .replace('{DOCTOR}', app.doctorName || prescriptionTemplate.doctorName)
          .replace('{CLINIC}', prescriptionTemplate.clinicName);

        // Record in recall logs
        const newRecallLog: RecallLog = {
          id: `rec-auto-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          patientId: app.patientId,
          patientName: app.patientName,
          patientPhone: '0699000099',
          method: (autoReminderSettings.channel.includes('WhatsApp') ? 'WhatsApp' : 'SMS') as any,
          status: 'Envoyé',
          sentDate: new Date().toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          messagePreview: formattedMsg,
          notes: `Rappel de RDV automatisé (${autoReminderSettings.noticeHours} avant) pour le RDV du ${app.date} à ${app.time}.`,
        };
        setRecallLogs((prev) => [newRecallLog, ...prev]);

        addStaffNotification({
          type: 'urgent_task',
          title: '🕒 Rappel automatique de RDV envoyé',
          message: `Rappel de RDV (${autoReminderSettings.channel}) envoyé à ${app.patientName} pour le ${app.date} à ${app.time}.`,
          patientId: app.patientId,
        });

        addStaffMessage(
          `🕒 RAPPEL AUTO : Confirmation de RDV transmise à ${app.patientName} (RDV le ${app.date} à ${app.time}) via ${autoReminderSettings.channel}.`,
          'flow'
        );

        logAudit(
          'created',
          'appointment',
          `Rappel automatique de RDV (${autoReminderSettings.channel}) généré pour ${app.patientName} (RDV du ${app.date} à ${app.time})`
        );
      }
    });

    if (processedCount > 0) {
      localStorage.setItem('ds_processed_24h_reminders', JSON.stringify(nextProcessedIds));
    }

    return processedCount;
  }, [appointments, autoReminderSettings, prescriptionTemplate]);

  const triggerAutomatedRemindersNow = () => {
    return runAutomatedAppointmentReminders();
  };

  useEffect(() => {
    // Initial run on mount/settings update
    runAutomatedAppointmentReminders();

    // Recurring background task runner checking appointment times periodically (every 30s)
    const intervalId = setInterval(() => {
      runAutomatedAppointmentReminders();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [runAutomatedAppointmentReminders]);

  const openPatientWorkspace = (patientId: string) => {
    setActivePatientId(patientId);
    setActivePage('patient-workspace');
  };

  const openQuickAddPatient = () => setIsQuickAddPatientOpen(true);
  const closeQuickAddPatient = () => setIsQuickAddPatientOpen(false);

  const openPatientSummary = (patientId: string) => {
    setSummaryPatientId(patientId);
    setIsPatientSummaryOpen(true);
  };

  const closePatientSummary = () => {
    setIsPatientSummaryOpen(false);
  };

  const logAudit = (action: AuditLogItem['action'], entityType: string, details: string) => {
    const newLog: AuditLogItem = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleString(language === 'ar' ? 'ar-DZ' : 'fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      user: 'admin',
      action,
      entityType,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addPatient = (newP: Omit<Patient, 'id' | 'code' | 'lastVisit' | 'balance' | 'status'>): Patient => {
    const codeNum = patients.length + 85;
    const patient: Patient = {
      ...newP,
      id: `pat-${Date.now()}`,
      code: `P-${codeNum.toString().padStart(3, '0')}`,
      status: 'Active',
      lastVisit: new Date().toLocaleDateString('fr-FR'),
      balance: 0,
    };
    setPatients((prev) => [patient, ...prev]);
    logAudit('created', 'patient', `Ajout du patient ${patient.name} (${patient.code})`);
    return patient;
  };

  const updatePatient = (updatedP: Patient) => {
    setPatients((prev) => prev.map((p) => (p.id === updatedP.id ? updatedP : p)));
    logAudit('updated', 'patient', `Modification des infos de ${updatedP.name}`);
  };

  const deletePatient = (id: string) => {
    const p = patients.find((pat) => pat.id === id);
    setPatients((prev) => prev.filter((pat) => pat.id !== id));
    if (p) logAudit('deleted', 'patient', `Suppression du patient ${p.name}`);
  };

  const addRecallLog = (log: Omit<RecallLog, 'id' | 'sentDate'>) => {
    const newLog: RecallLog = {
      ...log,
      id: `rec-${Date.now()}`,
      sentDate: new Date().toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setRecallLogs((prev) => [newLog, ...prev]);
  };

  const toggleAutoRecall = (patientId: string) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          const updatedVal = !p.autoRecallNotificationEnabled;
          logAudit(
            'updated',
            'patient',
            `Rappel auto ${updatedVal ? 'activé' : 'désactivé'} pour ${p.name}`
          );
          return { ...p, autoRecallNotificationEnabled: updatedVal };
        }
        return p;
      })
    );
  };

  const sendManualRecall = (patientId: string, method: 'SMS' | 'WhatsApp' | 'Email' | 'Téléphone') => {
    const p = patients.find((pat) => pat.id === patientId);
    if (!p) return;

    const previewText = `Cher ${p.name}, votre contrôle dentaire semestriel est prévu ce mois-ci. Merci de planifier votre rendez-vous de suivi.`;

    addRecallLog({
      patientId,
      patientName: p.name,
      patientPhone: p.phone,
      patientEmail: p.email,
      method,
      status: 'Envoyé',
      messagePreview: previewText,
      notes: 'Envoyé manuellement depuis le centre de rappels.',
    });

    setPatients((prev) =>
      prev.map((pat) =>
        pat.id === patientId
          ? {
              ...pat,
              recallStatus: 'Rappel envoyé',
              lastRecallSentDate: new Date().toLocaleDateString('fr-FR'),
            }
          : pat
      )
    );

    logAudit('created', 'recall', `Rappel manuel (${method}) envoyé à ${p.name}`);
  };

  const addAppointment = (app: Omit<Appointment, 'id' | 'status'>) => {
    const newApp: Appointment = {
      ...app,
      id: `app-${Date.now()}`,
      status: 'Programmé',
    };
    setAppointments((prev) => [newApp, ...prev]);
    logAudit('created', 'appointment', `Nouveau RDV pour ${newApp.patientName} le ${newApp.date} à ${newApp.time}`);
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    logAudit('updated', 'appointment', `Statut du RDV mis à jour -> ${status}`);
  };

  const rescheduleAppointment = (
    id: string,
    newDate: string,
    newTime: string,
    newDoctor?: string
  ) => {
    const existing = appointments.find((a) => a.id === id);
    if (!existing) return;

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              date: newDate,
              time: newTime,
              ...(newDoctor ? { doctorName: newDoctor } : {}),
            }
          : a
      )
    );
    logAudit(
      'updated',
      'appointment',
      `Reprogrammation du RDV de ${existing.patientName} au ${newDate} à ${newTime}${
        newDoctor ? ` (Médecin: ${newDoctor})` : ''
      }`
    );
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
    logAudit('updated', 'appointment', `Mise à jour RDV #${id}`);
  };

  const updateToothData = (patientId: string, toothId: number, data: Partial<ToothData>) => {
    setTeethData((prev) => {
      const patientTeeth = prev[patientId] || {};
      const currentTooth = patientTeeth[toothId] || {
        id: toothId,
        status: 'sain',
      };
      const updatedTooth: ToothData = {
        ...currentTooth,
        ...data,
        history: [
          ...(currentTooth.history || []),
          {
            date: new Date().toLocaleDateString('fr-FR'),
            action: `Modification état dent ${toothId} -> ${data.status || currentTooth.status}`,
            doctor: 'Dr. Amrani Samir',
          },
        ],
      };
      return {
        ...prev,
        [patientId]: {
          ...patientTeeth,
          [toothId]: updatedTooth,
        },
      };
    });
    logAudit('updated', 'patient_treatment', `Dent ${toothId} mise à jour (${data.status || 'soin'})`);
  };

  const addClinicalNote = (note: Omit<ClinicalNote, 'id'>) => {
    const newNote: ClinicalNote = {
      ...note,
      id: `note-${Date.now()}`,
    };
    setClinicalNotes((prev) => [newNote, ...prev]);
    logAudit('created', 'clinical_note', `Note clinique enregistrée: ${newNote.title}`);
  };

  const updateClinicalNote = (id: string, updates: Partial<ClinicalNote>) => {
    setClinicalNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates } : n))
    );
    logAudit('updated', 'clinical_note', `Note clinique #${id} mise à jour`);
  };

  const deleteClinicalNote = (id: string) => {
    setClinicalNotes((prev) => prev.filter((n) => n.id !== id));
    logAudit('deleted', 'clinical_note', `Note clinique #${id} supprimée`);
  };

  const addPatientTreatment = (treatment: Omit<TreatmentItem, 'id'>) => {
    const newT: TreatmentItem = {
      ...treatment,
      id: `pt-${Date.now()}`,
    };
    setPatientTreatments((prev) => [newT, ...prev]);
    logAudit('created', 'patient_treatment', `Soin ajouté: ${newT.name} (${newT.cost} DA)`);
  };

  const addImage = (img: Omit<DentalImage, 'id'>) => {
    const newImg: DentalImage = {
      ...img,
      id: `img-${Date.now()}`,
    };
    setImages((prev) => [newImg, ...prev]);
    logAudit('image_uploaded', 'patient_image', `Image ajoutée: ${newImg.title}`);
  };

  const addPrescription = (presc: Omit<Prescription, 'id'>) => {
    const newPresc: Prescription = {
      ...presc,
      id: `ord-${Date.now()}`,
    };
    setPrescriptions((prev) => [newPresc, ...prev]);
    logAudit('created', 'prescription', `Ordonnance créée pour patient ID ${newPresc.patientId}`);
  };

  const addPayment = (payment: Omit<Payment, 'id'>) => {
    const newPay: Payment = {
      ...payment,
      id: `pay-${Date.now()}`,
    };
    setPayments((prev) => [newPay, ...prev]);
    logAudit('created', 'payment', `Nouveau paiement reçu: ${newPay.amount} DA (${newPay.patientName})`);
  };

  const addLabCase = (lab: Omit<LabCase, 'id' | 'code'>) => {
    const codeNum = labCases.length + 104;
    const newLab: LabCase = {
      ...lab,
      id: `lab-${Date.now()}`,
      code: `LAB-${codeNum}`,
    };
    setLabCases((prev) => [newLab, ...prev]);
    logAudit('created', 'lab_case', `Commande labo créée: ${newLab.type} pour ${newLab.patientName}`);
  };

  const addQuotation = (quo: Omit<Quotation, 'id' | 'number'>) => {
    const num = quotations.length + 2;
    const newQuo: Quotation = {
      ...quo,
      id: `quo-${Date.now()}`,
      number: `DEV-${num.toString().padStart(4, '0')}`,
    };
    setQuotations((prev) => [newQuo, ...prev]);
    logAudit('created', 'quotation', `Devis créé: ${newQuo.number} (${newQuo.total} DA)`);
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}`,
    };
    setInventory((prev) => [newItem, ...prev]);
    logAudit('created', 'inventory', `Produit ajouté au stock: ${newItem.name}`);
  };

  const addInvoice = (inv: Omit<Invoice, 'id' | 'number' | 'remainingAmount' | 'status'>) => {
    const remaining = inv.totalAmount - inv.paidAmount;
    const status: Invoice['status'] = remaining <= 0 ? 'Paid' : inv.paidAmount > 0 ? 'Pending' : 'Overdue';
    const newInv: Invoice = {
      ...inv,
      id: `fac-${Date.now()}`,
      number: `FAC-${(invoices.length + 101).toString()}`,
      remainingAmount: remaining,
      status,
    };
    setInvoices((prev) => [newInv, ...prev]);
    logAudit('created', 'invoice', `Facture émise: ${newInv.number} (${newInv.totalAmount} DA)`);
  };

  const addExpense = (exp: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...exp,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [newExp, ...prev]);
    logAudit('created', 'expense', `Dépense enregistrée: ${newExp.amount} DA (${newExp.category})`);
  };

  const addTask = (task: Omit<TaskItem, 'id' | 'status'>) => {
    const newTask: TaskItem = {
      ...task,
      id: `tsk-${Date.now()}`,
      status: 'En attente',
    };
    setTasks((prev) => [newTask, ...prev]);
    logAudit('created', 'task', `Tâche créée: ${newTask.title}`);
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'Terminée' ? 'En cours' : 'Terminée' }
          : t
      )
    );
  };

  const addTreatmentCatalogItem = (item: Omit<TreatmentCatalogItem, 'id'>) => {
    const newItem: TreatmentCatalogItem = {
      ...item,
      id: `tc-${Date.now()}`,
    };
    setTreatmentCatalog((prev) => [...prev, newItem]);
    logAudit('created', 'treatment_catalog', `Nouveau soin ajouté au catalogue: ${newItem.name}`);
  };

  // Insurance Handlers
  const addInsurancePolicy = (policyData: Omit<InsurancePolicy, 'id'>) => {
    const newPolicy: InsurancePolicy = {
      ...policyData,
      id: `pol-${Date.now()}`,
    };
    setInsurancePolicies((prev) => [newPolicy, ...prev]);
    logAudit('created', 'insurance_policy', `Police d'assurance ajoutée: ${newPolicy.providerName}`);
  };

  const updateInsurancePolicy = (id: string, updates: Partial<InsurancePolicy>) => {
    setInsurancePolicies((prev) =>
      prev.map((pol) => (pol.id === id ? { ...pol, ...updates } : pol))
    );
    logAudit('updated', 'insurance_policy', `Police d'assurance mise à jour ID: ${id}`);
  };

  const deleteInsurancePolicy = (id: string) => {
    setInsurancePolicies((prev) => prev.filter((pol) => pol.id !== id));
    logAudit('deleted', 'insurance_policy', `Police d'assurance supprimée ID: ${id}`);
  };

  const addInsuranceClaim = (claimData: Omit<InsuranceClaim, 'id' | 'claimNumber' | 'submissionDate'>) => {
    const claimNum = `CLM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const todayStr = new Date().toLocaleDateString('fr-FR');
    const newClaim: InsuranceClaim = {
      ...claimData,
      id: `clm-${Date.now()}`,
      claimNumber: claimNum,
      submissionDate: todayStr,
    };

    // Update used amount on policy if relevant
    setInsurancePolicies((prev) =>
      prev.map((pol) => {
        if (pol.id === newClaim.policyId) {
          return {
            ...pol,
            usedAmount: pol.usedAmount + newClaim.approvedAmount,
          };
        }
        return pol;
      })
    );

    setInsuranceClaims((prev) => [newClaim, ...prev]);
    logAudit('created', 'insurance_claim', `Réclamation Tiers-Payant soumise: ${claimNum} (${newClaim.providerName})`);
  };

  const updateInsuranceClaimStatus = (
    id: string,
    status: InsuranceClaim['status'],
    approvedAmount?: number,
    rejectionReason?: string
  ) => {
    const approvalDate = status === 'Approuvé' || status === 'Remboursé' || status === 'Partiellement Approuvé'
      ? new Date().toLocaleDateString('fr-FR')
      : undefined;

    setInsuranceClaims((prev) =>
      prev.map((clm) => {
        if (clm.id === id) {
          const updatedApproved = approvedAmount !== undefined ? approvedAmount : clm.approvedAmount;
          const updatedCopay = Math.max(0, clm.submittedAmount - updatedApproved);
          return {
            ...clm,
            status,
            approvedAmount: updatedApproved,
            patientCopay: updatedCopay,
            rejectionReason: rejectionReason !== undefined ? rejectionReason : clm.rejectionReason,
            approvalDate: approvalDate || clm.approvalDate,
          };
        }
        return clm;
      })
    );
    logAudit('updated', 'insurance_claim', `Statut réclamation ${id} changé à ${status}`);
  };

  const deleteInsuranceClaim = (id: string) => {
    setInsuranceClaims((prev) => prev.filter((clm) => clm.id !== id));
    logAudit('deleted', 'insurance_claim', `Réclamation Tiers-Payant supprimée ID: ${id}`);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        activePage,
        setActivePage,
        activePatientId,
        openPatientWorkspace,
        isQuickAddPatientOpen,
        setIsQuickAddPatientOpen,
        openQuickAddPatient,
        closeQuickAddPatient,
        summaryPatientId,
        isPatientSummaryOpen,
        openPatientSummary,
        closePatientSummary,
        language,
        setLanguage,
        t,
        searchQuery,
        setSearchQuery,
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        updateAppointment,
        teethData,
        updateToothData,
        clinicalNotes,
        addClinicalNote,
        updateClinicalNote,
        deleteClinicalNote,
        patientTreatments,
        addPatientTreatment,
        images,
        addImage,
        prescriptions,
        addPrescription,
        payments,
        addPayment,
        labCases,
        addLabCase,
        quotations,
        addQuotation,
        inventory,
        addInventoryItem,
        invoices,
        addInvoice,
        debts,
        expenses,
        addExpense,
        tasks,
        addTask,
        toggleTaskStatus,
        auditLogs,
        logAudit,
        treatmentCatalog,
        addTreatmentCatalogItem,
        staffMembers,
        addStaffMember,
        updateStaffMember,
        deleteStaffMember,
        userAccounts,
        addUserAccount,
        updateUserAccount,
        deleteUserAccount,
        insurancePolicies,
        insuranceClaims,
        addInsurancePolicy,
        updateInsurancePolicy,
        deleteInsurancePolicy,
        addInsuranceClaim,
        updateInsuranceClaimStatus,
        deleteInsuranceClaim,
        currentUser,
        setCurrentUser,
        staffMessages,
        addStaffMessage,
        clearStaffMessages,
        staffNotifications,
        addStaffNotification,
        markNotificationRead,
        markAllNotificationsRead,
        isStaffChatOpen,
        setIsStaffChatOpen,
        recallLogs,
        addRecallLog,
        toggleAutoRecall,
        sendManualRecall,
        autoReminderSettings,
        updateAutoReminderSettings,
        triggerAutomatedRemindersNow,
        dashboardConfig,
        updateDashboardConfig,
        prescriptionTemplate,
        updatePrescriptionTemplate,
        workspaceNavColor,
        setWorkspaceNavColor,
        toast,
        showToast,
        hideToast,
        showCabinetIntro,
        setShowCabinetIntro,
        currentUserRole,
        rolePasswords,
        verifyRolePassword,
        updateRolePassword,
        isRoleAllowed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
