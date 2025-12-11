import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { X, Play, Pause, SkipForward, Volume2, BookOpen, User } from 'lucide-react';

interface QuranRecitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedReciter: string;
  onReciterChange: (reciter: string) => void;
}

const reciters = [
  { id: 'alafasy', name: 'محمد اللحيدان', englishName: 'Muhammad Al-Luhaidan' },
  { id: 'aldosari', name: 'ياسر الدوسري', englishName: 'Yasser Al-Dosari' },
  { id: 'abdulbasit', name: 'عبد الباسط عبد الصمد', englishName: 'Abdul Basit' },
  { id: 'minshawi', name: 'محمد صديق المنشاوي', englishName: 'Al-Minshawi' },
];

// Sample Quran verses (you would expand this)
const sampleVerses = [
  { arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', translation: 'In the name of Allah, the Most Gracious, the Most Merciful' },
  { arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', translation: 'Praise be to Allah, Lord of all the worlds' },
  { arabic: 'الرَّحْمَٰنِ الرَّحِيمِ', translation: 'The Most Gracious, the Most Merciful' },
  { arabic: 'مَالِكِ يَوْمِ الدِّينِ', translation: 'Master of the Day of Judgment' },
  { arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', translation: 'You alone we worship, and You alone we ask for help' },
];

export const QuranRecitationModal = ({ 
  isOpen, 
  onClose, 
  selectedReciter,
  onReciterChange 
}: QuranRecitationModalProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [showReciterSelect, setShowReciterSelect] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setCurrentVerseIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setCurrentVerseIndex(prev => {
          if (prev >= sampleVerses.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 4000); // Change verse every 4 seconds

      return () => clearInterval(timer);
    }
  }, [isPlaying]);

  if (!isOpen) return null;

  const currentVerse = sampleVerses[currentVerseIndex];
  const currentReciter = reciters.find(r => r.name === selectedReciter) || reciters[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      {/* Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-quran/10 rounded-full blur-[100px] animate-aura-pulse" />
      </div>

      <div className="notification-panel max-w-lg w-full mx-auto animate-modal-appear relative border-quran/50">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 z-20 p-1 rounded hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="p-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded border border-quran/50 bg-quran/10">
              <BookOpen className="w-5 h-5 text-quran" />
              <span className="text-sm font-bold text-quran tracking-wider">تلاوة القرآن الكريم</span>
            </div>
          </div>

          {/* Reciter Selection */}
          <div className="mb-6">
            <button
              onClick={() => setShowReciterSelect(!showReciterSelect)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-card/50 border border-quran/30 hover:border-quran/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-quran" />
                <div className="text-right">
                  <div className="text-sm font-semibold">{currentReciter.name}</div>
                  <div className="text-xs text-muted-foreground">{currentReciter.englishName}</div>
                </div>
              </div>
              <span className="text-xs text-quran">تغيير</span>
            </button>

            {showReciterSelect && (
              <div className="mt-2 p-2 rounded-lg bg-card border border-quran/30 space-y-1">
                {reciters.map(reciter => (
                  <button
                    key={reciter.id}
                    onClick={() => {
                      onReciterChange(reciter.name);
                      setShowReciterSelect(false);
                    }}
                    className={cn(
                      "w-full p-2 rounded text-right transition-colors",
                      reciter.name === selectedReciter 
                        ? "bg-quran/20 text-quran" 
                        : "hover:bg-quran/10"
                    )}
                  >
                    <div className="text-sm font-semibold">{reciter.name}</div>
                    <div className="text-xs text-muted-foreground">{reciter.englishName}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Verse Display */}
          <div className="text-center py-8 px-4 rounded-lg bg-gradient-to-b from-card/80 to-card/40 border border-quran/20 mb-6 min-h-[200px] flex flex-col items-center justify-center">
            <p 
              className="text-3xl font-arabic leading-loose mb-4 text-quran animate-fade-in"
              style={{ textShadow: '0 0 20px hsl(150 60% 45% / 0.3)' }}
              key={currentVerseIndex}
            >
              {currentVerse.arabic}
            </p>
            <p className="text-sm text-muted-foreground italic">
              {currentVerse.translation}
            </p>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>الآية {currentVerseIndex + 1}</span>
              <span>{sampleVerses.length} آيات</span>
            </div>
            <div className="h-1 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full bg-quran transition-all duration-300"
                style={{ width: `${((currentVerseIndex + 1) / sampleVerses.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center transition-all",
                "bg-quran/20 border-2 border-quran/60 hover:bg-quran/30 hover:scale-105",
                isPlaying && "bg-quran/30"
              )}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-quran" />
              ) : (
                <Play className="w-8 h-8 text-quran mr-[-3px]" />
              )}
            </button>
            <button
              onClick={() => setCurrentVerseIndex(prev => Math.min(prev + 1, sampleVerses.length - 1))}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-quran/10 border border-quran/40 hover:bg-quran/20 transition-all"
            >
              <SkipForward className="w-5 h-5 text-quran" />
            </button>
          </div>

          {/* XP Reward Info */}
          <p className="text-center text-xs text-quran/70 mt-4">
            +20 XP لكل دقيقة استماع
          </p>
        </div>
      </div>
    </div>
  );
};
