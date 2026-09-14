import type { Player, Session, RPELog, PlayerWorkload, ACWRStatus, Team } from '../types';

export function calculateACWRStatus(acwr: number): ACWRStatus {
  if (acwr < 0.8) return 'undertraining';
  if (acwr <= 1.3) return 'optimal';
  if (acwr < 1.5) return 'warning';
  return 'danger';
}

export function getStatusColor(status: ACWRStatus): { bg: string; text: string; border: string; label: string } {
  switch (status) {
    case 'optimal':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Optimal (0.8 - 1.3)' };
    case 'warning':
      return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Avertissement (1.3 - 1.5)' };
    case 'danger':
      return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', label: 'Danger (≥ 1.5)' };
    case 'undertraining':
      return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Sous-charge (< 0.8)' };
  }
}

export function calculatePlayerWorkload(
  player: Player,
  logs: RPELog[],
  sessions: Session[],
  targetDateStr?: string
): PlayerWorkload {
  const targetDate = targetDateStr ? new Date(targetDateStr) : new Date();
  targetDate.setHours(23, 59, 59, 999);

  // Map session dates to logs
  const sessionMap = new Map<string, Session>();
  sessions.forEach(s => sessionMap.set(s.id, s));

  // Filter logs for this player
  const playerLogs = logs
    .filter(l => l.playerId === player.id)
    .map(l => {
      const sess = sessionMap.get(l.sessionId);
      const logDate = sess ? new Date(sess.date) : new Date(l.timestamp);
      return {
        ...l,
        date: logDate,
        dateStr: sess ? sess.date : l.timestamp.split('T')[0]
      };
    })
    .filter(l => l.date <= targetDate)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  // 7 days window (targetDate - 6 days to targetDate)
  const sevenDaysAgo = new Date(targetDate);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  // 28 days window (targetDate - 27 days to targetDate)
  const twentyEightDaysAgo = new Date(targetDate);
  twentyEightDaysAgo.setDate(twentyEightDaysAgo.getDate() - 27);
  twentyEightDaysAgo.setHours(0, 0, 0, 0);

  // Calculate daily loads for the last 7 days (7 slots)
  const dailyLoads7d: number[] = [0, 0, 0, 0, 0, 0, 0];
  let acuteLoad7d = 0;
  let logCount7d = 0;
  let hooperSum = 0;
  let hooperCount = 0;

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(sevenDaysAgo);
    currentDay.setDate(currentDay.getDate() + i);
    const dayStr = currentDay.toISOString().split('T')[0];

    const dayLogs = playerLogs.filter(l => l.dateStr === dayStr);
    const dayLoad = dayLogs.reduce((sum, l) => sum + (l.sessionLoad || (l.rpeScore * l.actualDuration)), 0);
    dailyLoads7d[i] = dayLoad;
    acuteLoad7d += dayLoad;

    dayLogs.forEach(l => {
      logCount7d++;
      if (l.hooper) {
        const hSum = (l.hooper.sleep || 2) + (l.hooper.soreness || 2) + (l.hooper.fatigue || 2) + (l.hooper.stress || 2);
        hooperSum += hSum;
        hooperCount++;
      }
    });
  }

  // Calculate 28-day chronic load (sum of 28 days / 4 = average weekly load)
  let chronicLoadSum = 0;
  for (let i = 0; i < 28; i++) {
    const currentDay = new Date(twentyEightDaysAgo);
    currentDay.setDate(currentDay.getDate() + i);
    const dayStr = currentDay.toISOString().split('T')[0];
    const dayLogs = playerLogs.filter(l => l.dateStr === dayStr);
    const dayLoad = dayLogs.reduce((sum, l) => sum + (l.sessionLoad || (l.rpeScore * l.actualDuration)), 0);
    chronicLoadSum += dayLoad;
  }

  const chronicLoad28d = Math.round(chronicLoadSum / 4);

  // ACWR Ratio: Acute Load (7d) / Chronic Load (weekly average of 28d)
  let acwr = 1.0;
  if (chronicLoad28d > 0) {
    acwr = Number((acuteLoad7d / chronicLoad28d).toFixed(2));
  } else if (acuteLoad7d > 0) {
    acwr = 1.5; // High initial spike
  } else {
    acwr = 0.5;
  }

  // Monotony (Mean daily load / SD of daily load over 7 days)
  const meanDailyLoad = acuteLoad7d / 7;
  const variance = dailyLoads7d.reduce((sum, val) => sum + Math.pow(val - meanDailyLoad, 2), 0) / 7;
  const stdDev = Math.sqrt(variance);
  const monotony7d = stdDev > 0 ? Number((meanDailyLoad / stdDev).toFixed(2)) : (acuteLoad7d > 0 ? 2.5 : 0);

  // Strain = Weekly Load * Monotony
  const strain7d = Math.round(acuteLoad7d * monotony7d);

  // Hooper Index Average (4-20)
  const hooperTotalAvg = hooperCount > 0 ? Number((hooperSum / hooperCount).toFixed(1)) : 8.0;

  const lastLog = playerLogs.length > 0 ? playerLogs[0] : null;

  return {
    playerId: player.id,
    player,
    acuteLoad7d: Math.round(acuteLoad7d),
    chronicLoad28d,
    acwr,
    acwrStatus: calculateACWRStatus(acwr),
    monotony7d,
    strain7d,
    weeklyLoad: Math.round(acuteLoad7d),
    hooperTotalAvg,
    lastRpe: lastLog ? lastLog.rpeScore : null,
    lastSessionDate: lastLog ? lastLog.dateStr : null,
    logCount7d
  };
}

