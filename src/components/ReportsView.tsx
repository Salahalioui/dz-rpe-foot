import React, { useRef, useState, useEffect } from 'react';
import type { Team, Player, Session, RPELog, Language } from '../types';
import { translations } from '../i18n/translations';
import { StorageService } from '../services/storage';
import { 
  FileSpreadsheet, FileText, Download, Upload, RotateCcw, 
  Trash2, Sparkles, CheckCircle2, ShieldCheck, HardDrive, Printer
} from 'lucide-react';

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
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    StorageService.requestPersistentStorage();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleExportPdf = async () => {
    try {
      await StorageService.exportToPdf(team, players, sessions, logs);
      showToast('📄 Rapport PDF généré et téléchargé.');
    } catch (e) {
      console.error(e);
      showToast('❌ Erreur lors de la génération du PDF');
    }
  };

  const handleExportExcel = async () => {
    try {
      await StorageService.exportToExcel(team, players, sessions, logs);
      showToast('📊 Classeur Excel (.xlsx) généré et téléchargé.');
    } catch (e) {
      console.error(e);
      showToast('❌ Erreur lors de la génération d\'Excel');
    }
  };

  const handleExportJson = () => {
    StorageService.exportToJson(team, players, sessions, logs);
    showToast('💾 Sauvegarde JSON exportée.');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await StorageService.importFromJson(file);
      onDataRestored(data);
      showToast('✓ Données restaurées avec succès !');
    } catch {
      alert('Erreur lors de la lecture du fichier JSON');
    }
  };

  const handleResetDemo = () => {
    if (confirm('Charger l\'équipe de démonstration U17 Algérie (20 joueurs, 14 séances historiques) ?')) {
      const defaultData = StorageService.resetToDefault();
      onDataRestored(defaultData);
      showToast('⚡ Effectif démo U17 Algérie chargé.');
    }
  };

  const handleClearAll = () => {
    if (confirm('⚠️ Attention : Voulez-vous vraiment TOUT VIDER (0 joueurs, 0 séances) pour entrer votre propre effectif réel ?')) {
      const emptyData = StorageService.clearAllData();
      onDataRestored(emptyData);
      showToast('🗑️ Base de données vidée. Vous pouvez ajouter votre équipe.');
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-6xl mx-auto">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-400 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">Sports Science Data Export</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t.reports} & Gestion des Données
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-white/[0.03] border border-white/[0.08] px-3.5 py-1.5 rounded-full">
          <span>{players.length} Joueurs</span>
          <span>•</span>
          <span>{sessions.length} Séances</span>
          <span>•</span>
          <span>{logs.length} Logs</span>
        </div>
      </div>

      {/* How Storage Works Banner (Privacy & Offline) */}
      <div className="glass-card rounded-2xl p-5 border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5 rtl:space-x-reverse">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <HardDrive className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <span>Où sont stockées vos données ?</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% Client-Side & Hors-Ligne
              </span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
              Toutes les informations (joueurs, séances, scores RPE et Hooper) sont enregistrées <strong>exclusivement dans le navigateur de votre appareil</strong> via <code className="text-emerald-400 font-mono">LocalStorage</code>. Aucune donnée ne transite vers un serveur externe : confidentialité totale, zéro abonnement, et fonctionnement immédiat sur le terrain sans connexion internet.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="w-4 h-4" />
          <span>Données Protégées</span>
        </div>
      </div>

      {/* Export Section (PDF & Excel) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* PDF Export Card */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-white/[0.08] flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">Rapport Hebdomadaire PDF</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Document officiel formaté pour le Directeur Technique (DTS) et le staff. Inclut le résumé du microcycle, la matrice des ratios ACWR et les alertes de surmenage.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleExportPdf}
              className="flex-1 py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.12] font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-rose-400" />
              <span>{t.exportPdf}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.12] font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5"
              title="Imprimer ou enregistrer en PDF avec police Arabe vectorielle native"
            >
              <Printer className="w-4 h-4 text-indigo-400" />
              <span>Imprimer</span>
            </button>
          </div>
        </div>

        {/* Excel / SPSS Export Card */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-white/[0.08] flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">Export Excel (Recherche & SPSS / Jamovi)</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Classeur multi-feuilles (.xlsx) structuré pour les analyses statistiques : Effectif, Logs bruts Foster sRPE, ACWR Uncoupled, Monotonie et Indice Hooper.
            </p>
          </div>

          <button
            onClick={handleExportExcel}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{t.exportExcel}</span>
          </button>
        </div>

      </div>

      {/* Database Management & Reset Actions */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08] space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-400" />
              <span>Gestion de la Base de Données & Effectif</span>
            </h2>
            <p className="text-xs text-slate-400">
              Contrôlez vos données : démarrez à zéro avec votre équipe ou chargez des données de simulation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Action 1: Clear all / Start from scratch */}
          <button
            onClick={handleClearAll}
            className="p-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 font-bold text-xs transition-all flex flex-col items-center justify-center gap-2 text-center touch-press"
          >
            <Trash2 className="w-5 h-5 text-rose-400" />
            <span className="font-extrabold">Vider Tout (0 Joueurs)</span>
            <span className="text-[10px] text-rose-400/80 font-normal">Effacer démo & commencer à zéro</span>
          </button>

          {/* Action 2: Load Demo Squad */}
          <button
            onClick={handleResetDemo}
            className="p-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 font-bold text-xs transition-all flex flex-col items-center justify-center gap-2 text-center touch-press"
          >
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span className="font-extrabold">Charger Démo U17 Algérie</span>
            <span className="text-[10px] text-emerald-400/80 font-normal">20 joueurs & 14 séances d'exemple</span>
          </button>

          {/* Action 3: JSON Backup */}
          <button
            onClick={handleExportJson}
            className="p-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.08] font-bold text-xs transition-all flex flex-col items-center justify-center gap-2 text-center touch-press"
          >
            <Download className="w-5 h-5 text-blue-400" />
            <span className="font-extrabold">{t.backupData}</span>
            <span className="text-[10px] text-slate-400 font-normal">Télécharger fichier .json</span>
          </button>

          {/* Action 4: JSON Restore */}
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
              className="w-full h-full p-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.08] font-bold text-xs transition-all flex flex-col items-center justify-center gap-2 text-center touch-press"
            >
              <Upload className="w-5 h-5 text-teal-400" />
              <span className="font-extrabold">{t.restoreData}</span>
              <span className="text-[10px] text-slate-400 font-normal">Importer sauvegarde .json</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
