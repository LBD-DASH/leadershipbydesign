

# Fix Newsletter Contact System -- Two Root Cause Fixes

## What's Actually Broken

1. **CSV Import returns 409 for every contact** -- uses `insert` instead of `upsert`, so duplicate emails fail instead of merging
2. **Contacts tab shows nothing** -- RLS requires Supabase Auth for SELECT, but admin uses client-side token auth (anon key), so reads are silently blocked

## Fix 1: CSV Uploader -- Use Upsert Instead of Insert

**File**: `src/components/marketing/CSVUploader.tsx`

Change the batch insert to use `.upsert()` with `onConflict: 'email'` and `ignoreDuplicates: true`. This tells the database to skip rows where the email already exists instead of throwing a 409 error.

- Replace `.insert(rows)` with `.upsert(rows, { onConflict: 'email', ignoreDuplicates: true })`
- Remove the individual fallback loop (no longer needed since upsert handles conflicts)
- The upsert will insert new contacts and silently skip existing ones

## Fix 2: Contacts Tab -- Add Edge Function for Admin Reads

**Why the Contacts tab is empty**: The `SubscriberManager` component queries `email_subscribers` using the anon key. RLS only allows SELECT for `authenticated` users, but the admin isn't logged in via Supabase Auth -- they use a hardcoded token in sessionStorage. The anon key has no SELECT permission.

**Solution**: Create an `admin-subscribers` edge function (following the existing `admin-prospects` pattern) that:
- Accepts the admin token via `x-admin-token` header
- Validates it matches the master token
- Uses the service role key to query `email_subscribers` (bypasses RLS)
- Supports search, tag filtering, updates, and status toggles

**New file**: `supabase/functions/admin-subscribers/index.ts`
- GET: Fetch subscribers with optional `search` and `tag` query params
- PUT: Update subscriber name/company/tags
- PATCH: Toggle subscriber status (active/unsubscribed)

**Updated file**: `src/components/marketing/SubscriberManager.tsx`
- Replace direct Supabase client calls with `supabase.functions.invoke('admin-subscribers', ...)`
- Pass the admin token from sessionStorage in the request headers
- All CRUD operations go through the edge function

## Fix 3: Newsletter Composer Contact Count

**File**: `src/components/marketing/NewsletterComposer.tsx`

The composer also queries `email_subscribers` directly to get active contact counts and tags. Update it to use the same `admin-subscribers` edge function for the count query.

## Summary of Changes

| File | Change |
|------|--------|
| `src/components/marketing/CSVUploader.tsx` | Replace `insert` with `upsert` using `onConflict: 'email'` |
| `supabase/functions/admin-subscribers/index.ts` | New edge function for admin CRUD on subscribers |
| `src/components/marketing/SubscriberManager.tsx` | Route all queries through edge function |
| `src/components/marketing/NewsletterComposer.tsx` | Route count/tag queries through edge function |

## Why NOT a Full Rebuild

Your existing system already has:
- Subscriber database with proper schema
- Newsletter composer with rich text editor
- Send functionality via Resend
- Unsubscribe flow
- Tag-based segmentation
- Draft saving and scheduling
- CSV import UI
- Send history

It just has two bugs (insert vs upsert, and RLS blocking reads). Fixing those two issues makes everything work end-to-end.

