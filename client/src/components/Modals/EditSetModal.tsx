import { useState, useEffect } from 'react';
import { useTimer } from '@/hooks/useTimer';
import { useToast } from '@/hooks/use-toast';
import { TabataSet } from '@/types/timer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface EditSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  set: TabataSet | null;
}

export function EditSetModal({ isOpen, onClose, set }: EditSetModalProps) {
  const { tabataSequences, updateTabataSet } = useTimer();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [replaceSequences, setReplaceSequences] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when set changes
  useEffect(() => {
    if (set) {
      setName(set.name);
      setDescription(set.description || '');
      setReplaceSequences(false);
    }
  }, [set]);

  const handleSave = async () => {
    if (!set || !name.trim()) {
      toast({
        title: "Error",
        description: "El nombre del set es requerido",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const updates: Partial<TabataSet> = {
        name: name.trim(),
        description: description.trim() || undefined,
      };

      // If user wants to replace sequences with current timer sequences
      if (replaceSequences && tabataSequences.length > 0) {
        updates.sequences = [...tabataSequences];
      }

      updateTabataSet(set.id, updates);

      toast({
        title: "¡Set actualizado!",
        description: `El set "${name}" ha sido actualizado exitosamente`,
      });

      handleClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el set. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setReplaceSequences(false);
    onClose();
  };

  if (!set) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]" data-testid="edit-set-modal">
        <DialogHeader>
          <DialogTitle data-testid="modal-title">Editar Set de Tabata</DialogTitle>
          <DialogDescription>
            Modifica la información del set "{set.name}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-set-name">Nombre del Set</Label>
            <Input
              id="edit-set-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Entrenamiento Full Body"
              data-testid="input-edit-set-name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-set-description">Descripción (opcional)</Label>
            <Textarea
              id="edit-set-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción del entrenamiento..."
              rows={3}
              data-testid="textarea-edit-set-description"
            />
          </div>

          {tabataSequences.length > 0 && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="replace-sequences"
                checked={replaceSequences}
                onCheckedChange={(checked) => setReplaceSequences(checked === true)}
                data-testid="checkbox-replace-sequences"
              />
              <Label htmlFor="replace-sequences" className="text-sm">
                Reemplazar secuencias con las del timer actual ({tabataSequences.length})
              </Label>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <strong>Secuencias actuales en el set:</strong>
            <ul className="mt-1 space-y-1">
              {set.sequences.map((seq, index) => (
                <li key={seq.id} className="text-xs">
                  {index + 1}. {seq.name} ({seq.workTime}s/{seq.restTime}s × {seq.sets})
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            data-testid="button-cancel"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isLoading || !name.trim()}
            data-testid="button-save-set"
          >
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}