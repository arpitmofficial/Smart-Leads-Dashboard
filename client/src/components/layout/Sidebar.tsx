import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { leadApi } from '../../api/leadApi';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [leadCount, setLeadCount] = useState<number | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const loadStats = async () => {
      try {
        const response = await leadApi.getStats();
        if (response.success && response.data && isMounted) {
          setLeadCount(response.data.total);
        }
      } catch {
        if (isMounted) {
          setLeadCount(null);
        }
      }
    };

    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/leads', icon: Users, label: 'Leads' },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 flex flex-col bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700 transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-surface-200 dark:border-surface-700 flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold text-surface-900 dark:text-white truncate">
            SmartLeads
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-200'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <span className="flex-1 flex items-center justify-between">
                <span>{label}</span>
                {label === 'Leads' && leadCount !== null && (
                  <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                    {leadCount}
                  </span>
                )}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-surface-200 dark:border-surface-700 p-3 flex-shrink-0">
        {!collapsed && user && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">
              {user.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Shield className="w-3 h-3 text-surface-400" />
              <span className="text-xs text-surface-500 dark:text-surface-400 capitalize">
                {user.role === UserRole.ADMIN ? 'Admin' : 'Sales User'}
              </span>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 flex items-center justify-center text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 shadow-sm transition-colors"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>
    </aside>
  );
};

export default Sidebar;
