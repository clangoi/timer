import { BarChart3, Dumbbell, Timer, User } from 'lucide-react';

export function BottomNavigation() {
  const navItems = [
    { icon: Timer, label: 'Timer', active: true },
    { icon: BarChart3, label: 'Stats', active: false },
    { icon: Dumbbell, label: 'Workouts', active: false },
    { icon: User, label: 'Profile', active: false }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border" data-testid="bottom-navigation">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex justify-around">
          {navItems.map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              className={`flex flex-col items-center py-2 px-3 transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
              data-testid={`nav-${label.toLowerCase()}`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
