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
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden select-none">
      
      {/* خلفية النظام - ضباب أزرق خافت جداً */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,100,255,0.05),transparent_80%)]" />
      </div>

      <div className="relative w-full max-w-[380px] animate-modal-appear">
        
        {/* الحواف النيونية الخارجية - حادة ومسطحة */}
        <div className="absolute -top-8 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_20px_#3b82f6]" />
        <div className="absolute -bottom-8 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_20px_#3b82f6]" />

        {/* الكارد الخارجي - حواف حادة جداً */}
        <div className="border border-blue-500/30 bg-blue-900/5 p-[1px] rounded-none">
          
          {/* الكارد الداخلي - شفاف تماماً + حواف حادة ومكسورة من الزوايا */}
          <div 
            className="bg-black/60 backdrop-blur-xl border border-blue-400/40 p-0 overflow-hidden"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 92% 100%, 0 100%)' }}
          >
            
            {/* منطقة العنوان (NOTIFICATION) - كارد داخلي بخطوط سوداء */}
            <div className="bg-black/80 border-b border-white/10 p-4 flex items-center justify-center gap-3">
              <div className="w-8 h-8 border border-white/60 rounded-full flex items-center justify-center">
                <span className="text-white font-bold drop-shadow-[0_0_8px_white]">!</span>
              </div>
              <h2 className="text-white font-black tracking-[0.5em] italic text-lg drop-shadow-[0_0_12px_white]">
                NOTIFICATION
              </h2>
            </div>

            <div className="p-8 flex flex-col items-center">
              {step === 'welcome' && (
                <div className="w-full text-center">
                  {/* الكلام المتوهج بالأبيض */}
                  <div className="space-y-6 mb-12">
                    <p className="text-white/90 text-lg font-bold drop-shadow-[0_0_5px_white]">
                      You have acquired the qualifications
                    </p>
                    <p className="text-white text-2xl font-black drop-shadow-[0_0_15px_white]">
                      to be a <span className="italic underline underline-offset-4">Player</span>.
                    </p>
                    <p className="text-white/60 italic text-sm pt-2">Will you accept?</p>
                  </div>

                  {/* أزرار سولو ليفلينج الحادة */}
                  <div className="flex gap-4">
                    <button
                      onClick={handleAccept}
                      className="flex-1 py-3 border border-white/50 text-white font-bold italic hover:bg-white hover:text-black transition-all drop-shadow-[0_0_10px_white]"
                    >
                      ACCEPT
                    </button>
                    <button
                      onClick={handleDecline}
                      className="flex-1 py-3 border border-white/10 text-white/30 font-bold italic hover:border-white/50 hover:text-white transition-all"
                    >
                      NOT ACCEPT
                    </button>
                  </div>
                </div>
              )}

              {step === 'name' && (
                <div className="w-full text-center py-4">
                  <h2 className="text-white font-black tracking-[0.2em] mb-8 drop-shadow-[0_0_10px_white]">IDENTITY VERIFICATION</h2>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="ENTER NAME..."
                    className="w-full bg-transparent border-b-2 border-white/20 py-2 text-center text-2xl font-black text-white focus:outline-none focus:border-white transition-all placeholder:text-white/10"
                    autoFocus
                  />
                  <button
                    onClick={handleStart}
                    disabled={!playerName.trim()}
                    className="mt-10 w-full py-4 bg-white text-black font-black italic hover:bg-transparent hover:text-white border border-white transition-all disabled:opacity-20"
                  >
                    CONFIRM
                  </button>
                </div>
              )}
            </div>

            {/* تأثير الخطوط السوداء الشفافة (Grid) */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(0,0,0,1)_1px,transparent_1px)] bg-[size:100%_4px]" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modal-appear {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-modal-appear {
          animation: modal-appear 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
