import { useTimer } from '@/hooks/useTimer';
import { Play, Pause, RotateCcw, SkipForward, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ControlButtonsProps {
  onOpenConfig: () => void;
}

export function ControlButtons({ onOpenConfig }: ControlButtonsProps) {
  const { isRunning, toggleTimer, resetTimer, handleNext, currentMode } = useTimer();

  return (
    <div className="mb-8" data-testid="control-buttons">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Button
          onClick={toggleTimer}
          className={`py-4 px-6 rounded-xl font-semibold text-lg transition-all btn-control flex items-center justify-center space-x-2 ${
            isRunning 
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
          data-testid="button-play-pause"
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          <span>{isRunning ? 'Pausar' : 'Iniciar'}</span>
        </Button>
        
        <Button
          onClick={resetTimer}
          className="bg-gray-500 hover:bg-gray-600 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all btn-control flex items-center justify-center space-x-2"
          data-testid="button-reset"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Reiniciar</span>
        </Button>
      </div>
      
      {currentMode !== 'chronometer' && (
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleNext}
            variant="outline"
            className="py-3 px-4 rounded-lg font-medium text-sm transition-all btn-control hover:bg-muted"
            data-testid="button-next"
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Siguiente
          </Button>
          
          <Button
            onClick={onOpenConfig}
            variant="outline"
            className="py-3 px-4 rounded-lg font-medium text-sm transition-all btn-control hover:bg-muted"
            data-testid="button-config"
          >
            <Settings className="w-4 h-4 mr-2" />
            Config
          </Button>
        </div>
      )}
    </div>
  );
}
