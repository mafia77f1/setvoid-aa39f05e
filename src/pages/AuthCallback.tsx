import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('جاري التحقق من حسابك...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash fragment from URL (Supabase sends tokens in hash)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');

        if (error) {
          setStatus('error');
          setMessage(errorDescription || 'حدث خطأ في التحقق');
          return;
        }

        if (accessToken && refreshToken) {
          // Set the session manually
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            setStatus('error');
            setMessage('فشل في تسجيل الدخول');
            return;
          }

          setStatus('success');
          setMessage('تم التحقق بنجاح! جاري التحويل...');

          // If on native platform, redirect to deep link
          if (Capacitor.isNativePlatform()) {
            window.location.href = `com.setvoid.app://auth?access_token=${accessToken}&refresh_token=${refreshToken}`;
          } else {
            // On web, navigate to home
            setTimeout(() => navigate('/', { replace: true }), 1500);
          }
        } else {
          // Try to get session from URL (alternative method)
          const { data, error: getError } = await supabase.auth.getSession();
          
          if (getError || !data.session) {
            setStatus('error');
            setMessage('لم يتم العثور على بيانات التحقق');
            return;
          }

          setStatus('success');
          setMessage('تم التحقق بنجاح! جاري التحويل...');
          setTimeout(() => navigate('/', { replace: true }), 1500);
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setStatus('error');
        setMessage('حدث خطأ غير متوقع');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#010205] flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        {status === 'loading' && (
          <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto" />
        )}
        {status === 'success' && (
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        )}
        {status === 'error' && (
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
        )}
        
        <p className="text-white text-xl font-medium">{message}</p>
        
        {status === 'error' && (
          <button
            onClick={() => navigate('/onboarding', { replace: true })}
            className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            العودة لتسجيل الدخول
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
