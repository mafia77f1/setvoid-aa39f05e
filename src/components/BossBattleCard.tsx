import { Boss } from '@/types/game';
import { Skull, Swords, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface BossBattleCardProps {
  boss: Boss;
}

export const BossBattleCard = ({ boss }: BossBattleCardProps) => {
  const navigate = useNavigate();
  const hpPercentage = (boss.currentHp / boss.maxHp) * 100;

  return (
    <div className="boss-battle-card p-6">
      {/* Corner Decorations */}
      <div className="corner-decoration corner-tl border-destructive/60" />
      <div className="corner-decoration corner-tr border-destructive/60" />
      <div className="corner-decoration corner-bl border-destructive/60" />
      <div className="corner-decoration corner-br border-destructive/60" />

      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/20 border border-destructive/40 mb-4">
          <Skull className="w-5 h-5 text-destructive" />
          <span className="text-sm font-bold text-destructive">BOSS FIGHT</span>
        </div>
        <h2 className="text-2xl font-bold text-destructive glow-text">{boss.name}</h2>
        <p className="text-sm text-muted-foreground mt-1">{boss.description}</p>
      </div>

      {/* Boss Visual */}
      <div className="relative h-40 mb-6 flex items-center justify-center">
        <div className={cn(
          "relative w-32 h-32 rounded-full border-4 flex items-center justify-center",
          boss.defeated ? "border-secondary/50 bg-secondary/10" : "border-destructive/50 bg-destructive/10",
          !boss.defeated && "animate-pulse-slow"
        )}>
          {boss.defeated ? (
            <Shield className="w-16 h-16 text-secondary" />
          ) : (
            <Skull className="w-16 h-16 text-destructive" />
          )}
        </div>
        
        {/* Glow Effect */}
        {!boss.defeated && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full bg-destructive/20 blur-2xl animate-glow-pulse" />
          </div>
        )}
      </div>

      {/* HP Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">HP</span>
          <span className="text-sm font-bold text-destructive">{boss.currentHp} / {boss.maxHp}</span>
        </div>
        <div className="stats-bar h-4 border-destructive/30">
          <div 
            className="stats-bar-fill bg-destructive transition-all duration-500"
            style={{ width: `${hpPercentage}%` }}
          />
        </div>
      </div>

      {/* Battle Button */}
      {!boss.defeated && (
        <Button 
          onClick={() => navigate('/battle')}
          className="w-full gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          size="lg"
        >
          <Swords className="w-5 h-5" />
          بدء المعركة
        </Button>
      )}

      {boss.defeated && (
        <div className="text-center py-4 rounded-lg bg-secondary/20 border border-secondary/40">
          <span className="text-secondary font-bold">تم القضاء على العادة السيئة!</span>
        </div>
      )}
    </div>
  );
};