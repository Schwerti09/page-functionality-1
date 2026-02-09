import { useState } from 'react';
import { Link } from 'wouter';
import { ChevronDown, ChevronUp, Zap, ArrowLeft, MessageCircle, Mail } from 'lucide-react';

const translations = {
  en: {
    title: "Frequently Asked Questions",
    subtitle: "Everything you need to know about ZIP-SHIP",
    backHome: "Back to Home",
    contact: {
      title: "Still have questions?",
      subtitle: "Our team is here to help",
      email: "support@zip-ship.com",
      cta: "Contact Support"
    },
    categories: [
      {
        name: "Getting Started",
        faqs: [
          {
            question: "What is ZIP-SHIP?",
            answer: "ZIP-SHIP is a zero-config deployment platform that transforms ZIP files into GitHub repositories in seconds. Simply drag and drop your project ZIP file, connect your GitHub account, and we automatically create a repository with all your files pushed to it. No git commands, no terminal, no configuration required."
          },
          {
            question: "How long does it take to deploy?",
            answer: "The entire process takes approximately 5-30 seconds depending on your file size. We've optimized our pipeline to handle ZIP upload, file extraction, GitHub authentication, repository creation, and file pushing in one seamless flow."
          },
          {
            question: "Do I need to know git to use ZIP-SHIP?",
            answer: "No! That's the beauty of ZIP-SHIP. We handle all git operations automatically. You just upload your ZIP file and we do the rest. It's perfect for designers, no-code builders, students, or anyone who wants to quickly get their code on GitHub without learning command-line tools."
          },
          {
            question: "What file types are supported?",
            answer: "We support standard .zip archives up to 100MB. Inside your ZIP, you can have any type of files - HTML, CSS, JavaScript, Python, React, Vue, Node.js projects, and more. We automatically filter out unnecessary files like node_modules, .git folders, and system files."
          }
        ]
      },
      {
        name: "GitHub Integration",
        faqs: [
          {
            question: "How does the GitHub connection work?",
            answer: "We use OAuth 2.0 for secure authentication with GitHub. When you click 'Connect GitHub', you'll be redirected to GitHub to authorize ZIP-SHIP. We only request the minimum permissions needed: access to create repositories and push files. Your credentials are never stored on our servers."
          },
          {
            question: "Can I create private repositories?",
            answer: "Yes! When deploying, you can choose whether your repository should be public or private. Private repositories are perfect for proprietary projects, client work, or code you're not ready to share publicly."
          },
          {
            question: "What happens to my existing GitHub repositories?",
            answer: "ZIP-SHIP only creates new repositories. We never modify, delete, or access your existing repositories. Each deployment creates a brand new repository with the name you specify."
          },
          {
            question: "Can I disconnect my GitHub account?",
            answer: "Yes, you can disconnect your GitHub account at any time from your dashboard. You can also revoke access directly from GitHub's settings under 'Applications'. We recommend revoking access if you no longer use ZIP-SHIP."
          }
        ]
      },
      {
        name: "Security & Privacy",
        faqs: [
          {
            question: "Is my code secure with ZIP-SHIP?",
            answer: "Absolutely. We use AES-256 encryption for all data in transit and at rest. Your ZIP files are processed in isolated containers and deleted immediately after the repository is created. We never store your source code permanently on our servers."
          },
          {
            question: "What data do you collect?",
            answer: "We collect minimal data: your email for account management, GitHub profile information (username, avatar) for integration, and basic usage statistics (deployment counts, success rates). We do NOT access or store the contents of your files beyond the deployment process."
          },
          {
            question: "Are you GDPR compliant?",
            answer: "Yes, ZIP-SHIP is fully GDPR compliant. We're based in Germany and adhere to strict European data protection regulations. You can request data export or deletion at any time. See our Datenschutz (Privacy Policy) for complete details."
          },
          {
            question: "What files are automatically filtered?",
            answer: "For security and efficiency, we automatically exclude: node_modules/, .git/, __MACOSX/, .DS_Store, Thumbs.db, .env files (to protect your secrets), and *.log files. This keeps your repositories clean and prevents accidental secret exposure."
          }
        ]
      },
      {
        name: "Pricing & Plans",
        faqs: [
          {
            question: "How much does ZIP-SHIP cost?",
            answer: "We offer a pay-per-deploy model: Single Deploy (2.99€) for 1 deployment, Deploy Pack (9.99€) for 10 deployments (best value!), and Enterprise (29.99€/month) for unlimited deployments. New users receive 3 free welcome credits to try the service."
          },
          {
            question: "Is there a free trial?",
            answer: "Yes! Every new user receives 3 free deployment credits upon registration. This lets you experience the full ZIP-SHIP workflow without any payment. No credit card required to get started."
          },
          {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards (Visa, Mastercard, American Express) through our secure Stripe payment integration. All transactions are processed securely with industry-standard encryption."
          },
          {
            question: "Can I get a refund?",
            answer: "Due to the instant nature of our service, we cannot offer refunds for used deployments. However, if you experience technical issues that prevent successful deployment, please contact our support team and we'll work to resolve it or provide credits."
          }
        ]
      },
      {
        name: "AI Auto-Fix Feature",
        faqs: [
          {
            question: "What is AI Auto-Fix?",
            answer: "AI Auto-Fix is our intelligent feature that automatically detects and repairs common project issues before deployment. It can fix version mismatches, corrupted configuration files, missing dependencies, and more - all automatically."
          },
          {
            question: "What issues can AI Auto-Fix resolve?",
            answer: "Our AI can fix: package version conflicts (e.g., @next/swc vs next version mismatches), corrupted or missing favicon.ico files, malformed configuration files (next.config.js, tsconfig.json), missing .gitignore entries, and outdated dependency specifications."
          },
          {
            question: "Is AI Auto-Fix enabled by default?",
            answer: "AI Auto-Fix is optional and can be toggled on/off in your dashboard before each deployment. When enabled, the AI analyzes your project and suggests fixes. You maintain full control over whether fixes are applied."
          },
          {
            question: "Does AI Auto-Fix cost extra?",
            answer: "No! AI Auto-Fix is included in all deployment credits at no additional cost. It's our way of ensuring your deployments succeed on the first try."
          }
        ]
      },
      {
        name: "Technical",
        faqs: [
          {
            question: "What's the maximum file size?",
            answer: "ZIP files can be up to 100MB. For larger projects, we recommend excluding large binary files, media assets, and dependencies that can be reinstalled. Our automatic filtering helps by removing node_modules and other bulky folders."
          },
          {
            question: "Which frameworks do you support?",
            answer: "ZIP-SHIP is framework-agnostic! We support any project that can be stored in a ZIP file: React, Vue, Angular, Svelte, Next.js, Nuxt, static HTML/CSS, Python projects, Node.js applications, and more. We even detect your framework automatically for optimized handling."
          },
          {
            question: "Do you support monorepos?",
            answer: "Yes, you can upload monorepo structures. The entire ZIP content is pushed to the repository maintaining your folder structure. For very large monorepos exceeding 100MB, consider deploying packages separately."
          },
          {
            question: "What happens if deployment fails?",
            answer: "If a deployment fails, you receive a clear error message explaining what went wrong. Common issues include network timeouts, GitHub API limits, or invalid file structures. Your deployment credit is only consumed on successful deployments."
          }
        ]
      }
    ]
  },
  de: {
    title: "Häufig gestellte Fragen",
    subtitle: "Alles was du über ZIP-SHIP wissen musst",
    backHome: "Zurück zur Startseite",
    contact: {
      title: "Noch Fragen?",
      subtitle: "Unser Team hilft dir gerne weiter",
      email: "support@zip-ship.com",
      cta: "Support kontaktieren"
    },
    categories: [
      {
        name: "Erste Schritte",
        faqs: [
          {
            question: "Was ist ZIP-SHIP?",
            answer: "ZIP-SHIP ist eine Zero-Config Deployment-Plattform, die ZIP-Dateien in Sekunden in GitHub-Repositories verwandelt. Ziehe einfach deine Projekt-ZIP-Datei per Drag & Drop, verbinde dein GitHub-Konto und wir erstellen automatisch ein Repository mit allen deinen Dateien. Keine Git-Befehle, kein Terminal, keine Konfiguration erforderlich."
          },
          {
            question: "Wie lange dauert ein Deployment?",
            answer: "Der gesamte Prozess dauert etwa 5-30 Sekunden, abhängig von der Dateigröße. Wir haben unsere Pipeline optimiert, um ZIP-Upload, Dateiextraktion, GitHub-Authentifizierung, Repository-Erstellung und Datei-Push in einem nahtlosen Ablauf zu bewältigen."
          },
          {
            question: "Muss ich Git kennen, um ZIP-SHIP zu nutzen?",
            answer: "Nein! Das ist das Schöne an ZIP-SHIP. Wir erledigen alle Git-Operationen automatisch. Du lädst einfach deine ZIP-Datei hoch und wir machen den Rest. Perfekt für Designer, No-Code-Builder, Studenten oder jeden, der seinen Code schnell auf GitHub bringen möchte, ohne Kommandozeilen-Tools zu lernen."
          },
          {
            question: "Welche Dateitypen werden unterstützt?",
            answer: "Wir unterstützen Standard-.zip-Archive bis zu 100MB. In deinem ZIP können beliebige Dateitypen sein - HTML, CSS, JavaScript, Python, React, Vue, Node.js-Projekte und mehr. Wir filtern automatisch unnötige Dateien wie node_modules, .git-Ordner und Systemdateien heraus."
          }
        ]
      },
      {
        name: "GitHub-Integration",
        faqs: [
          {
            question: "Wie funktioniert die GitHub-Verbindung?",
            answer: "Wir verwenden OAuth 2.0 für sichere Authentifizierung mit GitHub. Wenn du auf 'GitHub verbinden' klickst, wirst du zu GitHub weitergeleitet, um ZIP-SHIP zu autorisieren. Wir fordern nur die minimal notwendigen Berechtigungen an: Zugriff zum Erstellen von Repositories und Hochladen von Dateien. Deine Anmeldedaten werden niemals auf unseren Servern gespeichert."
          },
          {
            question: "Kann ich private Repositories erstellen?",
            answer: "Ja! Beim Deployment kannst du wählen, ob dein Repository öffentlich oder privat sein soll. Private Repositories sind perfekt für proprietäre Projekte, Kundenarbeit oder Code, den du noch nicht teilen möchtest."
          },
          {
            question: "Was passiert mit meinen bestehenden GitHub-Repositories?",
            answer: "ZIP-SHIP erstellt nur neue Repositories. Wir ändern, löschen oder greifen niemals auf deine bestehenden Repositories zu. Jedes Deployment erstellt ein brandneues Repository mit dem von dir angegebenen Namen."
          },
          {
            question: "Kann ich mein GitHub-Konto trennen?",
            answer: "Ja, du kannst dein GitHub-Konto jederzeit über dein Dashboard trennen. Du kannst den Zugriff auch direkt in den GitHub-Einstellungen unter 'Anwendungen' widerrufen. Wir empfehlen, den Zugriff zu widerrufen, wenn du ZIP-SHIP nicht mehr verwendest."
          }
        ]
      },
      {
        name: "Sicherheit & Datenschutz",
        faqs: [
          {
            question: "Ist mein Code bei ZIP-SHIP sicher?",
            answer: "Absolut. Wir verwenden AES-256-Verschlüsselung für alle Daten während der Übertragung und im Ruhezustand. Deine ZIP-Dateien werden in isolierten Containern verarbeitet und sofort nach der Repository-Erstellung gelöscht. Wir speichern deinen Quellcode niemals dauerhaft auf unseren Servern."
          },
          {
            question: "Welche Daten sammelt ihr?",
            answer: "Wir sammeln minimale Daten: deine E-Mail für die Kontoverwaltung, GitHub-Profilinformationen (Benutzername, Avatar) für die Integration und grundlegende Nutzungsstatistiken (Deployment-Anzahl, Erfolgsraten). Wir greifen NICHT auf den Inhalt deiner Dateien zu und speichern ihn nicht über den Deployment-Prozess hinaus."
          },
          {
            question: "Seid ihr DSGVO-konform?",
            answer: "Ja, ZIP-SHIP ist vollständig DSGVO-konform. Wir haben unseren Sitz in Deutschland und halten strenge europäische Datenschutzvorschriften ein. Du kannst jederzeit einen Datenexport oder eine Löschung anfordern. Siehe unsere Datenschutzerklärung für vollständige Details."
          },
          {
            question: "Welche Dateien werden automatisch gefiltert?",
            answer: "Aus Sicherheits- und Effizienzgründen schließen wir automatisch aus: node_modules/, .git/, __MACOSX/, .DS_Store, Thumbs.db, .env-Dateien (um deine Geheimnisse zu schützen) und *.log-Dateien. So bleiben deine Repositories sauber und versehentliche Geheimnisoffenlegung wird verhindert."
          }
        ]
      },
      {
        name: "Preise & Tarife",
        faqs: [
          {
            question: "Wie viel kostet ZIP-SHIP?",
            answer: "Wir bieten ein Pay-per-Deploy-Modell: Single Deploy (2,99€) für 1 Deployment, Deploy Pack (9,99€) für 10 Deployments (bestes Preis-Leistungs-Verhältnis!) und Enterprise (29,99€/Monat) für unbegrenzte Deployments. Neue Nutzer erhalten 3 kostenlose Willkommensguthaben zum Ausprobieren."
          },
          {
            question: "Gibt es eine kostenlose Testversion?",
            answer: "Ja! Jeder neue Nutzer erhält bei der Registrierung 3 kostenlose Deployment-Guthaben. So kannst du den kompletten ZIP-SHIP-Workflow ohne Bezahlung erleben. Keine Kreditkarte erforderlich, um loszulegen."
          },
          {
            question: "Welche Zahlungsmethoden akzeptiert ihr?",
            answer: "Wir akzeptieren alle gängigen Kreditkarten (Visa, Mastercard, American Express) über unsere sichere Stripe-Zahlungsintegration. Alle Transaktionen werden sicher mit Industriestandard-Verschlüsselung verarbeitet."
          },
          {
            question: "Kann ich eine Rückerstattung erhalten?",
            answer: "Aufgrund der sofortigen Natur unseres Dienstes können wir keine Rückerstattungen für genutzte Deployments anbieten. Wenn du jedoch technische Probleme hast, die ein erfolgreiches Deployment verhindern, kontaktiere bitte unser Support-Team und wir werden das Problem lösen oder Guthaben bereitstellen."
          }
        ]
      },
      {
        name: "KI-Auto-Fix Funktion",
        faqs: [
          {
            question: "Was ist KI-Auto-Fix?",
            answer: "KI-Auto-Fix ist unsere intelligente Funktion, die automatisch häufige Projektprobleme vor dem Deployment erkennt und repariert. Sie kann Versionskonflikte, beschädigte Konfigurationsdateien, fehlende Abhängigkeiten und mehr beheben - alles automatisch."
          },
          {
            question: "Welche Probleme kann KI-Auto-Fix lösen?",
            answer: "Unsere KI kann beheben: Paket-Versionskonflikte (z.B. @next/swc vs next Versions-Unterschiede), beschädigte oder fehlende favicon.ico-Dateien, fehlerhafte Konfigurationsdateien (next.config.js, tsconfig.json), fehlende .gitignore-Einträge und veraltete Abhängigkeitsspezifikationen."
          },
          {
            question: "Ist KI-Auto-Fix standardmäßig aktiviert?",
            answer: "KI-Auto-Fix ist optional und kann vor jedem Deployment in deinem Dashboard ein-/ausgeschaltet werden. Wenn aktiviert, analysiert die KI dein Projekt und schlägt Fixes vor. Du behältst die volle Kontrolle darüber, ob Fixes angewendet werden."
          },
          {
            question: "Kostet KI-Auto-Fix extra?",
            answer: "Nein! KI-Auto-Fix ist in allen Deployment-Guthaben ohne zusätzliche Kosten enthalten. Es ist unsere Art sicherzustellen, dass deine Deployments beim ersten Versuch gelingen."
          }
        ]
      },
      {
        name: "Technisches",
        faqs: [
          {
            question: "Was ist die maximale Dateigröße?",
            answer: "ZIP-Dateien können bis zu 100MB groß sein. Für größere Projekte empfehlen wir, große Binärdateien, Medien-Assets und Abhängigkeiten auszuschließen, die neu installiert werden können. Unsere automatische Filterung hilft, indem sie node_modules und andere große Ordner entfernt."
          },
          {
            question: "Welche Frameworks werden unterstützt?",
            answer: "ZIP-SHIP ist Framework-agnostisch! Wir unterstützen jedes Projekt, das in einer ZIP-Datei gespeichert werden kann: React, Vue, Angular, Svelte, Next.js, Nuxt, statisches HTML/CSS, Python-Projekte, Node.js-Anwendungen und mehr. Wir erkennen dein Framework sogar automatisch für optimierte Verarbeitung."
          },
          {
            question: "Unterstützt ihr Monorepos?",
            answer: "Ja, du kannst Monorepo-Strukturen hochladen. Der gesamte ZIP-Inhalt wird unter Beibehaltung deiner Ordnerstruktur ins Repository gepusht. Für sehr große Monorepos über 100MB empfehlen wir, Pakete separat zu deployen."
          },
          {
            question: "Was passiert, wenn das Deployment fehlschlägt?",
            answer: "Wenn ein Deployment fehlschlägt, erhältst du eine klare Fehlermeldung, die erklärt, was schiefgelaufen ist. Häufige Probleme sind Netzwerk-Timeouts, GitHub-API-Limits oder ungültige Dateistrukturen. Dein Deployment-Guthaben wird nur bei erfolgreichen Deployments verbraucht."
          }
        ]
      }
    ]
  }
};

