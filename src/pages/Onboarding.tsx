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
    <div className="min-h-screen bg-[#010205] flex items-center justify-center p-4 overflow-hidden select-none">
      
      {/* خلفية ضبابية زرقاء عميقة بدون خطوط */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[500px] bg-blue-900/10 blur-[180px] rounded-full" />
      </div>

      <div className="relative w-full max-w-[650px] animate-modal-appear">
        
        {/* الحواف النيونية (أعلى وأسفل) ممتدة بالعرض */}
        <div className="absolute -top-10 left-[-5%] right-[-5%] h-[3px] bg-blue-500 shadow-[0_0_30px_#3b82f6,0_0_10px_#fff] z-20" />
        <div className="absolute -bottom-10 left-[-5%] right-[-5%] h-[3px] bg-blue-500 shadow-[0_0_30px_#3b82f6,0_0_10px_#fff] z-20" />

        {/* الكارد الخارجي العريض */}
        <div className="relative border-x border-blue-500/40 bg-transparent backdrop-blur-2xl">
          
          {/* الكارد الداخلي: شفاف تماماً، حواف حادة، وبدون أي تأثير شبكة */}
          <div 
            className="bg-black/50 border border-blue-400/30 overflow-hidden"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%)' }}
          >
            
            {/* عنوان الإشعار - NOTIFICATION */}
            <div className="bg-black/90 border-b border-white/5 py-4 flex items-center justify-center gap-4">
              <div className="w-8 h-8 border-2 border-white/70 rounded-full flex items-center justify-center shadow-[0_0_10px_white]">
                <span className="text-white font-black text-lg">!</span>
              </div>
              <h2 className="text-white font-black tracking-[0.6em] italic text-xl drop-shadow-[0_0_15px_white]">
                NOTIFICATION
              </h2>
            </div>

            <div className="p-12 flex flex-col items-center">
              {step === 'welcome' && (
                <div className="w-full">
                  {/* النصوص بتوهج صافي بدون تشويش */}
                  <div className="text-center space-y-6 mb-12">
                    <p className="text-white/90 text-xl font-bold tracking-wide drop-shadow-[0_0_8px_white]">
                      You have acquired the qualifications
                    </p>
                    <p className="text-white text-3xl font-black">
                      to be a <span className="text-blue-400 italic drop-shadow-[0_0_25px_#3b82f6] underline decoration-blue-500 decoration-2 underline-offset-8">Player</span>.
                    </p>
                    <p className="text-white/60 italic text-lg pt-4 drop-shadow-[0_0_5px_white]">
                      Will you accept?
                    </p>
                  </div>

                  {/* الأزرار جنب بعضها (Accept & Not Accept) */}
                  <div className="flex flex-row gap-6 w-full max-w-md mx-auto">
                    <button
                      onClick={handleAccept}
                      className="flex-1 py-3 bg-transparent border-2 border-white/70 text-white font-black text-xl italic hover:bg-white hover:text-black transition-all drop-shadow-[0_0_15px_white]"
                    >
                      ACCEPT
                    </button>
                    <button
                      onClick={handleDecline}
                      className="flex-1 py-3 bg-transparent border border-white/10 text-white/30 font-black text-lg italic hover:border-white/40 hover:text-white transition-all"
                    >
                      NOT ACCEPT
                    </button>
                  </div>
                </div>
              )}

              {step === 'name' && (
                <div className="w-full text-center flex flex-col items-center">
                  <h2 className="text-white font-black tracking-[0.4em] text-lg mb-8 drop-shadow-[0_0_10px_white]">CHARACTER REGISTRATION</h2>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="ENTER NAME..."
                    className="w-full max-w-sm bg-transparent border-b-2 border-blue-500/50 py-3 text-center text-3xl font-black text-white focus:outline-none focus:border-white transition-all placeholder:text-white/5"
                    autoFocus
                  />
                  <button
                    onClick={handleStart}
                    disabled={!playerName.trim()}
                    className="mt-12 px-16 py-4 bg-white text-black font-black text-2xl italic hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_30px_white]"
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
          animation: modal-appear 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
