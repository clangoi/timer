import { useTimer } from '@/hooks/useTimer';
import { TabataCard } from './TabataCard';
import { Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TabataConfig } from '@/types/timer';

interface TabataSequenceManagerProps {
  onAddTabata: () => void;
  onEditTabata: (tabata: TabataConfig) => void;
}

export function TabataSequenceManager({ onAddTabata, onEditTabata }: TabataSequenceManagerProps) {
  const { tabataSequences, clearAllSequences } = useTimer();

  const handleClearAll = () => {
    if (confirm('¿Limpiar toda la secuencia? Esta acción no se puede deshacer.')) {
      clearAllSequences();
    }
  };

  return (
    <div className="mb-8" data-testid="tabata-sequence-manager">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Secuencias Tabata</h2>
        <Button
          onClick={onAddTabata}
          className="px-4 py-2 rounded-lg font-medium text-sm transition-all btn-control"
          data-testid="button-add-tabata"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar
        </Button>
      </div>
      
      {tabataSequences.length > 0 ? (
        <div className="space-y-3">
          {tabataSequences.map((tabata, index) => (
            <TabataCard
              key={tabata.id}
              tabata={tabata}
              index={index}
              onEdit={onEditTabata}
            />
          ))}
          
          <Button
            onClick={handleClearAll}
            variant="outline"
            className="w-full mt-4 py-3 border-2 border-dashed border-border text-muted-foreground rounded-xl transition-all hover:border-destructive hover:text-destructive btn-control"
            data-testid="button-clear-sequences"
          >
            <Trash className="w-4 h-4 mr-2" />
            Limpiar toda la secuencia
          </Button>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p className="mb-4">No hay secuencias Tabata configuradas</p>
          <Button onClick={onAddTabata} variant="outline" data-testid="button-add-first-tabata">
            <Plus className="w-4 h-4 mr-2" />
            Crear primera secuencia
          </Button>
        </div>
      )}
    </div>
  );
}
