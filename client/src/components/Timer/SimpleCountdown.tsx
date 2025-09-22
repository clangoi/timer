import { useState, useEffect } from 'react';
import { useTimer } from '@/hooks/useTimer';
import { useAudio } from '@/hooks/useAudio';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

export function SimpleCountdown() {
  const { 
    currentTime, 
    isRunning, 
    isPaused,
    isCompleted,
    formatTime, 
    startTimer,
    pauseTimer,
    resetTimer,
    setSimpleCountdownTime,
    simpleCountdownInitialTime
  } = useTimer();
  
  const { playActionSound, triggerVibration } = useAudio();
  
  const [configMode, setConfigMode] = useState(false);
  const [minutes, setMinutes] = useState(Math.floor(simpleCountdownInitialTime / 60));
  const [seconds, setSeconds] = useState(simpleCountdownInitialTime % 60);

  // Note: Completion sound/vibration is handled by useTimer hook to avoid duplication

  const handleToggleTimer = () => {
    if (isRunning) {
      pauseTimer();
      playActionSound('pause');
    } else {
      startTimer();
      playActionSound('start');
    }
  };

  const handleReset = () => {
    resetTimer();
    setConfigMode(false);
  };

  const handleApplyConfig = () => {
    const totalSeconds = (minutes * 60) + seconds;
    if (totalSeconds > 0) {
      setSimpleCountdownTime(totalSeconds);
      setConfigMode(false);
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(99, parseInt(e.target.value) || 0));
    setMinutes(value);
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
    setSeconds(value);
  };

  const getTimerClasses = () => {
    const baseClasses = "rounded-2xl p-8 text-center transition-all duration-300";
    if (isCompleted) {
      return cn(baseClasses, "phase-completion");
    } else if (isRunning) {
      return cn(baseClasses, "phase-work");
    } else if (isPaused) {
      return cn(baseClasses, "phase-paused");
    } else {
      return cn(baseClasses, "phase-chronometer");
    }
  };

  const getProgressPercentage = () => {
    if (simpleCountdownInitialTime === 0) return 0;
    return Math.max(0, ((simpleCountdownInitialTime - currentTime) / simpleCountdownInitialTime) * 100);
  };

  if (configMode) {
    return (
      <div className="mb-8" data-testid="simple-countdown-config">
        <div className="rounded-2xl p-8 bg-card border border-border">
          <h3 className="text-lg font-semibold mb-6 text-center">Configurar Temporizador</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="minutes" className="text-sm font-medium">Minutos</Label>
              <Input
                id="minutes"
                type="number"
                min="0"
                max="99"
                value={minutes}
                onChange={handleMinutesChange}
                className="mt-2 text-center text-lg"
                data-testid="input-minutes"
              />
            </div>
            <div>
              <Label htmlFor="seconds" className="text-sm font-medium">Segundos</Label>
              <Input
                id="seconds"
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={handleSecondsChange}
                className="mt-2 text-center text-lg"
                data-testid="input-seconds"
              />
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="text-2xl font-bold text-muted-foreground" data-testid="text-preview-time">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Tiempo configurado</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleApplyConfig}
              disabled={minutes === 0 && seconds === 0}
              className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium"
              data-testid="button-apply-config"
            >
              Aplicar
            </Button>
            <Button
              onClick={() => setConfigMode(false)}
              variant="outline"
              className="py-3 px-4 rounded-lg font-medium"
              data-testid="button-cancel-config"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8" data-testid="simple-countdown-display">
      {/* Timer Display */}
      <div className={getTimerClasses()}>
        <div className="mb-4">
          <span className="text-sm font-medium opacity-90 uppercase tracking-wider" data-testid="text-phase-label">
            TEMPORIZADOR
          </span>
        </div>
        
        <div className="timer-display text-6xl font-bold mb-4" data-testid="text-timer-value">
          {formatTime(currentTime)}
        </div>
        
        <div className="mb-4 opacity-90">
          <span className="text-sm" data-testid="text-status">
            {isCompleted ? 'Temporizador completado' : 
             isRunning ? 'Cuenta regresiva en curso' :
             isPaused ? 'Temporizador pausado' : 'Listo para iniciar'}
          </span>
        </div>
        
        <div className="bg-black bg-opacity-20 rounded-full h-1 w-full mb-4">
          <div 
            className="bg-white h-1 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
            data-testid="progress-bar"
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="control-buttons">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button
            onClick={handleToggleTimer}
            disabled={isCompleted || currentTime === 0}
            className={cn(
              "py-4 px-6 rounded-xl font-semibold text-lg transition-all btn-control flex items-center justify-center space-x-2",
              isRunning 
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            )}
            data-testid="button-play-pause"
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isRunning ? 'Pausar' : 'Iniciar'}</span>
          </Button>
          
          <Button
            onClick={handleReset}
            className="bg-gray-500 hover:bg-gray-600 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all btn-control flex items-center justify-center space-x-2"
            data-testid="button-reset"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reiniciar</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          <Button
            onClick={() => setConfigMode(true)}
            disabled={isRunning}
            variant="outline"
            className="py-3 px-4 rounded-lg font-medium text-sm transition-all btn-control hover:bg-muted"
            data-testid="button-config"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configurar Tiempo
          </Button>
        </div>
      </div>
    </div>
  );
}