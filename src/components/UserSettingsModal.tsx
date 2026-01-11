import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { 
  X, 
  Save, 
  Coins, 
  Heart, 
  Dumbbell, 
  Brain, 
  Zap, 
  Sparkles,
  Settings,
  RefreshCw,
  Shield
} from 'lucide-react';
import { StatType } from '@/types/game';

interface UserSettingsModalProps {
  show: boolean;
  currentData: {
    playerName: string;
    title: string;
    gold: number;
    hp: number;
    maxHp: number;
    stats: {
      strength: number;
      mind: number;
      spirit: number;
      agility: number;
    };
    levels: {
      strength: number;
      mind: number;
      spirit: number;
      agility: number;
    };
    totalLevel: number;
    streakDays: number;
  };
  onSave: (data: {
    playerName: string;
    title: string;
    gold: number;
    hp: number;
    maxHp: number;
    stats: {
      strength: number;
      mind: number;
      spirit: number;
      agility: number;
    };
    streakDays: number;
  }) => void;
  onClose: () => void;
}

export const UserSettingsModal = ({ show, currentData, onSave, onClose }: UserSettingsModalProps) => {
  const [playerName, setPlayerName] = useState(currentData.playerName);
  const [title, setTitle] = useState(currentData.title);
  const [gold, setGold] = useState(currentData.gold);
  const [hp, setHp] = useState(currentData.hp);
  const [maxHp, setMaxHp] = useState(currentData.maxHp);
  const [stats, setStats] = useState(currentData.stats);
  const [streakDays, setStreakDays] = useState(currentData.streakDays);
  const { playClick } = useSoundEffects();

  useEffect(() => {
    if (show) {
      setPlayerName(currentData.playerName);
      setTitle(currentData.title);
      setGold(currentData.gold);
      setHp(currentData.hp);
      setMaxHp(currentData.maxHp);
      setStats(currentData.stats);
      setStreakDays(currentData.streakDays);
    }
  }, [show, currentData]);

  const handleSave = () => {
    playClick();
    onSave({
      playerName: playerName.trim() || currentData.playerName,
      title: title.trim() || '-',
      gold: Math.max(0, gold),
      hp: Math.max(0, Math.min(hp, maxHp)),
      maxHp: Math.max(1, maxHp),
      stats: {
        strength: Math.max(0, stats.strength),
        mind: Math.max(0, stats.mind),
        spirit: Math.max(0, stats.spirit),
        agility: Math.max(0, stats.agility),
      },
      streakDays: Math.max(0, streakDays),
    });
    onClose();
  };

  const updateStat = (stat: StatType, value: number) => {
    setStats(prev => ({
      ...prev,
      [stat]: value
    }));
  };

  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className={cn(
          "relative max-w-lg w-full mx-auto my-8 animate-scale-in",
          "rounded-none border-2 border-blue-400/60 overflow-hidden",
          "bg-gradient-to-b from-slate-900/95 to-black/95"
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* Scan Lines Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
        
        {/* Top Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
        
        {/* Close Button */}
        <button
          onClick={() => { playClick(); onClose(); }}
          className="absolute top-4 right-4 z-10 p-2 border border-slate-600 bg-black/50 hover:bg-red-500/20 hover:border-red-500/50 transition-colors"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <div className="p-6 pt-8 max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-blue-400/50 bg-blue-500/10 mb-4">
              <Settings className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold tracking-[0.2em] uppercase text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">
              إعدادات اللاعب
            </h3>
            <p className="text-[10px] text-slate-500 mt-1 tracking-wider">PLAYER SETTINGS PANEL</p>
          </div>

          {/* Form Sections */}
          <div className="space-y-6">
            {/* Basic Info Section */}
            <div className="border border-slate-700/50 p-4 bg-black/40">
              <div className="flex items-center gap-2 mb-4 border-l-2 border-blue-400 pl-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] font-bold tracking-widest text-blue-100 uppercase">المعلومات الأساسية</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold mb-2 text-slate-400 uppercase tracking-wider">اسم اللاعب</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="اسم اللاعب..."
                    className={cn(
                      "w-full px-3 py-2 text-sm text-right",
                      "bg-black/50 border border-slate-600",
                      "text-white placeholder:text-slate-600",
                      "focus:outline-none focus:border-blue-400 focus:shadow-[0_0_10px_rgba(96,165,250,0.2)]",
                      "transition-all"
                    )}
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold mb-2 text-slate-400 uppercase tracking-wider">اللقب</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="لقب اللاعب..."
                    className={cn(
                      "w-full px-3 py-2 text-sm text-right",
                      "bg-black/50 border border-slate-600",
                      "text-white placeholder:text-slate-600",
                      "focus:outline-none focus:border-blue-400 focus:shadow-[0_0_10px_rgba(96,165,250,0.2)]",
                      "transition-all"
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Resources Section */}
            <div className="border border-slate-700/50 p-4 bg-black/40">
              <div className="flex items-center gap-2 mb-4 border-l-2 border-yellow-400 pl-2">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-[10px] font-bold tracking-widest text-yellow-100 uppercase">الموارد</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[9px] font-bold mb-2 text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Coins className="w-3 h-3 text-yellow-400" /> الذهب
                  </label>
                  <input
                    type="number"
                    value={gold}
                    onChange={(e) => setGold(parseInt(e.target.value) || 0)}
                    min="0"
                    className={cn(
                      "w-full px-3 py-2 text-sm text-center",
                      "bg-black/50 border border-yellow-600/50",
                      "text-yellow-400 font-bold",
                      "focus:outline-none focus:border-yellow-400 focus:shadow-[0_0_10px_rgba(234,179,8,0.2)]",
                      "transition-all"
                    )}
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold mb-2 text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Heart className="w-3 h-3 text-red-400" /> HP
                  </label>
                  <input
                    type="number"
                    value={hp}
                    onChange={(e) => setHp(parseInt(e.target.value) || 0)}
                    min="0"
                    max={maxHp}
                    className={cn(
                      "w-full px-3 py-2 text-sm text-center",
                      "bg-black/50 border border-red-600/50",
                      "text-red-400 font-bold",
                      "focus:outline-none focus:border-red-400 focus:shadow-[0_0_10px_rgba(239,68,68,0.2)]",
                      "transition-all"
                    )}
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold mb-2 text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Heart className="w-3 h-3 text-red-400" /> Max HP
                  </label>
                  <input
                    type="number"
                    value={maxHp}
                    onChange={(e) => setMaxHp(parseInt(e.target.value) || 100)}
                    min="1"
                    className={cn(
                      "w-full px-3 py-2 text-sm text-center",
                      "bg-black/50 border border-red-600/50",
                      "text-red-400 font-bold",
                      "focus:outline-none focus:border-red-400 focus:shadow-[0_0_10px_rgba(239,68,68,0.2)]",
                      "transition-all"
                    )}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-[9px] font-bold mb-2 text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 text-orange-400" /> أيام الالتزام (Streak)
                </label>
                <input
                  type="number"
                  value={streakDays}
                  onChange={(e) => setStreakDays(parseInt(e.target.value) || 0)}
                  min="0"
                  className={cn(
                    "w-full px-3 py-2 text-sm text-center",
                    "bg-black/50 border border-orange-600/50",
                    "text-orange-400 font-bold",
                    "focus:outline-none focus:border-orange-400 focus:shadow-[0_0_10px_rgba(251,146,60,0.2)]",
                    "transition-all"
                  )}
                />
              </div>
            </div>

            {/* Stats Section */}
            <div className="border border-slate-700/50 p-4 bg-black/40">
              <div className="flex items-center gap-2 mb-4 border-l-2 border-purple-400 pl-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] font-bold tracking-widest text-purple-100 uppercase">نقاط الخبرة (XP)</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold mb-2 text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Dumbbell className="w-3 h-3 text-blue-400" /> القوة (STR)
                  </label>
                  <input
                    type="number"
                    value={stats.strength}
                    onChange={(e) => updateStat('strength', parseInt(e.target.value) || 0)}
                    min="0"
                    className={cn(
                      "w-full px-3 py-2 text-sm text-center",
                      "bg-black/50 border border-blue-600/50",
                      "text-blue-400 font-bold",
                      "focus:outline-none focus:border-blue-400 focus:shadow-[0_0_10px_rgba(96,165,250,0.2)]",
                      "transition-all"
                    )}
                  />
                  <p className="text-[8px] text-slate-500 mt-1 text-center">
                    المستوى الحالي: {currentData.levels.strength}
                  </p>
                </div>

                <div>
                  <label className="block text-[9px] font-bold mb-2 text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Brain className="w-3 h-3 text-purple-400" /> العقل (INT)
                  </label>
                  <input
                    type="number"
                    value={stats.mind}
                    onChange={(e) => updateStat('mind', parseInt(e.target.value) || 0)}
                    min="0"
                    className={cn(
                      "w-full px-3 py-2 text-sm text-center",
                      "bg-black/50 border border-purple-600/50",
                      "text-purple-400 font-bold",
                      "focus:outline-none focus:border-purple-400 focus:shadow-[0_0_10px_rgba(192,132,252,0.2)]",
                      "transition-all"
                    )}
                  />
                  <p className="text-[8px] text-slate-500 mt-1 text-center">
                    المستوى الحالي: {currentData.levels.mind}
                  </p>
                </div>

                <div>
                  <label className="block text-[9px] font-bold mb-2 text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Heart className="w-3 h-3 text-pink-400" /> الروح (SPR)
                  </label>
                  <input
                    type="number"
                    value={stats.spirit}
                    onChange={(e) => updateStat('spirit', parseInt(e.target.value) || 0)}
                    min="0"
                    className={cn(
                      "w-full px-3 py-2 text-sm text-center",
                      "bg-black/50 border border-pink-600/50",
                      "text-pink-400 font-bold",
                      "focus:outline-none focus:border-pink-400 focus:shadow-[0_0_10px_rgba(236,72,153,0.2)]",
                      "transition-all"
                    )}
                  />
                  <p className="text-[8px] text-slate-500 mt-1 text-center">
                    المستوى الحالي: {currentData.levels.spirit}
                  </p>
                </div>

                <div>
                  <label className="block text-[9px] font-bold mb-2 text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3 h-3 text-yellow-400" /> الرشاقة (AGI)
                  </label>
                  <input
                    type="number"
                    value={stats.agility}
                    onChange={(e) => updateStat('agility', parseInt(e.target.value) || 0)}
                    min="0"
                    className={cn(
                      "w-full px-3 py-2 text-sm text-center",
                      "bg-black/50 border border-yellow-600/50",
                      "text-yellow-400 font-bold",
                      "focus:outline-none focus:border-yellow-400 focus:shadow-[0_0_10px_rgba(234,179,8,0.2)]",
                      "transition-all"
                    )}
                  />
                  <p className="text-[8px] text-slate-500 mt-1 text-center">
                    المستوى الحالي: {currentData.levels.agility}
                  </p>
                </div>
              </div>
            </div>

            {/* Current Status Display */}
            <div className="border border-slate-700/50 p-4 bg-blue-950/20">
              <div className="text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">المستوى الكلي الحالي</p>
                <p className="text-3xl font-black italic text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                  LV. {currentData.totalLevel}
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className={cn(
              "w-full mt-6 p-4 font-bold text-sm uppercase tracking-[0.2em] transition-all",
              "flex items-center justify-center gap-3",
              "bg-blue-500/20 border-2 border-blue-400/60 text-blue-300",
              "hover:bg-blue-500/30 hover:shadow-[0_0_20px_rgba(96,165,250,0.3)]",
              "active:scale-[0.98]"
            )}
          >
            <Save className="w-5 h-5" />
            حفظ التغييرات
          </button>

          <p className="text-[9px] text-slate-600 text-center mt-3">
            سيتم حفظ البيانات في Supabase تلقائياً
          </p>
        </div>

        {/* Bottom Glow Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
      </div>
    </div>
  );
};
