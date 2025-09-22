import { useCallback } from 'react';
import { TimerState } from '@/types/timer';

const STORAGE_KEY = 'fittimer-pro-state';

export function usePersistence() {
  const saveState = useCallback((state: TimerState) => {
    try {
      const stateToSave = {
        currentMode: state.currentMode,
        currentTime: state.currentTime,
        currentPhase: state.currentPhase,
        currentSequenceIndex: state.currentSequenceIndex,
        currentSet: state.currentSet,
        currentSetCycle: state.currentSetCycle,
        tabataSequences: state.tabataSequences,
        audioEnabled: state.audioEnabled,
        vibrationEnabled: state.vibrationEnabled,
        sessionStats: state.sessionStats
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.warn('Failed to save timer state:', error);
    }
  }, []);

  const loadState = useCallback((): Partial<TimerState> | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load timer state:', error);
    }
    return null;
  }, []);

  const clearState = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear timer state:', error);
    }
  }, []);

  return { saveState, loadState, clearState };
}
