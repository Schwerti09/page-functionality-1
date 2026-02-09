import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Zap, Upload, HelpCircle, BarChart3, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  action?: 'deploy' | 'stats' | 'help' | 'pricing';
}

interface DeployAssistantProps {
  onTriggerDeploy?: () => void;
  onShowStats?: () => void;
  lang?: 'en' | 'de';
  remainingDeploys?: number;
  totalDeploys?: number;
}

const quickCommands = {
  en: [
    { icon: Upload, label: 'Deploy ZIP', command: 'deploy' },
    { icon: BarChart3, label: 'My Stats', command: 'stats' },
    { icon: HelpCircle, label: 'Help', command: 'help' },
  ],
  de: [
    { icon: Upload, label: 'ZIP Deployen', command: 'deploy' },
    { icon: BarChart3, label: 'Meine Stats', command: 'stats' },
    { icon: HelpCircle, label: 'Hilfe', command: 'help' },
  ]
};

const responses = {
  en: {
    greeting: "Hey! I'm your ZIP-SHIP Assistant. How can I help you deploy today?",
    deploy: "Let's deploy your project! I'll highlight the upload zone for you. Just drag & drop your ZIP file there.",
    stats: "Here are your stats:\n• Remaining Deploys: {remaining}\n• Total Deployments: {total}\n\nNeed more credits? Check out our pricing!",
    help: "Here's what I can help you with:\n\n• **Deploy** - Start a new deployment\n• **Stats** - View your deployment stats\n• **Pricing** - See our plans\n• **GitHub** - Connect your GitHub\n\nJust type what you need!",
    pricing: "Our pricing:\n\n• **Single Deploy**: €2.99 (1 deploy)\n• **Deploy Pack**: €9.99 (10 deploys) - Best value!\n• **Enterprise**: €29.99/month (unlimited)\n\nNew users get 1 FREE deploy after card verification!",
    github: "To connect GitHub:\n1. Click 'Connect GitHub' in your dashboard\n2. Authorize ZIP-SHIP\n3. Done! You're ready to deploy.",
    unknown: "I can help you with: **deploy**, **stats**, **help**, or **pricing**. What would you like to do?",
    deploying: "Activating upload zone... Drag your ZIP file to the highlighted area!",
  },
  de: {
    greeting: "Hey! Ich bin dein ZIP-SHIP Assistent. Wie kann ich dir heute beim Deployen helfen?",
    deploy: "Lass uns dein Projekt deployen! Ich markiere die Upload-Zone für dich. Zieh einfach deine ZIP-Datei dorthin.",
    stats: "Hier sind deine Stats:\n• Verbleibende Deploys: {remaining}\n• Gesamt-Deployments: {total}\n\nMehr Credits nötig? Schau dir unsere Preise an!",
    help: "Hier ist, wobei ich helfen kann:\n\n• **Deploy** - Neues Deployment starten\n• **Stats** - Deine Deployment-Statistiken\n• **Preise** - Unsere Pakete ansehen\n• **GitHub** - GitHub verbinden\n\nTipp einfach was du brauchst!",
    pricing: "Unsere Preise:\n\n• **Single Deploy**: 2,99€ (1 Deploy)\n• **Deploy Pack**: 9,99€ (10 Deploys) - Bester Wert!\n• **Enterprise**: 29,99€/Monat (unbegrenzt)\n\nNeue Nutzer bekommen 1 GRATIS Deploy nach Kartenverifizierung!",
    github: "Um GitHub zu verbinden:\n1. Klicke 'GitHub verbinden' in deinem Dashboard\n2. Autorisiere ZIP-SHIP\n3. Fertig! Du kannst deployen.",
    unknown: "Ich kann dir helfen mit: **deploy**, **stats**, **hilfe**, oder **preise**. Was möchtest du tun?",
    deploying: "Aktiviere Upload-Zone... Zieh deine ZIP-Datei in den markierten Bereich!",
  }
};

