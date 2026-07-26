const fs = require('fs');
const path = 'src/components/workspace/Odontogram.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('const [viewType, setViewType]')) {
  // Add state
  content = content.replace(
    'const [noteInput, setNoteInput] = useState<string>(\'\');',
    'const [noteInput, setNoteInput] = useState<string>(\'\');\n  const [viewType, setViewType] = useState<\'adult\' | \'primary\'>(\'adult\');'
  );

  // Update teeth arrays based on viewType
  const oldArrays = `
  // Upper Jaw (18 - 11 | 21 - 28)
  const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
  const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28];

  // Lower Jaw (48 - 41 | 31 - 38)
  const lowerRight = [48, 47, 46, 45, 44, 43, 42, 41];
  const lowerLeft = [31, 32, 33, 34, 35, 36, 37, 38];
`;

  const newArrays = `
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
`;
  content = content.replace(oldArrays.trim(), newArrays.trim());

  // Add Toggle UI
  const oldHeader = `<div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Odontogramme Complet</h3>
            <p className="text-xs text-slate-500">Vue globale des arcades dentaires</p>
          </div>
        </div>`;

  const newHeader = `<div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Odontogramme</h3>
            <p className="text-xs text-slate-500">Vue globale des arcades dentaires</p>
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
        </div>`;
  content = content.replace(oldHeader, newHeader);
  fs.writeFileSync(path, content);
}
