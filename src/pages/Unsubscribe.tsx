import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!email) {
      setStatus('error');
      return;
    }

    const unsubscribe = async () => {
      const { error } = await supabase
        .from('email_subscribers')
        .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
        .eq('email', email.toLowerCase().trim());

      setStatus(error ? 'error' : 'success');
    };

    unsubscribe();
  }, [email]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card rounded-xl border border-border p-12 max-w-md text-center">
        {status === 'loading' && <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto" />}
        {status === 'success' && (
          <>
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">You've been unsubscribed</h1>
            <p className="text-muted-foreground">
              You will no longer receive newsletter emails from Leadership by Design.
            </p>
          </>
        )}
        {status === 'error' && (
          <>
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h1>
            <p className="text-muted-foreground">
              Please contact hello@leadershipbydesign.co to unsubscribe.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
