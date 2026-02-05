import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface ProspectingConfig {
  id: string;
  industry: string;
  location: string;
  company_size: string;
  is_active: boolean;
}

interface DiscoveredCompany {
  company_name: string;
  website_url: string;
  industry: string;
  location: string;
  description: string;
}

interface RunStats {
  companies_discovered: number;
  companies_researched: number;
  companies_saved: number;
  errors: Array<{ industry: string; company?: string; error: string }>;
}

// Helper to delay between API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: fetch with timeout to avoid hanging runs that never complete (which leaves status='running')
async function fetchWithTimeout(
  input: string | URL,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

interface PipelineRequestBody {
  run_id?: string;
  // Safety valve: cap work per invocation so the platform doesn't kill us mid-run.
  // If we hit the cap, we self-invoke to continue the same run.
  max_ms?: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const startedAtMs = Date.now();
  let body: PipelineRequestBody = {};
  try {
    // Request body is optional
    if (req.method !== 'GET') {
      body = (await req.json().catch(() => ({}))) as PipelineRequestBody;
    }
  } catch {
    body = {};
  }
  const maxMs = typeof body.max_ms === 'number' && body.max_ms > 30_000 ? body.max_ms : 7 * 60_000; // default: 7 minutes

  // Create (or resume) a run record
  let runRecord: any = null;
  if (body.run_id) {
    const { data: existingRun, error: existingRunError } = await supabase
      .from('prospecting_runs')
      .select('*')
      .eq('id', body.run_id)
      .maybeSingle();

    if (existingRunError || !existingRun) {
      console.error('Failed to resume run record:', existingRunError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to resume pipeline run' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    runRecord = existingRun;
    if (runRecord.status !== 'running') {
      // Re-open a previous run if it got stuck
      await supabase
        .from('prospecting_runs')
        .update({ status: 'running', completed_at: null })
        .eq('id', runRecord.id);
      runRecord.status = 'running';
    }
  } else {
    const { data: createdRun, error: runError } = await supabase
      .from('prospecting_runs')
      .insert({
        status: 'running',
        run_details: { triggered_at: new Date().toISOString() },
      })
      .select()
      .single();

    if (runError) {
      console.error('Failed to create run record:', runError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to start pipeline run' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    runRecord = createdRun;
  }

  const runId = runRecord.id as string;
  const stats: RunStats = {
    companies_discovered: 0,
    companies_researched: 0,
    companies_saved: 0,
    errors: []
  };

  try {
    console.log('Starting automated prospecting pipeline, run ID:', runId);

    const shouldStopSoon = () => Date.now() - startedAtMs > maxMs;

    // Fetch active industries
    const { data: configs, error: configError } = await supabase
      .from('prospecting_config')
      .select('*')
      .eq('is_active', true);

    if (configError || !configs || configs.length === 0) {
      throw new Error('No active industries configured');
    }

    console.log(`Found ${configs.length} active industries to process`);

    // Process each industry sequentially
    for (const config of configs as ProspectingConfig[]) {
      if (shouldStopSoon()) {
        console.log('Time budget reached; scheduling continuation for run:', runId);
        // self-invoke to continue same run id
        try {
          await fetchWithTimeout(
            `${supabaseUrl}/functions/v1/auto-prospect-pipeline`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ run_id: runId, max_ms: maxMs }),
            },
            5000,
          );
        } catch (invokeErr) {
          console.error('Continuation invoke failed (will remain running):', invokeErr);
        }

        return new Response(
          JSON.stringify({ success: true, run_id: runId, continuation: true, stats }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      console.log(`Processing industry: ${config.industry}`);

      try {
        // Step 1: Discover companies using find-companies function
        const discoverResponse = await fetchWithTimeout(`${supabaseUrl}/functions/v1/find-companies`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            industry: config.industry,
            location: config.location,
            companySize: config.company_size,
            targetContacts: 'both'
          }),
        }, 60_000);

        if (!discoverResponse.ok) {
          const errorText = await discoverResponse.text();
          throw new Error(`Discovery failed: ${errorText}`);
        }

        const discoverData = await discoverResponse.json();
        
        if (!discoverData.success || !discoverData.data) {
          throw new Error(discoverData.error || 'No companies discovered');
        }

        const discoveredCompanies: DiscoveredCompany[] = discoverData.data;
        stats.companies_discovered += discoveredCompanies.length;
        console.log(`Discovered ${discoveredCompanies.length} companies in ${config.industry}`);

        // Step 2: Check for duplicates and research each new company
        for (const company of discoveredCompanies) {
          if (shouldStopSoon()) {
            console.log('Time budget reached mid-industry; scheduling continuation for run:', runId);
            try {
              await fetchWithTimeout(
                `${supabaseUrl}/functions/v1/auto-prospect-pipeline`,
                {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${supabaseServiceKey}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ run_id: runId, max_ms: maxMs }),
                },
                5000,
              );
            } catch (invokeErr) {
              console.error('Continuation invoke failed (will remain running):', invokeErr);
            }

            return new Response(
              JSON.stringify({ success: true, run_id: runId, continuation: true, stats }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
            );
          }

          try {
            // Normalize URL for comparison
            let normalizedUrl = company.website_url.toLowerCase().trim();
            if (!normalizedUrl.startsWith('http')) {
              normalizedUrl = `https://${normalizedUrl}`;
            }
            // Remove trailing slash
            normalizedUrl = normalizedUrl.replace(/\/$/, '');

            // Check if company already exists (deduplication)
            const { data: existing } = await supabase
              .from('prospect_companies')
              .select('id')
              .or(`website_url.ilike.%${new URL(normalizedUrl).hostname}%,company_name.ilike.%${company.company_name}%`)
              .limit(1);

            if (existing && existing.length > 0) {
              console.log(`Skipping duplicate: ${company.company_name}`);
              continue;
            }

            // Add delay to respect rate limits (3 seconds between research calls)
            await delay(3000);

            // Step 3: Research the company using firecrawl-company-research
            console.log(`Researching: ${company.company_name} (${company.website_url})`);
            
            const researchResponse = await fetchWithTimeout(`${supabaseUrl}/functions/v1/firecrawl-company-research`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                url: company.website_url
              }),
            }, 90_000);

            stats.companies_researched++;

            if (!researchResponse.ok) {
              // Handle rate limiting with exponential backoff
              if (researchResponse.status === 429) {
                console.log('Rate limited, waiting 10 seconds...');
                await delay(10000);
                continue;
              }
              const errorText = await researchResponse.text();
              throw new Error(`Research failed: ${errorText}`);
            }

            const researchData = await researchResponse.json();

            if (!researchData.success || !researchData.data) {
              console.log(`Research returned no data for ${company.company_name}`);
              continue;
            }

            // Step 4: Save to prospect_companies
            const prospectData = {
              company_name: researchData.data.company_name || company.company_name,
              website_url: company.website_url,
              industry: researchData.data.industry || config.industry,
              company_size: researchData.data.company_size,
              about_summary: researchData.data.about_summary,
              leadership_team: researchData.data.leadership_team,
              pain_points: researchData.data.pain_points,
              opportunity_signals: researchData.data.opportunity_signals,
              personalised_pitch: researchData.data.personalised_pitch,
              suggested_approach: researchData.data.suggested_approach,
              contact_email: researchData.data.contact_email,
              contact_phone: researchData.data.contact_phone,
              physical_address: researchData.data.physical_address,
              linkedin_url: researchData.data.linkedin_url,
              hr_contacts: researchData.data.hr_contacts,
              status: 'new'
            };

            const { error: insertError } = await supabase
              .from('prospect_companies')
              .insert(prospectData);

            if (insertError) {
              console.error(`Failed to save ${company.company_name}:`, insertError);
              stats.errors.push({
                industry: config.industry,
                company: company.company_name,
                error: insertError.message
              });
            } else {
              stats.companies_saved++;
              console.log(`Saved prospect: ${company.company_name}`);
            }

          } catch (companyError) {
            const errorMsg = companyError instanceof Error ? companyError.message : 'Unknown error';
            console.error(`Error processing ${company.company_name}:`, errorMsg);
            stats.errors.push({
              industry: config.industry,
              company: company.company_name,
              error: errorMsg
            });
          }
        }

        // Update last_run_at for this industry config
        await supabase
          .from('prospecting_config')
          .update({ last_run_at: new Date().toISOString() })
          .eq('id', config.id);

      } catch (industryError) {
        const errorMsg = industryError instanceof Error ? industryError.message : 'Unknown error';
        console.error(`Error processing industry ${config.industry}:`, errorMsg);
        stats.errors.push({
          industry: config.industry,
          error: errorMsg
        });
      }

      // Add delay between industries
      await delay(2000);
    }

    // Update run record with final stats
    await supabase
      .from('prospecting_runs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        companies_discovered: stats.companies_discovered,
        companies_researched: stats.companies_researched,
        companies_saved: stats.companies_saved,
        errors: stats.errors,
        run_details: {
          triggered_at: runRecord.run_details?.triggered_at,
          completed_at: new Date().toISOString(),
          industries_processed: configs.length
        }
      })
      .eq('id', runId);

    console.log('Pipeline completed:', stats);

    return new Response(
      JSON.stringify({
        success: true,
        run_id: runId,
        stats
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Pipeline failed';
    console.error('Pipeline error:', errorMsg);

    // Update run record with error
    await supabase
      .from('prospecting_runs')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        companies_discovered: stats.companies_discovered,
        companies_researched: stats.companies_researched,
        companies_saved: stats.companies_saved,
        errors: [...stats.errors, { industry: 'pipeline', error: errorMsg }]
      })
      .eq('id', runId);

    return new Response(
      JSON.stringify({ success: false, error: errorMsg, run_id: runId }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } finally {
    // Safety: if the platform kills the function before our catch runs, the status can be stuck as 'running'.
    // In normal exits, ensure we don't leave a phantom running state older than this invocation.
    try {
      const { data: latestRun } = await supabase
        .from('prospecting_runs')
        .select('status')
        .eq('id', runId)
        .maybeSingle();

      if (latestRun?.status === 'running' && Date.now() - startedAtMs > maxMs + 10_000) {
        await supabase
          .from('prospecting_runs')
          .update({
            status: 'failed',
            completed_at: new Date().toISOString(),
            errors: [...stats.errors, { industry: 'pipeline', error: 'Invocation exceeded time budget and likely terminated.' }],
          })
          .eq('id', runId);
      }
    } catch (finalizeErr) {
      console.error('Failed to finalize run state:', finalizeErr);
    }
  }
});
