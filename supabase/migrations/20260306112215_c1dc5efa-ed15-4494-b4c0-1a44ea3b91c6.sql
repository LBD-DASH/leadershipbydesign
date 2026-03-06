
CREATE TABLE public.admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value text NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read admin settings" ON public.admin_settings FOR SELECT USING (true);
CREATE POLICY "Service role can manage admin settings" ON public.admin_settings FOR ALL USING (true) WITH CHECK (true);

INSERT INTO public.admin_settings (setting_key, setting_value) VALUES
  ('booking_link', 'https://calendar.google.com/calendar/appointments/schedules/');
