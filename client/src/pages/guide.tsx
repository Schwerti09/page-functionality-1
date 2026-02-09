import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Zap, Clock, ArrowRight, GitBranch, Rocket, Shield, Bot, ChevronRight, BookOpen, Code, Users, DollarSign, Lock, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Guide() {
  const [lang, setLang] = useState<'en' | 'de'>('de');
  const [activeSection, setActiveSection] = useState('what-is-zero-config');

  const content = {
    en: {
      title: "The Complete Guide to Zero-Config Deployment",
      subtitle: "Everything you need to know about deploying without configuration complexity",
      readTime: "15 min read",
      lastUpdated: "February 2026",
      heroStats: [
        { value: "30", unit: "SEC", label: "Average Deploy Time" },
        { value: "0", unit: "CONFIG", label: "Files Required" },
        { value: "100%", unit: "AUTO", label: "Fully Automated" }
      ],
      intro: `In the world of modern web development, deployment has traditionally been one of the most complex and time-consuming aspects of the development workflow. From setting up CI/CD pipelines to configuring YAML files and managing environment variables, developers often spend more time on deployment infrastructure than on writing actual code.

**Zero-Config Deployment** changes this paradigm entirely. Instead of spending hours on setup, you can deploy your projects in seconds—no terminal commands, no configuration files, no DevOps expertise required.`,
      sections: [
        {
          id: "what-is-zero-config",
          title: "What is Zero-Config Deployment?",
          icon: "code",
          content: `**Zero-config deployment** refers to a deployment methodology where applications can be deployed without any manual configuration. The platform automatically detects your project type, installs dependencies, builds your application, and deploys it to the cloud.

### Key Characteristics:

- **No YAML files** - No need to write complex configuration files
- **No terminal commands** - No git push, npm run deploy, or similar
- **Automatic detection** - Framework and project type detection
- **Instant results** - Deployment in seconds, not minutes

### The Traditional Approach vs Zero-Config

| Traditional CI/CD | Zero-Config (ZIP-SHIP) |
|-------------------|------------------------|
| 47 min average setup | 30 seconds |
| YAML configuration required | No configuration |
| Git knowledge required | Just drag & drop |
| DevOps expertise needed | Beginner-friendly |`
        },
        {
          id: "how-it-works",
          title: "How ZIP-SHIP Works",
          icon: "play",
          content: `ZIP-SHIP implements zero-config deployment through a three-step process:

### Step 1: Upload Your ZIP
Simply drag and drop your project folder as a ZIP file. Our system automatically:
- Filters unnecessary files (node_modules, .git, .env)
- Validates file structure and sizes
- Detects your framework (React, Vue, Next.js, etc.)

### Step 2: Connect GitHub
A one-time OAuth connection to your GitHub account. No tokens to manage, no permissions to configure manually.

### Step 3: Get Your Repository
Within 5-30 seconds, your complete project is:
- Uploaded to a new GitHub repository
- Organized with proper file structure
- Ready for sharing or further development

### Technical Architecture

\`\`\`
[ZIP Upload] → [Validation] → [GitHub OAuth] → [Repo Creation] → [File Push] → [Success]
     ↓              ↓              ↓                 ↓               ↓
   Client       Server        OAuth 2.0         GitHub API      Git Trees API
\`\`\``
        },
        {
          id: "when-to-use",
          title: "When to Use Zero-Config Deployment",
          icon: "users",
          content: `Zero-config deployment excels in specific scenarios:

### Perfect For:

**1. Prototypes & MVPs**
When you need to share a working demo quickly, zero-config saves hours of setup time.

**2. Freelance Client Projects**
Deliver projects to clients with a single ZIP upload—no need to teach them Git.

**3. Portfolio Sites**
Get your personal projects online without the DevOps overhead.

**4. Design-to-Code Exports**
Tools like Webflow, Framer, or Figma exports can be deployed instantly.

**5. Hackathons & Time-Sensitive Projects**
When every minute counts, skip the CI/CD setup.

### When Traditional CI/CD is Better:

- Large teams (10+ developers)
- Complex microservices architectures
- Strict enterprise compliance requirements
- Applications requiring extensive automated testing`
        },
        {
          id: "vs-competitors",
          title: "ZIP-SHIP vs. Traditional Platforms",
          icon: "gitbranch",
          content: `### GitHub Pages
- **Pros**: Free, integrated with GitHub
- **Cons**: Git commands required, Jekyll-focused, limited features
- **ZIP-SHIP Advantage**: No Git knowledge needed, any project type

### Vercel
- **Pros**: Excellent Next.js support, Edge network
- **Cons**: Git repository required, framework lock-in
- **ZIP-SHIP Advantage**: Works with any ZIP, no Git setup

### Netlify
- **Pros**: Great form handling, identity features
- **Cons**: Complex pricing, Git-first workflow
- **ZIP-SHIP Advantage**: Simpler pricing, drag & drop

### Railway/Render
- **Pros**: Full-stack capabilities, databases
- **Cons**: Higher complexity, variable costs
- **ZIP-SHIP Advantage**: Predictable pricing, faster deployment`
        },
        {
          id: "ai-auto-fix",
          title: "AI Auto-Fix: Intelligent Error Resolution",
          icon: "bot",
          content: `ZIP-SHIP includes an AI-powered feature that automatically detects and fixes common project issues:

### What AI Auto-Fix Handles:

**1. Version Mismatches**
Detects when dependencies have conflicting versions and suggests compatible alternatives.

**2. Corrupted Files**
Identifies and regenerates corrupted configuration files (favicon.ico, manifest.json).

**3. Configuration Errors**
Fixes common mistakes in next.config.js, tsconfig.json, and similar files.

**4. Missing Dependencies**
Detects missing peer dependencies and adds them automatically.

### How It Works:

1. **Analysis Phase**: AI scans your project structure
2. **Detection Phase**: Identifies potential issues
3. **Resolution Phase**: Applies fixes automatically
4. **Validation Phase**: Confirms successful resolution

This feature is optional and can be enabled/disabled in your dashboard settings.`
        },
        {
          id: "security",
          title: "Security & Privacy",
          icon: "lock",
          content: `### Data Privacy

- **256-bit SSL encryption** for all file transfers
- **No permanent storage** - Files are processed and immediately deleted
- **GDPR compliant** - Full data protection to European standards
- **No tracking** - We don't sell or share your data

### GitHub Integration Security

- **OAuth 2.0** with PKCE for secure authentication
- **Minimal permissions** - Only repository creation and push
- **Token encryption** - Access tokens stored with industry-standard encryption
- **Revocable access** - Disconnect GitHub anytime from dashboard

### Payment Security

- **Stripe** handles all payments
- **PCI DSS compliant** - Card data never touches our servers
- **No stored card numbers** - Only verification tokens`
        },
        {
          id: "pricing",
          title: "Pricing Model",
          icon: "dollar",
          content: `ZIP-SHIP uses a simple pay-per-deploy model:

### Single Deploy - €2.99
- 1 deployment credit
- Perfect for trying out

### Deploy Pack - €9.99 (Best Value)
- 10 deployment credits
- 67% savings vs. single deploy
- Most popular choice

### Enterprise - €29.99/month
- Unlimited deployments
- Priority support
- Custom branding options

### Free Welcome Credit
New users receive **1 free deployment** after card verification—no charge.`
        },
        {
          id: "getting-started",
          title: "Getting Started",
          icon: "rocket",
          content: `### Quick Start Guide

**Step 1**: Create your account at [zip-ship-revolution.com](https://zip-ship-revolution.com)

**Step 2**: Verify your card (no charge) for 1 free deploy

**Step 3**: Connect your GitHub account

**Step 4**: Prepare your project as a ZIP file

**Step 5**: Drag & drop to deploy!

### Tips for Best Results:

- **Exclude node_modules** - We handle dependencies automatically
- **Include package.json** - For correct dependency detection
- **Keep files under 100MB** - For optimal upload speed
- **Use descriptive project names** - For better repository organization`
        }
      ],
      clusterLinks: {
        title: "Related Articles",
        articles: [
          { title: "GitHub Pages vs. ZIP-SHIP: Complete Comparison", slug: "github-pages-vs-zipship", description: "Detailed comparison of GitHub Pages and ZIP-SHIP for static site deployment" },
          { title: "5 CI/CD Alternatives for Frontend Developers", slug: "cicd-alternatives", description: "Discover modern alternatives to traditional CI/CD pipelines" },
          { title: "Deploy React Without Terminal Commands", slug: "deploy-react-no-terminal", description: "Step-by-step guide to deploying React apps without command line" },
          { title: "What is CI/CD? Simply Explained", slug: "was-ist-cicd-einfach-erklaert", description: "Beginner-friendly explanation of CI/CD concepts" }
        ]
      },
      cta: {
        title: "Ready to Deploy?",
        description: "Skip the configuration complexity. Deploy your first project in under 30 seconds.",
        button: "Deploy Now"
      }
    },
    de: {
      title: "Der komplette Guide für Zero-Config Deployment",
      subtitle: "Alles was du über Deployment ohne Konfigurationskomplexität wissen musst",
      readTime: "15 Min. Lesezeit",
      lastUpdated: "Februar 2026",
      heroStats: [
        { value: "30", unit: "SEK", label: "Durchschnittliche Deploy-Zeit" },
        { value: "0", unit: "CONFIG", label: "Dateien benötigt" },
        { value: "100%", unit: "AUTO", label: "Vollautomatisiert" }
      ],
      intro: `In der Welt der modernen Webentwicklung war Deployment traditionell einer der komplexesten und zeitaufwändigsten Aspekte des Entwicklungs-Workflows. Vom Einrichten von CI/CD-Pipelines über das Konfigurieren von YAML-Dateien bis zum Verwalten von Umgebungsvariablen – Entwickler verbringen oft mehr Zeit mit Deployment-Infrastruktur als mit dem Schreiben von Code.

**Zero-Config Deployment** ändert dieses Paradigma komplett. Anstatt Stunden mit Setup zu verbringen, kannst du deine Projekte in Sekunden deployen – keine Terminal-Befehle, keine Konfigurationsdateien, keine DevOps-Expertise erforderlich.`,
      sections: [
        {
          id: "what-is-zero-config",
          title: "Was ist Zero-Config Deployment?",
          icon: "code",
          content: `**Zero-Config Deployment** bezeichnet eine Deployment-Methodik, bei der Anwendungen ohne manuelle Konfiguration deployed werden können. Die Plattform erkennt automatisch deinen Projekttyp, installiert Dependencies, baut deine Anwendung und deployed sie in die Cloud.

### Kernmerkmale:

- **Keine YAML-Dateien** - Keine komplexen Konfigurationsdateien nötig
- **Keine Terminal-Befehle** - Kein git push, npm run deploy oder ähnliches
- **Automatische Erkennung** - Framework- und Projekttyp-Erkennung
- **Sofortige Ergebnisse** - Deployment in Sekunden, nicht Minuten

### Traditioneller Ansatz vs Zero-Config

| Traditionelles CI/CD | Zero-Config (ZIP-SHIP) |
|----------------------|------------------------|
| 47 Min. durchschn. Setup | 30 Sekunden |
| YAML-Konfiguration nötig | Keine Konfiguration |
| Git-Kenntnisse nötig | Nur Drag & Drop |
| DevOps-Expertise nötig | Anfängerfreundlich |`
        },
        {
          id: "how-it-works",
          title: "Wie ZIP-SHIP funktioniert",
          icon: "play",
          content: `ZIP-SHIP implementiert Zero-Config Deployment durch einen dreistufigen Prozess:

### Schritt 1: ZIP hochladen
Ziehe einfach deinen Projektordner als ZIP-Datei per Drag & Drop. Unser System automatisch:
- Filtert unnötige Dateien (node_modules, .git, .env)
- Validiert Dateistruktur und -größen
- Erkennt dein Framework (React, Vue, Next.js, etc.)

### Schritt 2: GitHub verbinden
Eine einmalige OAuth-Verbindung zu deinem GitHub-Account. Keine Tokens zu verwalten, keine Berechtigungen manuell zu konfigurieren.

### Schritt 3: Repository erhalten
Innerhalb von 5-30 Sekunden ist dein komplettes Projekt:
- In ein neues GitHub-Repository hochgeladen
- Mit korrekter Dateistruktur organisiert
- Bereit zum Teilen oder Weiterentwickeln

### Technische Architektur

\`\`\`
[ZIP Upload] → [Validierung] → [GitHub OAuth] → [Repo-Erstellung] → [File Push] → [Erfolg]
     ↓              ↓               ↓                 ↓                ↓
   Client       Server         OAuth 2.0         GitHub API       Git Trees API
\`\`\``
        },
        {
          id: "when-to-use",
          title: "Wann Zero-Config Deployment nutzen",
          icon: "users",
          content: `Zero-Config Deployment glänzt in spezifischen Szenarien:

### Perfekt für:

**1. Prototypen & MVPs**
Wenn du schnell eine funktionierende Demo teilen musst, spart Zero-Config Stunden an Setup-Zeit.

**2. Freelance-Kundenprojekte**
Projekte an Kunden mit einem einzigen ZIP-Upload liefern – kein Git-Teaching nötig.

**3. Portfolio-Seiten**
Persönliche Projekte online bringen ohne DevOps-Overhead.

**4. Design-to-Code Exports**
Tools wie Webflow, Framer oder Figma-Exports können sofort deployed werden.

**5. Hackathons & zeitkritische Projekte**
Wenn jede Minute zählt, überspringe das CI/CD-Setup.

### Wann traditionelles CI/CD besser ist:

- Große Teams (10+ Entwickler)
- Komplexe Microservices-Architekturen
- Strenge Enterprise-Compliance-Anforderungen
- Anwendungen die umfangreiche automatisierte Tests brauchen`
        },
        {
          id: "vs-competitors",
          title: "ZIP-SHIP vs. traditionelle Plattformen",
          icon: "gitbranch",
          content: `### GitHub Pages
- **Vorteile**: Kostenlos, in GitHub integriert
- **Nachteile**: Git-Befehle erforderlich, Jekyll-fokussiert, begrenzte Features
- **ZIP-SHIP Vorteil**: Keine Git-Kenntnisse nötig, jeder Projekttyp

### Vercel
- **Vorteile**: Exzellenter Next.js-Support, Edge-Netzwerk
- **Nachteile**: Git-Repository erforderlich, Framework Lock-in
- **ZIP-SHIP Vorteil**: Funktioniert mit jeder ZIP, kein Git-Setup

### Netlify
- **Vorteile**: Tolles Formular-Handling, Identity-Features
- **Nachteile**: Komplexe Preise, Git-first Workflow
- **ZIP-SHIP Vorteil**: Einfachere Preise, Drag & Drop

### Railway/Render
- **Vorteile**: Full-Stack-Fähigkeiten, Datenbanken
- **Nachteile**: Höhere Komplexität, variable Kosten
- **ZIP-SHIP Vorteil**: Vorhersehbare Preise, schnelleres Deployment`
        },
        {
          id: "ai-auto-fix",
          title: "KI Auto-Fix: Intelligente Fehlerbehebung",
          icon: "bot",
          content: `ZIP-SHIP enthält ein KI-gestütztes Feature, das automatisch häufige Projektprobleme erkennt und behebt:

### Was KI Auto-Fix behandelt:

**1. Versions-Mismatches**
Erkennt wenn Dependencies widersprüchliche Versionen haben und schlägt kompatible Alternativen vor.

**2. Beschädigte Dateien**
Identifiziert und regeneriert beschädigte Konfigurationsdateien (favicon.ico, manifest.json).

**3. Konfigurationsfehler**
Behebt häufige Fehler in next.config.js, tsconfig.json und ähnlichen Dateien.

**4. Fehlende Dependencies**
Erkennt fehlende Peer-Dependencies und fügt sie automatisch hinzu.

### Wie es funktioniert:

1. **Analysephase**: KI scannt deine Projektstruktur
2. **Erkennungsphase**: Identifiziert potenzielle Probleme
3. **Behebungsphase**: Wendet Fixes automatisch an
4. **Validierungsphase**: Bestätigt erfolgreiche Behebung

Diese Funktion ist optional und kann in deinen Dashboard-Einstellungen aktiviert/deaktiviert werden.`
        },
        {
          id: "security",
          title: "Sicherheit & Datenschutz",
          icon: "lock",
          content: `### Datenschutz

- **256-Bit SSL-Verschlüsselung** für alle Dateiübertragungen
- **Keine dauerhafte Speicherung** - Dateien werden verarbeitet und sofort gelöscht
- **DSGVO-konform** - Vollständiger Datenschutz nach europäischen Standards
- **Kein Tracking** - Wir verkaufen oder teilen deine Daten nicht

### GitHub-Integrationssicherheit

- **OAuth 2.0** mit PKCE für sichere Authentifizierung
- **Minimale Berechtigungen** - Nur Repository-Erstellung und Push
- **Token-Verschlüsselung** - Zugriffstoken mit Industriestandard-Verschlüsselung gespeichert
- **Widerrufbarer Zugriff** - GitHub jederzeit im Dashboard trennen

### Zahlungssicherheit

- **Stripe** wickelt alle Zahlungen ab
- **PCI DSS konform** - Kartendaten berühren nie unsere Server
- **Keine gespeicherten Kartennummern** - Nur Verifizierungs-Tokens`
        },
        {
          id: "pricing",
          title: "Preismodell",
          icon: "dollar",
          content: `ZIP-SHIP verwendet ein einfaches Pay-per-Deploy-Modell:

### Single Deploy - 2,99€
- 1 Deployment-Credit
- Perfekt zum Ausprobieren

### Deploy Pack - 9,99€ (Bester Wert)
- 10 Deployment-Credits
- 67% Ersparnis vs. Single Deploy
- Beliebteste Wahl

### Enterprise - 29,99€/Monat
- Unbegrenzte Deployments
- Prioritäts-Support
- Custom Branding-Optionen

### Kostenloses Willkommens-Credit
Neue Nutzer erhalten **1 kostenloses Deployment** nach Kartenverifizierung—keine Belastung.`
        },
        {
          id: "getting-started",
          title: "Erste Schritte",
          icon: "rocket",
          content: `### Schnellstart-Anleitung

**Schritt 1**: Erstelle dein Konto auf [zip-ship-revolution.com](https://zip-ship-revolution.com)

**Schritt 2**: Verifiziere deine Karte (keine Belastung) für 1 kostenloses Deploy

**Schritt 3**: Verbinde dein GitHub-Konto

**Schritt 4**: Bereite dein Projekt als ZIP-Datei vor

**Schritt 5**: Drag & Drop zum Deployen!

### Tipps für beste Ergebnisse:

- **node_modules ausschließen** - Wir behandeln Dependencies automatisch
- **package.json einschließen** - Für korrekte Dependency-Erkennung
- **Dateien unter 100MB halten** - Für optimale Upload-Geschwindigkeit
- **Beschreibende Projektnamen verwenden** - Für bessere Repository-Organisation`
        }
      ],
      clusterLinks: {
        title: "Verwandte Artikel",
        articles: [
          { title: "GitHub Pages vs. ZIP-SHIP: Kompletter Vergleich", slug: "github-pages-vs-zipship", description: "Detaillierter Vergleich von GitHub Pages und ZIP-SHIP für Static-Site-Deployment" },
          { title: "5 CI/CD-Alternativen für Frontend-Entwickler", slug: "cicd-alternatives", description: "Entdecke moderne Alternativen zu traditionellen CI/CD-Pipelines" },
          { title: "React deployen ohne Terminal-Befehle", slug: "deploy-react-no-terminal", description: "Schritt-für-Schritt-Anleitung zum Deployen von React-Apps ohne Kommandozeile" },
          { title: "Was ist CI/CD? Einfach erklärt", slug: "was-ist-cicd-einfach-erklaert", description: "Anfängerfreundliche Erklärung von CI/CD-Konzepten" }
        ]
      },
      cta: {
        title: "Bereit zum Deployen?",
        description: "Überspringe die Konfigurationskomplexität. Deploye dein erstes Projekt in unter 30 Sekunden.",
        button: "Jetzt Deployen"
      }
    }
  };

  const t = content[lang];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'code': return Code;
      case 'play': return Play;
      case 'users': return Users;
      case 'gitbranch': return GitBranch;
      case 'bot': return Bot;
      case 'lock': return Lock;
      case 'dollar': return DollarSign;
      case 'rocket': return Rocket;
      default: return BookOpen;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": t.title,
            "description": t.subtitle,
            "author": {
              "@type": "Organization",
              "name": "ZIP-SHIP",
              "url": "https://zip-ship-revolution.com"
            },
            "publisher": {
              "@type": "Organization",
              "name": "ZIP-SHIP",
              "logo": {
                "@type": "ImageObject",
                "url": "https://zip-ship-revolution.com/logo.svg"
              }
            },
            "datePublished": "2026-02-01",
            "dateModified": "2026-02-05",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://zip-ship-revolution.com/guide"
            },
            "about": {
              "@type": "Thing",
              "name": "Zero-Config Deployment"
            },
            "keywords": ["zero-config deployment", "deploy zip to github", "github pages alternative", "CI/CD alternative"]
          })
        }}
      />

      <header className="border-b border-[#00F0FF]/20 bg-[#0A0E27]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/">
            <a className="flex items-center gap-3 group" data-testid="link-back-home">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00F0FF] to-[#00C853] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all">
                <Zap className="w-5 h-5 text-[#0A0E27]" />
              </div>
              <span className="text-xl font-black text-white" style={{textShadow: '0 0 20px rgba(0,240,255,0.3)'}}>
                ZIP<span className="text-[#00F0FF]">SHIP</span>
              </span>
            </a>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400 hidden sm:block">{t.readTime}</span>
            <div className="flex items-center gap-1 bg-[#0F1429] rounded-lg p-1 border border-[#00F0FF]/20">
              <button
                onClick={() => setLang('de')}
                className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${lang === 'de' ? 'bg-[#00F0FF] text-[#0A0E27] shadow-[0_0_15px_rgba(0,240,255,0.4)]' : 'text-slate-400 hover:text-white'}`}
                data-testid="button-lang-de"
              >
                DE
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${lang === 'en' ? 'bg-[#00F0FF] text-[#0A0E27] shadow-[0_0_15px_rgba(0,240,255,0.4)]' : 'text-slate-400 hover:text-white'}`}
                data-testid="button-lang-en"
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden py-20 border-b border-[#00F0FF]/10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00F0FF]/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00C853]/10 rounded-full blur-[120px]" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="px-4 py-1.5 bg-[#00F0FF]/10 border border-[#00F0FF]/30 rounded-full">
                <span className="text-[#00F0FF] text-sm font-mono font-bold" style={{textShadow: '0 0 10px rgba(0,240,255,0.5)'}}>
                  {lang === 'de' ? 'ULTIMATIVER GUIDE' : 'ULTIMATE GUIDE'}
                </span>
              </div>
              <span className="text-slate-500 text-sm">{t.lastUpdated}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight" data-testid="heading-guide-title" style={{textShadow: '0 0 40px rgba(0,240,255,0.2)'}}>
              {t.title.split('Zero-Config').map((part, i) => 
                i === 0 ? part : <><span key={i} className="text-[#00F0FF]">Zero-Config</span>{part}</>
              )}
            </h1>
            
            <p className="text-xl text-slate-400 mb-10 max-w-2xl">
              {t.subtitle}
            </p>

            <div className="grid grid-cols-3 gap-4 md:gap-8 mb-10">
              {t.heroStats.map((stat, i) => (
                <div key={i} className="text-center p-4 md:p-6 bg-[#0F1429]/80 rounded-2xl border border-[#00F0FF]/20 hover:border-[#00F0FF]/40 transition-all group">
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-3xl md:text-5xl font-black text-white group-hover:text-[#00F0FF] transition-colors" style={{textShadow: '0 0 20px rgba(0,240,255,0.3)'}}>
                      {stat.value}
                    </span>
                    <span className="text-lg md:text-xl font-bold text-[#00F0FF]">{stat.unit}</span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00F0FF] to-[#00C853] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                <Zap className="w-6 h-6 text-[#0A0E27]" />
              </div>
              <div>
                <p className="font-bold text-white">ZIP-SHIP Team</p>
                <p className="text-sm text-slate-500">{lang === 'de' ? 'Offizielle Dokumentation' : 'Official Documentation'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                {lang === 'de' ? 'Inhaltsverzeichnis' : 'Table of Contents'}
              </h3>
              <nav className="space-y-1">
                {t.sections.map((section, index) => {
                  const Icon = getIcon(section.icon);
                  return (
                    <a 
                      key={section.id}
                      href={`#${section.id}`}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                        activeSection === section.id 
                          ? 'bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF]' 
                          : 'text-slate-400 hover:text-white hover:bg-[#0F1429]'
                      }`}
                      data-testid={`link-toc-${section.id}`}
                    >
                      <Icon className={`w-4 h-4 ${activeSection === section.id ? 'text-[#00F0FF]' : 'text-slate-500 group-hover:text-[#00F0FF]'}`} />
                      <span className="text-sm font-medium">{section.title}</span>
                    </a>
                  );
                })}
              </nav>

              <div className="mt-8 p-4 bg-gradient-to-br from-[#00F0FF]/10 to-[#00C853]/10 rounded-xl border border-[#00F0FF]/20">
                <Rocket className="w-8 h-8 text-[#00F0FF] mb-3" />
                <p className="text-sm text-slate-300 mb-3">{lang === 'de' ? 'Bereit loszulegen?' : 'Ready to start?'}</p>
                <Link href="/dashboard">
                  <Button size="sm" className="w-full bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-[#0A0E27] font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]" data-testid="button-sidebar-cta">
                    {lang === 'de' ? 'Jetzt Deployen' : 'Deploy Now'}
                  </Button>
                </Link>
              </div>
            </div>
          </aside>

          <main>
            <div className="prose prose-invert prose-lg max-w-none mb-12">
              <div className="text-lg text-slate-300 leading-relaxed whitespace-pre-line p-6 bg-[#0F1429]/50 rounded-2xl border border-[#00F0FF]/10 mb-12">
                {t.intro}
              </div>

              {t.sections.map((section, index) => {
                const Icon = getIcon(section.icon);
                return (
                  <section 
                    key={section.id} 
                    id={section.id} 
                    className="mb-16 scroll-mt-24 p-8 bg-[#0F1429]/30 rounded-2xl border border-[#00F0FF]/10 hover:border-[#00F0FF]/20 transition-all"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-[#00F0FF]/10 rounded-xl flex items-center justify-center border border-[#00F0FF]/30">
                        <Icon className="w-6 h-6 text-[#00F0FF]" />
                      </div>
                      <div>
                        <span className="text-[#00F0FF] font-mono text-sm block mb-1" style={{textShadow: '0 0 10px rgba(0,240,255,0.5)'}}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-white">
                          {section.title}
                        </h2>
                      </div>
                    </div>
                    <div className="text-slate-300 leading-relaxed whitespace-pre-line pl-0 md:pl-16">
                      {section.content}
                    </div>
                  </section>
                );
              })}
            </div>

            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-[#00F0FF]" />
                {t.clusterLinks.title}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {t.clusterLinks.articles.map((article) => (
                  <Link key={article.slug} href={`/blog/${article.slug}`}>
                    <div className="p-6 bg-[#0F1429] rounded-xl border border-[#00F0FF]/20 hover:border-[#00F0FF]/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.1)] transition-all cursor-pointer group h-full">
                      <h3 className="font-bold text-white group-hover:text-[#00F0FF] transition-colors mb-2 flex items-center gap-2">
                        {article.title}
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-sm text-slate-400">{article.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="relative overflow-hidden bg-gradient-to-r from-[#00F0FF]/10 via-[#00C853]/10 to-[#00F0FF]/10 rounded-3xl p-10 border border-[#00F0FF]/30 text-center">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDI0MCwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50" />
              
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-[#00F0FF] to-[#00C853] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(0,240,255,0.4)]">
                  <Rocket className="w-10 h-10 text-[#0A0E27]" />
                </div>
                <h2 className="text-3xl font-black mb-4" style={{textShadow: '0 0 30px rgba(0,240,255,0.3)'}}>{t.cta.title}</h2>
                <p className="text-slate-400 mb-8 max-w-lg mx-auto text-lg">{t.cta.description}</p>
                <Link href="/dashboard">
                  <Button className="bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-[#0A0E27] font-black px-10 py-6 text-lg shadow-[0_0_30px_rgba(0,240,255,0.5)] hover:shadow-[0_0_50px_rgba(0,240,255,0.7)] transition-all" data-testid="button-cta-deploy">
                    {t.cta.button}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </section>
          </main>
        </div>
      </div>

      <footer className="border-t border-[#00F0FF]/10 py-12 mt-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-500 mb-8">
            <Link href="/"><a className="hover:text-[#00F0FF] transition-colors">Home</a></Link>
            <Link href="/blog"><a className="hover:text-[#00F0FF] transition-colors">Blog</a></Link>
            <Link href="/faq"><a className="hover:text-[#00F0FF] transition-colors">FAQ</a></Link>
            <Link href="/docs"><a className="hover:text-[#00F0FF] transition-colors">Docs</a></Link>
            <Link href="/impressum"><a className="hover:text-[#00F0FF] transition-colors">Impressum</a></Link>
            <Link href="/datenschutz"><a className="hover:text-[#00F0FF] transition-colors">Datenschutz</a></Link>
          </div>
          <p className="text-center text-slate-600 text-sm">
            © 2026 ZIP-SHIP. {lang === 'de' ? 'Alle Rechte vorbehalten.' : 'All rights reserved.'}
          </p>
        </div>
      </footer>
    </div>
  );
}
