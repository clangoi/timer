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
  audioEnabled: boolean;
  vibrationEnabled: boolean;
  isFloating: boolean;
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
  setFloating: (isFloating: boolean) => void;
  addTabataSequence: (config: Omit<TabataConfig, 'id'>) => void;
  updateTabataSequence: (id: string, config: Partial<TabataConfig>) => void;
  deleteTabataSequence: (id: string) => void;
  clearAllSequences: () => void;
  toggleAudio: () => void;
  toggleVibration: () => void;
}
