export type TimerMode = 'chronometer' | 'tabata';

export type TimerPhase = 'work' | 'rest' | 'longrest' | 'chronometer';

export interface TabataConfig {
  id: string;
  name: string;
  workTime: number; // seconds
  restTime: number; // seconds
  longRestTime: number; // seconds
  sets: number;
}

export interface TabataSet {
  id: string;
  name: string;
  description?: string;
  sequences: TabataConfig[];
  createdAt: number; // timestamp
}

export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  currentMode: TimerMode;
  currentTime: number; // seconds
  currentPhase: TimerPhase;
  currentSequenceIndex: number;
  currentSet: number;
  currentSetCycle: number;
  sequenceTotal: number;
  tabataSequences: TabataConfig[];
  tabataSets: TabataSet[];
  audioEnabled: boolean;
  vibrationEnabled: boolean;
  sessionStats: {
    totalTime: number;
    completedSets: number;
    completedSequences: number;
  };
}

export interface TimerActions {
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  nextPhase: () => void;
  setMode: (mode: TimerMode) => void;
  addTabataSequence: (config: Omit<TabataConfig, 'id'>) => void;
  updateTabataSequence: (id: string, config: Partial<TabataConfig>) => void;
  deleteTabataSequence: (id: string) => void;
  clearAllSequences: () => void;
  loadTabataSet: (setId: string) => void;
  addTabataSet: (set: Omit<TabataSet, 'id' | 'createdAt'>) => void;
  updateTabataSet: (id: string, set: Partial<TabataSet>) => void;
  deleteTabataSet: (id: string) => void;
  toggleAudio: () => void;
  toggleVibration: () => void;
}
