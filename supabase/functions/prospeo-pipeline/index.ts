import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const PROSPEO_API = "https://api.prospeo.io";

// ICP: South African FSI firms, 100-500 employees, HR/L&D decision-makers
const SEARCH_CONFIGS = [
  {
    label: "Financial Services HR Directors",
    filters: {
      person_department: { include: ["Human Resources"] },
      person_seniority: { include: ["Director", "Head", "Vice President", "C-Suite"] },
      company_industry: {
        include: [
          "Financial Services",
          "Insurance",
          "Banking",
          "Accounting",
          "Investment Banking",
          "Investment Management",
          "Capital Markets",
        ],
      },
      company_headcount_range: ["101-200", "201-500"],
      person_location_search: { include: ["South Africa"] },
      max_person_per_company: 3,
    },
  },
  {
    label: "Professional Services L&D Managers",
    filters: {
      person_job_title: {
        boolean_search: "(HR OR 'Human Resources' OR 'People' OR 'L&D' OR 'Learning' OR 'Talent' OR 'OD') AND (Director OR Head OR Manager OR Lead)",
      },
      company_industry: {
        include: [
          "Legal Services",
          "Law Practice",
          "Business Consulting and Services",
          "Professional Training and Coaching",
        ],
      },
      company_headcount_range: ["101-200", "201-500"],
      person_location_search: { include: ["South Africa"] },
      max_person_per_company: 2,
    },
  },
];

interface ProspeoPersonResult {
  person: {
    id: string;
    first_name: string;
    last_name: string;
    full_name: string;
    title: string;
    linkedin_url: string;
    location?: { country?: string; city?: string };
  };
  company?: {
    name: string;
    website: string;
    linkedin_url: string;
    industry?: string;
    employee_count?: number;
  };
}

interface EnrichedPerson {
  person: {
    email?: string;
    mobile?: string;
    first_name: string;
    last_name: string;
    full_name: string;
    title: string;
    linkedin_url: string;
  };
  company?: {
    name: string;
    website: string;
  };
}

async function searchProspeo(apiKey: string, filters: Record<string, unknown>, page = 1): Promise<ProspeoPersonResult[]> {
  const res = await fetch(`${PROSPEO_API}/search-person`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-KEY": apiKey,
    },
    body: JSON.stringify({ filters, page }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`Prospeo search error [${res.status}]:`, errText);
    return [];
  }

  const data = await res.json();
  if (data.error) {
    console.error("Prospeo search returned error:", data.error_code, data.filter_error);
    return [];
  }

  return data.results || [];
}

