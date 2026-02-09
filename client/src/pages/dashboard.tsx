import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { 
  Zap, Rocket, Package, Infinity, Plus, LogOut, 
  CheckCircle, Clock, AlertCircle, RefreshCw, Upload, FileArchive, User, Github, Link2, Unlink, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { isUnauthorizedError } from '@/lib/auth-utils';
import { apiRequest, queryClient } from '@/lib/queryClient';
import CardVerification from '@/components/CardVerification';
import { DeployAssistant } from '@/components/DeployAssistant';
import { ZipPreview } from '@/components/ZipPreview';
import type { Deploy, Purchase } from '@shared/schema';

interface UserStats {
  totalDeploys: number;
  remainingDeploys: number;
  hasUnlimited: boolean;
  purchases: Purchase[];
}

const SUBSCRIPTION_PLANS = [
  { id: 'starter', name: 'Starter', price: '0€', priceLabel: 'Kostenlos', description: '1 Projekt', icon: Rocket, features: ['1 Projekt', 'Basic GitHub Integration'] },
  { id: 'pro', name: 'Pro', price: '19€', priceLabel: '/Monat', description: 'Für Entwickler', icon: Package, popular: true, trial: true, features: ['5 Projekte', 'Unlimited Deploys', 'KI-Auto-Fix', '7 Tage Testphase'] },
  { id: 'agency', name: 'Agency', price: '49€', priceLabel: '/Monat', description: 'Für Teams', icon: Infinity, features: ['Unlimited Projekte', 'Unlimited Deploys', 'Team Features', 'Priority Support'] },
];

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [projectName, setProjectName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [aiFixEnabled, setAiFixEnabled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.zip')) {
      setSelectedFile(file);
      if (!projectName) {
        setProjectName(file.name.replace('.zip', ''));
      }
    } else {
      toast({ title: "Invalid file", description: "Please upload a .zip file", variant: "destructive" });
    }
  }, [projectName, toast]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.zip')) {
      setSelectedFile(file);
      if (!projectName) {
        setProjectName(file.name.replace('.zip', ''));
      }
    } else if (file) {
      toast({ title: "Invalid file", description: "Please upload a .zip file", variant: "destructive" });
    }
  }, [projectName, toast]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({ title: "Unauthorized", description: "Logging in again...", variant: "destructive" });
      setTimeout(() => { window.location.href = "/api/login"; }, 500);
    }
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      toast({ title: "Zahlung erfolgreich!", description: "Deine Deploy-Credits wurden hinzugefügt." });
      window.history.replaceState({}, '', '/dashboard');
      queryClient.invalidateQueries({ queryKey: ['/api/user/stats'] });
    } else if (params.get('canceled') === 'true') {
      toast({ title: "Zahlung abgebrochen", description: "Es wurden keine Kosten berechnet.", variant: "destructive" });
      window.history.replaceState({}, '', '/dashboard');
    } else if (params.get('github_connected') === 'true') {
      toast({ title: "GitHub verbunden!", description: "Dein GitHub-Konto wurde erfolgreich verknüpft." });
      window.history.replaceState({}, '', '/dashboard');
      queryClient.invalidateQueries({ queryKey: ['/api/github/status'] });
    } else if (params.get('github_error')) {
      toast({ title: "GitHub-Fehler", description: decodeURIComponent(params.get('github_error') || 'Verbindung fehlgeschlagen'), variant: "destructive" });
      window.history.replaceState({}, '', '/dashboard');
    }
  }, []);

  const { data: stats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ['/api/user/stats'],
    enabled: isAuthenticated,
  });

  const { data: deploys, isLoading: deploysLoading } = useQuery<Deploy[]>({
    queryKey: ['/api/deploys'],
    enabled: isAuthenticated,
  });

  const { data: cardStatus, isLoading: cardStatusLoading, refetch: refetchCardStatus } = useQuery<{ cardVerified: boolean }>({
    queryKey: ['/api/card-status'],
    enabled: isAuthenticated,
  });

  const [showCardVerification, setShowCardVerification] = useState(false);
  const [showZipPreview, setShowZipPreview] = useState(false);
  const [detectedFramework, setDetectedFramework] = useState<string | null>(null);
  
  useEffect(() => {
    if (cardStatus && !cardStatus.cardVerified && stats?.remainingDeploys === 0 && !stats?.hasUnlimited) {
      setShowCardVerification(true);
    }
  }, [cardStatus, stats]);

  const { data: githubStatus, isLoading: githubLoading } = useQuery<{
    connected: boolean;
    username?: string;
    avatarUrl?: string;
    oauthConfigured?: boolean;
  }>({
    queryKey: ['/api/github/status'],
    enabled: isAuthenticated,
  });

  const connectGithubMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('GET', '/api/github/auth');
      return res.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: () => {
      toast({ title: "Fehler", description: "GitHub-Verbindung konnte nicht gestartet werden.", variant: "destructive" });
    },
  });

  const disconnectGithubMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/github/disconnect');
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "GitHub getrennt", description: "Dein GitHub-Konto wurde entfernt." });
      queryClient.invalidateQueries({ queryKey: ['/api/github/status'] });
    },
    onError: () => {
      toast({ title: "Fehler", description: "GitHub konnte nicht getrennt werden.", variant: "destructive" });
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async (planId: string) => {
      const res = await apiRequest('POST', '/api/checkout', { planId });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Unauthorized", description: "Logging in again...", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
        return;
      }
      toast({ title: "Error", description: "Could not start checkout. Payment system may not be configured.", variant: "destructive" });
    },
  });

  const deployMutation = useMutation({
    mutationFn: async ({ file, projectName, aiFixEnabled }: { file: File; projectName: string; aiFixEnabled: boolean }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectName', projectName);
      formData.append('aiFixEnabled', String(aiFixEnabled));
      
      const res = await fetch('/api/deploy-zip', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Deploy failed');
      }
      
      return res.json();
    },
    onSuccess: (data) => {
      let description = data.githubUrl ? `Repository: ${data.githubUrl}` : "Dein Projekt ist live!";
      if (data.aiFixApplied && data.aiChanges?.length > 0) {
        description += ` | KI hat ${data.aiChanges.length} Probleme behoben`;
      }
      toast({ 
        title: data.aiFixApplied ? "Deployed mit KI-Fixes!" : "Deployed to GitHub!", 
        description,
      });
      setProjectName('');
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ['/api/deploys'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/stats'] });
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Unauthorized", description: "Logging in again...", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
        return;
      }
      toast({ title: "Deploy failed", description: error.message || "Please try again.", variant: "destructive" });
    },
  });

  const handleDeploy = () => {
    if (!selectedFile) {
      toast({ title: "Error", description: "Please select a ZIP file to upload.", variant: "destructive" });
      return;
    }
    if (!projectName.trim()) {
      toast({ title: "Error", description: "Please enter a project name.", variant: "destructive" });
      return;
    }
    deployMutation.mutate({ file: selectedFile, projectName, aiFixEnabled });
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/';
  };

  const testCreditsMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/test/grant-credits', { amount: 5 });
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "Test Credits Added!", description: data.message });
      queryClient.invalidateQueries({ queryKey: ['/api/user/stats'] });
    },
    onError: () => {
      toast({ title: "Error", description: "Could not add test credits.", variant: "destructive" });
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0A0E27] flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-[#00F0FF] border-t-transparent animate-spin shadow-[0_0_20px_rgba(0,240,255,0.5)]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const remainingDisplay = stats?.hasUnlimited 
    ? '∞' 
    : stats?.remainingDeploys?.toString() || '0';

  const handleCardVerificationSuccess = () => {
    setShowCardVerification(false);
    refetchCardStatus();
    queryClient.invalidateQueries({ queryKey: ['/api/user/stats'] });
  };

  return (
    <div className="min-h-screen bg-[#0A0E27] text-slate-200">
      {/* Card Verification Modal */}
      {showCardVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <CardVerification 
            onSuccess={handleCardVerificationSuccess}
            onSkip={() => setShowCardVerification(false)}
          />
        </div>
      )}

      {/* ZIP Preview Modal */}
      {showZipPreview && selectedFile && (
        <ZipPreview 
          file={selectedFile}
          onClose={() => setShowZipPreview(false)}
          onFrameworkDetected={(fw) => setDetectedFramework(fw)}
        />
      )}

      {/* Header */}
      <header className="border-b border-[#00F0FF]/20 bg-[#0A0E27]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter text-white group">
            <div className="w-8 h-8 bg-[#00F0FF] rounded flex items-center justify-center text-[#0A0E27] shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-shadow">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            ZIP<span className="text-[#00F0FF]">SHIP</span>
          </a>

          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400">
              {user?.firstName || user?.email || 'User'}
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setLocation('/account')}
              data-testid="button-account"
              className="text-slate-400 hover:text-[#00F0FF] hover:shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all"
              title="Mein Konto"
            >
              <User className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleLogout}
              data-testid="button-logout"
              className="text-slate-400 hover:text-red-400 hover:shadow-[0_0_10px_rgba(255,0,0,0.3)] transition-all"
              title="Abmelden"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-[#0F1429]/80 border-[#00F0FF]/20 hover:border-[#00F0FF]/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-500">Remaining Deploys</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-[#00F0FF]" data-testid="text-remaining-deploys" style={{textShadow: '0 0 20px rgba(0,240,255,0.5)'}}>
                {statsLoading ? '...' : remainingDisplay}
              </div>
              {user?.isAdmin && (
                <Button 
                  onClick={() => testCreditsMutation.mutate()}
                  disabled={testCreditsMutation.isPending}
                  variant="outline"
                  size="sm"
                  data-testid="button-test-credits"
                  className="mt-3 text-xs border-[#FF9100]/50 text-[#FF9100] hover:bg-[#FF9100]/10 hover:border-[#FF9100] hover:shadow-[0_0_10px_rgba(255,145,0,0.3)] transition-all"
                >
                  {testCreditsMutation.isPending ? 'Adding...' : '+ 5 Test Credits (Free)'}
                </Button>
              )}
              {!cardStatusLoading && cardStatus && !cardStatus.cardVerified && stats?.remainingDeploys === 0 && !stats?.hasUnlimited && (
                <Button 
                  onClick={() => setShowCardVerification(true)}
                  variant="outline"
                  size="sm"
                  data-testid="button-verify-card-cta"
                  className="mt-3 text-xs border-[#00C853]/50 text-[#00C853] hover:bg-[#00C853]/10 hover:border-[#00C853] hover:shadow-[0_0_10px_rgba(0,200,83,0.3)] transition-all"
                >
                  Karte verifizieren = 1 Gratis-Deploy
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#0F1429]/80 border-[#00F0FF]/20 hover:border-[#00F0FF]/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-500">Total Deployments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-white" data-testid="text-total-deploys">
                {statsLoading ? '...' : stats?.totalDeploys || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0F1429]/80 border-[#00F0FF]/20 hover:border-[#00F0FF]/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-500">Account Status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-[#00C853] flex items-center gap-2" data-testid="text-account-status" style={{textShadow: '0 0 10px rgba(0,200,83,0.5)'}}>
                <CheckCircle className="w-5 h-5" />
                {stats?.hasUnlimited ? 'Unlimited Plan' : 'Active'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* GitHub Connection */}
        <Card className="bg-[#0F1429]/80 border-[#00F0FF]/20 mb-6 hover:border-[#00F0FF]/40 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Github className="w-5 h-5 text-slate-300" />
              GitHub-Verbindung
            </CardTitle>
            <CardDescription>
              Verbinde deinen GitHub-Account, um Repositories zu erstellen
            </CardDescription>
          </CardHeader>
          <CardContent>
            {githubLoading ? (
              <div className="text-slate-500">Lade...</div>
            ) : githubStatus?.connected ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {githubStatus.avatarUrl && (
                    <img 
                      src={githubStatus.avatarUrl} 
                      alt={githubStatus.username}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-white font-semibold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Verbunden als @{githubStatus.username}
                    </p>
                    <p className="text-slate-400 text-sm">Repositories werden in diesem Account erstellt</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => disconnectGithubMutation.mutate()}
                  disabled={disconnectGithubMutation.isPending}
                  data-testid="button-disconnect-github"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  <Unlink className="w-4 h-4 mr-2" />
                  Trennen
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Kein GitHub-Account verbunden
                    </p>
                    <p className="text-slate-400 text-sm">Du musst GitHub verbinden, um deployen zu können</p>
                  </div>
                  <Button
                    onClick={() => connectGithubMutation.mutate()}
                    disabled={connectGithubMutation.isPending}
                    data-testid="button-connect-github"
                    className="bg-[#0F1429] hover:bg-[#1A2040] text-white border border-[#00F0FF]/30 hover:border-[#00F0FF] hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    {connectGithubMutation.isPending ? 'Verbinde...' : 'GitHub verbinden'}
                  </Button>
                </div>
                <p className="text-slate-500 text-xs">
                  Anderen Account wählen? Erst bei{' '}
                  <a 
                    href="https://github.com/logout" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline"
                  >
                    GitHub abmelden
                  </a>
                  , dann verbinden.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Deploy Form */}
        <Card className="bg-[#0F1429]/80 border-[#00F0FF]/20 mb-12 hover:border-[#00F0FF]/40 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Rocket className="w-5 h-5 text-[#00F0FF]" style={{filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.6))'}} />
              Neues Deployment
            </CardTitle>
            <CardDescription>Upload your ZIP file and deploy instantly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* ZIP Upload Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              data-testid="dropzone-zip-upload"
              className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
                isDragging 
                  ? 'border-[#00F0FF] bg-[#00F0FF]/10 shadow-[0_0_30px_rgba(0,240,255,0.2)]' 
                  : selectedFile 
                    ? 'border-[#00C853] bg-[#00C853]/10 shadow-[0_0_20px_rgba(0,200,83,0.2)]' 
                    : 'border-[#00F0FF]/30 hover:border-[#00F0FF]/60 bg-[#0F1429]/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.1)]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip"
                onChange={handleFileSelect}
                className="hidden"
                data-testid="input-file-upload"
              />
              {selectedFile ? (
                <div className="flex flex-col items-center gap-3">
                  <FileArchive className="w-12 h-12 text-[#00C853]" style={{filter: 'drop-shadow(0 0 10px rgba(0,200,83,0.5))'}} />
                  <div>
                    <p className="text-white font-semibold" data-testid="text-selected-file">{selectedFile.name}</p>
                    <p className="text-slate-400 text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); setShowZipPreview(true); }}
                      className="text-[#00F0FF] hover:text-[#00F0FF]/80 hover:bg-[#00F0FF]/10"
                      data-testid="button-preview-zip"
                    >
                      Preview
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setDetectedFramework(null); }}
                      className="text-slate-400 hover:text-white"
                      data-testid="button-remove-file"
                    >
                      Remove
                    </Button>
                  </div>
                  {detectedFramework && (
                    <p className="text-xs text-[#00F0FF] mt-1" style={{textShadow: '0 0 8px rgba(0,240,255,0.4)'}}>
                      Framework erkannt: {detectedFramework}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Upload className={`w-12 h-12 transition-all ${isDragging ? 'text-[#00F0FF]' : 'text-slate-500'}`} style={isDragging ? {filter: 'drop-shadow(0 0 15px rgba(0,240,255,0.6))'} : {}} />
                  <div>
                    <p className="text-white font-semibold">Drop your ZIP file here</p>
                    <p className="text-slate-400 text-sm">or click to browse</p>
                  </div>
                </div>
              )}
            </div>

            {/* AI Fix Toggle */}
            <div className="flex items-center justify-between p-4 bg-[#0F1429]/80 rounded-lg border border-[#FF9100]/30 hover:border-[#FF9100]/50 transition-all">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#FF9100]" style={{filter: 'drop-shadow(0 0 8px rgba(255,145,0,0.6))'}} />
                <div>
                  <Label htmlFor="ai-fix" className="text-white font-medium cursor-pointer">
                    KI-Auto-Fix aktivieren
                  </Label>
                  <p className="text-slate-400 text-sm">
                    Behebt automatisch häufige Fehler (Version-Mismatches, korrupte Configs, etc.)
                  </p>
                </div>
              </div>
              <Switch
                id="ai-fix"
                checked={aiFixEnabled}
                onCheckedChange={setAiFixEnabled}
                data-testid="switch-ai-fix"
              />
            </div>

            {/* Project Name & Deploy */}
            <div className="flex gap-4">
              <Input 
                placeholder="Projektname (automatisch aus ZIP)"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                data-testid="input-project-name"
                className="bg-[#0F1429] border-[#00F0FF]/30 text-white placeholder:text-slate-500 focus:border-[#00F0FF] focus:shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                onKeyDown={(e) => e.key === 'Enter' && handleDeploy()}
              />
              <Button 
                onClick={handleDeploy}
                disabled={deployMutation.isPending || !selectedFile || (!stats?.hasUnlimited && stats?.remainingDeploys === 0) || !githubStatus?.connected}
                data-testid="button-deploy"
                className="bg-gradient-to-r from-[#00F0FF] to-[#00C853] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] text-[#0A0E27] font-bold px-8 min-w-[160px] transition-all duration-300"
              >
                {deployMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Deploying...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Rocket className="w-4 h-4" />
                    <span>Deploy to GitHub</span>
                  </div>
                )}
              </Button>
            </div>
            {!githubStatus?.connected && (
              <p className="text-amber-400 text-sm">
                Bitte verbinde zuerst deinen GitHub-Account oben.
              </p>
            )}
            {githubStatus?.connected && !stats?.hasUnlimited && stats?.remainingDeploys === 0 && (
              <p className="text-amber-400 text-sm">
                Keine Deploy-Credits übrig. Kaufe unten mehr.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Deploys */}
        <Card className="bg-[#0F1429]/80 border-[#00F0FF]/20 mb-12 hover:border-[#00F0FF]/40 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white">Recent Deployments</CardTitle>
            <CardDescription>Your deployment history</CardDescription>
          </CardHeader>
          <CardContent>
            {deploysLoading ? (
              <div className="text-slate-500">Loading...</div>
            ) : deploys && deploys.length > 0 ? (
              <div className="space-y-3">
                {deploys.slice(0, 10).map((deploy: any) => (
                  <div 
                    key={deploy.id} 
                    className="flex items-center justify-between p-4 bg-[#0A0E27]/60 rounded-lg border border-[#00F0FF]/10 hover:border-[#00F0FF]/30 transition-all"
                    data-testid={`deploy-item-${deploy.id}`}
                  >
                    <div className="flex items-center gap-3">
                      {deploy.status === 'success' && <CheckCircle className="w-5 h-5 text-[#00C853]" style={{filter: 'drop-shadow(0 0 5px rgba(0,200,83,0.5))'}} />}
                      {deploy.status === 'pending' && <Clock className="w-5 h-5 text-[#FF9100]" />}
                      {deploy.status === 'processing' && <RefreshCw className="w-5 h-5 text-[#00F0FF] animate-spin" style={{filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.6))'}} />}
                      {deploy.status === 'failed' && <AlertCircle className="w-5 h-5 text-red-400" />}
                      <div className="flex flex-col">
                        <span className="font-mono text-white">{deploy.projectName}</span>
                        {deploy.githubRepoUrl && (
                          <a 
                            href={deploy.githubRepoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#00F0FF] text-sm hover:underline flex items-center gap-1 hover:text-white transition-colors"
                            data-testid={`link-github-${deploy.id}`}
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            View on GitHub
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-500">
                        {new Date(deploy.createdAt!).toLocaleDateString()}
                      </div>
                      {deploy.filesCount > 0 && (
                        <div className="text-xs text-slate-600">{deploy.filesCount} files</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-500 text-center py-8">
                No deployments yet. Create your first one above!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscription Plans */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Upgrade dein Abo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <Card 
                key={plan.id}
                className={`bg-[#0F1429]/80 border-[#00F0FF]/20 relative transition-all duration-300 hover:border-[#00F0FF]/40 ${
                  plan.popular ? 'border-[#FFD700]/50 shadow-[0_0_30px_rgba(255,215,0,0.15)] hover:shadow-[0_0_40px_rgba(255,215,0,0.25)]' : 'hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-[#FFD700] to-[#FF9100] text-[#0A0E27] text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl shadow-[0_0_10px_rgba(255,215,0,0.4)]">
                    BELIEBTESTE
                  </div>
                )}
                {plan.trial && (
                  <div className="absolute top-0 left-0 bg-[#00C853] text-white text-xs font-bold px-3 py-1 rounded-br-xl rounded-tl-xl">
                    7 TAGE GRATIS
                  </div>
                )}
                <CardHeader className="pt-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      plan.popular ? 'bg-[#FFD700]/20 text-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.3)]' : 'bg-[#00F0FF]/10 text-[#00F0FF]'
                    }`}>
                      <plan.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-white">{plan.name}</CardTitle>
                      <p className="text-xs text-slate-400">{plan.description}</p>
                    </div>
                  </div>
                  <div className={`text-3xl font-black ${plan.popular ? 'text-[#FFD700]' : 'text-white'}`} style={plan.popular ? {textShadow: '0 0 15px rgba(255,215,0,0.5)'} : {}}>
                    {plan.price}<span className="text-base font-normal text-slate-400">{plan.priceLabel}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4 text-sm">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-300">
                        <CheckCircle className="w-4 h-4 text-[#00C853]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    onClick={() => checkoutMutation.mutate(plan.id)}
                    disabled={checkoutMutation.isPending}
                    data-testid={`button-checkout-${plan.id}`}
                    className={`w-full transition-all ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-[#FFD700] to-[#FF9100] hover:shadow-[0_0_20px_rgba(255,215,0,0.5)] text-[#0A0E27]' 
                        : 'bg-[#0F1429] hover:bg-[#1A2040] text-white border border-[#00F0FF]/30 hover:border-[#00F0FF] hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                    }`}
                  >
                    {checkoutMutation.isPending ? 'Processing...' : plan.trial ? 'Testphase starten' : plan.price === '0€' ? 'Aktuell nutzen' : 'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <DeployAssistant 
        onTriggerDeploy={() => {
          setIsDragging(true);
          setTimeout(() => setIsDragging(false), 3000);
          fileInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }}
        remainingDeploys={stats?.remainingDeploys || 0}
        totalDeploys={stats?.totalDeploys || 0}
        lang="de"
      />
    </div>
  );
}
