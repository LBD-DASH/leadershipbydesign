-- Add call_centre role to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'call_centre';
