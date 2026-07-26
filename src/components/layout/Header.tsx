import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Globe,
  Bell,
  UserCheck,
  Calendar as CalendarIcon,
  UserPlus,
  MessageSquare,
  ChevronDown,
  Check,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Language } from '../../types';

export const Header: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    language,
    setLanguage,
    openQuickAddPatient,
    currentUser,
    setCurrentUser,
    staffMembers,
    staffNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    isStaffChatOpen,
    setIsStaffChatOpen,
    staffMessages,
    openPatientWorkspace,
    t,
  } = useApp();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileSelectorOpen, setIsProfileSelectorOpen] = useState(false);

  const currentDateStr = new Date().toLocaleDateString(
    language === 'ar' ? 'ar-DZ' : language === 'en' ? 'en-US' : 'fr-FR',
    { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
  );

  const unreadNotifications = staffNotifications.filter((n) => !n.read);
  const urgentMessages = staffMessages.filter((m) => m.channelId === 'urgent' && m.isUrgent);

  const handleNotificationClick = (notif: any) => {
    markNotificationRead(notif.id);
    setIsNotificationsOpen(false);
    if (notif.patientId) {
      openPatientWorkspace(notif.patientId);
    }
  };

  // Switch current user identity
  const handleUserSwitch = (member: any) => {
    setCurrentUser(member);
    setIsProfileSelectorOpen(false);
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-sky-100 sticky top-0 z-20 px-4 sm:px-6 py-3 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Global Search Bar & Quick Add Button */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rtl:right-3 rtl:left-auto" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2 text-sm bg-slate-50 border border-slate-200/90 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all text-slate-800 placeholder-slate-400 font-medium"
            />
          </div>

          {/* Quick Add Patient Header Action */}
          <button
            onClick={openQuickAddPatient}
            className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer group"
            title="Ajouter rapidement un patient (Alt + P)"
          >
            <UserPlus className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span className="hidden md:inline">{t('quick_patient')}</span>
            <span className="hidden lg:inline-block px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-mono text-white/90">
              Alt+P
            </span>
          </button>
        </div>

        {/* Right Section / Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
          {/* Current Date Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 text-xs font-bold border border-sky-100">
            <CalendarIcon className="w-3.5 h-3.5 text-sky-600" />
            <span>{currentDateStr}</span>
          </div>

          {/* Language Switcher Pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
            {(['fr', 'en', 'ar'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2.5 py-1 text-xs font-extrabold rounded-xl transition-all uppercase ${
                  language === lang
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Chat Messenger Trigger button */}
          <button
            onClick={() => setIsStaffChatOpen(!isStaffChatOpen)}
            className={`relative p-2 rounded-2xl transition-all border shrink-0 ${
              isStaffChatOpen
                ? 'bg-sky-500 border-sky-600 text-white shadow-md'
                : 'text-slate-500 hover:text-sky-600 hover:bg-sky-50 border-transparent hover:border-sky-100'
            }`}
            title="Messagerie Interne Clinique"
          >
            <MessageSquare className="w-4.5 h-4.5" />
            {urgentMessages.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-black text-white ring-2 ring-white animate-bounce">
                {urgentMessages.length}
              </span>
            )}
          </button>

          {/* Notifications button with popover */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsProfileSelectorOpen(false);
              }}
              className={`relative p-2 rounded-2xl transition-all border shrink-0 ${
                isNotificationsOpen
                  ? 'bg-slate-100 border-slate-200 text-slate-800'
                  : 'text-slate-500 hover:text-sky-600 hover:bg-sky-50 border-transparent hover:border-sky-100'
              }`}
              title="Système d'aiguillage"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-white ring-2 ring-white">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {/* Notifications Popover Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2.5 z-50 text-slate-800 text-xs">
                <div className="px-3.5 py-1.5 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs">Notifications & Aiguillage</span>
                  {unreadNotifications.length > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[10px] font-extrabold text-sky-600 hover:text-sky-700"
                    >
                      Tout marquer lu
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {staffNotifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-slate-400">
                      <Clock className="w-5 h-5 mx-auto text-slate-300 mb-1" />
                      <p className="font-bold text-[11px]">Aucune notification active</p>
                    </div>
                  ) : (
                    staffNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-3 hover:bg-slate-50 cursor-pointer transition-colors flex gap-2.5 items-start ${
                          !notif.read ? 'bg-sky-50/40' : ''
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {notif.type === 'patient_waiting' ? (
                            <div className="p-1 bg-emerald-100 text-emerald-700 rounded-lg">
                              <Clock className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <div className="p-1 bg-rose-100 text-rose-700 rounded-lg">
                              <AlertCircle className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="font-extrabold text-slate-900 text-[11px] truncate">
                              {notif.title}
                            </p>
                            <span className="text-[9px] text-slate-400 shrink-0">{notif.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-snug break-words">
                            {notif.message}
                          </p>
                          {notif.type === 'patient_waiting' && (
                            <span className="inline-block mt-1 text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded">
                              Ouvrir dossier 📁
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Badge with Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileSelectorOpen(!isProfileSelectorOpen);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center gap-2 pl-2 border-l border-slate-200 rtl:border-l-0 rtl:border-r rtl:pr-2 cursor-pointer hover:opacity-90 group text-left rtl:text-right"
            >
              <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-sky-500 to-sky-700 text-white flex items-center justify-center font-extrabold text-xs shadow-sm ring-2 ring-sky-500/20 group-hover:scale-105 transition-transform">
                {currentUser.name.split(' ').pop()?.substring(0, 2).toUpperCase() || 'ST'}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-extrabold text-slate-800 leading-tight flex items-center gap-1">
                  {currentUser.name}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </p>
                <p className="text-[10px] text-sky-600 font-bold flex items-center gap-1 uppercase tracking-wide">
                  <UserCheck className="w-3 h-3 inline text-sky-500" /> {currentUser.role}
                </p>
              </div>
            </button>

            {/* Profile switching dropdown */}
            {isProfileSelectorOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2.5 z-50 text-slate-800 text-xs">
                <div className="px-3.5 py-1.5 border-b border-slate-100">
                  <p className="font-extrabold text-slate-900 text-xs">Simuler un profil clinique</p>
                  <p className="text-[10px] text-slate-400">Pour tester le flux d'aiguillage</p>
                </div>

                <div className="py-1 divide-y divide-slate-50">
                  {staffMembers.map((member) => {
                    const isSelected = currentUser.id === member.id;
                    return (
                      <button
                        key={member.id}
                        onClick={() => handleUserSwitch(member)}
                        className={`w-full text-left px-3.5 py-2.5 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer ${
                          isSelected ? 'bg-sky-50/30' : ''
                        }`}
                      >
                        <div className="space-y-0.5 min-w-0 pr-2">
                          <p className={`font-bold text-xs truncate ${isSelected ? 'text-sky-700' : 'text-slate-800'}`}>
                            {member.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {member.role === 'Admin' ? 'Administrateur' : member.role} {member.specialty && `• ${member.specialty}`}
                          </p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-sky-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
