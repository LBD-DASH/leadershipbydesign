
-- Create product_purchases table for tracking digital product sales
CREATE TABLE public.product_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  product_name TEXT NOT NULL,
  amount_zar INTEGER NOT NULL DEFAULT 0,
  payment_reference TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  upsell_shown TEXT,
  upsell_converted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_purchases ENABLE ROW LEVEL SECURITY;

-- Public INSERT for anonymous checkout
CREATE POLICY "Anyone can record a purchase"
  ON public.product_purchases
  FOR INSERT
  WITH CHECK (true);

-- Authenticated SELECT for admin dashboard
CREATE POLICY "Authenticated users can view purchases"
  ON public.product_purchases
  FOR SELECT
  USING (auth.role() = 'authenticated'::text);

-- Authenticated UPDATE for funnel tracking
CREATE POLICY "Authenticated users can update purchases"
  ON public.product_purchases
  FOR UPDATE
  USING (auth.role() = 'authenticated'::text)
  WITH CHECK (auth.role() = 'authenticated'::text);
