import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { User, X, Save } from 'lucide-react';

interface EditProfileModalProps {
  show: boolean;
  currentName: string;
  currentTitle: string;
  onSave: (name: string, title: string) => void;
  onClose: () => void;
}

export const EditProfileModal = ({ show, currentName, currentTitle, onSave, onClose }: EditProfileModalProps) => {
  const [name, setName] = useState(currentName);
  const [title, setTitle] = useState(currentTitle);
  const { playClick } = useSoundEffects();

  const handleSave = () => {
    if (name.trim() && title.trim()) {
      playClick();
      onSave(name.trim(), title.trim());
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={cn(
          "relative max-w-md w-full mx-auto animate-scale-in",
          "rounded-2xl border-2 border-primary/60 overflow-hidden",
          "bg-gradient-to-b from-card/95 to-background/95"
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        
        {/* Close Button */}
        <button
          onClick={() => { playClick(); onClose(); }}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Corner Decorations */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-primary/60" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-primary/60" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-primary/60" />

        <div className="p-6 pt-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/50 mb-4">
              <User className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-primary">تعديل الملف الشخصي</h3>
          </div>

          {/* Form */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-muted-foreground">الاسم</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="اسم اللاعب..."
                className={cn(
                  "w-full px-4 py-3 rounded-lg text-right",
                  "bg-background/50 border-2 border-primary/40",
                  "text-foreground placeholder:text-muted-foreground/50",
                  "focus:outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/20",
                  "transition-all"
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-muted-foreground">اللقب</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="لقب اللاعب..."
                className={cn(
                  "w-full px-4 py-3 rounded-lg text-right",
                  "bg-background/50 border-2 border-primary/40",
                  "text-foreground placeholder:text-muted-foreground/50",
                  "focus:outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/20",
                  "transition-all"
                )}
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!name.trim() || !title.trim()}
            className={cn(
              "w-full p-4 rounded-xl font-bold text-lg transition-all",
              "flex items-center justify-center gap-2",
              "bg-primary/20 border-2 border-primary/60 text-primary",
              "hover:bg-primary/30",
              "active:scale-95",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Save className="w-5 h-5" />
            حفظ التغييرات
          </button>
        </div>

        {/* Bottom Glow Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>
    </div>
  );
};
