import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  TrendingUp,
  Brain,
  Shield,
  BookOpen,
  Settings,
  Bell,
  User,
  ChevronLeft,
  ChevronRight,
  Zap,
  Target,
  Swords,
  Sparkles,
  Clock,
  LogOut,
  ListChecks
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  userEmail?: string;
}

export function PremiumSidebar({ currentView, onViewChange, collapsed, onToggleCollapse, userEmail }: SidebarProps) {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'daily', label: 'Daily Schedule', icon: Clock, badge: 'NEW' },
    { id: 'military', label: 'Military Command', icon: Swords, badge: null },
    { id: 'combat', label: 'Combat Skills', icon: Target, badge: 'NEW' },
    { id: 'affirmations', label: 'I AM Declarations', icon: Sparkles, badge: 'NEW' },
    { id: 'tasks', label: 'Tasks', icon: ListChecks, badge: '19' },
    { id: 'commandments', label: 'Commandments', icon: Shield, badge: '10' },
    { id: 'progress', label: 'Analytics', icon: TrendingUp, badge: null },
    { id: 'ai-insights', label: 'AI Insights', icon: Brain, badge: '2' },
    { id: 'discipline', label: 'Discipline', icon: Shield, badge: '3' },
    { id: 'resources', label: 'Resources', icon: BookOpen, badge: null },
  ];

  const bottomItems = [
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: '5' },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      className="fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 shadow-2xl z-40 flex flex-col"
    >
      <div className="p-6 border-b border-slate-700/50">
        <motion.div
          initial={false}
          animate={{ justifyContent: collapsed ? 'center' : 'space-between' }}
          className="flex items-center"
        >
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-md opacity-75" />
                <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 p-2 rounded-xl">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Schedule Pro</h1>
                <p className="text-xs text-slate-400">AI-Powered</p>
              </div>
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleCollapse}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors ml-auto"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-slate-400" />
            )}
          </motion.button>
        </motion.div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl"
                  transition={{ type: 'spring', duration: 0.6 }}
                />
              )}
              <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-white' : ''}`} />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium relative z-10"
                >
                  {item.label}
                </motion.span>
              )}
              {!collapsed && item.badge && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`ml-auto px-2 py-0.5 text-xs font-bold rounded-full relative z-10 ${
                    isActive
                      ? 'bg-white text-blue-600'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}
                >
                  {item.badge}
                </motion.span>
              )}
              {collapsed && item.badge && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="p-3 border-t border-slate-700/50 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${
                isActive
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium"
                >
                  {item.label}
                </motion.span>
              )}
              {!collapsed && item.badge && (
                <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </motion.button>
          );
        })}

        <motion.div
          className={`${collapsed ? 'px-2' : 'px-4'} py-3 mt-4`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-semibold text-white truncate">{userEmail || 'Warrior'}</p>
                <p className="text-xs text-slate-400 truncate">Solo Leveler</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.aside>
  );
}
