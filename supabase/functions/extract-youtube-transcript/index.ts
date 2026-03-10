// Native Deno.serve

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/").replace(/\n/g, " ");
}

const YT_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

async function fetchYouTubePage(videoId: string): Promise<string> {
  // Use consent cookie to bypass EU consent page
  const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: {
      ...YT_HEADERS,
      "Cookie": "CONSENT=YES+cb.20210420-15-p0.en+FX+634; SOCS=CAISNQgDEitib3FfaWRlbnRpdHlmcm9udGVuZHVpc2VydmVyXzIwMjMwODI5LjA3X3AxGgJlbiACGgYIgJnSmQY",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch YouTube page: ${response.status}`);
  }

  return await response.text();
}

interface VideoMeta {
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  publishedAt: string;
}

function extractMetadata(html: string, videoId: string): VideoMeta {
  const titleMatch = html.match(/<meta name="title" content="([^"]*)">/);
  const descMatch = html.match(/<meta name="description" content="([^"]*)">/);
  const durationMatch = html.match(/"lengthSeconds":"(\d+)"/);
  const publishMatch = html.match(/"publishDate":"([^"]+)"/);
  const thumbMatch = html.match(/"thumbnail":\{"thumbnails":\[.*?"url":"([^"]+)"/);

  const durationSeconds = durationMatch ? parseInt(durationMatch[1]) : 0;
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;

  return {
    title: titleMatch ? decodeHtmlEntities(titleMatch[1]) : "",
    description: descMatch ? decodeHtmlEntities(descMatch[1]) : "",
    thumbnail: thumbMatch ? thumbMatch[1] : `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    duration: durationSeconds > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : "",
    publishedAt: publishMatch ? publishMatch[1] : "",
  };
}

