import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ToothStatus, ToothSurface, ToothData } from '../../types';
import { Check, Plus, Save, History, FileText } from 'lucide-react';

interface OdontogramProps {
  patientId: string;
  onAddTreatmentClick?: (toothId: number, defaultProcedure?: string) => void;
}


interface RealToothProps {
  id: number;
  status: ToothStatus;
  isSelected: boolean;
  onClick: () => void;
}

const RealTooth: React.FC<RealToothProps> = ({ id, status, isSelected, onClick }) => {
  const getToothColors = (status: ToothStatus) => {
    switch (status) {
      case 'carie': return { crown: 'fill-rose-100', root: 'fill-rose-50', stroke: 'stroke-rose-400' };
      case 'obture': return { crown: 'fill-sky-100', root: 'fill-sky-50', stroke: 'stroke-sky-400' };
      case 'couronne': return { crown: 'fill-amber-100', root: 'fill-amber-50', stroke: 'stroke-amber-400' };
      case 'traitement_canalaire': return { crown: 'fill-white', root: 'fill-purple-200', stroke: 'stroke-slate-300' };
      case 'absent': return { crown: 'fill-transparent', root: 'fill-transparent', stroke: 'stroke-slate-300 stroke-dashed' };
      case 'implant': return { crown: 'fill-white', root: 'fill-teal-200', stroke: 'stroke-slate-300' };
      case 'pont': return { crown: 'fill-yellow-100', root: 'fill-transparent', stroke: 'stroke-yellow-400' };
      case 'sain':
      default: return { crown: 'fill-white', root: 'fill-orange-50', stroke: 'stroke-slate-300' };
    }
  };

  const colors = getToothColors(status);
  
  const isUpper = (id >= 11 && id <= 28) || (id >= 51 && id <= 65);
  const isMolar = [16,17,18, 26,27,28, 36,37,38, 46,47,48, 54,55, 64,65, 74,75, 84,85].includes(id);
  const isPremolar = [14,15, 24,25, 34,35, 44,45].includes(id);
  const isCanine = [13,23, 33,43, 53,63, 73,83].includes(id);

  let rootPath = "";
  let crownPath = "";

  if (isMolar) {
    rootPath = "M 25 80 C 20 40, 25 10, 35 10 C 45 10, 45 40, 50 50 C 55 40, 55 10, 65 10 C 75 10, 80 40, 75 80 Z";
    crownPath = "M 20 80 C 15 100, 20 130, 30 135 C 40 140, 60 140, 70 135 C 80 130, 85 100, 80 80 C 80 75, 20 75, 20 80 Z";
  } else if (isPremolar) {
    rootPath = "M 30 80 C 30 30, 40 10, 50 10 C 60 10, 70 30, 70 80 Z";
    crownPath = "M 25 80 C 25 100, 30 135, 45 140 C 55 140, 70 135, 75 80 C 75 75, 25 75, 25 80 Z";
  } else if (isCanine) {
    rootPath = "M 35 80 C 35 30, 45 5, 50 5 C 55 5, 65 30, 65 80 Z";
    crownPath = "M 30 80 C 30 100, 40 130, 50 145 C 60 130, 70 100, 70 80 C 70 75, 30 75, 30 80 Z";
  } else {
    // Incisor
    rootPath = "M 35 80 C 35 30, 40 10, 50 10 C 60 10, 65 30, 65 80 Z";
    crownPath = "M 25 80 C 25 100, 30 135, 35 140 L 65 140 C 70 135, 75 100, 75 80 C 75 75, 25 75, 25 80 Z";
  }

  const toothSvg = (
    <div className={`relative w-8 h-[55px] transition-all duration-300 flex items-center justify-center cursor-pointer select-none group outline-none ${
      isSelected 
        ? 'scale-125 z-30 filter drop-shadow-[0_8px_10px_rgba(56,189,248,0.5)]' 
        : 'hover:scale-110 hover:z-20 filter hover:drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]'
    } ${!isUpper ? 'rotate-180' : ''}`}
    >
      {isSelected && (
        <div className="absolute -inset-1 rounded-xl bg-sky-500/20 animate-pulse border-2 border-sky-400" />
      )}
      <svg viewBox="0 0 100 150" className="w-full h-full overflow-visible">
        <path d={rootPath} className={`${colors.root} ${colors.stroke}`} strokeWidth="4" strokeLinejoin="round" />
        <path d={crownPath} className={`${colors.crown} ${colors.stroke}`} strokeWidth="4" strokeLinejoin="round" />
      </svg>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-1.5" onClick={onClick}>
      {isUpper ? (
        <>
          {toothSvg}
          <span className={`text-[10px] font-black ${isSelected ? 'text-sky-600' : 'text-slate-400'}`}>{id}</span>
        </>
      ) : (
        <>
          <span className={`text-[10px] font-black ${isSelected ? 'text-sky-600' : 'text-slate-400'}`}>{id}</span>
          {toothSvg}
        </>
      )}
    </div>
  );
};

