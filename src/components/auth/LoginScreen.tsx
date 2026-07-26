import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, Language } from '../../types';
import {
  ShieldCheck,
  Stethoscope,
  UserCheck,
  Lock,
  ArrowRight,
  AlertCircle,
  Play,
  CheckCircle2,
} from 'lucide-react';

interface LoginScreenProps {
  onReplayIntro?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onReplayIntro }) => {
  const { login, verifyRolePassword, language, setLanguage } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Role details metadata (no exposed passwords)
  const rolesInfo = [
    {
      id: 'admin' as UserRole,
      title: 'Administrateur',
      subtitle: 'Contrôle Total du Cabinet',
      badge: 'Accès Illimité',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: ShieldCheck,
      description:
        "Gestion globale, comptabilité, journal d'audit, configuration système, gestion du personnel & rapports financiers.",
    },
    {
      id: 'doctor' as UserRole,
      title: 'Médecin / Docteur',
      subtitle: 'Accès Clinique & Soins Patients',
      badge: 'Accès Praticien',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
      icon: Stethoscope,
      description:
        'Consultations, schémas dentaires, prescriptions, travaux de prothèse labo, ordonnances & historique médical.',
    },
    {
      id: 'assistant' as UserRole,
      title: 'Assistant(e)',
      subtitle: 'Accueil & Prise de Rendez-vous',
      badge: 'Accès Secrétariat',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: UserCheck,
      description:
        "Agenda, fiches d'accueil patients, salle d'attente, encaissements immédiats, rappels SMS & messagerie interne.",
    },
  ];

  const currentRoleMeta = rolesInfo.find((r) => r.id === selectedRole) || rolesInfo[0];

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setPassword('');
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!password) {
      setErrorMsg('Veuillez saisir votre mot de passe.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const isValid = verifyRolePassword(selectedRole, password);

      if (isValid) {
        login(selectedRole);
      } else {
        setErrorMsg(
          `Mot de passe incorrect pour le rôle ${currentRoleMeta.title}. Veuillez réessayer ou contacter l'administrateur.`
        );
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-3 sm:p-6 font-sans text-slate-800">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px] border border-slate-200/80">
        
        {/* Left Side: Brand Banner */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-sky-950 to-emerald-950 text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-emerald-300 text-slate-950 p-2.5 flex items-center justify-center shadow-lg shadow-sky-500/30">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-full h-full text-slate-950"
                >
                  <path d="M12 2C8 2 6 4 6 8c0 3 1 6 2 9 1 2 2 3 4 3s3-1 4-3c1-3 2-6 2-9 0-4-2-6-6-6z" />
                  <path d="M9 10c1.5 1 4.5 1 6 0" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
                  Dental<span className="text-sky-400">Soft</span>
                </h1>
                <p className="text-xs font-semibold text-sky-200/80">Cabinet Dentaire Pro</p>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Identification & Portail de Sécurité
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Veuillez sélectionner votre profil utilisateur (Administrateur, Médecin ou Assistant) et saisir votre mot de passe d'accès.
              </p>
            </div>

            {/* Replay Cabinet Tour Video Button */}
            {onReplayIntro && (
              <button
                type="button"
                onClick={onReplayIntro}
                className="w-full p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-sky-300 border border-sky-400/30 hover:border-sky-400 text-xs font-extrabold transition-all flex items-center justify-between group cursor-pointer shadow-lg"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0">
                    <Play className="w-4 h-4 fill-sky-300" />
                  </div>
                  <div className="text-left rtl:text-right">
                    <p className="font-extrabold text-white">Revoir le Tour du Cabinet</p>
                    <p className="text-[10px] text-sky-200/80 font-normal">Présentation vidéo de la clinique</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-sky-400 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </button>
            )}

            {/* Role Features Overview Box */}
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-sky-400 tracking-wider">
                  Droits d'accès attribués :
                </span>
                <span className={`px-2 py-0.5 text-[9px] font-black rounded-md border ${currentRoleMeta.badgeColor}`}>
                  {currentRoleMeta.badge}
                </span>
              </div>
              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                {currentRoleMeta.description}
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-slate-800 text-slate-400 text-[11px] flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Authentification Sécurisée
            </span>
            <span>v2.5.0</span>
          </div>
        </div>

        {/* Right Side: Role Selection & Identification Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
          <div className="max-w-lg mx-auto w-full my-auto space-y-6">
            
            {/* Header */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Authentification Utilisateur
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Choisissez votre rôle pour accéder au cabinet
              </p>
            </div>

            {/* 1. ROLE SELECTOR CARDS */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                1. Sélectionner un Rôle :
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {rolesInfo.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => handleRoleChange(role.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative group ${
                        isSelected
                          ? 'bg-sky-50/80 border-sky-500 ring-2 ring-sky-500/20 shadow-md'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-sky-500 text-white shadow-md'
                              : 'bg-slate-200 text-slate-600 group-hover:bg-slate-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-600" />}
                      </div>

                      <div>
                        <h4
                          className={`text-xs font-black truncate ${
                            isSelected ? 'text-sky-950' : 'text-slate-800'
                          }`}
                        >
                          {role.title}
                        </h4>
                        <p className="text-[10px] font-semibold text-slate-500 truncate mt-0.5">
                          {role.subtitle.split('&')[0]}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. PASSWORD INPUT FORM */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  2. Mot de passe de confirmation ({currentRoleMeta.title}) :
                </label>

                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:right-3.5 rtl:left-auto" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="Saisir votre mot de passe d'accès"
                    className="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Error Message Display */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium flex items-start gap-2.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <p>{errorMsg}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-sky-500/25 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-75"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Vérification des accès...</span>
                  </>
                ) : (
                  <>
                    <span>Identifier & Ouvrir le Cabinet ({currentRoleMeta.title})</span>
                    <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Language Selector */}
            <div className="pt-4 border-t border-slate-100 text-center space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Langue / Language / اللغة
              </p>
              <div className="flex items-center justify-center gap-2">
                {(['fr', 'en', 'ar'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1 text-xs font-extrabold rounded-lg border transition-all cursor-pointer ${
                      language === lang
                        ? 'bg-sky-50 text-sky-700 border-sky-300 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lang === 'fr' ? 'fr Français' : lang === 'en' ? 'en English' : 'ar العربية'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-400 mt-6">
            © 2026 DentalSoft • Gestion de Cabinet Médical & Dentaire
          </div>
        </div>
      </div>
    </div>
  );
};
