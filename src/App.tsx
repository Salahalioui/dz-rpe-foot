import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { KioskView } from './components/KioskView';
import { StorageService } from './services/storage';
import type { Player, Session, RPELog, Language, Team } from './types';

// Code-split heavy views to reduce initial bundle from 1.5MB to < 180KB
const DashboardView = lazy(() => import('./components/DashboardView').then(m => ({ default: m.DashboardView })));
const SessionsView = lazy(() => import('./components/SessionsView').then(m => ({ default: m.SessionsView })));
const PlayersView = lazy(() => import('./components/PlayersView').then(m => ({ default: m.PlayersView })));
const ReportsView = lazy(() => import('./components/ReportsView').then(m => ({ default: m.ReportsView })));
const AboutView = lazy(() => import('./components/AboutView').then(m => ({ default: m.AboutView })));

export const App: React.FC = () => {
  const [data, setData] = useState(() => StorageService.getInitialData());
  const [currentTab, setCurrentTab] = useState<string>('kiosk');
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('dz_rpe_lang');
    return (saved as Language) || 'fr';
  });
  const [themeMode, setThemeMode] = useState<'dark' | 'sunlight'>(() => {
    return (localStorage.getItem('dz_rpe_theme') as 'dark' | 'sunlight') || 'dark';
  });
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Sync online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update HTML document direction when language changes (RTL for Arabic)
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('dz_rpe_lang', lang);
  }, [lang]);

  // Update theme mode (dark vs sunlight high-contrast outdoor)
  useEffect(() => {
    if (themeMode === 'sunlight') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('sunlight');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('sunlight');
    }
    localStorage.setItem('dz_rpe_theme', themeMode);
  }, [themeMode]);

  // Reset / Clear database helpers
  const handleResetDemo = () => {
    if (confirm('Charger l\'équipe de démonstration U17 Algérie (20 joueurs, 14 séances d\'historique) ?')) {
      const defaultData = StorageService.resetToDefault();
      setData(defaultData);
    }
  };

  const handleClearAll = () => {
    if (confirm('⚠️ Attention : Voulez-vous vraiment TOUT VIDER (0 joueurs, 0 séances) pour entrer votre propre effectif réel ?')) {
      const emptyData = StorageService.clearAllData();
      setData(emptyData);
    }
  };

  // Handler for saving a new or updated RPE log
  const handleSaveLog = (newLog: RPELog) => {
    const existingIndex = data.logs.findIndex(
      l => l.sessionId === newLog.sessionId && l.playerId === newLog.playerId
    );
    let updatedLogs: RPELog[];
    if (existingIndex >= 0) {
      updatedLogs = [...data.logs];
      updatedLogs[existingIndex] = newLog;
    } else {
      updatedLogs = [newLog, ...data.logs];
    }

    const updatedData = { ...data, logs: updatedLogs };
    setData(updatedData);
    StorageService.saveAll(updatedData.team, updatedData.players, updatedData.sessions, updatedLogs);
  };

  // Handler for adding a session
  const handleAddSession = (newSession: Session) => {
    const updatedSessions = [newSession, ...data.sessions];
    const updatedData = { ...data, sessions: updatedSessions };
    setData(updatedData);
    StorageService.saveAll(updatedData.team, updatedData.players, updatedSessions, updatedData.logs);
  };

  // Handler for deleting a session
  const handleDeleteSession = (sessionId: string) => {
    if (confirm('Supprimer cette séance et tous ses enregistrements RPE ?')) {
      const updatedSessions = data.sessions.filter(s => s.id !== sessionId);
      const updatedLogs = data.logs.filter(l => l.sessionId !== sessionId);
      const updatedData = { ...data, sessions: updatedSessions, logs: updatedLogs };
      setData(updatedData);
      StorageService.saveAll(updatedData.team, updatedData.players, updatedSessions, updatedLogs);
    }
  };

  // Handler for adding a player
  const handleAddPlayer = (newPlayer: Player) => {
    const updatedPlayers = [...data.players, newPlayer];
    const updatedData = { ...data, players: updatedPlayers };
    setData(updatedData);
    StorageService.saveAll(updatedData.team, updatedPlayers, updatedData.sessions, updatedData.logs);
  };

  // Handler for updating a player
  const handleUpdatePlayer = (updatedPlayer: Player) => {
    const updatedPlayers = data.players.map(p => (p.id === updatedPlayer.id ? updatedPlayer : p));
    const updatedData = { ...data, players: updatedPlayers };
    setData(updatedData);
    StorageService.saveAll(updatedData.team, updatedPlayers, updatedData.sessions, updatedData.logs);
  };

  // Handler for deleting a player
  const handleDeletePlayer = (playerId: string) => {
    if (confirm('Supprimer ce joueur de l\'effectif ?')) {
      const updatedPlayers = data.players.filter(p => p.id !== playerId);
      const updatedLogs = data.logs.filter(l => l.playerId !== playerId);
      const updatedData = { ...data, players: updatedPlayers, logs: updatedLogs };
      setData(updatedData);
      StorageService.saveAll(updatedData.team, updatedPlayers, updatedData.sessions, updatedLogs);
    }
  };

  // Direct switch from Sessions list to Kiosk Mode
  const handleOpenKioskSession = (_sessionId: string) => {
    setCurrentTab('kiosk');
  };

  const isSunlight = themeMode === 'sunlight';

  return (
    <div className={`min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-white font-sans transition-colors ${
      isSunlight ? 'bg-slate-100 text-slate-900' : 'bg-[#08090a] text-[#f7f8f8]'
    }`}>
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
        setLang={setLang}
        isOnline={isOnline}
        teamName={data.team.name}
        category={data.team.category}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'kiosk' && (
          <KioskView
            players={data.players}
            sessions={data.sessions}
            logs={data.logs}
            onSaveLog={handleSaveLog}
            onAddSession={handleAddSession}
            lang={lang}
          />
        )}

        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
            <p className="text-xs font-bold text-slate-400">Chargement des données...</p>
          </div>
        }>
          {currentTab === 'dashboard' && (
            <DashboardView
              players={data.players}
              sessions={data.sessions}
              logs={data.logs}
              lang={lang}
            />
          )}

          {currentTab === 'sessions' && (
            <SessionsView
              sessions={data.sessions}
              logs={data.logs}
              players={data.players}
              onAddSession={handleAddSession}
              onDeleteSession={handleDeleteSession}
              onOpenKioskSession={handleOpenKioskSession}
              lang={lang}
            />
          )}

          {currentTab === 'players' && (
            <PlayersView
              players={data.players}
              onAddPlayer={handleAddPlayer}
              onUpdatePlayer={handleUpdatePlayer}
              onDeletePlayer={handleDeletePlayer}
              onResetDemo={handleResetDemo}
              onClearAll={handleClearAll}
              lang={lang}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsView
              team={data.team}
              players={data.players}
              sessions={data.sessions}
              logs={data.logs}
              onDataRestored={(restored: { team: Team; players: Player[]; sessions: Session[]; logs: RPELog[] }) => setData(restored)}
              lang={lang}
            />
          )}

          {currentTab === 'about' && (
            <AboutView lang={lang} />
          )}
        </Suspense>
      </main>

      {/* App Footer */}
      <footer className={`hidden sm:block border-t py-4 text-center text-xs transition-colors ${
        isSunlight ? 'bg-white border-slate-300 text-slate-600' : 'bg-[#08090a] border-white/[0.06] text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} DZ-RPE Foot • Développé par <strong className="text-emerald-500 font-semibold">Dr. Salah ALIOUI</strong> (PhD Sciences du Sport)</p>
          <p className="font-mono text-[11px] text-slate-500">Foster sRPE (2001) • ACWR Uncoupled • Hooper Index</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
