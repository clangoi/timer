import { Switch, Route, Router } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TimerProvider } from "@/contexts/TimerContext";
import Index from "@/pages/Index";
import Timer from "@/pages/Timer";
import TabataSets from "@/pages/TabataSets";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function AppRouter() {
  return (
    <Router base="/timer">
      <Switch>
        <Route path="/" component={Index} />
        <Route path="/timer" component={Timer} />
        <Route path="/sets" component={TabataSets} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

function App() {
  // Initialize theme from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    } catch (error) {
      console.warn('Theme initialization failed:', error);
    }
  }, []);

  // Register service worker for PWA
  useEffect(() => {
    try {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/timer/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      }
    } catch (error) {
      console.warn('Service worker registration failed:', error);
    }
  }, []);

  return (
    <TooltipProvider>
      <TimerProvider>
        <Toaster />
        <AppRouter />
      </TimerProvider>
    </TooltipProvider>
  );
}

export default App;
