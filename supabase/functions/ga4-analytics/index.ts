const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function getAccessToken(): Promise<string> {
  const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
  const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
  const refreshToken = Deno.env.get("GOOGLE_REFRESH_TOKEN");

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing Google OAuth credentials");
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Token refresh failed:", err);
    throw new Error(`Token refresh failed: ${res.status}`);
  }

  const { access_token } = await res.json();
  return access_token;
}

interface GA4Request {
  dateRange?: string; // "7d" | "14d" | "28d" | "90d"
  report?: string;    // "traffic" | "conversions" | "pages"
}

function getDateRange(range: string): { startDate: string; endDate: string } {
  const days = { "7d": 7, "14d": 14, "28d": 28, "90d": 90 }[range] || 28;
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);
  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
}

async function runReport(accessToken: string, propertyId: string, body: Record<string, unknown>) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("GA4 API error:", err);
    throw new Error(`GA4 API error: ${res.status}`);
  }

  return res.json();
}

function parseRows(response: any, dimNames: string[], metricNames: string[]) {
  if (!response.rows) return [];
  return response.rows.map((row: any) => {
    const obj: Record<string, string | number> = {};
    dimNames.forEach((name, i) => {
      obj[name] = row.dimensionValues?.[i]?.value || "";
    });
    metricNames.forEach((name, i) => {
      obj[name] = parseFloat(row.metricValues?.[i]?.value || "0");
    });
    return obj;
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const propertyId = Deno.env.get("GA4_PROPERTY_ID");
    if (!propertyId) throw new Error("GA4_PROPERTY_ID not configured");

    const { dateRange = "28d", report = "traffic" } = await req.json() as GA4Request;
    const { startDate, endDate } = getDateRange(dateRange);
    const accessToken = await getAccessToken();

    if (report === "traffic") {
      const [sourceReport, overviewReport] = await Promise.all([
        // Source/medium breakdown
        runReport(accessToken, propertyId, {
          dateRanges: [{ startDate, endDate }],
          dimensions: [
            { name: "sessionSource" },
            { name: "sessionMedium" },
          ],
          metrics: [
            { name: "sessions" },
            { name: "totalUsers" },
            { name: "newUsers" },
            { name: "conversions" },
            { name: "engagementRate" },
            { name: "bounceRate" },
          ],
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
          limit: 20,
        }),
        // Daily totals for sparkline
        runReport(accessToken, propertyId, {
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: "date" }],
          metrics: [
            { name: "sessions" },
            { name: "totalUsers" },
            { name: "conversions" },
          ],
          orderBys: [{ dimension: { dimensionName: "date" }, desc: false }],
        }),
      ]);

      const sources = parseRows(
        sourceReport,
        ["source", "medium"],
        ["sessions", "users", "newUsers", "conversions", "engagementRate", "bounceRate"]
      );

      const daily = parseRows(
        overviewReport,
        ["date"],
        ["sessions", "users", "conversions"]
      );

      return new Response(
        JSON.stringify({ sources, daily, dateRange, fetchedAt: new Date().toISOString() }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (report === "conversions") {
      const convReport = await runReport(accessToken, propertyId, {
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "eventName" }],
        metrics: [
          { name: "eventCount" },
          { name: "totalUsers" },
        ],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            inListFilter: {
              values: [
                "schedule_call_click",
                "contact_form_submit",
                "purchase_complete",
                "diagnostic_complete",
                "lead_magnet_download",
                "cta_click",
                "diagnostic_started",
                "booking_intent",
              ],
            },
          },
        },
        orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      });

      const events = parseRows(convReport, ["eventName"], ["eventCount", "users"]);

      return new Response(
        JSON.stringify({ events, dateRange, fetchedAt: new Date().toISOString() }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (report === "pages") {
      const pageReport = await runReport(accessToken, propertyId, {
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "pagePath" }],
        metrics: [
          { name: "screenPageViews" },
          { name: "totalUsers" },
          { name: "engagementRate" },
          { name: "conversions" },
        ],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 20,
      });

      const pages = parseRows(pageReport, ["pagePath"], ["pageViews", "users", "engagementRate", "conversions"]);

      return new Response(
        JSON.stringify({ pages, dateRange, fetchedAt: new Date().toISOString() }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    throw new Error(`Unknown report type: ${report}`);
  } catch (error) {
    console.error("ga4-analytics error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
