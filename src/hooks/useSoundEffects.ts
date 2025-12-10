import { useCallback, useRef } from 'react';

// Sound URLs (using free sound effects)
const SOUNDS = {
  questComplete: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  attack: 'https://assets.mixkit.co/active_storage/sfx/2803/2803-preview.mp3',
  levelUp: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  bossDamage: 'https://assets.mixkit.co/active_storage/sfx/2801/2801-preview.mp3',
  victory: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  notification: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  useAbility: 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3',
  gameOver: 'https://assets.mixkit.co/active_storage/sfx/2658/2658-preview.mp3',
  purchase: 'https://assets.mixkit.co/active_storage/sfx/2580/2580-preview.mp3',
};

type SoundType = keyof typeof SOUNDS;

export const useSoundEffects = () => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  
  const playSound = useCallback((soundType: SoundType, volume: number = 0.5) => {
    const savedState = localStorage.getItem('levelUpLife');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      if (parsed.soundEnabled === false) return;
    }
    
    try {
      if (!audioRefs.current[soundType]) {
        audioRefs.current[soundType] = new Audio(SOUNDS[soundType]);
      }
      
      const audio = audioRefs.current[soundType];
      audio.volume = volume;
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Ignore autoplay errors
      });
    } catch (error) {
      console.log('Sound playback error:', error);
    }
  }, []);

  const playQuestComplete = useCallback(() => playSound('questComplete', 0.4), [playSound]);
  const playAttack = useCallback(() => playSound('attack', 0.3), [playSound]);
  const playLevelUp = useCallback(() => playSound('levelUp', 0.5), [playSound]);
  const playBossDamage = useCallback(() => playSound('bossDamage', 0.4), [playSound]);
  const playVictory = useCallback(() => playSound('victory', 0.5), [playSound]);
  const playNotification = useCallback(() => playSound('notification', 0.3), [playSound]);
  const playClick = useCallback(() => playSound('click', 0.2), [playSound]);
  const playUseAbility = useCallback(() => playSound('useAbility', 0.4), [playSound]);
  const playGameOver = useCallback(() => playSound('gameOver', 0.5), [playSound]);
  const playPurchase = useCallback(() => playSound('purchase', 0.4), [playSound]);

  return {
    playQuestComplete,
    playAttack,
    playLevelUp,
    playBossDamage,
    playVictory,
    playNotification,
    playClick,
    playUseAbility,
    playGameOver,
    playPurchase,
  };
};
