-- Add user-friendly columns to game_states (keep game_data as source of truth for now)
ALTER TABLE public.game_states
  ADD COLUMN IF NOT EXISTS player_name text,
  ADD COLUMN IF NOT EXISTS equipped_title text,
  ADD COLUMN IF NOT EXISTS gold integer,
  ADD COLUMN IF NOT EXISTS hp integer,
  ADD COLUMN IF NOT EXISTS max_hp integer,
  ADD COLUMN IF NOT EXISTS energy integer,
  ADD COLUMN IF NOT EXISTS max_energy integer,
  ADD COLUMN IF NOT EXISTS shadow_points integer;

-- Optional indexes for faster reads by user_id (commonly filtered)
CREATE INDEX IF NOT EXISTS idx_game_states_user_id ON public.game_states(user_id);

-- No RLS changes needed (existing policies already restrict by auth.uid() = user_id).