export type Language = 'fr' | 'en' | 'ar';

export type UserRole = 'admin' | 'doctor' | 'assistant';

export type PageView =
  | 'dashboard'
  | 'appointments'
  | 'patients'
  | 'patient-workspace'
  | 'workspace'
  | 'treatments'
  | 'recalls'
  | 'lab-work'
  | 'lab'
  | 'quotations'
  | 'inventory'
  | 'stock'
  | 'billing'
  | 'debts'
  | 'expenses'
  | 'reports'
  | 'tasks'
  | 'audit-log'
  | 'audit'
  | 'settings';

export type ToothStatus =
  | 'sain'
  | 'carie'
  | 'obture'
  | 'couronne'
  | 'traitement_canalaire'
  | 'absent'
  | 'implant'
  | 'pont';

export type ToothSurface = 'M' | 'O' | 'D' | 'B' | 'L' | 'V';

export interface ToothData {
  id: number; // 11 to 48 (FDI notation)
  status: ToothStatus;
  surfaces?: ToothSurface[];
  treatmentNeeded?: string;
  notes?: string;
  history?: {
    date: string;
    action: string;
    doctor: string;
  }[];
}

export interface MedicalAlert {
  id: string;
  type: 'Allergie' | 'Condition Médicale' | 'Médicament' | 'Précaution Dentaire';
  severity: 'Faible' | 'Modérée' | 'Élevée' | 'Critique';
  title: string;
  description?: string;
  clinicalInstruction?: string;
}

export interface InsurancePolicy {
  id: string;
  patientId: string;
  providerName: string; // e.g. "CNAS (Sécurité Sociale)", "CASNOS", "AXA Assurances", "MAAF", "CAAR Tiers-Payant"
  policyNumber: string; // N° d'immatriculation / Clé
  groupNumber?: string; // N° de contrat / Mutuelle
  type: 'Principale (CNAS/CASNOS)' | 'Complémentaire / Mutuelle' | 'Assurance Privée';
  coveragePercentage: number; // e.g., 80%
  annualLimit: number; // Max annual coverage in DA (0 for unlimited)
  usedAmount: number; // Amount claimed this year in DA
  startDate: string;
  expirationDate: string;
  status: 'Actif' | 'Expiré' | 'En cours de validation';
  primaryContactPhone?: string;
  notes?: string;
}

export interface InsuranceClaim {
  id: string;
  claimNumber: string; // e.g., "CLM-2026-089"
  patientId: string;
  patientName: string;
  policyId: string;
  providerName: string;
  treatmentName: string;
  toothNumber?: number;
  treatmentDate: string;
  submissionDate: string;
  submittedAmount: number; // Total cost in DA
  approvedAmount: number; // Covered by insurance in DA
  patientCopay: number; // Remaining cost paid by patient in DA
  status: 'En attente' | 'Approuvé' | 'Partiellement Approuvé' | 'Rejeté' | 'Remboursé';
  rejectionReason?: string;
  approvalDate?: string;
  notes?: string;
}

export interface Patient {
  id: string;
  code: string; // e.g., P-084
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Homme' | 'Femme';
  phone: string;
  email: string;
  address: string;
  bloodGroup?: string;
  birthDate?: string;
  nationalId?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  insuranceName?: string;
  insuranceNumber?: string;
  notes?: string;
  status: 'Active' | 'En traitement' | 'Inactif';
  lastVisit: string;
  nextAppointment?: string;
  balance: number; // Solde in DA
  teethData?: Record<number, ToothData>;

  // Medical Alert & High-Risk Patient System Fields
  isHighRisk?: boolean;
  riskLevel?: 'Faible' | 'Modéré' | 'Élevé' | 'Critique';
  allergies?: string[];
  medicalConditions?: string[];
  precautionNotes?: string;
  medicalAlerts?: MedicalAlert[];

  // 6-Month Patient Recall System Fields
  lastCheckupDate?: string; // YYYY-MM-DD or DD/MM/YYYY
  nextRecallDate?: string; // YYYY-MM-DD
  recallIntervalMonths?: number; // Default 6
  recallStatus?: 'À jour' | 'À rappeler' | 'Rappel envoyé' | 'Rendez-vous pris' | 'Ignoré';
  autoRecallNotificationEnabled?: boolean; // Automated toggle for 6-month reminder
  lastRecallSentDate?: string;
  recallMethodPreference?: 'SMS' | 'WhatsApp' | 'Email' | 'Téléphone';

  // Waiting Room / Handoff Fields
  treatingDoctorId?: string;
  isWaiting?: boolean;
  waitingSince?: string;
  waitingNotes?: string;
  waitingStatus?: 'En attente' | 'En consultation' | 'Terminé';
}

export interface RecallLog {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  sentDate: string;
  method: 'SMS' | 'WhatsApp' | 'Email' | 'Téléphone';
  status: 'Envoyé' | 'Délivré' | 'Répondu' | 'Rendez-vous Fixé' | 'Échec';
  messagePreview: string;
  nextFollowUpDate?: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "09:00"
  durationMinutes: number;
  type: 'Consultation' | 'Détartrage' | 'Extraction' | 'Soin' | 'Contrôle' | 'Urgence';
  status: 'Programmé' | 'En cours' | 'Terminé' | 'Annulé';
  notes?: string;
}

export interface TreatmentItem {
  id: string;
  patientId: string;
  toothId?: number;
  category: 'Soins Généraux' | 'Orthodontie' | 'Chirurgie' | 'Prothèse';
  name: string;
  cost: number; // DA
  status: 'En cours' | 'Terminé' | 'Planifié' | 'Annulé';
  priority: 'Haute' | 'Moyenne' | 'Basse';
  doctorName: string;
  notes?: string;
  date: string;
}

