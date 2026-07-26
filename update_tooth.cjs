const fs = require('fs');
const path = 'src/components/workspace/Odontogram.tsx';
let content = fs.readFileSync(path, 'utf8');

const realToothDef = `
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
    <div className={\`relative w-8 h-[55px] transition-all duration-300 flex items-center justify-center cursor-pointer select-none group outline-none \${
      isSelected 
        ? 'scale-125 z-30 filter drop-shadow-[0_8px_10px_rgba(56,189,248,0.5)]' 
        : 'hover:scale-110 hover:z-20 filter hover:drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]'
    } \${!isUpper ? 'rotate-180' : ''}\`}
    >
      {isSelected && (
        <div className="absolute -inset-1 rounded-xl bg-sky-500/20 animate-pulse border-2 border-sky-400" />
      )}
      <svg viewBox="0 0 100 150" className="w-full h-full overflow-visible">
        <path d={rootPath} className={\`\${colors.root} \${colors.stroke}\`} strokeWidth="4" strokeLinejoin="round" />
        <path d={crownPath} className={\`\${colors.crown} \${colors.stroke}\`} strokeWidth="4" strokeLinejoin="round" />
      </svg>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-1.5" onClick={onClick}>
      {isUpper ? (
        <>
          {toothSvg}
          <span className={\`text-[10px] font-black \${isSelected ? 'text-sky-600' : 'text-slate-400'}\`}>{id}</span>
        </>
      ) : (
        <>
          <span className={\`text-[10px] font-black \${isSelected ? 'text-sky-600' : 'text-slate-400'}\`}>{id}</span>
          {toothSvg}
        </>
      )}
    </div>
  );
};
`;

const cubeToothRegex = /interface CubeToothProps {[\s\S]*?export const Odontogram/m;
content = content.replace(cubeToothRegex, realToothDef + '\nexport const Odontogram');
content = content.replace(/<CubeTooth/g, '<RealTooth');

fs.writeFileSync(path, content);
