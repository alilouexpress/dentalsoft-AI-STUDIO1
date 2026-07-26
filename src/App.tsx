import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { CabinetIntroTour } from './components/auth/CabinetIntroTour';
import { LoginScreen } from './components/auth/LoginScreen';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { QuickAddPatientModal } from './components/patients/QuickAddPatientModal';
import { PatientSummaryModal } from './components/patients/PatientSummaryModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { AppointmentsView } from './components/appointments/AppointmentsView';
import { PatientsView } from './components/patients/PatientsView';
import { PatientWorkspaceView } from './components/workspace/PatientWorkspaceView';
import { TreatmentsView } from './components/treatments/TreatmentsView';
import { LabWorkView } from './components/lab/LabWorkView';
import { QuotationsView } from './components/quotations/QuotationsView';
import { InventoryView } from './components/inventory/InventoryView';
import { BillingView } from './components/billing/BillingView';
import { DebtsView } from './components/debts/DebtsView';
import { ExpensesView } from './components/expenses/ExpensesView';
import { ReportsView } from './components/reports/ReportsView';
import { TasksView } from './components/tasks/TasksView';
import { AuditLogView } from './components/audit/AuditLogView';
import { SettingsView } from './components/settings/SettingsView';
import { StaffMessagingDrawer } from './components/layout/StaffMessagingDrawer';
import { RecallsView } from './components/recalls/RecallsView';

import { ToastContainer } from './components/common/ToastContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ShieldAlert, ArrowLeft, KeyRound } from 'lucide-react';

const RestrictedAccessNotice: React.FC = () => {
  const { currentUserRole, setActivePage, logout } = useApp();

  const roleNameMap = {
    admin: 'Administrateur',
    doctor: 'Médecin / Docteur',
    assistant: 'Assistant(e)',
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-rose-200/80 shadow-xl max-w-xl mx-auto my-12 text-center space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto ring-8 ring-rose-50">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-black text-slate-900">Accès Restreint</h2>
        <p className="text-xs font-semibold text-rose-600">
          Droits insuffisants pour le rôle : {roleNameMap[currentUserRole]}
        </p>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
        Cette fonctionnalité nécessite des privilèges d'administration globaux. Veuillez vous reconnecter sous un profil Administrateur pour modifier la configuration système ou consulter le journal d'audit.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <button
          onClick={() => setActivePage('dashboard')}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au Tableau de bord</span>
        </button>

        <button
          onClick={logout}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-colors flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
        >
          <KeyRound className="w-4 h-4" />
          <span>Changer de rôle (Changer d'utilisateur)</span>
        </button>
      </div>
    </div>
  );
};

const MainAppContent: React.FC = () => {
  const {
    isAuthenticated,
    showCabinetIntro,
    setShowCabinetIntro,
    activePage,
    setIsQuickAddPatientOpen,
    isStaffChatOpen,
    setIsStaffChatOpen,
    isRoleAllowed,
  } = useApp();

  // Keyboard shortcut: Alt + P or Option + P opens Quick Add Patient Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey || e.metaKey) && (e.key === 'p' || e.key === 'P' || e.key === 'π')) {
        e.preventDefault();
        setIsQuickAddPatientOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsQuickAddPatientOpen]);

  // Unauthenticated Flow: Intro Cabinet Tour -> Identification Screen
  if (!isAuthenticated) {
    if (showCabinetIntro) {
      return <CabinetIntroTour onFinishTour={() => setShowCabinetIntro(false)} />;
    }
    return <LoginScreen onReplayIntro={() => setShowCabinetIntro(true)} />;
  }

  const renderActivePage = () => {
    // Role Permission Check
    if (!isRoleAllowed(activePage)) {
      return <RestrictedAccessNotice />;
    }

    switch (activePage) {
      case 'dashboard':
        return <DashboardView />;
      case 'appointments':
        return <AppointmentsView />;
      case 'patients':
        return <PatientsView />;
      case 'recalls':
        return <RecallsView />;
      case 'patient-workspace':
      case 'workspace':
        return <PatientWorkspaceView />;
      case 'treatments':
        return <TreatmentsView />;
      case 'lab-work':
      case 'lab':
        return <LabWorkView />;
      case 'quotations':
        return <QuotationsView />;
      case 'inventory':
      case 'stock':
        return <InventoryView />;
      case 'billing':
        return <BillingView />;
      case 'debts':
        return <DebtsView />;
      case 'expenses':
        return <ExpensesView />;
      case 'reports':
        return <ReportsView />;
      case 'tasks':
        return <TasksView />;
      case 'audit-log':
      case 'audit':
        return <AuditLogView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans antialiased text-slate-800">
      <ToastContainer />
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <ErrorBoundary>{renderActivePage()}</ErrorBoundary>
        </main>
      </div>

      {/* Global Modals */}
      <QuickAddPatientModal />
      <PatientSummaryModal />
      <StaffMessagingDrawer isOpen={isStaffChatOpen} onClose={() => setIsStaffChatOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
