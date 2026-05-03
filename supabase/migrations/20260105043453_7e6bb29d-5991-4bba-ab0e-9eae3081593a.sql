-- 1. تحديث جدول البروفايلات ليتطابق مع الـ GitHub
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL DEFAULT 'المحارب',
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. إنشاء جدول الإحصائيات (Stats) باستخدام user_id للربط
CREATE TABLE IF NOT EXISTS public.game_states (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  game_data JSONB NOT NULL DEFAULT '{
    "stats": {"str": 10, "agi": 10, "spr": 10, "int": 10},
    "abilities": [],
    "items": []
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. تفعيل الـ RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_states ENABLE ROW LEVEL SECURITY;

-- 4. الوظيفة التلقائية لإنشاء البروفايل (محدثة)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, player_name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data ->> 'player_name', 'المحارب'));
  
  INSERT INTO public.game_states (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$;

-- 5. إعادة بناء الـ Gates (البوابات)
CREATE TABLE IF NOT EXISTS public.gates (
    gate_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gate_name TEXT NOT NULL,
    open_time TIMESTAMPTZ NOT NULL,
    close_time TIMESTAMPTZ NOT NULL,
    active_players JSONB DEFAULT '[]'::jsonb
);
ALTER TABLE public.gates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view gates" ON public.gates FOR SELECT USING (true);
