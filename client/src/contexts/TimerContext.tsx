import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { TimerState, TimerActions, TimerMode, TabataConfig } from '@/types/timer';
import { usePersistence } from '@/hooks/usePersistence';

const initialState: TimerState = {
  isRunning: false,
  isPaused: false,
  currentMode: 'chronometer',
  currentTime: 0,
  currentPhase: 'chronometer',
  currentSequenceIndex: 0,
  currentSet: 0,
  currentSetCycle: 0,
  sequenceTotal: 0,
  tabataSequences: [],
  audioEnabled: true,
  vibrationEnabled: true,
  isFloating: false,
  sessionStats: {
    totalTime: 0,
    completedSets: 0,
    completedSequences: 0
  }
};

type TimerAction =
  | { type: 'START_TIMER' }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'INCREMENT_TIME' }
  | { type: 'NEXT_PHASE' }
  | { type: 'SET_MODE'; payload: TimerMode }
  | { type: 'SET_FLOATING'; payload: boolean }
  | { type: 'ADD_TABATA'; payload: Omit<TabataConfig, 'id'> }
  | { type: 'UPDATE_TABATA'; payload: { id: string; config: Partial<TabataConfig> } }
  | { type: 'DELETE_TABATA'; payload: string }
  | { type: 'CLEAR_SEQUENCES' }
  | { type: 'TOGGLE_AUDIO' }
  | { type: 'TOGGLE_VIBRATION' }
  | { type: 'LOAD_STATE'; payload: Partial<TimerState> };

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'START_TIMER':
      console.log('START_TIMER action');
      return { ...state, isRunning: true, isPaused: false };
    
    case 'PAUSE_TIMER':
      console.log('PAUSE_TIMER action');
      return { ...state, isRunning: false, isPaused: true };
    
    case 'RESET_TIMER':
      console.log('RESET_TIMER action');
      return {
        ...state,
        isRunning: false,
        isPaused: false,
        currentTime: 0,
        currentSequenceIndex: 0,
        currentSet: 0,
        currentSetCycle: 0,
        currentPhase: state.currentMode === 'chronometer' ? 'chronometer' : 'work'
      };
    
    case 'INCREMENT_TIME':
      console.log('INCREMENT_TIME action:', { isRunning: state.isRunning, isPaused: state.isPaused, currentTime: state.currentTime });
      if (!state.isRunning || state.isPaused) {
        console.log('Timer not running or paused, returning current state');
        return state;
      }
      
      const newTime = state.currentTime + 1;
      console.log('Incrementing time from', state.currentTime, 'to', newTime);
      let newState = { ...state, currentTime: newTime };
      
      // Handle Tabata phase transitions
      if (state.currentMode === 'tabata' && state.tabataSequences.length > 0) {
        const currentTabata = state.tabataSequences[state.currentSequenceIndex];
        if (!currentTabata) return newState;
        
        const { workTime, restTime, longRestTime, sets } = currentTabata;
        
        // Check phase transitions
        if (state.currentPhase === 'work' && newTime >= workTime) {
          newState.currentTime = 0;
          newState.currentPhase = 'rest';
        } else if (state.currentPhase === 'rest' && newTime >= restTime) {
          newState.currentTime = 0;
          newState.currentSetCycle += 1;
          
          if (newState.currentSetCycle >= sets) {
            // Move to long rest or next sequence
            if (state.currentSequenceIndex < state.tabataSequences.length - 1) {
              newState.currentPhase = 'longrest';
              newState.currentSet += 1;
            } else {
              // Sequence complete
              console.log('Tabata sequence complete, stopping timer');
              newState.isRunning = false;
              newState.sessionStats.completedSequences += 1;
            }
          } else {
            newState.currentPhase = 'work';
          }
        } else if (state.currentPhase === 'longrest' && newTime >= longRestTime) {
          newState.currentTime = 0;
          newState.currentSequenceIndex += 1;
          newState.currentSetCycle = 0;
          newState.currentPhase = 'work';
        }
      }
      
      return newState;
    
    case 'NEXT_PHASE':
      if (state.currentMode === 'tabata' && state.tabataSequences.length > 0) {
        const currentTabata = state.tabataSequences[state.currentSequenceIndex];
        if (!currentTabata) return state;
        
        let newState = { ...state, currentTime: 0 };
        
        if (state.currentPhase === 'work') {
          newState.currentSetCycle += 1;
          if (newState.currentSetCycle >= currentTabata.sets) {
            newState.currentPhase = 'longrest';
            newState.currentSet += 1;
          } else {
            newState.currentPhase = 'rest';
          }
        } else if (state.currentPhase === 'rest') {
          newState.currentPhase = 'work';
        } else if (state.currentPhase === 'longrest') {
          newState.currentSequenceIndex += 1;
          newState.currentSetCycle = 0;
          newState.currentPhase = 'work';
        }
        
        return newState;
      }
      return state;
    
    case 'SET_MODE':
      return {
        ...state,
        currentMode: action.payload,
        currentPhase: action.payload === 'chronometer' ? 'chronometer' : 'work',
        currentTime: 0,
        currentSequenceIndex: 0,
        currentSet: 0,
        currentSetCycle: 0,
        sequenceTotal: action.payload === 'tabata' ? state.tabataSequences.length : 0
      };
    
    case 'SET_FLOATING':
      return { ...state, isFloating: action.payload };
    
    case 'ADD_TABATA':
      const newTabata = { ...action.payload, id: Date.now().toString() };
      const newSequences = [...state.tabataSequences, newTabata];
      return {
        ...state,
        tabataSequences: newSequences,
        sequenceTotal: newSequences.length
      };
    
    case 'UPDATE_TABATA':
      return {
        ...state,
        tabataSequences: state.tabataSequences.map(tabata =>
          tabata.id === action.payload.id
            ? { ...tabata, ...action.payload.config }
            : tabata
        )
      };
    
    case 'DELETE_TABATA':
      const filteredSequences = state.tabataSequences.filter(
        tabata => tabata.id !== action.payload
      );
      return {
        ...state,
        tabataSequences: filteredSequences,
        sequenceTotal: filteredSequences.length,
        currentSequenceIndex: Math.min(state.currentSequenceIndex, filteredSequences.length - 1)
      };
    
    case 'CLEAR_SEQUENCES':
      return {
        ...state,
        tabataSequences: [],
        sequenceTotal: 0,
        currentSequenceIndex: 0,
        currentSet: 0,
        currentSetCycle: 0
      };
    
    case 'TOGGLE_AUDIO':
      return { ...state, audioEnabled: !state.audioEnabled };
    
    case 'TOGGLE_VIBRATION':
      return { ...state, vibrationEnabled: !state.vibrationEnabled };
    
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}

