import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Layout/Header';
import { BottomNavigation } from '@/components/Layout/BottomNavigation';
import { Timer, BarChart3, Play, Target } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground" data-testid="index-page">
      <Header />
      
      <main className="max-w-md mx-auto p-4 pb-20">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center">
            <Timer className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-app-title">
            FitTimer Pro
          </h1>
          <p className="text-muted-foreground">
            Sistema de timer inteligente progresivo con secuencias Tabata
          </p>
        </div>

        <div className="space-y-4">
          <Card data-testid="card-timer">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Play className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Timer</CardTitle>
                  <CardDescription>
                    Cronómetro y secuencias Tabata personalizables
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/timer">
                <Button className="w-full" data-testid="button-go-timer">
                  <Timer className="w-4 h-4 mr-2" />
                  Ir al Timer
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card data-testid="card-sets">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <CardTitle>Sets de Tabata</CardTitle>
                  <CardDescription>
                    Gestiona y organiza tus secuencias de entrenamiento
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/sets">
                <Button variant="outline" className="w-full" data-testid="button-go-sets">
                  <Target className="w-4 h-4 mr-2" />
                  Gestionar Sets
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-4 bg-muted/50 rounded-lg text-center">
          <h3 className="font-medium mb-2">Características principales</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Cronómetro ilimitado formato MM:SS</li>
            <li>• Secuencias Tabata personalizables</li>
            <li>• Sets de entrenamiento guardables</li>
            <li>• Audio y vibración</li>
            <li>• Funciona offline (PWA)</li>
          </ul>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}