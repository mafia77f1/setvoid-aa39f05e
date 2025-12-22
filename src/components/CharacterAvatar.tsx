import { User, Shield } from 'lucide-react';

interface CharacterAvatarProps {
  name: string;
  totalLevel: number;
}

export const CharacterAvatar = ({ name, totalLevel }: CharacterAvatarProps) => {
  return (
    <div className="flex flex-col items-center group">
      <div className="relative">
        {/* Glow Background Effect */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all duration-500" />
        
        {/* Outer Ring */}
        <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed border-primary/40 p-1 animate-[spin_10s_linear_infinite]">
            {/* This div rotates slowly for a magical effect */}
        </div>

        {/* Main Avatar Container */}
        <div className="absolute inset-2 flex items-center justify-center rounded-full border-4 border-primary bg-gradient-to-tr from-slate-900 via-primary/20 to-slate-900 shadow-[0_0_20px_rgba(var(--primary),0.3)]">
          <User className="h-16 w-16 text-primary drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          
          {/* Decorative Icon */}
          <div className="absolute -top-1 -right-1 bg-background rounded-full p-1 border border-primary/50">
            <Shield className="h-4 w-4 text-accent" />
          </div>
        </div>
        
        {/* Level badge - Polished Look */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-md bg-gradient-to-r from-primary to-accent px-4 py-0.5 text-xs font-black tracking-tighter text-white shadow-[0_4px_10px_rgba(0,0,0,0.5)] border border-white/20">
          <span className="opacity-70 text-[10px]">LEVEL</span>
          <span className="text-lg leading-none">{totalLevel}</span>
        </div>
      </div>
      
      {/* Name and Title */}
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
          {name.toUpperCase()}
        </h2>
        <div className="flex items-center justify-center gap-2 mt-1">
            <span className="h-[1px] w-4 bg-primary/50"></span>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                محارب التطوير الذاتي
            </p>
            <span className="h-[1px] w-4 bg-primary/50"></span>
        </div>
      </div>
    </div>
  );
};
