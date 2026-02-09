import { useState } from 'react';
import { Link } from 'wouter';
import { 
  Zap, ArrowLeft, Users, MapPin, Mail, Globe, 
  Rocket, Shield, Heart, Target, Code, Lightbulb
} from 'lucide-react';
import { SiGithub, SiLinkedin } from 'react-icons/si';

const translations = {
  en: {
    nav: {
      backHome: "Back to Home"
    },
    hero: {
      badge: "ABOUT US",
      title: "The Team Behind ZIP-SHIP",
      subtitle: "We're on a mission to eliminate deployment friction and make code sharing instant."
    },
    founder: {
      title: "Founder & Developer",
      name: "Rolf Schwertfechter",
      role: "CEO & Lead Developer",
      bio: "With over 15 years of experience in software development, Rolf founded ZIP-SHIP to solve a problem he faced daily: the unnecessary complexity of getting code from local machine to GitHub. His vision is simple - deployment should take seconds, not hours.",
      location: "Dornum, Germany",
      philosophy: "\"Every developer deserves tools that just work. No configuration, no complexity, no bullshit.\""
    },
    mission: {
      title: "Our Mission",
      subtitle: "Eliminating deployment friction, one ZIP at a time",
      points: [
        {
          icon: "rocket",
          title: "Speed First",
          desc: "We believe deployment should be measured in seconds, not minutes. Every optimization we make is focused on getting your code live faster."
        },
        {
          icon: "shield",
          title: "Security Always",
          desc: "Your code is your intellectual property. We use enterprise-grade encryption and never store your source code beyond the deployment process."
        },
        {
          icon: "heart",
          title: "Developer Experience",
          desc: "We're developers building for developers. Every feature is designed to eliminate friction and bring joy to the deployment process."
        },
        {
          icon: "target",
          title: "Zero Config",
          desc: "Configuration is a bug, not a feature. ZIP-SHIP automatically detects frameworks, filters unnecessary files, and optimizes your deployment."
        }
      ]
    },
    story: {
      title: "Our Story",
      paragraphs: [
        "ZIP-SHIP was born from frustration. After years of watching developers struggle with git commands, YAML configurations, and CI/CD pipelines, Rolf asked a simple question: Why does uploading code to GitHub have to be so complicated?",
        "The answer was clear: it doesn't. In 2025, ZIP-SHIP launched with a radical premise - what if you could drag and drop a ZIP file and get a GitHub repository in seconds? No terminal, no commands, no configuration.",
        "Today, ZIP-SHIP serves developers worldwide who value their time. From students deploying their first projects to agencies managing client work, our platform proves that simplicity and power aren't mutually exclusive.",
        "We're just getting started. Our roadmap includes AI-powered optimization, team collaboration features, and integrations that will continue to eliminate every unnecessary step between your code and the world."
      ]
    },
    values: {
      title: "Our Values",
      items: [
        { icon: "code", title: "Open & Honest", desc: "Transparent pricing, no hidden fees, no dark patterns. What you see is what you get." },
        { icon: "lightbulb", title: "Innovation", desc: "We constantly push boundaries to find simpler, faster ways to solve deployment challenges." },
        { icon: "users", title: "Community First", desc: "Every feature is built based on real feedback from developers who use ZIP-SHIP daily." }
      ]
    },
    contact: {
      title: "Get in Touch",
      subtitle: "We'd love to hear from you",
      company: "Wissens-Bank",
      address: "Karklandsweg 1, 26553 Dornum, Germany",
      email: "support@zip-ship.com",
      website: "https://zip-ship-revolution.com"
    }
  },
  de: {
    nav: {
      backHome: "Zurück zur Startseite"
    },
    hero: {
      badge: "ÜBER UNS",
      title: "Das Team hinter ZIP-SHIP",
      subtitle: "Wir sind auf der Mission, Deployment-Reibung zu eliminieren und Code-Sharing sofort zu ermöglichen."
    },
    founder: {
      title: "Gründer & Entwickler",
      name: "Rolf Schwertfechter",
      role: "CEO & Lead Developer",
      bio: "Mit über 15 Jahren Erfahrung in der Softwareentwicklung gründete Rolf ZIP-SHIP, um ein Problem zu lösen, das er täglich erlebte: die unnötige Komplexität, Code vom lokalen Rechner zu GitHub zu bringen. Seine Vision ist einfach - Deployment sollte Sekunden dauern, nicht Stunden.",
      location: "Dornum, Deutschland",
      philosophy: "\"Jeder Entwickler verdient Tools, die einfach funktionieren. Keine Konfiguration, keine Komplexität, kein Bullshit.\""
    },
    mission: {
      title: "Unsere Mission",
      subtitle: "Deployment-Reibung eliminieren, ein ZIP nach dem anderen",
      points: [
        {
          icon: "rocket",
          title: "Geschwindigkeit zuerst",
          desc: "Wir glauben, dass Deployment in Sekunden gemessen werden sollte, nicht in Minuten. Jede Optimierung, die wir vornehmen, zielt darauf ab, deinen Code schneller live zu bringen."
        },
        {
          icon: "shield",
          title: "Sicherheit immer",
          desc: "Dein Code ist dein geistiges Eigentum. Wir verwenden Enterprise-Grade-Verschlüsselung und speichern deinen Quellcode niemals über den Deployment-Prozess hinaus."
        },
        {
          icon: "heart",
          title: "Developer Experience",
          desc: "Wir sind Entwickler, die für Entwickler bauen. Jedes Feature ist darauf ausgelegt, Reibung zu eliminieren und Freude am Deployment-Prozess zu bringen."
        },
        {
          icon: "target",
          title: "Zero Config",
          desc: "Konfiguration ist ein Bug, kein Feature. ZIP-SHIP erkennt automatisch Frameworks, filtert unnötige Dateien und optimiert dein Deployment."
        }
      ]
    },
    story: {
      title: "Unsere Geschichte",
      paragraphs: [
        "ZIP-SHIP wurde aus Frustration geboren. Nach Jahren, in denen er Entwickler mit Git-Befehlen, YAML-Konfigurationen und CI/CD-Pipelines kämpfen sah, stellte Rolf eine einfache Frage: Warum muss das Hochladen von Code zu GitHub so kompliziert sein?",
        "Die Antwort war klar: Das muss es nicht. 2025 startete ZIP-SHIP mit einer radikalen Prämisse - was wäre, wenn man eine ZIP-Datei per Drag & Drop ablegen könnte und in Sekunden ein GitHub-Repository erhält? Kein Terminal, keine Befehle, keine Konfiguration.",
        "Heute bedient ZIP-SHIP Entwickler weltweit, die ihre Zeit schätzen. Von Studenten, die ihre ersten Projekte deployen, bis hin zu Agenturen, die Kundenarbeit verwalten - unsere Plattform beweist, dass Einfachheit und Leistung sich nicht gegenseitig ausschließen.",
        "Wir fangen gerade erst an. Unsere Roadmap umfasst KI-gestützte Optimierung, Team-Kollaborationsfunktionen und Integrationen, die weiterhin jeden unnötigen Schritt zwischen deinem Code und der Welt eliminieren werden."
      ]
    },
    values: {
      title: "Unsere Werte",
      items: [
        { icon: "code", title: "Offen & Ehrlich", desc: "Transparente Preise, keine versteckten Gebühren, keine Dark Patterns. Was du siehst, ist was du bekommst." },
        { icon: "lightbulb", title: "Innovation", desc: "Wir überschreiten ständig Grenzen, um einfachere, schnellere Wege zur Lösung von Deployment-Herausforderungen zu finden." },
        { icon: "users", title: "Community First", desc: "Jedes Feature wird basierend auf echtem Feedback von Entwicklern gebaut, die ZIP-SHIP täglich nutzen." }
      ]
    },
    contact: {
      title: "Kontakt",
      subtitle: "Wir freuen uns von dir zu hören",
      company: "Wissens-Bank",
      address: "Karklandsweg 1, 26553 Dornum, Deutschland",
      email: "support@zip-ship.com",
      website: "https://zip-ship-revolution.com"
    }
  }
};

