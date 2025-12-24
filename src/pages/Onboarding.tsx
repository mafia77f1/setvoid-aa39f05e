import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { cn } from '@/lib/utils';

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
    <div className="min-h-screen bg-[#010205] flex items-center justify-center p-2 sm:p-4 overflow-hidden select-none relative">
      
      {/* 1. تأثير الشبكة (Grid) المتطور في الخلفية بالكامل */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ 
             backgroundImage: `linear-gradient(to right, #0ea5e9 1px, transparent 1px), linear-gradient(to bottom, #0ea5e9 1px, transparent 1px)`,
             backgroundSize: '40px 40px',
             maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
           }} 
      />

      {/* 2. الضباب الأزرق المتوهج */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      {/* الحاوية الرئيسية */}
      <div className="relative z-10 w-[95%] sm:w-full max-w-[650px] animate-modal-appear">
        
        {/* الحواف النيونية الحادة */}
        <div className="absolute -top-6 sm:-top-8 left-[-1%] right-[-1%] h-[2px] bg-blue-400 shadow-[0_0_25px_#3b82f6,0_0_10px_#fff] z-30" />
        <div className="absolute -bottom-6 sm:-bottom-8 left-[-1%] right-[-1%] h-[2px] bg-blue-400 shadow-[0_0_25px_#3b82f6,0_0_10px_#fff] z-30" />

        <div className="relative border-x border-blue-500/40 bg-transparent backdrop-blur-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          
          {/* 3. تأثير "شباك" إضافي داخل الكارد نفسه ليعطيه طابعاً تقنياً */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

          <div 
            className="relative z-10 bg-black/60 border border-blue-400/20 overflow-hidden"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 88%, 96% 100%, 0 100%)' }}
          >
            
            {/* عنوان الإشعار - NOTIFICATION */}
            <div className="bg-black/95 border-b border-white/5 py-4 flex items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-white/60 rounded-full flex items-center justify-center shadow-[0_0_15px_white] animate-pulse">
                <span className="text-white font-black text-lg drop-shadow-[0_0_5px_white]">!</span>
              </div>
              <h2 className="text-white font-black tracking-[0.5em] italic text-lg sm:text-xl drop-shadow-[0_0_15px_white]">
                NOTIFICATION
              </h2>
            </div>

            <div className="p-8 sm:p-14 flex flex-col items-center relative">
              
              {step === 'welcome' && (
                <div className="w-full text-center">
                  <div className="space-y-6 mb-12">
                    <p className="text-white/90 text-sm sm:text-xl font-bold tracking-wide drop-shadow-[0_0_10px_white]">
                      You have acquired the qualifications
                    </p>
                    <p className="text-white text-2xl sm:text-4xl font-black leading-tight">
                      to be a <span className="text-blue-400 italic drop-shadow-[0_0_25px_#3b82f6] underline decoration-blue-500 decoration-2 underline-offset-8">Player</span>.
                    </p>
                    <p className="text-white/50 italic text-sm sm:text-lg pt-4 drop-shadow-[0_0_5px_white]">
                      Will you accept?
                    </p>
                  </div>

                  {/* الأزرار جنب بعضها */}
                  <div className="flex flex-row gap-4 sm:gap-8 w-full max-w-md mx-auto">
                    <button
                      onClick={handleAccept}
                      className="flex-1 py-3 bg-transparent border-2 border-white/70 text-white font-black text-lg sm:text-xl italic hover:bg-white hover:text-black transition-all drop-shadow-[0_0_15px_white] active:scale-95"
                    >
                      ACCEPT
                    </button>
                    <button
                      onClick={handleDecline}
                      className="flex-1 py-3 bg-transparent border border-white/10 text-white/30 font-black text-base sm:text-lg italic hover:border-white/40 hover:text-white transition-all active:scale-95"
                    >
                      NOT ACCEPT
                    </button>
                  </div>
                </div>
              )}

              {step === 'name' && (
                <div className="w-full text-center flex flex-col items-center">
                  <h2 className="text-white font-black tracking-[0.4em] text-sm sm:text-lg mb-8 drop-shadow-[0_0_12px_white]">IDENTITY VERIFICATION</h2>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="ENTER PLAYER NAME..."
                    className="w-full max-w-sm bg-transparent border-b-2 border-blue-500/50 py-3 text-center text-2xl sm:text-3xl font-black text-white focus:outline-none focus:border-white transition-all placeholder:text-white/5"
                    autoFocus
                  />
                  <button
                    onClick={handleStart}
                    disabled={!playerName.trim()}
                    className="mt-12 px-14 py-4 bg-white text-black font-black text-xl sm:text-2xl italic hover:bg-blue-400 hover:text-white transition-all shadow-[0_0_30px_white] active:scale-95"
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
          from { opacity: 0; transform: scale(1.05); filter: blur(10px); }
          to { opacity: 1; transform: scale(1); filter: blur(0); }
        }
        .animate-modal-appear {
          animation: modal-appear 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
