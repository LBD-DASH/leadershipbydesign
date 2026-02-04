-- Life-OS Dashboard Database Schema

-- Create life_os_profiles table
CREATE TABLE public.life_os_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  display_name TEXT NOT NULL DEFAULT '',
  north_star_vision TEXT NOT NULL DEFAULT 'Define your North Star vision...',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create life_os_pillars table
CREATE TABLE public.life_os_pillars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  pillar_name TEXT NOT NULL CHECK (pillar_name IN ('Vitality', 'Sovereignty', 'Connection', 'Wisdom')),
  current_score INTEGER NOT NULL DEFAULT 50 CHECK (current_score >= 0 AND current_score <= 100),
  target_score INTEGER NOT NULL DEFAULT 100 CHECK (target_score >= 0 AND target_score <= 100),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, pillar_name)
);

-- Create life_os_habits table
CREATE TABLE public.life_os_habits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  pillar_id UUID NOT NULL REFERENCES public.life_os_pillars(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  frequency TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly')),
  streak_count INTEGER NOT NULL DEFAULT 0,
  last_completed_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create life_os_habit_logs table
CREATE TABLE public.life_os_habit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID NOT NULL REFERENCES public.life_os_habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT
);

-- Create life_os_focus_tasks table
CREATE TABLE public.life_os_focus_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Focus',
  is_current BOOLEAN NOT NULL DEFAULT false,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  target_minutes INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create life_os_mood_logs table
CREATE TABLE public.life_os_mood_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  energy_level INTEGER NOT NULL CHECK (energy_level >= 1 AND energy_level <= 10),
  flow_state TEXT,
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT
);

-- Create life_os_garden_slots table
CREATE TABLE public.life_os_garden_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  slot_name TEXT NOT NULL CHECK (slot_name IN ('Mind', 'Body', 'Soul', 'Impact')),
  growth_level INTEGER NOT NULL DEFAULT 0 CHECK (growth_level >= 0 AND growth_level <= 100),
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, slot_name)
);

-- Create life_os_vision_images table
CREATE TABLE public.life_os_vision_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.life_os_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.life_os_pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.life_os_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.life_os_habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.life_os_focus_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.life_os_mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.life_os_garden_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.life_os_vision_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for life_os_profiles
CREATE POLICY "Users can view own profile" ON public.life_os_profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own profile" ON public.life_os_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.life_os_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for life_os_pillars
CREATE POLICY "Users can view own pillars" ON public.life_os_pillars
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own pillars" ON public.life_os_pillars
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pillars" ON public.life_os_pillars
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for life_os_habits
CREATE POLICY "Users can view own habits" ON public.life_os_habits
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own habits" ON public.life_os_habits
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habits" ON public.life_os_habits
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habits" ON public.life_os_habits
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for life_os_habit_logs
CREATE POLICY "Users can view own habit logs" ON public.life_os_habit_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own habit logs" ON public.life_os_habit_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own habit logs" ON public.life_os_habit_logs
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for life_os_focus_tasks
CREATE POLICY "Users can view own focus tasks" ON public.life_os_focus_tasks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own focus tasks" ON public.life_os_focus_tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own focus tasks" ON public.life_os_focus_tasks
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own focus tasks" ON public.life_os_focus_tasks
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for life_os_mood_logs
CREATE POLICY "Users can view own mood logs" ON public.life_os_mood_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own mood logs" ON public.life_os_mood_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own mood logs" ON public.life_os_mood_logs
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for life_os_garden_slots
CREATE POLICY "Users can view own garden slots" ON public.life_os_garden_slots
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own garden slots" ON public.life_os_garden_slots
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own garden slots" ON public.life_os_garden_slots
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for life_os_vision_images
CREATE POLICY "Users can view own vision images" ON public.life_os_vision_images
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own vision images" ON public.life_os_vision_images
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vision images" ON public.life_os_vision_images
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own vision images" ON public.life_os_vision_images
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at triggers
CREATE TRIGGER update_life_os_profiles_updated_at
  BEFORE UPDATE ON public.life_os_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_life_os_pillars_updated_at
  BEFORE UPDATE ON public.life_os_pillars
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_life_os_garden_slots_updated_at
  BEFORE UPDATE ON public.life_os_garden_slots
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create vision-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('vision-images', 'vision-images', true);

-- Storage policies for vision-images bucket
CREATE POLICY "Users can view own vision images" ON storage.objects
  FOR SELECT USING (bucket_id = 'vision-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own vision images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'vision-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own vision images" ON storage.objects
  FOR DELETE USING (bucket_id = 'vision-images' AND auth.uid()::text = (storage.foldername(name))[1]);