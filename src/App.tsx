import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useGameState } from "@/hooks/useGameState";
import { LevelUpModal } from "@/components/LevelUpModal";
import { GameOverModal } from "@/components/GameOverModal";
import { PenaltyZoneScreen } from "@/components/PenaltyZoneScreen"; // تأكد من صحة مسار الملف

import Index from "./pages/Index";
import Quests from "./pages/Quests";
import Boss from "./pages/Boss";
import Battle from "./pages/Battle";
import Abilities from "./pages/Abilities";
import Stats from "./pages/Stats";
import Achievements from "./pages/Achievements";
import GrandQuest from "./pages/GrandQuest";
import Market from "./pages/Market";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { gameState, levelUpInfo, dismissLevelUp, resetGame, updateStats } = useGameState();

  if (!gameState.isOnboarded) {
    return <Onboarding />;
  }

  // دالة التعامل مع الضرر في منطقة العقاب
  const handlePenaltyDamage = (damage: number) => {
    updateStats({ hp: Math.max(0, gameState.hp - damage) });
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/quests" element={<Quests />} />
        <Route path="/boss" element={<Boss />} />
        <Route path="/battle" element={<Battle />} />
        <Route path="/abilities" element={<Abilities />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/grand-quest" element={<GrandQuest />} />
        <Route path="/market" element={<Market />} />
        
        {/* إلحاق مسار منطقة العقاب الجديد */}
        <Route 
          path="/penalty" 
          element={
            <PenaltyZoneScreen 
              endTime={gameState.penaltyEndTime || new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()} 
              playerHp={gameState.hp}
              maxPlayerHp={gameState.maxHp}
              shadowPoints={gameState.shadowPoints || 0}
              onTimeComplete={() => window.location.href = '/'} // العودة للرئيسية عند انتهاء الوقت
              onPlayerDamage={handlePenaltyDamage}
              onRevive={() => updateStats({ hp: gameState.maxHp, shadowPoints: (gameState.shadowPoints || 0) - 50 })}
              onExit={() => window.location.href = '/'} 
            />
          } 
        />

        <Route path="/onboarding" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {levelUpInfo && (
        <LevelUpModal
          show={levelUpInfo.show}
          newLevel={levelUpInfo.newLevel}
          category={levelUpInfo.category}
          onDismiss={dismissLevelUp}
        />
      )}
      
      {/* عرض شاشة الموت فقط إذا لم نكن في صفحة العقاب (لأن صفحة العقاب لديها شاشة موت خاصة بها) */}
      {gameState.hp <= 0 && window.location.pathname !== '/penalty' && (
        <GameOverModal
          show={true}
          onRestart={resetGame}
        />
      )}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
