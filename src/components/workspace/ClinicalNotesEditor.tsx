import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ClinicalNote } from '../../types';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  AlertTriangle,
  CheckSquare,
  Sparkles,
  Save,
  Printer,
  Copy,
  Clock,
  Plus,
  Search,
  Trash2,
  Lock,
  Unlock,
  Tag,
  Stethoscope,
  ChevronDown,
  Check,
  FileText,
  RotateCcw,
  Eye,
  Edit3,
  Calendar,
  User,
  Info,
  Zap,
} from 'lucide-react';

interface ClinicalNotesEditorProps {
  patientId: string;
}

export const ClinicalNotesEditor: React.FC<ClinicalNotesEditorProps> = ({ patientId }) => {
  const {
    patients,
    clinicalNotes,
    addClinicalNote,
    updateClinicalNote,
    deleteClinicalNote,
    staffMembers,
    t,
  } = useApp();

  const patient = patients.find((p) => p.id === patientId);
  const patientNotes = clinicalNotes.filter((n) => n.patientId === patientId);

  // Active Session Timer
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Form State for Active Clinical Note
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState('Consultation Clinique');
  const [doctorName, setDoctorName] = useState('Dr. Amrani Samir');
  const [category, setCategory] = useState<ClinicalNote['category']>('Consultation');
  const [content, setContent] = useState('');
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([]);
  const [tags, setTags] = useState<string[]>(['Soin']);
  const [tagInput, setTagInput] = useState('');

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [copiedToast, setCopiedToast] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);

  // Sync content with contenteditable when editing note changes
  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  // Handle rich text formatting commands
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  // Quick insertion helpers
  const insertHTMLAtCursor = (html: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertHTML', false, html);
      setContent(editorRef.current.innerHTML);
    } else {
      setContent((prev) => prev + html);
    }
  };

  const handleToothTagToggle = (toothNum: number) => {
    if (selectedTeeth.includes(toothNum)) {
      setSelectedTeeth(selectedTeeth.filter((t) => t !== toothNum));
    } else {
      setSelectedTeeth([...selectedTeeth, toothNum]);
      // Also insert a badge in note text
      insertHTMLAtCursor(
        `<span style="background-color: #e0f2fe; color: #0369a1; font-weight: bold; padding: 2px 6px; border-radius: 6px; border: 1px solid #bae6fd; font-size: 11px; margin: 0 2px;">#Dent ${toothNum}</span> `
      );
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Clinical Template Loaders
  const applyTemplate = (templateType: string) => {
    let templateHTML = '';
    let newTitle = title;
    let newCategory: ClinicalNote['category'] = category;

    switch (templateType) {
      case 'SOAP':
        newTitle = 'Note de Consultation SOAP';
        newCategory = 'Consultation';
        templateHTML = `
          <h3 style="color: #0369a1; border-bottom: 2px solid #e0f2fe; padding-bottom: 4px; margin-top: 8px;"><strong>S - Subjectif (Plaintes & Symptômes)</strong></h3>
          <p>Le/La patient(e) consulte pour: <em>[Décrire la douleur, intensité EVA 0-10, durée, facteurs déclenchants]</em>.</p>

          <h3 style="color: #0369a1; border-bottom: 2px solid #e0f2fe; padding-bottom: 4px; margin-top: 12px;"><strong>O - Objectif (Examen Clinique & Radiologique)</strong></h3>
          <ul>
            <li><strong>Examen visuel endo-buccal:</strong> <em>[Inspection gencive, carie, hygiène]</em></li>
            <li><strong>Tests cliniques:</strong> Percussion <em>[Positifs / Négatifs]</em>, Palpation vestibulaire <em>[R.A.S.]</em>, Test de vitalité pulpaire <em>[Positif / Négatif]</em>.</li>
            <li><strong>Examen radiologique:</strong> <em>[Secteur dentaire, hauteur osseuse, zone périapicale]</em>.</li>
          </ul>

          <h3 style="color: #0369a1; border-bottom: 2px solid #e0f2fe; padding-bottom: 4px; margin-top: 12px;"><strong>A - Appréciation (Diagnostic Clinique)</strong></h3>
          <div style="background-color: #f0f9ff; border-left: 4px solid #0284c7; padding: 10px; margin: 8px 0; border-radius: 0 8px 8px 0;">
            <strong>Diagnostic principal:</strong> <em>[e.g. Pulpite aiguë irréversible sur dent #...]</em>
          </div>

          <h3 style="color: #0369a1; border-bottom: 2px solid #e0f2fe; padding-bottom: 4px; margin-top: 12px;"><strong>P - Plan de Traitement & Recommandations</strong></h3>
          <ol>
            <li>Traitement proposé et consentement éclairé obtenu.</li>
            <li>Procédure réalisée ce jour: <em>[Soin, Anesthésie, Obturation]</em>.</li>
            <li>Ordonnance délivrée: <em>[Antalgiques / Antibiothérapie si nécessaire]</em>.</li>
            <li>Rendez-vous de contrôle programmé.</li>
          </ol>
        `;
        break;

      case 'ENDO':
        newTitle = 'Traitement Canalaire (Endodontie)';
        newCategory = 'Procédure';
        templateHTML = `
          <h3 style="color: #0f766e;"><strong>Protocole Endodontique</strong></h3>
          <p><strong>Dents concernées:</strong> <em>[Taguer les dents]</em></p>
          <ul>
            <li><strong>Anesthésie:</strong> Locorégionale / Infiltration (Articaïne 1/200 000).</li>
            <li><strong>Isolation:</strong> Pose de digue étanche.</li>
            <li><strong>Ouverture de chambre & Cavité d'accès:</strong> Réalisée sous spray aqueux.</li>
            <li><strong>Localisation des canaux:</strong> <em>[Mesio-buccal, Disto-buccal, Palatin]</em>.</li>
            <li><strong>Mise en forme canalaire:</strong> Limes rotatives NiTi jusqu'au diamètre <em>[#25 / #30]</em>.</li>
            <li><strong>Irrigation:</strong> Hypochlorite de sodium 2.5% + EDTA 17%.</li>
            <li><strong>Obturation canalaire:</strong> Gutta-percha thermomécanique + Ciment de scellement.</li>
          </ul>
        `;
        break;

      case 'SURGERY':
        newTitle = 'Compte-Rendu d\'Extraction / Chirurgie';
        newCategory = 'Procédure';
        templateHTML = `
          <h3 style="color: #be123c;"><strong>Acte Chirurgical / Avulsion Dentaire</strong></h3>
          <ul>
            <li><strong>Infiltration anesthésique:</strong> Articaïne + Adrénaline.</li>
            <li><strong>Syndesmotomie & Luxation:</strong> Réalisée avec élévateur droit sans incident.</li>
            <li><strong>Avulsion:</strong> Extraction complète de la dent et révision de l'alvéole.</li>
            <li><strong>Hémostase:</strong> Curetage alvéolaire + Compresse hémostatique résorbable + Suture au fil 4-0.</li>
            <li><strong>Consignes:</strong> Conseils oraux et fiche de recommandation remise au patient.</li>
          </ul>
        `;
        break;

      case 'POST_OP':
        newTitle = 'Consignes Post-Opératoires';
        newCategory = 'Suivi Post-Op';
        templateHTML = `
          <div style="background-color: #fefce8; border: 1px solid #fef08a; padding: 12px; border-radius: 12px; color: #713f12;">
            <h4 style="margin-top:0; color: #854d0e;"><strong>Recommandations d'Hygiène & Soins:</strong></h4>
            <ul>
              <li>Mordre sur la compresse pendant 30 minutes après le départ du cabinet.</li>
              <li>Ne pas cracher ni rincer la bouche pendant les premières 24 heures.</li>
              <li>Appliquer une poche de glace sur la joue (15 min/heure) pour réduire l'œdème.</li>
              <li>Éviter les boissons chaudes, l'alcool, le tabac et les aliments durs pendant 48h.</li>
              <li>Prendre les médicaments antalgiques prescrits en respectant les doses.</li>
            </ul>
          </div>
        `;
        break;

      default:
        break;
    }

    setTitle(newTitle);
    setCategory(newCategory);
    setContent(templateHTML);
    if (editorRef.current) {
      editorRef.current.innerHTML = templateHTML;
    }
  };

  // Save current note
  const handleSaveNote = () => {
    if (!content.trim() && !title.trim()) return;

    const currentFormattedDate = new Date().toLocaleDateString('fr-FR');
    const currentFormattedTime = new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (editingNoteId) {
      updateClinicalNote(editingNoteId, {
        title: title || 'Note Clinique',
        doctorName,
        category,
        content,
        taggedTeeth: selectedTeeth,
        tags,
        date: currentFormattedDate,
        time: currentFormattedTime,
      });
    } else {
      addClinicalNote({
        patientId,
        doctorName,
        date: currentFormattedDate,
        time: currentFormattedTime,
        title: title || 'Note Clinique',
        category,
        content,
        taggedTeeth: selectedTeeth,
        tags,
      });
    }

    const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    setLastSavedTime(now);

    // Reset editor for next
    setTimeout(() => {
      setEditingNoteId(null);
    }, 300);
  };

  const handleStartNewNote = () => {
    setEditingNoteId(null);
    setTitle('Consultation Clinique');
    setContent('');
    setSelectedTeeth([]);
    setTags(['Soin']);
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }
  };

  const handleEditExistingNote = (note: ClinicalNote) => {
    setEditingNoteId(note.id);
    setTitle(note.title);
    setDoctorName(note.doctorName);
    setCategory(note.category);
    setContent(note.content);
    setSelectedTeeth(note.taggedTeeth || []);
    setTags(note.tags || []);
    if (editorRef.current) {
      editorRef.current.innerHTML = note.content;
    }
    setActiveTab('write');
  };

  const handleCopyFormattedText = () => {
    if (!editorRef.current) return;
    const plainText = editorRef.current.innerText;
    navigator.clipboard.writeText(plainText);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  // Filter notes history
  const filteredNotes = patientNotes.filter((n) => {
    const matchesSearch =
      !searchQuery ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const availableTeethList = [
    18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28, 48, 47, 46, 45, 44, 43, 42,
    41, 31, 32, 33, 34, 35, 36, 37, 38,
  ];

  return (
    <div className="space-y-6">
      {/* Toast Confirmation */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Note copiée dans le presse-papier !</span>
        </div>
      )}

      {/* Main Active Consultation Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white rounded-[28px] p-6 shadow-xl border border-sky-800/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-[11px] flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                SESSION CONSULTATION ACTIVE
              </span>
              <span className="text-xs text-sky-300 font-semibold">
                Patient: <strong className="text-white font-bold">{patient?.name}</strong> ({patient?.code})
              </span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2 pt-1">
              <Stethoscope className="w-5 h-5 text-sky-400" />
              <span>Notes Cliniques & Observations Médicales</span>
            </h2>
          </div>

          {/* Session Timer & Quick Actions */}
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-sky-200 font-bold uppercase">Durée Consultation</p>
                <p className="text-sm font-black tracking-widest text-white font-mono">
                  {formatTimer(sessionSeconds)}
                </p>
              </div>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="ml-1 p-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors cursor-pointer"
                title={isTimerRunning ? 'Mettre en pause' : 'Reprendre'}
              >
                {isTimerRunning ? 'Pause' : 'Reprendre'}
              </button>
            </div>

            <button
              onClick={handleStartNewNote}
              className="px-3.5 py-2.5 text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white rounded-2xl shadow-lg shadow-sky-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvelle Note</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor & History Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Rich Text Editor (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-[28px] border border-sky-100 shadow-sm overflow-hidden flex flex-col">
            {/* Header: Title, Doctor, Category */}
            <div className="p-5 bg-slate-50/80 border-b border-slate-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Titre de la note clinique..."
                    className="w-full text-base font-black text-slate-900 bg-transparent border-b-2 border-transparent hover:border-slate-200 focus:border-sky-500 focus:outline-none transition-colors pb-0.5"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="py-1.5 px-3 text-xs font-bold bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/30 text-slate-800 cursor-pointer"
                  >
                    <option value="Consultation">Consultation</option>
                    <option value="Bilan Initial">Bilan Initial</option>
                    <option value="Diagnostic">Diagnostic</option>
                    <option value="Urgence">Urgence</option>
                    <option value="Suivi Post-Op">Suivi Post-Op</option>
                    <option value="Procédure">Procédure</option>
                  </select>

                  <select
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="py-1.5 px-3 text-xs font-bold bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/30 text-slate-800 cursor-pointer"
                  >
                    {staffMembers
                      .filter((s) => s.role === 'Médecin' || s.role === 'Admin')
                      .map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Quick Template Snippets Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> Modèles:
                </span>

                <button
                  onClick={() => applyTemplate('SOAP')}
                  className="px-2.5 py-1 text-[11px] font-bold bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-lg border border-sky-200 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-sky-600" />
                  <span>Note SOAP</span>
                </button>

                <button
                  onClick={() => applyTemplate('ENDO')}
                  className="px-2.5 py-1 text-[11px] font-bold bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg border border-teal-200 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <span>Endodontie</span>
                </button>

                <button
                  onClick={() => applyTemplate('SURGERY')}
                  className="px-2.5 py-1 text-[11px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg border border-rose-200 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <span>Chirurgie / Extraction</span>
                </button>

                <button
                  onClick={() => applyTemplate('POST_OP')}
                  className="px-2.5 py-1 text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg border border-amber-200 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <span>Post-Opératoire</span>
                </button>
              </div>

              {/* Tooth Tagging Selector Pills */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
                  <span>Dents Associées à l'observation:</span>
                  <span className="text-[10px] text-slate-400">
                    Cliquer pour marquer la dent dans la note
                  </span>
                </p>
                <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
                  {availableTeethList.map((toothNum) => {
                    const isSelected = selectedTeeth.includes(toothNum);
                    return (
                      <button
                        key={toothNum}
                        onClick={() => handleToothTagToggle(toothNum)}
                        className={`w-7 h-7 rounded-lg text-[11px] font-black shrink-0 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-sky-600 text-white ring-2 ring-sky-300 scale-105 shadow-sm'
                            : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                        }`}
                        title={`Taguer Dent #${toothNum}`}
                      >
                        {toothNum}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* WYSIWYG Toolbar */}
            <div className="p-2.5 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between flex-wrap gap-1">
              <div className="flex items-center gap-1 flex-wrap">
                {/* View/Edit Switch */}
                <div className="bg-white p-0.5 rounded-lg border border-slate-200 flex items-center mr-2">
                  <button
                    onClick={() => setActiveTab('write')}
                    className={`px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                      activeTab === 'write' ? 'bg-sky-500 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Edit3 className="w-3 h-3" /> Éditeur
                  </button>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                      activeTab === 'preview' ? 'bg-sky-500 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Eye className="w-3 h-3" /> Aperçu
                  </button>
                </div>

                {/* Text Styles */}
                <button
                  onClick={() => executeCommand('bold')}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Gras (Ctrl+B)"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => executeCommand('italic')}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Italique (Ctrl+I)"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => executeCommand('underline')}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Souligné (Ctrl+U)"
                >
                  <Underline className="w-4 h-4" />
                </button>
                <button
                  onClick={() => executeCommand('strikeThrough')}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Barré"
                >
                  <Strikethrough className="w-4 h-4" />
                </button>

                <div className="h-4 w-px bg-slate-300 mx-1"></div>

                {/* Headings */}
                <button
                  onClick={() => executeCommand('formatBlock', '<h3>')}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Titre 1"
                >
                  <Heading1 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => executeCommand('formatBlock', '<h4>')}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Titre 2"
                >
                  <Heading2 className="w-4 h-4" />
                </button>

                <div className="h-4 w-px bg-slate-300 mx-1"></div>

                {/* Lists */}
                <button
                  onClick={() => executeCommand('insertUnorderedList')}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Liste à puces"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => executeCommand('insertOrderedList')}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Liste numérotée"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>

                <div className="h-4 w-px bg-slate-300 mx-1"></div>

                {/* Clinical Callout Inserts */}
                <button
                  onClick={() =>
                    insertHTMLAtCursor(
                      `<div style="background-color: #fef2f2; border-left: 4px solid #ef4444; color: #991b1b; padding: 10px; margin: 8px 0; border-radius: 0 8px 8px 0; font-weight: bold;">⚠️ Alerte / Risque Médical: </div>`
                    )
                  }
                  className="px-2 py-1 text-[11px] font-bold bg-rose-100 text-rose-800 rounded-lg hover:bg-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Insérer encadré Alerte"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Alerte</span>
                </button>

                <button
                  onClick={() =>
                    insertHTMLAtCursor(
                      `<div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; color: #166534; padding: 10px; margin: 8px 0; border-radius: 0 8px 8px 0; font-weight: bold;">✅ Soin Réalisé: </div>`
                    )
                  }
                  className="px-2 py-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Insérer encadré Soin Réalisé"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Soin Validé</span>
                </button>
              </div>

              {/* Utility actions: Copy & Print */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopyFormattedText}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Copier le texte"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  onClick={() => window.print()}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Imprimer la note"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Rich Editor Content Area */}
            {activeTab === 'write' ? (
              <div
                ref={editorRef}
                contentEditable
                onInput={(e) => setContent(e.currentTarget.innerHTML)}
                className="p-5 min-h-[320px] max-h-[500px] overflow-y-auto focus:outline-none text-sm text-slate-800 leading-relaxed custom-scrollbar font-sans"
                data-placeholder="Rédigez ici vos observations cliniques, l'examen buccal, le diagnostic et le plan de traitement..."
              />
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: content || '<p class="text-slate-400 italic">Note vide.</p>' }}
                className="p-5 min-h-[320px] max-h-[500px] overflow-y-auto bg-slate-50 text-sm text-slate-800 leading-relaxed custom-scrollbar prose max-w-none"
              />
            )}

            {/* Tags & Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3">
              {/* Tags Input */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-bold text-slate-500 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-sky-600" /> Tags:
                </span>
                {tags.map((tg) => (
                  <span
                    key={tg}
                    className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold text-[11px] flex items-center gap-1 border border-sky-200"
                  >
                    <span>{tg}</span>
                    <button
                      onClick={() => handleRemoveTag(tg)}
                      className="hover:text-rose-600 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="+ Ajouter tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="px-2 py-0.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none w-24 font-medium"
                  />
                  <button
                    onClick={handleAddTag}
                    className="p-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md transition-colors cursor-pointer text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Submit & Save Button Row */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  {lastSavedTime && (
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Dernière sauvegarde: {lastSavedTime}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {editingNoteId && (
                    <button
                      onClick={handleStartNewNote}
                      className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                    >
                      Annuler modification
                    </button>
                  )}

                  <button
                    onClick={handleSaveNote}
                    className="px-5 py-2.5 text-xs font-black text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 rounded-xl shadow-md shadow-sky-500/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>
                      {editingNoteId ? 'Mettre à Jour la Note' : 'Enregistrer la Note Clinique'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Historical Clinical Notes Timeline (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-[28px] border border-sky-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-600" />
                <span>Historique des Notes ({patientNotes.length})</span>
              </h3>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher dans l'historique..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 font-medium"
              />
            </div>

            {/* Notes List */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
              {filteredNotes.length === 0 ? (
                <div className="p-8 text-center text-slate-400 italic text-xs border-2 border-dashed border-slate-100 rounded-2xl">
                  Aucune note clinique enregistrée.
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className={`p-4 rounded-2xl border transition-all space-y-2 ${
                      editingNoteId === note.id
                        ? 'bg-sky-50/90 border-sky-300 ring-2 ring-sky-400/40'
                        : 'bg-slate-50/80 border-slate-200/80 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold text-[10px] uppercase">
                          {note.category}
                        </span>
                        <h4 className="text-xs font-black text-slate-900 mt-1">{note.title}</h4>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditExistingNote(note)}
                          className="p-1 text-slate-500 hover:text-sky-600 rounded hover:bg-slate-200 transition-colors cursor-pointer"
                          title="Modifier"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => deleteClinicalNote(note.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-200 transition-colors cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Meta Date & Doctor */}
                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 pt-0.5">
                      <span>{note.date} à {note.time}</span>
                      <span className="text-slate-600 font-bold">{note.doctorName}</span>
                    </div>

                    {/* Tagged teeth */}
                    {note.taggedTeeth && note.taggedTeeth.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-[10px] font-bold text-slate-400">Dents:</span>
                        {note.taggedTeeth.map((tNum) => (
                          <span
                            key={tNum}
                            className="px-1.5 py-0.2 rounded bg-sky-200/70 text-sky-900 font-extrabold text-[10px]"
                          >
                            #{tNum}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Content Snippet */}
                    <div
                      dangerouslySetInnerHTML={{ __html: note.content }}
                      className="text-[11px] text-slate-600 line-clamp-3 bg-white p-2.5 rounded-xl border border-slate-100 italic"
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
