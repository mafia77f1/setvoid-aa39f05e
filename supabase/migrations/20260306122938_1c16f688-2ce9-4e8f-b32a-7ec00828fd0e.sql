
-- Sequential player ID
CREATE SEQUENCE IF NOT EXISTS player_id_seq START 1;

-- Main profiles table with ALL game data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Identity
  player_name TEXT NOT NULL DEFAULT 'Hunter',
  player_id TEXT NOT NULL UNIQUE DEFAULT 'SV-' || nextval('player_id_seq'),
  avatar_url TEXT,
  discord_id TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  
  -- Level & Rank
  total_level INTEGER NOT NULL DEFAULT 1,
  player_title TEXT NOT NULL DEFAULT 'مبتدئ',
  equipped_title TEXT,
  player_job TEXT NOT NULL DEFAULT 'صياد',
  
  -- Resources
  gold INTEGER NOT NULL DEFAULT 0,
  hp INTEGER NOT NULL DEFAULT 100,
  max_hp INTEGER NOT NULL DEFAULT 100,
  energy INTEGER NOT NULL DEFAULT 100,
  max_energy INTEGER NOT NULL DEFAULT 100,
  shadow_points INTEGER NOT NULL DEFAULT 0,
  
  -- Stats (strength, mind, spirit, agility) with XP and levels
  stats JSONB NOT NULL DEFAULT '{"strength": 0, "mind": 0, "spirit": 0, "agility": 0}',
  levels JSONB NOT NULL DEFAULT '{"strength": 1, "mind": 1, "spirit": 1, "agility": 1}',
  
  -- Game content (JSONB for flexible nested data)
  quests JSONB NOT NULL DEFAULT '[]',
  current_boss JSONB,
  abilities JSONB NOT NULL DEFAULT '[]',
  achievements JSONB NOT NULL DEFAULT '[]',
  inventory JSONB NOT NULL DEFAULT '[]',
  equipment JSONB NOT NULL DEFAULT '[]',
  prayer_quests JSONB NOT NULL DEFAULT '[]',
  shadow_soldiers JSONB NOT NULL DEFAULT '[]',
  gates JSONB NOT NULL DEFAULT '[]',
  grand_quest JSONB,
  claimed_rewards JSONB NOT NULL DEFAULT '[]',
  
  -- Progress
  daily_stats JSONB NOT NULL DEFAULT '[]',
  total_quests_completed INTEGER NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_active_date TEXT,
  
  -- Punishment system
  punishment JSONB NOT NULL DEFAULT '{"active": false, "endTime": null, "monstersDefeated": 0, "currentWave": 0, "playerHpInPenalty": 100, "maxHpInPenalty": 100}',
  punishment_end_time TIMESTAMPTZ,
  missed_quests_count INTEGER NOT NULL DEFAULT 0,
  
  -- Settings
  selected_reciter TEXT NOT NULL DEFAULT 'ar.alafasy',
  sound_enabled BOOLEAN NOT NULL DEFAULT true,
  is_onboarded BOOLEAN NOT NULL DEFAULT false,
  
  -- Boss tracking
  last_boss_attack_time TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow reading other players' basic info (for search/friends)
CREATE POLICY "Users can read other profiles basic info"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
