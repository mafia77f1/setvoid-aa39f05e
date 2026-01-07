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
    <div className="min-h-screen bg-[#010205] flex items-center justify-center p-2 overflow-hidden select-none font-sans tracking-tight">
      
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      <div key={step} className="relative w-full max-w-[550px] animate-vertical-open px-2">
        
        <div className="animate-card-glitch">
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
                <h2 className="text-white font-black tracking-[0.4em] italic text-sm sm:text-base text-glow-white">
                  NOTIFICATION
                </h2>
              </div>

              <div className="p-6 sm:p-10 flex flex-col items-center animate-content-fade">
                {step === 'welcome' && (
                  <div className="w-full">
                    <div className="relative text-center mb-10 h-28 flex items-center justify-center">
                      
                      <div className="animate-fade-out-complete absolute w-full space-y-4">
                        <p className="text-white/90 text-sm sm:text-lg font-bold tracking-widest text-glow-white uppercase">
                          You have acquired the qualifications
                        </p>
                        <p className="text-white text-2xl sm:text-3xl font-black italic tracking-tighter text-glow-white">
                          to be a <span className="text-blue-400 underline underline-offset-8 decoration-2 shadow-blue-500">Player</span>.
                        </p>
                        <p className="text-white/50 italic text-xs sm:text-sm tracking-widest uppercase">Will you accept?</p>
                      </div>

                      <div className="animate-fade-in-new opacity-0 absolute w-full px-2">
                        <p className="text-white/90 italic text-sm sm:text-lg leading-relaxed font-bold tracking-wide text-glow-white">
                          Your heart will stop in <span className="text-red-600 font-black drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]">0.02 seconds</span> if you choose not to Accept, <br/>will you Accept?
                        </p>
                      </div>

                    </div>

                    <div className="flex flex-row gap-3 sm:gap-6 w-full max-w-sm mx-auto">
                      <button
                        onClick={handleAccept}
                        className="flex-1 py-3 bg-transparent border border-white/60 text-white font-black text-sm sm:text-lg italic hover:bg-white hover:text-black transition-all text-glow-white hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                      >
                        ACCEPT
                      </button>
                      <button
                        onClick={handleDecline}
                        className="flex-1 py-3 bg-transparent border border-white/10 text-white/30 font-black text-xs sm:text-base italic hover:border-white/40 hover:text-white transition-all uppercase tracking-widest"
                      >
                        NOT ACCEPT
                      </button>
                    </div>
                  </div>
                )}

                {step === 'name' && (
                  <div className="w-full text-center flex flex-col items-center">
                    <h2 className="text-white font-black tracking-[0.3em] text-xs sm:text-sm mb-8 text-glow-white uppercase">CHARACTER REGISTRATION</h2>
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="ENTER NAME..."
                      className="w-full max-w-[250px] sm:max-w-sm bg-transparent border-b border-blue-500/50 py-3 text-center text-xl sm:text-3xl font-black text-white focus:outline-none focus:border-white transition-all placeholder:text-white/10 text-glow-white"
                      autoFocus
                    />
                    <button onClick={handleNameNext} disabled={!playerName.trim()} className="mt-10 px-12 py-3 bg-white text-black font-black text-lg italic hover:bg-blue-600 hover:text-white transition-all shadow-[0_0_25px_white] disabled:opacity-50">NEXT</button>
                  </div>
                )}
                
                {/* Email and Check Steps simplified for space, same glow applied */}
                {step === 'email' && (
                  <div className="w-full text-center flex flex-col items-center">
                    <Mail className="w-12 h-12 text-blue-400 mb-4 drop-shadow-[0_0_10px_#3b82f6]" />
                    <h2 className="text-white font-black tracking-[0.3em] text-xs sm:text-sm mb-4 text-glow-white">SYSTEM VERIFICATION</h2>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ENTER EMAIL..." className="w-full max-w-[300px] bg-transparent border-b border-blue-500/50 py-2 text-center text-white text-glow-white focus:outline-none" autoFocus dir="ltr" />
                    <button onClick={handleSendMagicLink} disabled={!email.trim() || isSubmitting} className="mt-8 px-12 py-3 bg-white text-black font-black text-lg italic"> {isSubmitting ? 'SENDING...' : 'CONFIRM'} </button>
                  </div>
                )}
                
                {step === 'check_email' && (
                  <div className="w-full text-center flex flex-col items-center">
                    <CheckCircle className="w-16 h-16 text-green-400 mb-6 drop-shadow-[0_0_15px_#22c55e]" />
                    <h2 className="text-white font-black tracking-[0.4em] text-xs sm:text-sm mb-4 text-glow-white uppercase">LINK DISPATCHED</h2>
                    <p className="text-blue-400 font-bold text-xl mb-8 tracking-tighter text-glow-blue">{email}</p>
                    <button onClick={() => setStep('email')} className="px-8 py-2 border border-white/20 text-white/50 text-xs hover:text-white hover:border-white transition-all uppercase tracking-widest">Change Email</button>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .text-glow-white {
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.5), 0 0 15px rgba(255, 255, 255, 0.3);
        }
        
        .text-glow-blue {
          text-shadow: 0 0 10px rgba(59, 130, 246, 0.6);
        }

        @keyframes vertical-open {
          0% { transform: scaleY(0); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: scaleY(1); opacity: 1; }
        }

        @keyframes card-glitch {
          0%, 85%, 100% { transform: translate(0); filter: none; }
          86% { transform: translate(-5px, 2px) skewX(5deg); filter: hue-rotate(90deg) brightness(1.4); }
          88% { transform: translate(5px, -2px) skewX(-5deg); filter: hue-rotate(-90deg) brightness(1.4); }
          90% { transform: translate(-2px, -1px); filter: contrast(1.2); }
        }

        @keyframes fade-out-complete {
          0% { opacity: 1; filter: blur(0); }
          100% { opacity: 0; transform: scale(0.96); filter: blur(4px); visibility: hidden; }
        }

        @keyframes fade-in-simple {
          0% { opacity: 0; transform: translateY(5px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-vertical-open {
          animation: vertical-open 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          transform-origin: center;
        }

        .animate-card-glitch {
          animation: card-glitch 0.4s ease-in-out 2.5s forwards;
        }

        .animate-content-fade {
          animation: fade-in-simple 0.7s ease-out 0.6s both;
        }

        .animate-fade-out-complete {
          animation: fade-out-complete 0.5s ease-in 2.5s forwards;
        }

        .animate-fade-in-new {
          animation: fade-in-simple 0.6s ease-out 2.9s forwards;
        }
      `}</style>

      <AlphaNoticeModal show={step === 'alpha'} onDismiss={handleAlphaDismiss} />
    </div>
  );
};

export default Onboarding;
