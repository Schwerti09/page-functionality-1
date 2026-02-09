import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Zap, ArrowRight, Check, X,
  Brain, Shield, Clock, Database, Globe, Menu, Star,
  Upload, Server, Rocket, ChevronRight, Mail, Lock, CreditCard
} from 'lucide-react';
import { SiVisa, SiMastercard, SiApplepay, SiGooglepay, SiStripe } from 'react-icons/si';
import { StarField } from '@/components/landing-page/StarField';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const translations = {
  en: {
    nav: { features: "SYSTEM", pricing: "PRICING", guide: "GUIDE", blog: "BLOG", login: "LOGIN", dashboard: "DASHBOARD" },
    hero: {
      title_1: "DRAG. DROP. DONE.",
      title_2: "ZIP TO GITHUB IN SECONDS.",
      subtitle: "Drop your ZIP. We create a GitHub repo. Instantly. No git commands. No terminal. No bullshit.",
      cta: "START FOR FREE",
      trust: "Join the revolution. Zero configuration required."
    },
    bigStory: {
      headline: "THE FASTEST WAY TO GITHUB",
      subline: "Stop wasting time with git init, git add, git commit, git push. Just drop your ZIP.",
      stats: [
        { number: "10", unit: "SEC", label: "From ZIP to live GitHub repo" },
        { number: "0", unit: "CMD", label: "Zero terminal commands needed" },
        { number: "100%", unit: "AUTO", label: "Fully automated workflow" }
      ],
      features: [
        "Drag & Drop your ZIP file",
        "We create the GitHub repository",
        "All files pushed automatically",
        "Get your live repo URL instantly"
      ]
    },
    terminal: {
      lines: [
        { text: "$ zipship deploy my-project.zip", delay: 0 },
        { text: "Extracting archive... 24 files found", delay: 800 },
        { text: "[SCAN] Filtering node_modules, .git, __MACOSX", delay: 1400 },
        { text: "[CLEAN] 18 files ready for deployment", delay: 2000 },
        { text: "Connecting to GitHub API...", delay: 2600 },
        { text: "[AUTH] GitHub account verified: @developer", delay: 3200 },
        { text: "Creating repository: my-project", delay: 3800 },
        { text: "Pushing 18 files to main branch...", delay: 4400 },
        { text: "[SUCCESS] github.com/developer/my-project", delay: 5200 },
        { text: "Repository created in 4.2 seconds", delay: 5800 }
      ]
    },
    problem: {
      title: "THE OLD WORLD vs THE ZIP-SHIP PROTOCOL",
      old: {
        title: "THE OLD WORLD",
        items: [
          "47 minutes average CI/CD setup",
          "YAML config nightmares",
          "Manual environment juggling",
          "\"Works on my machine\" syndrome"
        ]
      },
      new: {
        title: "THE ZIP-SHIP PROTOCOL",
        items: [
          "30 seconds to live deployment",
          "Zero configuration required",
          "Automatic environment sync",
          "Works everywhere, guaranteed"
        ]
      },
      stat: "83% of developers hate their CI/CD pipeline"
    },
    howItWorks: {
      title: "HOW IT WORKS",
      subtitle: "From ZIP to GitHub in 3 simple steps",
      steps: [
        { number: "01", title: "Upload Your ZIP", desc: "Drag & drop your project as a ZIP file. We automatically filter out node_modules, .git, and system files." },
        { number: "02", title: "Connect GitHub", desc: "Link your GitHub account once. We handle authentication and permissions automatically." },
        { number: "03", title: "Get Your Repo", desc: "Your code is pushed to a new GitHub repository. Get your live repo URL in seconds." }
      ]
    },
    system: {
      title: "THE SYSTEM",
      subtitle: "Enterprise-grade infrastructure, consumer-grade simplicity",
      features: [
        { 
          icon: "brain",
          title: "Neural Stack Detection", 
          desc: "AI-powered analysis detects React, Node, Python, Go, and 50+ frameworks automatically. Zero config files needed." 
        },
        { 
          icon: "shield",
          title: "Zero-Knowledge Vault", 
          desc: "AES-256 encrypted secrets injected directly at runtime. Your credentials never touch our servers in plaintext." 
        },
        { 
          icon: "clock",
          title: "Immutable Time-Travel", 
          desc: "Every deploy is an immutable snapshot. Roll back to any version in one click. 100% fail-safe guarantee." 
        },
        { 
          icon: "globe",
          title: "Global Edge Mesh", 
          desc: "350+ edge locations worldwide. <50ms TTFB guaranteed. Your app loads instantly, everywhere." 
        }
      ]
    },
    social: {
      title: "EARLY ADOPTER FEEDBACK",
      stats: [
        { value: "500+", label: "Beta Users" },
        { value: "99.9%", label: "Success Rate" },
        { value: "4.8/5", label: "User Rating" },
        { value: "<5s", label: "Avg Deploy" }
      ],
      testimonials: [
        { name: "Alex M.", role: "Beta Tester", text: "Super simple. Dragged my ZIP, got a GitHub repo in seconds. Exactly what I needed." },
        { name: "Jonas K.", role: "Indie Hacker", text: "No more git init, git add, git commit dance. This just works." },
        { name: "Maria S.", role: "Freelancer", text: "Perfect for quickly sharing code with clients. Love the simplicity." }
      ]
    },
    pricing: {
      title: "CHOOSE YOUR PLAN",
      subtitle: "Start free. Scale as you grow. No hidden fees.",
      plans: {
        starter: { 
          name: "Starter", 
          headline: "For Hobbyists",
          price: "0€", 
          unit: "/ month",
          features: [
            "1 Active Project",
            "Community Support",
            "zip-ship.io subdomains",
            "Standard Edge Network"
          ],
          cta: "Start for Free"
        },
        pro: { 
          name: "Pro", 
          headline: "For Creators & Indie Hackers",
          price: "19€", 
          unit: "/ month",
          tag: "MOST POPULAR",
          features: [
            "Unlimited Deployments",
            "5 Active Projects",
            "Custom Domains (SSL incl.)",
            "Priority Build Queue",
            "No Cold Starts",
            "Email Support"
          ],
          cta: "Start 7-Day Trial"
        },
        agency: { 
          name: "Agency", 
          headline: "For Teams & Scale",
          price: "49€", 
          unit: "/ month",
          features: [
            "Unlimited Projects",
            "Team Collaboration",
            "Analytics Dashboard",
            "<50ms Latency Guarantee",
            "24/7 Priority Support",
            "SLA 99.99%"
          ],
          cta: "Contact Sales"
        }
      }
    },
    cta: {
      title: "Stop configuring. Start shipping.",
      subtitle: "Free Tier available. No credit card required.",
      button: "START FOR FREE"
    },
    faq: {
      title: "FREQUENTLY ASKED QUESTIONS",
      items: [
        { q: "Can I use my own domain?", a: "Yes! Custom domains (yourname.com) are included in the Pro and Agency plans. We handle the SSL certificates automatically." },
        { q: "What happens if I stop paying?", a: "Your projects will be paused, but we keep your data for 30 days so you can reactivate anytime. You can always downgrade to the Free plan." },
        { q: "How do updates work?", a: "Just upload a new ZIP file. The system detects it's an update and deploys it instantly with zero downtime." },
        { q: "Is there a free trial for Pro?", a: "Yes, the Free Tier is your trial. It has no time limit. Upgrade to Pro whenever you need more projects or custom domains." }
      ]
    }
  },
  de: {
    nav: { features: "SYSTEM", pricing: "PREISE", guide: "GUIDE", blog: "BLOG", login: "ANMELDEN", dashboard: "DASHBOARD" },
    hero: {
      title_1: "ZIEHEN. ABLEGEN. FERTIG.",
      title_2: "ZIP ZU GITHUB IN SEKUNDEN.",
      subtitle: "Ziehe deine ZIP rein. Wir erstellen ein GitHub Repo. Sofort. Keine Git-Befehle. Kein Terminal. Kein Bullshit.",
      cta: "KOSTENLOS STARTEN",
      trust: "Schließe dich der Revolution an. Null Konfiguration nötig."
    },
    bigStory: {
      headline: "DER SCHNELLSTE WEG ZU GITHUB",
      subline: "Hör auf Zeit zu verschwenden mit git init, git add, git commit, git push. Einfach ZIP reinwerfen.",
      stats: [
        { number: "10", unit: "SEK", label: "Von ZIP zum Live GitHub Repo" },
        { number: "0", unit: "CMD", label: "Null Terminal-Befehle nötig" },
        { number: "100%", unit: "AUTO", label: "Vollautomatischer Workflow" }
      ],
      features: [
        "Drag & Drop deine ZIP-Datei",
        "Wir erstellen das GitHub Repository",
        "Alle Dateien automatisch gepusht",
        "Erhalte deine Repo-URL sofort"
      ]
    },
    terminal: {
      lines: [
        { text: "$ zipship deploy mein-projekt.zip", delay: 0 },
        { text: "Entpacke Archiv... 24 Dateien gefunden", delay: 800 },
        { text: "[SCAN] Filtere node_modules, .git, __MACOSX", delay: 1400 },
        { text: "[BEREIT] 18 Dateien für Deployment vorbereitet", delay: 2000 },
        { text: "Verbinde mit GitHub API...", delay: 2600 },
        { text: "[AUTH] GitHub Account verifiziert: @entwickler", delay: 3200 },
        { text: "Erstelle Repository: mein-projekt", delay: 3800 },
        { text: "Pushe 18 Dateien auf main Branch...", delay: 4400 },
        { text: "[ERFOLG] github.com/entwickler/mein-projekt", delay: 5200 },
        { text: "Repository erstellt in 4.2 Sekunden", delay: 5800 }
      ]
    },
    problem: {
      title: "DIE ALTE WELT vs DAS ZIP-SHIP PROTOKOLL",
      old: {
        title: "DIE ALTE WELT",
        items: [
          "47 Minuten CI/CD Setup im Durchschnitt",
          "YAML Config Alpträume",
          "Manuelles Environment Jonglieren",
          "\"Läuft auf meinem Rechner\" Syndrom"
        ]
      },
      new: {
        title: "DAS ZIP-SHIP PROTOKOLL",
        items: [
          "30 Sekunden bis zum Live-Deployment",
          "Null Konfiguration nötig",
          "Automatische Environment Sync",
          "Funktioniert überall, garantiert"
        ]
      },
      stat: "83% der Entwickler hassen ihre CI/CD Pipeline"
    },
    howItWorks: {
      title: "SO FUNKTIONIERT'S",
      subtitle: "Vom ZIP zum GitHub Repo in 3 einfachen Schritten",
      steps: [
        { number: "01", title: "ZIP hochladen", desc: "Ziehe dein Projekt als ZIP-Datei per Drag & Drop. Wir filtern automatisch node_modules, .git und System-Dateien." },
        { number: "02", title: "GitHub verbinden", desc: "Verbinde einmalig deinen GitHub Account. Wir kümmern uns automatisch um Authentifizierung und Berechtigungen." },
        { number: "03", title: "Repo erhalten", desc: "Dein Code wird in ein neues GitHub Repository gepusht. Erhalte deine Repo-URL in Sekunden." }
      ]
    },
    system: {
      title: "DAS SYSTEM",
      subtitle: "Enterprise-Grade Infrastruktur, Consumer-Grade Einfachheit",
      features: [
        { 
          icon: "brain",
          title: "Neurale Stack-Erkennung", 
          desc: "KI-gestützte Analyse erkennt React, Node, Python, Go und 50+ Frameworks automatisch. Keine Config-Dateien nötig." 
        },
        { 
          icon: "shield",
          title: "Zero-Knowledge Vault", 
          desc: "AES-256 verschlüsselte Secrets werden direkt zur Runtime injiziert. Deine Credentials berühren nie im Plaintext unsere Server." 
        },
        { 
          icon: "clock",
          title: "Immutable Time-Travel", 
          desc: "Jedes Deploy ist ein immutable Snapshot. Rolle zurück zu jeder Version mit einem Klick. 100% Fail-Safe garantiert." 
        },
        { 
          icon: "globe",
          title: "Globales Edge Mesh", 
          desc: "350+ Edge Standorte weltweit. <50ms TTFB garantiert. Deine App lädt sofort, überall." 
        }
      ]
    },
    social: {
      title: "EARLY ADOPTER FEEDBACK",
      stats: [
        { value: "500+", label: "Beta Nutzer" },
        { value: "99.9%", label: "Erfolgsrate" },
        { value: "4.8/5", label: "Bewertung" },
        { value: "<5s", label: "Ø Deploy" }
      ],
      testimonials: [
        { name: "Alex M.", role: "Beta Tester", text: "Super einfach. ZIP reingeworfen, GitHub Repo in Sekunden. Genau das was ich brauchte." },
        { name: "Jonas K.", role: "Indie Hacker", text: "Kein git init, git add, git commit Tanz mehr. Das funktioniert einfach." },
        { name: "Maria S.", role: "Freelancerin", text: "Perfekt um schnell Code mit Kunden zu teilen. Liebe die Einfachheit." }
      ]
    },
    pricing: {
      title: "WÄHLE DEINEN PLAN",
      subtitle: "Starte kostenlos. Skaliere mit deinem Wachstum. Keine versteckten Kosten.",
      plans: {
        starter: { 
          name: "Starter", 
          headline: "Für Hobbyisten",
          price: "0€", 
          unit: "/ Monat",
          features: [
            "1 aktives Projekt",
            "Community Support",
            "zip-ship.io Subdomains",
            "Standard Edge Network"
          ],
          cta: "Kostenlos starten"
        },
        pro: { 
          name: "Pro", 
          headline: "Für Creators & Indie Hacker",
          price: "19€", 
          unit: "/ Monat",
          tag: "BELIEBTESTE",
          features: [
            "Unbegrenzte Deployments",
            "5 aktive Projekte",
            "Custom Domains (SSL inkl.)",
            "Priority Build Queue",
            "Keine Cold Starts",
            "Email Support"
          ],
          cta: "7 Tage kostenlos testen"
        },
        agency: { 
          name: "Agency", 
          headline: "Für Teams & Skalierung",
          price: "49€", 
          unit: "/ Monat",
          features: [
            "Unbegrenzte Projekte",
            "Team-Zusammenarbeit",
            "Analytics Dashboard",
            "<50ms Latenz-Garantie",
            "24/7 Priority Support",
            "SLA 99.99%"
          ],
          cta: "Vertrieb kontaktieren"
        }
      }
    },
    cta: {
      title: "Hör auf zu konfigurieren. Fang an zu shippen.",
      subtitle: "Free Tier verfügbar. Keine Kreditkarte nötig.",
      button: "KOSTENLOS STARTEN"
    },
    faq: {
      title: "HÄUFIGE FRAGEN",
      items: [
        { q: "Kann ich meine eigene Domain nutzen?", a: "Ja! Custom Domains (deinname.com) sind in den Pro und Agency Plänen enthalten. Wir kümmern uns automatisch um die SSL-Zertifikate." },
        { q: "Was passiert, wenn ich aufhöre zu zahlen?", a: "Deine Projekte werden pausiert, aber wir behalten deine Daten 30 Tage lang, damit du jederzeit reaktivieren kannst. Du kannst immer auf den Free Plan downgraden." },
        { q: "Wie funktionieren Updates?", a: "Lade einfach eine neue ZIP-Datei hoch. Das System erkennt, dass es ein Update ist und deployed es sofort ohne Downtime." },
        { q: "Gibt es eine kostenlose Testphase für Pro?", a: "Ja, der Free Tier ist deine Testphase. Er hat kein Zeitlimit. Upgrade zu Pro, wenn du mehr Projekte oder Custom Domains brauchst." }
      ]
    }
  }
};

