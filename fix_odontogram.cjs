const fs = require('fs');
const path = 'src/components/workspace/Odontogram.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldState = "const [noteInput, setNoteInput] = useState<string>('');\n  const [viewType, setViewType] = useState<'adult' | 'primary'>('adult');";
const newState = "const [noteInput, setNoteInput] = useState<string>('');";
content = content.replace(oldState, newState);

const oldInit = "const { teethData, updateToothData } = useApp();\n  const [selectedToothId, setSelectedToothId] = useState<number>(17); // Tooth 17 default";
const newInit = "const { teethData, updateToothData } = useApp();\n  const [viewType, setViewType] = useState<'adult' | 'primary'>('adult');\n  const [selectedToothId, setSelectedToothId] = useState<number>(17); // Tooth 17 default";
content = content.replace(oldInit, newInit);

fs.writeFileSync(path, content);
