
-- Create meditation_products table for ready-to-buy meditations
CREATE TABLE public.meditation_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'mindset',
  price_zar INTEGER NOT NULL DEFAULT 297,
  duration TEXT,
  file_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.meditation_products ENABLE ROW LEVEL SECURITY;

-- Anyone can view active meditation products (public storefront)
CREATE POLICY "Anyone can view active meditation products"
ON public.meditation_products
FOR SELECT
USING (is_active = true);

-- Authenticated users can manage meditation products
CREATE POLICY "Authenticated users can manage meditation products"
ON public.meditation_products
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Trigger for updated_at
CREATE TRIGGER update_meditation_products_updated_at
BEFORE UPDATE ON public.meditation_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
