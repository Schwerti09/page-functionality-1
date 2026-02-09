import { Zap, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

const companyInfo = {
  name: "ZIP-SHIP",
  owner: "Rolf Schwertfechter",
  address: "Karklandsweg 1",
  city: "26553 Dornum",
  email: "support@zip-ship.com",
  taxNote: "Steuerangaben auf Anfrage"
};

export function Impressum() {
  return (
    <LegalLayout title="Impressum">
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Angaben gemäß § 5 TMG</h2>
          <p className="text-slate-300">{companyInfo.name}</p>
          <p className="text-slate-300">{companyInfo.owner}</p>
          <p className="text-slate-300">{companyInfo.address}</p>
          <p className="text-slate-300">{companyInfo.city}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">Kontakt</h2>
          <p className="text-slate-300">E-Mail: <a href={`mailto:${companyInfo.email}`} className="text-[#00F0FF] hover:underline" style={{textShadow: '0 0 5px rgba(0,240,255,0.3)'}}>{companyInfo.email}</a></p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">Umsatzsteuer-ID</h2>
          <p className="text-slate-300">{companyInfo.taxNote}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p className="text-slate-300">{companyInfo.owner}</p>
          <p className="text-slate-300">{companyInfo.address}</p>
          <p className="text-slate-300">{companyInfo.city}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">Haftungsausschluss</h2>
          <h3 className="text-lg font-semibold text-white mb-2">Haftung für Inhalte</h3>
          <p className="text-slate-400 leading-relaxed mb-4">
            Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
          </p>
          <h3 className="text-lg font-semibold text-white mb-2">Haftung für Links</h3>
          <p className="text-slate-400 leading-relaxed">
            Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}

export function Datenschutz() {
  return (
    <LegalLayout title="Datenschutzerklärung">
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-bold text-white mb-4">1. Datenschutz auf einen Blick</h2>
          <h3 className="text-lg font-semibold text-white mb-2">Allgemeine Hinweise</h3>
          <p className="text-slate-400 leading-relaxed">
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">2. Verantwortliche Stelle</h2>
          <p className="text-slate-300">{companyInfo.name}</p>
          <p className="text-slate-300">{companyInfo.owner}</p>
          <p className="text-slate-300">{companyInfo.address}</p>
          <p className="text-slate-300">{companyInfo.city}</p>
          <p className="text-slate-300 mt-2">E-Mail: <a href={`mailto:${companyInfo.email}`} className="text-[#00F0FF] hover:underline" style={{textShadow: '0 0 5px rgba(0,240,255,0.3)'}}>{companyInfo.email}</a></p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">3. Datenerfassung auf dieser Website</h2>
          <h3 className="text-lg font-semibold text-white mb-2">Cookies</h3>
          <p className="text-slate-400 leading-relaxed mb-4">
            Unsere Website verwendet Cookies. Das sind kleine Textdateien, die Ihr Webbrowser auf Ihrem Endgerät speichert. Cookies helfen uns dabei, unser Angebot nutzerfreundlicher und sicherer zu machen.
          </p>
          <h3 className="text-lg font-semibold text-white mb-2">Server-Log-Dateien</h3>
          <p className="text-slate-400 leading-relaxed">
            Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">4. Zahlungsabwicklung</h2>
          <p className="text-slate-400 leading-relaxed">
            Für die Zahlungsabwicklung nutzen wir den Dienst Stripe. Ihre Zahlungsdaten werden direkt an Stripe übermittelt und von uns nicht gespeichert. Stripe ist ein Dienst der Stripe, Inc., 510 Townsend Street, San Francisco, CA 94103, USA.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">5. Ihre Rechte</h2>
          <p className="text-slate-400 leading-relaxed">
            Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung oder Löschung dieser Daten.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}

export function AGB() {
  return (
    <LegalLayout title="Allgemeine Geschäftsbedingungen">
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-bold text-white mb-4">§ 1 Geltungsbereich</h2>
          <p className="text-slate-400 leading-relaxed">
            Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen {companyInfo.name}, {companyInfo.owner}, {companyInfo.address}, {companyInfo.city} (nachfolgend "Anbieter") und dem Kunden über die Nutzung des ZIP-SHIP Deployment-Dienstes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">§ 2 Vertragsgegenstand</h2>
          <p className="text-slate-400 leading-relaxed">
            Gegenstand des Vertrages ist die Bereitstellung eines Cloud-Deployment-Dienstes, der es dem Kunden ermöglicht, Webanwendungen durch Upload von ZIP-Archiven automatisch zu deployen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">§ 3 Preise und Zahlungsbedingungen</h2>
          <p className="text-slate-400 leading-relaxed mb-4">
            Die aktuellen Abo-Preise sind auf der Website einsehbar:
          </p>
          <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
            <li>Starter: 0€/Monat – 1 Projekt, Basic GitHub Integration (kostenlos)</li>
            <li>Pro: 19€/Monat – 5 Projekte, Unlimited Deploys, KI-Auto-Fix (7-Tage-Testphase)</li>
            <li>Agency: 49€/Monat – Unbegrenzte Projekte, Team Features, Priority Support (Fair Use)</li>
          </ul>
          <p className="text-slate-400 leading-relaxed mt-4">
            Die Zahlung erfolgt über den Zahlungsdienstleister Stripe. Abonnements verlängern sich automatisch monatlich und können jederzeit gekündigt werden.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">§ 3a Fair Use Policy</h2>
          <p className="text-slate-400 leading-relaxed mb-4">
            Für den Agency-Tarif ("Unbegrenzte Projekte") gilt folgende Fair Use Policy:
          </p>
          <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
            <li>Maximal 100 Deployments pro Monat</li>
            <li>Maximale Dateigröße pro ZIP: 50 MB</li>
            <li>Maximal 500 Dateien pro Repository</li>
          </ul>
          <p className="text-slate-400 leading-relaxed mt-4">
            Bei Überschreitung dieser Limits behält sich der Anbieter vor, den Account zu drosseln oder zusätzliche Gebühren zu erheben. Bei extremer Übernutzung kann der Anbieter den Vertrag fristlos kündigen.
          </p>
          <p className="text-slate-400 leading-relaxed mt-2">
            Diese Limits dienen dem Schutz der Infrastruktur und gewährleisten einen fairen Service für alle Nutzer. Bei berechtigtem Mehrbedarf kontaktieren Sie uns für ein individuelles Angebot.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">§ 4 Widerrufsrecht</h2>
          <p className="text-slate-400 leading-relaxed">
            Sie haben das Recht, binnen 30 Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen (Geld-zurück-Garantie). Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung (z.B. E-Mail an {companyInfo.email}) über Ihren Entschluss informieren.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">§ 5 Haftungsbeschränkung</h2>
          <p className="text-slate-400 leading-relaxed">
            Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit. Bei leichter Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten und begrenzt auf den vorhersehbaren, vertragstypischen Schaden.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">§ 6 Schlussbestimmungen</h2>
          <p className="text-slate-400 leading-relaxed">
            Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist, soweit gesetzlich zulässig, der Sitz des Anbieters.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}

function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  const [, navigate] = useLocation();
  
  return (
    <div className="min-h-screen bg-[#0A0E27] text-slate-200 font-sans">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0E27]/95 backdrop-blur-xl border-b border-[#00F0FF]/20 py-4">
        <div className="max-w-4xl mx-auto px-6 flex items-center gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-slate-400 hover:text-[#00F0FF] transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
            Zurück
          </button>
          <a href="/" className="flex items-center gap-2 font-black text-xl tracking-tighter text-white ml-auto group" data-testid="link-logo-legal">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00F0FF] to-[#00C853] rounded-lg flex items-center justify-center text-[#0A0E27] shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <span style={{textShadow: '0 0 10px rgba(0,240,255,0.3)'}}>ZIP<span className="text-[#00F0FF]">SHIP</span></span>
          </a>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-12" style={{textShadow: '0 0 30px rgba(0,240,255,0.2)'}} data-testid="text-legal-title">{title}</h1>
          {children}
        </div>
      </main>

      <footer className="py-8 border-t border-[#00F0FF]/20">
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap gap-6 justify-center text-sm text-slate-500 font-mono">
          <a href="/impressum" className="hover:text-[#00F0FF] transition-colors" style={{textShadow: '0 0 0 transparent'}} data-testid="link-impressum">IMPRESSUM</a>
          <a href="/datenschutz" className="hover:text-[#00F0FF] transition-colors" data-testid="link-datenschutz">DATENSCHUTZ</a>
          <a href="/agb" className="hover:text-[#00F0FF] transition-colors" data-testid="link-agb">AGB</a>
        </div>
      </footer>
    </div>
  );
}

export default { Impressum, Datenschutz, AGB };
