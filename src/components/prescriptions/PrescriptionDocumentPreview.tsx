import React from 'react';
import { Patient, PrescriptionTemplateSettings } from '../../types';

interface PrescriptionItem {
  id: string;
  name: string;
  dosage: string;
  duration: string;
  instructions: string;
  form: string;
}

interface PrescriptionDocumentPreviewProps {
  prescriptionTemplate: PrescriptionTemplateSettings;
  doctorName: string;
  patient: Patient;
  prescriptionItems: PrescriptionItem[];
  prescriptionNotes: string;
}

export const PrescriptionDocumentPreview: React.FC<PrescriptionDocumentPreviewProps> = ({
  prescriptionTemplate,
  doctorName,
  patient,
  prescriptionItems,
  prescriptionNotes,
}) => {
  return (
    <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 flex justify-center overflow-x-auto">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg border border-slate-300 p-8 text-slate-800 space-y-6 relative overflow-hidden">
        {/* Background Paper Texture */}
        {prescriptionTemplate.backgroundPaperUrl && (
          <img
            src={prescriptionTemplate.backgroundPaperUrl}
            alt="Paper Background"
            className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
          />
        )}

        {/* Header Section */}
        <div className="relative z-10">
          {prescriptionTemplate.templateStyle === 'official_border' ? (
            <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                {prescriptionTemplate.clinicLogoUrl && prescriptionTemplate.showLogo && (
                  <img
                    src={prescriptionTemplate.clinicLogoUrl}
                    alt="Logo Cabinet"
                    className="h-12 object-contain mb-2"
                  />
                )}
                <h1 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">
                  {prescriptionTemplate.clinicName}
                </h1>
                <p className="text-sm font-extrabold text-sky-800">
                  {doctorName || prescriptionTemplate.doctorName}
                </p>
                <p className="text-xs text-slate-700 font-medium">
                  {prescriptionTemplate.doctorTitle}
                </p>
                {prescriptionTemplate.specialtyText && (
                  <p className="text-[11px] text-slate-600 italic">
                    {prescriptionTemplate.specialtyText}
                  </p>
                )}
                <p className="text-[11px] text-slate-500">
                  {prescriptionTemplate.address} • Tél: {prescriptionTemplate.phone}
                </p>
              </div>

              <div className="text-right space-y-1 shrink-0">
                <div className="inline-block border border-slate-900 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-900">
                  {prescriptionTemplate.headerBannerText || 'RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE'}
                </div>
                <p className="text-xs font-bold text-slate-700 mt-2">
                  Date: {new Date().toLocaleDateString('fr-FR')}
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  Réf: ORD-{patient.code}
                </p>
              </div>
            </div>
          ) : prescriptionTemplate.templateStyle === 'modern' ? (
            <div className="space-y-4 border-b-2 border-sky-600 pb-4">
              <div className="h-2 bg-gradient-to-r from-sky-600 via-sky-500 to-teal-500 rounded-full" />
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {prescriptionTemplate.clinicLogoUrl && prescriptionTemplate.showLogo && (
                    <img
                      src={prescriptionTemplate.clinicLogoUrl}
                      alt="Logo"
                      className="h-14 object-contain"
                    />
                  )}
                  <div>
                    <h1 className="text-lg font-black text-slate-900">
                      {doctorName || prescriptionTemplate.doctorName}
                    </h1>
                    <p className="text-xs font-bold text-sky-700">
                      {prescriptionTemplate.clinicName}
                    </p>
                    <p className="text-xs text-slate-500">{prescriptionTemplate.doctorTitle}</p>
                    <p className="text-[11px] text-slate-400">{prescriptionTemplate.specialtyText}</p>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-600 space-y-1">
                  <p className="font-bold text-slate-800">{prescriptionTemplate.address}</p>
                  <p>Tél: {prescriptionTemplate.phone}</p>
                  <p>E-mail: {prescriptionTemplate.email}</p>
                  <p className="text-[11px] font-semibold text-slate-500 pt-1">
                    Date: {new Date().toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          ) : prescriptionTemplate.templateStyle === 'classic' ? (
            <div className="text-center space-y-1 pb-6 border-b-2 border-slate-800">
              {prescriptionTemplate.clinicLogoUrl && prescriptionTemplate.showLogo && (
                <img
                  src={prescriptionTemplate.clinicLogoUrl}
                  alt="Logo"
                  className="h-14 object-contain mx-auto mb-2"
                />
              )}
              <h1 className="text-lg font-black uppercase text-slate-900 tracking-wider">
                {prescriptionTemplate.clinicName}
              </h1>
              <p className="text-sm font-extrabold text-sky-800">
                {doctorName || prescriptionTemplate.doctorName}
              </p>
              <p className="text-xs text-slate-600">{prescriptionTemplate.doctorTitle}</p>
              {prescriptionTemplate.specialtyText && (
                <p className="text-[11px] text-slate-500 italic">
                  {prescriptionTemplate.specialtyText}
                </p>
              )}
              <p className="text-xs text-slate-500 font-medium pt-1">
                {prescriptionTemplate.address} • Tél: {prescriptionTemplate.phone}
              </p>
            </div>
          ) : (
            <div className="pb-6 border-b border-slate-300 flex justify-between items-start gap-4">
              <div>
                <h1 className="text-base font-black text-slate-900 uppercase">
                  {prescriptionTemplate.clinicName}
                </h1>
                <p className="text-sm font-black text-sky-800">
                  {doctorName || prescriptionTemplate.doctorName}
                </p>
                <p className="text-xs text-slate-700">{prescriptionTemplate.doctorTitle}</p>
                <p className="text-[11px] text-slate-500">
                  {prescriptionTemplate.address} — {prescriptionTemplate.phone}
                </p>
              </div>
              <div className="text-right text-xs">
                <p className="font-bold text-slate-800">Date: {new Date().toLocaleDateString('fr-FR')}</p>
                <p className="text-[11px] text-slate-500 font-mono">Réf: ORD-{patient.code}</p>
              </div>
            </div>
          )}
        </div>

        {/* Patient Information Section */}
        <div className="relative z-10 bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs font-medium">
          <div>
            <span className="text-slate-500">Nom & Prénom du Patient:</span>{' '}
            <strong className="text-slate-900 font-black text-sm ml-1">{patient.name}</strong>
          </div>
          <div>
            <span className="text-slate-500">Code Patient:</span>{' '}
            <strong className="text-slate-900 font-bold ml-1">{patient.code}</strong>
          </div>
          <div>
            <span className="text-slate-500">Âge:</span>{' '}
            <strong className="text-slate-900 font-bold ml-1">{patient.age} ans</strong>
          </div>
        </div>

        {/* Prescription Document Title */}
        <div className="relative z-10 text-center my-6">
          <h2 className="text-xl font-black tracking-wider text-slate-900 uppercase border-b-2 border-slate-900 inline-block pb-1">
            ORDONNANCE MÉDICALE
          </h2>
        </div>

        {/* Prescription Rx Items List */}
        <div className="relative z-10 space-y-6 min-h-[220px] py-2">
          {prescriptionItems.map((item, idx) => (
            <div key={idx} className="space-y-1 pl-4 border-l-2 border-sky-600">
              <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                {idx + 1}. {item.name} <span className="font-normal text-slate-600 text-xs">({item.form})</span>
              </p>
              <p className="text-xs font-bold text-slate-800 ml-3">
                👉 Posologie: {item.dosage} — pendant <span className="underline">{item.duration}</span>
              </p>
              {item.instructions && (
                <p className="text-[11px] text-slate-500 italic ml-3">
                  * {item.instructions}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Prescription Notes if any */}
        {prescriptionNotes && (
          <div className="relative z-10 border-t border-slate-200 pt-3 text-xs italic text-slate-600">
            <strong>Remarques du Praticien:</strong> {prescriptionNotes}
          </div>
        )}

        {/* Footer Signature & Stamp Box */}
        <div className="relative z-10 pt-8 border-t-2 border-slate-900 flex items-end justify-between gap-6">
          <div className="space-y-1 max-w-[320px]">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {prescriptionTemplate.footerText ||
                'Ordonnance établie conformément au code de déontologie dentaire'}
            </p>
            <p className="text-[10px] text-slate-400">Valable pour l'exécution en pharmacie d'officine.</p>
          </div>

          {prescriptionTemplate.showStampBox && (
            <div className="w-48 h-28 border-2 border-dashed border-slate-400 rounded-xl p-2 text-center flex flex-col items-center justify-center text-[10px] text-slate-400">
              <p className="font-bold uppercase text-slate-500">
                {prescriptionTemplate.stampBoxText || 'Cachet & Signature'}
              </p>
              <p className="text-[9px] text-slate-400 mt-1">{doctorName || prescriptionTemplate.doctorName}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
