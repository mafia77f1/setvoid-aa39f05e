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

  // دالة إرسال الكود الرقمي (OTP)
  const signInWithOtp = async (email: string, playerName: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // حذف الـ Redirect تماماً يجبر النظام على عدم إنشاء رابط
        emailRedirectTo: undefined, 
        data: {
          player_name: playerName,
        },
      },
    });

    return { error };
  };

  // دالة التحقق من الكود الرقمي (6 أرقام)
  const verifyOtp = async (email: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      // نغير النوع إلى 'email' ليتوافق مع نظام الأكواد الرقمية
      type: 'email', 
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
