import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';

const Onboarding = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useGameState();
  const { playClick, playLevelUp } = useSoundEffects();
  const [step, setStep] = useState<'welcome' | 'name' | 'loading'>('welcome');
  const [playerName, setPlayerName] = useState('');

  const handleAccept = () => {
    playClick();
    setStep('name');
  };

  const handleDecline = () => {
    window.close();
  };

  const handleStart = () => {
    if (playerName.trim()) {
      playLevelUp();
      setStep('loading');
      setTimeout(() => {
        completeOnboarding(playerName.trim());
        navigate('/');
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#020308] flex items-center justify-center p-2 sm:p-4 overflow-hidden select-none">
      
      {/* الخلفية الأساسية للموقع (سوداء سادة لتركيز النظر على الكارد) */}
      <div className="fixed inset-0 pointer-events-none bg-black" />

      {/* الحاوية الرئيسية */}
      <div className="relative w-full max-w-[650px] animate-modal-appear px-4">
        
        {/* الحواف النيونية (أعلى وأسفل) */}
        <div className="absolute -top-8 left-0 right-0 h-[2px] bg-cyan-500 shadow-[0_0_25px_#22d3ee,0_0_10px_#fff] z-30" />
        <div className="absolute -bottom-8 left-0 right-0 h-[2px] bg-cyan-500 shadow-[0_0_25px_#22d3ee,0_0_10px_#fff] z-30" />

        {/* 1. الكارد الخارجي (الذي يحتوي على الضباب والتأثيرات) */}
        <div className="relative p-[10px] sm:p-[15px] bg-cyan-500/10 backdrop-blur-3xl border-x border-cyan-500/30 overflow-hidden shadow-[0_0_50px_rgba(0,180,255,0.15)]">
          
          {/* تأثير الضباب والحبيبات (Grainy Fog) داخل الكارد الخارجي فقط */}
          <div className="absolute inset-0 opacity-40 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 animate-pulse" />

          {/* 2. الكارد الداخلي (المحتوى) - شفاف تماماً لامتصاص ضباب الكارد الخارجي */}
          <div 
            className="relative z-10 bg-black/70 border border-white/10 overflow-hidden"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 88%, 96% 100%, 0 100%)' }}
          >
            
            {/* عنوان الإشعار - NOTIFICATION */}
            <div className="bg-black/80 border-b border-white/5 py-3 sm:py-4 flex items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-white/60 rounded-full flex items-center justify-center shadow-[0_0_15px_white]">
                <span className="text-white font-black text-lg">!</span>
              </div>
              <h2 className="text-white font-black tracking-[0.5em] italic text-lg sm:text-xl drop-shadow-[0_0_15px_white]">
                NOTIFICATION
              </h2>
            </div>

            <div className="p-8 sm:p-14 flex flex-col items-center">
              {step === 'welcome' && (
                <div className="w-full text-center">
                  <div className="space-y-6 mb-12">
                    <p className="text-white/90 text-sm sm:text-xl font-bold tracking-wide drop-shadow-[0_0_8px_white]">
                      You have acquired the qualifications
                    </p>
                    <p className="text-white text-2xl sm:text-3xl font-black">
                      to be a <span className="text-cyan-400 italic drop-shadow-[0_0_25px_#22d3ee] underline decoration-cyan-500 decoration-2 underline-offset-8">Player</span>.
                    </p>
                    <p className="text-white/60 italic text-sm sm:text-lg pt-2 drop-shadow-[0_0_5px_white]">
                      Will you accept?
                    </p>
                  </div>

                  <div className="flex flex-row gap-4 sm:gap-8 w-full max-w-md mx-auto">
                    <button
                      onClick={handleAccept}
                      className="flex-1 py-3 bg-transparent border-2 border-white/70 text-white font-black text-lg sm:text-xl italic hover:bg-white hover:text-black transition-all drop-shadow-[0_0_15px_white]"
                    >
                      ACCEPT
                    </button>
                    <button
                      onClick={handleDecline}
                      className="flex-1 py-3 bg-transparent border border-white/10 text-white/30 font-black text-base sm:text-lg italic hover:border-white/40 hover:text-white transition-all"
                    >
                      NOT ACCEPT
                    </button>
                  </div>
                </div>
              )}

              {step === 'name' && (
                <div className="w-full text-center flex flex-col items-center">
                  <h2 className="text-white font-black tracking-[0.4em] text-sm sm:text-lg mb-8 drop-shadow-[0_0_12px_white]">CHARACTER REGISTRATION</h2>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="ENTER NAME..."
                    className="w-full max-w-sm bg-transparent border-b-2 border-cyan-500/50 py-3 text-center text-2xl sm:text-3xl font-black text-white focus:outline-none focus:border-white transition-all placeholder:text-white/5"
                    autoFocus
                  />
                  <button
                    onClick={handleStart}
                    disabled={!playerName.trim()}
                    className="mt-12 px-14 py-4 bg-white text-black font-black text-xl sm:text-2xl italic hover:bg-cyan-500 hover:text-white transition-all shadow-[0_0_30px_white]"
                  >
                    CONFIRM
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modal-appear {
          from { opacity: 0; transform: scale(1.05); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-modal-appear {
          animation: modal-appear 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
