import { useState } from 'react';
import { ShadowSoldier } from '@/types/game';
import { cn } from '@/lib/utils';
import { 
  Ghost, 
  Swords, 
  Brain, 
  Heart,
  Lock,
  Sparkles,
  Zap,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ShadowSoldiersPanelProps {
  soldiers: ShadowSoldier[];
  shadowPoints: number;
  onSummon: (soldierId: string) => void;
}

export const ShadowSoldiersPanel = ({ 
  soldiers, 
  shadowPoints, 
  onSummon 
}: ShadowSoldiersPanelProps) => {
  const [summoning, setSummoning] = useState<string | null>(null);

  const getSoldierIcon = (type: string) => {
    switch (type) {
      case 'strength': return <Swords className="w-8 h-8" />;
      case 'mind': return <Brain className="w-8 h-8" />;
      case 'spirit': return <Heart className="w-8 h-8" />;
      default: return <Ghost className="w-8 h-8" />;
    }
  };

  const getSoldierColor = (type: string) => {
    switch (type) {
      case 'strength': return { main: 'hsl(0 70% 50%)', glow: 'hsl(0 70% 50% / 0.5)' };
      case 'mind': return { main: 'hsl(210 100% 60%)', glow: 'hsl(210 100% 60% / 0.5)' };
      case 'spirit': return { main: 'hsl(270 70% 60%)', glow: 'hsl(270 70% 60% / 0.5)' };
      default: return { main: 'hsl(200 100% 60%)', glow: 'hsl(200 100% 60% / 0.5)' };
    }
  };

  const handleSummon = (soldier: ShadowSoldier) => {
    if (shadowPoints < soldier.cost) {
      toast({
        title: "نقاط ظل غير كافية",
        description: `تحتاج ${soldier.cost} نقطة ظل`,
        variant: "destructive"
      });
      return;
    }

    setSummoning(soldier.id);
    
    setTimeout(() => {
      onSummon(soldier.id);
      setSummoning(null);
      toast({
        title: `تم استدعاء ${soldier.arabicName}!`,
        description: `جندي الظل جاهز للقتال`
      });
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ghost className="w-6 h-6 text-primary" />
          <h3 className="font-bold text-lg">جنود الظل</h3>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/20 border border-primary/40">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-bold text-primary">{shadowPoints}</span>
        </div>
      </div>

      {/* Soldiers Grid */}
      <div className="grid gap-4">
        {soldiers.map((soldier) => {
          const colors = getSoldierColor(soldier.type);
          const canSummon = shadowPoints >= soldier.cost;
          const isSummoning = summoning === soldier.id;

          return (
            <div
              key={soldier.id}
              className={cn(
                "relative p-4 rounded-xl border-2 transition-all duration-300",
                soldier.unlocked
                  ? "bg-gradient-to-r from-card/80 to-card/40 border-primary/50"
                  : "bg-card/20 border-muted/30"
              )}
              style={{
                boxShadow: soldier.unlocked ? `0 0 30px ${colors.glow}` : 'none'
              }}
            >
              {/* Summoning effect */}
              {isSummoning && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 rounded-xl animate-pulse">
                  <div className="text-center">
                    <Ghost className="w-16 h-16 mx-auto text-primary animate-bounce mb-2" />
                    <span className="text-primary font-bold">جاري الاستدعاء...</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                {/* Icon */}
                <div 
                  className={cn(
                    "w-16 h-16 rounded-xl flex items-center justify-center relative",
                    soldier.unlocked && "animate-float"
                  )}
                  style={{
                    background: soldier.unlocked 
                      ? `linear-gradient(135deg, ${colors.main}30, ${colors.main}10)`
                      : 'hsl(0 0% 20%)',
                    border: `2px solid ${soldier.unlocked ? colors.main : 'hsl(0 0% 30%)'}`,
                    boxShadow: soldier.unlocked ? `0 0 25px ${colors.glow}` : 'none'
                  }}
                >
                  <div style={{ color: soldier.unlocked ? colors.main : 'hsl(0 0% 50%)' }}>
                    {soldier.unlocked ? getSoldierIcon(soldier.type) : <Lock className="w-8 h-8" />}
                  </div>
                  
                  {/* Level badge */}
                  {soldier.unlocked && (
                    <div 
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background: colors.main,
                        boxShadow: `0 0 10px ${colors.glow}`
                      }}
                    >
                      {soldier.level}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold" style={{ color: soldier.unlocked ? colors.main : 'inherit' }}>
                      {soldier.arabicName}
                    </h4>
                    <span className="text-xs text-muted-foreground">({soldier.name})</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span>{soldier.power} قوة</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Crown className="w-4 h-4 text-primary" />
                      <span>مستوى {soldier.level}</span>
                    </div>
                  </div>

                  {/* Cost / Summon button */}
                  {!soldier.unlocked && (
                    <Button
  onClick={() => toast({
    title: "ميزة قادمة قريبًا!",
    description: "ميزة استدعاء الجنود غير مفعلة في النسخة الأولى"
  })}
  size="sm"
  className="mt-2 bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30"
>
  <Sparkles className="w-4 h-4 ml-1" />
  استدعاء
</Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
