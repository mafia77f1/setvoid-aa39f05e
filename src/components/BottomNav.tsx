import { useLocation, Link } from 'react-router-dom';
import { User, Swords, Target, BarChart3, Flag } from 'lucide-react';

const navItems = [
  { path: '/', icon: User, label: 'الشخصية' },
  { path: '/quests', icon: Target, label: 'المهمات' },
  { path: '/boss', icon: Swords, label: 'الزعيم' },
  { path: '/stats', icon: BarChart3, label: 'الإحصائيات' },
  { path: '/grand-quest', icon: Flag, label: 'الهدف' },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-primary/30 bg-card/95 backdrop-blur-lg">
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
              <Icon className={`h-5 w-5 transition-all ${isActive ? 'scale-110 drop-shadow-[0_0_8px_hsl(200,100%,50%)]' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};