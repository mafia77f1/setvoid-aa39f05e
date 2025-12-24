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
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden font-sans select-none">
      
      {/* خلفية غامقة جداً مع توهج أزرق خافت */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,100,255,0.05),transparent_80%)]" />
      </div>

      <div className="relative w-full max-w-[360px] animate-modal-appear">
        
        {/* الحواف النيونية الخارجية - حادة جداً */}
        <div className="absolute -top-10 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_20px_#3b82f6]" />
        <div className="absolute -bottom-10 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_20px_#3b82f6]" />

        {/* الكارد الخارجي مع حواف متكسرة (Brutal Geometric Shape) */}
        <div 
          className="bg-blue-900/10 backdrop-blur-sm p-[2px]"
          style={{ clipPath: 'polygon(0 10%, 5% 0, 95% 0, 100% 10%, 100% 90%, 95% 100%, 5% 100%, 0 90%)' }}
        >
          
          {/* الكارد الداخلي الشفاف مع الحواف "الجبارة" */}
          <div 
            className="bg-black/60 backdrop-blur-xl p-6 border border-blue-500/30 relative"
            style={{ clipPath: 'polygon(0 12%, 6% 0, 94% 0, 100% 12%, 100% 88%, 94% 100%, 6% 100%, 0 88%)' }}
          >
            
            {/* تأثير الخطوط الرقمية السوداء الشفافة في الخلفية */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(rgba(0,0,0,0.8)_1px,transparent_1px)] bg-[size:100%_3px]" />

            {step === 'welcome' && (
              <div className="relative z-10 flex flex-col items-center">
                
                {/* كارد الأشعار الصغير (NOTIFICATION) */}
                <div className="w-full bg-black/40 border border-white/10 px-4 py-3 mb-8 flex items-center justify-center gap-3 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]">
                  <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center">
                    <span className="text-white font-bold text-lg drop-shadow-[0_0_5px_#fff]">!</span>
                  </div>
                  <h2 className="text-white font-black tracking-[0.3em] text-lg drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] italic">
                    NOTIFICATION
                  </h2>
                </div>

                {/* الكلام المتوهج بالأبيض بالكامل */}
                <div className="text-center space-y-4 mb-10">
                  <p className="text-white/90 text-[15px] font-bold tracking-tight drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                    You have acquired the qualifications
                  </p>
                  <p className="text-white text-xl font-black drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">
                    to be a <span className="italic border-b border-white">Player</span>.
                  </p>
                  <p className="text-white/70 text-sm italic drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
                    Will you accept?
                  </p>
                </div>

                {/* أزرار سولو ليفلينج الحادة */}
                <div className="flex gap-4 w-full">
                  <button
                    onClick={handleAccept}
                    className="flex-1 py-2 bg-transparent border border-white/40 text-white font-black italic hover:bg-white hover:text-black transition-all drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                  >
                    ACCEPT
                  </button>
                  <button
                    onClick={handleDecline}
                    className="flex-1 py-2 bg-transparent border border-white/10 text-white/40 font-black italic hover:border-white/40 hover:text-white transition-all"
                  >
                    NOT ACCEPT
                  </button>
                </div>
              </div>
            )}

            {/* باقي الخطوات (Name & Loading) تتبع نفس التنسيق الحاد */}
            {step === 'name' && (
              <div className="relative z-10 flex flex-col items-center py-6">
                <h2 className="text-white font-black tracking-[0.2em] text-sm mb-8 drop-shadow-[0_0_8px_white]">IDENTITY VERIFICATION</h2>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="NAME..."
                  className="w-full bg-transparent border-b-2 border-white/20 py-2 text-center text-2xl font-black text-white focus:outline-none focus:border-white transition-all placeholder:text-white/10"
                  autoFocus
                />
                <button
                  onClick={handleStart}
                  disabled={!playerName.trim()}
                  className="mt-10 w-full py-3 border border-white text-white font-black italic hover:bg-white hover:text-black transition-all disabled:opacity-10 drop-shadow-[0_0_10px_white]"
                >
                  CONFIRM
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .animate-modal-appear {
          animation: modal-appear 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        @keyframes modal-appear {
          from { opacity: 0; transform: scale(1.1) rotateX(10deg); }
          to { opacity: 1; transform: scale(1) rotateX(0); }
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
