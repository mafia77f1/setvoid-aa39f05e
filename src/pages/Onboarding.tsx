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
    <div className="min-h-screen bg-[#050b14] flex items-center justify-center p-4 overflow-hidden">
      
      {/* خلفية سولو ليفلينج - ضباب أزرق وتوهج بعيد */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30" />
      </div>

      <div className="relative z-10 w-full max-w-2xl animate-modal-appear">
        
        {/* الحواف العلوية والسفلية المتوهجة (مثل الصورة تماماً) */}
        <div className="absolute -top-8 left-0 right-0 h-[2px] bg-blue-400 shadow-[0_0_20px_#60a5fa]" />
        <div className="absolute -top-10 left-10 right-10 h-[4px] bg-blue-500/50 blur-sm" />
        
        <div className="absolute -bottom-8 left-0 right-0 h-[2px] bg-blue-400 shadow-[0_0_20px_#60a5fa]" />
        <div className="absolute -bottom-10 left-10 right-10 h-[4px] bg-blue-500/50 blur-sm" />

        {/* الكارد الخارجي (Outer Card) */}
        <div className="border border-blue-500/20 bg-blue-950/10 backdrop-blur-sm p-4 rounded-sm">
          
          {/* الكارد الداخلي (Inner Card - المحتوى) */}
          <div className="border border-blue-400/40 bg-black/80 p-8 relative overflow-hidden">
            
            {/* تأثير الخطوط الرقمية داخل الكارد */}
            <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_3px]" />

            {step === 'welcome' && (
              <div className="relative z-10">
                {/* Header: Icon + NOTIFICATION */}
                <div className="flex items-center justify-center gap-4 mb-10 border-b border-blue-500/30 pb-4">
                  <div className="w-10 h-10 border-2 border-blue-400 rounded-full flex items-center justify-center">
                    <span className="text-blue-400 font-bold text-xl">!</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-[0.4em]">NOTIFICATION</h2>
                </div>

                <div className="text-center space-y-6 mb-12">
                  <p className="text-blue-100/80 text-lg tracking-wide">
                    You have acquired the qualifications
                  </p>
                  <p className="text-xl text-white">
                    to be a <span className="text-blue-400 font-bold italic underline underline-offset-4">Player</span>. Will you accept?
                  </p>
                </div>

                <div className="flex gap-8 justify-center">
                  <button
                    onClick={handleAccept}
                    className="px-12 py-2 border border-blue-500/50 text-blue-400 font-bold hover:bg-blue-500/10 transition-all active:scale-95"
                  >
                    Yes
                  </button>
                  <button
                    onClick={handleDecline}
                    className="px-12 py-2 border border-blue-500/20 text-blue-100/40 font-bold hover:bg-white/5 transition-all"
                  >
                    No
                  </button>
                </div>
              </div>
            )}

            {step === 'name' && (
              <div className="relative z-10 text-center">
                <h2 className="text-blue-400 font-bold tracking-[0.2em] mb-8">IDENTITY VERIFICATION</h2>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="اسم اللاعب..."
                  className="w-full bg-transparent border-b border-blue-500/50 py-4 text-center text-2xl font-bold text-white focus:outline-none focus:border-blue-400 transition-all"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                />
                <button
                  onClick={handleStart}
                  disabled={!playerName.trim()}
                  className="mt-10 px-16 py-3 border border-blue-400 text-blue-400 font-bold hover:bg-blue-400 hover:text-black transition-all disabled:opacity-20"
                >
                  Confirm
                </button>
              </div>
            )}

            {step === 'loading' && (
              <div className="py-10 text-center animate-pulse">
                <p className="text-blue-400 font-bold tracking-[0.3em] text-xl italic">
                  INITIALIZING SYSTEM...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
