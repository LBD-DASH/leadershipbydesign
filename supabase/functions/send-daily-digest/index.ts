import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface DigestStats {
  discoveredToday: number;
  contactedToday: number;
  engagedThisWeek: number;
  repliedThisWeek: number;
  convertedThisWeek: number;
  activeSequences: number;
  completedSequences: number;
}

interface TopLead {
  id: string;
  company_name: string;
  contact_name: string | null;
  contact_email: string | null;
  industry: string | null;
  score: number;
}

function calculateScore(prospect: Record<string, unknown>): number {
  let score = 0;
  if (prospect.contact_email) score += 25;
  if (prospect.hr_contacts && Array.isArray(prospect.hr_contacts) && prospect.hr_contacts.length > 0) score += 20;
  if (prospect.contact_phone) score += 10;
  if (prospect.pain_points && Array.isArray(prospect.pain_points) && prospect.pain_points.length > 0) score += 15;
  if (prospect.opportunity_signals && Array.isArray(prospect.opportunity_signals) && prospect.opportunity_signals.length > 0) score += 15;
  if (prospect.leadership_team && Array.isArray(prospect.leadership_team) && prospect.leadership_team.length > 0) score += 10;
  if (prospect.linkedin_url) score += 5;
  return score;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate date ranges
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 7);

    // Gather statistics
    const stats: DigestStats = {
      discoveredToday: 0,
      contactedToday: 0,
      engagedThisWeek: 0,
      repliedThisWeek: 0,
      convertedThisWeek: 0,
      activeSequences: 0,
      completedSequences: 0
    };

    // Discovered today
    const { count: discoveredCount } = await supabase
      .from('prospect_companies')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayStart.toISOString());
    stats.discoveredToday = discoveredCount || 0;

    // Contacted today (outreach sent)
    const { count: contactedCount } = await supabase
      .from('prospect_outreach')
      .select('*', { count: 'exact', head: true })
      .gte('sent_at', todayStart.toISOString());
    stats.contactedToday = contactedCount || 0;

    // Engaged this week (prospects with engagement)
    const { count: engagedCount } = await supabase
      .from('prospect_companies')
      .select('*', { count: 'exact', head: true })
      .gte('engaged_at', weekStart.toISOString());
    stats.engagedThisWeek = engagedCount || 0;

    // Replied this week
    const { count: repliedCount } = await supabase
      .from('prospect_companies')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'replied')
      .gte('updated_at', weekStart.toISOString());
    stats.repliedThisWeek = repliedCount || 0;

    // Converted this week
    const { count: convertedCount } = await supabase
      .from('prospect_companies')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'converted')
      .gte('updated_at', weekStart.toISOString());
    stats.convertedThisWeek = convertedCount || 0;

    // Active sequences
    const { count: activeSeqCount } = await supabase
      .from('prospect_sequences')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');
    stats.activeSequences = activeSeqCount || 0;

    // Completed sequences this week
    const { count: completedSeqCount } = await supabase
      .from('prospect_sequences')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')
      .gte('updated_at', weekStart.toISOString());
    stats.completedSequences = completedSeqCount || 0;

    // Get follow-ups sent today by step
    const { data: followupsToday } = await supabase
      .from('prospect_outreach')
      .select('sequence_step, prospect:prospect_companies(company_name)')
      .gte('sent_at', todayStart.toISOString())
      .order('sent_at', { ascending: false });

    // Get top 3 hot leads not yet contacted
    const { data: allProspects } = await supabase
      .from('prospect_companies')
      .select('*')
      .eq('status', 'researched')
      .not('contact_email', 'is', null);

    const topLeads: TopLead[] = (allProspects || [])
      .map(p => ({
        id: p.id,
        company_name: p.company_name,
        contact_name: p.contact_name,
        contact_email: p.contact_email,
        industry: p.industry,
        score: calculateScore(p)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    // Get recently engaged prospects
    const { data: engagedProspects } = await supabase
      .from('prospect_companies')
      .select('company_name, contact_name, engagement_source, engaged_at')
      .not('engaged_at', 'is', null)
      .gte('engaged_at', weekStart.toISOString())
      .order('engaged_at', { ascending: false })
      .limit(5);

    // Build email content
    const dashboardUrl = 'https://leadershipbydesign.lovable.app/marketing';
    const dateStr = now.toLocaleDateString('en-ZA', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h1 style="color: #2563eb; margin-bottom: 8px;">🎯 Daily Prospecting Digest</h1>
        <p style="color: #666; margin-top: 0;">${dateStr}</p>
        
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">
        
        <h2 style="font-size: 18px; margin-bottom: 12px;">📊 Today's Activity</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0;">New Prospects Discovered</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold;">${stats.discoveredToday}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">Outreach Emails Sent</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold;">${stats.contactedToday}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">Active Sequences</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold;">${stats.activeSequences}</td>
          </tr>
        </table>
        
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">
        
        <h2 style="font-size: 18px; margin-bottom: 12px;">📈 This Week's Stats</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0;">Prospects Engaged</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #16a34a;">${stats.engagedThisWeek}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">Replies Received</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #16a34a;">${stats.repliedThisWeek}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">Converted</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #16a34a;">${stats.convertedThisWeek}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">Sequences Completed</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold;">${stats.completedSequences}</td>
          </tr>
        </table>
        
        ${followupsToday && followupsToday.length > 0 ? `
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">
          
          <h2 style="font-size: 18px; margin-bottom: 12px;">📧 Follow-ups Sent Today</h2>
          <ul style="padding-left: 20px; margin: 0;">
            ${followupsToday.map(f => `
              <li style="padding: 4px 0;">${(f.prospect as {company_name: string})?.company_name || 'Unknown'} - Step ${f.sequence_step || 1}</li>
            `).join('')}
          </ul>
        ` : ''}
        
        ${engagedProspects && engagedProspects.length > 0 ? `
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">
          
          <h2 style="font-size: 18px; margin-bottom: 12px;">🔥 Recently Engaged</h2>
          <ul style="padding-left: 20px; margin: 0;">
            ${engagedProspects.map(p => `
              <li style="padding: 4px 0;">
                <strong>${p.company_name}</strong>${p.contact_name ? ` (${p.contact_name})` : ''} 
                <span style="color: #666;">- ${p.engagement_source || 'diagnostic click'}</span>
              </li>
            `).join('')}
          </ul>
        ` : ''}
        
        ${topLeads.length > 0 ? `
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">
          
          <h2 style="font-size: 18px; margin-bottom: 12px;">⭐ Top Hot Leads Ready for Outreach</h2>
          <table style="width: 100%; border-collapse: collapse;">
            ${topLeads.map((lead, i) => `
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 12px 0;">
                  <strong>${i + 1}. ${lead.company_name}</strong><br>
                  <span style="color: #666; font-size: 14px;">
                    ${lead.contact_name || 'No contact'} • ${lead.industry || 'Unknown industry'} • Score: ${lead.score}
                  </span>
                </td>
                <td style="padding: 12px 0; text-align: right;">
                  <a href="${dashboardUrl}?action=outreach&prospect=${lead.id}" 
                     style="background: #2563eb; color: white; padding: 8px 16px; text-decoration: none; border-radius: 6px; font-size: 14px;">
                    Send Outreach
                  </a>
                </td>
              </tr>
            `).join('')}
          </table>
        ` : ''}
        
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">
        
        <p style="text-align: center;">
          <a href="${dashboardUrl}" 
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-size: 16px; display: inline-block;">
            View Full Dashboard
          </a>
        </p>
        
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
          Leadership by Design • Automated Prospecting Digest
        </p>
      </div>
    `;

    // Send digest to Kevin and Lauren
    const recipients = ['kevin@kevinbritz.com', 'lauren@kevinbritz.com'];
    
    console.log('Sending daily digest to:', recipients);

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Leadership by Design <hello@leadershipbydesign.co>',
        to: recipients,
        subject: `🎯 Prospecting Digest: ${stats.discoveredToday} new, ${stats.contactedToday} contacted, ${stats.engagedThisWeek} engaged`,
        html: emailHtml,
      }),
    });

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error('Resend error:', emailResult);
      return new Response(
        JSON.stringify({ success: false, error: emailResult.message || 'Failed to send digest' }),
        { status: emailResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Daily digest sent successfully:', emailResult.id);

    // ── Slack summaries (non-blocking) ──
    try {
      // Count today's leads & signups across all tables
      const { count: newSubscribers } = await supabase
        .from('email_subscribers')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayStart.toISOString());

      const { count: newContacts } = await supabase
        .from('contact_form_submissions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayStart.toISOString());

      const { count: newDiagnostics } = await supabase
        .from('diagnostic_submissions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayStart.toISOString());

      const { count: newLeadershipDiag } = await supabase
        .from('leadership_diagnostic_submissions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayStart.toISOString());

      const { count: newAIDiag } = await supabase
        .from('ai_readiness_submissions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayStart.toISOString());

      const { count: newShiftDiag } = await supabase
        .from('shift_diagnostic_submissions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayStart.toISOString());

      const { count: newPurchases } = await supabase
        .from('product_purchases')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayStart.toISOString());

      const { count: newDownloads } = await supabase
        .from('lead_magnet_downloads')
        .select('*', { count: 'exact', head: true })
        .gte('downloaded_at', todayStart.toISOString());

      const totalDiagnostics = (newDiagnostics || 0) + (newLeadershipDiag || 0) + (newAIDiag || 0) + (newShiftDiag || 0);

      // Post to #leads-and-signups
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          eventType: 'daily_leads_digest',
          data: {
            subscribers: newSubscribers || 0,
            contacts: newContacts || 0,
            diagnostics: totalDiagnostics,
            downloads: newDownloads || 0,
            purchases: newPurchases || 0,
            prospects: stats.discoveredToday,
          },
        }),
      });

      // Post to #system-health
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          eventType: 'daily_health_check',
          data: {
            activeSequences: stats.activeSequences,
            outreachSent: stats.contactedToday,
            engaged: stats.engagedThisWeek,
          },
        }),
      });
    } catch (slackErr) {
      console.error('Slack digest error (non-fatal):', slackErr);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: emailResult.id,
        stats 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending daily digest:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send digest';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
