import { useTimer } from '@/hooks/useTimer';

export function QuickStats() {
  const { sessionStats, formatTime } = useTimer();

  return (
    <div className="mb-8" data-testid="quick-stats">
      <h2 className="text-xl font-semibold mb-4">Estadísticas de Sesión</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary" data-testid="text-total-time">
            {formatTime(sessionStats.totalTime)}
          </div>
          <div className="text-sm text-muted-foreground">Tiempo Total</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-work" data-testid="text-completed-sets">
            {sessionStats.completedSets}
          </div>
          <div className="text-sm text-muted-foreground">Sets Completados</div>
        </div>
      </div>
    </div>
  );
}