async function bulkEnrichProspeo(apiKey: string, personIds: { identifier: string; person_id: string }[]): Promise<EnrichedPerson[]> {
  if (personIds.length === 0) return [];

  const res = await fetch(`${PROSPEO_API}/bulk-enrich-person`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-KEY": apiKey,
    },
    body: JSON.stringify({
      only_verified_email: true,
      enrich_mobile: false,
      data: personIds,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`Prospeo bulk enrich error [${res.status}]:`, errText);
    return [];
  }

  const data = await res.json();
  if (data.error) {
    console.error("Prospeo enrich returned error:", data.error_code);
    return [];
  }

  return data.results || [];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const prospeoApiKey = Deno.env.get("PROSPEO_API_KEY");
  const supabase = createClient(supabaseUrl, serviceKey);
  const headers = { ...corsHeaders, "Content-Type": "application/json" };

  if (!prospeoApiKey) {
    return new Response(
      JSON.stringify({ error: "PROSPEO_API_KEY not configured" }),
      { status: 500, headers }
    );
  }

  try {
    let totalSearched = 0;
    let totalEnriched = 0;
    let totalInserted = 0;
    const searchLabels: string[] = [];

    for (const config of SEARCH_CONFIGS) {
      console.log(`🔍 Prospeo search: ${config.label}`);
      searchLabels.push(config.label);

      // Step 1: Search for people (page 1 = 25 results)
      const results = await searchProspeo(prospeoApiKey, config.filters);
      console.log(`  Found ${results.length} contacts`);
      totalSearched += results.length;

      if (results.length === 0) continue;

      // Step 2: Bulk enrich to reveal verified emails (batches of 50)
      const enrichPayload = results.map((r, i) => ({
        identifier: `${config.label}-${i}`,
        person_id: r.person.id,
      }));

      const enriched = await bulkEnrichProspeo(prospeoApiKey, enrichPayload);
      console.log(`  Enriched ${enriched.length} with verified emails`);

      // Step 3: Build prospect records
      const prospects = enriched
        .filter((e) => e.person?.email)
        .map((e) => ({
          first_name: e.person.first_name || "",
          last_name: e.person.last_name || "",
          email: (e.person.email || "").toLowerCase().trim(),
          company: e.company?.name || "",
          phone: e.person.mobile || "",
          title: e.person.title || "",
          linkedin_url: e.person.linkedin_url || "",
          company_website: e.company?.website || "",
        }));

      totalEnriched += prospects.length;

      if (prospects.length === 0) continue;

      // Step 4: Deduplicate against existing call_list_prospects
      const emails = prospects.map((p) => p.email);
      const { data: existingByEmail } = await supabase
        .from("call_list_prospects")
        .select("email")
        .in("email", emails);

      const existingEmails = new Set(
        (existingByEmail || []).map((e: { email: string }) => e.email?.toLowerCase())
      );

      const newProspects = prospects.filter((p) => !existingEmails.has(p.email));
      console.log(`  ${newProspects.length} new after dedup`);

      if (newProspects.length === 0) continue;

      // Step 5: Insert into call_list_prospects
      const batchId = `prospeo-${new Date().toISOString().slice(0, 10)}`;
      const rows = newProspects.map((p) => ({
        first_name: p.first_name,
        last_name: p.last_name,
        email: p.email,
        company: p.company,
        phone: p.phone,
        title: p.title,
        status: "pending",
        batch_id: batchId,
        source: "prospeo-pipeline",
        uploaded_by: "prospeo-auto",
      }));

      const { data: inserted, error: insertErr } = await supabase
        .from("call_list_prospects")
        .insert(rows)
        .select();

      if (insertErr) {
        console.error("Insert error:", insertErr);
      } else {
        const count = inserted?.length || 0;
        totalInserted += count;
        console.log(`  ✅ Inserted ${count} prospects`);
      }

      // Pause between search configs to respect rate limits
      await new Promise((r) => setTimeout(r, 500));
    }

    // Notify Slack
    await notifySlack(supabaseUrl, anonKey, totalSearched, totalEnriched, totalInserted, searchLabels);

    const result = {
      success: true,
      source: "prospeo",
      searched: totalSearched,
      enriched: totalEnriched,
      inserted: totalInserted,
      searches: searchLabels,
    };

    console.log("🎯 Prospeo pipeline result:", JSON.stringify(result));

    return new Response(JSON.stringify(result), { headers });
  } catch (error: unknown) {
    console.error("Prospeo pipeline error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    try {
      await notifySlack(supabaseUrl, anonKey, 0, 0, 0, [], errorMessage);
    } catch (_) { /* ignore */ }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers }
    );
  }
});

async function notifySlack(
  supabaseUrl: string,
  anonKey: string,
  searched: number,
  enriched: number,
  inserted: number,
  searches: string[],
  errorMsg?: string
) {
  try {
    const payload = errorMsg
      ? {
          eventType: "system_error",
          data: { function: "prospeo-pipeline", error: errorMsg },
        }
      : {
          eventType: "prospeo_pipeline_complete",
          channel: "mission-control",
          data: { searched, enriched, inserted, searches },
        };

    await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error("Slack notify failed:", e);
  }
}
