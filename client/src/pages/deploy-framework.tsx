import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Rocket, ArrowRight, Zap, GitBranch, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const frameworks: Record<string, {
  name: string;
  tagDE: string;
  tagEN: string;
  descriptionDE: string;
  descriptionEN: string;
  color: string;
  icon: string;
  features: string[];
}> = {
  react: {
    name: "React",
    tagDE: "React Projekte in Sekunden deployen",
    tagEN: "Deploy React Projects in Seconds",
    descriptionDE: "Lade dein React-Projekt als ZIP hoch und wir erstellen automatisch ein GitHub Repository. Keine Konfiguration, keine CLI, einfach Drag & Drop.",
    descriptionEN: "Upload your React project as a ZIP and we automatically create a GitHub repository. No config, no CLI, just drag & drop.",
    color: "#61DAFB",
    icon: "⚛️",
    features: ["Vite & CRA Support", "TypeScript Ready", "Auto-Fix Errors"]
  },
  nextjs: {
    name: "Next.js",
    tagDE: "Next.js Apps blitzschnell auf GitHub",
    tagEN: "Next.js Apps Lightning Fast to GitHub",
    descriptionDE: "Deploye deine Next.js 14+ Anwendung direkt auf GitHub. Wir erkennen automatisch deine Konfiguration und beheben typische Fehler.",
    descriptionEN: "Deploy your Next.js 14+ application directly to GitHub. We automatically detect your config and fix common errors.",
    color: "#000000",
    icon: "▲",
    features: ["App Router Support", "Server Actions", "Edge Runtime"]
  },
  vue: {
    name: "Vue.js",
    tagDE: "Vue.js Projekte instant deployen",
    tagEN: "Deploy Vue.js Projects Instantly",
    descriptionDE: "Vue 3, Nuxt oder Vite-basierte Projekte - einfach ZIP hochladen und fertig. Dein Code ist in Sekunden auf GitHub.",
    descriptionEN: "Vue 3, Nuxt or Vite-based projects - just upload ZIP and done. Your code is on GitHub in seconds.",
    color: "#4FC08D",
    icon: "💚",
    features: ["Vue 3 Composition API", "Nuxt Ready", "Pinia Support"]
  },
  angular: {
    name: "Angular",
    tagDE: "Angular Projekte schnell deployen",
    tagEN: "Deploy Angular Projects Fast",
    descriptionDE: "Angular CLI Projekte einfach als ZIP hochladen. Wir kümmern uns um die GitHub-Integration.",
    descriptionEN: "Simply upload Angular CLI projects as ZIP. We handle the GitHub integration.",
    color: "#DD0031",
    icon: "🅰️",
    features: ["Angular 17+", "Standalone Components", "SSR Ready"]
  },
  svelte: {
    name: "Svelte",
    tagDE: "Svelte & SvelteKit deployen",
    tagEN: "Deploy Svelte & SvelteKit",
    descriptionDE: "Deine Svelte oder SvelteKit App in Sekunden auf GitHub. Inklusive automatischer Fehlererkennung.",
    descriptionEN: "Your Svelte or SvelteKit app on GitHub in seconds. Including automatic error detection.",
    color: "#FF3E00",
    icon: "🔥",
    features: ["SvelteKit 2", "Server Routes", "Form Actions"]
  },
  html: {
    name: "HTML/CSS/JS",
    tagDE: "Statische Websites deployen",
    tagEN: "Deploy Static Websites",
    descriptionDE: "Klassische HTML/CSS/JS Projekte oder statische Seiten einfach auf GitHub hochladen.",
    descriptionEN: "Classic HTML/CSS/JS projects or static sites easily uploaded to GitHub.",
    color: "#E34F26",
    icon: "📄",
    features: ["Any Static Site", "No Build Required", "GitHub Pages Ready"]
  },
  python: {
    name: "Python",
    tagDE: "Python Projekte auf GitHub",
    tagEN: "Python Projects to GitHub",
    descriptionDE: "Flask, Django, FastAPI oder beliebige Python-Projekte als ZIP hochladen und auf GitHub pushen.",
    descriptionEN: "Upload Flask, Django, FastAPI or any Python project as ZIP and push to GitHub.",
    color: "#3776AB",
    icon: "🐍",
    features: ["Django & Flask", "FastAPI", "Requirements.txt"]
  },
  nodejs: {
    name: "Node.js",
    tagDE: "Node.js Apps deployen",
    tagEN: "Deploy Node.js Apps",
    descriptionDE: "Express, Fastify, Nest.js oder andere Node.js Backends direkt auf GitHub deployen.",
    descriptionEN: "Deploy Express, Fastify, Nest.js or other Node.js backends directly to GitHub.",
    color: "#339933",
    icon: "💚",
    features: ["Express & Fastify", "NestJS", "TypeScript"]
  }
};