function FAQItem({ question, answer, isOpen, onToggle }: { 
  question: string; 
  answer: string; 
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div 
      className="border border-[#1a2744] rounded-lg overflow-hidden transition-all duration-300 hover:border-[#00f0ff]/30"
      style={{
        background: isOpen ? 'rgba(0, 240, 255, 0.03)' : 'rgba(10, 15, 28, 0.5)'
      }}
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors"
        data-testid={`faq-toggle-${question.slice(0, 20).replace(/\s/g, '-').toLowerCase()}`}
      >
        <span className="text-white font-medium pr-4">{question}</span>
        <span className="flex-shrink-0 text-[#00f0ff]">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-6 pb-5 text-gray-400 leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const t = translations[lang];

  const toggleItem = (categoryIndex: number, faqIndex: number) => {
    const key = `${categoryIndex}-${faqIndex}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": t.categories.flatMap(category => 
      category.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    )
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
              {t.backHome}
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] text-sm mb-6">
              <MessageCircle size={16} />
              FAQ
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{
              textShadow: '0 0 30px rgba(0, 240, 255, 0.3)'
            }}>
              {t.title}
            </h1>
            <p className="text-xl text-gray-400">{t.subtitle}</p>
          </div>

          <div className="space-y-12">
            {t.categories.map((category, categoryIndex) => (
              <section key={categoryIndex}>
                <h2 className="text-xl font-semibold text-[#00f0ff] mb-4 flex items-center gap-2">
                  <span className="w-8 h-0.5 bg-gradient-to-r from-[#00f0ff] to-transparent"></span>
                  {category.name}
                </h2>
                <div className="space-y-3">
                  {category.faqs.map((faq, faqIndex) => (
                    <FAQItem
                      key={faqIndex}
                      question={faq.question}
                      answer={faq.answer}
                      isOpen={openItems[`${categoryIndex}-${faqIndex}`] || false}
                      onToggle={() => toggleItem(categoryIndex, faqIndex)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-20 text-center p-8 rounded-2xl border border-[#1a2744] bg-gradient-to-br from-[#0a0f1c] to-[#0f1629]"
            style={{
              boxShadow: '0 0 40px rgba(0, 240, 255, 0.05)'
            }}
          >
            <h3 className="text-2xl font-bold mb-2">{t.contact.title}</h3>
            <p className="text-gray-400 mb-6">{t.contact.subtitle}</p>
            <a 
              href={`mailto:${t.contact.email}`}
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#00f0ff] to-[#00c853] text-[#0a0f1c] font-semibold rounded-lg transition-all duration-300 hover:scale-105"
              style={{
                boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)'
              }}
              data-testid="link-contact-support"
            >
              <Mail size={18} />
              {t.contact.cta}
            </a>
          </div>
        </div>
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
