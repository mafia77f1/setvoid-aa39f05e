import { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useAuth } from '@/hooks/useAuth';
import { AlphaNoticeModal } from '@/components/AlphaNoticeModal';
import { toast } from '@/hooks/use-toast';
import { Mail, Loader2, CheckCircle, KeyRound } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useGameState();
  const { playClick, playLevelUp } = useSoundEffects();
  const { user, loading: authLoading, signInWithOtp, verifyOtp } = useAuth(); 
  const [step, setStep] = useState<'welcome' | 'name' | 'email' | 'verify_otp' | 'loading' | 'alpha'>('welcome');
  const [playerName, setPlayerName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // الحالة الجديدة للتحكم في الشاشة السوداء عند البداية
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1500); // 1.5 ثانية شاشة سوداء
    return () => clearTimeout(timer);
  }, []);

  // تعديل: الصوت يعمل الآن بالضبط مع بداية الأنميشن فور انتهاء الشاشة السوداء
  useLayoutEffect(() => {
    if (isInitialLoading || authLoading) return;

    const systemSound = new Audio('/SystemNotificationSound.wav');
    systemSound.preload = 'auto';
    
    // تشغيل الصوت فوراً عند تغير الـ step أو انتهاء التحميل الأولي
    const playPromise = systemSound.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // حماية في حال منع المتصفح التشغيل التلقائي
      });
    }

    return () => {
      systemSound.pause();
      systemSound.currentTime = 0;
    };
  }, [step, isInitialLoading, authLoading]);

  useEffect(() => {
    if (!authLoading && user) {
      const savedName = localStorage.getItem('pendingPlayerName');
      if (savedName) {
        setStep('alpha');
      } else {
        navigate('/');
      }
    }
  }, [user, authLoading, navigate]);

  const handleAccept = () => {
    playClick();
    setStep('name');
  };

  const handleDecline = () => {
    window.close();
  };

  const handleNameNext = () => {
    if (playerName.trim()) {
      playClick();
      setStep('email');
    }
  };

  const handleSendOtp = async () => {
    if (!email.trim() || !playerName.trim()) return;
    setIsSubmitting(true);
    const { error } = await signInWithOtp(email.trim(), playerName.trim());
    if (error) {
      toast({
        title: 'خطأ',
        description: error.message || 'حدث خطأ أثناء إرسال الكود',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }
    localStorage.setItem('pendingPlayerName', playerName.trim());
    playLevelUp();
    setStep('verify_otp');
    setIsSubmitting(false);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    setIsSubmitting(true);
    const { error } = await verifyOtp(email.trim(), otp);
    if (error) {
      toast({
        title: 'فشل التحقق',
        description: 'الكود غير صحيح أو انتهت صلاحيته',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }
  };

  const handleAlphaDismiss = () => {
    const savedName = localStorage.getItem('pendingPlayerName');
    if (savedName) {
      completeOnboarding(savedName);
      localStorage.removeItem('pendingPlayerName');
    }
    navigate('/');
  };

  // عرض شاشة سوداء خلال فترة الـ 1.5 ثانية أو أثناء التحميل الأصلي
  if (isInitialLoading || authLoading) {
    return (
      <div className="min-h-screen bg-[#010205] flex items-center justify-center transition-opacity duration-1000">
        {authLoading && <Loader2 className="w-8 h-8 animate-spin text-blue-500" />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010205] flex items-center justify-center p-2 overflow-hidden select-none font-sans">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      <div key={step} className="relative w-full max-w-[550px] animate-super-smooth-entry px-2">
        {/* الخطوط العلوية والسفلية المحسنة بأنيميشن تمدد */}
        <div className="absolute -top-6 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_25px_#3b82f6,0_0_10px_#fff] z-20 animate-line-expand" />
        <div className="absolute -bottom-6 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_25px_#3b82f6,0_0_10px_#fff] z-20 animate-line-expand" />

        <div className="relative border-x border-blue-500/30 bg-transparent backdrop-blur-2xl">
          <div className="bg-black/60 border border-blue-400/30 overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 88%, 96% 100%, 0 100%)' }}>
            <div className="bg-black/90 border-b border-white/5 py-3 flex items-center justify-center gap-3">
              <div className="w-6 h-6 border border-white/60 rounded-full flex items-center justify-center shadow-[0_0_8px_white]">
                <span className="text-white font-black text-xs">!</span>
              </div>
              <h2 className="text-white font-black tracking-[0.4em] italic text-sm sm:text-base drop-shadow-[0_0_10px_white]">NOTIFICATION</h2>
            </div>

            <div className="p-6 sm:p-10 flex flex-col items-center animate-content-fade">
              {step === 'welcome' && (
                <div className="w-full text-center">
                  <div className="space-y-4 mb-8">
                    <p className="text-white/90 text-sm sm:text-lg font-bold tracking-wide drop-shadow-[0_0_6px_white]">You have acquired the qualifications</p>
                    <p className="text-white text-xl sm:text-2xl font-black">to be a <span className="text-blue-400 italic drop-shadow-[0_0_20px_#3b82f6] underline decoration-blue-500 decoration-2 underline-offset-4 sm:underline-offset-6">Player</span>.</p>
                  </div>
                  <div className="flex flex-row gap-3 sm:gap-6 w-full max-w-sm mx-auto">
                    <button onClick={handleAccept} className="flex-1 py-2 bg-transparent border border-white/60 text-white font-black text-sm sm:text-lg italic hover:bg-white hover:text-black transition-all">ACCEPT</button>
                    <button onClick={handleDecline} className="flex-1 py-2 bg-transparent border border-white/10 text-white/30 font-black text-xs sm:text-base italic hover:border-white/40 hover:text-white transition-all">NOT ACCEPT</button>
                  </div>
                </div>
              )}

              {step === 'name' && (
                <div className="w-full text-center flex flex-col items-center">
                  <h2 className="text-white font-black tracking-[0.3em] text-xs sm:text-sm mb-6 drop-shadow-[0_0_10px_white]">CHARACTER REGISTRATION</h2>
                  <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="ENTER NAME..." className="w-full max-w-[250px] bg-transparent border-b border-blue-500/50 py-2 text-center text-xl font-black text-white focus:outline-none focus:border-white transition-all placeholder:text-white/5" />
                  <button onClick={handleNameNext} disabled={!playerName.trim()} className="mt-8 px-10 py-2 bg-white text-black font-black text-lg italic hover:bg-blue-500 hover:text-white transition-all">NEXT</button>
                </div>
              )}

              {step === 'email' && (
                <div className="w-full text-center flex flex-col items-center">
                  <Mail className="w-12 h-12 text-blue-400 mb-4 drop-shadow-[0_0_20px_#3b82f6]" />
                  <h2 className="text-white font-black tracking-[0.3em] text-xs sm:text-sm mb-2 drop-shadow-[0_0_10px_white]">SYSTEM VERIFICATION</h2>
                  <p className="text-white/60 text-xs sm:text-sm mb-6">أدخل بريدك الإلكتروني لتلقي رمز التحقق</p>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="w-full max-w-[300px] bg-transparent border-b border-blue-500/50 py-2 text-center text-lg font-medium text-white focus:outline-none focus:border-white transition-all" dir="ltr" />
                  <button onClick={handleSendOtp} disabled={!email.trim() || isSubmitting} className="mt-8 px-10 py-2 bg-white text-black font-black text-lg italic hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SEND CODE'}
                  </button>
                </div>
              )}

              {step === 'verify_otp' && (
                <div className="w-full text-center flex flex-col items-center">
                  <KeyRound className="w-12 h-12 text-blue-400 mb-4 drop-shadow-[0_0_20px_#3b82f6]" />
                  <h2 className="text-white font-black tracking-[0.3em] text-xs sm:text-sm mb-2 drop-shadow-[0_0_10px_white]">ENTER AUTHENTICATION CODE</h2>
                  <p className="text-white/60 text-xs sm:text-sm mb-6">تم إرسال الكود إلى {email}</p>
                  <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} maxLength={6} placeholder="000000" className="w-full max-w-[200px] bg-transparent border-b border-blue-500/50 py-2 text-center text-3xl tracking-[0.3em] font-black text-blue-400 focus:outline-none focus:border-white transition-all" dir="ltr" />
                  <button onClick={handleVerifyOtp} disabled={otp.length !== 6 || isSubmitting} className="mt-8 px-10 py-2 bg-white text-black font-black text-lg italic hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'VERIFY'}
                  </button>
                  <button onClick={() => setStep('email')} className="mt-4 text-white/40 text-xs hover:text-white transition-all">CHANGE EMAIL</button>
                </div>
              )}

              {step === 'alpha' && (
                <div className="w-full text-center flex flex-col items-center">
                  <CheckCircle className="w-16 h-16 text-blue-400 mb-4 drop-shadow-[0_0_20px_#3b82f6]" />
                  <h2 className="text-white font-black tracking-[0.3em] text-xs sm:text-sm mb-4">SYSTEM ACCESS GRANTED</h2>
                  <p className="text-white/60 text-xs italic mb-6">Initial synchronization complete</p>
                  <button onClick={handleAlphaDismiss} className="mt-8 px-10 py-2 bg-white text-black font-black text-lg italic hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_20px_white]">START SYSTEM</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* انميشن الفتح السينمائي المحترف */
        @keyframes super-smooth-entry {
          0% { transform: scaleY(0.005) scaleX(0.1); opacity: 0; filter: brightness(5); }
          40% { transform: scaleY(0.005) scaleX(1); opacity: 1; filter: brightness(2); }
          100% { transform: scaleY(1) scaleX(1); opacity: 1; filter: brightness(1); }
        }

        /* انميشن الخطوط المتوهجة */
        @keyframes line-expand {
          0% { width: 0%; left: 50%; opacity: 0; }
          40% { width: 0%; left: 50%; opacity: 1; }
          100% { width: 100%; left: 0%; opacity: 1; }
        }

        @keyframes content-fade-in { 
          0% { opacity: 0; transform: translateY(10px); filter: blur(5px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }

        .animate-super-smooth-entry { 
          animation: super-smooth-entry 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }

        .animate-line-expand {
          animation: line-expand 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-content-fade { 
          animation: content-fade-in 0.8s ease-out 1.1s both; 
        }
      `}</style>
      
      <AlphaNoticeModal show={step === 'alpha'} onDismiss={handleAlphaDismiss} />
    </div>
  );
};

export default Onboarding;
