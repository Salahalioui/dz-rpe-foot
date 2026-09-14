import React, { useState } from 'react';
import type { Player, Session, RPELog, Language } from '../types';
import { translations } from '../i18n/translations';
import { CheckCircle2, Clock, Zap, ChevronRight, Moon, Flame, Battery, ShieldAlert, Sparkles, X, Plus, Minus, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface KioskViewProps {
  players: Player[];
  sessions: Session[];
  logs: RPELog[];
  onSaveLog: (log: RPELog) => void;
  lang: Language;
}

const BORG_SCALE = [
  { score: 0, emoji: '😴', color: 'bg-emerald-700/80 hover:bg-emerald-600 text-white border-emerald-500' },
  { score: 1, emoji: '🚶', color: 'bg-emerald-600/80 hover:bg-emerald-500 text-white border-emerald-400' },
  { score: 2, emoji: '🏃', color: 'bg-emerald-500/80 hover:bg-emerald-400 text-white border-emerald-300' },
  { score: 3, emoji: '⚽', color: 'bg-yellow-600/80 hover:bg-yellow-500 text-white border-yellow-400' },
  { score: 4, emoji: '💧', color: 'bg-yellow-500/80 hover:bg-yellow-400 text-white border-yellow-300' },
  { score: 5, emoji: '🔥', color: 'bg-orange-600/80 hover:bg-orange-500 text-white border-orange-400' },
  { score: 6, emoji: '🥵', color: 'bg-orange-500/80 hover:bg-orange-400 text-white border-orange-300' },
  { score: 7, emoji: '💥', color: 'bg-red-600/80 hover:bg-red-500 text-white border-red-400' },
  { score: 8, emoji: '🌋', color: 'bg-red-700/80 hover:bg-red-600 text-white border-red-500' },
  { score: 9, emoji: '⚡', color: 'bg-purple-700/80 hover:bg-purple-600 text-white border-purple-500' },
  { score: 10, emoji: '☠️', color: 'bg-purple-900/90 hover:bg-purple-800 text-white border-purple-400' }
];

export const KioskView: React.FC<KioskViewProps> = ({
  players,
  sessions,
  logs,
  onSaveLog,
  lang
}) => {
  const t = translations[lang];

  // Selected session (defaults to most recent session)
  const [selectedSessionId, setSelectedSessionId] = useState<string>(sessions[0]?.id || '');
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'logged'>('all');
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);

  // Modal form states
  const [selectedRpe, setSelectedRpe] = useState<number>(5);
  const [actualDuration, setActualDuration] = useState<number>(75);
  const [showHooper, setShowHooper] = useState<boolean>(false);
  const [sleepScore, setSleepScore] = useState<number>(2);
  const [sorenessScore, setSorenessScore] = useState<number>(2);
  const [fatigueScore, setFatigueScore] = useState<number>(2);
  const [stressScore, setStressScore] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');

  const currentSession = sessions.find(s => s.id === selectedSessionId) || sessions[0];

  // Logs for current session
  const sessionLogs = logs.filter(l => l.sessionId === currentSession?.id);
  const loggedPlayerIds = new Set(sessionLogs.map(l => l.playerId));

  const totalPlayers = players.filter(p => p.isActive).length;
  const loggedCount = players.filter(p => p.isActive && loggedPlayerIds.has(p.id)).length;
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

  const handleSave = (andNext = false) => {
    if (!activePlayer || !currentSession) return;

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
    } catch (e) {
      // ignore in tests
    }

    if (andNext) {
      // Find next unlogged player
      const activeList = players.filter(p => p.isActive);
      const currentIndex = activeList.findIndex(p => p.id === activePlayer.id);
      const remainingUnlogged = activeList.filter((p, idx) => idx > currentIndex && !loggedPlayerIds.has(p.id) && p.id !== activePlayer.id);
      
      if (remainingUnlogged.length > 0) {
        openLogModal(remainingUnlogged[0]);
      } else {
        const anyUnlogged = activeList.find(p => !loggedPlayerIds.has(p.id) && p.id !== activePlayer.id);
        if (anyUnlogged) {
          openLogModal(anyUnlogged);
        } else {
          setActivePlayer(null);
        }
      }
    } else {
      setActivePlayer(null);
    }
  };

  const filteredPlayers = players.filter(player => {
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

  return (
    <div className="space-y-6 pb-20">
      
      {/* Session Header Card */}
      <div className="glass-card rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="px-2.5 py-1 text-xs font-black uppercase tracking-wider rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {currentSession?.microcycleDay || 'MD'}
              </span>
              <span className="text-xs text-slate-400">
                {currentSession?.date}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                {currentSession?.type ? t[currentSession.type as keyof typeof t] : ''}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {currentSession?.title || t.kioskMode}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-2">
              <span>⏱️ {currentSession?.plannedDuration} {t.minutes}</span>
              <span>•</span>
              <span>🎯 RPE Cible: {currentSession?.targetRpe || 5}/10</span>
              <span>•</span>
              <span>📍 {currentSession?.location}</span>
            </p>
          </div>

          {/* Session Switcher Dropdown */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <label className="text-xs text-slate-400 mb-1 font-medium">{t.selectSession}</label>
              <select
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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

        {/* Progress Bar & Quick Filters */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-1/2 space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">
                {loggedCount} {t.loggedCount} {totalPlayers} ({progressPercent}%)
              </span>
              <span className={progressPercent === 100 ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                {progressPercent === 100 ? '✓ Terminé' : `${totalPlayers - loggedCount} restants`}
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700/50">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/50 self-stretch sm:self-auto justify-center">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                filterMode === 'all' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tous ({totalPlayers})
            </button>
            <button
              onClick={() => setFilterMode('pending')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                filterMode === 'pending' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.pending} ({totalPlayers - loggedCount})
            </button>
            <button
              onClick={() => setFilterMode('logged')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                filterMode === 'logged' ? 'bg-emerald-700 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.alreadyLogged} ({loggedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Players */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {filteredPlayers.map(player => {
          const isLogged = loggedPlayerIds.has(player.id);
          const playerLog = sessionLogs.find(l => l.playerId === player.id);

          return (
            <div
              key={player.id}
              onClick={() => openLogModal(player)}
              className={`touch-press group relative cursor-pointer rounded-2xl p-4 transition-all duration-200 border text-center flex flex-col justify-between ${
                isLogged
                  ? 'bg-slate-800/60 border-emerald-500/40 hover:border-emerald-400 shadow-md shadow-emerald-950/20'
                  : 'bg-slate-800/90 border-slate-700 hover:border-emerald-500/60 hover:bg-slate-750 shadow-lg'
              }`}
            >
              {/* Jersey Number Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-black text-sm text-emerald-400 shadow-inner">
                  #{player.jerseyNumber}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-900/80 text-slate-400">
                  {player.position}
                </span>
              </div>

              {/* Player Avatar / Initials */}
              <div className="my-2 flex justify-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg border-2 transition-transform group-hover:scale-105 ${
                  isLogged
                    ? 'bg-emerald-900/40 text-emerald-300 border-emerald-500/60 shadow-lg shadow-emerald-900/30'
                    : 'bg-slate-700/60 text-white border-slate-600'
                }`}>
                  {player.firstName[0]}{player.lastName[0]}
                </div>
              </div>

              {/* Names */}
              <div className="space-y-0.5 my-1">
                <h3 className="font-bold text-sm text-white truncate">{player.lastName}</h3>
                <p className="text-xs text-slate-400 truncate">{player.firstName}</p>
              </div>

              {/* Status footer */}
              <div className="mt-3 pt-2 border-t border-slate-700/50">
                {isLogged ? (
                  <div className="flex items-center justify-center space-x-1.5 rtl:space-x-reverse text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>RPE {playerLog?.rpeScore} ({playerLog?.sessionLoad} {t.auUnits})</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse text-amber-400 text-xs font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t.tapToLog.split(' ')[0]}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* RPE Entry Modal (Touch-First Bench Sheet) */}
      {activePlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 border border-emerald-400 flex items-center justify-center font-black text-xl text-white shadow-lg">
                  #{activePlayer.jerseyNumber}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white">
                    {activePlayer.firstName} {activePlayer.lastName}
                  </h2>
                  <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                    {activePlayer.position} • {currentSession?.title} ({currentSession?.microcycleDay})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActivePlayer(null)}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Borg CR-10 Rate of Perceived Exertion Scale */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>{t.rpeScaleTitle}</span>
                </label>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {selectedRpe} / 10
                </span>
              </div>

              {/* Selected RPE Card Highlight */}
              <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-between">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <span className="text-3xl">{BORG_SCALE[selectedRpe].emoji}</span>
                  <div>
                    <p className="font-extrabold text-sm sm:text-base text-white">
                      {getBorgText(selectedRpe)}
                    </p>
                    <p className="text-xs text-slate-400">
                      Charge calculée : <span className="font-bold text-emerald-400">{selectedRpe * actualDuration} {t.auUnits}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-white px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 inline-block">
                    {selectedRpe}
                  </span>
                </div>
              </div>

              {/* Borg Buttons Grid (0 to 10) */}
              <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5 pt-1">
                {BORG_SCALE.map(item => {
                  const isSelected = selectedRpe === item.score;
                  return (
                    <button
                      key={item.score}
                      type="button"
                      onClick={() => setSelectedRpe(item.score)}
                      className={`h-14 sm:h-16 rounded-xl flex flex-col items-center justify-center transition-all border font-bold text-xs ${
                        isSelected
                          ? `${item.color} ring-2 ring-white scale-105 shadow-lg z-10`
                          : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                      }`}
                    >
                      <span className="text-lg sm:text-xl leading-none mb-0.5">{item.emoji}</span>
                      <span className="text-xs sm:text-sm font-black">{item.score}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Duration Slider & Quick Adjustments */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <label className="font-bold text-slate-300">{t.durationMin}</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActualDuration(Math.max(10, actualDuration - 10))}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-black text-base text-emerald-400 bg-slate-800 px-3 py-0.5 rounded-lg border border-slate-700 min-w-[65px] text-center">
                    {actualDuration} min
                  </span>
                  <button
                    type="button"
                    onClick={() => setActualDuration(Math.min(180, actualDuration + 10))}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="15"
                max="150"
                step="5"
                value={actualDuration}
                onChange={(e) => setActualDuration(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Hooper Wellness Accordion (Optional Pre-Session Readiness) */}
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <button
                type="button"
                onClick={() => setShowHooper(!showHooper)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-400 hover:text-slate-200 py-1"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{t.hooperTitle} (Score Total : {sleepScore + sorenessScore + fatigueScore + stressScore}/20)</span>
                </span>
                <span className="text-emerald-400">{showHooper ? 'Masquer ▲' : 'Évaluer ▼'}</span>
              </button>

              {showHooper && (
                <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs">
                  {/* Sleep */}
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold flex items-center gap-1">
                      <Moon className="w-3.5 h-3.5 text-blue-400" />
                      <span>{t.sleepQuality} (1-5)</span>
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(score => (
                        <button
                          key={score}
                          type="button"
                          onClick={() => setSleepScore(score)}
                          className={`flex-1 py-1 rounded-md font-bold transition-all ${
                            sleepScore === score ? 'bg-blue-600 text-white' : 'bg-slate-700/80 text-slate-300'
                          }`}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Muscle Soreness */}
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      <span>{t.muscleSoreness} (1-5)</span>
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(score => (
                        <button
                          key={score}
                          type="button"
                          onClick={() => setSorenessScore(score)}
                          className={`flex-1 py-1 rounded-md font-bold transition-all ${
                            sorenessScore === score ? 'bg-orange-600 text-white' : 'bg-slate-700/80 text-slate-300'
                          }`}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fatigue */}
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold flex items-center gap-1">
                      <Battery className="w-3.5 h-3.5 text-yellow-400" />
                      <span>{t.fatigueLevel} (1-5)</span>
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(score => (
                        <button
                          key={score}
                          type="button"
                          onClick={() => setFatigueScore(score)}
                          className={`flex-1 py-1 rounded-md font-bold transition-all ${
                            fatigueScore === score ? 'bg-yellow-600 text-white' : 'bg-slate-700/80 text-slate-300'
                          }`}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stress */}
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      <span>{t.stressLevel} (1-5)</span>
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(score => (
                        <button
                          key={score}
                          type="button"
                          onClick={() => setStressScore(score)}
                          className={`flex-1 py-1 rounded-md font-bold transition-all ${
                            stressScore === score ? 'bg-rose-600 text-white' : 'bg-slate-700/80 text-slate-300'
                          }`}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Optional Notes */}
            <div className="space-y-1">
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.optionalNotes}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleSave(false)}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition-all border border-slate-700 flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>{t.saveLog}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSave(true)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-sm transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2"
              >
                <span>{t.nextPlayer}</span>
                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