function extractCaptionTracksFromHtml(html: string): any[] {
  // Method 1: Look for captionTracks in ytInitialPlayerResponse
  const playerResponsePatterns = [
    /ytInitialPlayerResponse\s*=\s*(\{.+?\})\s*;\s*(?:var\s|<\/script)/s,
    /ytInitialPlayerResponse\s*=\s*(\{.+?\})\s*;/s,
  ];

  for (const pattern of playerResponsePatterns) {
    const match = html.match(pattern);
    if (match) {
      try {
        const data = JSON.parse(match[1]);
        const tracks = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
        if (tracks && tracks.length > 0) {
          return tracks;
        }
      } catch {
        // JSON parse failed, try next pattern
      }
    }
  }

  // Method 2: Extract captionTracks directly via regex
  const captionTracksMatch = html.match(/"captionTracks":\s*(\[.*?\])\s*,\s*"/);
  if (captionTracksMatch) {
    try {
      return JSON.parse(captionTracksMatch[1]);
    } catch {
      // Parse failed
    }
  }

  // Method 3: Find baseUrl for timedtext
  const baseUrlMatches = [...html.matchAll(/"baseUrl"\s*:\s*"(https?:[^"]*timedtext[^"]*)"/g)];
  if (baseUrlMatches.length > 0) {
    return baseUrlMatches.map((m) => ({
      baseUrl: m[1].replace(/\\u0026/g, "&").replace(/\\\//g, "/"),
      languageCode: "en",
    }));
  }

  return [];
}

async function fetchCaptionsFromUrl(baseUrl: string): Promise<string> {
  // Normalize URL - handle various escape patterns from YouTube HTML
  let url = baseUrl;
  // Handle unicode escapes
  url = url.replace(/\\u0026/g, "&");
  url = url.replace(/\\u002F/g, "/");
  url = url.replace(/\\\//g, "/");
  // Handle double-escaped
  url = url.replace(/\\\\u0026/g, "&");

  console.log(`Caption URL preview: ${url.substring(0, 120)}...`);

  const response = await fetch(url, {
    headers: {
      ...YT_HEADERS,
      "Cookie": "CONSENT=YES+cb.20210420-15-p0.en+FX+634; SOCS=CAISNQgDEitib3FfaWRlbnRpdHlmcm9udGVuZHVpc2VydmVyXzIwMjMwODI5LjA3X3AxGgJlbiACGgYIgJnSmQY",
    },
  });

  console.log(`Caption response: status=${response.status}, content-type=${response.headers.get("content-type")}`);

  if (!response.ok) {
    console.error(`Caption fetch failed: ${response.status}`);
    // Try with fmt=srv3
    const srv3Url = url.replace(/&fmt=[^&]*/, "") + "&fmt=srv3";
    const resp2 = await fetch(srv3Url, { headers: YT_HEADERS });
    if (!resp2.ok) return "";
    const text = await resp2.text();
    return parseXmlCaptions(text);
  }

  const text = await response.text();
  console.log(`Caption response body: ${text.length} chars, preview: ${text.substring(0, 200)}`);

  // Try JSON first
  if (text.startsWith("{")) {
    try {
      const json = JSON.parse(text);
      if (json.events) {
        return json.events
          .filter((e: any) => e.segs)
          .flatMap((e: any) => e.segs.map((s: any) => s.utf8 || ""))
          .join("").replace(/\n/g, " ").replace(/\s+/g, " ").trim();
      }
    } catch {}
  }

  // Try XML
  return parseXmlCaptions(text);
}

function parseXmlCaptions(text: string): string {
  const matches = text.matchAll(/<text[^>]*>([^<]*)<\/text>/g);
  const segments: string[] = [];
  for (const m of matches) {
    const decoded = decodeHtmlEntities(m[1]).trim();
    if (decoded) segments.push(decoded);
  }
  return segments.join(" ").replace(/\s+/g, " ").trim();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoUrl, manualTranscript } = await req.json();

    if (!videoUrl) throw new Error("Video URL is required");

    const videoId = extractVideoId(videoUrl);
    if (!videoId) throw new Error("Invalid YouTube URL format");

    console.log(`Processing video: ${videoId}`);

    // Fetch YouTube page with consent cookie
    const html = await fetchYouTubePage(videoId);
    console.log(`Page HTML length: ${html.length}`);

    // Check if we got a consent page
    if (html.includes("consent.youtube.com") || html.includes("CONSENT")) {
      console.log("WARNING: Got consent redirect page");
    }

    // Extract metadata
    const meta = extractMetadata(html, videoId);
    console.log(`Title: "${meta.title}", Duration: ${meta.duration}`);

    // If no title from page, try oEmbed
    if (!meta.title) {
      try {
        const oembed = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
        if (oembed.ok) {
          const data = await oembed.json();
          meta.title = data.title || "";
          meta.thumbnail = data.thumbnail_url || meta.thumbnail;
        }
      } catch {}
    }

    // Get transcript
    let transcript = manualTranscript || "";

    if (!transcript) {
      // Try to extract caption tracks from the page
      const captionTracks = extractCaptionTracksFromHtml(html);
      console.log(`Found ${captionTracks.length} caption track(s) in HTML`);

      if (captionTracks.length > 0) {
        // Prefer English manual, then English auto, then first
        let track = captionTracks.find((t: any) =>
          (t.languageCode === "en" || t.vssId?.includes(".en")) && t.kind !== "asr"
        );
        if (!track) {
          track = captionTracks.find((t: any) =>
            t.languageCode === "en" || t.vssId?.includes(".en") || t.vssId?.includes("a.en")
          );
        }
        if (!track) track = captionTracks[0];

        if (track.baseUrl) {
          transcript = await fetchCaptionsFromUrl(track.baseUrl);
          console.log(`Caption transcript: ${transcript.length} chars`);
        }
      }

      // Fallback: try direct timedtext API
      if (!transcript) {
        console.log("Trying direct timedtext API fallback...");
        const langs = ["en", "en-US", "en-GB"];
        for (const lang of langs) {
          const ttUrl = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${lang}&fmt=srv3`;
          try {
            const resp = await fetch(ttUrl, { headers: YT_HEADERS });
            if (resp.ok) {
              const text = await resp.text();
              const parsed = parseXmlCaptions(text);
              if (parsed.length > 50) {
                transcript = parsed;
                console.log(`Timedtext fallback succeeded: ${transcript.length} chars`);
                break;
              }
            }
          } catch {}
        }
      }

      // Fallback: try auto-generated captions via timedtext
      if (!transcript) {
        console.log("Trying auto-generated captions...");
        const ttUrl = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en&kind=asr&fmt=srv3`;
        try {
          const resp = await fetch(ttUrl, { headers: YT_HEADERS });
          if (resp.ok) {
            const text = await resp.text();
            transcript = parseXmlCaptions(text);
            if (transcript.length > 50) {
              console.log(`Auto-caption fallback succeeded: ${transcript.length} chars`);
            } else {
              transcript = "";
            }
          }
        } catch {}
      }
    }

    console.log(`Final result: title="${meta.title}", transcript=${transcript.length} chars`);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          videoId,
          title: meta.title,
          description: meta.description,
          thumbnail: meta.thumbnail,
          duration: meta.duration,
          publishedAt: meta.publishedAt,
          transcript,
        },
        hasTranscript: transcript.length > 0,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
