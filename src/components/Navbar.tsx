import React, { useState, useEffect } from 'react';
import { Activity, Users, Calendar, BarChart3, FileSpreadsheet, Info, Globe, Wifi, WifiOff, Sun, Moon, Download } from 'lucide-react';
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
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors shadow-lg ${
      isSunlight
        ? 'bg-white/95 border-slate-300 text-slate-900'
        : 'bg-slate-900/90 border-slate-800 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer select-none" onClick={() => setCurrentTab('kiosk')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-900 border border-emerald-500/40 flex items-center justify-center shadow-emerald-900/20 shadow-lg">
              <Activity className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                <span className={`font-extrabold text-lg tracking-tight ${isSunlight ? 'text-slate-950' : 'text-white'}`}>DZ-RPE</span>
                <span className="px-1.5 py-0.5 text-xs font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded">FOOT {category}</span>
              </div>
              <p className={`text-xs hidden sm:block truncate max-w-xs ${isSunlight ? 'text-slate-600' : 'text-slate-400'}`}>{teamName}</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 rtl:space-x-reverse">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-semibold'
                      : isSunlight
                        ? 'text-slate-700 hover:text-black hover:bg-slate-200'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Controls: PWA Install, Sunlight Mode, Language, Offline Status */}
          <div className="flex items-center space-x-2 sm:space-x-2.5 rtl:space-x-reverse">
            
            {/* PWA Install Button if available */}
            {deferredPrompt && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md animate-pulse"
                title="Installer l'application sur cet appareil"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Installer</span>
              </button>
            )}

            {/* Sunlight / Outdoor High-Contrast Toggle */}
            <button
              type="button"
              onClick={() => setThemeMode(isSunlight ? 'dark' : 'sunlight')}
              className={`p-1.5 rounded-lg border transition-all text-xs font-bold flex items-center gap-1 ${
                isSunlight
                  ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-sm'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title={isSunlight ? 'Désactiver le Mode Plein Soleil' : 'Activer le Mode Plein Soleil (Fort Contraste Extérieur)'}
            >
              {isSunlight ? (
                <>
                  <Sun className="w-4 h-4 text-amber-600" />
                  <span className="hidden lg:inline text-[11px]">Plein Soleil</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-400" />
                  <span className="hidden lg:inline text-[11px]">Sombre</span>
                </>
              )}
            </button>

            {/* Offline Badge */}
            <div
              title={isOnline ? t.onlineMode : t.offlineMode}
              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                isOnline
                  ? isSunlight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-400'
                  : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
              }`}
            >
              {isOnline ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">Offline</span>
                </>
              )}
            </div>

            {/* Language Switcher */}
            <div className={`relative flex items-center border rounded-lg p-0.5 ${
              isSunlight ? 'bg-slate-100 border-slate-300' : 'bg-slate-800 border-slate-700'
            }`}>
              <Globe className={`w-3.5 h-3.5 ml-1.5 mr-1 ${isSunlight ? 'text-slate-600' : 'text-slate-400'}`} />
              <button
                onClick={() => setLang('fr')}
                className={`px-2 py-1 text-xs font-bold rounded transition-all ${
                  lang === 'fr'
                    ? 'bg-emerald-600 text-white shadow'
                    : isSunlight ? 'text-slate-600 hover:text-black' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLang('ar')}
                className={`px-2 py-1 text-xs font-bold rounded transition-all ${
                  lang === 'ar'
                    ? 'bg-emerald-600 text-white shadow'
                    : isSunlight ? 'text-slate-600 hover:text-black' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                عر
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 text-xs font-bold rounded transition-all ${
                  lang === 'en'
                    ? 'bg-emerald-600 text-white shadow'
                    : isSunlight ? 'text-slate-600 hover:text-black' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </button>
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