const TimerContext = createContext<(TimerState & TimerActions) | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(timerReducer, initialState);
  const { saveState, loadState } = usePersistence();

  // Load persisted state on mount
  useEffect(() => {
    const persistedState = loadState();
    if (persistedState) {
      dispatch({ type: 'LOAD_STATE', payload: persistedState });
    }
  }, [loadState]);

  // Save state changes
  useEffect(() => {
    saveState(state);
  }, [state, saveState]);

  // Timer interval
  useEffect(() => {
    console.log('Timer interval effect:', { isRunning: state.isRunning, isPaused: state.isPaused, currentTime: state.currentTime });
    if (state.isRunning && !state.isPaused) {
      console.log('Starting timer interval');
      const interval = setInterval(() => {
        console.log('INCREMENT_TIME dispatched');
        dispatch({ type: 'INCREMENT_TIME' });
      }, 1000);
      return () => {
        console.log('Clearing timer interval');
        clearInterval(interval);
      };
    }
  }, [state.isRunning, state.isPaused]);

  const actions: TimerActions = {
    startTimer: () => dispatch({ type: 'START_TIMER' }),
    pauseTimer: () => dispatch({ type: 'PAUSE_TIMER' }),
    resetTimer: () => dispatch({ type: 'RESET_TIMER' }),
    nextPhase: () => dispatch({ type: 'NEXT_PHASE' }),
    setMode: (mode) => dispatch({ type: 'SET_MODE', payload: mode }),
    setFloating: (isFloating) => dispatch({ type: 'SET_FLOATING', payload: isFloating }),
    addTabataSequence: (config) => dispatch({ type: 'ADD_TABATA', payload: config }),
    updateTabataSequence: (id, config) => dispatch({ type: 'UPDATE_TABATA', payload: { id, config } }),
    deleteTabataSequence: (id) => dispatch({ type: 'DELETE_TABATA', payload: id }),
    clearAllSequences: () => dispatch({ type: 'CLEAR_SEQUENCES' }),
    toggleAudio: () => dispatch({ type: 'TOGGLE_AUDIO' }),
    toggleVibration: () => dispatch({ type: 'TOGGLE_VIBRATION' })
  };

  return (
    <TimerContext.Provider value={{ ...state, ...actions }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimerContext() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimerContext must be used within a TimerProvider');
  }
  return context;
}
