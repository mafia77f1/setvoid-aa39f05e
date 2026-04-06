import { PenaltyZoneScreen } from '@/components/PenaltyZoneScreen';
import { useGameState } from '@/hooks/useGameState';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Penalty = () => {
  const navigate = useNavigate();
  const { gameState, clearPunishment } = useGameState();

  // Set punishment end time to 4 hours from now if not already set
  useEffect(() => {
    if (!gameState.punishmentEndTime) {
      // Will be set by applyPunishment in useGameState
    }
  }, []);

  const endTime = gameState.punishmentEndTime || new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();

  const handleTimeComplete = () => {
    clearPunishment();
    navigate('/');
  };

  return (
    <PenaltyZoneScreen 
      endTime={endTime} 
      onTimeComplete={handleTimeComplete} 
    />
  );
};

export default Penalty;