export const Odontogram: React.FC<OdontogramProps> = ({ patientId, onAddTreatmentClick }) => {
  const { teethData, updateToothData } = useApp();
  const [viewType, setViewType] = useState<'adult' | 'primary'>('adult');
  const [selectedToothId, setSelectedToothId] = useState<number>(17); // Tooth 17 default

  // Adult Jaw
  const adultUpperRight = [18, 17, 16, 15, 14, 13, 12, 11];
  const adultUpperLeft = [21, 22, 23, 24, 25, 26, 27, 28];
  const adultLowerRight = [48, 47, 46, 45, 44, 43, 42, 41];
  const adultLowerLeft = [31, 32, 33, 34, 35, 36, 37, 38];

  // Primary Jaw
  const primaryUpperRight = [55, 54, 53, 52, 51];
  const primaryUpperLeft = [61, 62, 63, 64, 65];
  const primaryLowerRight = [85, 84, 83, 82, 81];
  const primaryLowerLeft = [71, 72, 73, 74, 75];

  const upperRight = viewType === 'adult' ? adultUpperRight : primaryUpperRight;
  const upperLeft = viewType === 'adult' ? adultUpperLeft : primaryUpperLeft;
  const lowerRight = viewType === 'adult' ? adultLowerRight : primaryLowerRight;
  const lowerLeft = viewType === 'adult' ? adultLowerLeft : primaryLowerLeft;

  const currentPatientTeeth = teethData[patientId] || {};
  const selectedTooth: ToothData = currentPatientTeeth[selectedToothId] || {
    id: selectedToothId,
    status: 'sain',
    surfaces: [],
  };

  const [statusInput, setStatusInput] = useState<ToothStatus>(selectedTooth.status || 'sain');
  const [surfacesInput, setSurfacesInput] = useState<ToothSurface[]>(selectedTooth.surfaces || []);
  const [treatmentInput, setTreatmentInput] = useState<string>(selectedTooth.treatmentNeeded || 'Examen');
  const [noteInput, setNoteInput] = useState<string>('');

  const handleToothClick = (id: number) => {
    setSelectedToothId(id);
    const t = currentPatientTeeth[id] || { id, status: 'sain', surfaces: [] };
    setStatusInput(t.status || 'sain');
    setSurfacesInput(t.surfaces || []);
    setTreatmentInput(t.treatmentNeeded || 'Examen');
  };

  const toggleSurface = (s: ToothSurface) => {
    setSurfacesInput((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleSaveTooth = () => {
    updateToothData(patientId, selectedToothId, {
      status: statusInput,
      surfaces: surfacesInput,
      treatmentNeeded: treatmentInput,
      notes: noteInput ? noteInput : selectedTooth.notes,
    });
    setNoteInput('');
  };

  const getStatusColor = (status: ToothStatus) => {
    switch (status) {
      case 'carie':
        return 'bg-rose-500 text-white border-rose-600';
      case 'obture':
        return 'bg-sky-500 text-white border-sky-600';
      case 'couronne':
        return 'bg-amber-500 text-white border-amber-600';
      case 'traitement_canalaire':
        return 'bg-purple-500 text-white border-purple-600';
      case 'absent':
        return 'bg-slate-300 text-slate-600 border-slate-400 opacity-60';
      case 'implant':
        return 'bg-teal-500 text-white border-teal-600';
      case 'pont':
        return 'bg-yellow-400 text-slate-900 border-yellow-500';
      case 'sain':
      default:
        return 'bg-emerald-500 text-white border-emerald-600';
    }
  };

  const statusOptions: { label: string; value: ToothStatus; colorClass: string }[] = [
    { label: 'Sain', value: 'sain', colorClass: 'bg-emerald-500' },
    { label: 'Carie', value: 'carie', colorClass: 'bg-rose-500' },
    { label: 'Obturé', value: 'obture', colorClass: 'bg-sky-500' },
    { label: 'Couronne', value: 'couronne', colorClass: 'bg-amber-500' },
    { label: 'Traitement canalaire', value: 'traitement_canalaire', colorClass: 'bg-purple-500' },
    { label: 'Absent', value: 'absent', colorClass: 'bg-slate-400' },
    { label: 'Implant', value: 'implant', colorClass: 'bg-teal-500' },
    { label: 'Pont', value: 'pont', colorClass: 'bg-yellow-400' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header & Legend */}
      <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Odontogramme</h3>
          <p className="text-xs text-slate-500">Vue globale des arcades dentaires</p>
        </div>
        
        {/* Toggle Adult / Primary */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewType('adult')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              viewType === 'adult'
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Dents Définitives
          </button>
          <button
            onClick={() => setViewType('primary')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              viewType === 'primary'
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Dents Primaires
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm">
        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-bold text-slate-500 mb-6 bg-slate-50 py-2 px-4 rounded-full border border-slate-100 w-fit mx-auto">
          {statusOptions.map((opt) => (
            <div key={opt.value} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${opt.colorClass}`}></span>
              <span>{opt.label}</span>
            </div>
          ))}
        </div>

        {/* Arcade Supérieure */}
        <div className="text-[10px] font-black text-slate-400 text-center mb-3 uppercase tracking-widest">
          Arcade Supérieure
        </div>
        <div className="flex justify-center mb-4">
          <div 
            className="grid gap-0" 
            style={{ gridTemplateColumns: `repeat(${upperRight.length + upperLeft.length}, minmax(0, 1fr))` }}
          >
            {[...upperRight, ...upperLeft].map((id) => {
              const tooth = currentPatientTeeth[id] || { id, status: 'sain', surfaces: [] };
              return (
                <RealTooth
                  key={id}
                  id={id}
                  status={tooth.status || 'sain'}
                  isSelected={selectedToothId === id}
                  onClick={() => handleToothClick(id)}
                />
              );
            })}
          </div>
        </div>

        <div className="border-t border-slate-100 mb-4 mx-8"></div>

        {/* Arcade Inférieure */}
        <div className="flex justify-center mb-3">
          <div 
            className="grid gap-0" 
            style={{ gridTemplateColumns: `repeat(${lowerRight.length + lowerLeft.length}, minmax(0, 1fr))` }}
          >
            {[...lowerRight, ...lowerLeft].map((id) => {
              const tooth = currentPatientTeeth[id] || { id, status: 'sain', surfaces: [] };
              return (
                <RealTooth
                  key={id}
                  id={id}
                  status={tooth.status || 'sain'}
                  isSelected={selectedToothId === id}
                  onClick={() => handleToothClick(id)}
                />
              );
            })}
          </div>
        </div>
        <div className="text-[10px] font-black text-slate-400 text-center uppercase tracking-widest">
          Arcade Inférieure
        </div>
      </div>

      {/* Selected Tooth Detail Panel */}
      <div className="bg-slate-50 p-5 rounded-[24px] border border-slate-200">
        <div className="flex flex-col md:flex-row gap-6">
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-black text-slate-800">
                Dent FDI #{selectedToothId}
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(
                  selectedTooth.status || 'sain'
                )}`}
              >
                {selectedTooth.status || 'sain'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Statut
                </label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value as ToothStatus)}
                  className="w-full py-1.5 px-3 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/30 text-slate-900"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Traitement
                </label>
                <select
                  value={treatmentInput}
                  onChange={(e) => setTreatmentInput(e.target.value)}
                  className="w-full py-1.5 px-3 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/30 text-slate-900"
                >
                  <option value="Examen">Examen</option>
                  <option value="Détartrage">Détartrage</option>
                  <option value="Traitement carie">Traitement carie</option>
                  <option value="Dévitalisation">Dévitalisation</option>
                  <option value="Extraction">Extraction</option>
                  <option value="Couronne">Couronne</option>
                  <option value="Pont">Pont</option>
                  <option value="Prothèse">Prothèse</option>
                  <option value="Implant">Implant</option>
                </select>
              </div>
            </div>

            {(statusInput === 'carie' || statusInput === 'obture') && (
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Surfaces affectées
                </label>
                <div className="flex gap-1">
                  {(['M', 'O', 'D', 'B', 'L', 'V'] as ToothSurface[]).map((s) => {
                    const active = surfacesInput.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSurface(s)}
                        className={`flex-1 py-1 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                          active
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-600">
                Historique
              </label>
              {onAddTreatmentClick && (
                <button
                  type="button"
                  onClick={() => onAddTreatmentClick(selectedToothId, treatmentInput)}
                  className="text-[10px] font-bold text-sky-600 hover:text-sky-700 cursor-pointer flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" />
                  Planifier
                </button>
              )}
            </div>
            
            <div className="flex-1 bg-white border border-slate-200 rounded-xl p-2 mb-3 overflow-y-auto max-h-[90px]">
              {!selectedTooth.history || selectedTooth.history.length === 0 ? (
                <p className="text-[10px] text-slate-400 italic text-center mt-3">Aucune entrée</p>
              ) : (
                <div className="space-y-1">
                  {selectedTooth.history.map((h, i) => (
                    <div key={i} className="p-1.5 bg-slate-50 rounded-lg text-[10px] border border-slate-100">
                      <p className="font-bold text-slate-800">{h.action}</p>
                      <p className="text-slate-400 text-[9px]">{h.date} • {h.doctor}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={handleSaveTooth}
              className="w-full py-2 text-[11px] font-bold text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 rounded-xl shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Enregistrer les modifications</span>
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};