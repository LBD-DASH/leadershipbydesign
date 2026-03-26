import { Link, useLocation } from 'react-router-dom';
import { Target, BarChart3, Megaphone, Phone, BookOpen } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/admin/os', label: 'Command Centre', icon: Target },
  { path: '/admin', label: 'Dashboard', icon: BarChart3 },
  { path: '/marketing', label: 'Marketing', icon: Megaphone },
  { path: '/cold-call-prompter', label: 'Call Prompter', icon: Phone },
  { path: '/admin/overviews', label: 'Overviews', icon: BookOpen },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

export default function AdminLayout({ children, hideNav }: AdminLayoutProps) {
  const { pathname } = useLocation();

  return (
    <div className="admin-dark min-h-screen bg-background">
      {!hideNav && (
        <nav className="sticky top-0 z-50 border-b border-border" style={{ background: 'hsl(212 58% 10%)' }}>
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-12">
            <span className="text-sm font-serif font-bold tracking-wide" style={{ color: 'hsl(41 50% 59%)' }}>
              LBD
            </span>
            <div className="flex items-center gap-0.5">
              {NAV_ITEMS.map(item => {
                const Icon = item.icon;
                const active = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors rounded-md"
                    style={{
                      color: active ? 'hsl(188 53% 35%)' : 'hsl(215 20% 65%)',
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">{item.label}</span>
                    {active && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full" style={{ background: 'hsl(188 53% 35%)' }} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      )}
      {children}
    </div>
  );
}
