import { QRCodeSVG } from 'qrcode.react';
import { cn } from '@/lib/utils';

interface PlayerQRCodeProps {
  playerId: string;
  playerName: string;
  size?: number;
  className?: string;
}

export const PlayerQRCode = ({ playerId, playerName, size = 120, className }: PlayerQRCodeProps) => {
  const qrValue = `setvoid://player/${playerId}`;
  
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="p-3 bg-white rounded-xl shadow-lg">
        <QRCodeSVG 
          value={qrValue}
          size={size}
          level="H"
          includeMargin={false}
          bgColor="#FFFFFF"
          fgColor="#000000"
        />
      </div>
      <div className="text-center">
        <p className="text-xs text-muted-foreground">معرف اللاعب</p>
        <p className="text-sm font-bold text-primary tracking-wider">{playerId}</p>
      </div>
    </div>
  );
};
