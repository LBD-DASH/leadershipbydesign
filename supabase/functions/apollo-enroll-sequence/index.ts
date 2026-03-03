import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-token',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const adminToken = req.headers.get('x-admin-token');
    if (adminToken !== 'Bypass2024') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const APOLLO_API_KEY = Deno.env.get('APOLLO_API_KEY');
    if (!APOLLO_API_KEY) {
      return new Response(JSON.stringify({ error: 'APOLLO_API_KEY not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { action } = body;

    const apolloHeaders = {
      'Content-Type': 'application/json',
      'X-Api-Key': APOLLO_API_KEY,
    };

    // Action: list_sequences — get available sequences from Apollo
    if (action === 'list_sequences') {
      const res = await fetch('https://api.apollo.io/api/v1/emailer_campaigns/search', {
        method: 'POST',
        headers: apolloHeaders,
        body: JSON.stringify({ per_page: 50, page: 1 }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error('Apollo sequences error:', err);
        return new Response(JSON.stringify({ error: `Apollo error: ${res.status}` }), {
          status: res.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const data = await res.json();
      const sequences = (data.emailer_campaigns || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        active: s.active,
        num_steps: s.emailer_steps?.length || 0,
        created_at: s.created_at,
      }));

      return new Response(JSON.stringify({ sequences }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Action: enroll — add contacts to a sequence
    if (action === 'enroll') {
      const { sequence_id, contacts } = body;
      // contacts: [{ apollo_id, email, first_name, last_name, company, title, call_list_prospect_id? }]

      if (!sequence_id || !contacts?.length) {
        return new Response(JSON.stringify({ error: 'sequence_id and contacts required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // First, create contacts in Apollo if they don't have IDs
      const contactIds: string[] = [];
      const contactMap: Record<string, any> = {};

      for (const c of contacts) {
        if (c.apollo_id) {
          contactIds.push(c.apollo_id);
          contactMap[c.apollo_id] = c;
        } else {
          // Create contact in Apollo first
          const createRes = await fetch('https://api.apollo.io/api/v1/contacts', {
            method: 'POST',
            headers: apolloHeaders,
            body: JSON.stringify({
              first_name: c.first_name,
              last_name: c.last_name,
              email: c.email,
              title: c.title,
              organization_name: c.company,
            }),
          });

          if (createRes.ok) {
            const created = await createRes.json();
            const id = created.contact?.id;
            if (id) {
              contactIds.push(id);
              contactMap[id] = { ...c, apollo_id: id };
            }
          } else {
            console.error(`Failed to create contact ${c.email}:`, await createRes.text());
          }
        }
      }

      if (contactIds.length === 0) {
        return new Response(JSON.stringify({ error: 'No contacts could be created/found' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Add contacts to the sequence
      const enrollRes = await fetch(`https://api.apollo.io/api/v1/emailer_campaigns/${sequence_id}/add_contact_ids`, {
        method: 'POST',
        headers: apolloHeaders,
        body: JSON.stringify({
          contact_ids: contactIds,
          send_email_from_email_account_id: '', // uses default
        }),
      });

      if (!enrollRes.ok) {
        const err = await enrollRes.text();
        console.error('Apollo enroll error:', err);
        return new Response(JSON.stringify({ error: `Enrollment failed: ${enrollRes.status}`, details: err }), {
          status: enrollRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get sequence name for tracking
      let sequenceName = 'Unknown Sequence';
      try {
        const seqRes = await fetch('https://api.apollo.io/api/v1/emailer_campaigns/search', {
          method: 'POST',
          headers: apolloHeaders,
          body: JSON.stringify({ per_page: 1, page: 1, id: sequence_id }),
        });
        if (seqRes.ok) {
          const seqData = await seqRes.json();
          sequenceName = seqData.emailer_campaigns?.[0]?.name || sequenceName;
        }
      } catch (_) {}

      // Track in our database
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const trackingRecords = contactIds.map(id => {
        const c = contactMap[id];
        return {
          apollo_contact_id: id,
          apollo_sequence_id: sequence_id,
          apollo_sequence_name: sequenceName,
          contact_email: c?.email || '',
          contact_name: `${c?.first_name || ''} ${c?.last_name || ''}`.trim(),
          contact_company: c?.company || null,
          contact_title: c?.title || null,
          call_list_prospect_id: c?.call_list_prospect_id || null,
          status: 'active',
        };
      });

      const { error: dbError } = await supabase
        .from('apollo_sequence_tracking')
        .upsert(trackingRecords, { onConflict: 'apollo_contact_id,apollo_sequence_id' });

      if (dbError) console.error('Tracking DB error:', dbError);

      return new Response(JSON.stringify({
        success: true,
        enrolled: contactIds.length,
        sequence_name: sequenceName,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action. Use list_sequences or enroll.' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Apollo enroll error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
