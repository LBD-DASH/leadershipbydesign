
-- Table to store uploaded call list prospects
CREATE TABLE public.call_list_prospects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  first_name text NOT NULL DEFAULT '',
  last_name text DEFAULT '',
  email text DEFAULT '',
  company text DEFAULT '',
  phone text DEFAULT '',
  title text DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  called_at timestamp with time zone,
  call_outcome text,
  uploaded_by text,
  batch_id text
);

-- Enable RLS
ALTER TABLE public.call_list_prospects ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view (callers need to see the list)
CREATE POLICY "Authenticated users can view call list"
  ON public.call_list_prospects FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only via edge function (service role) for insert/update
CREATE POLICY "Service role can insert call list"
  ON public.call_list_prospects FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update call list"
  ON public.call_list_prospects FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete call list"
  ON public.call_list_prospects FOR DELETE
  USING (auth.role() = 'authenticated');
