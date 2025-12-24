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
    <div className="min-h-screen bg-[#010205] flex items-center justify-center p-4 overflow-hidden select-none font-sans">
      
      {/* تأثير الضباب الخلفي الصافي */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative w-full max-w-[450px] animate-modal-appear">
        
        {/* الحواف النيونية العلوية والسفلية */}
        <div className="absolute -top-10 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_25px_#3b82f6,0_0_10px_#fff]" />
        <div className="absolute -bottom-10 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_25px_#3b82f6,0_0_10px_#fff]" />

        {/* الكارد الرئيسي الشفاف */}
        <div className="relative bg-black/40 backdrop-blur-3xl border-x border-blue-500/30 p-1">
          
          <div className="border border-white/10 p-4 sm:p-8">
            
            {/* 1. رأس الإشعار: علامة التعجب والنص داخل صناديق منفصلة */}
            <div className="flex items-center justify-center gap-2 mb-10">
              {/* صندوق علامة التعجب المربع المشع */}
              <div className="w-10 h-10 bg-black/80 border border-white/40 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                <span className="text-white font-black text-2xl drop-shadow-[0_0_15px_white]">!</span>
              </div>
              
              {/* صندوق كلمة NOTIFICATION */}
              <div className="h-10 px-6 bg-black/80 border border-white/40 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                <h2 className="text-white font-black tracking-[0.4em] italic text-sm sm:text-lg drop-shadow-[0_0_15px_white]">
                  NOTIFICATION
                </h2>
              </div>
            </div>

            <div className="flex flex-col items-center">
              {step === 'welcome' && (
                <div className="w-full text-center">
                  {/* النصوص بتوهج أبيض قوي جداً */}
                  <div className="space-y-4 mb-12">
                    <p className="text-white font-bold text-sm sm:text-lg drop-shadow-[0_0_12px_white]">
                      You have acquired the qualifications
                    </p>
                    <p className="text-white text-xl sm:text-2xl font-black leading-tight drop-shadow-[0_0_18px_white]">
                      to be a <span className="text-blue-400 italic drop-shadow-[0_0_25px_#3b82f6]">Player</span>.
                    </p>
                    <p className="text-white/60 italic text-[12px] drop-shadow-[0_0_8px_white]">Will you accept?</p>
                  </div>

                  {/* 2. الأزرار الشفافة بحواف مكسورة */}
                  <div className="flex flex-row gap-4 w-full px-2">
                    <button
                      onClick={handleAccept}
                      className="flex-1 py-3 bg-white/5 border border-white/40 text-white font-black italic text-sm sm:text-base hover:bg-white hover:text-black transition-all drop-shadow-[0_0_15px_white]"
                      style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
                    >
                      ACCEPT
                    </button>
                    <button
                      onClick={() => window.close()}
                      className="flex-1 py-3 bg-white/5 border border-white/20 text-white/40 font-black italic text-xs sm:text-sm hover:border-white hover:text-white transition-all"
                      style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
                    >
                      NOT ACCEPT
                    </button>
                  </div>
                </div>
              )}

              {step === 'name' && (
                <div className="w-full text-center">
                  <div className="inline-block px-4 py-1 bg-black/60 border border-white/20 mb-8 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    <h2 className="text-white font-black tracking-[0.2em] text-[10px] drop-shadow-[0_0_10px_white]">REGISTER PLAYER</h2>
                  </div>
                  
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="ENTER NAME..."
                    className="w-full bg-transparent border-b border-blue-500/50 py-2 text-center text-xl sm:text-3xl font-black text-white focus:outline-none focus:border-white transition-all placeholder:text-white/5 drop-shadow-[0_0_10px_white]"
                    autoFocus
                  />
                  
                  <button
                    onClick={handleStart}
                    disabled={!playerName.trim()}
                    className="mt-12 w-full max-w-[200px] py-3 bg-white/10 border border-white/60 text-white font-black text-lg italic hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] disabled:opacity-10"
                    style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 75%, 90% 100%, 0 100%, 0 25%)' }}
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
          animation: modal-appear 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
