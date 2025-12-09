import { useLocation, Link } from 'react-router-dom';
import { User, Swords, Target, Zap, BarChart3, Trophy, Flag } from 'lucide-react';

const navItems = [
  { path: '/', icon: User, label: 'الشخصية' },
  { path: '/quests', icon: Target, label: 'المهمات' },
  { path: '/boss', icon: Swords, label: 'الزعيم' },
  { path: '/abilities', icon: Zap, label: 'القدرات' },
  { path: '/stats', icon: BarChart3, label: 'الإحصائيات' },
  { path: '/achievements', icon: Trophy, label: 'الإنجازات' },
  { path: '/grand-quest', icon: Flag, label: 'الهدف الكبير' },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className={`h-5 w-5 transition-all ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
