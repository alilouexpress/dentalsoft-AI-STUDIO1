import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Stethoscope,
  Tv,
  MonitorCheck,
  Building2,
  ChevronRight,
  Maximize2,
} from 'lucide-react';

interface CabinetIntroTourProps {
  onFinishTour: () => void;
}

interface TourZone {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  progressStart: number;
  progressEnd: number;
  icon: React.ElementType;
  badge: string;
  bgGradient: string;
  equipmentList: string[];
}

export const CabinetIntroTour: React.FC<CabinetIntroTourProps> = ({ onFinishTour }) => {
  const [progress, setProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeZoneIndex, setActiveZoneIndex] = useState<number>(0);

  const zones: TourZone[] = [
    {
      id: 1,
      title: "1. Accueil & Lounge d'Attente VIP",
      subtitle: "Espace Réception & Aiguillage Patients",
      description:
        "Visite virtuelle de l'espace d'accueil : borne d'enregistrement fluide, sièges ergonomiques, éclairage d'ambiance apaisant et écran d'appel dynamique des rendez-vous.",
      progressStart: 0,
      progressEnd: 25,
      icon: Building2,
      badge: "Zone Accueil",
      bgGradient: "from-slate-900 via-sky-950 to-slate-900",
      equipmentList: [
        "Borne d'accueil tactile & appel patient",
        "Espace d'attente climatisé & insonorisé",
        "Affichage digital en temps réel (File d'attente)",
      ],
    },
    {
      id: 2,
      title: "2. Unité Opératoire & Fauteuil High-Tech",
      subtitle: "Fauteuil Médical & Scanner Intra-oral 3D",
      description:
        "Exploration du bloc de soin principal : fauteuil chirurgical articulé, scialytique LED multi-spectral, caméra intra-orale HD et système d'aspiration chirurgicale silencieuse.",
      progressStart: 25,
      progressEnd: 55,
      icon: Stethoscope,
      badge: "Bloc Opératoire",
      bgGradient: "from-sky-950 via-slate-900 to-emerald-950",
      equipmentList: [
        "Fauteuil dentaire ergonomique à mémoire de forme",
        "Scanner intra-oral 3D & Caméra HD 4K",
        "Scialytique LED chirurgical anti-ombre",
      ],
    },
    {
      id: 3,
      title: "3. Pôle Imagerie 3D & Stérilisation",
      subtitle: "Radio Panoramique CBCT & Autoclave Classe B",
      description:
        "Passage par la salle d'imagerie numérique et la chaîne de stérilisation : scanner panoramique 3D CBCT à faible dose, autoclave médical haute pression et ensacheuses.",
      progressStart: 55,
      progressEnd: 85,
      icon: Tv,
      badge: "Imagerie & Hygiène",
      bgGradient: "from-emerald-950 via-slate-900 to-sky-950",
      equipmentList: [
        "Scanner panoramique dentaire 3D (CBCT)",
        "Autoclave médical de Classe B traçable",
        "Capteurs numériques X-Ray instantanés",
      ],
    },
    {
      id: 4,
      title: "4. Bureau de Consultation Praticien",
      subtitle: "Poste de Commande & Gestion DentalSoft",
      description:
        "Arrivée au bureau du médecin et à la réception : le poste informatique s'allume avec le système DentalSoft. Tout est prêt pour l'authentification et la prise en main du cabinet.",
      progressStart: 85,
      progressEnd: 100,
      icon: MonitorCheck,
      badge: "Poste de Contrôle",
      bgGradient: "from-slate-900 via-sky-900 to-indigo-950",
      equipmentList: [
        "Poste informatique sécurisé DentalSoft v2.5",
        "Système de double écran consultation & radio",
        "Lecteur de carte à puce & validation d'actes",
      ],
    },
  ];

  // Auto increment progress timer
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onFinishTour();
          }, 400);
          return 100;
        }
        return prev + 1;
      });
    }, 80); // Total ~8s duration for full tour

    return () => clearInterval(interval);
  }, [isPlaying, onFinishTour]);

  // Sync active zone with progress percentage
  useEffect(() => {
    if (progress < 25) setActiveZoneIndex(0);
    else if (progress < 55) setActiveZoneIndex(1);
    else if (progress < 85) setActiveZoneIndex(2);
    else setActiveZoneIndex(3);
  }, [progress]);

  const currentZone = zones[activeZoneIndex];
  const CurrentZoneIcon = currentZone.icon;

  const handleJumpToZone = (zone: TourZone) => {
    setProgress(zone.progressStart + 1);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* Dynamic Background Motion Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${currentZone.bgGradient} transition-all duration-1000 opacity-90`}
      />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* Ambient glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl animate-pulse pointer-events-none" />

      {/* TOP BAR */}
      <header className="relative z-20 px-6 py-5 flex items-center justify-between border-b border-white/10 bg-slate-950/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-emerald-300 text-slate-950 p-2 flex items-center justify-center font-black shadow-lg shadow-sky-500/20">
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
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
              Dental<span className="text-sky-400">Soft</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full border border-sky-400/30">
                Tour Virtuel Cabinet
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">
              Présentation guidée de la clinique & équipements
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                <span className="hidden sm:inline">Reprendre</span>
              </>
            )}
          </button>

          <button
            onClick={onFinishTour}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2 cursor-pointer group"
          >
            <span>Passer l'intro</span>
            <SkipForward className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </header>

      {/* MAIN VIEWPORT: CAMERA TOUR SIMULATION */}
      <main className="relative z-10 my-auto px-4 sm:px-8 py-6 max-w-6xl mx-auto w-full flex flex-col items-center">
        {/* Animated Cabinet Stage Frame */}
        <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
          {/* Top Status Bar in Stage */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-extrabold text-white uppercase tracking-wider text-[11px]">
                Caméra Virtuelle • Panning Cabinet
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono font-bold bg-slate-800/80 px-3 py-1 rounded-full border border-white/10">
              <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
              <span>4K HD 60fps</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Cabinet Animation Canvas Graphic */}
            <div className="lg:col-span-7 aspect-video rounded-2xl bg-gradient-to-br from-slate-950 to-sky-950 border border-white/15 relative overflow-hidden shadow-2xl flex flex-col justify-between p-6 group-hover:border-sky-500/40 transition-colors">
              {/* Simulated Camera Scan lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_51%)] bg-[size:100%_4px] opacity-30 pointer-events-none" />

              {/* Dynamic Zone Graphic Badge */}
              <div className="flex items-center justify-between relative z-10">
                <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-sky-400" />
                  {currentZone.badge}
                </span>

                <div className="flex items-center gap-1 text-[11px] font-extrabold text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-white/10">
                  <span>Séquence {currentZone.id}/4</span>
                </div>
              </div>

              {/* Center Animated Icon Representation */}
              <div className="my-auto text-center relative z-10 space-y-3">
                <div className="inline-flex p-5 rounded-3xl bg-gradient-to-tr from-sky-500/20 to-emerald-500/20 text-sky-400 ring-1 ring-white/20 shadow-2xl transform transition-transform duration-700 hover:scale-105">
                  <CurrentZoneIcon className="w-14 h-14 text-sky-300 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{currentZone.title}</h3>
                  <p className="text-xs text-sky-200/80 font-medium">{currentZone.subtitle}</p>
                </div>
              </div>

              {/* Bottom Camera Coordinates Overlay */}
              <div className="flex items-center justify-between relative z-10 text-[10px] font-mono text-slate-400 border-t border-white/10 pt-3">
                <span>POS: X-102 Y-45 Z-89</span>
                <span className="text-emerald-400 font-bold">● REC ACTIVE</span>
                <span>PAN: {progress * 3.6}°</span>
              </div>
            </div>

            {/* Zone Information & Equipment List */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400">
                  Visite Guidée du Cabinet
                </span>
                <h2 className="text-2xl font-black text-white mt-0.5 leading-snug">
                  {currentZone.title}
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed mt-2">
                  {currentZone.description}
                </p>
              </div>

              {/* Equipment Checklist */}
              <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-white/10">
                <h4 className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> Équipements de cette zone :
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-200 font-medium">
                  {currentZone.equipmentList.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Step Preview */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Progression totale :</span>
                <span className="font-extrabold text-sky-400 font-mono text-sm">{progress}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* PROGRESS BAR (0% -> 100%) */}
        <div className="w-full mt-8 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              Initialisation du matériel & Chargement du cabinet ({progress}%)
            </span>
            <span className="text-slate-400 text-[11px]">
              {progress < 100 ? "Passage automatique à l'identification à 100%" : "Terminé !"}
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-3 bg-slate-900 border border-white/15 rounded-full p-0.5 shadow-inner overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-sky-500 via-emerald-400 to-sky-400 rounded-full transition-all duration-100 relative shadow-lg shadow-sky-500/50"
              style={{ width: `${progress}%` }}
            >
              {/* Glowing leading light */}
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-white blur-xs rounded-full" />
            </div>
          </div>

          {/* Zone Waypoints / Clickable Stops */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {zones.map((z, idx) => {
              const isCurrent = activeZoneIndex === idx;
              const isPassed = progress >= z.progressEnd;
              return (
                <button
                  key={z.id}
                  onClick={() => handleJumpToZone(z)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-sky-500/20 border-sky-400 text-white shadow-lg shadow-sky-500/10'
                      : isPassed
                      ? 'bg-slate-900/60 border-emerald-500/40 text-slate-300'
                      : 'bg-slate-900/40 border-white/10 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span>{z.badge}</span>
                    {isPassed ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-slate-500" />
                    )}
                  </div>
                  <p className="text-xs font-black truncate mt-1">{z.title.split('.')[1] || z.title}</p>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-20 px-6 py-4 border-t border-white/10 bg-slate-950/60 text-slate-400 text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[11px]">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>DentalSoft © 2026 • Système d'Accès Sécurisé pour Cabinet Dentaire</span>
        </div>
        <button
          onClick={onFinishTour}
          className="text-sky-400 hover:text-sky-300 text-[11px] font-bold underline flex items-center gap-1 cursor-pointer"
        >
          <span>Ouvrir la page d'identification immédiatement</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </footer>
    </div>
  );
};
