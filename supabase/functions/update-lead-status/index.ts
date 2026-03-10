import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate HMAC token for a sequence action
export function generateToken(sequenceId: string, action: string, secret: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${sequenceId}:${action}`);
  const key = encoder.encode(secret);
  // Simple hash: use SubtleCrypto
  // We'll use a sync approach with a basic hash
  let hash = 0;
  const combined = `${sequenceId}:${action}:${secret}`;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

// Build the one-click action URL
export function buildStatusUrl(baseUrl: string, sequenceId: string, action: string, secret: string): string {
  const token = generateToken(sequenceId, action, secret);
  return `${baseUrl}/functions/v1/update-lead-status?id=${sequenceId}&action=${action}&token=${token}`;
}

const VALID_ACTIONS = ['contacted', 'engaged', 'booked_call'] as const;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const sequenceId = url.searchParams.get('id');
    const action = url.searchParams.get('action');
    const token = url.searchParams.get('token');

    if (!sequenceId || !action || !token) {
      return htmlResponse('Missing parameters', 'error');
    }

    if (!VALID_ACTIONS.includes(action as any)) {
      return htmlResponse(`Invalid action: ${action}`, 'error');
    }

    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const expectedToken = generateToken(sequenceId, action, serviceKey);

    if (token !== expectedToken) {
      return htmlResponse('Invalid or expired link', 'error');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Check current status
    const { data: seq, error: fetchErr } = await supabase
      .from('warm_lead_sequences')
      .select('*')
      .eq('id', sequenceId)
      .single();

    if (fetchErr || !seq) {
      return htmlResponse('Sequence not found', 'error');
    }

    // Don't allow updating already-terminal statuses
    if (['engaged', 'booked_call', 'dormant'].includes(seq.status)) {
      return htmlResponse(
        `Already marked as "${seq.status.replace('_', ' ')}" — no action needed.`,
        'info',
        seq.lead_name,
      );
    }

    const now = new Date().toISOString();
    const update: Record<string, any> = { status: action, updated_at: now };

    if (action === 'contacted') {
      update.contacted_at = now;
      const day2 = new Date();
      day2.setDate(day2.getDate() + 2);
      update.next_reminder_at = day2.toISOString();
    } else if (action === 'engaged') {
      update.engaged_at = now;
      update.next_reminder_at = null;
    } else if (action === 'booked_call') {
      update.booked_at = now;
      update.next_reminder_at = null;
    }

    const { error: updateErr } = await supabase
      .from('warm_lead_sequences')
      .update(update)
      .eq('id', sequenceId);

    if (updateErr) throw updateErr;

    const actionLabels: Record<string, string> = {
      contacted: '📞 Marked as Contacted',
      engaged: '🤝 Marked as Engaged',
      booked_call: '📅 Marked as Call Booked',
    };

    // Fire Slack notification about the status change
    try {
      const slackPayload = {
        eventType: 'new_lead',
        channel: 'leads-and-signups',
        data: {
          name: seq.lead_name,
          email: seq.lead_email,
          company: seq.lead_company,
          source: `Status updated: ${action.replace('_', ' ')}`,
          temperature: seq.lead_temperature,
          score: seq.lead_score,
        },
      };

      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceKey}`,
        },
        body: JSON.stringify(slackPayload),
      });
    } catch (e) {
      console.error('Slack notify failed (non-blocking):', e);
    }

    return htmlResponse(
      `${actionLabels[action] || action} for ${seq.lead_name}`,
      'success',
      seq.lead_name,
    );
  } catch (error) {
    console.error('update-lead-status error:', error);
    return htmlResponse('Something went wrong. Please try again.', 'error');
  }
});

function htmlResponse(message: string, type: 'success' | 'error' | 'info', leadName?: string) {
  const colors = {
    success: { bg: '#ecfdf5', border: '#10b981', text: '#065f46', icon: '✅' },
    error: { bg: '#fef2f2', border: '#ef4444', text: '#991b1b', icon: '❌' },
    info: { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af', icon: 'ℹ️' },
  };
  const c = colors[type];

  return new Response(
    `<!DOCTYPE html>
<html>
<head><title>Lead Status Updated</title><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f9fafb;">
  <div style="background: ${c.bg}; border: 2px solid ${c.border}; border-radius: 16px; padding: 32px; max-width: 400px; text-align: center;">
    <div style="font-size: 48px; margin-bottom: 16px;">${c.icon}</div>
    <h2 style="color: ${c.text}; margin: 0 0 8px 0;">${type === 'success' ? 'Done!' : type === 'error' ? 'Error' : 'Note'}</h2>
    <p style="color: ${c.text}; margin: 0; line-height: 1.5;">${message}</p>
    ${leadName ? `<p style="color: #6b7280; font-size: 13px; margin-top: 16px;">You can close this tab.</p>` : ''}
  </div>
</body>
</html>`,
    {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    },
  );
}
