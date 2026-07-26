const fs = require('fs');
const path = 'src/components/workspace/Odontogram.tsx';
let content = fs.readFileSync(path, 'utf8');

const renderStart = content.indexOf('return (\n    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">');
if (renderStart === -1) {
    console.error('Could not find render start');
    process.exit(1);
}

const newRender = `return (
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

      <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm">
        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-bold text-slate-500 mb-6 bg-slate-50 py-2 px-4 rounded-full border border-slate-100 w-fit mx-auto">
          {statusOptions.map((opt) => (
            <div key={opt.value} className="flex items-center gap-1.5">
              <span className={\`w-2 h-2 rounded-full \${opt.colorClass}\`}></span>
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
        </div>

        <div className="border-t border-slate-100 mb-4 mx-8"></div>

        {/* Arcade Inférieure */}
        <div className="flex justify-center mb-3">
          <div 
            className="grid gap-0" 
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
                className={\`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase \${getStatusColor(
                  selectedTooth.status || 'sain'
                )}\`}
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
                        className={\`flex-1 py-1 text-[11px] font-black rounded-lg transition-all cursor-pointer \${
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
};`;

content = content.substring(0, renderStart) + newRender;
fs.writeFileSync(path, content);