export interface TreatmentCatalogItem {
  id: string;
  category: 'Soins Généraux' | 'Orthodontie' | 'Chirurgie' | 'Prothèse';
  name: string;
  description: string;
  durationMin: number;
  price: number; // DA
  status: 'Active' | 'Pending';
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  doctorName: string;
  date: string; // YYYY-MM-DD or formatted date
  time: string; // e.g. "14:30"
  title: string;
  content: string; // Rich HTML formatted string
  category: 'Consultation' | 'Bilan Initial' | 'Diagnostic' | 'Urgence' | 'Suivi Post-Op' | 'Procédure';
  taggedTeeth?: number[];
  tags?: string[];
  isLocked?: boolean;
}

export interface DentalImage {
  id: string;
  patientId: string;
  title: string;
  type: 'Périapicale' | 'Panoramique' | 'Bitewing' | 'CBCT' | 'Photo';
  toothId?: number;
  tag: string;
  date: string;
  url: string;
  notes?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorName: string;
  date: string;
  medications: {
    name: string;
    dosage: string;
    duration: string;
    instructions: string;
  }[];
  notes?: string;
}

export interface Payment {
  id: string;
  patientId: string;
  patientName: string;
  amount: number; // DA
  method: 'Espèces' | 'Chèque' | 'Carte' | 'Virement';
  date: string;
  reference?: string;
  linkedInvoiceId?: string;
  notes?: string;
}

export interface LabCase {
  id: string;
  code: string; // e.g. LAB-102
  patientId: string;
  patientName: string;
  doctorName: string;
  labName: string; // e.g. DentLab, BioDental
  type: 'Prothèse' | 'Couronne' | 'Bridge' | 'Gouttière' | 'Implant';
  status: 'En attente' | 'En cours' | 'Terminé' | 'Urgent';
  dueDate: string;
  description?: string;
}

export interface Quotation {
  id: string;
  number: string; // DEV-0001
  patientId: string;
  patientName: string;
  doctorName: string;
  amount: number;
  discount: number;
  tax: number;
  total: number;
  validUntil: string;
  status: 'Brouillon' | 'Envoyé' | 'Accepté' | 'Refusé';
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: 'Anesthésie' | 'Composite' | 'Empreinte' | 'Consommables' | 'Instruments';
  stockCurrent: number;
  stockMin: number;
  stockMax: number;
  purchasePrice: number;
  sellingPrice: number;
  supplier: string;
  expirationDate: string;
}

export interface Invoice {
  id: string;
  number: string; // FAC-001
  patientId: string;
  patientName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  issueDate: string;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface DebtItem {
  id: string;
  patientId: string;
  patientName: string;
  totalInvoiced: number;
  totalPaid: number;
  balanceDue: number;
  status: 'En retard' | 'À jour';
  daysOverdue: number;
  dueDate: string;
}

export interface Expense {
  id: string;
  category: 'Fournitures' | 'Loyer' | 'Électricité' | 'Laboratoire' | 'Salaires' | 'Autre';
  amount: number;
  description: string;
  date: string;
  type: 'Fixe' | 'Variable';
  isRecurring: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  assignedTo: string;
  priority: 'Haute' | 'Moyenne' | 'Basse';
  dueDate: string;
  status: 'En attente' | 'En cours' | 'Terminée';
  description?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  action: 'created' | 'updated' | 'deleted' | 'image_uploaded';
  entityType: string;
  details: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Admin' | 'Médecin' | 'Assistant' | 'Réceptionniste';
  email: string;
  phone: string;
  specialty?: string;
  commissionPercent: number;
}

export interface UserAccount {
  id: string;
  username: string;
  password?: string;
  role: 'Admin' | 'Médecin' | 'Assistant' | 'Réceptionniste';
  staffMemberId?: string;
  staffMemberName?: string;
  status: 'Actif' | 'Inactif';
  createdAt?: string;
}

export interface StaffMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'Admin' | 'Médecin' | 'Assistant' | 'Réceptionniste';
  content: string;
  timestamp: string;
  isUrgent?: boolean;
  channelId?: string; // e.g., 'general', 'flow', 'urgent'
}

export interface StaffNotification {
  id: string;
  type: 'patient_waiting' | 'urgent_task' | 'general_alert';
  title: string;
  message: string;
  timestamp: string;
  targetDoctorId?: string; // If specific to a doctor
  patientId?: string; // Linked patient
  read?: boolean;
}

export interface RoleDashboardConfig {
  showMetrics: boolean;
  showFinancials: boolean;
  showWaitingRoom: boolean;
  showVisitsChart: boolean;
  showTodaySchedule: boolean;
  showRecentPatients: boolean;
  showTasks: boolean;
}

export type DashboardConfig = Record<'Admin' | 'Médecin' | 'Assistant' | 'Réceptionniste', RoleDashboardConfig>;

export type PrescriptionTemplateStyle = 'official_border' | 'classic' | 'modern' | 'custom_background';

export interface PrescriptionTemplateSettings {
  templateStyle: PrescriptionTemplateStyle;
  clinicName: string;
  doctorName: string;
  doctorTitle: string;
  headerBannerText: string;
  specialtyText: string;
  address: string;
  phone: string;
  email: string;
  clinicLogoUrl: string;
  backgroundPaperUrl?: string; // Photo / Scan of custom physical prescription form or letterhead
  showLogo: boolean;
  showStampBox: boolean;
  stampBoxText: string;
  footerText: string;
  accentColor: string;
}

