import { useTimer } from '@/hooks/useTimer';
import { Play, Pause, Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FloatingTimer() {
  const { 
    isFloating, 
    isRunning, 
    currentTime, 
    currentMode,
    currentPhase, 
    formatTime, 
    toggleTimer, 
    setFloating,
    getPhaseTimeRemaining
  } = useTimer();

  if (!isFloating) return null;

  const getPhaseLabel = () => {
    switch (currentPhase) {
      case 'work':
        return 'TRABAJO';
      case 'rest':
        return 'DESCANSO';
      case 'longrest':
        return 'DESCANSO LARGO';
      case 'chronometer':
        return 'CRONÓMETRO';
      default:
        return '';
    }
  };

  return (
    <div 
      className="floating-timer bg-card/95 border border-border rounded-2xl p-4 shadow-2xl min-w-[200px] backdrop-blur-sm"
      data-testid="floating-timer"
    >
      <div className="text-center">
        <div className="text-xs font-medium opacity-75 mb-1 uppercase tracking-wider" data-testid="text-floating-phase">
          {getPhaseLabel()}
        </div>
        <div className="timer-display text-2xl font-bold mb-2" data-testid="text-floating-time">
          {currentMode === 'chronometer' 
            ? formatTime(currentTime)
            : formatTime(getPhaseTimeRemaining())
          }
        </div>
        <div className="flex justify-center space-x-2">
          <Button
            onClick={toggleTimer}
            size="sm"
            className={`p-2 rounded-lg btn-control ${
              isRunning 
                ? 'bg-yellow-500 hover:bg-yellow-600' 
                : 'bg-primary hover:bg-primary/90'
            } text-white`}
            data-testid="button-floating-play-pause"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            onClick={() => setFloating(false)}
            size="sm"
            variant="secondary"
            className="p-2 rounded-lg btn-control"
            data-testid="button-floating-expand"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setFloating(false)}
            size="sm"
            variant="destructive"
            className="p-2 rounded-lg btn-control"
            data-testid="button-floating-close"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
