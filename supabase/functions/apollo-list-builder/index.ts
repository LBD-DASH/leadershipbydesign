import { createClient } from "npm:@supabase/supabase-js@2";

// Apollo List Builder — builds targeted prospect lists from Apollo
// Runs weekly (Sunday 18:00 SAST) and logs to agent_activity_log

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const INDUSTRY_ROTATION = [
  ["Accounting", "Legal", "Staffing and Recruiting", "Human Resources", "Professional Training and Coaching"],
  ["Information Technology", "Computer Software", "Telecommunications", "Internet"],
  ["Manufacturing", "Industrial Automation", "Mechanical Engineering", "Electrical Engineering"],
  ["Retail", "Consumer Goods", "Food & Beverages", "Wholesale"],
  ["Hospital & Health Care", "Pharmaceuticals", "Medical Devices"],
  ["Construction", "Real Estate", "Architecture & Planning", "Civil Engineering"],
  ["Logistics and Supply Chain", "Transportation", "Mining & Metals", "Oil & Energy"],
  ["Media Production", "Marketing and Advertising", "Hospitality", "Leisure Travel & Tourism"],
];

const EXCLUDED_INDUSTRIES = [
  "financial services", "insurance", "banking", "education",
  "investment banking", "venture capital", "private equity",
  "fund management", "capital markets", "consulting", "management consulting",
];

const TITLES = [
  "HR Director", "Head of L&D", "Learning and Development Manager",
  "Talent Director", "HR Executive", "Chief People Officer", "CHRO",
  "Head of People", "Head of Human Resources", "COO", "HR Manager",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const apolloApiKey = Deno.env.get("APOLLO_API_KEY");
  const supabase = createClient(supabaseUrl, supabaseKey);
  const headers = { ...corsHeaders, "Content-Type": "application/json" };

  try {
    if (!apolloApiKey) throw new Error("APOLLO_API_KEY not configured");

    // Rotate through all industry groups, building a comprehensive list
    const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const startGroup = Math.floor(daysSinceEpoch / 3) % INDUSTRY_ROTATION.length;

    // Load existing emails for dedup
    const { data: existingRows } = await supabase
      .from("warm_outreach_queue")
      .select("contact_email")
      .not("contact_email", "is", null);
    const existingEmails = new Set(
      (existingRows || []).map((r: any) => r.contact_email?.toLowerCase().trim())
    );

    let totalAdded = 0;
    const groupsSearched: string[] = [];

    // Search 2 industry groups per run
    for (let i = 0; i < 2; i++) {
      const groupIdx = (startGroup + i) % INDUSTRY_ROTATION.length;
      const industries = INDUSTRY_ROTATION[groupIdx];
      groupsSearched.push(industries[0]);

      const res = await fetch("https://api.apollo.io/api/v1/mixed_people/api_search", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Api-Key": apolloApiKey },
        body: JSON.stringify({
          page: 1,
          per_page: 25,
          person_titles: TITLES,
          person_locations: ["South Africa"],
          organization_num_employees_ranges: ["1-10", "11-20", "21-50", "51-100", "101-200", "201-500"],
          q_keywords: industries.join(" OR "),
        }),
      });

      if (!res.ok) continue;
      const data = await res.json();
      const people = data.people || [];

      for (const p of people) {
        const email = (p.email || "").toLowerCase().trim();
        if (!email || !email.includes("@") || existingEmails.has(email)) continue;

        const orgIndustry = (p.organization?.industry || "").toLowerCase();
        if (EXCLUDED_INDUSTRIES.some(ex => orgIndustry.includes(ex))) continue;

        const { error } = await supabase.from("warm_outreach_queue").insert({
          company_name: p.organization?.name || "",
          company_website: p.organization?.website_url || null,
          contact_name: `${p.first_name || ""} ${p.last_name || ""}`.trim(),
          contact_email: email,
          contact_title: p.title || "",
          contact_phone: p.phone_numbers?.[0]?.sanitized_number || "",
          source_keyword: "apollo:list-builder",
          status: "pending",
          industry: orgIndustry || industries[0].toLowerCase(),
          score: 70,
        });

        if (!error) {
          totalAdded++;
          existingEmails.add(email);
        }
      }
    }

    // Log activity
    await supabase.from("agent_activity_log").insert({
      agent_name: "Apollo List Builder",
      agent_type: "outreach",
      status: "success",
      message: `Built list: ${totalAdded} new contacts from ${groupsSearched.join(", ")}`,
      items_processed: totalAdded,
    });

    return new Response(JSON.stringify({ success: true, added: totalAdded }), { headers });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    await supabase.from("agent_activity_log").insert({
      agent_name: "Apollo List Builder",
      agent_type: "outreach",
      status: "error",
      message: errMsg,
      items_processed: 0,
    });
    return new Response(JSON.stringify({ error: errMsg }), { status: 500, headers });
  }
});
