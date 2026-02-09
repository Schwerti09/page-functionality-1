import { useState } from 'react';
import { Link } from 'wouter';
import { 
  Zap, ArrowLeft, Book, Code, Terminal, Upload, 
  GitBranch, Shield, Key, Cpu, CheckCircle, AlertTriangle,
  ChevronRight, Copy, Check
} from 'lucide-react';

const translations = {
  en: {
    nav: {
      backHome: "Back to Home"
    },
    hero: {
      badge: "DOCUMENTATION",
      title: "Technical Documentation",
      subtitle: "Everything you need to integrate and understand ZIP-SHIP"
    },
    sections: [
      {
        id: "overview",
        title: "Overview",
        icon: "book",
        content: {
          title: "What is ZIP-SHIP?",
          paragraphs: [
            "ZIP-SHIP is a zero-configuration deployment platform that creates GitHub repositories from ZIP file uploads. It eliminates the need for git commands, terminal access, or CI/CD configuration.",
            "The platform handles the entire workflow: file upload, extraction, filtering, GitHub authentication, repository creation, and file pushing - all in under 30 seconds."
          ],
          features: [
            "Drag & drop ZIP file upload",
            "Automatic file filtering (node_modules, .git, etc.)",
            "OAuth 2.0 GitHub integration",
            "AI-powered project analysis and auto-fix",
            "Real-time deployment status"
          ]
        }
      },
      {
        id: "workflow",
        title: "Deployment Workflow",
        icon: "gitbranch",
        content: {
          title: "How Deployment Works",
          steps: [
            {
              number: "1",
              title: "Upload ZIP File",
              description: "User uploads a ZIP file via drag & drop or file picker. Maximum size: 100MB.",
              details: [
                "Supported format: .zip only",
                "Client-side validation before upload",
                "Progress indicator during upload"
              ]
            },
            {
              number: "2",
              title: "File Processing",
              description: "Server extracts and filters the ZIP contents.",
              details: [
                "Automatic exclusion of node_modules/, .git/, __MACOSX/",
                "Removal of .DS_Store, Thumbs.db, .env files",
                "Framework detection (React, Vue, Next.js, etc.)"
              ]
            },
            {
              number: "3",
              title: "GitHub Authentication",
              description: "User's GitHub token is used to authenticate API calls.",
              details: [
                "OAuth 2.0 flow with minimal scope",
                "Token stored securely in database",
                "Automatic token refresh if needed"
              ]
            },
            {
              number: "4",
              title: "Repository Creation",
              description: "New repository is created in user's GitHub account.",
              details: [
                "POST /user/repos GitHub API call",
                "Repository name sanitization",
                "Public or private repository option"
              ]
            },
            {
              number: "5",
              title: "File Push",
              description: "All processed files are pushed to the new repository.",
              details: [
                "Git Trees API for batch upload",
                "Single commit with all files",
                "Returns repository URL on success"
              ]
            }
          ]
        }
      },
      {
        id: "api",
        title: "API Reference",
        icon: "code",
        content: {
          title: "REST API Endpoints",
          endpoints: [
            {
              method: "GET",
              path: "/api/auth/user",
              description: "Get current authenticated user",
              auth: "Session cookie",
              response: "User object with id, email, firstName, lastName"
            },
            {
              method: "GET",
              path: "/api/user/stats",
              description: "Get user's deployment statistics",
              auth: "Session cookie",
              response: "Object with remainingDeploys, totalDeploys, accountStatus"
            },
            {
              method: "GET",
              path: "/api/github/status",
              description: "Check GitHub connection status",
              auth: "Session cookie",
              response: "Object with connected (boolean), username, avatarUrl"
            },
            {
              method: "GET",
              path: "/api/github/auth-url",
              description: "Get GitHub OAuth authorization URL",
              auth: "Session cookie",
              response: "Object with authUrl for redirect"
            },
            {
              method: "POST",
              path: "/api/deploy-zip",
              description: "Deploy a ZIP file to GitHub",
              auth: "Session cookie",
              body: "FormData with 'zipFile' and 'repoName'",
              response: "Object with repoUrl, filesUploaded, deployTime"
            },
            {
              method: "GET",
              path: "/api/deploys",
              description: "List user's deployment history",
              auth: "Session cookie",
              response: "Array of deploy objects with id, repoName, repoUrl, createdAt"
            },
            {
              method: "POST",
              path: "/api/checkout",
              description: "Create Stripe checkout session",
              auth: "Session cookie",
              body: "JSON with planId ('single', 'pack', 'enterprise')",
              response: "Object with sessionUrl for redirect"
            }
          ]
        }
      },
      {
        id: "github",
        title: "GitHub Integration",
        icon: "gitbranch",
        content: {
          title: "GitHub OAuth Setup",
          paragraphs: [
            "ZIP-SHIP uses OAuth 2.0 for GitHub authentication. When a user connects their GitHub account, they're redirected to GitHub to authorize the application."
          ],
          permissions: [
            { scope: "repo", description: "Full control of private repositories - needed to create and push to repos" },
            { scope: "user:email", description: "Access user email addresses - for account association" }
          ],
          flow: [
            "User clicks 'Connect GitHub' button",
            "Redirect to GitHub authorization page",
            "User approves requested permissions",
            "GitHub redirects back with authorization code",
            "Server exchanges code for access token",
            "Token stored securely in database",
            "User can now deploy to GitHub"
          ]
        }
      },
      {
        id: "security",
        title: "Security",
        icon: "shield",
        content: {
          title: "Security Measures",
          measures: [
            {
              title: "Data Encryption",
              description: "All data in transit uses TLS 1.3. Sensitive data at rest uses AES-256 encryption."
            },
            {
              title: "Token Storage",
              description: "GitHub access tokens are encrypted before storage. Tokens are never exposed to the client."
            },
            {
              title: "File Processing",
              description: "ZIP files are processed in isolated containers. Files are deleted immediately after successful deployment."
            },
            {
              title: "Session Security",
              description: "Session cookies use HttpOnly, Secure, and SameSite=Strict flags. Sessions expire after 7 days of inactivity."
            },
            {
              title: "Password Hashing",
              description: "User passwords are hashed using bcrypt with a cost factor of 12."
            },
            {
              title: "Rate Limiting",
              description: "API endpoints are rate-limited to prevent abuse. Deployment: 10/hour, Auth: 5/15min."
            }
          ]
        }
      },
      {
        id: "ai-fix",
        title: "AI Auto-Fix",
        icon: "cpu",
        content: {
          title: "AI-Powered Project Fixing",
          paragraphs: [
            "ZIP-SHIP includes an optional AI Auto-Fix feature that analyzes uploaded projects and automatically repairs common issues before deployment."
          ],
          capabilities: [
            {
              issue: "Version Mismatches",
              description: "Detects and fixes incompatible package versions (e.g., @next/swc version not matching next)"
            },
            {
              issue: "Corrupted Config Files",
              description: "Repairs malformed JSON in tsconfig.json, package.json, and other configuration files"
            },
            {
              issue: "Missing Files",
              description: "Generates missing required files like .gitignore, favicon.ico"
            },
            {
              issue: "Framework Detection",
              description: "Identifies framework and applies framework-specific optimizations"
            }
          ],
          usage: [
            "Enable AI Auto-Fix toggle in dashboard before deployment",
            "AI analyzes project structure during ZIP processing",
            "Issues are detected and fixes are applied automatically",
            "Deployment log shows what was fixed"
          ]
        }
      }
    ],
    codeExamples: {
      title: "Code Examples",
      examples: [
        {
          title: "Deploy ZIP via API (cURL)",
          language: "bash",
          code: `curl -X POST https://zip-ship-revolution.com/api/deploy-zip \\
  -H "Cookie: session=YOUR_SESSION_COOKIE" \\
  -F "zipFile=@project.zip" \\
  -F "repoName=my-new-project"`
        },
        {
          title: "Check GitHub Status (JavaScript)",
          language: "javascript",
          code: `const response = await fetch('/api/github/status', {
  credentials: 'include'
});
const { connected, username } = await response.json();
console.log(connected ? \`Connected as \${username}\` : 'Not connected');`
        },
        {
          title: "Create Checkout Session (JavaScript)",
          language: "javascript",
          code: `const response = await fetch('/api/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ planId: 'pack' }) // 'single', 'pack', or 'enterprise'
});
const { sessionUrl } = await response.json();
window.location.href = sessionUrl; // Redirect to Stripe`
        }
      ]
    },
    errorCodes: {
      title: "Error Codes",
      codes: [
        { code: "AUTH_REQUIRED", description: "User must be logged in", solution: "Redirect to login page" },
        { code: "GITHUB_NOT_CONNECTED", description: "GitHub account not linked", solution: "Prompt user to connect GitHub" },
        { code: "NO_CREDITS", description: "User has no remaining deploy credits", solution: "Show pricing options" },
        { code: "FILE_TOO_LARGE", description: "ZIP file exceeds 100MB limit", solution: "Suggest removing large files" },
        { code: "INVALID_ZIP", description: "Uploaded file is not a valid ZIP", solution: "Verify file format" },
        { code: "REPO_EXISTS", description: "Repository name already exists", solution: "Choose a different name" },
        { code: "GITHUB_API_ERROR", description: "GitHub API returned an error", solution: "Check GitHub status, retry later" }
      ]
    }
  },
  de: {
    nav: {
      backHome: "Zurück zur Startseite"
    },
    hero: {
      badge: "DOKUMENTATION",
      title: "Technische Dokumentation",
      subtitle: "Alles was du brauchst um ZIP-SHIP zu verstehen und zu integrieren"
    },
    sections: [
      {
        id: "overview",
        title: "Übersicht",
        icon: "book",
        content: {
          title: "Was ist ZIP-SHIP?",
          paragraphs: [
            "ZIP-SHIP ist eine Zero-Configuration-Deployment-Plattform, die GitHub-Repositories aus ZIP-Datei-Uploads erstellt. Sie eliminiert die Notwendigkeit für Git-Befehle, Terminal-Zugang oder CI/CD-Konfiguration.",
            "Die Plattform übernimmt den gesamten Workflow: Datei-Upload, Extraktion, Filterung, GitHub-Authentifizierung, Repository-Erstellung und Datei-Push - alles in unter 30 Sekunden."
          ],
          features: [
            "Drag & Drop ZIP-Datei-Upload",
            "Automatische Dateifilterung (node_modules, .git, etc.)",
            "OAuth 2.0 GitHub-Integration",
            "KI-gestützte Projektanalyse und Auto-Fix",
            "Echtzeit-Deployment-Status"
          ]
        }
      }
    ],
    codeExamples: {
      title: "Code-Beispiele",
      examples: [
        {
          title: "ZIP via API deployen (cURL)",
          language: "bash",
          code: `curl -X POST https://zip-ship-revolution.com/api/deploy-zip \\
  -H "Cookie: session=YOUR_SESSION_COOKIE" \\
  -F "zipFile=@project.zip" \\
  -F "repoName=my-new-project"`
        }
      ]
    },
    errorCodes: {
      title: "Fehlercodes",
      codes: [
        { code: "AUTH_REQUIRED", description: "Benutzer muss eingeloggt sein", solution: "Zur Login-Seite weiterleiten" },
        { code: "GITHUB_NOT_CONNECTED", description: "GitHub-Konto nicht verknüpft", solution: "Benutzer auffordern, GitHub zu verbinden" },
        { code: "NO_CREDITS", description: "Keine Deployment-Guthaben mehr", solution: "Preisoptionen anzeigen" }
      ]
    }
  }
};

