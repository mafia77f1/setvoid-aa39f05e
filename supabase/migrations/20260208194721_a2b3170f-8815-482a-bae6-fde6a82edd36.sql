-- إنشاء جدول الملفات الشخصية
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL DEFAULT 'Hunter',
  player_id TEXT NOT NULL UNIQUE DEFAULT 'SV-' || UPPER(SUBSTRING(gen_random_uuid()::text, 1, 8)),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول حالة اللعبة
CREATE TABLE public.game_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  player_name TEXT DEFAULT 'Hunter',
  equipped_title TEXT,
  gold INTEGER DEFAULT 0,
  hp INTEGER DEFAULT 100,
  max_hp INTEGER DEFAULT 100,
  energy INTEGER DEFAULT 100,
  max_energy INTEGER DEFAULT 100,
  shadow_points INTEGER DEFAULT 0,
  game_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تفعيل RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_states ENABLE ROW LEVEL SECURITY;

-- سياسات الملفات الشخصية
CREATE POLICY "Users can view any profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- سياسات حالة اللعبة
CREATE POLICY "Users can view their own game state" 
ON public.game_states 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own game state" 
ON public.game_states 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game state" 
ON public.game_states 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- دالة تحديث التوقيت
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- تريجرز التحديث التلقائي
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_game_states_updated_at
BEFORE UPDATE ON public.game_states
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- دالة إنشاء ملف شخصي تلقائي عند التسجيل
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, player_name, player_id)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'player_name', 'Hunter'),
    'SV-' || UPPER(SUBSTRING(gen_random_uuid()::text, 1, 8))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- تريجر إنشاء الملف الشخصي
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- فهرس للبحث السريع
CREATE INDEX idx_profiles_player_id ON public.profiles(player_id);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_game_states_user_id ON public.game_states(user_id);