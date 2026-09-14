import React, { useState, useMemo } from 'react';
import type { Player, Session, RPELog, Language, Position } from '../types';
import { Users, Lock, Unlock, KeyRound, CalendarPlus } from 'lucide-react';

// (Users icon used in empty-state UI)
import { translations } from '../i18n/translations';
import { CheckCircle2, Clock, Zap, ChevronRight, Moon, Flame, Battery, ShieldAlert, Sparkles, X, Plus, Minus, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface KioskViewProps {
  players: Player[];
  sessions: Session[];
  logs: RPELog[];
  onSaveLog: (log: RPELog) => void;
  onAddSession?: (session: Session) => void;
  lang: Language;
}

const BORG_SCALE = [
  { score: 0, emoji: '😴', color: 'bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-500 shadow-emerald-950/30' },
  { score: 1, emoji: '🚶', color: 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-emerald-950/30' },
  { score: 2, emoji: '🏃', color: 'bg-emerald-500 hover:bg-emerald-400 text-white border-emerald-300 shadow-emerald-950/30' },
  { score: 3, emoji: '⚽', color: 'bg-yellow-600 hover:bg-yellow-500 text-white border-yellow-400 shadow-yellow-950/30' },
  { score: 4, emoji: '💧', color: 'bg-yellow-500 hover:bg-yellow-400 text-slate-900 border-yellow-300 shadow-yellow-950/30' },
  { score: 5, emoji: '🔥', color: 'bg-orange-600 hover:bg-orange-500 text-white border-orange-400 shadow-orange-950/30' },
  { score: 6, emoji: '🥵', color: 'bg-orange-500 hover:bg-orange-400 text-white border-orange-300 shadow-orange-950/30' },
  { score: 7, emoji: '💥', color: 'bg-red-600 hover:bg-red-500 text-white border-red-400 shadow-red-950/30' },
  { score: 8, emoji: '🌋', color: 'bg-red-700 hover:bg-red-600 text-white border-red-500 shadow-red-950/30' },
  { score: 9, emoji: '⚡', color: 'bg-purple-700 hover:bg-purple-600 text-white border-purple-500 shadow-purple-950/30' },
  { score: 10, emoji: '☠️', color: 'bg-purple-900 hover:bg-purple-800 text-white border-purple-400 shadow-purple-950/30' }
];

export const KioskView: React.FC<KioskViewProps> = ({
  players,
  sessions,
  logs,
  onSaveLog,
  onAddSession,
  lang
}) => {
  const t = translations[lang];

  // Selected session (defaults to most recent session)
  const [selectedSessionId, setSelectedSessionId] = useState<string>(sessions[0]?.id || '');
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'logged'>('all');
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);

  // Kiosk Mode: Coach Express vs Secured PIN Mode
  const [entryMode, setEntryMode] = useState<'coach' | 'pin'>('coach');
  const [pinModalPlayer, setPinModalPlayer] = useState<Player | null>(null);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);

  // Modal form states
  const [selectedRpe, setSelectedRpe] = useState<number>(5);
  const [actualDuration, setActualDuration] = useState<number>(75);
  const [showHooper, setShowHooper] = useState<boolean>(false);
  const [sleepScore, setSleepScore] = useState<number>(2);
  const [sorenessScore, setSorenessScore] = useState<number>(2);
  const [fatigueScore, setFatigueScore] = useState<number>(2);
  const [stressScore, setStressScore] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');

  // Haptic feedback helper for tactile pitch experience
  const triggerHaptic = (pattern: number | number[] = 15) => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {
      // Ignore
    }
  };

  const currentSession = sessions.find(s => s.id === selectedSessionId) || sessions[0];

  // Check if today already has a registered session
  const todayDateStr = new Date().toISOString().split('T')[0];
  const hasTodaySession = sessions.some(s => s.date === todayDateStr);

  const handleCreateTodaySession = () => {
    if (!onAddSession) return;
    const newSess: Session = {
      id: `sess_${Date.now()}`,
      teamId: 'team_dz_u17_01',
      date: todayDateStr,
      type: 'tactical',
      microcycleDay: 'MD-2',
      plannedDuration: 75,
      title: `Séance terrain du ${todayDateStr}`,
      targetRpe: 6,
      location: 'Stade Municipal',
      isCompleted: false
    };
    onAddSession(newSess);
    setSelectedSessionId(newSess.id);
    triggerHaptic([25, 40, 25]);
  };

  // Logs for current session
  const sessionLogs = logs.filter(l => l.sessionId === currentSession?.id);
  const loggedPlayerIds = new Set(sessionLogs.map(l => l.playerId));

  // Sort players strictly by Jersey Number
  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => a.jerseyNumber - b.jerseyNumber);
  }, [players]);

  const totalPlayers = sortedPlayers.filter(p => p.isActive).length;
  const loggedCount = sortedPlayers.filter(p => p.isActive && loggedPlayerIds.has(p.id)).length;
  const progressPercent = totalPlayers > 0 ? Math.round((loggedCount / totalPlayers) * 100) : 0;

  const openLogModal = (player: Player) => {
    setActivePlayer(player);
    const existingLog = sessionLogs.find(l => l.playerId === player.id);
    if (existingLog) {
      setSelectedRpe(existingLog.rpeScore);
      setActualDuration(existingLog.actualDuration);
      if (existingLog.hooper) {
        setSleepScore(existingLog.hooper.sleep);
        setSorenessScore(existingLog.hooper.soreness);
        setFatigueScore(existingLog.hooper.fatigue);
        setStressScore(existingLog.hooper.stress);
        setShowHooper(true);
      }
      setNotes(existingLog.comments || '');
    } else {
      setSelectedRpe(currentSession?.targetRpe || 5);
      setActualDuration(currentSession?.plannedDuration || 75);
      setSleepScore(2);
      setSorenessScore(2);
      setFatigueScore(2);
      setStressScore(1);
      setShowHooper(false);
      setNotes('');
    }
  };

  const handlePlayerCardClick = (player: Player) => {
    triggerHaptic(12);
    if (entryMode === 'pin') {
      setPinModalPlayer(player);
      setEnteredPin('');
      setPinError(false);
    } else {
      openLogModal(player);
    }
  };

  const handlePinInput = (digit: string) => {
    triggerHaptic(10);
    const nextPin = enteredPin + digit;
    if (nextPin.length <= 4) {
      setEnteredPin(nextPin);
      setPinError(false);

      if (nextPin.length === 4) {
        if (pinModalPlayer && nextPin === pinModalPlayer.pin) {
          triggerHaptic([20, 40, 20]);
          const target = pinModalPlayer;
          setPinModalPlayer(null);
          setEnteredPin('');
          openLogModal(target);
        } else {
          triggerHaptic([60, 40, 60]);
          setPinError(true);
        }
      }
    }
  };

  const handlePinBackspace = () => {
    triggerHaptic(10);
    setEnteredPin(prev => prev.slice(0, -1));
    setPinError(false);
  };

  const handleSave = (andNext = false) => {
    if (!activePlayer || !currentSession) return;

    triggerHaptic([20, 30, 20]);

    const newLog: RPELog = {
      id: `log_${currentSession.id}_${activePlayer.id}`,
      sessionId: currentSession.id,
      playerId: activePlayer.id,
      rpeScore: selectedRpe,
      actualDuration,
      sessionLoad: selectedRpe * actualDuration,
      hooper: {
        sleep: sleepScore,
        soreness: sorenessScore,
        fatigue: fatigueScore,
        stress: stressScore
      },
      comments: notes.trim() || undefined,
      timestamp: new Date().toISOString()
    };

    onSaveLog(newLog);

    // Confetti effect
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#006233', '#10b981', '#ffffff', '#d21034']
      });
    } catch {
      // ignore
    }

    if (andNext) {
      // Find next unlogged player in jersey number order
      const pendingPlayers = sortedPlayers.filter(p => p.isActive && !loggedPlayerIds.has(p.id) && p.id !== activePlayer.id);
      if (pendingPlayers.length > 0) {
        if (entryMode === 'pin') {
          setActivePlayer(null);
          setPinModalPlayer(pendingPlayers[0]);
          setEnteredPin('');
          setPinError(false);
        } else {
          openLogModal(pendingPlayers[0]);
        }
      } else {
        setActivePlayer(null);
      }
    } else {
      setActivePlayer(null);
    }
  };

  const filteredPlayers = sortedPlayers.filter(player => {
    if (!player.isActive) return false;
    const isLogged = loggedPlayerIds.has(player.id);
    if (filterMode === 'pending') return !isLogged;
    if (filterMode === 'logged') return isLogged;
    return true;
  });

  const getBorgText = (score: number) => {
    const key = `rpe${score}` as keyof typeof t;
    return (t[key] as string) || `RPE ${score}`;
  };

  const getPositionBadge = (pos: Position) => {
    switch (pos) {
      case 'GK':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'DF':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'MF':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'FW':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-6 pb-24">
      
      {/* Session Header Card */}
      <div className="glass-card rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 relative overflow-hidden">
        
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm">
                {currentSession?.microcycleDay || 'MD'}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {currentSession?.date}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-semibold border border-slate-700/60">
                {currentSession?.type ? t[currentSession.type as keyof typeof t] : ''}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {currentSession?.title || t.kioskMode}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-300 pt-1">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <span>⏱️</span>
                <span>{currentSession?.plannedDuration} {t.minutes}</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5 text-amber-300 font-medium">
                <span>🎯</span>
                <span>RPE Cible : {currentSession?.targetRpe || 5}/10</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span>📍</span>
                <span>{currentSession?.location}</span>
              </span>
            </div>
          </div>

          {/* Controls: Mode Switcher & Session Switcher */}
          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
            {/* Mode Switcher: Coach Direct vs Borne PIN */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Mode de Saisie</label>
              <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700/80">
                <button
                  type="button"
                  onClick={() => {
                    setEntryMode('coach');
                    triggerHaptic(10);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    entryMode === 'coach'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Saisie directe 1-clic par l'entraîneur"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Coach (Direct)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEntryMode('pin');
                    triggerHaptic(10);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    entryMode === 'pin'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Chaque joueur saisit son code PIN secret"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Borne (PIN)</span>
                </button>
              </div>
            </div>

            {/* Session Switcher Dropdown */}
            <div className="flex flex-col space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t.selectSession}</label>
                {onAddSession && (
                  <button
                    type="button"
                    onClick={handleCreateTodaySession}
                    className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                    title="Créer rapidement la séance du jour"
                  >
                    <CalendarPlus className="w-3 h-3" />
                    <span>+ Aujourd'hui</span>
                  </button>
                )}
              </div>
              <select
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
                className="bg-slate-800/90 border border-slate-700 hover:border-slate-600 text-white text-xs sm:text-sm rounded-xl px-4 py-2.5 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-lg cursor-pointer"
              >
                {sessions.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.date} — {s.title} ({s.microcycleDay})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Banner if no session today */}
        {!hasTodaySession && onAddSession && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-medium">
              <CalendarPlus className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Aucune séance enregistrée pour aujourd'hui ({todayDateStr}). Prêt pour l'entraînement ?</span>
            </div>
            <button
              type="button"
              onClick={handleCreateTodaySession}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shrink-0 shadow transition-all touch-press"
            >
              + Démarrer séance
            </button>
          </div>
        )}

        {/* Progress Bar & Quick Filters */}
        <div className="mt-6 pt-5 border-t border-slate-800/90 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Progress Bar */}
          <div className="w-full md:w-1/2 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-300">
                {loggedCount} {t.loggedCount} {totalPlayers} ({progressPercent}%)
              </span>
              <span className={progressPercent === 100 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                {progressPercent === 100 ? '✓ Terminé' : `${totalPlayers - loggedCount} restants`}
              </span>
            </div>
            <div className="w-full bg-slate-800/90 rounded-full h-3 overflow-hidden border border-slate-700/60 p-0.5 shadow-inner">
              <div
                className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 shadow-lg shadow-emerald-900/50"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700/80 self-stretch md:self-auto justify-center shadow-md">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                filterMode === 'all'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-750'
              }`}
            >
              Tous ({totalPlayers})
            </button>
            <button
              onClick={() => setFilterMode('pending')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                filterMode === 'pending'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-750'
              }`}
            >
              {t.pending} ({totalPlayers - loggedCount})
            </button>
            <button
              onClick={() => setFilterMode('logged')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                filterMode === 'logged'
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-750'
              }`}
            >
              {t.alreadyLogged} ({loggedCount})
            </button>
          </div>

        </div>
      </div>

      {/* Grid of Players or Empty State */}
      {players.length === 0 ? (
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/[0.08] text-center max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-slate-400">
            <Users className="w-7 h-7 text-emerald-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Aucun joueur dans l'effectif</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Ajoutez vos joueurs dans l'onglet "Effectif" ou chargez l'équipe démo dans l'onglet "Rapports & Données".
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredPlayers.map(player => {
            const isLogged = loggedPlayerIds.has(player.id);
            const playerLog = sessionLogs.find(l => l.playerId === player.id);

            return (
              <div
                key={player.id}
                onClick={() => handlePlayerCardClick(player)}
                className={`touch-press group relative cursor-pointer rounded-2xl p-4 transition-all duration-200 border text-center flex flex-col justify-between select-none ${
                  isLogged
                    ? 'bg-slate-900/90 border-emerald-500/40 hover:border-emerald-400 shadow-md shadow-emerald-950/20'
                    : 'bg-slate-800/80 border-slate-700/80 hover:border-emerald-500/60 hover:bg-slate-800 shadow-lg'
                }`}
              >
                {/* Header: Jersey + Position */}
                <div className="flex items-center justify-between mb-2">
                  <span className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-700/80 flex items-center justify-center font-black text-xs text-emerald-400 shadow-inner">
                    #{player.jerseyNumber}
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border ${getPositionBadge(player.position)}`}>
                    {player.position}
                  </span>
                </div>

                {/* Player Initials Avatar */}
                <div className="my-2 flex justify-center">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg border-2 transition-transform group-hover:scale-105 shadow-md ${
                    isLogged
                      ? 'bg-gradient-to-tr from-emerald-900/80 to-emerald-700/50 text-emerald-200 border-emerald-500/60 shadow-emerald-950/40'
                      : 'bg-gradient-to-tr from-slate-800 to-slate-700 text-white border-slate-600'
                  }`}>
                    {player.firstName[0]}{player.lastName[0]}
                  </div>
                </div>

                {/* Names */}
                <div className="space-y-0.5 my-1">
                  <h3 className="font-black text-sm text-white truncate">{player.lastName}</h3>
                  <p className="text-xs text-slate-400 font-medium truncate">{player.firstName}</p>
                </div>

                {/* Status Footer */}
                <div className="mt-3 pt-2.5 border-t border-slate-800">
                  {isLogged ? (
                    <div className="flex items-center justify-center space-x-1.5 rtl:space-x-reverse text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate">RPE {playerLog?.rpeScore} ({playerLog?.sessionLoad} UA)</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse text-amber-400 text-xs font-semibold">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{t.toLog}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RPE & Wellness Modal */}
      {activePlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 flex items-center justify-center font-black text-white text-lg shadow-lg">
                  <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-emerald-400">
                    #{activePlayer.jerseyNumber}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">
                    {activePlayer.firstName} {activePlayer.lastName}
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    {activePlayer.position} • {currentSession?.title} ({currentSession?.date})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActivePlayer(null)}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Borg CR-10 Exertion Scale Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  <span>{t.rpeScaleTitle} (Borg CR-10)</span>
                </label>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {getBorgText(selectedRpe)}
                </span>
              </div>

              {/* Borg Visual Buttons 0 to 10 */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {BORG_SCALE.map(item => {
                  const isSelected = selectedRpe === item.score;
                  return (
                    <button
                      key={item.score}
                      type="button"
                      onClick={() => {
                        setSelectedRpe(item.score);
                        triggerHaptic(12);
                      }}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center space-y-1 text-center touch-press ${
                        isSelected
                          ? `${item.color} ring-4 ring-emerald-500/40 scale-105 font-black shadow-xl`
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-750'
                      }`}
                    >
                      <span className="text-xl sm:text-2xl">{item.emoji}</span>
                      <span className="text-lg font-black">{item.score}</span>
                      <span className="text-[10px] leading-tight font-medium opacity-90 line-clamp-1">
                        {getBorgText(item.score).split('/')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Duration & Calculated Session Load */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              
              {/* Duration Adjuster */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.durationMin} ({t.minutes})</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActualDuration(prev => Math.max(10, prev - 5));
                      triggerHaptic(10);
                    }}
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center border border-slate-700 touch-press"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={actualDuration}
                    onChange={(e) => setActualDuration(Number(e.target.value))}
                    className="w-20 text-center bg-slate-900 border border-slate-700 text-white font-black text-base rounded-xl py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setActualDuration(prev => prev + 5);
                      triggerHaptic(10);
                    }}
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center border border-slate-700 touch-press"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Presets Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[90, 75, 60, 45, 30, 15].map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setActualDuration(preset);
                        triggerHaptic(10);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border touch-press ${
                        actualDuration === preset
                          ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50 shadow-sm'
                          : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {preset}'
                    </button>
                  ))}
                </div>
              </div>

              {/* Real-time Session Load Display */}
              <div className="flex flex-col justify-center items-center sm:items-end space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {t.sessionLoad} (Foster sRPE)
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 flex items-baseline gap-1">
                  <span>{selectedRpe * actualDuration}</span>
                  <span className="text-xs text-slate-400 font-bold">{t.auUnits}</span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {selectedRpe} (RPE) × {actualDuration} min
                </span>
              </div>

            </div>

            {/* Optional Hooper Wellness Survey */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setShowHooper(!showHooper)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 transition-all text-xs font-bold text-slate-200"
              >
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>{t.hooperTitle}</span>
                </div>
                <span className="text-xs text-emerald-400 font-semibold">
                  {showHooper ? '▲ Masquer' : '▼ Noter le bien-être (Optionnel)'}
                </span>
              </button>

              {showHooper && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 animate-fade-in">
                  
                  {/* Sleep */}
                  <div className="space-y-1.5 text-center">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center justify-center gap-1">
                      <Moon className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{t.sleepQuality}</span>
                    </label>
                    <select
                      value={sleepScore}
                      onChange={(e) => setSleepScore(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl p-2 font-semibold text-center focus:outline-none"
                    >
                      <option value={1}>1 - Très bon</option>
                      <option value={2}>2 - Bon</option>
                      <option value={3}>3 - Moyen</option>
                      <option value={4}>4 - Mauvais</option>
                      <option value={5}>5 - Insomnie</option>
                    </select>
                  </div>

                  {/* Soreness */}
                  <div className="space-y-1.5 text-center">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center justify-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-rose-400" />
                      <span>{t.muscleSoreness}</span>
                    </label>
                    <select
                      value={sorenessScore}
                      onChange={(e) => setSorenessScore(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl p-2 font-semibold text-center focus:outline-none"
                    >
                      <option value={1}>1 - Aucune</option>
                      <option value={2}>2 - Légères</option>
                      <option value={3}>3 - Modérées</option>
                      <option value={4}>4 - Fortes</option>
                      <option value={5}>5 - Très douloureux</option>
                    </select>
                  </div>

                  {/* Fatigue */}
                  <div className="space-y-1.5 text-center">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center justify-center gap-1">
                      <Battery className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t.fatigueLevel}</span>
                    </label>
                    <select
                      value={fatigueScore}
                      onChange={(e) => setFatigueScore(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl p-2 font-semibold text-center focus:outline-none"
                    >
                      <option value={1}>1 - En forme</option>
                      <option value={2}>2 - Normale</option>
                      <option value={3}>3 - Légère fatigue</option>
                      <option value={4}>4 - Épuisé</option>
                      <option value={5}>5 - HS</option>
                    </select>
                  </div>

                  {/* Stress */}
                  <div className="space-y-1.5 text-center">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center justify-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-teal-400" />
                      <span>{t.stressLevel}</span>
                    </label>
                    <select
                      value={stressScore}
                      onChange={(e) => setStressScore(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl p-2 font-semibold text-center focus:outline-none"
                    >
                      <option value={1}>1 - Très détendu</option>
                      <option value={2}>2 - Calme</option>
                      <option value={3}>3 - Moyen</option>
                      <option value={4}>4 - Stressé</option>
                      <option value={5}>5 - Très anxieux</option>
                    </select>
                  </div>

                </div>
              )}
            </div>

            {/* Optional Coach/Player Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400">{t.optionalNotes}</label>
              <input
                type="text"
                placeholder="Ex: Douleur cheville droite, fatigue après le voyage..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleSave(false)}
                className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all border border-slate-700 flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>{t.saveLog}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSave(true)}
                className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm transition-all shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2"
              >
                <span>{t.nextPlayer}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* PIN Verification Keypad Modal (Mode Borne Sécurisée) */}
      {pinModalPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5 text-center">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center font-black text-xs text-emerald-400">
                  #{pinModalPlayer.jerseyNumber}
                </span>
                <span className="text-sm font-black text-white">{pinModalPlayer.firstName} {pinModalPlayer.lastName}</span>
              </div>
              <button
                onClick={() => setPinModalPlayer(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Code PIN Joueur</h3>
              <p className="text-xs text-slate-400">Entrez votre code secret à 4 chiffres</p>
            </div>

            {/* 4 PIN Dots */}
            <div className="flex justify-center items-center gap-3 py-2">
              {[0, 1, 2, 3].map(i => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full transition-all ${
                    enteredPin.length > i
                      ? 'bg-emerald-400 scale-110 shadow-lg shadow-emerald-500/50'
                      : 'bg-slate-800 border-2 border-slate-700'
                  }`}
                />
              ))}
            </div>

            {pinError && (
              <p className="text-xs font-bold text-rose-400 animate-pulse">
                Code PIN incorrect (Code démo : {pinModalPlayer.pin})
              </p>
            )}

            {/* 0-9 Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto pt-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handlePinInput(digit.toString())}
                  className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-lg border border-slate-700/80 transition-all touch-press"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(10);
                  const target = pinModalPlayer;
                  setPinModalPlayer(null);
                  openLogModal(target);
                }}
                className="h-12 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white font-bold text-[10px] border border-slate-700/60 flex items-center justify-center"
                title="Déverrouiller sans code (Coach)"
              >
                Coach
              </button>
              <button
                key={0}
                type="button"
                onClick={() => handlePinInput('0')}
                className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-lg border border-slate-700/80 transition-all touch-press"
              >
                0
              </button>
              <button
                type="button"
                onClick={handlePinBackspace}
                className="h-12 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white font-bold text-sm border border-slate-700/60 flex items-center justify-center touch-press"
              >
                ⌫
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
