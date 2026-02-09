import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Shield, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#ffffff',
      '::placeholder': { color: '#6b7280' },
      iconColor: '#00f0ff',
    },
    invalid: { color: '#ef4444', iconColor: '#ef4444' },
  },
};

function CardForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    async function createSetupIntent() {
      try {
        const res = await apiRequest('POST', '/api/setup-intent');
        const data = await res.json();
        if (data.alreadyVerified) {
          onSuccess();
          return;
        }
        setClientSecret(data.clientSecret);
      } catch (error: any) {
        toast({ title: 'Fehler', description: error.message, variant: 'destructive' });
      }
    }
    createSetupIntent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setLoading(false);
      return;
    }

    const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      toast({ title: 'Fehler', description: error.message, variant: 'destructive' });
      setLoading(false);
      return;
    }

    if (setupIntent?.status === 'succeeded') {
      try {
        await apiRequest('POST', '/api/verify-card', { setupIntentId: setupIntent.id });
        toast({ title: 'Erfolgreich!', description: '1 Gratis-Deploy freigeschaltet!' });
        onSuccess();
      } catch (error: any) {
        toast({ title: 'Fehler', description: error.message, variant: 'destructive' });
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 rounded-lg bg-[#0f1629] border border-[#1a2744]">
        <CardElement options={cardElementOptions} />
      </div>
      <Button
        type="submit"
        disabled={!stripe || loading || !clientSecret}
        className="w-full bg-gradient-to-r from-[#00f0ff] to-[#00c853] text-[#0a0f1c] font-bold hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
        data-testid="button-verify-card"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
        {loading ? 'Verifiziere...' : 'Karte verifizieren & Gratis-Deploy erhalten'}
      </Button>
    </form>
  );
}

interface CardVerificationProps {
  onSuccess: () => void;
  onSkip?: () => void;
}

export default function CardVerification({ onSuccess, onSkip }: CardVerificationProps) {
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null);

  useEffect(() => {
    async function loadStripeConfig() {
      try {
        const res = await fetch('/api/stripe-config');
        const data = await res.json();
        if (data.publishableKey) {
          setStripePromise(loadStripe(data.publishableKey));
        }
      } catch (error) {
        console.error('Failed to load Stripe config:', error);
      }
    }
    loadStripeConfig();
  }, []);

  if (!stripePromise) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-[#00f0ff]" />
      </div>
    );
  }

  return (
    <div className="bg-[#0a0f1c] rounded-2xl border border-[#00f0ff]/30 p-8 max-w-md mx-auto shadow-[0_0_30px_rgba(0,240,255,0.1)]">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#00f0ff]/20 to-[#00c853]/20 flex items-center justify-center">
          <Shield className="w-8 h-8 text-[#00f0ff]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Karte verifizieren</h2>
        <p className="text-gray-400 text-sm">
          Verifiziere deine Karte, um <span className="text-[#00c853] font-bold">1 Gratis-Deploy</span> zu erhalten.
          Es wird nichts abgebucht.
        </p>
      </div>

      <div className="mb-6 p-4 rounded-lg bg-[#00c853]/10 border border-[#00c853]/30">
        <div className="flex items-center gap-3 text-sm">
          <Check className="w-5 h-5 text-[#00c853]" />
          <span className="text-gray-300">Keine Abbuchung - nur Verifizierung</span>
        </div>
        <div className="flex items-center gap-3 text-sm mt-2">
          <Check className="w-5 h-5 text-[#00c853]" />
          <span className="text-gray-300">1 Gratis-Deploy sofort freigeschaltet</span>
        </div>
        <div className="flex items-center gap-3 text-sm mt-2">
          <Check className="w-5 h-5 text-[#00c853]" />
          <span className="text-gray-300">256-bit SSL verschlüsselt</span>
        </div>
      </div>

      <Elements stripe={stripePromise}>
        <CardForm onSuccess={onSuccess} />
      </Elements>

      {onSkip && (
        <button
          onClick={onSkip}
          className="w-full mt-4 text-sm text-gray-500 hover:text-gray-400 transition-colors"
          data-testid="button-skip-verification"
        >
          Später verifizieren (kein Gratis-Deploy)
        </button>
      )}
    </div>
  );
}
