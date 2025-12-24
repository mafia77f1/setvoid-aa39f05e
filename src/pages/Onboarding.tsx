import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 overflow-hidden font-sans select-none">
      
      {/* الخلفية الأصلية - ضباب أزرق عميق وتأثير جزيئات */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,149,255,0.15),transparent_70%)]" />
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/10 via-transparent to-blue-900/10" />
      </div>

      <div className="relative w-full max-w-2xl animate-modal-appear">
        
        {/* الحواف النيونية الخارجية - متطابقة مع الصورة */}
        <div className="absolute -top-12 left-0 right-0 h-[3px] bg-cyan-400 shadow-[0_0_25px_#22d3ee,0_0_10px_#22d3ee] z-20" />
        <div className="absolute -bottom-12 left-0 right-0 h-[3px] bg-cyan-400 shadow-[0_0_25px_#22d3ee,0_0_10px_#22d3ee] z-20" />

        {/* الكارد الخارجي (الإطار الزجاجي) */}
        <div className="relative border border-cyan-500/20 bg-cyan-950/5 backdrop-blur-[2px] p-[2px] rounded-sm">
          
          {/* الكارد الداخلي - شفاف تماماً (Glassmorphism) كما في الصورة */}
          <div className="relative border border-cyan-400/40 bg-black/40 backdrop-blur-md p-10 overflow-hidden">
            
            {/* تأثير الخطوط الرقمية المائلة (Scanlines) */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(34,211,238,0.1)_3px,transparent_4px)]" />

            {step === 'welcome' && (
              <div className="relative z-10">
                {/* العنوان مع أيقونة التنبيه وتوهج النص */}
                <div className="flex items-center justify-center gap-6 mb-12">
                  <div className="w-12 h-12 border-2 border-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                    <span className="text-cyan-400 font-black text-2xl drop-shadow-[0_0_8px_#22d3ee]">!</span>
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-[0.4em] italic drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]">
                    NOTIFICATION
                  </h2>
                </div>

                {/* المحتوى النصي مع توهج أزرق ناعم */}
                <div className="text-center space-y-8 mb-16">
                  <p className="text-cyan-100/90 text-xl font-medium tracking-wide drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]">
                    You have acquired the qualifications
                  </p>
                  <p className="text-2xl text-white font-semibold">
                    to be a <span className="text-cyan-400 font-black italic drop-shadow-[0_0_15px_#22d3ee]">Player</span>.
                  </p>
                  <p className="text-xl text-cyan-100/80 italic">Will you accept?</p>
                </div>

                {/* أزرار Accept و Not Accept بأسلوب سولو ليفلينج */}
                <div className="flex gap-12 justify-center">
                  <button
                    onClick={handleAccept}
                    className="group relative px-14 py-3 bg-transparent border-2 border-cyan-500/60 text-cyan-400 font-black text-xl italic hover:bg-cyan-500 hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  >
                    ACCEPT
                  </button>
                  <button
                    onClick={handleDecline}
                    className="px-14 py-3 bg-transparent border-2 border-red-900/30 text-red-900/60 font-black text-xl italic hover:border-red-600/50 hover:text-red-600 transition-all"
                  >
                    NOT ACCEPT
                  </button>
                </div>
              </div>
            )}

            {step === 'name' && (
              <div className="relative z-10 text-center py-4">
                <h2 className="text-cyan-400 font-black tracking-[0.3em] text-xl mb-12 drop-shadow-[0_0_10px_#22d3ee]">
                  CHARACTER REGISTRATION
                </h2>
                <div className="relative max-w-md mx-auto">
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="NAME..."
                    className="w-full bg-transparent border-b-2 border-cyan-500/40 py-4 text-center text-4xl font-black text-white focus:outline-none focus:border-cyan-400 transition-all placeholder:text-cyan-950"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                  />
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_20px_#22d3ee] opacity-50" />
                </div>
                <button
                  onClick={handleStart}
                  disabled={!playerName.trim()}
                  className="mt-14 px-20 py-4 border-2 border-cyan-500 text-cyan-400 font-black text-2xl italic hover:bg-cyan-500 hover:text-black transition-all disabled:opacity-10"
                >
                  START MISSION
                </button>
              </div>
            )}

            {step === 'loading' && (
              <div className="py-20 flex flex-col items-center">
                <div className="w-full max-w-xs h-1 bg-cyan-900/30 overflow-hidden">
                  <div className="h-full bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-loading-bar" />
                </div>
                <p className="mt-8 text-cyan-400 font-black italic tracking-[0.6em] text-xl animate-pulse">
                  SYNCING SYSTEM...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s infinite linear;
        }
        .animate-modal-appear {
          animation: modal-appear 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes modal-appear {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
