DO $$ BEGIN
  EXECUTE 'DROP POLICY IF EXISTS "Authenticated users can view contact_form_submissions" ON contact_form_submissions';
EXCEPTION WHEN undefined_object THEN NULL;
END $$;

DO $$ BEGIN
  EXECUTE 'DROP POLICY IF EXISTS "Anyone can view contact submissions" ON contact_form_submissions';
EXCEPTION WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Admin can view contact submissions"
  ON contact_form_submissions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

DO $$ BEGIN
  EXECUTE 'DROP POLICY IF EXISTS "Anyone can insert cold call logs" ON cold_call_logs';
EXCEPTION WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Authenticated can insert call logs"
  ON cold_call_logs FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DO $$ BEGIN
  EXECUTE 'DROP POLICY IF EXISTS "Authenticated users can view cold_call_logs" ON cold_call_logs';
EXCEPTION WHEN undefined_object THEN NULL;
END $$;

DO $$ BEGIN
  EXECUTE 'DROP POLICY IF EXISTS "Anyone can view cold call logs" ON cold_call_logs';
EXCEPTION WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Admin can view call logs"
  ON cold_call_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'))
