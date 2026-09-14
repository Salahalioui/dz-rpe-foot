import React, { useState, useMemo } from 'react';
import type { Player, Session, RPELog, Language, PlayerWorkload } from '../types';
import { translations } from '../i18n/translations';
import { calculatePlayerWorkload, getStatusColor } from '../utils/calculations';
import { 
  BarChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  TrendingUp, AlertTriangle, Activity, 
  Search, X, Calendar, ShieldAlert, Zap, CheckCircle, HeartPulse, ArrowUpRight
} from 'lucide-react';

interface DashboardViewProps {
  players: Player[];
  sessions: Session[];
  logs: RPELog[];
  lang: Language;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  players,
  sessions,
  logs,
  lang
}) => {
  const t = translations[lang];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string>('ALL');
  const [inspectPlayer, setInspectPlayer] = useState<PlayerWorkload | null>(null);

  // Compute workload for all active players
  const workloads: PlayerWorkload[] = useMemo(() => {
    return players
      .filter(p => p.isActive)
      .map(p => calculatePlayerWorkload(p, logs, sessions))
      .sort((a, b) => b.acwr - a.acwr); // Highest ACWR first
  }, [players, logs, sessions]);

  // Aggregate Metrics
  const totalWeeklyLoad = useMemo(() => {
    return workloads.reduce((sum, w) => sum + w.acuteLoad7d, 0);
  }, [workloads]);

  const avgTeamAcwr = useMemo(() => {
    if (workloads.length === 0) return 1.0;
    return Number((workloads.reduce((sum, w) => sum + w.acwr, 0) / workloads.length).toFixed(2));
  }, [workloads]);

  const dangerPlayers = useMemo(() => workloads.filter(w => w.acwrStatus === 'danger'), [workloads]);
  const optimalPlayers = useMemo(() => workloads.filter(w => w.acwrStatus === 'optimal'), [workloads]);

  // 14-day Team Daily Load Timeline Data
  const teamDailyTimeline = useMemo(() => {
    const sessionMap = new Map<string, Session>();
    sessions.forEach(s => sessionMap.set(s.id, s));

    // Get last 14 days sorted chronologically
    const last14Sessions = [...sessions]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-14);

    return last14Sessions.map(sess => {
      const sessLogs = logs.filter(l => l.sessionId === sess.id);
      const totalLoad = sessLogs.reduce((sum, l) => sum + (l.sessionLoad || (l.rpeScore * l.actualDuration)), 0);
      const avgLoad = sessLogs.length > 0 ? Math.round(totalLoad / sessLogs.length) : 0;
      const avgRpe = sessLogs.length > 0 ? Number((sessLogs.reduce((sum, l) => sum + l.rpeScore, 0) / sessLogs.length).toFixed(1)) : 0;

      return {
        date: sess.date.slice(5), // MM-DD
        day: sess.microcycleDay,
        type: sess.type,
        avgLoad,
        avgRpe,
        totalLoad
      };
    });
  }, [sessions, logs]);

  // Team Hooper Wellness Radar Data
  const teamHooperRadar = useMemo(() => {
    const activeLogs = logs.filter(l => l.hooper);
    if (activeLogs.length === 0) return [];

    const sleepAvg = activeLogs.reduce((sum, l) => sum + (l.hooper?.sleep || 2), 0) / activeLogs.length;
    const sorenessAvg = activeLogs.reduce((sum, l) => sum + (l.hooper?.soreness || 2), 0) / activeLogs.length;
    const fatigueAvg = activeLogs.reduce((sum, l) => sum + (l.hooper?.fatigue || 2), 0) / activeLogs.length;
    const stressAvg = activeLogs.reduce((sum, l) => sum + (l.hooper?.stress || 1), 0) / activeLogs.length;

    return [
      { subject: t.sleepQuality, value: Number(sleepAvg.toFixed(1)), fullMark: 5 },
      { subject: t.muscleSoreness, value: Number(sorenessAvg.toFixed(1)), fullMark: 5 },
      { subject: t.fatigueLevel, value: Number(fatigueAvg.toFixed(1)), fullMark: 5 },
      { subject: t.stressLevel, value: Number(stressAvg.toFixed(1)), fullMark: 5 }
    ];
  }, [logs, t]);

  // Filtered list for squad table
  const filteredWorkloads = useMemo(() => {
    return workloads.filter(w => {
      const matchesSearch = `${w.player.firstName} ${w.player.lastName} ${w.player.jerseyNumber}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesPos = selectedPosition === 'ALL' || w.player.position === selectedPosition;
      return matchesSearch && matchesPos;
    });
  }, [workloads, searchQuery, selectedPosition]);

  // Timeline for inspected player
  const inspectPlayerTimeline = useMemo(() => {
    if (!inspectPlayer) return [];
    const pLogs = logs.filter(l => l.playerId === inspectPlayer.playerId);
    const sessionMap = new Map<string, Session>();
    sessions.forEach(s => sessionMap.set(s.id, s));

    return [...pLogs]
      .map(l => {
        const s = sessionMap.get(l.sessionId);
        return {
          date: s ? s.date.slice(5) : l.timestamp.slice(5, 10),
          load: l.sessionLoad || (l.rpeScore * l.actualDuration),
          rpe: l.rpeScore,
          duration: l.actualDuration,
          hooper: l.hooper ? (l.hooper.sleep + l.hooper.soreness + l.hooper.fatigue + l.hooper.stress) : null
        };
      })
      .slice(-14);
  }, [inspectPlayer, logs, sessions]);

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Section / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Activity className="w-7 h-7 text-emerald-400" />
            <span>{t.dashboard}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {t.teamOverview} — Algorithme de Gabbett & Foster (ACWR Uncoupled)
          </p>
        </div>

        {/* Danger Alert Banner if red-zone players exist */}
        {dangerPlayers.length > 0 && (
          <div className="flex items-center space-x-2 rtl:space-x-reverse bg-rose-500/20 border border-rose-500/40 text-rose-300 px-3.5 py-2 rounded-xl text-xs font-bold animate-pulse shadow-lg shadow-rose-950/30">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              🚨 {dangerPlayers.length} {t.dangerCount} : {dangerPlayers.map(d => `#${d.player.jerseyNumber} ${d.player.lastName}`).join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Weekly Load */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/60 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">{t.weeklyLoadAU}</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-1.5 rtl:space-x-reverse">
            <span className="text-2xl sm:text-3xl font-black text-white">{totalWeeklyLoad.toLocaleString()}</span>
            <span className="text-xs font-bold text-emerald-400">{t.auUnits}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Cumul 7 jours effectif U17</p>
        </div>

        {/* Team Mean ACWR */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/60 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">{t.teamAvgACWR}</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-1.5 rtl:space-x-reverse">
            <span className={`text-2xl sm:text-3xl font-black ${
              avgTeamAcwr >= 1.5 ? 'text-rose-400' : avgTeamAcwr >= 1.3 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {avgTeamAcwr}
            </span>
            <span className="text-xs font-bold text-slate-400">Ratio (7j / 28j)</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-1">Cible : 0.80 - 1.30 (Sweet Spot)</p>
        </div>

        {/* Players in Sweet Spot */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/60 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">{t.optimalCount}</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-1.5 rtl:space-x-reverse">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">{optimalPlayers.length}</span>
            <span className="text-xs font-bold text-slate-400">/ {workloads.length}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Condition optimale de progression</p>
        </div>

        {/* Danger Red Zone */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/60 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">{t.dangerCount}</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline space-x-1.5 rtl:space-x-reverse">
            <span className="text-2xl sm:text-3xl font-black text-rose-400">{dangerPlayers.length}</span>
            <span className="text-xs font-bold text-rose-400/80">ACWR ≥ 1.5</span>
          </div>
          <p className="text-[11px] text-rose-400/90 mt-1">Surveillance médicale & repos</p>
        </div>

      </div>

      {/* Visual Charts Grid (14-day load + Hooper Radar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* 14-Day Team Daily Load Chart */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl bg-slate-900/70">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>{t.loadTrends}</span>
              </h2>
              <p className="text-xs text-slate-400">Charge moyenne par joueur (UA) et intensité (RPE)</p>
            </div>
            <span className="text-xs bg-slate-800 text-emerald-400 px-2.5 py-1 rounded-lg font-bold border border-slate-700">
              14 dernières séances
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamDailyTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis yAxisId="left" stroke="#10b981" fontSize={11} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 10]} stroke="#f59e0b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar yAxisId="left" dataKey="avgLoad" name="Charge Moyenne (UA)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="avgRpe" name="RPE Moyen" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hooper Wellness Spider Radar */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl bg-slate-900/70 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <HeartPulse className="w-4 h-4 text-amber-400" />
              <span>{t.hooperTitle} (Radar)</span>
            </h2>
            <p className="text-xs text-slate-400">Score de fatigue & récupération (1=Optimal, 5=Fatigué)</p>
          </div>

          <div className="h-56 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={teamHooperRadar}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis domain={[0, 5]} stroke="#475569" fontSize={9} />
                <Radar name="Équipe U17" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-400 text-center bg-slate-800/60 p-2 rounded-xl border border-slate-700/50">
            Un score plus bas indique une meilleure fraîcheur physique.
          </div>
        </div>

      </div>

      {/* Squad ACWR Table & Filters */}
      <div className="glass-card rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-xl bg-slate-900/80 space-y-4">
        
        {/* Table Top Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">
              Matrice de Charge & Ratios ACWR par Joueur
            </h2>
            <p className="text-xs text-slate-400">
              Surveillance individuelle du risque de blessure et de la charge chronique
            </p>
          </div>

          {/* Search & Position Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            
            {/* Search Box */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.search}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Position Pills */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700 text-xs font-semibold">
              {['ALL', 'GK', 'DF', 'MF', 'FW'].map(pos => (
                <button
                  key={pos}
                  onClick={() => setSelectedPosition(pos)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    selectedPosition === pos ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {pos === 'ALL' ? t.allPositions.split(' ')[0] : pos}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-slate-800/80 text-slate-300 font-bold uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-3">Joueur</th>
                <th className="py-3 px-2">Poste</th>
                <th className="py-3 px-3">{t.acuteLoad}</th>
                <th className="py-3 px-3">{t.chronicLoad}</th>
                <th className="py-3 px-3">{t.acwrRatio}</th>
                <th className="py-3 px-3">{t.status}</th>
                <th className="py-3 px-2">{t.monotony}</th>
                <th className="py-3 px-2">{t.strain}</th>
                <th className="py-3 px-2">Hooper</th>
                <th className="py-3 px-3 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredWorkloads.map(w => {
                const colors = getStatusColor(w.acwrStatus);

                return (
                  <tr key={w.playerId} className="hover:bg-slate-800/50 transition-colors">
                    
                    {/* Player Name & Jersey */}
                    <td className="py-3 px-3 font-semibold text-white">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-emerald-400 text-xs">
                          #{w.player.jerseyNumber}
                        </span>
                        <div>
                          <p className="font-bold text-white leading-tight">{w.player.firstName} {w.player.lastName}</p>
                          <p className="text-[10px] text-slate-500 font-normal">Dernier RPE: {w.lastRpe ?? '-'}/10</p>
                        </div>
                      </div>
                    </td>

                    {/* Position */}
                    <td className="py-3 px-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold text-[10px]">
                        {w.player.position}
                      </span>
                    </td>

                    {/* Acute Load (7d) */}
                    <td className="py-3 px-3 font-bold text-white">
                      {w.acuteLoad7d} <span className="text-[10px] text-slate-400 font-normal">UA</span>
                    </td>

                    {/* Chronic Load (28d) */}
                    <td className="py-3 px-3 text-slate-300">
                      {w.chronicLoad28d} <span className="text-[10px] text-slate-500 font-normal">UA</span>
                    </td>

                    {/* ACWR Value */}
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                        <span className={`text-sm font-black ${colors.text}`}>
                          {w.acwr.toFixed(2)}
                        </span>
                        {w.acwr >= 1.5 && (
                          <span className="text-xs text-rose-400 animate-bounce">🚨</span>
                        )}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${colors.bg} ${colors.text} ${colors.border}`}>
                        {w.acwrStatus.toUpperCase()}
                      </span>
                    </td>

                    {/* Monotony */}
                    <td className="py-3 px-2">
                      <span className={`font-semibold ${w.monotony7d > 2.0 ? 'text-amber-400 font-bold' : 'text-slate-300'}`}>
                        {w.monotony7d.toFixed(2)}
                      </span>
                    </td>

                    {/* Strain */}
                    <td className="py-3 px-2 font-mono text-slate-300">
                      {w.strain7d}
                    </td>

                    {/* Hooper Index */}
                    <td className="py-3 px-2">
                      <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                        w.hooperTotalAvg > 12 ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {w.hooperTotalAvg.toFixed(1)}/20
                      </span>
                    </td>

                    {/* Details Action Button */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => setInspectPlayer(w)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 text-xs font-bold border border-slate-700 transition-colors inline-flex items-center gap-1"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>Détails</span>
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* Individual Player Deep-Dive Modal */}
      {inspectPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 border border-emerald-400 flex items-center justify-center font-black text-2xl text-white shadow-xl">
                  #{inspectPlayer.player.jerseyNumber}
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">
                    {inspectPlayer.player.firstName} {inspectPlayer.player.lastName}
                  </h2>
                  <p className="text-xs text-slate-400 font-semibold flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold border border-slate-700">
                      {inspectPlayer.player.position}
                    </span>
                    <span>•</span>
                    <span>Code PIN : {inspectPlayer.player.pin}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setInspectPlayer(null)}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Individual Workload Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                <p className="text-[10px] text-slate-400 uppercase font-bold">{t.acuteLoad}</p>
                <p className="text-lg font-black text-white mt-0.5">{inspectPlayer.acuteLoad7d} <span className="text-xs font-normal">UA</span></p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                <p className="text-[10px] text-slate-400 uppercase font-bold">{t.chronicLoad}</p>
                <p className="text-lg font-black text-white mt-0.5">{inspectPlayer.chronicLoad28d} <span className="text-xs font-normal">UA</span></p>
              </div>

              <div className={`p-3 rounded-2xl border ${getStatusColor(inspectPlayer.acwrStatus).bg} ${getStatusColor(inspectPlayer.acwrStatus).border}`}>
                <p className="text-[10px] uppercase font-bold text-slate-400">{t.acwrRatio}</p>
                <p className={`text-xl font-black mt-0.5 ${getStatusColor(inspectPlayer.acwrStatus).text}`}>
                  {inspectPlayer.acwr.toFixed(2)}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                <p className="text-[10px] text-slate-400 uppercase font-bold">{t.monotony} / {t.strain}</p>
                <p className="text-base font-black text-white mt-0.5">{inspectPlayer.monotony7d.toFixed(1)} / {inspectPlayer.strain7d}</p>
              </div>

            </div>

            {/* Sport Science Recommendation Box */}
            <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4" />
                <span>Recommandation Entraîneur / Staff Médical</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {inspectPlayer.acwr >= 1.5 ? (
                  <span className="text-rose-300 font-medium">
                    ⚠️ <strong>Alerte Pic de Charge (Spike) :</strong> Le ratio ACWR ({inspectPlayer.acwr.toFixed(2)}) dépasse le seuil critique de 1.50. Recommandation : Alléger la séance de demain de 25% à 35% en volume ou privilégier une récupération active pour prévenir les blessures musculaires (ischio-jambiers / adducteurs).
                  </span>
                ) : inspectPlayer.acwr >= 1.3 ? (
                  <span className="text-amber-300 font-medium">
                    ⚠️ <strong>Zone d'Avertissement :</strong> La charge aiguë progresse rapidement. Surveiller les scores de courbatures et de sommeil lors des 48h précédant le match.
                  </span>
                ) : inspectPlayer.acwr < 0.8 ? (
                  <span className="text-blue-300 font-medium">
                    ℹ️ <strong>Sous-Charge :</strong> Le joueur s'entraîne en deçà de sa charge habituelle. Prévoir un travail complémentaire de maintien pour éviter le désentraînement.
                  </span>
                ) : (
                  <span className="text-emerald-300 font-medium">
                    ✅ <strong>Zone Optimale (Sweet Spot) :</strong> Équilibre parfait entre développement aérobie, préparation au match et protection contre les blessures.
                  </span>
                )}
              </p>
            </div>

            {/* Player 14-day history chart */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-300">Historique des 14 dernières séances</h3>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={inspectPlayerTimeline} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '11px' }} />
                    <Bar dataKey="load" name="Charge Séance (UA)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setInspectPlayer(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              {t.close}
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
