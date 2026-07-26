import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient } from '../../types';
import {
  Users,
  UserPlus,
  Search,
  MoreVertical,
  ChevronRight,
  X,
  CreditCard,
  UserCheck,
  UserX,
  FileText,
  Trash2,
  Edit,
  Eye,
} from 'lucide-react';

export const PatientsView: React.FC = () => {
  const { patients, addPatient, deletePatient, openPatientWorkspace, openPatientSummary, openQuickAddPatient, t } = useApp();
  const [filterTab, setFilterTab] = useState<'Tous' | 'Actifs' | 'En traitement' | 'Inactifs'>('Tous');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New patient state
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [birthDate, setBirthDate] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [insuranceName, setInsuranceName] = useState('');
  const [insuranceNumber, setInsuranceNumber] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newP = addPatient({
      name,
      age,
      gender,
      phone: phone || '(555) 123-4567',
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      address: address || '123 Main St, City',
      bloodGroup,
      birthDate,
      nationalId,
      emergencyContact,
      emergencyPhone,
      insuranceName,
      insuranceNumber,
      notes,
    });

    setIsModalOpen(false);
    resetForm();
    openPatientWorkspace(newP.id);
  };

  const resetForm = () => {
    setName('');
    setAge(30);
    setPhone('');
    setEmail('');
    setAddress('');
    setNotes('');
  };

  const filteredPatients = patients.filter((p) => {
    const matchesTab =
      filterTab === 'Tous'
        ? true
        : filterTab === 'Actifs'
        ? p.status === 'Active'
        : filterTab === 'En traitement'
        ? p.status === 'En traitement'
        : p.status === 'Inactif';

    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search);

    return matchesTab && matchesSearch;
  });

  const totalPatients = patients.length;
  const activeCount = patients.filter((p) => p.status === 'Active').length;
  const inTreatmentCount = patients.filter((p) => p.status === 'En traitement').length;
  const totalBalance = patients.reduce((acc, p) => acc + p.balance, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('patients')}</h1>
          <p className="text-xs font-semibold text-slate-500">Gérer les dossiers des patients.</p>
        </div>

        <button
          onClick={openQuickAddPatient}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t('add_patient')}</span>
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-[28px] border border-sky-100 border-b-4 border-b-sky-500 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">TOTAL</p>
            <p className="text-xl font-black text-slate-900">{totalPatients}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-[28px] border border-sky-100 border-b-4 border-b-emerald-500 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">ACTIFS</p>
            <p className="text-xl font-black text-slate-900">{activeCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-[28px] border border-sky-100 border-b-4 border-b-amber-500 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <UserX className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">EN TRAITEMENT</p>
            <p className="text-xl font-black text-slate-900">{inTreatmentCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-[28px] border border-sky-100 border-b-4 border-b-sky-700 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">SOLDE TOTAL</p>
            <p className="text-xl font-black text-slate-900">{totalBalance.toFixed(2)} DA</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-[28px] border border-sky-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:right-3 rtl:left-auto" />
          <input
            type="text"
            placeholder="Rechercher un patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 rtl:pr-9 rtl:pl-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 font-medium"
          />
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80 w-full sm:w-auto justify-center">
          {(['Tous', 'Actifs', 'En traitement', 'Inactifs'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                filterTab === tab
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-[28px] border border-sky-100 shadow-sm overflow-hidden">
        {filteredPatients.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">Aucun patient trouvé</p>
            <p className="text-xs text-slate-400 mt-1">
              Ajustez vos filtres ou ajoutez votre premier patient.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">NOM</th>
                  <th className="p-4">DÉTAILS</th>
                  <th className="p-4">DERNIÈRE VISITE</th>
                  <th className="p-4">STATUT</th>
                  <th className="p-4">SOLDE</th>
                  <th className="p-4 text-right rtl:text-left">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredPatients.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => openPatientWorkspace(p.id)}
                    className="hover:bg-sky-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="p-4 font-bold text-slate-500">{p.code}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-sky-700 text-white font-black text-xs flex items-center justify-center shadow-sm">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-slate-400">{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      {p.age} ans • {p.gender}
                    </td>
                    <td className="p-4 text-slate-600">{p.lastVisit}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          p.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'En traitement'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-900">
                      {p.balance.toFixed(2)} DA
                    </td>
                    <td className="p-4 text-right rtl:text-left" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openPatientSummary(p.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 border border-sky-200/80"
                          title="Aperçu rapide du résumé patient"
                        >
                          <Eye className="w-3.5 h-3.5 text-sky-600" />
                          <span>Résumé</span>
                        </button>
                        <button
                          onClick={() => openPatientWorkspace(p.id)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                          title="Ouvrir le dossier clinique complet"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deletePatient(p.id)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                          title="Supprimer patient"
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

      {/* Modal: Ajouter un patient */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="text-base font-black text-slate-900">{t('add_patient')}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/30 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Âge *</label>
                    <input
                      type="number"
                      required
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/30 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sexe *</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                      className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/30 font-semibold"
                    >
                      <option value="Male">Homme</option>
                      <option value="Female">Femme</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/30 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@email.com"
                    className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/30 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Adresse</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, City"
                  className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/30 font-medium"
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-3">
                  Informations Médicales & Assurance
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Date de naissance
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/30 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Groupe sanguin
                    </label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/30 font-medium"
                    >
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Assurance
                    </label>
                    <input
                      type="text"
                      placeholder="Nom de l'assurance (ex: CNAS)"
                      value={insuranceName}
                      onChange={(e) => setInsuranceName(e.target.value)}
                      className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/30 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      N° d'assurance
                    </label>
                    <input
                      type="text"
                      placeholder="N° de police"
                      value={insuranceNumber}
                      onChange={(e) => setInsuranceNumber(e.target.value)}
                      className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/30 font-medium"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Notes sur le patient</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Allergies, traitement médical en cours..."
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/30 font-medium"
                  ></textarea>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 rounded-xl shadow-md shadow-sky-500/20 transition-all cursor-pointer"
                >
                  Enregistrer le patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
