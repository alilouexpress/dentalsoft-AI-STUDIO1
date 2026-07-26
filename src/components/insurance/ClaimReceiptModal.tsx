import React from 'react';
import { InsuranceClaim, Patient } from '../../types';
import { Printer, X } from 'lucide-react';

interface ClaimReceiptModalProps {
  claim: InsuranceClaim;
  patient: Patient;
  onClose: () => void;
}

export const ClaimReceiptModal: React.FC<ClaimReceiptModalProps> = ({ claim, patient, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-8 space-y-6 animate-in fade-in">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-sky-400 flex items-center justify-center font-black">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">BORDEREAU DE TÉLÉ-TRANSMISSION TIERS-PAYANT</h2>
              <p className="text-xs text-slate-500">
                Feuille de Soins Dentaires & Prise en Charge — Réf: {claim.claimNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Imprimer PDF
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Body */}
        <div className="space-y-6 text-xs text-slate-800 font-sans">
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Praticien / Cabinet</p>
              <p className="font-black text-slate-900">Dr. Amrani Samir</p>
              <p className="text-slate-600">Chirurgien Dentiste — Cabinet d'Implantologie</p>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Assuré / Patient</p>
              <p className="font-black text-slate-900">{patient.name}</p>
              <p className="text-slate-600">Code Patient: {patient.code} • Âge: {patient.age} ans</p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-900 text-white p-2.5 font-bold text-[11px] flex justify-between">
              <span>DÉTAIL DE LA DEMANDE</span>
              <span>Organisme: {claim.providerName}</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Acte Médical Transmis:</span>
                <strong className="text-slate-900">{claim.treatmentName}</strong>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Date d'Exécution:</span>
                <strong>{claim.treatmentDate}</strong>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Montant Facturé:</span>
                <strong className="text-slate-900">{claim.submittedAmount.toLocaleString('fr-FR')} DA</strong>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-2 text-emerald-700">
                <span className="font-bold">Part Organisme Payeur (Prise en Charge):</span>
                <strong className="text-sm font-black">{claim.approvedAmount.toLocaleString('fr-FR')} DA</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Reste à Charge Patient (Ticket Modérateur):</span>
                <strong className="text-slate-900">{claim.patientCopay.toLocaleString('fr-FR')} DA</strong>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-[11px] text-slate-500">
            <div>
              <p>Transmis le: {claim.submissionDate}</p>
              <p>Statut Actuel: <strong className="text-slate-900">{claim.status}</strong></p>
            </div>

            <div className="w-36 h-20 border border-dashed border-slate-300 rounded-xl p-2 text-center text-[9px] text-slate-400 flex items-center justify-center">
              Cachet & Signature du Praticien
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
