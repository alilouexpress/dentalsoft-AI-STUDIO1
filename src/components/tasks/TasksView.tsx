import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckSquare, Plus, X, Check, Clock, AlertCircle } from 'lucide-react';

export const TasksView: React.FC = () => {
  const { tasks, addTask, toggleTaskStatus, staffMembers, t } = useApp();
  const [activeTab, setActiveTab] = useState<'Toutes' | 'En attente' | 'En cours' | 'Terminées'>('Toutes');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState(staffMembers[0]?.name || 'Sarah Mansouri');
  const [priority, setPriority] = useState<'Haute' | 'Moyenne' | 'Basse'>('Moyenne');
  const [dueDate, setDueDate] = useState('2026-07-26');
  const [description, setDescription] = useState('');

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === 'Toutes') return true;
    return task.status === activeTab;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    addTask({
      title,
      assignedTo,
      priority,
      dueDate,
      description,
    });

    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('tasks')}</h1>
          <p className="text-xs font-semibold text-slate-500">Gérer les tâches de l'équipe et du personnel.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md shadow-sky-500/20 hover:from-sky-600 hover:to-sky-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle tâche</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-2">
        {(['Toutes', 'En attente', 'En cours', 'Terminées'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden p-4">
        {filteredTasks.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-slate-100 rounded-2xl">
            <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">Aucune tâche trouvée</p>
            <p className="text-xs text-slate-400 mt-1">Créez votre première tâche pour votre équipe.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((t) => (
              <div
                key={t.id}
                className="p-4 bg-slate-50 hover:bg-sky-50/50 rounded-2xl border border-slate-200/80 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTaskStatus(t.id)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                      t.status === 'Terminée'
                        ? 'bg-emerald-500 border-emerald-600 text-white'
                        : 'bg-white border-slate-300 hover:border-sky-500'
                    }`}
                  >
                    {t.status === 'Terminée' && <Check className="w-4 h-4" />}
                  </button>

                  <div>
                    <h4
                      className={`text-xs font-extrabold text-slate-900 ${
                        t.status === 'Terminée' ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {t.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Assigné à: <span className="font-bold text-slate-700">{t.assignedTo}</span> • Échéance: {t.dueDate}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    t.priority === 'Haute'
                      ? 'bg-rose-100 text-rose-800'
                      : t.priority === 'Moyenne'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {t.priority}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Nouvelle tâche</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Titre de la tâche *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigné à</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30"
                  >
                    {staffMembers.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priorité</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30"
                  >
                    <option value="Haute">Haute</option>
                    <option value="Moyenne">Moyenne</option>
                    <option value="Basse">Basse</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date d'échéance</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:ring-2 focus:ring-sky-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/30"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-xl shadow-md shadow-sky-500/20 cursor-pointer transition-all"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
