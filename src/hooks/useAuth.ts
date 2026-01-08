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

  const signInWithOtp = async (email: string, playerName: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // التعديل الجذري: نضع رابطاً وهمياً أو نلغيه بطريقة تجبر السيرفر على OTP
        // في بعض إصدارات Supabase، يجب أن تترك الخيارات فارغة تماماً لإرسال كود
        data: {
          player_name: playerName,
        },
        shouldCreateUser: true,
      },
    });
    return { error };
  };

  const verifyOtp = async (email: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      // التعديل: جرب استخدام 'signup' بدلاً من 'email' إذا كان المستخدم جديداً
      // أو اتركها 'email' إذا كنت قد غيرت الإعدادات في الداشبورد
      type: 'signup', 
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
