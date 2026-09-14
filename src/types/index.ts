export type Position = 'GK' | 'DF' | 'MF' | 'FW';

export type SessionType = 'tactical' | 'physical' | 'match' | 'recovery' | 'gym';

export type MicrocycleDay = 'MD-4' | 'MD-3' | 'MD-2' | 'MD-1' | 'MD' | 'MD+1' | 'MD+2';

export type ACWRStatus = 'undertraining' | 'optimal' | 'warning' | 'danger';

export interface HooperScore {
  sleep: number;     // 1 (Best) - 5 (Worst) or 1-5
  soreness: number;  // 1 (None) - 5 (Very Sore)
  fatigue: number;   // 1 (Fresh) - 5 (Exhausted)
  stress: number;    // 1 (Calm) - 5 (Very Stressed)
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  jerseyNumber: number;
  position: Position;
  pin: string;
  avatarUrl?: string;
  teamId: string;
  isActive: boolean;
  notes?: string;
}

export interface Session {
  id: string;
  teamId: string;
  date: string; // YYYY-MM-DD
  type: SessionType;
  microcycleDay: MicrocycleDay;
  plannedDuration: number; // minutes
  title: string;
  targetRpe?: number;
  location?: string;
  notes?: string;
  isCompleted?: boolean;
}

export interface RPELog {
  id: string;
  sessionId: string;
  playerId: string;
  rpeScore: number; // 0 - 10 (Borg CR-10)
  actualDuration: number; // minutes
  sessionLoad: number; // rpeScore * actualDuration (AU)
  hooper?: HooperScore;
  comments?: string;
  timestamp: string;
}

export interface PlayerWorkload {
  playerId: string;
  player: Player;
  acuteLoad7d: number;      // Last 7 days sum
  chronicLoad28d: number;  // Last 28 days weekly average (28d sum / 4 or uncoupled)
  acwr: number;            // Acute / Chronic
  acwrStatus: ACWRStatus;
  monotony7d: number;      // Mean daily load / SD
  strain7d: number;        // Weekly load * Monotony
  weeklyLoad: number;      // Sum of loads this week
  hooperTotalAvg: number | null;  // Hooper readiness index (lower is better, 4-20) or null if no logs
  lastRpe: number | null;
  lastSessionDate: string | null;
  logCount7d: number;
  isCalibrating: boolean;  // True if history < 21 days
  historyDays: number;     // Number of days recorded in history
}

export interface Team {
  id: string;
  name: string;
  club: string;
  category: string; // 'U17'
  season: string;
  coachName: string;
  city: string;
}

export type Language = 'fr' | 'ar' | 'en';
