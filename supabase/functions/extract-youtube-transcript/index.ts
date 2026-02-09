import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface YouTubeVideoInfo {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  publishedAt: string;
  transcript: string;
}

// Extract video ID from various YouTube URL formats
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

// Fetch video metadata using YouTube oEmbed (no API key needed)
async function fetchVideoMetadata(videoId: string): Promise<Partial<YouTubeVideoInfo>> {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oembedUrl);
    
    if (!response.ok) {
      console.error("oEmbed fetch failed:", response.status);
      return { videoId };
    }
    
    const data = await response.json();
    return {
      videoId,
      title: data.title || "",
      thumbnail: data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    };
  } catch (error) {
    console.error("Error fetching oEmbed:", error);
    return { videoId };
  }
}

// Fetch additional metadata from YouTube page
async function fetchPageMetadata(videoId: string): Promise<{ description: string; duration: string; publishedAt: string }> {
  try {
    const pageUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const response = await fetch(pageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    
    if (!response.ok) {
      return { description: "", duration: "", publishedAt: "" };
    }
    
    const html = await response.text();
    
    // Extract description from meta tag
    const descMatch = html.match(/<meta name="description" content="([^"]*)">/);
    const description = descMatch ? descMatch[1] : "";
    
    // Extract duration from structured data
    const durationMatch = html.match(/"lengthSeconds":"(\d+)"/);
    const durationSeconds = durationMatch ? parseInt(durationMatch[1]) : 0;
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = durationSeconds % 60;
    const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Extract publish date
    const publishMatch = html.match(/"publishDate":"([^"]+)"/);
    const publishedAt = publishMatch ? publishMatch[1] : "";
    
    return { description, duration, publishedAt };
  } catch (error) {
    console.error("Error fetching page metadata:", error);
    return { description: "", duration: "", publishedAt: "" };
  }
}

// Fetch transcript using YouTube's timedtext API
async function fetchTranscript(videoId: string): Promise<string> {
  try {
    // First, get the video page to find caption tracks
    const pageUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const response = await fetch(pageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch video page");
    }
    
    const html = await response.text();
    
    // Extract caption track URL from the page
    const captionMatch = html.match(/"captionTracks":\s*\[(.*?)\]/);
    if (!captionMatch) {
      // Try alternative method - look for timedtext in playerCaptionsTracklistRenderer
      const altMatch = html.match(/"playerCaptionsTracklistRenderer".*?"captionTracks":\s*\[(.*?)\]/s);
      if (!altMatch) {
        console.log("No captions found for video");
        return "";
      }
    }
    
    // Parse caption tracks to find English or auto-generated captions
    const captionsJson = captionMatch ? captionMatch[1] : "";
    
    // Look for baseUrl in the captions data
    const urlMatch = captionsJson.match(/"baseUrl":\s*"([^"]+)"/);
    if (!urlMatch) {
      // Try to extract from the full page content
      const fullUrlMatch = html.match(/timedtext[^"]*v=${videoId}[^"]*/);
      if (!fullUrlMatch) {
        console.log("Could not extract caption URL");
        return "";
      }
    }
    
    let captionUrl = urlMatch ? urlMatch[1].replace(/\\u0026/g, "&") : "";
    
    if (!captionUrl) {
      // Construct a default caption URL
      captionUrl = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en&fmt=json3`;
    }
    
    // Fetch the captions
    const captionResponse = await fetch(captionUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    
    if (!captionResponse.ok) {
      // Try alternative format
      const altUrl = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en&fmt=srv3`;
      const altResponse = await fetch(altUrl);
      
      if (!altResponse.ok) {
        console.log("Could not fetch captions");
        return "";
      }
      
      const altText = await altResponse.text();
      // Parse XML format
      const textMatches = altText.matchAll(/<text[^>]*>([^<]*)<\/text>/g);
      const segments = [];
      for (const match of textMatches) {
        segments.push(decodeHtmlEntities(match[1]));
      }
      return segments.join(" ").trim();
    }
    
    const captionData = await captionResponse.json();
    
    // Extract text from JSON format
    if (captionData.events) {
      const segments = captionData.events
        .filter((event: any) => event.segs)
        .flatMap((event: any) => event.segs.map((seg: any) => seg.utf8 || ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      return segments;
    }
    
    return "";
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return "";
  }
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/\n/g, " ");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoUrl, manualTranscript } = await req.json();

    if (!videoUrl) {
      throw new Error("Video URL is required");
    }

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      throw new Error("Invalid YouTube URL format");
    }

    console.log(`Processing video: ${videoId}`);

    // Fetch metadata in parallel
    const [oembedData, pageData] = await Promise.all([
      fetchVideoMetadata(videoId),
      fetchPageMetadata(videoId),
    ]);

    // Use manual transcript if provided, otherwise try to fetch
    let transcript = manualTranscript || "";
    if (!transcript) {
      console.log("Attempting to fetch transcript...");
      transcript = await fetchTranscript(videoId);
    }

    const result: YouTubeVideoInfo = {
      videoId,
      title: oembedData.title || "",
      description: pageData.description,
      thumbnail: oembedData.thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      duration: pageData.duration,
      publishedAt: pageData.publishedAt,
      transcript,
    };

    console.log(`Extracted: title="${result.title}", transcript length=${result.transcript.length}`);

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
        hasTranscript: transcript.length > 0,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in extract-youtube-transcript:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
