import type { Team, Player, Session, RPELog, PlayerWorkload } from '../types';
import { generateDefaultData, calculatePlayerWorkload } from '../utils/calculations';

const STORAGE_KEYS = {
  TEAM: 'dz_rpe_team',
  PLAYERS: 'dz_rpe_players',
  SESSIONS: 'dz_rpe_sessions',
  LOGS: 'dz_rpe_logs',
  LANG: 'dz_rpe_lang'
};

export class StorageService {
  static getInitialData() {
    let teamStr = localStorage.getItem(STORAGE_KEYS.TEAM);
    let playersStr = localStorage.getItem(STORAGE_KEYS.PLAYERS);
    let sessionsStr = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    let logsStr = localStorage.getItem(STORAGE_KEYS.LOGS);

    if (!teamStr || !playersStr || !sessionsStr || !logsStr) {
      const defaultData = generateDefaultData();
      this.saveAll(defaultData.team, defaultData.players, defaultData.sessions, defaultData.logs);
      return defaultData;
    }

    try {
      return {
        team: JSON.parse(teamStr) as Team,
        players: JSON.parse(playersStr) as Player[],
        sessions: JSON.parse(sessionsStr) as Session[],
        logs: JSON.parse(logsStr) as RPELog[]
      };
    } catch (e) {
      console.error('Error parsing stored data, resetting to default', e);
      const defaultData = generateDefaultData();
      this.saveAll(defaultData.team, defaultData.players, defaultData.sessions, defaultData.logs);
      return defaultData;
    }
  }

