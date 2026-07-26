import React from 'react';
import { useApp } from '../../context/AppContext';
import { PageView } from '../../types';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  BellRing,
  Stethoscope,
  FlaskConical,
  FileText,
  Package,
  Receipt,
  CreditCard,
  TrendingDown,
  BarChart3,
  CheckSquare,
  History,
  Settings,
  LogOut,
  UserPlus,
  Lock,
  Play,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

interface NavItem {
  id: PageView;
  labelKey: string;
  icon: React.ElementType;
}

export const Sidebar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    openQuickAddPatient,
    logout,
    currentUserRole,
    isRoleAllowed,
    setShowCabinetIntro,
    t,
  } = useApp();

  const navItems: NavItem[] = [
    { id: 'dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
    { id: 'appointments', labelKey: 'appointments', icon: CalendarDays },
    { id: 'patients', labelKey: 'patients', icon: Users },
    { id: 'recalls', labelKey: 'recalls', icon: BellRing },
    { id: 'treatments', labelKey: 'treatments', icon: Stethoscope },
    { id: 'lab-work', labelKey: 'lab_work', icon: FlaskConical },
    { id: 'quotations', labelKey: 'quotations', icon: FileText },
    { id: 'inventory', labelKey: 'stock', icon: Package },
    { id: 'billing', labelKey: 'billing', icon: Receipt },
    { id: 'debts', labelKey: 'debts', icon: CreditCard },
    { id: 'expenses', labelKey: 'expenses', icon: TrendingDown },
    { id: 'reports', labelKey: 'reports', icon: BarChart3 },
    { id: 'tasks', labelKey: 'tasks', icon: CheckSquare },
    { id: 'audit-log', labelKey: 'audit', icon: History },
    { id: 'settings', labelKey: 'settings', icon: Settings },
  ];

  const roleLabelMap = {
    admin: 'Administrateur',
    doctor: 'Médecin / Docteur',
    assistant: 'Assistant(e)',
  };

  const roleIconMap = {
    admin: ShieldCheck,
    doctor: Stethoscope,
    assistant: UserCheck,
  };

  const CurrentRoleIcon = roleIconMap[currentUserRole] || ShieldCheck;

  return (
    <aside className="w-64 bg-gradient-to-b from-sky-500 via-sky-600 to-sky-700 text-white flex flex-col h-screen sticky top-0 shrink-0 border-r border-sky-600/30 shadow-xl overflow-y-auto scrollbar-thin">
      {/* DentalSoft Brand Header */}
      <div className="p-4 sm:p-5 border-b border-white/15 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md p-2 text-white flex items-center justify-center shadow-lg shadow-sky-900/10 ring-2 ring-white/30 shrink-0">
            {/* Tooth SVG Icon */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full text-white"
            >
              <path d="M12 2C8 2 6 4 6 8c0 3 1 6 2 9 1 2 2 3 4 3s3-1 4-3c1-3 2-6 2-9 0-4-2-6-6-6z" />
              <path d="M9 10c1.5 1 4.5 1 6 0" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1">
              Dental<span className="text-sky-200 font-black">Soft</span>
            </h1>
            <p className="text-[10px] font-semibold text-sky-100/80 uppercase tracking-wider truncate">
              Cabinet Dentaire
            </p>
          </div>
        </div>

        {/* Current Role Identification Badge */}
        <div className="bg-black/20 border border-white/20 rounded-xl p-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <CurrentRoleIcon className="w-3.5 h-3.5 text-sky-100" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase text-sky-200 tracking-wider">Rôle Actif</p>
              <p className="text-xs font-black text-white truncate">{roleLabelMap[currentUserRole]}</p>
            </div>
          </div>

          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-white/20 text-white shrink-0">
            {currentUserRole === 'admin' ? 'Total' : 'Limité'}
          </span>
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="px-3 pt-3 pb-2">
        <button
          onClick={openQuickAddPatient}
          className="w-full py-2.5 px-3 bg-white text-sky-700 hover:bg-sky-50 font-bold text-xs rounded-2xl shadow-lg shadow-sky-900/10 flex items-center justify-center gap-2 transition-all cursor-pointer group hover:scale-[1.02]"
        >
          <UserPlus className="w-4 h-4 text-sky-600 transition-transform group-hover:scale-110" />
          <span>{t('quick_patient')}</span>
          <span className="text-[10px] font-mono bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded-md font-semibold ml-auto">
            Alt+P
          </span>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isAllowed = isRoleAllowed(item.id);
          const isActive =
            activePage === item.id ||
            (item.id === 'patients' && activePage === 'patient-workspace');

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-medium text-xs transition-all duration-200 group cursor-pointer ${
                isActive
                  ? 'bg-white/20 backdrop-blur-md text-white shadow-sm border border-white/20 font-bold'
                  : !isAllowed
                  ? 'text-sky-200/50 hover:bg-white/5'
                  : 'text-sky-100/90 hover:text-white hover:bg-white/10'
              }`}
              title={!isAllowed ? `Accès restreint aux administrateurs` : undefined}
            >
              <Icon
                className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  isActive
                    ? 'text-white'
                    : !isAllowed
                    ? 'text-sky-200/40'
                    : 'text-sky-100 group-hover:text-white'
                }`}
              />
              <span className={`truncate ${!isAllowed ? 'line-through opacity-75' : ''}`}>
                {t(item.labelKey)}
              </span>

              {!isAllowed && (
                <Lock className="w-3 h-3 text-amber-300 ml-auto shrink-0 opacity-80" />
              )}

              {isAllowed && isActive && (
                <span className="ml-auto rtl:mr-auto rtl:ml-0 w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Cabinet Intro Video & Logout */}
      <div className="p-3 border-t border-white/15 bg-black/10 space-y-1">
        <button
          onClick={() => {
            setShowCabinetIntro(true);
            logout();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-xs text-sky-100 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Play className="w-3.5 h-3.5 text-sky-200 fill-sky-200" />
          <span>Vidéo Tour du Cabinet</span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-xs text-rose-200 hover:text-white hover:bg-rose-500/20 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-200" />
          <span>{t('logout')} (Déconnexion)</span>
        </button>
      </div>
    </aside>
  );
};
