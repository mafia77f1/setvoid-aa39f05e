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
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 overflow-hidden font-sans">
      
      {/* 1. تأثيرات الخلفية - جزيئات وضباب أزرق */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,149,255,0.1),transparent_70%)]" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        {/* خطوط متحركة خفيفة في الخلفية */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,149,255,0.05)_1px,transparent_1px)] bg-[size:100%_4px] animate-pulse" />
      </div>

      <div className="relative w-full max-w-2xl">
        
        {/* 2. الإطار النيوني الخارجي (الجزء العلوي والسفلي المتوهج) */}
        <div className="absolute -top-10 left-0 right-0 h-1 bg-cyan-500 shadow-[0_0_25px_#06b6d4] animate-pulse" />
        <div className="absolute -top-12 left-1/4 right-1/4 h-4 border-t-2 border-x-2 border-cyan-400/50 rounded-t-xl" />
        
        <div className="absolute -bottom-10 left-0 right-0 h-1 bg-cyan-500 shadow-[0_0_25px_#06b6d4] animate-pulse" />
        <div className="absolute -bottom-12 left-1/4 right-1/4 h-4 border-b-2 border-x-2 border-cyan-400/50 rounded-b-xl" />

        {step === 'welcome' && (
          <div className="relative overflow-hidden rounded-sm border border-cyan-500/30 bg-black/80 backdrop-blur-md shadow-2xl animate-in fade-in zoom-in duration-500">
            
            {/* زخارف الزوايا النيونية */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />

            <div className="p-12 relative z-10">
              {/* الترويسة - Notification */}
              <div className="flex justify-center mb-8">
                <div className="flex items-center gap-4 border-b border-cyan-500/50 pb-2 px-10">
                   <div className="w-8 h-8 rounded-full border-2 border-cyan-400 flex items-center justify-center">
                      <span className="text-cyan-400 font-bold">!</span>
                   </div>
                   <h2 className="text-2xl font-black text-white tracking-[0.3em] italic">NOTIFICATION</h2>
                </div>
              </div>

              {/* المحتوى النصي */}
              <div className="text-center space-y-6 mb-12">
                <p className="text-cyan-100/70 text-xl font-medium tracking-wide">
                  You have acquired the qualifications
                </p>
                <p className="text-2xl text-white">
                  to be a <span className="text-cyan-400 font-black italic underline decoration-cyan-500/50 underline-offset-8 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">Player</span>.
                </p>
                <p className="text-xl text-cyan-100/70 pt-4">Will you accept?</p>
              </div>

              {/* الأزرار */}
              <div className="flex gap-10 justify-center">
                <button
                  onClick={handleAccept}
                  className="group relative px-12 py-3 bg-cyan-900/20 border border-cyan-500 text-cyan-400 font-black text-xl italic hover:bg-cyan-500 hover:text-black transition-all duration-300 transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-20 blur-md transition-opacity" />
                  YES
                </button>
                <button
                  onClick={handleDecline}
                  className="px-12 py-3 bg-red-900/10 border border-red-900/50 text-red-900 font-black text-xl italic hover:bg-red-900/20 transition-all"
                >
                  NO
                </button>
              </div>
            </div>

            {/* تأثير الخطوط الرقمية الخلفية داخل اللوحة */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]" />
          </div>
        )}

        {step === 'name' && (
          <div className="relative overflow-hidden rounded-sm border border-cyan-500/30 bg-black/80 backdrop-blur-md p-12 animate-in slide-in-from-bottom-10 duration-500">
             <div className="text-center mb-10">
                <h2 className="text-xl font-bold text-cyan-400 tracking-[0.2em] mb-8">IDENTITY VERIFICATION</h2>
                <div className="relative">
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="ENTER PLAYER NAME..."
                    className="w-full bg-transparent border-b-2 border-cyan-500/50 py-4 text-center text-3xl font-black text-white focus:outline-none focus:border-cyan-400 transition-all placeholder:text-cyan-900/50"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                  />
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_#22d3ee] scale-x-0 focus-within:scale-x-100 transition-transform" />
                </div>
             </div>

             <div className="flex justify-center">
                <button
                  onClick={handleStart}
                  disabled={!playerName.trim()}
                  className="px-20 py-4 border-2 border-cyan-500 text-cyan-400 font-black text-2xl tracking-tighter hover:bg-cyan-500 hover:text-black disabled:opacity-20 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  CONFIRM
                </button>
             </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center animate-pulse">
            <div className="w-64 h-2 bg-cyan-900 rounded-full overflow-hidden border border-cyan-500/30">
              <div className="h-full bg-cyan-500 shadow-[0_0_20px_#06b6d4] animate-[loading_2s_ease-in-out_infinite]" style={{width: '60%'}} />
            </div>
            <p className="mt-6 text-cyan-400 font-black italic tracking-[0.5em] text-xl">INITIALIZING SYSTEM...</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