export function generateDefaultData(): { team: Team; players: Player[]; sessions: Session[]; logs: RPELog[] } {
  const team: Team = {
    id: 'team_dz_u17_01',
    name: 'Jeunesse Sportive U17 (Algérie)',
    club: 'JS Football Academy',
    category: 'U17',
    season: '2025/2026',
    coachName: 'Dr. Salah ALIOUI',
    city: 'El Bayadh'
  };

  const players: Player[] = [
    { id: 'p_01', firstName: 'Youcef', lastName: 'Belkacem', jerseyNumber: 1, position: 'GK', pin: '1001', teamId: team.id, isActive: true },
    { id: 'p_02', firstName: 'Amine', lastName: 'Bouguerra', jerseyNumber: 16, position: 'GK', pin: '1016', teamId: team.id, isActive: true },
    { id: 'p_03', firstName: 'Rayan', lastName: 'Bensebaini', jerseyNumber: 3, position: 'DF', pin: '1003', teamId: team.id, isActive: true },
    { id: 'p_04', firstName: 'Aymen', lastName: 'Tougai', jerseyNumber: 4, position: 'DF', pin: '1004', teamId: team.id, isActive: true },
    { id: 'p_05', firstName: 'Walid', lastName: 'Mandi', jerseyNumber: 5, position: 'DF', pin: '1005', teamId: team.id, isActive: true },
    { id: 'p_06', firstName: 'Anis', lastName: 'Hadj-Moussa', jerseyNumber: 2, position: 'DF', pin: '1002', teamId: team.id, isActive: true },
    { id: 'p_07', firstName: 'Moncef', lastName: 'Laribi', jerseyNumber: 12, position: 'DF', pin: '1012', teamId: team.id, isActive: true },
    { id: 'p_08', firstName: 'Hocine', lastName: 'Benayada', jerseyNumber: 13, position: 'DF', pin: '1013', teamId: team.id, isActive: true },
    { id: 'p_09', firstName: 'Ismael', lastName: 'Bennacer', jerseyNumber: 6, position: 'MF', pin: '1006', teamId: team.id, isActive: true },
    { id: 'p_10', firstName: 'Hicham', lastName: 'Boudaoui', jerseyNumber: 8, position: 'MF', pin: '1008', teamId: team.id, isActive: true },
    { id: 'p_11', firstName: 'Farès', lastName: 'Chaïbi', jerseyNumber: 10, position: 'MF', pin: '1010', teamId: team.id, isActive: true },
    { id: 'p_12', firstName: 'Adem', lastName: 'Zorgane', jerseyNumber: 14, position: 'MF', pin: '1014', teamId: team.id, isActive: true },
    { id: 'p_13', firstName: 'Ramiz', lastName: 'Zerrouki', jerseyNumber: 15, position: 'MF', pin: '1015', teamId: team.id, isActive: true },
    { id: 'p_14', firstName: 'Badredine', lastName: 'Bouanani', jerseyNumber: 7, position: 'FW', pin: '1007', teamId: team.id, isActive: true },
    { id: 'p_15', firstName: 'Amoura', lastName: 'Mohamed', jerseyNumber: 11, position: 'FW', pin: '1011', teamId: team.id, isActive: true },
    { id: 'p_16', firstName: 'Baghdad', lastName: 'Bounedjah', jerseyNumber: 9, position: 'FW', pin: '1009', teamId: team.id, isActive: true },
    { id: 'p_17', firstName: 'Ibrahim', lastName: 'Maza', jerseyNumber: 17, position: 'FW', pin: '1017', teamId: team.id, isActive: true },
    { id: 'p_18', firstName: 'Bachir', lastName: 'Belloumi', jerseyNumber: 18, position: 'FW', pin: '1018', teamId: team.id, isActive: true }
  ];

  // Generate 28 days of realistic microcycles leading up to today
  const sessions: Session[] = [];
  const logs: RPELog[] = [];
  const today = new Date();

  // Pattern of a weekly microcycle in Algerian U17 football:
  // Saturday: Match (MD)
  // Sunday: Recovery / Décrassage (MD+1)
  // Monday: Rest
  // Tuesday: Strength / Physical Prep (MD-4)
  // Wednesday: Tactical & Small Sided Games (MD-3)
  // Thursday: Speed & Tactical Prep (MD-2)
  // Friday: Activation & Set Pieces (MD-1)

  const microcyclePattern: { dayOffset: number; type: Session['type']; micro: Session['microcycleDay']; dur: number; targetRpe: number; title: string }[] = [
    { dayOffset: 0, type: 'tactical', micro: 'MD-2', dur: 75, targetRpe: 6, title: 'Tactique offensive & Transitions rapides' },
    { dayOffset: 1, type: 'physical', micro: 'MD-3', dur: 90, targetRpe: 7, title: 'Puissance aérobie & Jeux réduits (SSG)' },
    { dayOffset: 2, type: 'gym', micro: 'MD-4', dur: 60, targetRpe: 5, title: 'Renforcement musculaire & Prévention' },
    { dayOffset: 4, type: 'recovery', micro: 'MD+1', dur: 45, targetRpe: 3, title: 'Décrassage & Mobilité articulaire' },
    { dayOffset: 5, type: 'match', micro: 'MD', dur: 90, targetRpe: 8, title: 'Championnat U17 (Match Officiel)' },
    { dayOffset: 7, type: 'tactical', micro: 'MD-1', dur: 50, targetRpe: 4, title: 'Mise en place tactique & Coups de pied arrêtés' },
    { dayOffset: 8, type: 'tactical', micro: 'MD-2', dur: 75, targetRpe: 6, title: 'Circulation de balle & Pressing haut' },
    { dayOffset: 9, type: 'physical', micro: 'MD-3', dur: 85, targetRpe: 7, title: 'Vitesse intermittente & Travail spécifique' },
    { dayOffset: 10, type: 'gym', micro: 'MD-4', dur: 60, targetRpe: 6, title: 'Gainage & Force explosive membres inférieurs' },
    { dayOffset: 12, type: 'recovery', micro: 'MD+1', dur: 45, targetRpe: 3, title: 'Récupération active & Étirements' },
    { dayOffset: 13, type: 'match', micro: 'MD', dur: 90, targetRpe: 9, title: 'Match Amical de Préparation' },
    { dayOffset: 15, type: 'tactical', micro: 'MD-1', dur: 55, targetRpe: 4, title: 'Animation offensive & Finition' },
    { dayOffset: 16, type: 'tactical', micro: 'MD-2', dur: 75, targetRpe: 6, title: 'Bloc médian & Contre-attaques' },
    { dayOffset: 17, type: 'physical', micro: 'MD-3', dur: 90, targetRpe: 8, title: 'Capacité aérobie maximale (VMA)' },
    { dayOffset: 18, type: 'gym', micro: 'MD-4', dur: 60, targetRpe: 5, title: 'Prévention pubalgie & Ischio-jambiers' },
    { dayOffset: 20, type: 'recovery', micro: 'MD+1', dur: 40, targetRpe: 3, title: 'Hydrothérapie & Décrassage doux' },
    { dayOffset: 21, type: 'match', micro: 'MD', dur: 90, targetRpe: 8, title: 'Championnat U17 (Journée Régionale)' },
    { dayOffset: 23, type: 'tactical', micro: 'MD-1', dur: 50, targetRpe: 4, title: 'Vitesse de réaction & Stratégies' },
    { dayOffset: 24, type: 'tactical', micro: 'MD-2', dur: 80, targetRpe: 6, title: 'Sorties de balle sous pression' },
    { dayOffset: 25, type: 'physical', micro: 'MD-3', dur: 90, targetRpe: 7, title: 'Endurance de force & Duels' },
    { dayOffset: 26, type: 'gym', micro: 'MD-4', dur: 60, targetRpe: 5, title: 'Core training & Pliométrie basse' },
    { dayOffset: 27, type: 'recovery', micro: 'MD+1', dur: 45, targetRpe: 3, title: 'Récupération & Bilan physique' }
  ];

  microcyclePattern.forEach((item, idx) => {
    const sDate = new Date(today);
    sDate.setDate(sDate.getDate() - item.dayOffset);
    const dateStr = sDate.toISOString().split('T')[0];
    const sId = `sess_${idx + 1}`;

    const session: Session = {
      id: sId,
      teamId: team.id,
      date: dateStr,
      type: item.type,
      microcycleDay: item.micro,
      plannedDuration: item.dur,
      title: item.title,
      targetRpe: item.targetRpe,
      location: 'Stade Municipal El Bayadh',
      notes: 'Suivi rigoureux de la charge et hydratation post-séance',
      isCompleted: item.dayOffset > 0
    };
    sessions.push(session);

    // Generate logs for players
    players.forEach(p => {
      // Individual player variation
      let rpeVariation = (Math.sin(parseInt(p.jerseyNumber.toString()) * 13 + idx) * 1.4);
      let rpe = Math.min(10, Math.max(1, Math.round(item.targetRpe + rpeVariation)));
      
      // Let's create a couple of specific profiles (one player in danger zone, one undertrained, rest optimal)
      if (p.jerseyNumber === 11) {
        // Amoura Mohamed - very high load recently (Danger zone spike)
        if (item.dayOffset <= 7) rpe = Math.min(10, rpe + 2);
      } else if (p.jerseyNumber === 16) {
        // Backup GK Bouguerra - lower duration
        rpe = Math.max(2, rpe - 2);
      }

      let actualDur = item.dur;
      if (p.jerseyNumber === 16 && item.type === 'match') actualDur = 30; // sub GK
      if (p.jerseyNumber === 7 && item.dayOffset === 13) actualDur = 45; // subbed out

      const sleep = Math.min(5, Math.max(1, Math.round(2 + Math.random() * 1.5)));
      const soreness = Math.min(5, Math.max(1, Math.round((rpe > 6 ? 3 : 1) + Math.random() * 1.5)));
      const fatigue = Math.min(5, Math.max(1, Math.round((rpe > 7 ? 4 : 2) + Math.random() * 1.2)));
      const stress = Math.min(5, Math.max(1, Math.round(1 + Math.random() * 1.5)));

      const log: RPELog = {
        id: `log_${sId}_${p.id}`,
        sessionId: sId,
        playerId: p.id,
        rpeScore: rpe,
        actualDuration: actualDur,
        sessionLoad: rpe * actualDur,
        hooper: { sleep, soreness, fatigue, stress },
        timestamp: `${dateStr}T18:30:00Z`
      };
      logs.push(log);
    });
  });

  return { team, players, sessions, logs };
}
