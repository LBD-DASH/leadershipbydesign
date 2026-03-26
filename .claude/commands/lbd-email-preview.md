Preview what the next auto-outreach email would look like for a specific prospect.

Usage: /lbd-email-preview [company name or industry]

Simulate what Claude would generate by:
1. Read the auto-outreach system prompt from supabase/functions/auto-outreach/index.ts
2. Using the provided company/industry context, generate a sample cold email following the exact rules:
   - Under 80 words
   - Subject max 6 words, no company name
   - No banned words (impressive, remarkable, commitment, we, our programme)
   - First person "I", written as Kevin
   - CTA: offer the diagnostic
3. Show the email as Kevin would see it before it sends

This helps Kevin preview tone and quality without burning Resend sends.
