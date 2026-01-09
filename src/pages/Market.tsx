import React, { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { Coins, Loader2, AlertTriangle, ShieldAlert, X, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Market = () => {
  const { gameState, purchaseItem } = useGameState();
  const { playPurchase } = useSoundEffects();
  
  const [isScanning, setIsScanning] = useState(false);
  const [isClosing, setIsClosing] = useState(false); // لإدارة أنيميشن الإغلاق
  const [scanResult, setScanResult] = useState<'idle' | 'searching' | 'failed'>('idle');
  const [activeItem, setActiveItem] = useState(null);

  // نظام ألوان الندرة
  const RARITY_CONFIG = {
    S: { border: 'border-gray-900', text: 'text-gray-400', bg: 'bg-gradient-to-br from-black via-gray-900 to-black', locked: true },
    A: { border: 'border-purple-500', text: 'text-purple-400', bg: 'bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-purple-900/30', locked: true },
    B: { border: 'border-blue-500', text: 'text-blue-400', bg: 'bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-blue-900/30', locked: false },
    C: { border: 'border-white/50', text: 'text-white', bg: 'bg-gradient-to-br from-white/10 via-gray-200/5 to-white/10', locked: false },
    E: { border: 'border-gray-600', text: 'text-gray-400', bg: 'bg-gradient-to-br from-gray-800/50 via-gray-700/30 to-gray-800/50', locked: false },
  };

  const SOLO_ITEMS = [
    // رتبة E (رمادي - الإكسيرات الأساسية)
    { 
      id: 'hp_potion', 
      name: 'Blood Elixir', 
      arabicName: 'إكسير الدم',
      category: 'Elixir', 
      difficulty: 'E', 
      price: 500, 
      icon: '🧪', 
      description: 'يستعيد 50% من الصحة القصوى',
      rankLevel: 0,
      isBasic: true 
    },
    { 
      id: 'mp_potion', 
      name: 'Energy Elixir', 
      arabicName: 'إكسير الطاقة',
      category: 'Elixir', 
      difficulty: 'E', 
      price: 500, 
      icon: '⚡', 
      description: 'يستعيد 50% من الطاقة القصوى',
      rankLevel: 0,
      isBasic: true 
    },
    // رتبة C (أبيض)
    { 
      id: 'mana_meter', 
      name: 'Mana Gauge', 
      arabicName: 'مقياس المانا',
      category: 'Tool', 
      difficulty: 'C', 
      price: 2000, 
      icon: '📊', 
      description: 'جهاز قياس طاقة البوابات والعناصر',
      rankLevel: 0,
      isBasic: true 
    },
    { 
      id: 'awakened_title', 
      name: 'Awakened One', 
      arabicName: 'المستيقظ الواعي',
      category: 'Title', 
      difficulty: 'C', 
      price: 3000, 
      icon: '👑', 
      description: 'لقب يُظهر أنك من المستيقظين - يزيد XP بنسبة 5%',
      rankLevel: 0,
      isBasic: true 
    },
    // رتبة B (أزرق)
    { 
      id: 'power_eye_title', 
      name: 'Eye of Power', 
      arabicName: 'عين القوة',
      category: 'Title', 
      difficulty: 'B', 
      price: 10000, 
      icon: '👁️', 
      description: 'لقب نادر يكشف قوة الأعداء ويظهر إحصائياتهم',
      rankLevel: 2,
      isBasic: false 
    },
    { 
      id: 'storm_hand_title', 
      name: 'Hand of Storm', 
      arabicName: 'يد العاصفة',
      category: 'Title', 
      difficulty: 'B', 
      price: 15000, 
      icon: '🌩️', 
      description: 'لقب نادر يزيد ضرر الهجمات بنسبة 10%',
      rankLevel: 2,
      isBasic: false 
    },
    { 
      id: 'return_key', 
      name: 'Return Key', 
      arabicName: 'مفتاح العودة',
      category: 'Key', 
      difficulty: 'B', 
      price: 8000, 
      icon: '🔑', 
      description: 'يتيح الخروج من البوابة دون إكمالها بشكل آمن',
      rankLevel: 2,
      isBasic: false 
    },
    // رتبة A (بنفسجي - مقفلة)
    { 
      id: 'shadow_elixir', 
      name: 'Shadow Monarch Elixir', 
      arabicName: 'إكسير ملك الظلال',
      category: 'Ancient Grade', 
      difficulty: 'A', 
      price: 150000, 
      icon: '🧪', 
      description: 'إكسير أسطوري مخفي في أرشيف النظام',
      rankLevel: 5, 
      isBasic: false 
    },
    // رتبة S (أسود - مقفلة)
    { 
      id: 'demon_blood', 
      name: 'Demon King Blood', 
      arabicName: 'دم ملك الشياطين',
      category: 'Divine Item', 
      difficulty: 'S', 
      price: 5000000, 
      icon: '💀', 
      description: 'جوهر ملك شيطاني رفيع المستوى',
      rankLevel: 8, 
      isBasic: false 
    },
  ];

  const canSeeItem = (item) => {
    if (item.isBasic) return true;
    const playerRankLevel = Math.floor((gameState.totalLevel || 1) / 10); 
    return playerRankLevel >= item.rankLevel;
  };

  const startSystemScan = (item) => {
    setActiveItem(item);
    setIsScanning(true);
    setIsClosing(false);
    setScanResult('searching');
    setTimeout(() => {
      setScanResult('failed');
    }, 3000);
  };

  // دالة الإغلاق بالأنيميشن المطلوب
  const closeScanModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsClosing(false);
      setScanResult('idle');
      setActiveItem(null);
    }, 500); // وقت الأنيميشن
  };

  const handlePurchase = (item) => {
    const isLocked = !canSeeItem(item);
    if (isLocked) {
      startSystemScan(item);
      return;
    }
    if (gameState.gold >= item.price) {
      purchaseItem(item.id);
      playPurchase();
      toast({ title: 'System: SUCCESS', description: `Acquired ${item.name}` });
    } else {
      toast({ title: 'System: WARNING', description: 'Insufficient Gold', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans selection:bg-blue-500/30 pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
      </div>

      {/* System Modal */}
      {isScanning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className={cn(
            "relative bg-[#050b18] border-2 border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.4)] p-6 max-w-sm w-full font-mono overflow-hidden",
            isClosing ? "animate-[foldVertical_0.5s_ease-in_forwards]" : "animate-[unfoldVertical_0.4s_ease-out_forwards]"
          )}>
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white" />
            
            <div className="text-center space-y-4">
              <h2 className="text-blue-400 text-lg font-bold tracking-[0.2em] uppercase italic">
                {scanResult === 'searching' ? 'Analyzing Data...' : '[Access Denied]'}
              </h2>
              
              {scanResult === 'searching' ? (
                <div className="py-10 flex flex-col items-center gap-4">
                  <div className="relative">
                    <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <span className="text-[8px] animate-pulse text-blue-300">SCN</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-blue-200 animate-pulse tracking-[0.3em] uppercase">Bypassing Encryption...</p>
                </div>
              ) : (
                <div className="py-2 flex flex-col items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 w-full">
                  {(() => {
                    const playerLevel = gameState.totalLevel || 1;
                    const requiredLevel = (activeItem?.rankLevel || 0) * 10;
                    const levelDiff = requiredLevel - playerLevel;

                    const revealText = (text, diff) => {
                      if (diff <= 5) return text;
                      if (diff <= 15) return text.substring(0, 3) + ".".repeat(text.length - 3);
                      if (diff <= 30) return text[0] + "?".repeat(text.length - 1);
                      return "UNKNOWN DATA";
                    };

                    // حساب قوة الشريط بناءً على صعوبة العنصر
                    const powerLevels = { 'S': '80%', 'SS': '92%', 'EX': '100%' };
                    const itemPower = powerLevels[activeItem?.difficulty] || '60%';

                    return (
                      <div className="w-full space-y-4">
                        <div className="w-full border border-blue-500/30 p-4 bg-blue-950/20 relative">
                          <div className="absolute top-0 right-0 p-1">
                            <ShieldAlert className="w-4 h-4 text-red-500/50" />
                          </div>
                          
                          <div className="mb-3 border-b border-blue-500/30 pb-2">
                            <span className="text-[9px] text-blue-400 block mb-1">DATA_STREAM_NAME:</span>
                            <span className="text-sm font-bold text-white tracking-wider">
                              {revealText(activeItem?.name || "???", levelDiff)}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-[9px] text-blue-400 block mb-1">DIFFICULTY:</span>
                              <span className="text-xs font-bold text-red-400">
                                {levelDiff <= 15 ? activeItem?.difficulty : '??'}
                              </span>
                            </div>
                            <div>
                              <span className="text-[9px] text-blue-400 block mb-1">CATEGORY:</span>
                              <span className="text-xs font-bold text-white uppercase">
                                {revealText(activeItem?.category || "???", levelDiff)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* قسم القوة والشكل المكتشف الجديد */}
                        <div className="w-full border border-red-900/40 p-3 bg-red-950/10 space-y-3">
                          <div className="flex items-center gap-2 border-b border-red-900/20 pb-1">
                            <Zap className="w-3 h-3 text-red-500" />
                            <span className="text-[8px] font-bold text-red-400 uppercase">Structural Power Analysis</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 border border-red-500/20 flex items-center justify-center bg-black/40">
                              <span className="text-2xl filter blur-[2px] opacity-40">{activeItem?.icon}</span>
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex justify-between text-[7px] text-slate-400 uppercase">
                                <span>Mana Output:</span>
                                <span className="text-red-500 font-bold tracking-widest">{itemPower}</span>
                              </div>
                              <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full bg-red-600 shadow-[0_0_8px_red]" style={{ width: itemPower }} />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-left bg-red-950/20 border border-red-900/50 p-3">
                          <p className="text-[10px] text-red-400 leading-relaxed font-bold uppercase tracking-tighter">
                            Warning: Player level [{playerLevel}] is insufficient to decrypt this entry. 
                            Minimum level required: {requiredLevel}.
                          </p>
                        </div>

                        {/* زر الإغلاق اليدوي */}
                        <button 
                          onClick={closeScanModal}
                          className="w-full py-2 mt-2 bg-blue-500/10 border border-blue-500/40 text-blue-300 text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500/20 transition-all active:scale-95"
                        >
                          <X className="w-3 h-3 inline-block mr-1" /> Terminate Connection
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <header className="relative z-10 flex justify-between items-center mb-6 border-b border-blue-500/30 pb-3">
        <h1 className="text-xl font-bold tracking-[0.1em] uppercase italic text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">
          System Store
        </h1>
        <div className="bg-blue-950/40 border border-blue-400/50 px-3 py-1 flex items-center gap-2">
          <Coins className="w-3.5 h-3.5 text-yellow-400" />
          <span className="font-mono font-bold text-blue-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.7)] text-sm">
            {gameState.gold.toLocaleString()}
          </span>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-12">
        {SOLO_ITEMS.map((item) => {
          const isLocked = !canSeeItem(item);
          const rarityKey = item.difficulty as keyof typeof RARITY_CONFIG;
          const rarity = RARITY_CONFIG[rarityKey] || RARITY_CONFIG.E;
          
          return (
            <div key={item.id} className="relative group">
              <div className={cn(
                "absolute -inset-0.5 blur-sm opacity-0 group-hover:opacity-100 transition duration-500",
                rarity.locked ? "bg-gray-500/20" : "bg-blue-500/20"
              )} />
              
              <div className={cn(
                "relative border-2 p-4 shadow-[0_0_20px_rgba(30,58,138,0.3)] transition-all active:scale-[0.98]",
                rarity.bg,
                isLocked || rarity.locked ? "border-slate-700/50 grayscale" : rarity.border
              )}>
                <div className="flex justify-center mb-4 mt-[-1.5rem]">
                  <div className={cn(
                    "border px-4 py-0.5 bg-slate-900/90 shadow-[0_0_10px_rgba(255,255,255,0.2)]",
                    isLocked || rarity.locked ? "border-slate-600" : rarity.border
                  )}>
                    <h2 className={cn(
                      "text-xs font-bold tracking-widest drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] uppercase",
                      isLocked || rarity.locked ? "text-slate-500" : rarity.text
                    )}>
                      {isLocked ? '???' : (item.arabicName || item.name)}
                    </h2>
                  </div>
                </div>

                {/* Rank Badge */}
                <div className="absolute top-2 left-2">
                  <span className={cn(
                    "text-[10px] font-black px-2 py-0.5 border",
                    isLocked || rarity.locked ? "border-slate-600 text-slate-500" : rarity.border + " " + rarity.text
                  )}>
                    {item.difficulty}
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-24 h-24 border flex items-center justify-center relative flex-shrink-0",
                      isLocked || rarity.locked ? "border-slate-700/50 bg-black/40" : rarity.border + " bg-black/40"
                    )}>
                      <span className={cn(
                        "text-4xl drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]",
                        isLocked || rarity.locked ? "filter grayscale brightness-50" : "filter grayscale brightness-200 opacity-90"
                      )}>
                        {item.icon}
                      </span>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center border-b border-white/10 pb-1">
                        <p className="text-[9px] text-slate-400 uppercase font-bold">Rank:</p>
                        <p className={cn(
                          "text-xs font-bold italic uppercase",
                          isLocked || rarity.locked ? "text-slate-500" : rarity.text
                        )}>
                          {isLocked ? '?' : item.difficulty}
                        </p>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-1">
                        <p className="text-[9px] text-slate-400 uppercase font-bold">Type:</p>
                        <p className="text-xs font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] italic uppercase">
                          {isLocked ? '???' : item.category}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2 border-t border-slate-700/50">
                    <p className="text-lg font-bold text-center text-blue-50 font-mono tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                      Gold: {isLocked ? '???,???' : item.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="text-center px-1">
                    <p className="text-[10px] text-slate-300 italic leading-tight">
                      {isLocked ? '?' : item.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={rarity.locked}
                    className={cn(
                      "w-full mt-2 py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-all active:scale-[0.95] border drop-shadow-[0_0_5px_rgba(96,165,250,0.3)]",
                      rarity.locked
                        ? "bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed"
                        : isLocked 
                          ? "bg-slate-900/50 border-slate-700 text-slate-500" 
                          : gameState.gold >= item.price
                            ? "bg-blue-500/10 border-blue-500/40 text-blue-300 hover:bg-blue-500/20"
                            : "bg-red-900/20 border-red-500/30 text-red-400"
                    )}
                  >
                    {rarity.locked ? 'Locked in Alpha' : isLocked ? 'Not Found' : 'Purchase Item'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      <BottomNav />

    </div>
  );
};

export default Market;
