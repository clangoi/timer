import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {

  return (
    <header className="bg-card/90 border-b border-border sticky top-0 z-50 backdrop-blur-sm" data-testid="header-main">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 className="text-lg font-semibold" data-testid="text-app-title">FitTimer Pro</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 hover:bg-muted rounded-lg"
            data-testid="button-settings"
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </header>
  );
}
