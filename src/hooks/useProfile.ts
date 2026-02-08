import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Profile {
  id: string;
  user_id: string;
  player_name: string;
  player_id: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
        return;
      }

      // إذا لم يوجد ملف شخصي، ننشئ واحد (للمستخدمين القدامى)
      if (!data) {
        const newPlayerId = 'SV-' + user.id.substring(0, 8).toUpperCase();
        const playerName = user.user_metadata?.player_name || 'Hunter';
        
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            player_name: playerName,
            player_id: newPlayerId,
          })
          .select()
          .single();

        if (!insertError && newProfile) {
          setProfile(newProfile);
        }
      } else {
        setProfile(data);
      }
      
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (!error && data) {
      setProfile(data);
    }

    return { data, error };
  };

  return { profile, loading, updateProfile };
};
