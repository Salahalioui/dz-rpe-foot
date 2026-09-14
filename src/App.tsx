import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { KioskView } from './components/KioskView';
import { DashboardView } from './components/DashboardView';
import { SessionsView } from './components/SessionsView';
import { PlayersView } from './components/PlayersView';
import { ReportsView } from './components/ReportsView';
import { AboutView } from './components/AboutView';
import { StorageService } from './services/storage';
import type { Player, Session, RPELog, Language } from './types';

export const App: React.FC = () => {
  const [data, setData] = useState(() => StorageService.getInitialData());
  const [currentTab, setCurrentTab] = useState<string>('kiosk');
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('dz_rpe_lang');
    return (saved as Language) || 'fr';
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
        setLang={setLang}
        isOnline={isOnline}
        teamName={data.team.name}
        category={data.team.category}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'kiosk' && (
          <KioskView
            players={data.players}
            sessions={data.sessions}
            logs={data.logs}
            onSaveLog={handleSaveLog}
            lang={lang}
          />
        )}

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
            lang={lang}
          />
        )}

        {currentTab === 'reports' && (
          <ReportsView
            team={data.team}
            players={data.players}
            sessions={data.sessions}
            logs={data.logs}
            onDataRestored={(restored) => setData(restored)}
            lang={lang}
          />
        )}

        {currentTab === 'about' && (
          <AboutView lang={lang} />
        )}
      </main>

      {/* App Footer */}
      <footer className="hidden sm:block border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} DZ-RPE Foot • Développé par <strong className="text-emerald-400">Dr. Salah ALIOUI</strong> (PhD Sciences du Sport, Algérie)</p>
          <p className="text-slate-400">Modèle Validé Foster sRPE • ACWR Uncoupled • Hooper Index</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
