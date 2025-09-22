import { useTimer } from '@/hooks/useTimer';
import { Clock, Repeat } from 'lucide-react';
import { TimerMode } from '@/types/timer';

export function ModeSelector() {
  const { currentMode, setMode, isRunning } = useTimer();

  const modes = [
    { id: 'chronometer' as TimerMode, label: 'Cronómetro', icon: Clock },
    { id: 'tabata' as TimerMode, label: 'Tabata', icon: Repeat }
  ];

  return (
    <div className="mb-6" data-testid="mode-selector">
      <div className="bg-card rounded-xl p-1 flex space-x-1 border border-border">
        {modes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => !isRunning && setMode(id)}
            disabled={isRunning}
            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all btn-control flex items-center justify-center space-x-2 ${
              currentMode === id
                ? 'bg-primary text-primary-foreground'
                : isRunning
                ? 'text-muted-foreground/50 cursor-not-allowed'
                : 'text-muted-foreground hover:bg-muted'
            }`}
            data-testid={`button-mode-${id}`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
