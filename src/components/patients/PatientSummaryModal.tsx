import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PatientSummaryView } from './PatientSummaryView';
import { FileText, X } from 'lucide-react';

export const PatientSummaryModal: React.FC = () => {
  const { isPatientSummaryOpen, closePatientSummary, summaryPatientId, t } = useApp();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPatientSummaryOpen) {
        closePatientSummary();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPatientSummaryOpen, closePatientSummary]);

  if (!isPatientSummaryOpen || !summaryPatientId) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-100 w-full max-w-5xl rounded-[32px] shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-white border-b border-sky-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">{t('patient_summary')}</h2>
              <p className="text-xs text-slate-500 font-medium">
                Aperçu synthétique du dossier médical & financier.
              </p>
            </div>
          </div>

          <button
            onClick={closePatientSummary}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Fermer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
          <PatientSummaryView
            patientId={summaryPatientId}
            onCloseModal={closePatientSummary}
            isEmbeddedInModal={true}
          />
        </div>
      </div>
    </div>
  );
};