const iconMap: Record<string, any> = {
  book: Book,
  code: Code,
  terminal: Terminal,
  upload: Upload,
  gitbranch: GitBranch,
  shield: Shield,
  key: Key,
  cpu: Cpu
};

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg bg-[#1a2744] hover:bg-[#2a3754] transition-colors"
          data-testid="button-copy-code"
        >
          {copied ? <Check size={16} className="text-[#00c853]" /> : <Copy size={16} className="text-gray-400" />}
        </button>
      </div>
      <pre className="bg-[#0a0f1c] border border-[#1a2744] rounded-lg p-4 overflow-x-auto">
        <code className="text-sm text-gray-300 font-mono">{code}</code>
      </pre>
    </div>
  );
}

export default function Docs() {
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const [activeSection, setActiveSection] = useState('overview');
  const t = translations[lang];

  const currentSection: any = t.sections.find(s => s.id === activeSection) || t.sections[0];

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f1c]/90 backdrop-blur-md border-b border-[#1a2744]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
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

      <div className="pt-20 flex">
        <aside className="hidden lg:block w-64 fixed left-0 top-20 bottom-0 border-r border-[#1a2744] overflow-y-auto p-6">
          <nav className="space-y-2">
            {t.sections.map(section => {
              const Icon = iconMap[section.icon] || Book;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-sm transition-all ${
                    activeSection === section.id 
                      ? 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30' 
                      : 'text-gray-400 hover:text-white hover:bg-[#1a2744]/50'
                  }`}
                  data-testid={`nav-${section.id}`}
                >
                  <Icon size={16} />
                  {section.title}
                </button>
              );
            })}
          </nav>
          
          <div className="mt-8 pt-8 border-t border-[#1a2744]">
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Quick Links</h4>
            <div className="space-y-2">
              <a 
                href="#code-examples" 
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#00f0ff] transition-colors"
              >
                <ChevronRight size={14} />
                Code Examples
              </a>
              <a 
                href="#error-codes" 
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#00f0ff] transition-colors"
              >
                <ChevronRight size={14} />
                Error Codes
              </a>
            </div>
          </div>
        </aside>

        <main className="flex-1 lg:ml-64 px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] text-sm mb-6">
                <Book size={16} />
                {t.hero.badge}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{
                textShadow: '0 0 30px rgba(0, 240, 255, 0.3)'
              }}>
                {t.hero.title}
              </h1>
              <p className="text-xl text-gray-400">{t.hero.subtitle}</p>
            </div>

            <div className="lg:hidden mb-8 overflow-x-auto">
              <div className="flex gap-2 pb-4">
                {t.sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                      activeSection === section.id 
                        ? 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30' 
                        : 'text-gray-400 bg-[#1a2744]/30'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            </div>

            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00f0ff]/10 to-[#00c853]/10 border border-[#00f0ff]/30 flex items-center justify-center">
                  {(() => {
                    const Icon = iconMap[currentSection.icon] || Book;
                    return <Icon size={20} className="text-[#00f0ff]" />;
                  })()}
                </span>
                {currentSection.content.title}
              </h2>

              {currentSection.content.paragraphs && (
                <div className="space-y-4 mb-8">
                  {currentSection.content.paragraphs.map((p: string, i: number) => (
                    <p key={i} className="text-gray-400 leading-relaxed">{p}</p>
                  ))}
                </div>
              )}

              {currentSection.content.features && (
                <div className="grid md:grid-cols-2 gap-3 mb-8">
                  {currentSection.content.features.map((feature: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#0f1629]/50 border border-[#1a2744]">
                      <CheckCircle size={16} className="text-[#00c853] flex-shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {currentSection.content.steps && (
                <div className="space-y-6">
                  {currentSection.content.steps.map((step: any, i: number) => (
                    <div key={i} className="p-6 rounded-xl border border-[#1a2744] bg-[#0f1629]/30">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00f0ff] to-[#00c853] flex items-center justify-center flex-shrink-0 text-[#0a0f1c] font-bold">
                          {step.number}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                          <p className="text-gray-400 mb-4">{step.description}</p>
                          <ul className="space-y-2">
                            {step.details.map((detail: string, j: number) => (
                              <li key={j} className="flex items-center gap-2 text-sm text-gray-500">
                                <ChevronRight size={14} className="text-[#00f0ff]" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentSection.content.endpoints && (
                <div className="space-y-4">
                  {currentSection.content.endpoints.map((endpoint: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl border border-[#1a2744] bg-[#0f1629]/30">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                          endpoint.method === 'GET' ? 'bg-[#00c853]/20 text-[#00c853]' :
                          endpoint.method === 'POST' ? 'bg-[#00f0ff]/20 text-[#00f0ff]' :
                          'bg-[#ff9100]/20 text-[#ff9100]'
                        }`}>
                          {endpoint.method}
                        </span>
                        <code className="text-sm font-mono text-white">{endpoint.path}</code>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{endpoint.description}</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div><span className="text-gray-400">Auth:</span> {endpoint.auth}</div>
                        {endpoint.body && <div><span className="text-gray-400">Body:</span> {endpoint.body}</div>}
                        <div><span className="text-gray-400">Response:</span> {endpoint.response}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentSection.content.measures && (
                <div className="grid md:grid-cols-2 gap-4">
                  {currentSection.content.measures.map((measure: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl border border-[#1a2744] bg-[#0f1629]/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield size={16} className="text-[#00f0ff]" />
                        <h4 className="font-semibold">{measure.title}</h4>
                      </div>
                      <p className="text-sm text-gray-400">{measure.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {currentSection.content.capabilities && (
                <div className="space-y-4 mb-8">
                  {currentSection.content.capabilities.map((cap: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl border border-[#1a2744] bg-[#0f1629]/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Cpu size={16} className="text-[#ff9100]" />
                        <h4 className="font-semibold">{cap.issue}</h4>
                      </div>
                      <p className="text-sm text-gray-400">{cap.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {currentSection.content.permissions && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Required Permissions</h3>
                  <div className="space-y-3">
                    {currentSection.content.permissions.map((perm: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[#0f1629]/50 border border-[#1a2744]">
                        <code className="px-2 py-1 bg-[#1a2744] rounded text-xs text-[#00f0ff]">{perm.scope}</code>
                        <span className="text-sm text-gray-400">{perm.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentSection.content.flow && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">OAuth Flow</h3>
                  <ol className="space-y-3">
                    {currentSection.content.flow.map((step: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#1a2744] flex items-center justify-center text-xs text-[#00f0ff] flex-shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-gray-400">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </section>

            <section id="code-examples" className="mb-16">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00f0ff]/10 to-[#00c853]/10 border border-[#00f0ff]/30 flex items-center justify-center">
                  <Terminal size={20} className="text-[#00f0ff]" />
                </span>
                {t.codeExamples.title}
              </h2>
              <div className="space-y-6">
                {t.codeExamples.examples.map((example, i) => (
                  <div key={i}>
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">{example.title}</h3>
                    <CodeBlock code={example.code} language={example.language} />
                  </div>
                ))}
              </div>
            </section>

            <section id="error-codes">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff9100]/10 to-[#ff5722]/10 border border-[#ff9100]/30 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-[#ff9100]" />
                </span>
                {t.errorCodes.title}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#1a2744]">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Code</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Description</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Solution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.errorCodes.codes.map((error, i) => (
                      <tr key={i} className="border-b border-[#1a2744]/50">
                        <td className="py-3 px-4">
                          <code className="px-2 py-1 bg-[#1a2744] rounded text-xs text-[#ff9100]">{error.code}</code>
                        </td>
                        <td className="py-3 px-4 text-gray-400">{error.description}</td>
                        <td className="py-3 px-4 text-gray-500">{error.solution}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>

      <footer className="border-t border-[#1a2744] py-8 px-6 lg:ml-64">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
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
