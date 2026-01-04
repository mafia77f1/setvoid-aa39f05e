import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useGameState } from "@/hooks/useGameState";
import { LevelUpModal } from "@/components/LevelUpModal";
import { GameOverModal } from "@/components/GameOverModal";

import Index from "./pages/Index";
import Quests from "./pages/Quests";
import Gates from "./pages/Gates";
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
  const { gameState, levelUpInfo, dismissLevelUp, resetGame } = useGameState();

  if (!gameState.isOnboarded) {
    return <Onboarding />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/quests" element={<Quests />} />
        <Route path="/gates" element={<Gates />} />
        <Route path="/battle" element={<Battle />} />
        <Route path="/abilities" element={<Abilities />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/grand-quest" element={<GrandQuest />} />
        <Route path="/market" element={<Market />} />
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
      
      {gameState.hp <= 0 && (
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
