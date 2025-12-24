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
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden select-none">
      
      {/* خلفية ضبابية منتشرة خلف الكارد */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full" />
      </div>

      {/* الكارد الصغير - مصمم خصيصاً للهاتف */}
      <div className="relative z-10 w-full max-w-[340px] animate-modal-appear">
        
        {/* الحواف النيونية العلوية والسفلية (قصيرة وحادة) */}
        <div className="absolute -top-4 left-4 right-4 h-[1.5px] bg-blue-400 shadow-[0_0_15px_#3b82f6]" />
        <div className="absolute -bottom-4 left-4 right-4 h-[1.5px] bg-blue-400 shadow-[0_0_15px_#3b82f6]" />

        {/* جسم الكارد الضبابي (Frosted Glass) */}
        <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden rounded-sm">
          
          {/* طبقة ضباب إضافية (Texture) */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')]" />

          {/* العنوان بخلفية أغمق قليلاً */}
          <div className="bg-black/60 border-b border-white/10 py-3 flex items-center justify-center gap-2">
            <div className="w-5 h-5 border border-white/60 rounded-full flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">!</span>
            </div>
            <h2 className="text-white font-black tracking-[0.3em] italic text-sm drop-shadow-[0_0_8px_white]">
              NOTIFICATION
            </h2>
          </div>

          <div className="p-5 flex flex-col items-center">
            {step === 'welcome' && (
              <div className="w-full text-center">
                {/* المحتوى النصي - مرتب لعدم الخروج */}
                <div className="space-y-4 mb-8 px-2">
                  <p className="text-white/80 text-[13px] font-medium leading-relaxed drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
                    You have acquired the qualifications
                  </p>
                  <p className="text-white text-xl font-black leading-tight">
                    to be a <span className="text-blue-400 italic drop-shadow-[0_0_15px_#3b82f6] underline decoration-blue-500/50 underline-offset-4">Player</span>.
                  </p>
                  <p className="text-white/40 italic text-[12px]">Will you accept?</p>
                </div>

                {/* أزرار بالعرض متناسقة جداً */}
                <div className="flex flex-row gap-3 w-full">
                  <button
                    onClick={handleAccept}
                    className="flex-1 py-2 bg-transparent border border-white/50 text-white font-bold text-sm italic hover:bg-white hover:text-black transition-all drop-shadow-[0_0_8px_white]"
                  >
                    ACCEPT
                  </button>
                  <button
                    onClick={() => window.close()}
                    className="flex-1 py-2 bg-transparent border border-white/5 text-white/30 font-bold text-xs italic hover:text-white/60 transition-all"
                  >
                    REJECT
                  </button>
                </div>
              </div>
            )}

            {step === 'name' && (
              <div className="w-full text-center py-2">
                <h2 className="text-white font-black tracking-[0.2em] text-[11px] mb-6 drop-shadow-[0_0_8px_white]">REGISTER PLAYER</h2>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="NAME..."
                  className="w-full bg-transparent border-b border-blue-500/40 py-2 text-center text-xl font-black text-white focus:outline-none focus:border-white transition-all placeholder:text-white/10"
                  autoFocus
                />
                <button
                  onClick={handleStart}
                  disabled={!playerName.trim()}
                  className="mt-8 w-full py-2 bg-white text-black font-black text-sm italic shadow-[0_0_15px_white]"
                >
                  CONFIRM
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modal-appear {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-modal-appear {
          animation: modal-appear 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