const TerminalAnimation = ({ lines }: { lines: { text: string; delay: number }[] }) => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    lines.forEach((line, index) => {
      const timer = setTimeout(() => {
        setVisibleLines(index + 1);
      }, line.delay);
      timers.push(timer);
    });
    
    const resetTimer = setTimeout(() => {
      setVisibleLines(0);
      timers.forEach(t => clearTimeout(t));
    }, 7000);
    timers.push(resetTimer);

    return () => timers.forEach(t => clearTimeout(t));
  }, [visibleLines === 0]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [visibleLines]);

  return (
    <div className="rounded-lg bg-[#0A0E27] border border-[#00f0ff]/30 overflow-hidden shadow-2xl box-glow-cyan animate-scanline">
      <div className="flex items-center gap-2 px-4 py-3 bg-[#0F1429] border-b border-[#00f0ff]/20">
        <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(255,0,0,0.5)]"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(255,200,0,0.5)]"></div>
        <div className="w-3 h-3 rounded-full bg-[#00C853] shadow-[0_0_8px_rgba(0,200,83,0.5)]"></div>
        <span className="ml-4 text-xs font-mono text-[#00F0FF]/60">zipship-terminal</span>
      </div>
      <div ref={terminalRef} className="p-6 font-mono text-sm h-64 overflow-y-auto bg-gradient-to-b from-transparent to-[#0A0E27]/50">
        {lines.slice(0, visibleLines).map((line, i) => (
          <div 
            key={i} 
            className={`mb-2 transition-all duration-200 ${
              line.text.includes('[SUCCESS]') || line.text.includes('[ERFOLG]') 
                ? 'text-[#00C853] text-glow-green font-semibold' 
                : line.text.includes('[DETECTED]') || line.text.includes('[ERKANNT]') || line.text.includes('[ACTIVE]') || line.text.includes('[AKTIV]') || line.text.includes('[SCAN]') || line.text.includes('[AUTH]') || line.text.includes('[CLEAN]') || line.text.includes('[BEREIT]')
                ? 'text-[#00F0FF] text-glow-cyan'
                : line.text.startsWith('$')
                ? 'text-[#FFD700] text-glow-gold font-semibold'
                : 'text-slate-400'
            }`}
          >
            {line.text}
          </div>
        ))}
        {visibleLines < lines.length && (
          <span className="inline-block w-2 h-5 bg-[#00F0FF] animate-pulse shadow-[0_0_10px_rgba(0,240,255,0.8)]"></span>
        )}
      </div>
    </div>
  );
};