export function DeployAssistant({ 
  onTriggerDeploy, 
  onShowStats,
  lang = 'de',
  remainingDeploys = 0,
  totalDeploys = 0
}: DeployAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = responses[lang];
  const commands = quickCommands[lang];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: t.greeting
      }]);
    }
  }, [isOpen, t.greeting, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const parseCommand = (text: string): string => {
    const lower = text.toLowerCase().trim();
    
    if (lower.includes('deploy') || lower.includes('upload') || lower.includes('zip') || 
        lower.includes('hochladen') || lower.includes('deployen')) {
      return 'deploy';
    }
    if (lower.includes('stat') || lower.includes('credit') || lower.includes('remaining') ||
        lower.includes('übrig') || lower.includes('guthaben')) {
      return 'stats';
    }
    if (lower.includes('help') || lower.includes('hilfe') || lower.includes('how') ||
        lower.includes('wie') || lower.includes('what') || lower.includes('was kann')) {
      return 'help';
    }
    if (lower.includes('price') || lower.includes('pricing') || lower.includes('cost') ||
        lower.includes('preis') || lower.includes('kosten') || lower.includes('pack')) {
      return 'pricing';
    }
    if (lower.includes('github') || lower.includes('connect') || lower.includes('verbinden')) {
      return 'github';
    }
    
    return 'unknown';
  };

  const getResponse = (command: string): string => {
    switch (command) {
      case 'deploy':
        return t.deploy;
      case 'stats':
        return t.stats
          .replace('{remaining}', String(remainingDeploys))
          .replace('{total}', String(totalDeploys));
      case 'help':
        return t.help;
      case 'pricing':
        return t.pricing;
      case 'github':
        return t.github;
      default:
        return t.unknown;
    }
  };

  const handleAction = (command: string) => {
    if (command === 'deploy' && onTriggerDeploy) {
      setTimeout(() => {
        onTriggerDeploy();
      }, 500);
    }
    if (command === 'stats' && onShowStats) {
      onShowStats();
    }
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const command = parseCommand(text);

    setTimeout(() => {
      const response = getResponse(command);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        action: command as any
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      handleAction(command);
    }, 600);
  };

  const handleQuickCommand = (command: string) => {
    const labels: Record<string, Record<string, string>> = {
      deploy: { en: 'Deploy my project', de: 'Mein Projekt deployen' },
      stats: { en: 'Show my stats', de: 'Zeig meine Stats' },
      help: { en: 'Help me', de: 'Hilf mir' },
    };
    sendMessage(labels[command]?.[lang] || command);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-[#00F0FF] to-[#00C853] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_50px_rgba(0,240,255,0.6)] hover:scale-110 transition-all ${isOpen ? 'hidden' : ''}`}
        data-testid="button-open-assistant"
      >
        <Sparkles className="w-6 h-6 text-[#0A0E27]" />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-[#0A0E27] border border-[#00F0FF]/30 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden" data-testid="assistant-panel">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#00F0FF]/10 to-[#00C853]/10 border-b border-[#00F0FF]/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00F0FF] to-[#00C853] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                <Zap className="w-5 h-5 text-[#0A0E27]" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">ZIP-SHIP Assistant</h3>
                <p className="text-xs text-[#00F0FF]" style={{textShadow: '0 0 10px rgba(0,240,255,0.5)'}}>
                  {lang === 'de' ? 'Immer bereit zu helfen' : 'Always ready to help'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors p-1"
              data-testid="button-close-assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="h-[300px] overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm whitespace-pre-line ${
                    message.role === 'user'
                      ? 'bg-[#00F0FF] text-[#0A0E27] rounded-br-md'
                      : 'bg-[#0F1429] text-slate-200 border border-[#00F0FF]/20 rounded-bl-md'
                  }`}
                >
                  {message.content.split('**').map((part, i) => 
                    i % 2 === 1 ? <strong key={i} className="text-[#00F0FF]">{part}</strong> : part
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#0F1429] border border-[#00F0FF]/20 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[#00F0FF] rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                    <span className="w-2 h-2 bg-[#00F0FF] rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                    <span className="w-2 h-2 bg-[#00F0FF] rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-[#00F0FF]/20 bg-[#0F1429]/50">
            <div className="flex gap-2 mb-3">
              {commands.map((cmd) => (
                <button
                  key={cmd.command}
                  onClick={() => handleQuickCommand(cmd.command)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F1429] border border-[#00F0FF]/20 rounded-full text-xs text-slate-300 hover:text-[#00F0FF] hover:border-[#00F0FF]/50 transition-all"
                  data-testid={`button-quick-${cmd.command}`}
                >
                  <cmd.icon className="w-3 h-3" />
                  {cmd.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={lang === 'de' ? 'Was möchtest du tun?' : 'What would you like to do?'}
                className="flex-1 bg-[#0A0E27] border border-[#00F0FF]/20 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0FF]/50 transition-colors"
                data-testid="input-assistant-message"
              />
              <Button 
                type="submit" 
                size="icon"
                className="bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-[#0A0E27] shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                data-testid="button-send-message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
