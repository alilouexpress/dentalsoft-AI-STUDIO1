const fs = require('fs');
const path = 'src/components/workspace/Odontogram.tsx';
let content = fs.readFileSync(path, 'utf8');

// The new layout structure we want to apply to the render section of Odontogram.
// Let's replace the whole return statement of Odontogram.

const renderStart = content.indexOf('return (\n    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">');
if (renderStart === -1) {
    console.error('Could not find render start');
    process.exit(1);
}

const newRender = `return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Odontogramme</h3>
          <p className="text-xs text-slate-500">Vue globale des arcades dentaires</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-3 text-[10px] font-bold text-slate-500">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400"></div>Sain</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-400"></div>Carie</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-sky-400"></div>Obturé</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400"></div>Couronne</span>
          </div>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewType('adult')}
              className={\`px-3 py-1.5 text-xs font-bold rounded-lg transition-all \${
                viewType === 'adult'
                  ? 'bg-white text-sky-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }\`}
            >
              Dents Définitives
            </button>
            <button
              onClick={() => setViewType('primary')}
              className={\`px-3 py-1.5 text-xs font-bold rounded-lg transition-all \${
                viewType === 'primary'
                  ? 'bg-white text-sky-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }\`}
            >
              Dents Primaires
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm mb-6">
        <div className="text-xs font-bold text-slate-400 text-center mb-4 uppercase tracking-widest">
          Arcade Supérieure
        </div>
        
        <div 
          className="grid gap-1 mb-6" 
          style={{ gridTemplateColumns: \`repeat(\${upperRight.length + upperLeft.length}, minmax(0, 1fr))\` }}
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
        
        <div className="border-t border-slate-100 mb-6 mx-8"></div>
        
        <div 
          className="grid gap-1" 
          style={{ gridTemplateColumns: \`repeat(\${lowerRight.length + lowerLeft.length}, minmax(0, 1fr))\` }}
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

        <div className="text-xs font-bold text-slate-400 text-center mt-4 uppercase tracking-widest">
          Arcade Inférieure
        </div>
      </div>

      {/* Panel */}
      <div className="bg-slate-50 p-5 rounded-[24px] border border-slate-200">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-black text-slate-800">
                Dent FDI #{selectedToothId}
              </div>
              <span
                className={\`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase \${getStatusColor(
                  selectedTooth.status || 'sain'
                )}\`}
              >
                {selectedTooth.status || 'sain'}
              </span>
            </div>
            
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Statut
            </label>
            <select
              value={statusInput}
              onChange={(e) => setStatusInput(e.target.value as ToothStatus)}
              className="w-full py-2 px-3 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/30 text-slate-900 mb-4"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {(statusInput === 'carie' || statusInput === 'obture') && (
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Surfaces affectées
                </label>
                <div className="flex gap-1.5">
                  {(['M', 'O', 'D', 'B', 'L', 'V'] as ToothSurface[]).map((s) => {
                    const active = surfacesInput.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSurface(s)}
                        className={\`flex-1 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer \${
                          active
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }\`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Traitement associé
              </label>
              <select
                value={treatmentInput}
                onChange={(e) => setTreatmentInput(e.target.value)}
                className="w-full py-2 px-3 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/30 text-slate-900 mb-2"
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
              {onAddTreatmentClick && (
                <button
                  type="button"
                  onClick={() => onAddTreatmentClick(selectedToothId, treatmentInput)}
                  className="w-full py-2 px-3 text-[11px] font-black text-sky-600 bg-sky-100/50 hover:bg-sky-100 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer border border-sky-200/50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Planifier Soin</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Historique
            </label>
            <div className="flex-1 bg-white border border-slate-200 rounded-xl p-2 mb-4 overflow-y-auto max-h-[140px]">
              {!selectedTooth.history || selectedTooth.history.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic text-center mt-2">Aucune entrée pour cette dent</p>
              ) : (
                <div className="space-y-1.5">
                  {selectedTooth.history.map((h, i) => (
                    <div key={i} className="p-2 bg-slate-50 rounded-lg text-[11px] border border-slate-100">
                      <p className="font-bold text-slate-800">{h.action}</p>
                      <p className="text-slate-400 text-[10px]">{h.date} • {h.doctor}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={handleSaveTooth}
              className="w-full py-2.5 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 rounded-xl shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Enregistrer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};`;

content = content.substring(0, renderStart) + newRender;
fs.writeFileSync(path, content);
