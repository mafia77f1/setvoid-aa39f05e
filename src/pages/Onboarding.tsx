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
    <div className="min-h-screen bg-[#02050a] flex items-center justify-center p-4 overflow-hidden select-none">
      
      {/* تأثير الضباب الأزرق الخلفي (Fog Effect) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-blue-900/10 blur-[150px] animate-pulse" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-40" />
      </div>

      <div className="relative w-full max-w-[420px] animate-modal-appear">
        
        {/* الحواف النيونية الجبارة (أعلى وأسفل فقط) */}
        <div className="absolute -top-12 left-[-10%] right-[-10%] h-[4px] bg-blue-500 shadow-[0_0_35px_#3b82f6,0_0_15px_#fff]" />
        <div className="absolute -bottom-12 left-[-10%] right-[-10%] h-[4px] bg-blue-500 shadow-[0_0_35px_#3b82f6,0_0_15px_#fff]" />

        {/* الكارد الخارجي القوي (متلاصق مع الداخلي) */}
        <div className="relative border-x border-blue-500/30 bg-blue-950/5 backdrop-blur-xl">
          
          {/* الكارد الداخلي الشفاف والمكسور الحواف */}
          <div 
            className="bg-black/40 border border-blue-400/40 relative overflow-hidden"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%)' }}
          >
            
            {/* عنوان التنبيه (NOTIFICATION) داخل كارد فرعي مظلل */}
            <div className="bg-black/90 border-b border-white/10 p-5 flex items-center justify-center gap-4">
              <div className="w-9 h-9 border-2 border-white/80 rounded-full flex items-center justify-center shadow-[0_0_10px_white]">
                <span className="text-white font-black text-xl">!</span>
              </div>
              <h2 className="text-white font-black tracking-[0.5em] italic text-xl drop-shadow-[0_0_15px_white]">
                NOTIFICATION
              </h2>
            </div>

            <div className="p-10 flex flex-col items-center">
              {step === 'welcome' && (
                <div className="w-full text-center">
                  <div className="space-y-8 mb-14">
                    <p className="text-white text-xl font-bold drop-shadow-[0_0_8px_white]">
                      You have acquired the qualifications
                    </p>
                    <p className="text-white text-3xl font-black">
                      to be a <span className="text-blue-400 italic drop-shadow-[0_0_20px_#3b82f6] underline decoration-blue-500 decoration-4 underline-offset-8">Player</span>.
                    </p>
                    <p className="text-white/50 italic text-lg drop-shadow-[0_0_5px_white]">
                      Will you accept?
                    </p>
                  </div>

                  {/* أزرار Accept / Not Accept بستايل Solo Leveling */}
                  <div className="flex flex-col gap-4 w-full">
                    <button
                      onClick={handleAccept}
                      className="w-full py-4 bg-transparent border-2 border-white/60 text-white font-black text-xl italic hover:bg-white hover:text-black transition-all drop-shadow-[0_0_15px_white]"
                    >
                      ACCEPT
                    </button>
                    <button
                      onClick={handleDecline}
                      className="w-full py-3 bg-transparent border border-white/10 text-white/30 font-black text-lg italic hover:text-white/60 transition-all"
                    >
                      NOT ACCEPT
                    </button>
                  </div>
                </div>
              )}

              {step === 'name' && (
                <div className="w-full text-center">
                  <h2 className="text-white font-black tracking-[0.3em] text-lg mb-10 drop-shadow-[0_0_10px_white]">CHARACTER REGISTRATION</h2>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="ENTER NAME..."
                    className="w-full bg-transparent border-b-2 border-blue-500/50 py-4 text-center text-3xl font-black text-white focus:outline-none focus:border-white transition-all placeholder:text-white/10"
                    autoFocus
                  />
                  <button
                    onClick={handleStart}
                    disabled={!playerName.trim()}
                    className="mt-14 w-full py-4 bg-white text-black font-black text-2xl italic hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_30px_white]"
                  >
                    CONFIRM
                  </button>
                </div>
              )}
            </div>

            {/* تأثير الخطوط السوداء الرقمية (Scanlines) */}
            <div className="absolute inset-0 pointer-events-none opacity-30 bg-[linear-gradient(rgba(0,0,0,1)_2px,transparent_2px)] bg-[size:100%_5px]" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modal-appear {
          from { opacity: 0; transform: scale(1.1); filter: blur(10px); }
          to { opacity: 1; transform: scale(1); filter: blur(0); }
        }
        .animate-modal-appear {
          animation: modal-appear 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
