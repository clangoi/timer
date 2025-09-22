import { useEffect } from 'react';
import { useTimerContext } from '@/contexts/TimerContext';
import { useAudio } from '@/hooks/useAudio';

export function useTimer() {
  const timer = useTimerContext();
  const { handlePhaseChange, playActionSound, playCountdownSound, triggerVibration } = useAudio();

  // Handle phase changes for audio/vibration feedback
  useEffect(() => {
    handlePhaseChange(timer.currentPhase);
  }, [timer.currentPhase, handlePhaseChange]);

  // Handle completion sound
  useEffect(() => {
    // Tabata completion
    if (!timer.isRunning && timer.currentTime > 0 && timer.currentMode === 'tabata') {
      const isSequenceComplete = timer.currentSequenceIndex >= timer.tabataSequences.length;
      if (isSequenceComplete) {
        playActionSound('completion');
        triggerVibration('completion');
      }
    }
    
    // Simple countdown completion
    if (timer.currentMode === 'simple-countdown' && timer.isCompleted && timer.currentTime === 0) {
      playActionSound('completion');
      triggerVibration('completion');
    }
  }, [timer.isRunning, timer.currentTime, timer.currentMode, timer.currentSequenceIndex, timer.tabataSequences.length, timer.isCompleted, playActionSound, triggerVibration]);

  // Handle countdown sounds for last 3 seconds in Tabata and Simple Countdown modes
  useEffect(() => {
    if (timer.isRunning && !timer.isPaused) {
      // Simple countdown mode
      if (timer.currentMode === 'simple-countdown') {
        if (timer.currentTime === 3 || timer.currentTime === 2 || timer.currentTime === 1) {
          playCountdownSound(timer.currentTime);
        }
        return;
      }
      
      // Tabata mode
      if (timer.currentMode === 'tabata' && timer.tabataSequences.length > 0) {
        const currentTabata = timer.tabataSequences[timer.currentSequenceIndex];
        if (!currentTabata) return;

        let timeRemaining = 0;
        switch (timer.currentPhase) {
          case 'work':
            timeRemaining = Math.max(0, currentTabata.workTime - timer.currentTime);
            break;
          case 'rest':
            timeRemaining = Math.max(0, currentTabata.restTime - timer.currentTime);
            break;
          case 'longrest':
            timeRemaining = Math.max(0, currentTabata.longRestTime - timer.currentTime);
            break;
          default:
            return;
        }
        
        // Emitir sonidos solo cuando quedan exactamente 3, 2, o 1 segundos
        // Y solo si el tiempo está realmente corriendo (currentTime > 0 indica que el timer avanzó)
        if (timeRemaining === 3 || timeRemaining === 2 || timeRemaining === 1) {
          playCountdownSound(timeRemaining);
        }
      }
    }
  }, [timer.currentMode, timer.isRunning, timer.isPaused, timer.currentTime, timer.currentPhase, timer.currentSequenceIndex, timer.tabataSequences.length, playCountdownSound]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentTabata = () => {
    return timer.tabataSequences[timer.currentSequenceIndex] || null;
  };

  const getPhaseTimeRemaining = (): number => {
    if (timer.currentMode === 'chronometer') return 0;
    
    const currentTabata = getCurrentTabata();
    if (!currentTabata) return 0;

    switch (timer.currentPhase) {
      case 'work':
        return Math.max(0, currentTabata.workTime - timer.currentTime);
      case 'rest':
        return Math.max(0, currentTabata.restTime - timer.currentTime);
      case 'longrest':
        return Math.max(0, currentTabata.longRestTime - timer.currentTime);
      default:
        return 0;
    }
  };

  const getPhaseProgress = (): number => {
    if (timer.currentMode === 'chronometer') return 100;
    
    const currentTabata = getCurrentTabata();
    if (!currentTabata) return 0;

    let totalTime = 0;
    switch (timer.currentPhase) {
      case 'work':
        totalTime = currentTabata.workTime;
        break;
      case 'rest':
        totalTime = currentTabata.restTime;
        break;
      case 'longrest':
        totalTime = currentTabata.longRestTime;
        break;
      default:
        return 0;
    }

    return totalTime > 0 ? (timer.currentTime / totalTime) * 100 : 0;
  };

  const toggleTimer = () => {
    if (timer.isRunning) {
      timer.pauseTimer();
      playActionSound('pause');
      triggerVibration('pause');
    } else {
      timer.startTimer();
      playActionSound('start');
      triggerVibration('start');
    }
  };

  const handleNext = () => {
    timer.nextPhase();
    playActionSound('next');
    triggerVibration('next');
  };

  return {
    ...timer,
    formatTime,
    getCurrentTabata,
    getPhaseTimeRemaining,
    getPhaseProgress,
    toggleTimer,
    handleNext
  };
}