  static async requestPersistentStorage(): Promise<boolean> {
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
      try {
        const isPersisted = await navigator.storage.persisted();
        if (!isPersisted) {
          return await navigator.storage.persist();
        }
        return true;
      } catch (e) {
        console.warn('Storage persist request failed', e);
      }
    }
    return false;
  }

  static saveAll(team: Team, players: Player[], sessions: Session[], logs: RPELog[]) {
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(team));
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  }

  static resetToDefault(): { team: Team; players: Player[]; sessions: Session[]; logs: RPELog[] } {
    const defaultData = generateDefaultData();
    this.saveAll(defaultData.team, defaultData.players, defaultData.sessions, defaultData.logs);
    return defaultData;
  }

  static clearAllData(): { team: Team; players: Player[]; sessions: Session[]; logs: RPELog[] } {
    const emptyTeam: Team = {
      id: 'team_custom',
      name: 'Mon Club Football',
      club: 'Académie Football',
      city: 'El Bayadh',
      category: 'U17',
      coachName: 'Coach Principal',
      season: '2025/2026'
    };
    const emptyPlayers: Player[] = [];
    const emptySessions: Session[] = [];
    const emptyLogs: RPELog[] = [];
    this.saveAll(emptyTeam, emptyPlayers, emptySessions, emptyLogs);
    return { team: emptyTeam, players: emptyPlayers, sessions: emptySessions, logs: emptyLogs };
  }

  static exportToJson(team: Team, players: Player[], sessions: Session[], logs: RPELog[]) {
    const data = {
      exportDate: new Date().toISOString(),
      author: 'Dr. Salah ALIOUI - DZ-RPE Foot',
      version: '1.0.0',
      team,
      players,
      sessions,
      logs
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DZ_RPE_Backup_${team.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  static importFromJson(file: File): Promise<{ team: Team; players: Player[]; sessions: Session[]; logs: RPELog[] }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          if (parsed.team && parsed.players && parsed.sessions && parsed.logs) {
            StorageService.saveAll(parsed.team, parsed.players, parsed.sessions, parsed.logs);
            resolve({
              team: parsed.team,
              players: parsed.players,
              sessions: parsed.sessions,
              logs: parsed.logs
            });
          } else {
            reject(new Error('Format de fichier JSON invalide'));
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  static async exportToExcel(team: Team, players: Player[], sessions: Session[], logs: RPELog[]) {
    const XLSX = await import('xlsx');
    const wb = XLSX.utils.book_new();

    // 1. Raw Logs Sheet (Ready for Jamovi / SPSS)
    const sessionMap = new Map<string, Session>();
    sessions.forEach(s => sessionMap.set(s.id, s));
    const playerMap = new Map<string, Player>();
    players.forEach(p => playerMap.set(p.id, p));

    const rawData = logs.map(l => {
      const s = sessionMap.get(l.sessionId);
      const p = playerMap.get(l.playerId);
      const hooperTotal = l.hooper ? (l.hooper.sleep + l.hooper.soreness + l.hooper.fatigue + l.hooper.stress) : '';
      return {
        Log_ID: l.id,
        Date: s ? s.date : l.timestamp.split('T')[0],
        Player_ID: l.playerId,
        Jersey: p ? p.jerseyNumber : '',
        First_Name: p ? p.firstName : '',
        Last_Name: p ? p.lastName : '',
        Position: p ? p.position : '',
        Session_Type: s ? s.type : '',
        Microcycle_Day: s ? s.microcycleDay : '',
        Planned_Duration_Min: s ? s.plannedDuration : '',
        Actual_Duration_Min: l.actualDuration,
        Borg_CR10_RPE: l.rpeScore,
        Session_Load_AU: l.sessionLoad || (l.rpeScore * l.actualDuration),
        Sleep_1to5: l.hooper?.sleep || '',
        Soreness_1to5: l.hooper?.soreness || '',
        Fatigue_1to5: l.hooper?.fatigue || '',
        Stress_1to5: l.hooper?.stress || '',
        Hooper_Index_Total: hooperTotal,
        Comments: l.comments || ''
      };
    });
    const wsRaw = XLSX.utils.json_to_sheet(rawData);
    XLSX.utils.book_append_sheet(wb, wsRaw, 'Raw_Data_SPSS');

    // 2. ACWR & Workload Summary Sheet
    const workloads = players.map(p => calculatePlayerWorkload(p, logs, sessions));
    const summaryData = workloads.map(w => ({
      Jersey: w.player.jerseyNumber,
      Player_Name: `${w.player.firstName} ${w.player.lastName}`,
      Position: w.player.position,
      Acute_Load_7d_AU: w.acuteLoad7d,
      Chronic_Load_28d_AU: w.chronicLoad28d,
      ACWR_Ratio: w.acwr,
      ACWR_Status: w.acwrStatus.toUpperCase(),
      Monotony_7d: w.monotony7d,
      Strain_7d_AU: w.strain7d,
      Weekly_Load_AU: w.weeklyLoad,
      Hooper_Avg_4to20: w.hooperTotalAvg !== null ? w.hooperTotalAvg : '',
      Calibrating: w.isCalibrating ? 'YES' : 'NO',
      Sessions_Logged_7d: w.logCount7d
    }));
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'ACWR_Summary');

    // 3. Team Sessions Overview
    const sessionOverview = sessions.map(s => {
      const sessLogs = logs.filter(l => l.sessionId === s.id);
      const totalLoad = sessLogs.reduce((sum, l) => sum + (l.sessionLoad || (l.rpeScore * l.actualDuration)), 0);
      const avgRpe = sessLogs.length > 0 ? (sessLogs.reduce((sum, l) => sum + l.rpeScore, 0) / sessLogs.length).toFixed(1) : '0';
      return {
        Session_ID: s.id,
        Date: s.date,
        Title: s.title,
        Type: s.type,
        Microcycle_Day: s.microcycleDay,
        Planned_Duration_Min: s.plannedDuration,
        Target_RPE: s.targetRpe || '',
        Logged_Players: sessLogs.length,
        Team_Avg_RPE: avgRpe,
        Team_Total_Load_AU: totalLoad
      };
    });
    const wsSessions = XLSX.utils.json_to_sheet(sessionOverview);
    XLSX.utils.book_append_sheet(wb, wsSessions, 'Sessions_Overview');

    // Auto-calculate column widths
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const autoWidth = (ws: any, data: any[]) => {
      if (!data || data.length === 0) return;
      const headers = Object.keys(data[0]);
      ws['!cols'] = headers.map(h => {
        const maxLen = Math.max(h.length, ...data.map(r => String(r[h] ?? '').length));
        return { wch: Math.min(32, Math.max(10, maxLen + 2)) };
      });
    };
    autoWidth(wsRaw, rawData);
    autoWidth(wsSummary, summaryData);
    autoWidth(wsSessions, sessionOverview);

    XLSX.writeFile(wb, `DZ_RPE_Football_${team.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  static async exportToPdf(team: Team, players: Player[], sessions: Session[], logs: RPELog[]) {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF();
    const workloads: PlayerWorkload[] = players.map(p => calculatePlayerWorkload(p, logs, sessions));
    
    // Header styling
    doc.setFillColor(0, 98, 51); // Algerian Flag Green
    doc.rect(0, 0, 210, 32, 'F');
    
    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('DZ-RPE FOOT | RAPPORT DE CHARGE & ACWR (U17)', 14, 14);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Club / Equipe : ${team.name} (${team.category}) | Entraineur : ${team.coachName}`, 14, 22);
    doc.text(`Date du rapport : ${new Date().toLocaleDateString('fr-FR')} | Ville : ${team.city}, Algerie`, 14, 28);

    // KPI Summary Box
    const totalWeeklyLoad = workloads.reduce((sum, w) => sum + w.acuteLoad7d, 0);
    const avgAcwr = (workloads.reduce((sum, w) => sum + w.acwr, 0) / (workloads.length || 1)).toFixed(2);
    const dangerCount = workloads.filter(w => w.acwrStatus === 'danger').length;
    const optimalCount = workloads.filter(w => w.acwrStatus === 'optimal').length;

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('SYNTHESE DU MICROCYCLE HEBDOMADAIRE', 14, 40);

    const kpiRows = [
      ['Charge Totale Groupe (7j)', `${totalWeeklyLoad} UA`, 'Joueurs en Zone Rouge (>= 1.5)', `${dangerCount}`],
      ['Moyenne ACWR Equipe', `${avgAcwr}`, 'Joueurs en Zone Optimale (0.8 - 1.3)', `${optimalCount}`]
    ];

    autoTable(doc, {
      startY: 44,
      head: [['Indicateur Cle', 'Valeur', 'Indicateur de Risque', 'Nombre']],
      body: kpiRows,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 9 }
    });

    // Players Workload Table
    // @ts-ignore
    const finalY = doc.lastAutoTable?.finalY || 70;
    doc.text('TABLEAU DE BORD INDIVIDUEL (FOSTER sRPE & GABBETT ACWR)', 14, finalY + 10);

    const tableData = workloads.map(w => [
      `#${w.player.jerseyNumber}`,
      `${w.player.firstName} ${w.player.lastName}`,
      w.player.position,
      `${w.acuteLoad7d} UA`,
      `${w.chronicLoad28d} UA`,
      w.acwr.toFixed(2),
      w.isCalibrating ? `${w.acwrStatus.toUpperCase()}*` : w.acwrStatus.toUpperCase(),
      w.monotony7d.toFixed(2),
      `${w.strain7d}`,
      w.hooperTotalAvg !== null ? w.hooperTotalAvg.toFixed(1) : '-'
    ]);

    autoTable(doc, {
      startY: finalY + 14,
      head: [['N°', 'Joueur', 'Poste', 'Aigue (7j)', 'Chronique (28j)', 'ACWR', 'Statut', 'Monotonie', 'Strain', 'Hooper']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [0, 98, 51], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 2 },
      didParseCell: (data) => {
        if (data.column.index === 6 && data.section === 'body') {
          const val = data.cell.raw;
          if (val === 'DANGER') {
            data.cell.styles.textColor = [220, 38, 38];
            data.cell.styles.fontStyle = 'bold';
          } else if (val === 'OPTIMAL') {
            data.cell.styles.textColor = [16, 185, 129];
            data.cell.styles.fontStyle = 'bold';
          } else if (val === 'WARNING') {
            data.cell.styles.textColor = [217, 119, 6];
          }
        }
      }
    });

    // Footer with Scientific references & Dr. Salah Alioui credits
    // @ts-ignore
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text('Conçu & Développé par Dr. Salah ALIOUI (PhD en Sciences du Sport) | DZ-RPE Foot — Modèle Validé Foster sRPE & Gabbett ACWR', 14, 288);
      doc.text(`Page ${i} / ${pageCount}`, 190, 288);
    }

    doc.save(`Rapport_Charge_U17_${team.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  }
}
