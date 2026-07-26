import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient, InsurancePolicy, InsuranceClaim } from '../../types';
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  DollarSign,
  FileText,
  Calendar,
  Phone,
  Building,
  TrendingUp,
  Percent,
  Search,
  Filter,
  Printer,
  ChevronRight,
  Info,
  Sparkles,
  X,
  Check,
  CreditCard,
  Briefcase,
} from 'lucide-react';

import { ClaimReceiptModal } from './ClaimReceiptModal';

interface PatientInsuranceViewProps {
  patient: Patient;
}

export const PatientInsuranceView: React.FC<PatientInsuranceViewProps> = ({ patient }) => {
  const {
    insurancePolicies,
    insuranceClaims,
    addInsurancePolicy,
    updateInsurancePolicy,
    deleteInsurancePolicy,
    addInsuranceClaim,
    updateInsuranceClaimStatus,
    deleteInsuranceClaim,
    patientTreatments,
    showToast,
  } = useApp();

  // Filter policies and claims for this patient
  const patientPolicies = insurancePolicies.filter((p) => p.patientId === patient.id);
  const patientClaims = insuranceClaims.filter((c) => c.patientId === patient.id);
  const patientTreatmentsForClaim = patientTreatments.filter((t) => t.patientId === patient.id);

  // Filters and Modals state
  const [claimStatusFilter, setClaimStatusFilter] = useState<string>('Tous');
  const [isAddPolicyModalOpen, setIsAddPolicyModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<InsurancePolicy | null>(null);
  const [isSubmitClaimModalOpen, setIsSubmitClaimModalOpen] = useState(false);
  const [viewingClaimReceipt, setViewingClaimReceipt] = useState<InsuranceClaim | null>(null);

  // Stats calculation
  const totalAnnualLimit = patientPolicies.reduce((acc, p) => acc + (p.annualLimit || 0), 0);
  const totalUsedCoverage = patientPolicies.reduce((acc, p) => acc + (p.usedAmount || 0), 0);
  const remainingCoverage = Math.max(0, totalAnnualLimit - totalUsedCoverage);
  const coveragePercent = totalAnnualLimit > 0 ? Math.min(100, Math.round((totalUsedCoverage / totalAnnualLimit) * 100)) : 0;

  const totalSubmittedDA = patientClaims.reduce((acc, c) => acc + c.submittedAmount, 0);
  const totalApprovedDA = patientClaims.reduce((acc, c) => acc + c.approvedAmount, 0);
  const totalPatientCopayDA = patientClaims.reduce((acc, c) => acc + c.patientCopay, 0);
  const pendingClaimsCount = patientClaims.filter((c) => c.status === 'En attente').length;

  const filteredClaims = patientClaims.filter((c) => {
    if (claimStatusFilter === 'Tous') return true;
    return c.status === claimStatusFilter;
  });

  // Modal Policy Form State
  const [policyForm, setPolicyForm] = useState({
    providerName: 'CNAS (Sécurité Sociale)',
    policyNumber: '',
    groupNumber: '',
    type: 'Principale (CNAS/CASNOS)' as InsurancePolicy['type'],
    coveragePercentage: 80,
    annualLimit: 200000,
    usedAmount: 0,
    startDate: new Date().toISOString().slice(0, 10),
    expirationDate: `${new Date().getFullYear()}-12-31`,
    status: 'Actif' as InsurancePolicy['status'],
    primaryContactPhone: '',
    notes: '',
  });

  // Modal Claim Form State
  const [claimForm, setClaimForm] = useState({
    policyId: patientPolicies[0]?.id || '',
    treatmentName: '',
    toothNumber: '' as string | number,
    treatmentDate: new Date().toLocaleDateString('fr-FR'),
    submittedAmount: 15000,
    coveragePercent: patientPolicies[0]?.coveragePercentage || 80,
    notes: '',
  });

  const handleOpenAddPolicy = () => {
    setEditingPolicy(null);
    setPolicyForm({
      providerName: 'CNAS (Sécurité Sociale)',
      policyNumber: '',
      groupNumber: '',
      type: 'Principale (CNAS/CASNOS)',
      coveragePercentage: 80,
      annualLimit: 200000,
      usedAmount: 0,
      startDate: new Date().toISOString().slice(0, 10),
      expirationDate: `${new Date().getFullYear()}-12-31`,
      status: 'Actif',
      primaryContactPhone: '',
      notes: '',
    });
    setIsAddPolicyModalOpen(true);
  };

  const handleOpenEditPolicy = (policy: InsurancePolicy) => {
    setEditingPolicy(policy);
    setPolicyForm({
      providerName: policy.providerName,
      policyNumber: policy.policyNumber,
      groupNumber: policy.groupNumber || '',
      type: policy.type,
      coveragePercentage: policy.coveragePercentage,
      annualLimit: policy.annualLimit,
      usedAmount: policy.usedAmount,
      startDate: policy.startDate,
      expirationDate: policy.expirationDate,
      status: policy.status,
      primaryContactPhone: policy.primaryContactPhone || '',
      notes: policy.notes || '',
    });
    setIsAddPolicyModalOpen(true);
  };

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyForm.policyNumber) {
      showToast('Veuillez saisir le numéro d\'assuré / immatriculation.', 'warning');
      return;
    }

    if (editingPolicy) {
      updateInsurancePolicy(editingPolicy.id, policyForm);
      showToast('Couverture d\'assurance mise à jour.', 'success');
    } else {
      addInsurancePolicy({
        patientId: patient.id,
        ...policyForm,
      });
      showToast('Nouvelle couverture d\'assurance ajoutée.', 'success');
    }
    setIsAddPolicyModalOpen(false);
  };

  const handleOpenSubmitClaim = () => {
    if (patientPolicies.length === 0) {
      showToast('Veuillez ajouter une couverture d\'assurance active pour le patient avant de soumettre une prise en charge.', 'warning');
      handleOpenAddPolicy();
      return;
    }

    const firstPol = patientPolicies[0];
    const defaultTreatment = patientTreatmentsForClaim[0];

    setClaimForm({
      policyId: firstPol.id,
      treatmentName: defaultTreatment ? `${defaultTreatment.name} (${defaultTreatment.category})` : 'Soins Conservateurs & Détartrage',
      toothNumber: defaultTreatment?.toothId || '',
      treatmentDate: defaultTreatment?.date || new Date().toLocaleDateString('fr-FR'),
      submittedAmount: defaultTreatment?.cost || 15000,
      coveragePercent: firstPol.coveragePercentage,
      notes: '',
    });
    setIsSubmitClaimModalOpen(true);
  };

  const handleSaveClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPolicy = patientPolicies.find((p) => p.id === claimForm.policyId) || patientPolicies[0];
    if (!selectedPolicy) return;

    const submitted = Number(claimForm.submittedAmount) || 0;
    const rate = Number(claimForm.coveragePercent) || selectedPolicy.coveragePercentage;
    const approved = Math.round((submitted * rate) / 100);
    const copay = Math.max(0, submitted - approved);

    addInsuranceClaim({
      patientId: patient.id,
      patientName: patient.name,
      policyId: selectedPolicy.id,
      providerName: selectedPolicy.providerName,
      treatmentName: claimForm.treatmentName,
      toothNumber: claimForm.toothNumber ? Number(claimForm.toothNumber) : undefined,
      treatmentDate: claimForm.treatmentDate,
      submittedAmount: submitted,
      approvedAmount: approved,
      patientCopay: copay,
      status: 'En attente',
      notes: claimForm.notes,
    });

    setIsSubmitClaimModalOpen(false);
  };

  const getStatusBadge = (status: InsuranceClaim['status']) => {
    switch (status) {
      case 'Remboursé':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 inline-flex">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Remboursé
          </span>
        );
      case 'Approuvé':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-sky-100 text-sky-800 border border-sky-300 flex items-center gap-1 inline-flex">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> Accordé
          </span>
        );
      case 'Partiellement Approuvé':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 inline-flex">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Partiel
          </span>
        );
      case 'Rejeté':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1 inline-flex">
            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Refusé
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1 inline-flex">
            <Clock className="w-3.5 h-3.5 text-slate-500" /> En attente
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* TOP HEADER SUMMARY BAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Active Insurance Policies */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-2xl shadow-md border border-slate-700 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Couverture Assurance</span>
            <Shield className="w-5 h-5 text-sky-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black">{patientPolicies.length} Organisme(s)</div>
            <p className="text-[11px] text-slate-300 mt-0.5 truncate">
              {patientPolicies.length > 0
                ? patientPolicies.map((p) => p.providerName).join(', ')
                : 'Aucune mutuelle rattachée'}
            </p>
          </div>
          <button
            onClick={handleOpenAddPolicy}
            className="mt-3 w-full py-1.5 px-3 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Ajouter Mutuelle
          </button>
        </div>

        {/* Card 2: Annual Limit & Remaining DA */}
        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Plafond Annuel (DA)</span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-slate-900">
              {totalAnnualLimit > 0 ? `${totalAnnualLimit.toLocaleString('fr-FR')} DA` : 'Illimité'}
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Utilisé: {totalUsedCoverage.toLocaleString('fr-FR')} DA</span>
                <span className="font-bold text-slate-700">{coveragePercent}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all"
                  style={{ width: `${coveragePercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Submitted & Covered Total */}
        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Prise en Charge (Tiers-Payant)</span>
            <DollarSign className="w-5 h-5 text-sky-600" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-sky-700">
              {totalApprovedDA.toLocaleString('fr-FR')} DA
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Sur un total facturé de <strong className="text-slate-700">{totalSubmittedDA.toLocaleString('fr-FR')} DA</strong>
            </p>
          </div>
          <div className="mt-2 text-[10px] font-bold text-slate-400 bg-slate-50 p-1.5 rounded-lg border border-slate-100 text-center">
            Reste à charge patient: {totalPatientCopayDA.toLocaleString('fr-FR')} DA
          </div>
        </div>

        {/* Card 4: Action Quick Claim */}
        <div className="bg-gradient-to-br from-sky-600 to-sky-700 text-white p-4 rounded-2xl shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-100 uppercase tracking-wider">Demandes en Attente</span>
            <Clock className="w-5 h-5 text-amber-300" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-black text-white">{pendingClaimsCount}</div>
            <p className="text-[11px] text-sky-100 mt-0.5">Dossiers transmis en attente de réponse</p>
          </div>
          <button
            onClick={handleOpenSubmitClaim}
            className="mt-3 w-full py-2 px-3 bg-white text-sky-900 rounded-xl text-xs font-black shadow-sm hover:bg-sky-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Soumettre prise en charge
          </button>
        </div>
      </div>

      {/* SECTION 1: INSURANCE POLICIES LIST */}
      <div className="bg-white p-6 rounded-[28px] border border-sky-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-sky-600" />
              <span>Contrats d'Assurance & Mutuelles du Patient</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Informations sur les organismes de sécurité sociale et mutuelles privées partenaires
            </p>
          </div>

          <button
            onClick={handleOpenAddPolicy}
            className="px-4 py-2 text-xs font-black bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-sky-400" />
            <span>Nouveau Contrat</span>
          </button>
        </div>

        {patientPolicies.length === 0 ? (
          <div className="py-10 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-2">
            <Building className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-600">Aucun organisme d'assurance associé à ce patient</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Ajoutez la CNAS, CASNOS, ou une mutuelle privée pour calculer automatiquement la prise en charge des actes dentaires.
            </p>
            <button
              onClick={handleOpenAddPolicy}
              className="mt-2 px-4 py-2 bg-sky-600 text-white text-xs font-bold rounded-xl hover:bg-sky-700 transition-all cursor-pointer inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Ajouter Assurance
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patientPolicies.map((policy) => {
              const isExpired = new Date(policy.expirationDate) < new Date();

              return (
                <div
                  key={policy.id}
                  className={`p-5 rounded-2xl border transition-all space-y-3 relative ${
                    isExpired
                      ? 'bg-rose-50/40 border-rose-200'
                      : 'bg-slate-50/80 hover:bg-sky-50/30 border-slate-200/90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">{policy.providerName}</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                          {policy.type}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-700 font-mono">
                        N° Assuré: <span className="text-slate-900">{policy.policyNumber}</span>
                        {policy.groupNumber && <span className="text-slate-500 font-normal ml-2">({policy.groupNumber})</span>}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditPolicy(policy)}
                        className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          deleteInsurancePolicy(policy.id);
                          showToast('Police d\'assurance supprimée.', 'info');
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Coverage Details Grid */}
                  <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-slate-200/70 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Taux de Prise en Charge</span>
                      <p className="text-sm font-black text-emerald-600">{policy.coveragePercentage}%</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Plafond Annuel</span>
                      <p className="text-xs font-bold text-slate-800">
                        {policy.annualLimit > 0 ? `${policy.annualLimit.toLocaleString('fr-FR')} DA` : 'Illimité'}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Montant Consommé</span>
                      <p className="text-xs font-bold text-sky-700">
                        {policy.usedAmount.toLocaleString('fr-FR')} DA
                      </p>
                    </div>
                  </div>

                  {/* Date & Contact Footer */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> Valide jusqu'au:{' '}
                      <strong className={isExpired ? 'text-rose-600 font-black' : 'text-slate-800'}>
                        {policy.expirationDate}
                      </strong>
                    </span>

                    {policy.primaryContactPhone && (
                      <span className="flex items-center gap-1 text-slate-600 font-medium">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> {policy.primaryContactPhone}
                      </span>
                    )}
                  </div>

                  {policy.notes && (
                    <p className="text-[11px] text-slate-500 italic bg-slate-100/70 p-2 rounded-lg border border-slate-200/50">
                      * {policy.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: CLAIMS TRACKER & TIERS-PAYANT TABLE */}
      <div className="bg-white p-6 rounded-[28px] border border-sky-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-sky-600" />
              <span>Dossiers de Télé-transmission & Suivi Tiers-Payant</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Historique des demandes de remboursement et feuilles de soins soumises ({filteredClaims.length} dossier(s))
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Filter Chips */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              {['Tous', 'En attente', 'Approuvé', 'Remboursé', 'Rejeté'].map((status) => (
                <button
                  key={status}
                  onClick={() => setClaimStatusFilter(status)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    claimStatusFilter === status
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <button
              onClick={handleOpenSubmitClaim}
              className="px-4 py-2 text-xs font-black bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Dossier</span>
            </button>
          </div>
        </div>

        {/* Claims Table */}
        {filteredClaims.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-2">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-600">Aucune demande de prise en charge enregistrée</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Soumettez un dossier de tiers-payant pour suivre les remboursements de la sécurité sociale et des mutuelles.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-200 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">N° Référence</th>
                  <th className="p-3.5">Organisme Payeur</th>
                  <th className="p-3.5">Acte / Traitement</th>
                  <th className="p-3.5 text-right">Facturé (DA)</th>
                  <th className="p-3.5 text-right">Prise en Charge (DA)</th>
                  <th className="p-3.5 text-right">Reste Patient (DA)</th>
                  <th className="p-3.5 text-center">Statut</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 bg-white font-medium text-slate-700">
                {filteredClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-sky-50/40 transition-colors">
                    <td className="p-3.5 font-bold font-mono text-slate-900">
                      {claim.claimNumber}
                      <span className="block text-[10px] font-normal text-slate-400 font-sans">
                        Transmis le {claim.submissionDate}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="font-bold text-slate-900">{claim.providerName}</span>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">
                        {claim.treatmentName}
                        {claim.toothNumber && (
                          <span className="ml-1.5 px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-sky-800 font-bold">
                            Dent #{claim.toothNumber}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">Réalisé le {claim.treatmentDate}</span>
                    </td>

                    <td className="p-3.5 text-right font-bold text-slate-900">
                      {claim.submittedAmount.toLocaleString('fr-FR')} DA
                    </td>

                    <td className="p-3.5 text-right font-black text-emerald-600">
                      {claim.approvedAmount.toLocaleString('fr-FR')} DA
                    </td>

                    <td className="p-3.5 text-right font-bold text-slate-700">
                      {claim.patientCopay.toLocaleString('fr-FR')} DA
                    </td>

                    <td className="p-3.5 text-center">
                      {getStatusBadge(claim.status)}
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Status Change Selector */}
                        <select
                          value={claim.status}
                          onChange={(e) =>
                            updateInsuranceClaimStatus(claim.id, e.target.value as InsuranceClaim['status'])
                          }
                          className="px-2 py-1 text-[11px] font-bold bg-slate-100 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
                        >
                          <option value="En attente">En attente</option>
                          <option value="Approuvé">Accordé (Approuvé)</option>
                          <option value="Remboursé">Remboursé (Virement)</option>
                          <option value="Partiellement Approuvé">Accord Partiel</option>
                          <option value="Rejeté">Rejeté / Refusé</option>
                        </select>

                        {/* Print Receipt */}
                        <button
                          onClick={() => setViewingClaimReceipt(claim)}
                          className="p-1.5 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer border border-slate-200"
                          title="Imprimer Bordereau de Télétransmission"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Claim */}
                        <button
                          onClick={() => {
                            deleteInsuranceClaim(claim.id);
                            showToast('Prise en charge supprimée.', 'info');
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD / EDIT INSURANCE POLICY */}
      {isAddPolicyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {editingPolicy ? 'Modifier le Contrat d\'Assurance' : 'Ajouter un Contrat d\'Assurance / Mutuelle'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Patient: {patient.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddPolicyModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePolicy} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Organisme d'Assurance / Mutuelle *</label>
                <select
                  value={policyForm.providerName}
                  onChange={(e) => setPolicyForm({ ...policyForm, providerName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
                >
                  <option value="CNAS (Sécurité Sociale)">CNAS (Sécurité Sociale Algérienne)</option>
                  <option value="CASNOS (Non-Salariés)">CASNOS (Caisse Non-Salariés)</option>
                  <option value="AXA Assurances Santé">AXA Assurances Santé Algérie</option>
                  <option value="MAAF Santé">MAAF Santé / Mutuelle Pro</option>
                  <option value="CAAR Tiers-Payant">CAAR Assurances</option>
                  <option value="CIAR Assurances">CIAR Assurances</option>
                  <option value="CIGNA Global Dental">CIGNA Global Dental</option>
                  <option value="Autre Mutuelle Privée">Autre Mutuelle Privée / International</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">N° Assuré / Immatriculation *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: 16 78 90 12 34"
                    value={policyForm.policyNumber}
                    onChange={(e) => setPolicyForm({ ...policyForm, policyNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-medium focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">N° Contrat / Mutuelle</label>
                  <input
                    type="text"
                    placeholder="ex: GRP-8810"
                    value={policyForm.groupNumber}
                    onChange={(e) => setPolicyForm({ ...policyForm, groupNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Type de Couverture</label>
                  <select
                    value={policyForm.type}
                    onChange={(e) =>
                      setPolicyForm({ ...policyForm, type: e.target.value as InsurancePolicy['type'] })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
                  >
                    <option value="Principale (CNAS/CASNOS)">Principale (CNAS/CASNOS)</option>
                    <option value="Complémentaire / Mutuelle">Complémentaire / Mutuelle</option>
                    <option value="Assurance Privée">Assurance Privée</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Taux Prise en Charge (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={policyForm.coveragePercentage}
                    onChange={(e) => setPolicyForm({ ...policyForm, coveragePercentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-600 focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Plafond Annuel (DA)</label>
                  <input
                    type="number"
                    placeholder="0 pour illimité"
                    value={policyForm.annualLimit}
                    onChange={(e) => setPolicyForm({ ...policyForm, annualLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Téléphone Assistance</label>
                  <input
                    type="text"
                    placeholder="ex: +213 23 50 11 22"
                    value={policyForm.primaryContactPhone}
                    onChange={(e) => setPolicyForm({ ...policyForm, primaryContactPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Date d'Effet</label>
                  <input
                    type="date"
                    value={policyForm.startDate}
                    onChange={(e) => setPolicyForm({ ...policyForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Date d'Expiration</label>
                  <input
                    type="date"
                    value={policyForm.expirationDate}
                    onChange={(e) => setPolicyForm({ ...policyForm, expirationDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Notes & Conditions Spéciales</label>
                <textarea
                  rows={2}
                  value={policyForm.notes}
                  onChange={(e) => setPolicyForm({ ...policyForm, notes: e.target.value })}
                  placeholder="Remarques complémentaires sur la prise en charge..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddPolicyModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-md transition-all flex items-center gap-1"
                >
                  <Check className="w-4 h-4" /> Enregistrer Contrat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: SUBMIT NEW TIERS-PAYANT CLAIM */}
      {isSubmitClaimModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Nouveau Dossier de Prise en Charge / Tiers-Payant
                  </h3>
                  <p className="text-[11px] text-slate-500">Saisie d'une demande de remboursement pour {patient.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsSubmitClaimModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClaim} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Organisme d'Assurance Sélectionné *</label>
                <select
                  value={claimForm.policyId}
                  onChange={(e) => {
                    const pol = patientPolicies.find((p) => p.id === e.target.value);
                    setClaimForm({
                      ...claimForm,
                      policyId: e.target.value,
                      coveragePercent: pol ? pol.coveragePercentage : 80,
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
                >
                  {patientPolicies.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.providerName} ({p.type}) — Taux {p.coveragePercentage}%
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Désignation du Soin / Acte Dentaire *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Restauration composite / Pose de couronne"
                  value={claimForm.treatmentName}
                  onChange={(e) => setClaimForm({ ...claimForm, treatmentName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">N° Dent (Optionnel)</label>
                  <input
                    type="number"
                    placeholder="ex: 17, 26, 46..."
                    value={claimForm.toothNumber}
                    onChange={(e) => setClaimForm({ ...claimForm, toothNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Date d'Exécution</label>
                  <input
                    type="text"
                    value={claimForm.treatmentDate}
                    onChange={(e) => setClaimForm({ ...claimForm, treatmentDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Montant Facturé (DA) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={claimForm.submittedAmount}
                    onChange={(e) => setClaimForm({ ...claimForm, submittedAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900 focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Taux de Prise en Charge (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={claimForm.coveragePercent}
                    onChange={(e) => setClaimForm({ ...claimForm, coveragePercent: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-600 focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
                  />
                </div>
              </div>

              {/* Calculated Amounts Box */}
              <div className="p-3 bg-sky-50/80 rounded-2xl border border-sky-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500">Prise en charge estimée:</span>
                  <div className="text-sm font-black text-sky-800">
                    {Math.round((claimForm.submittedAmount * claimForm.coveragePercent) / 100).toLocaleString('fr-FR')} DA
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">Reste à charge patient:</span>
                  <div className="text-sm font-bold text-slate-800">
                    {Math.max(
                      0,
                      claimForm.submittedAmount - Math.round((claimForm.submittedAmount * claimForm.coveragePercent) / 100)
                    ).toLocaleString('fr-FR')} DA
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Notes / Informations Tiers-Payant</label>
                <textarea
                  rows={2}
                  value={claimForm.notes}
                  onChange={(e) => setClaimForm({ ...claimForm, notes: e.target.value })}
                  placeholder="Note complémentaire pour le centre d'immatriculation..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSubmitClaimModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all flex items-center gap-1"
                >
                  <Check className="w-4 h-4" /> Valider & Télé-transmettre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PRINTABLE TIERS-PAYANT RECEIPT */}
      {viewingClaimReceipt && (
        <ClaimReceiptModal
          claim={viewingClaimReceipt}
          patient={patient}
          onClose={() => setViewingClaimReceipt(null)}
        />
      )}
    </div>
  );
};
