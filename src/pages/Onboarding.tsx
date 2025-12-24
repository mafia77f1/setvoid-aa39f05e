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
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 overflow-hidden font-sans select-none">
      
      {/* خلفية النظام - ضباب أزرق خفيف */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,149,255,0.1),transparent_70%)]" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
      </div>

      <div className="relative w-full max-w-[340px] sm:max-w-md animate-modal-appear">
        
        {/* الحواف النيونية للهاتف (صغيرة وحادة) */}
        <div className="absolute -top-6 left-2 right-2 h-[2px] bg-cyan-400 shadow-[0_0_15px_#22d3ee] z-20" />
        <div className="absolute -bottom-6 left-2 right-2 h-[2px] bg-cyan-400 shadow-[0_0_15px_#22d3ee] z-20" />

        {/* الكارد الخارجي الصغير */}
        <div className="border border-cyan-500/20 bg-cyan-950/10 backdrop-blur-sm p-[1.5px] rounded-sm shadow-2xl">
          
          {/* الكارد الداخلي الشفاف (المحتوى محشور بالداخل بدقة) */}
          <div className="relative border border-cyan-400/30 bg-black/60 backdrop-blur-lg p-6 py-8 overflow-hidden flex flex-col items-center">
            
            {/* تأثير الشبكة الرقمية */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[size:100%_4px]" />

            {step === 'welcome' && (
              <div className="relative z-10 w-full flex flex-col items-center text-center">
                
                {/* الجزء العلوي: الأيقونة والعنوان */}
                <div className="flex flex-col items-center gap-3 mb-8 w-full border-b border-cyan-500/20 pb-4">
                  <div className="w-10 h-10 border-2 border-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.4)]">
                    <span className="text-cyan-400 font-black text-xl drop-shadow-[0_0_5px_#22d3ee]">!</span>
                  </div>
                  <h2 className="text-xl font-black text-white tracking-[0.2em] italic drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                    NOTIFICATION
                  </h2>
                </div>

                {/* نص الرسالة - مرتب داخل الكارد */}
                <div className="space-y-4 mb-10 px-2">
                  <p className="text-cyan-100/80 text-sm leading-relaxed tracking-wide">
                    You have acquired the qualifications
                  </p>
                  <p className="text-lg text-white font-bold leading-tight">
                    to be a <span className="text-cyan-400 italic drop-shadow-[0_0_10px_#22d3ee]">Player</span>.
                  </p>
                  <p className="text-sm text-cyan-100/60 italic">Will you accept?</p>
                </div>

                {/* الأزرار بأسلوب سولو ليفلينج للهاتف */}
                <div className="flex gap-4 w-full justify-center">
                  <button
                    onClick={handleAccept}
                    className="flex-1 max-w-[120px] py-2 bg-transparent border border-cyan-500/60 text-cyan-400 font-black text-sm italic hover:bg-cyan-500 hover:text-black transition-all"
                  >
                    ACCEPT
                  </button>
                  <button
                    onClick={handleDecline}
                    className="flex-1 max-w-[120px] py-2 bg-transparent border border-red-900/30 text-red-900/60 font-black text-sm italic hover:border-red-600 hover:text-red-600 transition-all"
                  >
                    NOT ACCEPT
                  </button>
                </div>
              </div>
            )}

            {step === 'name' && (
              <div className="relative z-10 w-full text-center">
                <h2 className="text-cyan-400 font-black tracking-[0.2em] text-sm mb-8">IDENTITY VERIFICATION</h2>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="NAME..."
                  className="w-full bg-transparent border-b border-cyan-500/40 py-2 text-center text-2xl font-black text-white focus:outline-none focus:border-cyan-400 transition-all placeholder:text-cyan-950/30"
                  autoFocus
                />
                <button
                  onClick={handleStart}
                  disabled={!playerName.trim()}
                  className="mt-10 w-full py-3 border border-cyan-500 text-cyan-400 font-black text-lg italic hover:bg-cyan-500 hover:text-black transition-all disabled:opacity-10"
                >
                  START
                </button>
              </div>
            )}

            {step === 'loading' && (
              <div className="py-12 flex flex-col items-center">
                <div className="w-40 h-[1px] bg-cyan-900/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-loading-slide" />
                </div>
                <p className="mt-4 text-cyan-400 font-black italic tracking-[0.3em] text-xs animate-pulse">
                  SYSTEM INITIALIZING...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loading-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-slide { animation: loading-slide 1.5s infinite linear; }
        .animate-modal-appear {
          animation: modal-appear 0.4s ease-out;
        }
        @keyframes modal-appear {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
