import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { TimerState, TimerActions, TimerMode, TabataConfig, TabataSet } from '@/types/timer';
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
  tabataSets: [],
  audioEnabled: true,
  vibrationEnabled: true,
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
  | { type: 'ADD_TABATA'; payload: Omit<TabataConfig, 'id'> }
  | { type: 'UPDATE_TABATA'; payload: { id: string; config: Partial<TabataConfig> } }
  | { type: 'DELETE_TABATA'; payload: string }
  | { type: 'CLEAR_SEQUENCES' }
  | { type: 'LOAD_TABATA_SET'; payload: string }
  | { type: 'ADD_TABATA_SET'; payload: Omit<TabataSet, 'id' | 'createdAt'> }
  | { type: 'UPDATE_TABATA_SET'; payload: { id: string; set: Partial<TabataSet> } }
  | { type: 'DELETE_TABATA_SET'; payload: string }
  | { type: 'TOGGLE_AUDIO' }
  | { type: 'TOGGLE_VIBRATION' }
  | { type: 'LOAD_STATE'; payload: Partial<TimerState> };

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'START_TIMER':
      return { ...state, isRunning: true, isPaused: false };
    
    case 'PAUSE_TIMER':
      return { ...state, isRunning: false, isPaused: true };
    
    case 'RESET_TIMER':
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
      if (!state.isRunning || state.isPaused) return state;
      
      const newTime = state.currentTime + 1;
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

    case 'LOAD_TABATA_SET':
      const setToLoad = state.tabataSets.find(set => set.id === action.payload);
      if (!setToLoad) return state;
      return {
        ...state,
        tabataSequences: [...setToLoad.sequences],
        sequenceTotal: setToLoad.sequences.length,
        currentSequenceIndex: 0,
        currentSet: 0,
        currentMode: 'tabata',
        isRunning: false,
        isPaused: false,
        currentSetCycle: 0,
        currentTime: 0,
        currentPhase: 'work'
      };

    case 'ADD_TABATA_SET':
      const newSet = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: Date.now()
      };
      return {
        ...state,
        tabataSets: [...state.tabataSets, newSet]
      };

    case 'UPDATE_TABATA_SET':
      return {
        ...state,
        tabataSets: state.tabataSets.map(set =>
          set.id === action.payload.id ? { ...set, ...action.payload.set } : set
        )
      };

    case 'DELETE_TABATA_SET':
      return {
        ...state,
        tabataSets: state.tabataSets.filter(set => set.id !== action.payload)
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
    } else {
      // Initialize with sample sets if no data exists
      const sampleSets = [
        {
          name: 'Entrenamiento Básico',
          description: 'Set de iniciación para principiantes',
          sequences: [
            { id: 'sample1', name: 'Calentamiento', workTime: 30, restTime: 15, longRestTime: 60, sets: 3 },
            { id: 'sample2', name: 'Cardio Básico', workTime: 45, restTime: 15, longRestTime: 60, sets: 4 }
          ]
        },
        {
          name: 'HIIT Intenso', 
          description: 'Entrenamiento de alta intensidad',
          sequences: [
            { id: 'sample3', name: 'Sprint', workTime: 20, restTime: 10, longRestTime: 90, sets: 8 },
            { id: 'sample4', name: 'Burpees', workTime: 30, restTime: 30, longRestTime: 120, sets: 5 }
          ]
        }
      ];
      
      sampleSets.forEach(set => {
        dispatch({ type: 'ADD_TABATA_SET', payload: set });
      });
    }
  }, [loadState]);

  // Save state changes
  useEffect(() => {
    saveState(state);
  }, [state, saveState]);

  // Timer interval
  useEffect(() => {
    if (state.isRunning && !state.isPaused) {
      const interval = setInterval(() => {
        dispatch({ type: 'INCREMENT_TIME' });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state.isRunning, state.isPaused]);

  const actions: TimerActions = {
    startTimer: () => dispatch({ type: 'START_TIMER' }),
    pauseTimer: () => dispatch({ type: 'PAUSE_TIMER' }),
    resetTimer: () => dispatch({ type: 'RESET_TIMER' }),
    nextPhase: () => dispatch({ type: 'NEXT_PHASE' }),
    setMode: (mode) => dispatch({ type: 'SET_MODE', payload: mode }),
    addTabataSequence: (config) => dispatch({ type: 'ADD_TABATA', payload: config }),
    updateTabataSequence: (id, config) => dispatch({ type: 'UPDATE_TABATA', payload: { id, config } }),
    deleteTabataSequence: (id) => dispatch({ type: 'DELETE_TABATA', payload: id }),
    clearAllSequences: () => dispatch({ type: 'CLEAR_SEQUENCES' }),
    loadTabataSet: (setId) => dispatch({ type: 'LOAD_TABATA_SET', payload: setId }),
    addTabataSet: (set) => dispatch({ type: 'ADD_TABATA_SET', payload: set }),
    updateTabataSet: (id, set) => dispatch({ type: 'UPDATE_TABATA_SET', payload: { id, set } }),
    deleteTabataSet: (id) => dispatch({ type: 'DELETE_TABATA_SET', payload: id }),
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
