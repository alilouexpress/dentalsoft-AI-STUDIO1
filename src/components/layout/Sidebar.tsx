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
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 shrink-0 border-r border-slate-800 shadow-lg overflow-y-auto scrollbar-thin">
      {/* Stitch Clinical Brand Header */}
      <div className="p-5 border-b border-slate-800/80 space-y-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center ring-1 ring-sky-500/20 shrink-0">
            {/* Minimalist Tooth / Clinic Icon */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-sky-400 animate-pulse"
            >
              <path d="M12 2C8 2 6 4 6 8c0 3 1 6 2 9 1 2 2 3 4 3s3-1 4-3c1-3 2-6 2-9 0-4-2-6-6-6z" />
              <path d="M9 10c1.5 1 4.5 1 6 0" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="font-black text-base text-white tracking-tight flex items-center gap-1.5">
              Stitch<span className="text-sky-400 font-extrabold text-xs bg-sky-400/10 px-1.5 py-0.5 rounded">PRO</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate mt-0.5">
              Clinical Command
            </p>
          </div>
        </div>

        {/* Current Role Identification Badge */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6.5 h-6.5 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700/50">
              <CurrentRoleIcon className="w-3.5 h-3.5 text-slate-300" />
            </div>
            <div className="min-w-0">
              <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Rôle Actif</p>
              <p className="text-xs font-extrabold text-white truncate leading-tight">{roleLabelMap[currentUserRole]}</p>
            </div>
          </div>

          <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
            {currentUserRole === 'admin' ? 'Root' : 'Limit'}
          </span>
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={openQuickAddPatient}
          className="w-full py-2.5 px-3.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-sky-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer group active:scale-95"
        >
          <UserPlus className="w-4 h-4 text-white transition-transform group-hover:scale-105 shrink-0" />
          <span>{t('quick_patient')}</span>
          <span className="text-[9px] font-mono bg-sky-700 text-white px-1.5 py-0.5 rounded-md font-black ml-auto">
            Alt+P
          </span>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all duration-150 group cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700/50'
                  : !isAllowed
                  ? 'text-slate-600 hover:bg-slate-800/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
              title={!isAllowed ? `Accès restreint aux administrateurs` : undefined}
            >
              <Icon
                className={`w-4 h-4 transition-transform group-hover:scale-105 shrink-0 ${
                  isActive
                    ? 'text-sky-400'
                    : !isAllowed
                    ? 'text-slate-700'
                    : 'text-slate-500 group-hover:text-slate-300'
                }`}
              />
              <span className={`truncate ${!isAllowed ? 'line-through opacity-60' : ''}`}>
                {t(item.labelKey)}
              </span>

              {!isAllowed && (
                <Lock className="w-3 h-3 text-amber-500/80 ml-auto shrink-0" />
              )}

              {isAllowed && isActive && (
                <span className="ml-auto rtl:mr-auto rtl:ml-0 w-1.5 h-1.5 rounded-full bg-sky-400 shadow-sm" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Cabinet Intro Video & Logout */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-1">
        <button
          onClick={() => {
            setShowCabinetIntro(true);
            logout();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-bold text-xs text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20" />
          <span>Vidéo Cabinet</span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-bold text-xs text-rose-400/90 hover:text-white hover:bg-rose-500/10 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-400/80" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
};