const FeatureIcon = ({ icon }: { icon: string }) => {
  const icons: Record<string, any> = {
    brain: Brain,
    shield: Shield,
    clock: Clock,
    globe: Globe
  };
  const Icon = icons[icon] || Zap;
  return <Icon className="w-6 h-6" />;
};

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const { isAuthenticated, refetch } = useAuth();
  const { toast } = useToast();

  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'de' : 'en');
  
  const handleLogin = () => { 
    setAuthMode('login');
    setAuthError('');
    setShowAuthModal(true);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = authMode === 'login' 
        ? { email: authForm.email, password: authForm.password }
        : authForm;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.message || 'Ein Fehler ist aufgetreten');
        return;
      }

      setShowAuthModal(false);
      setAuthForm({ email: '', password: '', firstName: '', lastName: '' });
      refetch();
      toast({
        title: authMode === 'login' ? 'Willkommen zurück!' : 'Account erstellt!',
        description: 'Du wirst zum Dashboard weitergeleitet...',
      });
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch (error) {
      setAuthError('Verbindungsfehler. Bitte versuche es erneut.');
    } finally {
      setAuthLoading(false);
    }
  };
  
  const handleGetStarted = () => {
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    } else {
      // Show register modal
      setAuthMode('register');
      setAuthError('');
      setShowAuthModal(true);
    }
  };

  const handlePricingClick = (planId: string) => {
    if (isAuthenticated) {
      // Redirect to dashboard with plan pre-selected
      window.location.href = `/dashboard?plan=${planId}`;
    } else {
      // Show register modal
      setAuthMode('register');
      setAuthError('');
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <Helmet>
        <title>Zip-Ship | Deploy ZIP to GitHub in Seconds</title>
        <meta name="description" content="Upload your project as a ZIP file and we automatically create a GitHub repository. No git commands, no terminal, just drag and drop. Deploy in 10 seconds." />
        <meta property="og:title" content="Zip-Ship | The Fastest Way to GitHub" />
        <meta property="og:description" content="Drop your ZIP, get a GitHub repo instantly. Zero configuration required." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://zip-ship-revolution.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://zip-ship-revolution.com" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Zip-Ship",
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "Web",
            "description": "Upload your project as a ZIP file and we automatically create a GitHub repository. No git commands, no terminal, just drag and drop.",
            "url": "https://zip-ship-revolution.com",
            "offers": [
              {
                "@type": "Offer",
                "name": "Starter",
                "price": "0",
                "priceCurrency": "EUR",
                "description": "1 project, basic GitHub integration"
              },
              {
                "@type": "Offer", 
                "name": "Pro",
                "price": "19",
                "priceCurrency": "EUR",
                "description": "5 projects, unlimited deploys, AI Auto-Fix, 7-day trial"
              },
              {
                "@type": "Offer",
                "name": "Agency", 
                "price": "49",
                "priceCurrency": "EUR",
                "description": "Unlimited projects, team features, priority support"
              }
            ],
            "provider": {
              "@type": "Organization",
              "name": "ZIP-SHIP",
              "url": "https://zip-ship-revolution.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Karklandsweg 1",
                "addressLocality": "Dornum",
                "postalCode": "26553",
                "addressCountry": "DE"
              },
              "email": "support@zip-ship.com"
            },
            "featureList": [
              "Drag & Drop ZIP Upload",
              "Automatic GitHub Repository Creation",
              "AI-Powered Error Detection",
              "50+ Framework Support",
              "Zero Configuration Required"
            ]
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-[#0A0E27] text-slate-200 font-sans overflow-x-hidden bg-grid-pattern bg-spotlight">
      <StarField />

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAuthModal(false)} />
          <div className="relative bg-[#0A0E27] border border-[#00F0FF]/40 rounded-2xl p-8 w-full max-w-md shadow-2xl box-glow-cyan">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
              data-testid="button-close-auth-modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-10 h-10 bg-[#00F0FF] rounded-md flex items-center justify-center text-[#0A0E27] shadow-[0_0_20px_rgba(0,240,255,0.5)]">
                  <Zap className="w-6 h-6 fill-current" />
                </div>
                <span className="text-2xl font-black text-white">ZIP<span className="text-[#00F0FF] text-glow-cyan">SHIP</span></span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                {authMode === 'login' ? (lang === 'en' ? 'Welcome Back' : 'Willkommen zurück') : (lang === 'en' ? 'Create Account' : 'Account erstellen')}
              </h2>
              <p className="text-slate-400 mt-2">
                {authMode === 'login' 
                  ? (lang === 'en' ? 'Sign in to your account' : 'Melde dich an') 
                  : (lang === 'en' ? 'Start deploying in seconds' : 'Starte in Sekunden')}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">{lang === 'en' ? 'First Name' : 'Vorname'}</label>
                    <input
                      type="text"
                      value={authForm.firstName}
                      onChange={(e) => setAuthForm(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-[#00f0ff] focus:outline-none focus:ring-1 focus:ring-[#00f0ff]"
                      placeholder="Max"
                      data-testid="input-first-name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">{lang === 'en' ? 'Last Name' : 'Nachname'}</label>
                    <input
                      type="text"
                      value={authForm.lastName}
                      onChange={(e) => setAuthForm(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-[#00f0ff] focus:outline-none focus:ring-1 focus:ring-[#00f0ff]"
                      placeholder="Mustermann"
                      data-testid="input-last-name"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-[#00f0ff] focus:outline-none focus:ring-1 focus:ring-[#00f0ff]"
                  placeholder="max@example.com"
                  required
                  data-testid="input-email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">{lang === 'en' ? 'Password' : 'Passwort'}</label>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-[#00f0ff] focus:outline-none focus:ring-1 focus:ring-[#00f0ff]"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  data-testid="input-password"
                />
              </div>

              {authError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FF9100] text-[#0A0E27] font-bold text-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                data-testid="button-auth-submit"
              >
                {authLoading 
                  ? (lang === 'en' ? 'Loading...' : 'Laden...') 
                  : authMode === 'login' 
                    ? (lang === 'en' ? 'Sign In' : 'Anmelden') 
                    : (lang === 'en' ? 'Create Account' : 'Account erstellen')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login');
                  setAuthError('');
                }}
                className="text-[#00f0ff] hover:underline"
                data-testid="button-toggle-auth-mode"
              >
                {authMode === 'login' 
                  ? (lang === 'en' ? "Don't have an account? Sign up" : 'Noch kein Account? Registrieren') 
                  : (lang === 'en' ? 'Already have an account? Sign in' : 'Schon registriert? Anmelden')}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <header>
        <nav 
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled ? 'bg-[#0a0f1c]/90 backdrop-blur-xl border-[#00f0ff]/10 py-3' : 'bg-transparent border-transparent py-5'}`}
          role="navigation"
          aria-label="Main navigation"
        >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter text-white cursor-pointer select-none group" data-testid="link-logo">
            <div className="w-9 h-9 bg-[#00F0FF] rounded-md flex items-center justify-center text-[#0A0E27] shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-shadow">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            ZIP<span className="text-[#00F0FF] text-glow-cyan">SHIP</span>
          </a>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-mono font-bold text-slate-400">
            <a href="#system" className="hover:text-[#00F0FF] hover:text-glow-cyan transition-all" data-testid="link-nav-system">{t.nav.features}</a>
            <a href="#pricing" className="hover:text-[#00F0FF] hover:text-glow-cyan transition-all" data-testid="link-nav-pricing">{t.nav.pricing}</a>
            <a href="/guide" className="hover:text-[#00F0FF] hover:text-glow-cyan transition-all" data-testid="link-nav-guide">{t.nav.guide}</a>
            <a href="/blog" className="hover:text-[#00F0FF] hover:text-glow-cyan transition-all" data-testid="link-nav-blog">{t.nav.blog}</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={toggleLang}
              data-testid="button-toggle-language"
              aria-label={`Switch to ${lang === 'en' ? 'German' : 'English'}`}
              className="flex items-center gap-2 px-3 py-2 rounded text-slate-400 hover:text-[#00F0FF] hover:bg-[#00F0FF]/5 transition-all text-xs font-mono font-bold"
            >
              <Globe className="w-4 h-4" aria-hidden="true" />
              {lang.toUpperCase()}
            </button>
            {isAuthenticated ? (
              <a 
                href="/dashboard"
                data-testid="link-dashboard"
                className="px-5 py-2.5 rounded-md bg-[#00F0FF] text-[#0A0E27] font-mono text-xs font-bold hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all shadow-[0_0_10px_rgba(0,240,255,0.3)]"
              >
                {t.nav.dashboard}
              </a>
            ) : (
              <button 
                onClick={handleLogin}
                data-testid="button-login"
                className="px-5 py-2.5 rounded-md border border-[#00F0FF]/40 text-[#00F0FF] font-mono text-xs font-bold hover:bg-[#00F0FF]/10 hover:border-[#00F0FF] hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
              >
                {t.nav.login}
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleLang} data-testid="button-toggle-language-mobile" aria-label="Toggle language" className="text-slate-400 text-xs font-mono font-bold">{lang.toUpperCase()}</button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} data-testid="button-mobile-menu" aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} className="text-white">
              {mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#0a0f1c] border-b border-[#00f0ff]/10 p-6 flex flex-col gap-4 text-center">
            <a href="#system" className="text-slate-300 font-bold" onClick={() => setMobileMenuOpen(false)} data-testid="link-nav-system-mobile">{t.nav.features}</a>
            <a href="#pricing" className="text-slate-300 font-bold" onClick={() => setMobileMenuOpen(false)} data-testid="link-nav-pricing-mobile">{t.nav.pricing}</a>
            <a href="/guide" className="text-slate-300 font-bold" onClick={() => setMobileMenuOpen(false)} data-testid="link-nav-guide-mobile">{t.nav.guide}</a>
            <a href="/blog" className="text-slate-300 font-bold" onClick={() => setMobileMenuOpen(false)} data-testid="link-nav-blog-mobile">{t.nav.blog}</a>
            {isAuthenticated ? (
              <a href="/dashboard" className="text-[#00f0ff] font-bold" data-testid="link-dashboard-mobile">{t.nav.dashboard}</a>
            ) : (
              <button onClick={handleLogin} data-testid="button-login-mobile" className="text-[#00f0ff] font-bold">{t.nav.login}</button>
            )}
          </div>
        )}
        </nav>
      </header>

      {/* Main Content */}
      <main>
      {/* Hero Section - 100vh */}
      <section id="hero" aria-labelledby="hero-title" className="relative min-h-screen flex items-center pt-20 pb-20 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-left">
              <h1 id="hero-title" className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.1] mb-8 font-display">
                {t.hero.title_1}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#00F0FF] to-[#00B8C4] text-glow-cyan">{t.hero.title_2}</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-slate-400 mb-10 leading-relaxed max-w-xl">
                {t.hero.subtitle}
              </p>
              
              <button 
                onClick={handleGetStarted}
                data-testid="button-hero-cta"
                className="group px-8 py-4 rounded-md bg-gradient-to-r from-[#FFD700] to-[#FF9100] text-[#0A0E27] font-bold text-lg hover:scale-[1.02] transition-all flex items-center gap-3 shadow-[0_0_25px_rgba(255,215,0,0.4)] hover:shadow-[0_0_40px_rgba(255,215,0,0.6)]"
              >
                {t.hero.cta}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="mt-8 text-sm text-slate-500 font-mono flex items-center gap-2">
                <span className="w-2 h-2 bg-[#00C853] rounded-full animate-pulse shadow-[0_0_8px_rgba(0,200,83,0.8)]"></span>
                {t.hero.trust}
              </p>
            </div>

            <div className="hidden lg:block animate-float-subtle">
              <TerminalAnimation lines={t.terminal.lines} />
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight className="w-6 h-6 text-[#00f0ff] rotate-90" />
        </div>
      </section>

      {/* BIG STORY Section */}
      <section id="big-story" aria-label="Big Story" className="relative py-32 px-6 bg-gradient-to-b from-[#0A0E27] via-[#00F0FF]/5 to-[#0A0E27] border-y border-[#00F0FF]/30">
        <div className="absolute inset-0 bg-hex-pattern opacity-50"></div>
        
        <div className="max-w-7xl mx-auto relative">
          {/* Main Headline */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF9100]/10 border border-[#FF9100]/40 text-[#FF9100] text-sm font-mono font-bold mb-8 shadow-[0_0_15px_rgba(255,145,0,0.2)] animate-pulse">
              <Brain className="w-4 h-4" />
              {lang === 'en' ? 'NEW: AI AUTO-FIX INCLUDED' : 'NEU: KI AUTO-FIX INKLUSIVE'}
            </div>
            <h2 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white mb-6 tracking-tight text-glow-cyan">
              {t.bigStory.headline}
            </h2>
            <p className="text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto font-mono">
              {t.bigStory.subline}
            </p>
          </div>

          {/* Big Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {t.bigStory.stats.map((stat, i) => (
              <div key={i} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/20 to-[#FFD700]/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-8 rounded-2xl bg-[#0F1429]/80 border border-[#00F0FF]/30 text-center hover:border-[#00F0FF]/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]">
                  <div className="flex items-baseline justify-center gap-2 mb-4">
                    <span className="text-7xl sm:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#FFD700]">
                      {stat.number}
                    </span>
                    <span className="text-2xl sm:text-3xl font-bold text-[#00F0FF] text-glow-cyan">{stat.unit}</span>
                  </div>
                  <p className="text-slate-400 text-lg font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Feature List */}
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {t.bigStory.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[#0F1429]/60 border border-[#00F0FF]/20 hover:border-[#00F0FF]/40 transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.1)]">
                  <div className="w-10 h-10 rounded-full bg-[#00C853]/20 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,200,83,0.3)]">
                    <Check className="w-5 h-5 text-[#00C853]" />
                  </div>
                  <span className="text-white font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <button 
              onClick={handleGetStarted}
              data-testid="button-bigstory-cta"
              className="group px-10 py-5 rounded-md bg-gradient-to-r from-[#FFD700] to-[#FF9100] text-[#0A0E27] font-black text-xl hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(255,215,0,0.4)] hover:shadow-[0_0_50px_rgba(255,215,0,0.6)] flex items-center gap-3 mx-auto"
            >
              <Rocket className="w-6 h-6" />
              {t.hero.cta}
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section id="comparison" aria-label="Problem and solution comparison" className="py-32 px-6 border-y border-[#00F0FF]/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-mono mb-6 shadow-[0_0_10px_rgba(255,0,0,0.2)]">
              {t.problem.stat}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* Old Way */}
            <div className="p-8 rounded-2xl bg-red-500/5 border border-red-500/20 hover:border-red-500/40 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shadow-[0_0_10px_rgba(255,0,0,0.3)]">
                  <X className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-red-400 font-mono">{t.problem.old.title}</h3>
              </div>
              <ul className="space-y-4">
                {t.problem.old.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-400">
                    <X className="w-5 h-5 text-red-500/70 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* New Way */}
            <div className="relative p-8 rounded-2xl bg-[#00F0FF]/5 border border-[#00F0FF]/30 hover:border-[#00F0FF]/50 transition-all shadow-[0_0_20px_rgba(0,240,255,0.1)] hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]">
              <div className="absolute inset-0 bg-[#00F0FF]/5 blur-3xl rounded-2xl pointer-events-none"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#00F0FF]/20 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                    <Zap className="w-5 h-5 text-[#00F0FF]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#00F0FF] font-mono text-glow-cyan">{t.problem.new.title}</h3>
                </div>
                <ul className="space-y-4">
                  {t.problem.new.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                      <Check className="w-5 h-5 text-[#00C853] mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" aria-labelledby="how-title" className="py-32 px-6 bg-gradient-to-b from-[#0A0E27] to-[#0F1429]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 id="how-title" className="text-4xl lg:text-5xl font-black text-white mb-6 font-display">{t.howItWorks.title}</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">{t.howItWorks.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.howItWorks.steps.map((step, i) => (
              <div 
                key={i}
                className="relative group"
                data-testid={`how-step-${i}`}
              >
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-[#00F0FF]/40 to-transparent z-0" />
                )}
                <div className="relative z-10 text-center p-8 rounded-2xl bg-[#0A0E27] border border-[#00F0FF]/25 hover:border-[#00F0FF]/50 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,240,255,0.15)]">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00F0FF]/10 text-[#00F0FF] text-2xl font-black mb-6 group-hover:bg-[#00F0FF]/20 transition-colors shadow-[0_0_15px_rgba(0,240,255,0.2)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.4)]">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button 
              onClick={handleGetStarted}
              data-testid="button-how-cta"
              className="px-10 py-4 rounded-md bg-[#ffd700] text-[#0a0f1c] font-black text-lg hover:bg-[#ffd700]/90 transition-all transform hover:scale-[1.02]"
            >
              {lang === 'en' ? 'START DEPLOYING NOW' : 'JETZT DEPLOYEN'}
            </button>
          </div>
        </div>
      </section>

      {/* System/Features Section */}
      <section id="system" aria-labelledby="system-title" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 id="system-title" className="text-4xl lg:text-5xl font-black text-white mb-6 font-display">{t.system.title}</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">{t.system.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {t.system.features.map((feature, i) => (
              <div 
                key={i}
                className="group p-8 rounded-2xl bg-[#0F1429] border border-[#00F0FF]/15 hover:border-[#00F0FF]/40 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,240,255,0.1)]"
                data-testid={`feature-card-${i}`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF] mb-6 group-hover:bg-[#00F0FF]/20 transition-colors shadow-[0_0_10px_rgba(0,240,255,0.2)] group-hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                  <FeatureIcon icon={feature.icon} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3" data-testid={`feature-title-${i}`}>{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section id="social-proof" aria-labelledby="social-title" className="py-32 px-6 border-y border-[#00F0FF]/15 bg-[#0F1429]/50">
        <div className="max-w-7xl mx-auto">
          <h2 id="social-title" className="text-3xl lg:text-4xl font-black text-white text-center mb-16 font-display">{t.social.title}</h2>
          
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {t.social.stats.map((stat, i) => (
              <div key={i} className="text-center" data-testid={`stat-${i}`}>
                <div className="text-4xl lg:text-5xl font-black text-[#00F0FF] mb-2 text-glow-cyan" data-testid={`stat-value-${i}`}>{stat.value}</div>
                <div className="text-sm text-slate-500 font-mono uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-6">
            {t.social.testimonials.map((testimonial, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#0A0E27] border border-[#00F0FF]/15 hover:border-[#00F0FF]/35 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]" data-testid={`testimonial-${i}`}>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed" data-testid={`testimonial-text-${i}`}>"{testimonial.text}"</p>
                <div>
                  <div className="font-bold text-white" data-testid={`testimonial-name-${i}`}>{testimonial.name}</div>
                  <div className="text-sm text-slate-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" aria-labelledby="pricing-title" className="py-32 px-6 bg-gradient-to-b from-[#0A0E27] to-[#0F1429]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 id="pricing-title" className="text-4xl lg:text-5xl font-black text-white mb-6 font-display">{t.pricing.title}</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">{t.pricing.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter - Free */}
            <div className="p-8 rounded-2xl border border-[#00F0FF]/20 bg-[#0F1429]/70 hover:border-[#00F0FF]/40 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,240,255,0.1)]" data-testid="pricing-card-starter">
              <p className="text-sm text-[#00F0FF] font-mono mb-2">{t.pricing.plans.starter.headline}</p>
              <h3 className="text-xl font-bold text-white mb-2">{t.pricing.plans.starter.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-black text-white" data-testid="price-starter">{t.pricing.plans.starter.price}</span>
                <span className="text-slate-500 text-sm">{t.pricing.plans.starter.unit}</span>
              </div>
              <p className="text-slate-500 text-sm mb-8">&nbsp;</p>
              <ul className="space-y-4 mb-8">
                {t.pricing.plans.starter.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-400">
                    <Check className="w-4 h-4 text-[#00F0FF]/60" />
                    {f}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handlePricingClick('starter')}
                data-testid="button-buy-starter"
                className="w-full py-3 rounded-md border border-[#00F0FF]/40 text-[#00F0FF] font-bold font-mono text-sm hover:bg-[#00F0FF]/10 hover:border-[#00F0FF] hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
              >
                {t.pricing.plans.starter.cta}
              </button>
            </div>

            {/* Pro - Highlighted */}
            <div className="relative p-8 rounded-2xl border-2 border-[#FFD700]/50 bg-[#0F1429] shadow-[0_0_40px_rgba(255,215,0,0.15)] hover:shadow-[0_0_60px_rgba(255,215,0,0.25)] transform md:-translate-y-4 transition-all duration-300" data-testid="pricing-card-pro">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#FFD700] to-[#FF9100] text-[#0A0E27] text-xs font-bold rounded-full shadow-[0_0_15px_rgba(255,215,0,0.5)]" data-testid="badge-most-popular">
                {t.pricing.plans.pro.tag}
              </div>
              <p className="text-sm text-[#FFD700] font-mono mb-2">{t.pricing.plans.pro.headline}</p>
              <h3 className="text-xl font-bold text-white mb-2">{t.pricing.plans.pro.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-black text-[#FFD700] text-glow-gold" data-testid="price-pro">{t.pricing.plans.pro.price}</span>
                <span className="text-slate-400 text-sm">{t.pricing.plans.pro.unit}</span>
              </div>
              <p className="text-[#00C853] text-sm mb-8 font-medium">{lang === 'en' ? '7-day free trial' : '7 Tage kostenlos'}</p>
              <ul className="space-y-4 mb-8">
                {t.pricing.plans.pro.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <Check className="w-4 h-4 text-[#FFD700]" />
                    {f}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handlePricingClick('pro')}
                data-testid="button-buy-pro"
                className="w-full py-3 rounded-md bg-gradient-to-r from-[#FFD700] to-[#FF9100] text-[#0A0E27] font-bold font-mono text-sm hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all shadow-[0_0_15px_rgba(255,215,0,0.3)]"
              >
                {t.pricing.plans.pro.cta}
              </button>
            </div>

            {/* Agency */}
            <div className="p-8 rounded-2xl border border-[#00F0FF]/20 bg-[#0F1429]/70 hover:border-[#00F0FF]/40 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,240,255,0.1)]" data-testid="pricing-card-agency">
              <p className="text-sm text-[#00F0FF] font-mono mb-2">{t.pricing.plans.agency.headline}</p>
              <h3 className="text-xl font-bold text-white mb-2">{t.pricing.plans.agency.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-black text-white" data-testid="price-agency">{t.pricing.plans.agency.price}</span>
                <span className="text-slate-500 text-sm">{t.pricing.plans.agency.unit}</span>
              </div>
              <p className="text-slate-500 text-sm mb-8">&nbsp;</p>
              <ul className="space-y-4 mb-8">
                {t.pricing.plans.agency.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-400">
                    <Check className="w-4 h-4 text-[#00F0FF]" />
                    {f}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handlePricingClick('agency')}
                data-testid="button-buy-agency"
                className="w-full py-3 rounded-md border border-[#00F0FF]/40 text-[#00F0FF] font-bold font-mono text-sm hover:bg-[#00F0FF]/10 hover:border-[#00F0FF] hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
              >
                {t.pricing.plans.agency.cta}
              </button>
            </div>
          </div>

          {/* Payment Trust Badges */}
          <div className="mt-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Lock className="w-4 h-4" />
                <span>Sichere Zahlung via Stripe</span>
              </div>
              <div className="flex items-center justify-center gap-6 flex-wrap">
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0F1429]/80 border border-[#1a2744]">
                  <SiVisa className="w-8 h-5 text-[#1A1F71]" style={{filter: 'brightness(2)'}} />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0F1429]/80 border border-[#1a2744]">
                  <SiMastercard className="w-8 h-5 text-[#EB001B]" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0F1429]/80 border border-[#1a2744]">
                  <SiApplepay className="w-8 h-5 text-white" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0F1429]/80 border border-[#1a2744]">
                  <SiGooglepay className="w-8 h-5 text-white" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0F1429]/80 border border-[#1a2744]">
                  <SiStripe className="w-10 h-5 text-[#635BFF]" style={{filter: 'brightness(1.3)'}} />
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-2">256-bit SSL verschlüsselt</p>
            </div>
          </div>

          {/* Data Privacy Trust Section */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="p-6 rounded-2xl border border-[#00C853]/30 bg-[#00C853]/5">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-[#00C853]" />
                <h3 className="text-lg font-bold text-[#00C853]">100% Deine Daten</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#00C853]/10 flex items-center justify-center">
                    <X className="w-5 h-5 text-[#00C853]" />
                  </div>
                  <p className="text-sm text-slate-400">Kein Tracking</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#00C853]/10 flex items-center justify-center">
                    <X className="w-5 h-5 text-[#00C853]" />
                  </div>
                  <p className="text-sm text-slate-400">Kein Datenverkauf</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#00C853]/10 flex items-center justify-center">
                    <X className="w-5 h-5 text-[#00C853]" />
                  </div>
                  <p className="text-sm text-slate-400">Keine Weitergabe</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 text-center mt-4">
                Dein Code bleibt dein Code. Wir speichern keine ZIP-Inhalte. DSGVO-konform.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq-section" aria-labelledby="faq-title" className="py-24 px-6 bg-[#0F1429]/50">
        <div className="max-w-4xl mx-auto">
          <h2 id="faq-title" className="text-3xl lg:text-4xl font-black text-white mb-12 text-center font-display">
            {t.faq.title}
          </h2>
          <div className="space-y-6">
            {t.faq.items.map((item: {q: string; a: string}, index: number) => (
              <div 
                key={index} 
                className="bg-[#0A0E27]/80 border border-[#00F0FF]/20 rounded-lg p-6 hover:border-[#00F0FF]/40 transition-all"
                data-testid={`faq-item-${index}`}
              >
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#00F0FF]/20 flex items-center justify-center text-[#00F0FF] text-sm font-mono">
                    {index + 1}
                  </span>
                  {item.q}
                </h3>
                <p className="text-slate-400 ml-11">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="cta" aria-labelledby="cta-title" className="py-32 px-6 bg-gradient-to-b from-[#0A0E27] to-[#0F1429]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 id="cta-title" className="text-4xl lg:text-5xl font-black text-white mb-6 font-display">{t.cta.title}</h2>
          <p className="text-xl text-slate-400 mb-12">{t.cta.subtitle}</p>
          <button 
            onClick={handleGetStarted}
            data-testid="button-final-cta"
            className="group px-10 py-5 rounded-md bg-gradient-to-r from-[#FFD700] to-[#FF9100] text-[#0A0E27] font-bold text-lg hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(255,215,0,0.4)] hover:shadow-[0_0_50px_rgba(255,215,0,0.6)] inline-flex items-center gap-3"
          >
            <Rocket className="w-5 h-5" />
            {t.cta.button}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-[#00F0FF]/15 bg-[#0A0E27]" role="contentinfo">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 font-black text-xl tracking-tighter text-white group">
              <div className="w-6 h-6 bg-[#00F0FF] rounded flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.4)]">
                <Zap className="w-4 h-4 fill-[#0A0E27] text-[#0A0E27]" />
              </div>
              ZIP<span className="text-[#00F0FF] text-glow-cyan">SHIP</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500 font-mono">
              <a href="/faq" className="hover:text-[#00F0FF] transition-colors" data-testid="link-faq">FAQ</a>
              <a href="/team" className="hover:text-[#00F0FF] transition-colors" data-testid="link-team">TEAM</a>
              <a href="/docs" className="hover:text-[#00F0FF] transition-colors" data-testid="link-docs">DOCS</a>
              <a href="/blog" className="hover:text-[#00F0FF] transition-colors" data-testid="link-blog">BLOG</a>
              <a href="/impressum" className="hover:text-[#00F0FF] transition-colors" data-testid="link-impressum">IMPRESSUM</a>
              <a href="/datenschutz" className="hover:text-[#00F0FF] transition-colors" data-testid="link-privacy">DATENSCHUTZ</a>
              <a href="/agb" className="hover:text-[#00F0FF] transition-colors" data-testid="link-terms">AGB</a>
            </div>
            <p className="text-slate-600 text-xs">© 2026 ZipShip Technologies</p>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
};

export default LandingPage;