export default function DeployFramework() {
  const { framework } = useParams<{ framework: string }>();
  const fw = framework && frameworks[framework.toLowerCase()];
  
  const isGerman = typeof navigator !== 'undefined' && navigator.language?.startsWith('de');
  
  if (!fw) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Framework nicht gefunden</h1>
          <p className="text-gray-400 mb-8">Dieses Framework wird noch nicht unterstützt.</p>
          <Link href="/">
            <Button className="bg-[#00f0ff] hover:bg-[#00c4cc] text-black">
              Zurück zur Startseite
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const title = isGerman 
    ? `${fw.name} deployen | Zip-Ship` 
    : `Deploy ${fw.name} | Zip-Ship`;
  const description = isGerman ? fw.descriptionDE : fw.descriptionEN;
  const tag = isGerman ? fw.tagDE : fw.tagEN;
  
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://zip-ship-revolution.com/deploy/${framework}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <link rel="canonical" href={`https://zip-ship-revolution.com/deploy/${framework}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": `Zip-Ship ${fw.name} Deployment`,
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "Web",
            "description": description,
            "url": `https://zip-ship-revolution.com/deploy/${framework}`,
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR",
              "description": "Free tier available"
            },
            "provider": {
              "@type": "Organization",
              "name": "Zip-Ship",
              "url": "https://zip-ship-revolution.com"
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-[#0a0f1c] text-white">
        <header className="border-b border-gray-800">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Rocket className="w-6 h-6 text-[#00f0ff]" />
              <span className="font-bold text-xl">ZIP-SHIP</span>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff]/10">
                Dashboard
              </Button>
            </Link>
          </div>
        </header>
        
        <main className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <span className="text-6xl mb-6 block">{fw.icon}</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span style={{ color: fw.color }}>{fw.name}</span>
              <span className="text-white"> → GitHub</span>
            </h1>
            <p className="text-2xl text-gray-300 mb-4">{tag}</p>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">{description}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {fw.features.map((feature, i) => (
              <div 
                key={i}
                className="bg-[#0d1424] border border-gray-800 rounded-lg p-6 text-center hover:border-[#00f0ff]/50 transition-colors"
              >
                <Zap className="w-8 h-8 text-[#00f0ff] mx-auto mb-3" />
                <span className="text-white font-medium">{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-[#0d1424] to-[#0a0f1c] border border-gray-800 rounded-2xl p-8 md:p-12 mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">
              {isGerman ? "So funktioniert's" : "How It Works"}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#00f0ff]/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[#00f0ff]">1</span>
                </div>
                <h3 className="font-semibold mb-2">{isGerman ? "ZIP hochladen" : "Upload ZIP"}</h3>
                <p className="text-gray-400 text-sm">
                  {isGerman 
                    ? `Ziehe dein ${fw.name} Projekt als ZIP in die Upload-Zone`
                    : `Drag your ${fw.name} project as ZIP into the upload zone`}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#00f0ff]/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[#00f0ff]">2</span>
                </div>
                <h3 className="font-semibold mb-2">{isGerman ? "KI analysiert" : "AI Analyzes"}</h3>
                <p className="text-gray-400 text-sm">
                  {isGerman 
                    ? "Unsere KI erkennt Fehler und behebt sie automatisch"
                    : "Our AI detects errors and fixes them automatically"}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#00f0ff]/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[#00f0ff]">3</span>
                </div>
                <h3 className="font-semibold mb-2">GitHub Repo</h3>
                <p className="text-gray-400 text-sm">
                  {isGerman 
                    ? "Dein Code ist live auf GitHub - fertig!"
                    : "Your code is live on GitHub - done!"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/dashboard">
              <Button 
                size="lg" 
                className="bg-[#00f0ff] hover:bg-[#00c4cc] text-black font-bold text-lg px-8 py-6 h-auto shadow-[0_0_30px_rgba(0,240,255,0.4)]"
                data-testid="button-deploy-now"
              >
                {isGerman ? `${fw.name} Projekt deployen` : `Deploy ${fw.name} Project`}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <p className="text-gray-500 mt-4 text-sm">
              {isGerman ? "Kostenlos starten • Keine Kreditkarte" : "Start for free • No credit card"}
            </p>
          </div>
          
          <section className="mt-24 grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <GitBranch className="w-6 h-6 text-[#00f0ff] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">{isGerman ? "Git-Integration" : "Git Integration"}</h3>
                <p className="text-gray-400 text-sm">
                  {isGerman 
                    ? "Vollständige Git-Historie, Branches und Commits"
                    : "Full Git history, branches and commits"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Zap className="w-6 h-6 text-[#00f0ff] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">{isGerman ? "Blitzschnell" : "Lightning Fast"}</h3>
                <p className="text-gray-400 text-sm">
                  {isGerman 
                    ? "Upload in ~10 Sekunden, nicht Minuten"
                    : "Upload in ~10 seconds, not minutes"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-[#00f0ff] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">{isGerman ? "Sicher" : "Secure"}</h3>
                <p className="text-gray-400 text-sm">
                  {isGerman 
                    ? "OAuth-basiert, kein Token-Speichern"
                    : "OAuth-based, no token storage"}
                </p>
              </div>
            </div>
          </section>
        </main>
        
        <footer className="border-t border-gray-800 py-8 mt-16">
          <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <Link href="/impressum" className="hover:text-white">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-white">Datenschutz</Link>
            <Link href="/agb" className="hover:text-white">AGB</Link>
            <Link href="/faq" className="hover:text-white">FAQ</Link>
          </div>
        </footer>
      </div>
    </>
  );
}
