import { useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // دالة إرسال الكود إلى الإيميل المعدلة لإرسال OTP حصراً
  const signInWithOtp = async (email: string, playerName: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // حذف رابط التحويل يضمن عدم إرسال Magic Link
        emailRedirectTo: undefined,
        data: {
          player_name: playerName,
        },
      },
    });

    return { error };
  };

  // الدالة الجديدة للتحقق من الكود الرقمي (OTP)
  const verifyOtp = async (email: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'magiclink', 
    });
    
    if (data?.session) {
      setSession(data.session);
      setUser(data.session.user);
    }
    
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    loading,
    signInWithOtp,
    verifyOtp,
    signOut,
  };
};
