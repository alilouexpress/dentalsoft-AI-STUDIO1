import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Send,
  AlertCircle,
  Clock,
  CheckCircle,
  User,
  Trash2,
  Bell,
  MessageSquare,
  HelpCircle,
  Megaphone,
} from 'lucide-react';

interface StaffMessagingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StaffMessagingDrawer: React.FC<StaffMessagingDrawerProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    staffMembers,
    staffMessages,
    addStaffMessage,
    clearStaffMessages,
    t,
  } = useApp();

  const [activeChannel, setActiveChannel] = useState<'general' | 'flow' | 'urgent'>('general');
  const [inputText, setInputText] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages list changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [staffMessages, activeChannel, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend = inputText, forceUrgent = isUrgent) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    addStaffMessage(trimmed, activeChannel, forceUrgent);
    
    // Reset state only if it was a manual send from input
    if (textToSend === inputText) {
      setInputText('');
      setIsUrgent(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Quick text suggestions for dental workflows
  const flowSuggestions = [
    { text: '🕒 Patient arrivé en salle d\'attente', channel: 'flow', label: 'Arrivée' },
    { text: '✅ Cabine libre & prête pour le prochain patient', channel: 'flow', label: 'Cabine Prête' },
    { text: '🧹 Nettoyage complet requis en Salle 1', channel: 'flow', label: 'Nettoyage 1' },
    { text: '🧹 Nettoyage complet requis en Salle 2', channel: 'flow', label: 'Nettoyage 2' },
    { text: '🚨 Aide requise d\'urgence en cabine de soin !', channel: 'urgent', isUrgent: true, label: 'Besoin d\'Aide 🚨' },
    { text: '📦 Commande d\'implants reçue au secrétariat', channel: 'general', label: 'Implants reçus' },
  ];

  const currentChannelMessages = staffMessages.filter(
    (msg) => msg.channelId === activeChannel
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside backdrop to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="w-[380px] sm:w-[420px] bg-white h-screen shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-sky-500 to-sky-600 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white/20 rounded-xl">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm tracking-tight">Messagerie Interne Clinique</h2>
              <p className="text-[10px] text-sky-100 font-medium">
                Actif en tant que : {currentUser.name} ({currentUser.role})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Channel Selection Tabs */}
        <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-100 p-1 gap-1">
          {(['general', 'flow', 'urgent'] as const).map((channel) => {
            const isSelected = activeChannel === channel;
            let label = '# Général';
            let iconColor = 'text-slate-400';
            
            if (channel === 'flow') {
              label = '# Flux Patients';
              iconColor = 'text-teal-500';
            } else if (channel === 'urgent') {
              label = '🚨 Urgent';
              iconColor = 'text-rose-500';
            }

            return (
              <button
                key={channel}
                onClick={() => setActiveChannel(channel)}
                className={`py-2 px-1 text-center rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/40'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${channel === 'urgent' ? 'bg-rose-500' : channel === 'flow' ? 'bg-teal-500' : 'bg-slate-400'}`}></span>
                {label}
              </button>
            );
          })}
        </div>

        {/* Message Thread container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scrollbar-thin">
          {currentChannelMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-2 text-slate-400 border border-slate-200/50">
                <HelpCircle className="w-5 h-5" />
              </div>
              <p className="font-bold text-xs text-slate-500">Aucun message pour l'instant</p>
              <p className="text-[10px] text-slate-400 max-w-xs mt-1">
                Utilisez cette messagerie instantanée pour coordonner la clinique en temps réel.
              </p>
            </div>
          ) : (
            currentChannelMessages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              
              // Define role backgrounds/badge styles
              let badgeStyle = 'bg-slate-100 text-slate-600';
              if (msg.senderRole === 'Admin') badgeStyle = 'bg-red-50 text-red-700 border-red-100';
              else if (msg.senderRole === 'Médecin') badgeStyle = 'bg-sky-50 text-sky-700 border-sky-100';
              else if (msg.senderRole === 'Réceptionniste') badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-100';
              else if (msg.senderRole === 'Assistant') badgeStyle = 'bg-amber-50 text-amber-700 border-amber-100';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold text-slate-700">{msg.senderName}</span>
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md border ${badgeStyle}`}>
                      {msg.senderRole}
                    </span>
                    <span className="text-[9px] text-slate-400">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-3 rounded-2xl text-xs font-semibold shadow-sm border ${
                      msg.isUrgent
                        ? 'bg-rose-50 border-rose-100 text-rose-950 ring-2 ring-rose-200/40'
                        : isMe
                        ? 'bg-sky-500 border-sky-600 text-white'
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    {msg.isUrgent && (
                      <div className="flex items-center gap-1 mb-1 text-rose-700 font-extrabold text-[10px]">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>URGENT / PRIORITAIRE</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
          <p className="text-[10px] font-extrabold uppercase text-slate-400 mb-1.5 tracking-wider flex items-center gap-1">
            <Megaphone className="w-3 h-3 text-sky-500" /> Actions de coordination rapides
          </p>
          <div className="flex flex-wrap gap-1.5">
            {flowSuggestions
              .filter((s) => s.channel === activeChannel || activeChannel === 'general')
              .map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(s.text, s.isUrgent)}
                  className="px-2 py-1 text-[10px] font-black rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-sky-50 hover:border-sky-300 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  {s.label}
                </button>
              ))}
          </div>
        </div>

        {/* Input Form */}
        <div className="p-3 border-t border-slate-100 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="w-4 h-4 rounded accent-rose-500 cursor-pointer"
              />
              <span className="text-[10px] font-bold text-slate-700 flex items-center gap-1">
                <AlertCircle className={`w-3.5 h-3.5 ${isUrgent ? 'text-rose-500' : 'text-slate-400'}`} />
                Marquer urgent (Notifie tout le monde)
              </span>
            </label>

            <button
              onClick={clearStaffMessages}
              className="ml-auto text-[10px] font-bold text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1"
              title="Vider l'historique de ce poste"
            >
              <Trash2 className="w-3 h-3" />
              <span>Effacer</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={
                isUrgent
                  ? 'Entrez votre message de détresse / d\'aide...'
                  : `Écrire dans #${activeChannel === 'general' ? 'général' : activeChannel === 'flow' ? 'flux-patients' : 'urgent'}...`
              }
              className={`flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 ${
                isUrgent ? 'focus:ring-rose-500/30 border-rose-200 focus:border-rose-500' : 'focus:ring-sky-500/30'
              }`}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className={`p-2.5 rounded-xl text-white shadow-md transition-all flex items-center justify-center shrink-0 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                isUrgent
                  ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'
                  : 'bg-sky-500 hover:bg-sky-600 shadow-sky-200'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
