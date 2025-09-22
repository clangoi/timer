import { useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { ModeSelector } from '@/components/Layout/ModeSelector';
import { TimerDisplay } from '@/components/Timer/TimerDisplay';
import { ControlButtons } from '@/components/Timer/ControlButtons';
import { SimpleCountdown } from '@/components/Timer/SimpleCountdown';
import { TabataSequenceManager } from '@/components/Tabata/TabataSequenceManager';
import { ConfigModal } from '@/components/Modals/ConfigModal';
import { QuickStats } from '@/components/Stats/QuickStats';
import { BottomNavigation } from '@/components/Layout/BottomNavigation';
import { useTimer } from '@/hooks/useTimer';
import { TabataConfig } from '@/types/timer';

export default function Timer() {
  const { currentMode } = useTimer();
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [editingTabata, setEditingTabata] = useState<TabataConfig | null>(null);

  const handleOpenConfig = () => {
    setEditingTabata(null);
    setIsConfigOpen(true);
  };

  const handleAddTabata = () => {
    setEditingTabata(null);
    setIsConfigOpen(true);
  };

  const handleEditTabata = (tabata: TabataConfig) => {
    setEditingTabata(tabata);
    setIsConfigOpen(true);
  };

  const handleCloseConfig = () => {
    setIsConfigOpen(false);
    setEditingTabata(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground" data-testid="timer-page">
      <Header />
      
      <main className="max-w-md mx-auto p-4 pb-20">
        <ModeSelector />
        
        {currentMode === 'simple-countdown' ? (
          <SimpleCountdown />
        ) : (
          <>
            <TimerDisplay />
            <ControlButtons onOpenConfig={handleOpenConfig} />
            
            {currentMode === 'tabata' && (
              <TabataSequenceManager 
                onAddTabata={handleAddTabata}
                onEditTabata={handleEditTabata}
              />
            )}
          </>
        )}
        
        <QuickStats />
      </main>

      <BottomNavigation />
      
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={handleCloseConfig}
        editingTabata={editingTabata}
      />
    </div>
  );
}
