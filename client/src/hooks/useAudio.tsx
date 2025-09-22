import { useCallback } from 'react';
import { useTimerContext } from '@/contexts/TimerContext';
import { audioManager } from '@/utils/audioUtils';
import { vibrate, vibrationPatterns } from '@/utils/vibrationUtils';
import { TimerPhase } from '@/types/timer';

export function useAudio() {
  const { audioEnabled, vibrationEnabled } = useTimerContext();
  // Temporarily removed useRef to fix runtime error
  // const lastPhaseRef = useRef<TimerPhase | null>(null);

  const playPhaseSound = useCallback(async (phase: TimerPhase) => {
    if (!audioEnabled) return;

    switch (phase) {
      case 'work':
        await audioManager.playWorkPhaseSound();
        break;
      case 'rest':
        await audioManager.playRestPhaseSound();
        break;
      case 'longrest':
        await audioManager.playLongRestSound();
        break;
      default:
        break;
    }
  }, [audioEnabled]);

  const playActionSound = useCallback(async (action: 'start' | 'pause' | 'completion' | 'next') => {
    if (!audioEnabled) return;

    switch (action) {
      case 'start':
        await audioManager.playStartSound();
        break;
      case 'pause':
        await audioManager.playPauseSound();
        break;
      case 'completion':
        await audioManager.playCompletionSound();
        break;
      default:
        break;
    }
  }, [audioEnabled]);

  const triggerVibration = useCallback((pattern: keyof typeof vibrationPatterns) => {
    if (vibrationEnabled) {
      vibrate(vibrationPatterns[pattern]);
    }
  }, [vibrationEnabled]);

  const handlePhaseChange = useCallback((newPhase: TimerPhase) => {
    // Temporarily simplified to fix runtime error - always play sounds
    playPhaseSound(newPhase);
    
    switch (newPhase) {
      case 'work':
        triggerVibration('work');
        break;
      case 'rest':
        triggerVibration('rest');
        break;
      case 'longrest':
        triggerVibration('longRest');
        break;
    }
  }, [playPhaseSound, triggerVibration]);

  return {
    playPhaseSound,
    playActionSound,
    triggerVibration,
    handlePhaseChange
  };
}