const iconMap: Record<string, any> = {
  rocket: Rocket,
  shield: Shield,
  heart: Heart,
  target: Target,
  code: Code,
  lightbulb: Lightbulb,
  users: Users
};

export default function Team() {
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const t = translations[lang];

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ZIP-SHIP",
    "alternateName": "Wissens-Bank",
    "url": "https://zip-ship-revolution.com",
    "logo": "https://zip-ship-revolution.com/logo.svg",
    "description": "Zero-config deployment platform that transforms ZIP files into GitHub repositories in seconds.",
    "founder": {
      "@type": "Person",
      "name": "Rolf Schwertfechter",
      "jobTitle": "CEO & Lead Developer"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Karklandsweg 1",
      "addressLocality": "Dornum",
      "postalCode": "26553",
      "addressCountry": "DE"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "support@zip-ship.com",
      "contactType": "customer support"
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f1c]/90 backdrop-blur-md border-b border-[#1a2744]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f0ff] to-[#00c853] flex items-center justify-center">
              <Zap size={18} className="text-[#0a0f1c]" />
            </div>
            <span className="font-bold text-lg">ZIP-SHIP</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLang(lang === 'en' ? 'de' : 'en')}
              className="px-3 py-1.5 text-sm border border-[#1a2744] rounded-lg hover:border-[#00f0ff]/50 transition-colors"
              data-testid="lang-toggle"
            >
              {lang === 'en' ? '🇩🇪 DE' : '🇬🇧 EN'}
            </button>
            <Link 
              href="/" 
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#00f0ff] transition-colors"
              data-testid="link-back-home"
            >
              <ArrowLeft size={16} />
              {t.nav.backHome}
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20">
        <section className="px-6 mb-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] text-sm mb-6">
              <Users size={16} />
              {t.hero.badge}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{
              textShadow: '0 0 30px rgba(0, 240, 255, 0.3)'
            }}>
              {t.hero.title}
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">{t.hero.subtitle}</p>
          </div>
        </section>

        <section className="px-6 mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative p-8 md:p-12 rounded-2xl border border-[#1a2744] bg-gradient-to-br from-[#0f1629] to-[#0a0f1c]"
              style={{
                boxShadow: '0 0 60px rgba(0, 240, 255, 0.1)'
              }}
            >
              <div className="absolute -top-4 left-8 px-4 py-1 bg-[#0a0f1c] border border-[#00f0ff]/30 rounded-full text-[#00f0ff] text-sm">
                {t.founder.title}
              </div>
              
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#00f0ff]/20 to-[#00c853]/20 border border-[#00f0ff]/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-4xl font-bold text-[#00f0ff]">RS</span>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold mb-1">{t.founder.name}</h2>
                  <p className="text-[#00f0ff] mb-4">{t.founder.role}</p>
                  <p className="text-gray-400 mb-6 leading-relaxed">{t.founder.bio}</p>
                  
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={14} />
                      {t.founder.location}
                    </div>
                  </div>
                  
                  <blockquote className="italic text-gray-300 border-l-2 border-[#00f0ff] pl-4">
                    {t.founder.philosophy}
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 mb-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">{t.mission.title}</h2>
              <p className="text-gray-400">{t.mission.subtitle}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {t.mission.points.map((point, index) => {
                const Icon = iconMap[point.icon] || Rocket;
                return (
                  <div 
                    key={index}
                    className="p-6 rounded-xl border border-[#1a2744] bg-[#0f1629]/50 transition-all duration-300 hover:border-[#00f0ff]/30"
                    style={{
                      boxShadow: '0 0 20px rgba(0, 240, 255, 0.02)'
                    }}
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00f0ff]/10 to-[#00c853]/10 border border-[#00f0ff]/30 flex items-center justify-center mb-4">
                      <Icon size={24} className="text-[#00f0ff]" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{point.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{point.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-6 mb-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">{t.story.title}</h2>
            <div className="space-y-6">
              {t.story.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-gray-400 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 mb-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">{t.values.title}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {t.values.items.map((item, index) => {
                const Icon = iconMap[item.icon] || Code;
                return (
                  <div 
                    key={index}
                    className="p-6 rounded-xl border border-[#1a2744] bg-[#0f1629]/30 text-center transition-all duration-300 hover:border-[#00f0ff]/30"
                  >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00f0ff]/10 to-[#00c853]/10 border border-[#00f0ff]/30 flex items-center justify-center mx-auto mb-4">
                      <Icon size={24} className="text-[#00f0ff]" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-6">
          <div className="max-w-2xl mx-auto text-center p-8 rounded-2xl border border-[#1a2744] bg-gradient-to-br from-[#0a0f1c] to-[#0f1629]"
            style={{
              boxShadow: '0 0 40px rgba(0, 240, 255, 0.05)'
            }}
          >
            <h2 className="text-2xl font-bold mb-2">{t.contact.title}</h2>
            <p className="text-gray-400 mb-8">{t.contact.subtitle}</p>
            
            <div className="space-y-4 text-left max-w-md mx-auto">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-10 h-10 rounded-lg bg-[#1a2744] flex items-center justify-center">
                  <Users size={18} className="text-[#00f0ff]" />
                </div>
                <span>{t.contact.company}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-10 h-10 rounded-lg bg-[#1a2744] flex items-center justify-center">
                  <MapPin size={18} className="text-[#00f0ff]" />
                </div>
                <span>{t.contact.address}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-10 h-10 rounded-lg bg-[#1a2744] flex items-center justify-center">
                  <Mail size={18} className="text-[#00f0ff]" />
                </div>
                <a href={`mailto:${t.contact.email}`} className="hover:text-[#00f0ff] transition-colors">
                  {t.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-10 h-10 rounded-lg bg-[#1a2744] flex items-center justify-center">
                  <Globe size={18} className="text-[#00f0ff]" />
                </div>
                <a href={t.contact.website} target="_blank" rel="noopener noreferrer" className="hover:text-[#00f0ff] transition-colors">
                  {t.contact.website.replace('https://', '')}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#1a2744] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div>© 2026 ZIP-SHIP. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="/impressum" className="hover:text-[#00f0ff] transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-[#00f0ff] transition-colors">Datenschutz</Link>
            <Link href="/agb" className="hover:text-[#00f0ff] transition-colors">AGB</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
