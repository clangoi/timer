import { useState } from 'react';
import { useTimer } from '@/hooks/useTimer';
import { TabataSet, TabataConfig } from '@/types/timer';
import { Header } from '@/components/Layout/Header';
import { BottomNavigation } from '@/components/Layout/BottomNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Play, Edit3, Trash2, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { SaveSetModal } from '@/components/Modals/SaveSetModal';
import { EditSetModal } from '@/components/Modals/EditSetModal';

export default function TabataSets() {
  const { tabataSets, tabataSequences, loadTabataSet, deleteTabataSet, addTabataSet, updateTabataSet } = useTimer();
  const [selectedSet, setSelectedSet] = useState<TabataSet | null>(null);
  const [, navigate] = useLocation();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSet, setEditingSet] = useState<TabataSet | null>(null);

  const handleLoadSet = (set: TabataSet) => {
    loadTabataSet(set.id);
    // Navigate back to timer after loading
    navigate('/');
  };

  const handleDeleteSet = (setId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este set?')) {
      deleteTabataSet(setId);
    }
  };

  const handleEditSet = (set: TabataSet) => {
    setEditingSet(set);
    setShowEditModal(true);
  };

  const formatDuration = (sequences: TabataConfig[]) => {
    const totalSeconds = sequences.reduce((total, seq) => {
      return total + ((seq.workTime + seq.restTime) * seq.sets);
    }, 0);
    const minutes = Math.floor(totalSeconds / 60);
    return `${minutes} min`;
  };

  if (selectedSet) {
    return (
      <div className="min-h-screen bg-background text-foreground" data-testid="tabata-sets-detail">
        <Header />
        
        <main className="max-w-md mx-auto p-4 pb-20">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedSet(null)}
              className="mr-3"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-set-title">
                {selectedSet.name}
              </h1>
              {selectedSet.description && (
                <p className="text-muted-foreground text-sm" data-testid="text-set-description">
                  {selectedSet.description}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {selectedSet.sequences.map((sequence, index) => (
              <Card key={sequence.id} data-testid={`sequence-card-${sequence.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg" data-testid={`text-sequence-name-${sequence.id}`}>
                        {index + 1}. {sequence.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {sequence.workTime}s trabajo / {sequence.restTime}s descanso
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" data-testid={`badge-sets-${sequence.id}`}>
                      {sequence.sets} sets
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="mt-8 space-y-3">
            <Button
              onClick={() => handleLoadSet(selectedSet)}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 text-lg font-semibold"
              data-testid="button-load-set"
            >
              <Play className="w-5 h-5 mr-2" />
              Cargar Set Completo
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Duración estimada: {formatDuration(selectedSet.sequences)}
            </p>
          </div>
        </main>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground" data-testid="tabata-sets-page">
      <Header />
      
      <main className="max-w-md mx-auto p-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold" data-testid="text-page-title">
            Sets de Tabata
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSaveModal(true)}
            disabled={tabataSequences.length === 0}
            data-testid="button-create-set"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Set
          </Button>
        </div>

        {tabataSets.length === 0 ? (
          <div className="text-center py-12" data-testid="empty-state">
            <div className="text-muted-foreground mb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Plus className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium mb-2">No hay sets guardados</h3>
              <p className="text-sm">
                Crea secuencias en el Timer y luego podrás guardarlas como sets
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" data-testid="button-go-timer">
                Ir al Timer
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {tabataSets.map((set) => (
              <Card 
                key={set.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedSet(set)}
                data-testid={`set-card-${set.id}`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg" data-testid={`text-set-name-${set.id}`}>
                        {set.name}
                      </CardTitle>
                      {set.description && (
                        <CardDescription className="mt-1" data-testid={`text-set-desc-${set.id}`}>
                          {set.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLoadSet(set);
                        }}
                        data-testid={`button-load-${set.id}`}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditSet(set);
                        }}
                        data-testid={`button-edit-${set.id}`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSet(set.id);
                        }}
                        data-testid={`button-delete-${set.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span data-testid={`text-sequences-count-${set.id}`}>
                      {set.sequences.length} secuencias
                    </span>
                    <span data-testid={`text-duration-${set.id}`}>
                      {formatDuration(set.sequences)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {tabataSequences.length > 0 && (
          <div className="mt-8 p-4 bg-muted/50 rounded-lg" data-testid="current-sequences">
            <h3 className="font-medium mb-2">Secuencias Actuales en Timer</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {tabataSequences.length} secuencias cargadas
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSaveModal(true)}
              data-testid="button-save-current"
            >
              <Plus className="w-4 h-4 mr-2" />
              Guardar como Set
            </Button>
          </div>
        )}
      </main>

      <BottomNavigation />
      
      <SaveSetModal 
        isOpen={showSaveModal} 
        onClose={() => setShowSaveModal(false)} 
      />
      
      <EditSetModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        set={editingSet}
      />
    </div>
  );
}