import { BottomNav } from '@/components/BottomNav';
import { Lock, Zap, Sparkles } from 'lucide-react';

const Abilities = () => {
  return (
    <div className="min-h-screen bg-[#020817] text-white p-4 font-sans pb-24">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
      </div>

      <header className="relative z-10 text-center mb-8 border-b border-purple-500/30 pb-4">
        <div className="flex items-center justify-center gap-3">
          <Zap className="w-6 h-6 text-purple-500" />
          <h1 className="text-xl font-bold tracking-[0.2em] uppercase italic text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
            القدرات
          </h1>
          <Zap className="w-6 h-6 text-purple-500" />
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto">
        {/* Locked Content */}
        <div className="relative bg-black/60 border-2 border-purple-500/30 p-8 text-center overflow-hidden">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-purple-500/50" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-purple-500/50" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-purple-500/50" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-purple-500/50" />

          {/* Lock Icon */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/40 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.3)]">
            <Lock className="w-12 h-12 text-purple-400" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-purple-400 mb-4 drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">
            مقفل
          </h2>

          {/* Description */}
          <div className="space-y-4 text-right" dir="rtl">
            <p className="text-slate-300 text-sm leading-relaxed">
              نظام القدرات غير متاح حالياً في هذه النسخة التجريبية.
            </p>
            
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 font-bold text-sm">قريباً</span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-xs text-purple-300">
                سيتم إطلاق نظام القدرات الكامل في النسخة الرسمية
              </p>
            </div>

            <div className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                Expected Release: Official Version 1.0
              </p>
            </div>
          </div>

          {/* Scan line effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(168,85,247,0.02)_50%)] bg-[length:100%_4px]" />
          </div>
        </div>

        {/* Feature Preview Cards */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {['القوة', 'العقل', 'الروح', 'الرشاقة'].map((category) => (
            <div 
              key={category}
              className="relative p-4 bg-black/40 border border-slate-700/50 rounded-lg opacity-40"
            >
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-slate-800/50 border border-slate-700/30 flex items-center justify-center">
                <Lock className="w-5 h-5 text-slate-600" />
              </div>
              <p className="text-xs text-center text-slate-600 font-bold">{category}</p>
              <p className="text-[8px] text-center text-slate-700 mt-1">??? قدرات</p>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Abilities;