import { User } from 'lucide-react';

interface CharacterAvatarProps {
  name: string;
  totalLevel: number;
}

export const CharacterAvatar = ({ name, totalLevel }: CharacterAvatarProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Avatar circle */}
        <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-primary/50 bg-gradient-to-br from-primary/30 to-accent">
          <User className="h-14 w-14 text-primary" />
        </div>
        
        {/* Level badge */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-bold text-primary-foreground shadow-lg">
          LVL {totalLevel}
        </div>
      </div>
      
      <h2 className="mt-6 text-2xl font-bold">{name}</h2>
      <p className="text-muted-foreground">محارب التطوير الذاتي</p>
    </div>
  );
};
