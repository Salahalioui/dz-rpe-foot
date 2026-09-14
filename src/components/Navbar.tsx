import React from 'react';
import { Activity, Users, Calendar, BarChart3, FileSpreadsheet, Info, Globe, Wifi, WifiOff } from 'lucide-react';
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
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  isOnline,
  teamName,
  category
}) => {
  const t = translations[lang];

  const tabs = [
    { id: 'kiosk', label: t.kioskMode, icon: Activity },
    { id: 'dashboard', label: t.dashboard, icon: BarChart3 },
    { id: 'sessions', label: t.sessions, icon: Calendar },
    { id: 'players', label: t.players, icon: Users },
    { id: 'reports', label: t.reports, icon: FileSpreadsheet },
    { id: 'about', label: t.about, icon: Info }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer" onClick={() => setCurrentTab('kiosk')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-900 border border-emerald-500/40 flex items-center justify-center shadow-emerald-900/20 shadow-lg">
              <Activity className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                <span className="font-extrabold text-lg text-white tracking-tight">DZ-RPE</span>
                <span className="px-1.5 py-0.5 text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">FOOT {category}</span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block truncate max-w-xs">{teamName}</p>
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
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Controls: Language, Offline Status */}
          <div className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse">
            
            {/* Offline Badge */}
            <div
              title={isOnline ? t.onlineMode : t.offlineMode}
              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                isOnline ? 'bg-slate-800 text-slate-400' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {isOnline ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Offline</span>
                </>
              )}
            </div>

            {/* Language Switcher */}
            <div className="relative flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
              <button
                onClick={() => setLang('fr')}
                className={`px-2 py-1 text-xs font-bold rounded transition-all ${
                  lang === 'fr' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLang('ar')}
                className={`px-2 py-1 text-xs font-bold rounded transition-all ${
                  lang === 'ar' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                عر
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 text-xs font-bold rounded transition-all ${
                  lang === 'en' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 flex justify-around">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-xs transition-colors ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
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
