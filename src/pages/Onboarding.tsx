Import { useState } from 'react';
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
    <div className="min-h-screen bg-[#010205] flex items-center justify-center p-2 overflow-hidden select-none font-sans">
      
      {/* خلفية الضباب الأزرق */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      {/* الحاوية الرئيسية - عريضة ومصغرة */}
      <div className="relative w-full max-w-[550px] animate-modal-appear px-2">
        
        {/* الحواف النيونية (أعلى وأسفل) ممتدة بالعرض */}
        <div className="absolute -top-6 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_20px_#3b82f6,0_0_10px_#fff] z-20" />
        <div className="absolute -bottom-6 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_20px_#3b82f6,0_0_10px_#fff] z-20" />

        {/* الكارد الخارجي العريض */}
        <div className="relative border-x border-blue-500/30 bg-transparent backdrop-blur-2xl">
          
          {/* الكارد الداخلي الشفاف مع الحافة المكسورة */}
          <div 
            className="bg-black/60 border border-blue-400/30 overflow-hidden"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 88%, 96% 100%, 0 100%)' }}
          >
            
            {/* عنوان الإشعار المصغر - NOTIFICATION */}
            <div className="bg-black/90 border-b border-white/5 py-3 flex items-center justify-center gap-3">
              <div className="w-6 h-6 border border-white/60 rounded-full flex items-center justify-center shadow-[0_0_8px_white]">
                <span className="text-white font-black text-xs">!</span>
              </div>
              <h2 className="text-white font-black tracking-[0.4em] italic text-sm sm:text-base drop-shadow-[0_0_10px_white]">
                NOTIFICATION
              </h2>
            </div>

            <div className="p-6 sm:p-10 flex flex-col items-center">
              {step === 'welcome' && (
                <div className="w-full">
                  {/* نصوص بتوهج صافي وحجم أصغر */}
                  <div className="text-center space-y-4 mb-8">
                    <p className="text-white/90 text-sm sm:text-lg font-bold tracking-wide drop-shadow-[0_0_6px_white]">
                      You have acquired the qualifications
                    </p>
                    <p className="text-white text-xl sm:text-2xl font-black">
                      to be a <span className="text-blue-400 italic drop-shadow-[0_0_20px_#3b82f6] underline decoration-blue-500 decoration-2 underline-offset-4 sm:underline-offset-6">Player</span>.
                    </p>
                    <p className="text-white/60 italic text-xs sm:text-sm drop-shadow-[0_0_5px_white]">
                      Will you accept?
                    </p>
                  </div>

                  {/* أزرار بالعرض دائماً حتى في الموبايل */}
                  <div className="flex flex-row gap-3 sm:gap-6 w-full max-w-sm mx-auto">
                    <button
                      onClick={handleAccept}
                      className="flex-1 py-2 bg-transparent border border-white/60 text-white font-black text-sm sm:text-lg italic hover:bg-white hover:text-black transition-all drop-shadow-[0_0_10px_white]"
                    >
                      ACCEPT
                    </button>
                    <button
                      onClick={handleDecline}
                      className="flex-1 py-2 bg-transparent border border-white/10 text-white/30 font-black text-xs sm:text-base italic hover:border-white/40 hover:text-white transition-all"
                    >
                      NOT ACCEPT
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
                    onClick={handleStart}
                    disabled={!playerName.trim()}
                    className="mt-8 px-10 py-2 bg-white text-black font-black text-lg italic hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_20px_white]"
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
          animation: modal-appear 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
