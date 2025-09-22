import { useState } from 'react';
import { useTimer } from '@/hooks/useTimer';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SaveSetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SaveSetModal({ isOpen, onClose }: SaveSetModalProps) {
  const { tabataSequences, addTabataSet } = useTimer();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "El nombre del set es requerido",
        variant: "destructive",
      });
      return;
    }

    if (tabataSequences.length === 0) {
      toast({
        title: "Error", 
        description: "No hay secuencias para guardar",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      addTabataSet({
        name: name.trim(),
        description: description.trim() || undefined,
        sequences: [...tabataSequences] // Create a copy
      });

      toast({
        title: "¡Set guardado!",
        description: `El set "${name}" ha sido guardado exitosamente`,
      });

      // Reset form and close
      setName('');
      setDescription('');
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el set. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]" data-testid="save-set-modal">
        <DialogHeader>
          <DialogTitle data-testid="modal-title">Guardar Set de Tabata</DialogTitle>
          <DialogDescription>
            Guarda las {tabataSequences.length} secuencias actuales como un set reutilizable
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="set-name">Nombre del Set</Label>
            <Input
              id="set-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Entrenamiento Full Body"
              data-testid="input-set-name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="set-description">Descripción (opcional)</Label>
            <Textarea
              id="set-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción del entrenamiento..."
              rows={3}
              data-testid="textarea-set-description"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <strong>Secuencias incluidas:</strong>
            <ul className="mt-1 space-y-1">
              {tabataSequences.map((seq, index) => (
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
            {isLoading ? 'Guardando...' : 'Guardar Set'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}