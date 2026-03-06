import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Friendship {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface FriendProfile {
  friendship_id: string;
  user_id: string;
  player_name: string;
  player_id: string;
  avatar_url: string | null;
  status: string;
  is_sender: boolean;
}

export const useFriendships = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<FriendProfile[]>([]);
  const [pendingReceived, setPendingReceived] = useState<FriendProfile[]>([]);
  const [pendingSent, setPendingSent] = useState<FriendProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFriendships = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data: friendships, error } = await (supabase.from as any)('friendships')
      .select('*')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

    if (error) {
      console.error('Error fetching friendships:', error);
      setLoading(false);
      return;
    }

    if (!friendships || friendships.length === 0) {
      setFriends([]);
      setPendingReceived([]);
      setPendingSent([]);
      setLoading(false);
      return;
    }

    // Get all unique user IDs that aren't the current user
    const otherUserIds = friendships.map(f => 
      f.sender_id === user.id ? f.receiver_id : f.sender_id
    );

    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .in('user_id', otherUserIds);

    const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

    const mapped: FriendProfile[] = friendships.map(f => {
      const otherId = f.sender_id === user.id ? f.receiver_id : f.sender_id;
      const profile = profileMap.get(otherId);
      return {
        friendship_id: f.id,
        user_id: otherId,
        player_name: profile?.player_name || 'Unknown',
        player_id: profile?.player_id || '',
        avatar_url: profile?.avatar_url || null,
        status: f.status,
        is_sender: f.sender_id === user.id,
      };
    });

    setFriends(mapped.filter(f => f.status === 'accepted'));
    setPendingReceived(mapped.filter(f => f.status === 'pending' && !f.is_sender));
    setPendingSent(mapped.filter(f => f.status === 'pending' && f.is_sender));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchFriendships();
  }, [fetchFriendships]);

  const sendFriendRequest = async (receiverUserId: string) => {
    if (!user) return { error: new Error('Not authenticated') };
    if (receiverUserId === user.id) return { error: new Error('Cannot add yourself') };

    const { error } = await supabase.from('friendships').insert({
      sender_id: user.id,
      receiver_id: receiverUserId,
    });

    if (!error) await fetchFriendships();
    return { error };
  };

  const acceptRequest = async (friendshipId: string) => {
    const { error } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', friendshipId);

    if (!error) await fetchFriendships();
    return { error };
  };

  const rejectRequest = async (friendshipId: string) => {
    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('id', friendshipId);

    if (!error) await fetchFriendships();
    return { error };
  };

  const removeFriend = async (friendshipId: string) => {
    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('id', friendshipId);

    if (!error) await fetchFriendships();
    return { error };
  };

  const getFriendshipStatus = (otherUserId: string): 'none' | 'pending_sent' | 'pending_received' | 'accepted' => {
    if (!user) return 'none';
    const all = [...friends, ...pendingReceived, ...pendingSent];
    const found = all.find(f => f.user_id === otherUserId);
    if (!found) return 'none';
    if (found.status === 'accepted') return 'accepted';
    if (found.is_sender) return 'pending_sent';
    return 'pending_received';
  };

  return {
    friends,
    pendingReceived,
    pendingSent,
    loading,
    sendFriendRequest,
    acceptRequest,
    rejectRequest,
    removeFriend,
    getFriendshipStatus,
    refresh: fetchFriendships,
  };
};
