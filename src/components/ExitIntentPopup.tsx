import { useState, useEffect, useCallback } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const DISMISSED_KEY = 'lbd_exit_popup_dismissed';
const COOLDOWN_DAYS = 7;

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const dismiss = useCallback(() => {
    setShow(false);
    localStorage.setItem(DISMISSED_KEY, Date.now().toString());
  }, []);

  useEffect(() => {
    // Don't show if recently dismissed
    const last = localStorage.getItem(DISMISSED_KEY);
    if (last && Date.now() - Number(last) < COOLDOWN_DAYS * 86400000) return;

    // Don't show on admin/marketing pages
    if (window.location.pathname.startsWith('/marketing') || window.location.pathname.startsWith('/admin')) return;

    let triggered = false;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !triggered) {
        triggered = true;
        setShow(true);
      }
    };

    // Delay listener so it doesn't fire immediately
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);

    try {
      const { error } = await supabase.from('email_subscribers').insert({
        email: email.toLowerCase().trim(),
        name: name.trim() || null,
        source: 'exit-intent',
        tags: ['exit-intent', 'website-visitor'],
        status: 'active',
      });

      if (error && error.code === '23505') {
        // Already subscribed
        setSubmitted(true);
        toast({ title: "You're already on the list!", description: 'We\'ll keep you in the loop.' });
      } else if (error) {
        throw error;
      } else {
        setSubmitted(true);
        toast({ title: 'Welcome aboard!', description: 'You\'ll hear from us soon.' });

        // Slack notify (non-blocking)
        supabase.functions.invoke('slack-notify', {
          body: { eventType: 'new_signup', data: { name: name.trim() || '—', email: email.trim(), source: 'exit-intent' } },
        }).catch(() => {});
      }
    } catch (err: any) {
      toast({ title: 'Something went wrong', description: err.message, variant: 'destructive' });
    }

    setSubmitting(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          onClick={dismiss}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#1a1a2e] rounded-2xl overflow-hidden shadow-2xl border border-[#c8a97e]/20"
          >
            {/* Close button */}
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Gold accent bar */}
            <div className="h-1 bg-gradient-to-r from-[#c8a97e] via-[#e8d5b5] to-[#c8a97e]" />

            <div className="p-8">
              {!submitted ? (
                <>
                  <h2 className="text-2xl font-bold text-white mb-2 font-serif">
                    Before you go…
                  </h2>
                  <p className="text-white/70 text-sm mb-6 leading-relaxed">
                    Join 3,000+ leaders getting weekly insights on leadership, team performance, and the future of work. No spam — just actionable intelligence.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <Input
                      type="text"
                      placeholder="First name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#c8a97e]"
                    />
                    <Input
                      type="email"
                      placeholder="Email address *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#c8a97e]"
                    />
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#c8a97e] hover:bg-[#b8956e] text-[#1a1a2e] font-semibold text-sm"
                    >
                      {submitting ? 'Subscribing…' : 'Keep Me in the Loop'}
                      {!submitting && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                  </form>

                  <p className="text-white/30 text-xs mt-4 text-center">
                    Unsubscribe anytime. We respect your inbox.
                  </p>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="text-4xl mb-3">✅</div>
                  <h2 className="text-xl font-bold text-white mb-2 font-serif">
                    You're in!
                  </h2>
                  <p className="text-white/70 text-sm">
                    We'll send you our best leadership insights. Watch your inbox.
                  </p>
                  <Button
                    onClick={dismiss}
                    variant="outline"
                    className="mt-4 border-[#c8a97e]/30 text-[#c8a97e] hover:bg-[#c8a97e]/10"
                  >
                    Continue browsing
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
