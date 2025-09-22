import { TabataConfig } from '@/types/timer';
import { useTimer } from '@/hooks/useTimer';
import { Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TabataCardProps {
  tabata: TabataConfig;
  index: number;
  onEdit: (tabata: TabataConfig) => void;
}

export function TabataCard({ tabata, index, onEdit }: TabataCardProps) {
  const { deleteTabataSequence } = useTimer();

  const handleDelete = () => {
    if (confirm('¿Eliminar esta secuencia Tabata?')) {
      deleteTabataSequence(tabata.id);
    }
  };

  const getPhaseColor = (phaseIndex: number) => {
    const colors = ['bg-work', 'bg-longrest', 'bg-rest'];
    return colors[phaseIndex % colors.length];
  };

  return (
    <div className="sequence-card bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all" data-testid={`tabata-card-${tabata.id}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 ${getPhaseColor(index)} rounded-lg flex items-center justify-center`}>
            <span className="text-white font-bold text-sm">{index + 1}</span>
          </div>
          <div>
            <h3 className="font-semibold" data-testid={`text-tabata-name-${tabata.id}`}>{tabata.name}</h3>
            <p className="text-sm text-muted-foreground">
              {tabata.workTime}s trabajo / {tabata.restTime}s descanso
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            onClick={() => onEdit(tabata)}
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            data-testid={`button-edit-tabata-${tabata.id}`}
          >
            <Edit2 className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Button
            onClick={handleDelete}
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            data-testid={`button-delete-tabata-${tabata.id}`}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-work/10 rounded-lg p-2">
          <div className="font-medium" data-testid={`text-work-time-${tabata.id}`}>{tabata.workTime}s</div>
          <div className="text-muted-foreground">Trabajo</div>
        </div>
        <div className="bg-rest/10 rounded-lg p-2">
          <div className="font-medium" data-testid={`text-rest-time-${tabata.id}`}>{tabata.restTime}s</div>
          <div className="text-muted-foreground">Descanso</div>
        </div>
        <div className="bg-muted rounded-lg p-2">
          <div className="font-medium" data-testid={`text-sets-${tabata.id}`}>{tabata.sets}</div>
          <div className="text-muted-foreground">Sets</div>
        </div>
      </div>
    </div>
  );
}
