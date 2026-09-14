import React, { useState } from 'react';
import type { Session, RPELog, Language, SessionType, MicrocycleDay, Player } from '../types';
import { translations } from '../i18n/translations';
import { Calendar, Plus, Clock, Target, MapPin, CheckCircle2, ChevronRight, X, Trash2 } from 'lucide-react';

interface SessionsViewProps {
  sessions: Session[];
  logs: RPELog[];
  players: Player[];
  onAddSession: (session: Session) => void;
  onDeleteSession: (sessionId: string) => void;
  onOpenKioskSession: (sessionId: string) => void;
  lang: Language;
}

export const SessionsView: React.FC<SessionsViewProps> = ({
  sessions,
  logs,
  players,
  onAddSession,
  onDeleteSession,
  onOpenKioskSession,
  lang
}) => {
  const t = translations[lang];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<SessionType>('tactical');
  const [microcycleDay, setMicrocycleDay] = useState<MicrocycleDay>('MD-2');
  const [plannedDuration, setPlannedDuration] = useState<number>(75);
  const [targetRpe, setTargetRpe] = useState<number>(6);
  const [location, setLocation] = useState('Stade Municipal El Bayadh');
  const [notes, setNotes] = useState('');

  const activePlayersCount = players.filter(p => p.isActive).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSession: Session = {
      id: `sess_${Date.now()}`,
      teamId: 'team_dz_u17_01',
      date,
      type,
      microcycleDay,
      plannedDuration,
      title: title.trim() || `${t[type as keyof typeof t]} (${microcycleDay})`,
      targetRpe,
      location,
      notes: notes.trim() || undefined,
      isCompleted: false
    };

    onAddSession(newSession);
    setIsModalOpen(false);
    setTitle('');
  };

  const getMicrocycleColor = (day: MicrocycleDay) => {
    switch (day) {
      case 'MD': return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'MD-1': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      case 'MD-2': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'MD-3': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'MD-4': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'MD+1': return 'bg-teal-500/20 text-teal-400 border-teal-500/40';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-emerald-400" />
            <span>{t.sessions}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Gestion du microcycle, programmation des séances et des matchs U17
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-900/30 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.createSession}</span>
        </button>
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        {sessions.map(session => {
          const sessLogs = logs.filter(l => l.sessionId === session.id);
          const loggedCount = sessLogs.length;
          const avgRpe = loggedCount > 0 ? (sessLogs.reduce((sum, l) => sum + l.rpeScore, 0) / loggedCount).toFixed(1) : '-';
          const totalLoad = sessLogs.reduce((sum, l) => sum + (l.sessionLoad || (l.rpeScore * l.actualDuration)), 0);

          return (
            <div
              key={session.id}
              className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 bg-slate-900/70 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-black uppercase tracking-wider border ${getMicrocycleColor(session.microcycleDay)}`}>
                    {session.microcycleDay}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {session.date}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                    {t[session.type as keyof typeof t]}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white">
                  {session.title}
                </h3>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{session.plannedDuration} min</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-slate-500" />
                    <span>RPE Cible : {session.targetRpe || 5}/10</span>
                  </span>
                  {session.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{session.location}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                
                {/* Stats Pill */}
                <div className="text-right">
                  <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-bold text-white">
                    <CheckCircle2 className={`w-4 h-4 ${loggedCount === activePlayersCount ? 'text-emerald-400' : 'text-amber-400'}`} />
                    <span>{loggedCount} / {activePlayersCount} notés</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Moy RPE: <strong className="text-emerald-400">{avgRpe}</strong> • Total: <strong className="text-white">{totalLoad} UA</strong>
                  </p>
                </div>

                {/* Open in Kiosk Mode Button */}
                <button
                  onClick={() => onOpenKioskSession(session.id)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-400 border border-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Saisir RPE</span>
                  <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => onDeleteSession(session.id)}
                  title="Supprimer la séance"
                  className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-rose-600/30 text-slate-500 hover:text-rose-400 flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Session Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 my-auto max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <span>{t.createSession}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Titre de la séance</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Jeu réduit & Vitesse de réaction"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder:text-slate-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">{t.sessionDate}</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">{t.microcycleDay}</label>
                  <select
                    value={microcycleDay}
                    onChange={(e) => setMicrocycleDay(e.target.value as MicrocycleDay)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="MD">MD (Jour de Match)</option>
                    <option value="MD+1">MD+1 (Récupération / Décrassage)</option>
                    <option value="MD-4">MD-4 (Force / Prévention)</option>
                    <option value="MD-3">MD-3 (Endurance & Charge Max)</option>
                    <option value="MD-2">MD-2 (Vitesse & Tactique)</option>
                    <option value="MD-1">MD-1 (Activation & Stratégie)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">{t.sessionType}</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as SessionType)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="tactical">{t.tactical}</option>
                    <option value="physical">{t.physical}</option>
                    <option value="match">{t.match}</option>
                    <option value="recovery">{t.recovery}</option>
                    <option value="gym">{t.gym}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">{t.plannedDuration}</label>
                  <input
                    type="number"
                    value={plannedDuration}
                    onChange={(e) => setPlannedDuration(parseInt(e.target.value))}
                    min="15"
                    max="180"
                    step="5"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">{t.targetRpe}</label>
                  <input
                    type="number"
                    value={targetRpe}
                    onChange={(e) => setTargetRpe(parseInt(e.target.value))}
                    min="1"
                    max="10"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">{t.location}</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">{t.notes}</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Objectifs tactiques et consignes pour le staff..."
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder:text-slate-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 transition-all"
                >
                  {t.saveSession}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
