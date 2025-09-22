export type TimerMode = 'chronometer' | 'tabata' | 'simple-countdown';

export type TimerPhase = 'work' | 'rest' | 'longrest' | 'chronometer' | 'simple-countdown';

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
  // Simple countdown mode specific state
  simpleCountdownTime: number; // configured time in seconds
  simpleCountdownInitialTime: number; // initial time for reset
  isCompleted: boolean; // indicates if timer has finished
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
  // Simple countdown mode actions
  setSimpleCountdownTime: (timeInSeconds: number) => void;
  completeTimer: () => void;
}
