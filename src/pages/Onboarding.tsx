import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useAuth } from '@/hooks/useAuth';
import { AlphaNoticeModal } from '@/components/AlphaNoticeModal';
import { toast } from '@/hooks/use-toast';
import { Mail, Loader2, CheckCircle } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useGameState();
  const { playClick, playLevelUp } = useSoundEffects();
  const { user, loading: authLoading, signInWithMagicLink } = useAuth();
  const [step, setStep] = useState<'welcome' | 'name' | 'email' | 'check_email' | 'loading' | 'alpha'>('welcome');
  const [playerName, setPlayerName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (!authLoading && user) {
      const savedName = localStorage.getItem('pendingPlayerName');
      if (savedName) {
        completeOnboarding(savedName);
        localStorage.removeItem('pendingPlayerName');
        setTimeout(() => {
          setStep('alpha');
        }, 100);
      } else {
        navigate('/');
      }
    }
  }, [user, authLoading, navigate, completeOnboarding]);

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

  const handleSendMagicLink = async () => {
    if (!email.trim() || !playerName.trim()) return;
    setIsSubmitting(true);
    const { error } = await signInWithMagicLink(email.trim(), playerName.trim());
    if (error) {
      console.error('Magic link error:', error);
      toast({
        title: 'خطأ',
        description: error.message || 'حدث خطأ أثناء إرسال الرابط',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }
    localStorage.setItem('pendingPlayerName', playerName.trim());
    playLevelUp();
    setStep('check_email');
    setIsSubmitting(false);
  };

  const handleAlphaDismiss = () => {
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#010205] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010205] flex items-center justify-center p-2 overflow-hidden select-none font-sans">
      
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      <div key={step} className="relative w-full max-w-[550px] animate-vertical-open px-2">
        <div className="absolute -top-6 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_20px_#3b82f6,0_0_10px_#fff] z-20" />
        <div className="absolute -bottom-6 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_20px_#3b82f6,0_0_10px_#fff] z-20" />

        <div className="relative border-x border-blue-500/30 bg-transparent backdrop-blur-2xl">
          <div 
            className="bg-black/60 border border-blue-400/30 overflow-hidden"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 88%, 96% 100%, 0 100%)' }}
          >
            <div className="bg-black/90 border-b border-white/5 py-3 flex items-center justify-center gap-3">
              <div className="w-6 h-6 border border-white/60 rounded-full flex items-center justify-center shadow-[0_0_8px_white]">
                <span className="text-white font-black text-xs">!</span>
              </div>
              <h2 className="text-white font-black tracking-[0.4em] italic text-sm sm:text-base drop-shadow-[0_0_10px_white]">
                NOTIFICATION
              </h2>
            </div>

            <div className="p-6 sm:p-10 flex flex-col items-center animate-content-fade">
              {step === 'welcome' && (
                <div className="w-full">
                  <div className="text-center space-y-4 mb-8">
                    <p className="text-white/90 text-sm sm:text-lg font-bold tracking-wide drop-shadow-[0_0_6px_white]">
                      You have acquired the qualifications
                    </p>
                    <p className="text-white text-xl sm:text-2xl font-black">
                      to be a <span className="text-blue-400 italic drop-shadow-[0_0_20px_#3b82f6] underline decoration-blue-500 decoration-2 underline-offset-4 sm:underline-offset-6">Player</span>.
                    </p>
                    
                    {/* مساحة نص الموافقة مع تأثير الخلل */}
                    <div className="relative min-h-[40px] flex items-center justify-center">
                      <p className="text-white/60 italic text-xs sm:text-sm drop-shadow-[0_0_5px_white] animate-fade-out-welcome absolute">
                        Will you accept?
                      </p>
                      <p className="text-white/80 italic text-xs sm:text-sm animate-glitch-text opacity-0 pointer-events-none">
                        Your heart will stop in <span className="text-red-500 font-bold drop-shadow-[0_0_10px_#ef4444]">0.02 seconds</span> if you choose not to Accept, will you Accept?
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row gap-3 sm:gap-6 w-full max-w-sm mx-auto">
                    <button
                      onClick={handleAccept}
                      className="flex-1 py-2 bg-transparent border border-white/60 text-white font-black text-sm sm:text-lg italic hover:bg-white hover:text-black transition-all drop-shadow-[0_0_10px_white]"
                    >
                      Yes
                    </button>
                    <button
                      onClick={handleDecline}
                      className="flex-1 py-2 bg-transparent border border-white/10 text-white/30 font-black text-xs sm:text-base italic hover:border-white/40 hover:text-white transition-all"
                    >
                      No
                    </button>
                  </div>
                </div>
              )}

              {step === 'name' && (
                <div className="w-full text-center flex flex-col items-center">
                  <h2 className="text-white font-black tracking-[0.3em] text-xs sm:text-sm mb-6 drop-shadow-[0_0_10px_white]">CHARACTER REGISTRATION</h2>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="ENTER NAME..."
                    className="w-full max-w-[250px] sm:max-w-sm bg-transparent border-b border-blue-500/50 py-2 text-center text-xl sm:text-2xl font-black text-white focus:outline-none focus:border-white transition-all placeholder:text-white/5"
                    autoFocus
                  />
                  <button
                    onClick={handleNameNext}
                    disabled={!playerName.trim()}
                    className="mt-8 px-10 py-2 bg-white text-black font-black text-lg italic hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_20px_white] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    NEXT
                  </button>
                </div>
              )}

              {step === 'email' && (
                <div className="w-full text-center flex flex-col items-center">
                  <Mail className="w-12 h-12 text-blue-400 mb-4 drop-shadow-[0_0_20px_#3b82f6]" />
                  <h2 className="text-white font-black tracking-[0.3em] text-xs sm:text-sm mb-2 drop-shadow-[0_0_10px_white]">SYSTEM VERIFICATION</h2>
                  <p className="text-white/60 text-xs sm:text-sm mb-6">
                    أدخل بريدك الإلكتروني لتلقي رابط التسجيل
                  </p>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full max-w-[300px] sm:max-w-sm bg-transparent border-b border-blue-500/50 py-2 text-center text-lg sm:text-xl font-medium text-white focus:outline-none focus:border-white transition-all placeholder:text-white/20"
                    autoFocus
                    dir="ltr"
                  />
                  <button
                    onClick={handleSendMagicLink}
                    disabled={!email.trim() || isSubmitting}
                    className="mt-8 px-10 py-2 bg-white text-black font-black text-lg italic hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_20px_white] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        SENDING...
                      </>
                    ) : (
                      'CONFIRM'
                    )}
                  </button>
                </div>
              )}

              {step === 'check_email' && (
                <div className="w-full text-center flex flex-col items-center">
                  <CheckCircle className="w-16 h-16 text-green-400 mb-4 drop-shadow-[0_0_20px_#22c55e]" />
                  <h2 className="text-white font-black tracking-[0.3em] text-xs sm:text-sm mb-4 drop-shadow-[0_0_10px_white]">LINK SENT</h2>
                  <p className="text-white/80 text-sm sm:text-base mb-2">تم إرسال رابط التسجيل إلى</p>
                  <p className="text-blue-400 font-bold text-lg mb-6" dir="ltr">{email}</p>
                  <p className="text-white/60 text-xs sm:text-sm">افتح بريدك الإلكتروني واضغط على الرابط للدخول</p>
                  <div className="mt-8 flex gap-4">
                    <button
                      onClick={() => setStep('email')}
                      className="px-6 py-2 bg-transparent border border-white/30 text-white/70 font-medium text-sm hover:border-white hover:text-white transition-all"
                    >
                      تغيير الإيميل
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes vertical-open {
          0% { transform: scaleY(0); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: scaleY(1); opacity: 1; }
        }

        @keyframes content-fade-in {
          0% { opacity: 0; transform: translateY(5px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-out {
          0% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; visibility: hidden; }
        }

        @keyframes glitch {
          0% { opacity: 0; transform: translate(0); }
          1% { opacity: 1; transform: translate(-2px, 2px); text-shadow: 2px 0 #ff0000, -2px 0 #00ffff; }
          2% { transform: translate(2px, -2px); text-shadow: -2px 0 #ff0000, 2px 0 #00ffff; }
          3% { transform: translate(0); text-shadow: none; }
          100% { opacity: 1; transform: translate(0); }
        }

        .animate-vertical-open {
          animation: vertical-open 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          transform-origin: center;
        }

        .animate-content-fade {
          animation: content-fade-in 0.6s ease-out 0.6s both;
        }

        .animate-fade-out-welcome {
          animation: fade-out 2.5s forwards;
        }

        .animate-glitch-text {
          animation: glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) 2.5s forwards;
        }
      `}</style>

      <AlphaNoticeModal show={step === 'alpha'} onDismiss={handleAlphaDismiss} />
    </div>
  );
};

export default Onboarding;
