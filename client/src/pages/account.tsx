import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, Link } from 'wouter';
import { 
  User, Mail, Calendar, CreditCard, Infinity, Package, 
  LogOut, ArrowLeft, Github, CheckCircle, XCircle, Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import type { Purchase } from '@shared/schema';

interface UserStats {
  totalDeploys: number;
  remainingDeploys: number;
  hasUnlimited: boolean;
  purchases: Purchase[];
}

interface GitHubStatus {
  connected: boolean;
  username?: string;
}

export default function Account() {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({ title: "Nicht eingeloggt", description: "Weiterleitung zum Login...", variant: "destructive" });
      setTimeout(() => { window.location.href = "/api/login"; }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ['/api/user/stats'],
    enabled: isAuthenticated,
  });

  const { data: githubStatus } = useQuery<GitHubStatus>({
    queryKey: ['/api/github/status'],
    enabled: isAuthenticated,
  });

  if (authLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  const formatDate = (date: Date | string | null) => {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPlanName = (planType: string) => {
    switch (planType) {
      case 'single': return '1 Deploy';
      case 'pack': return '10 Deploys';
      case 'unlimited': return 'Enterprise (Monat)';
      default: return planType;
    }
  };

  const getPlanPrice = (planType: string) => {
    switch (planType) {
      case 'single': return '2,99€';
      case 'pack': return '9,99€';
      case 'unlimited': return '29,99€/Monat';
      default: return '-';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" data-testid="link-back-dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6 bg-slate-700" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Mein Konto
            </h1>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => logout()} 
            className="text-slate-400 hover:text-red-400"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Abmelden
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="w-5 h-5 text-cyan-400" />
              Profil
            </CardTitle>
            <CardDescription className="text-slate-400">
              Deine Kontoinformationen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-cyan-500">
                <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || 'User'} />
                <AvatarFallback className="bg-slate-800 text-cyan-400 text-xl">
                  {user.firstName?.[0] || user.email?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-white" data-testid="text-user-name">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-slate-400 flex items-center gap-2" data-testid="text-user-email">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
              </div>
            </div>

            <Separator className="bg-slate-800" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Rocket className="w-4 h-4" />
                  <span className="text-sm">Deploys gesamt</span>
                </div>
                <p className="text-2xl font-bold text-white" data-testid="text-total-deploys">
                  {stats?.totalDeploys || 0}
                </p>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Package className="w-4 h-4" />
                  <span className="text-sm">Verfügbare Credits</span>
                </div>
                <p className="text-2xl font-bold text-white" data-testid="text-remaining-credits">
                  {stats?.hasUnlimited ? (
                    <span className="flex items-center gap-2">
                      <Infinity className="w-6 h-6 text-amber-400" />
                      <span className="text-amber-400">Unlimited</span>
                    </span>
                  ) : (
                    stats?.remainingDeploys || 0
                  )}
                </p>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Github className="w-4 h-4" />
                  <span className="text-sm">GitHub</span>
                </div>
                <div data-testid="text-github-status">
                  {githubStatus?.connected ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-medium">{githubStatus.username}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-400" />
                      <span className="text-red-400">Nicht verbunden</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <CreditCard className="w-5 h-5 text-cyan-400" />
              Kaufhistorie
            </CardTitle>
            <CardDescription className="text-slate-400">
              Deine bisherigen Einkäufe
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.purchases && stats.purchases.length > 0 ? (
              <div className="space-y-3">
                {stats.purchases.map((purchase) => (
                  <div 
                    key={purchase.id} 
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
                    data-testid={`purchase-item-${purchase.id}`}
                  >
                    <div className="flex items-center gap-3">
                      {purchase.planType === 'unlimited' ? (
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                          <Infinity className="w-5 h-5 text-amber-400" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                          <Package className="w-5 h-5 text-cyan-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-white">{getPlanName(purchase.planType)}</p>
                        <p className="text-sm text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(purchase.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-cyan-400">{getPlanPrice(purchase.planType)}</p>
                      <Badge 
                        variant="outline" 
                        className={purchase.isActive ? 'border-green-500 text-green-400' : 'border-slate-500 text-slate-400'}
                      >
                        {purchase.isActive ? 'Aktiv' : 'Abgelaufen'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">Noch keine Käufe</p>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="mt-4" data-testid="link-buy-credits">
                    Credits kaufen
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Github className="w-5 h-5 text-cyan-400" />
              GitHub Verbindung
            </CardTitle>
            <CardDescription className="text-slate-400">
              Verbinde dein GitHub-Konto um Repos zu erstellen
            </CardDescription>
          </CardHeader>
          <CardContent>
            {githubStatus?.connected ? (
              <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="font-medium text-white">GitHub verbunden</p>
                    <p className="text-sm text-slate-400">Account: @{githubStatus.username}</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-green-500 text-green-400">
                  Aktiv
                </Badge>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <XCircle className="w-6 h-6 text-red-400" />
                  <div>
                    <p className="font-medium text-white">GitHub nicht verbunden</p>
                    <p className="text-sm text-slate-400">Verbinde dein Konto in den Replit-Einstellungen</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
