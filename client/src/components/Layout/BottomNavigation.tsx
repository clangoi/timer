import { BarChart3, Timer } from 'lucide-react';
import { Link, useLocation } from 'wouter';

export function BottomNavigation() {
  const [location] = useLocation();
  
  const navItems = [
    { icon: Timer, label: 'Timer', path: '/timer', active: location === '/timer' },
    { icon: BarChart3, label: 'Sets', path: '/sets', active: location === '/sets' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border" data-testid="bottom-navigation">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex justify-around">
          {navItems.map(({ icon: Icon, label, path, active }) => (
            <Link key={label} href={path} asChild>
              <button
                className={`flex flex-col items-center py-2 px-3 transition-colors ${
                  active ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                }`}
                data-testid={`nav-${label.toLowerCase()}`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
