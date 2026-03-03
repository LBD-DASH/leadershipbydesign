import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
  const supabase = createClient(supabaseUrl, serviceKey);
  const headers = { ...corsHeaders, "Content-Type": "application/json" };

  if (!firecrawlKey) {
    return new Response(JSON.stringify({ error: "FIRECRAWL_API_KEY not configured" }), { status: 500, headers });
  }

  try {
    // Get prospects missing phone numbers
    const { data: prospects, error } = await supabase
      .from("call_list_prospects")
      .select("id, first_name, last_name, company, email, phone")
      .or("phone.is.null,phone.eq.")
      .limit(20); // Process in batches to avoid timeouts

    if (error) throw error;

    if (!prospects || prospects.length === 0) {
      return new Response(JSON.stringify({ success: true, enriched: 0, message: "All prospects already have phone numbers" }), { headers });
    }

    console.log(`Enriching ${prospects.length} prospects...`);

    let enriched = 0;
    const errors: string[] = [];

    for (const prospect of prospects) {
      try {
        const name = `${prospect.first_name} ${prospect.last_name || ""}`.trim();
        const company = prospect.company || "";

        if (!name || !company) continue;

        // Search for the person's contact details
        const searchQuery = `"${name}" "${company}" phone number email LinkedIn South Africa`;

        const searchResponse = await fetch("https://api.firecrawl.dev/v1/search", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${firecrawlKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: searchQuery,
            limit: 3,
          }),
        });

        const searchData = await searchResponse.json();

        if (!searchResponse.ok) {
          console.error(`Search failed for ${name}:`, searchData);
          errors.push(`${name}: search failed`);
          continue;
        }

        // Extract phone and email from search results
        const allText = (searchData.data || [])
          .map((r: any) => `${r.title || ""} ${r.description || ""} ${r.markdown || ""}`)
          .join(" ");

        // Phone patterns: SA (+27), local (0xx), international
        const phoneMatch = allText.match(
          /(?:\+27|0)[\s.-]?\d{2}[\s.-]?\d{3}[\s.-]?\d{4}/
        ) || allText.match(
          /(?:\+\d{1,3})[\s.-]?\(?\d{1,4}\)?[\s.-]?\d{2,4}[\s.-]?\d{2,4}[\s.-]?\d{0,4}/
        );

        // Email pattern
        const emailMatch = allText.match(
          /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
        );

        const updates: Record<string, string> = {};

        if (phoneMatch) {
          updates.phone = phoneMatch[0].trim();
        }

        // Only update email if current one looks like a company name (no @)
        if (emailMatch && prospect.email && !prospect.email.includes("@")) {
          updates.email = emailMatch[0].toLowerCase().trim();
        }

        if (Object.keys(updates).length > 0) {
          const { error: updateErr } = await supabase
            .from("call_list_prospects")
            .update(updates)
            .eq("id", prospect.id);

          if (updateErr) {
            errors.push(`${name}: update failed - ${updateErr.message}`);
          } else {
            enriched++;
            console.log(`✅ ${name}: ${JSON.stringify(updates)}`);
          }
        } else {
          console.log(`⚠️ ${name}: no contact info found`);
        }

        // Rate limit: small delay between requests
        await new Promise((r) => setTimeout(r, 1000));
      } catch (err: any) {
        errors.push(`${prospect.first_name}: ${err.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        enriched,
        processed: prospects.length,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { headers }
    );
  } catch (err: any) {
    console.error("Enrich error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
});
