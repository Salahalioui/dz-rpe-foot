import React, { useState, useEffect } from 'react';
import { Activity, Users, Calendar, BarChart3, FileSpreadsheet, Info, Sun, Moon, Download, WifiOff } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../i18n/translations';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  isOnline: boolean;
  teamName: string;
  category: string;
  themeMode: 'dark' | 'sunlight';
  setThemeMode: (mode: 'dark' | 'sunlight') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  isOnline,
  teamName,
  category,
  themeMode,
  setThemeMode
}) => {
  const t = translations[lang];

  // PWA Install prompt state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const tabs = [
    { id: 'kiosk', label: t.kioskMode, icon: Activity },
    { id: 'dashboard', label: t.dashboard, icon: BarChart3 },
    { id: 'sessions', label: t.sessions, icon: Calendar },
    { id: 'players', label: t.players, icon: Users },
    { id: 'reports', label: t.reports, icon: FileSpreadsheet },
    { id: 'about', label: t.about, icon: Info }
  ];

  const isSunlight = themeMode === 'sunlight';

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
      isSunlight
        ? 'bg-white/95 border-slate-300 text-slate-900 shadow-sm'
        : 'bg-slate-900/90 border-slate-800 text-white shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer select-none shrink-0" 
            onClick={() => setCurrentTab('kiosk')}
            title="DZ-RPE Foot — Retour au Kiosque"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-emerald-900/30 shadow-md">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className={`font-black text-sm sm:text-base tracking-tight ${isSunlight ? 'text-slate-950' : 'text-white'}`}>
                  DZ-RPE
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-md">
                  {category}
                </span>
              </div>
              <p className={`text-[11px] font-medium truncate max-w-[120px] sm:max-w-[180px] xl:max-w-xs mt-0.5 ${isSunlight ? 'text-slate-500' : 'text-slate-400'}`}>
                {teamName}
              </p>
            </div>
          </div>

          {/* Sleek Segmented Desktop Navigation */}
          <nav className={`hidden md:flex items-center p-1 rounded-2xl border transition-all ${
            isSunlight 
              ? 'bg-slate-100/90 border-slate-200' 
              : 'bg-slate-950/60 border-slate-800'
          }`}>
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/30 font-black'
                      : isSunlight
                        ? 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/70'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Controls: Sunlight, Offline, Language */}
          <div className="flex items-center gap-1.5 sm:gap-2 rtl:space-x-reverse shrink-0">
            
            {/* PWA Install Button (Icon-Only on small, subtle pill) */}
            {deferredPrompt && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1 animate-pulse"
                title="Installer l'application (PWA)"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Installer</span>
              </button>
            )}

            {/* Sunlight Mode (Icon-Only) */}
            <button
              type="button"
              onClick={() => setThemeMode(isSunlight ? 'dark' : 'sunlight')}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center transition-all ${
                isSunlight
                  ? 'bg-amber-50 border-amber-300 text-amber-600 hover:bg-amber-100 shadow-sm'
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
              title={isSunlight ? 'Désactiver le Mode Plein Soleil' : 'Activer le Mode Plein Soleil (Contraste Extérieur)'}
            >
              {isSunlight ? (
                <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Offline Badge (Visible ONLY when offline) */}
            {!isOnline && (
              <div
                title={t.offlineMode}
                className="flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold animate-pulse"
              >
                <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[10px] hidden sm:inline">Hors-ligne</span>
              </div>
            )}

            {/* Language Switcher (Minimalist Segmented Pill) */}
            <div className={`flex items-center p-0.5 rounded-xl border ${
              isSunlight ? 'bg-slate-100 border-slate-300' : 'bg-slate-800/80 border-slate-700/80'
            }`}>
              {(['fr', 'ar', 'en'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-black transition-all ${
                    lang === l
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isSunlight
                        ? 'text-slate-600 hover:text-slate-950'
                        : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {l === 'ar' ? 'عر' : l.toUpperCase()}
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar with Safe Area */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-lg border-t px-2 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] flex justify-around transition-colors ${
        isSunlight ? 'bg-white/95 border-slate-300' : 'bg-slate-900/95 border-slate-800'
      }`}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-xs transition-colors ${
                isActive
                  ? 'text-emerald-500 font-bold'
                  : isSunlight ? 'text-slate-600 hover:text-black' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] tracking-tight">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
