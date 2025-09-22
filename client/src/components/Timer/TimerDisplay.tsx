import { useTimer } from '@/hooks/useTimer';
import { cn } from '@/lib/utils';

export function TimerDisplay() {
  const { 
    currentTime, 
    currentMode, 
    currentPhase, 
    isRunning, 
    formatTime, 
    getCurrentTabata,
    getPhaseTimeRemaining,
    getPhaseProgress,
    currentSequenceIndex,
    sequenceTotal,
    currentSet,
    currentSetCycle
  } = useTimer();

  const getPhaseLabel = () => {
    switch (currentPhase) {
      case 'work':
        return 'TRABAJO';
      case 'rest':
        return 'DESCANSO';
      case 'longrest':
        return 'DESCANSO LARGO';
      case 'chronometer':
        return 'CRONÓMETRO LIBRE';
      case 'simple-countdown':
        return 'TEMPORIZADOR';
      default:
        return '';
    }
  };

  const getPhaseClasses = () => {
    const baseClasses = "rounded-2xl p-8 text-center transition-all duration-300";
    const phaseClasses = {
      work: "phase-work",
      rest: "phase-rest", 
      longrest: "phase-longrest",
      chronometer: "phase-chronometer",
      'simple-countdown': "phase-chronometer"
    };
    
    return cn(baseClasses, phaseClasses[currentPhase]);
  };

  const displayTime = currentMode === 'chronometer' 
    ? formatTime(currentTime)
    : currentMode === 'simple-countdown'
    ? formatTime(currentTime)
    : formatTime(getPhaseTimeRemaining());

  const progressPercentage = getPhaseProgress();

  const getProgressText = () => {
    if (currentMode === 'chronometer') {
      return 'Tiempo transcurrido';
    }
    
    const currentTabata = getCurrentTabata();
    if (!currentTabata) return '';
    
    if (currentPhase === 'longrest') {
      return `Secuencia ${currentSequenceIndex + 1}/${sequenceTotal} - Descanso entre secuencias`;
    }
    
    return `Set ${currentSetCycle + 1}/${currentTabata.sets} - Secuencia ${currentSequenceIndex + 1}/${sequenceTotal}`;
  };

  return (
    <div className="mb-8" data-testid="timer-display">
      <div className={getPhaseClasses()}>
        <div className="mb-4">
          <span className="text-sm font-medium opacity-90 uppercase tracking-wider" data-testid="text-phase-label">
            {getPhaseLabel()}
          </span>
        </div>
        
        <div className="timer-display text-6xl font-bold mb-4" data-testid="text-timer-value">
          {displayTime}
        </div>
        
        <div className="mb-4 opacity-90">
          <span className="text-sm" data-testid="text-progress-info">
            {getProgressText()}
          </span>
        </div>
        
        <div className="bg-black bg-opacity-20 rounded-full h-1 w-full mb-4">
          <div 
            className="bg-white h-1 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
            data-testid="progress-bar"
          />
        </div>
      </div>
    </div>
  );
}
