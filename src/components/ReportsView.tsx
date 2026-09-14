import React, { useRef } from 'react';
import type { Team, Player, Session, RPELog, Language } from '../types';
import { translations } from '../i18n/translations';
import { StorageService } from '../services/storage';
import { FileSpreadsheet, FileText, Download, Upload, RotateCcw, Database, Award } from 'lucide-react';

interface ReportsViewProps {
  team: Team;
  players: Player[];
  sessions: Session[];
  logs: RPELog[];
  onDataRestored: (data: { team: Team; players: Player[]; sessions: Session[]; logs: RPELog[] }) => void;
  lang: Language;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  team,
  players,
  sessions,
  logs,
  onDataRestored,
  lang
}) => {
  const t = translations[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportPdf = () => {
    StorageService.exportToPdf(team, players, sessions, logs);
  };

  const handleExportExcel = () => {
    StorageService.exportToExcel(team, players, sessions, logs);
  };

  const handleExportJson = () => {
    StorageService.exportToJson(team, players, sessions, logs);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await StorageService.importFromJson(file);
      onDataRestored(data);
      alert(t.restoreSuccess);
    } catch (err) {
      alert('Erreur lors de la lecture du fichier JSON');
    }
  };

  const handleResetDemo = () => {
    if (confirm('Réinitialiser toutes les données aux paramètres de démonstration U17 ?')) {
      const defaultData = StorageService.resetToDefault();
      onDataRestored(defaultData);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
          <FileSpreadsheet className="w-7 h-7 text-emerald-400" />
          <span>{t.reports}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Génération de rapports de charge, exports statistiques pour la recherche (Jamovi/SPSS) et sauvegardes
        </p>
      </div>

      {/* Export Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* PDF Export Card */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/70 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white">Rapport Hebdomadaire PDF</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Document officiel prêt pour le Directeur Technique (DTS) et l'entraîneur principal. Inclut le tableau complet ACWR, les zones de risque et les indices Hooper.
            </p>
          </div>

          <button
            onClick={handleExportPdf}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{t.exportPdf}</span>
          </button>
        </div>

        {/* Excel / SPSS Export Card */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/70 hover:border-teal-500/40 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shadow-lg">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white">Export Excel (Recherche & SPSS)</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Fichier classeur (.xlsx) multi-feuilles avec données brutes prêtes pour l'analyse statistique dans Jamovi, SPSS, R ou Excel (Colonnes standardisées sRPE, ACWR, Hooper).
            </p>
          </div>

          <button
            onClick={handleExportExcel}
            className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-teal-900/30 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{t.exportExcel}</span>
          </button>
        </div>

      </div>

      {/* Database Backup & Restore Section */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-800 bg-slate-900/80 space-y-5">
        
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <span>Sauvegarde & Continuité des Données</span>
          </h2>
          <p className="text-xs text-slate-400">
            Exportez l'intégralité de la base de données (séances, joueurs, notes RPE) en fichier JSON ou restaurez une sauvegarde précédente.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Export JSON */}
          <button
            onClick={handleExportJson}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>{t.backupData}</span>
          </button>

          {/* Restore JSON */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4 text-blue-400" />
              <span>{t.restoreData}</span>
            </button>
          </div>

          {/* Reset Demo */}
          <button
            onClick={handleResetDemo}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-800 font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span>{t.resetToDefault}</span>
          </button>

        </div>

      </div>

      {/* Academic Citation Box */}
      <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-start space-x-3 rtl:space-x-reverse">
        <Award className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
        <div className="text-xs text-slate-300 space-y-1">
          <p className="font-bold text-emerald-300">Formatage Académique & Recherche Scientifique</p>
          <p className="text-slate-400 leading-relaxed">
            Les variables calculées respectent scrupuleusement les formules de Carl Foster (Session-RPE, 2001) et Tim Gabbett (ACWR Uncoupled, 2016). Les fichiers exports générés peuvent être directement importés sous Jamovi ou SPSS pour tester des régressions logistiques, corrélations de Pearson ou ANOVA sur l'incidence des blessures en football de jeunes.
          </p>
        </div>
      </div>

    </div>
  );
};
