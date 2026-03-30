
CREATE TABLE public.budget_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  account_type TEXT NOT NULL DEFAULT 'business' CHECK (account_type IN ('business', 'personal')),
  transaction_type TEXT NOT NULL DEFAULT 'expense' CHECK (transaction_type IN ('income', 'expense')),
  category TEXT NOT NULL,
  subcategory TEXT,
  description TEXT,
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'ZAR',
  notes TEXT,
  source TEXT DEFAULT 'manual',
  batch_id TEXT
);

ALTER TABLE public.budget_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage budget transactions"
  ON public.budget_transactions
  FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE INDEX idx_budget_transactions_date ON public.budget_transactions(transaction_date);
CREATE INDEX idx_budget_transactions_account ON public.budget_transactions(account_type);
