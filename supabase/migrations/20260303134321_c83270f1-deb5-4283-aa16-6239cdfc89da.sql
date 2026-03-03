
-- Fix: Drop the overly permissive policy and keep only the admin one
DROP POLICY IF EXISTS "Service role can manage apollo tracking" ON public.apollo_sequence_tracking;
