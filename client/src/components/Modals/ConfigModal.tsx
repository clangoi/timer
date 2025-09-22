import { useState, useEffect } from 'react';
import { useTimer } from '@/hooks/useTimer';
import { TabataConfig } from '@/types/timer';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTabata?: TabataConfig | null;
}

export function ConfigModal({ isOpen, onClose, editingTabata }: ConfigModalProps) {
  const { addTabataSequence, updateTabataSequence, audioEnabled, vibrationEnabled, toggleAudio, toggleVibration } = useTimer();
  
  const [formData, setFormData] = useState({
    name: '',
    workTime: 20,
    restTime: 10,
    longRestTime: 60,
    sets: 8
  });

  useEffect(() => {
    if (editingTabata) {
      setFormData({
        name: editingTabata.name,
        workTime: editingTabata.workTime,
        restTime: editingTabata.restTime,
        longRestTime: editingTabata.longRestTime,
        sets: editingTabata.sets
      });
    } else {
      setFormData({
        name: '',
        workTime: 20,
        restTime: 10,
        longRestTime: 60,
        sets: 8
      });
    }
  }, [editingTabata, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Por favor ingresa un nombre para el ejercicio');
      return;
    }

    if (editingTabata) {
      updateTabataSequence(editingTabata.id, formData);
    } else {
      addTabataSequence(formData);
    }
    
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full max-h-[90vh] overflow-y-auto" data-testid="config-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {editingTabata ? 'Editar Timer' : 'Configurar Timer'}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              data-testid="button-close-config"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Timer Configuration */}
          <div>
            <h3 className="font-semibold mb-3">Configuración del Timer</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="exerciseName" className="block text-sm font-medium mb-2">
                  Nombre del Ejercicio
                </Label>
                <Input
                  id="exerciseName"
                  type="text"
                  placeholder="Ej: Sprint Intenso"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full"
                  data-testid="input-exercise-name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workTime" className="block text-sm font-medium mb-2">
                    Tiempo Trabajo (seg)
                  </Label>
                  <Input
                    id="workTime"
                    type="number"
                    min="1"
                    max="3600"
                    value={formData.workTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, workTime: parseInt(e.target.value) || 0 }))}
                    className="w-full"
                    data-testid="input-work-time"
                  />
                </div>
                <div>
                  <Label htmlFor="restTime" className="block text-sm font-medium mb-2">
                    Descanso Corto (seg)
                  </Label>
                  <Input
                    id="restTime"
                    type="number"
                    min="1"
                    max="3600"
                    value={formData.restTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, restTime: parseInt(e.target.value) || 0 }))}
                    className="w-full"
                    data-testid="input-rest-time"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="longRestTime" className="block text-sm font-medium mb-2">
                    Descanso Largo (seg)
                  </Label>
                  <Input
                    id="longRestTime"
                    type="number"
                    min="1"
                    max="3600"
                    value={formData.longRestTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, longRestTime: parseInt(e.target.value) || 0 }))}
                    className="w-full"
                    data-testid="input-long-rest-time"
                  />
                </div>
                <div>
                  <Label htmlFor="sets" className="block text-sm font-medium mb-2">
                    Número de Sets
                  </Label>
                  <Input
                    id="sets"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.sets}
                    onChange={(e) => setFormData(prev => ({ ...prev, sets: parseInt(e.target.value) || 0 }))}
                    className="w-full"
                    data-testid="input-sets"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Audio Settings */}
          <div>
            <h3 className="font-semibold mb-3">Configuración de Audio</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="audioEnabled" className="text-sm">Sonidos de fase</Label>
                <Switch
                  id="audioEnabled"
                  checked={audioEnabled}
                  onCheckedChange={toggleAudio}
                  data-testid="switch-audio"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="vibrationEnabled" className="text-sm">Vibración</Label>
                <Switch
                  id="vibrationEnabled"
                  checked={vibrationEnabled}
                  onCheckedChange={toggleVibration}
                  data-testid="switch-vibration"
                />
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              type="submit"
              className="flex-1 font-semibold transition-all btn-control"
              data-testid="button-save-config"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
            <Button
              type="button"
              onClick={handleCancel}
              variant="secondary"
              className="flex-1 font-semibold transition-all btn-control"
              data-testid="button-cancel-config"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
