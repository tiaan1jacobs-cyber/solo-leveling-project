import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Zap,
  Calendar,
  Clock,
  CheckCircle,
  TrendingUp,
  X,
  Download,
  Upload,
  Settings
} from 'lucide-react';

interface FloatingActionMenuProps {
  onAddBlock: () => void;
  onQuickComplete: () => void;
  onExport: () => void;
  onImport: () => void;
}

export function FloatingActionMenu({
  onAddBlock,
  onQuickComplete,
  onExport,
  onImport
}: FloatingActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: Plus,
      label: 'Add Block',
      onClick: onAddBlock,
      color: 'from-blue-600 to-cyan-600',
      hoverColor: 'from-blue-700 to-cyan-700'
    },
    {
      icon: CheckCircle,
      label: 'Quick Complete',
      onClick: onQuickComplete,
      color: 'from-green-600 to-emerald-600',
      hoverColor: 'from-green-700 to-emerald-700'
    },
    {
      icon: Download,
      label: 'Export',
      onClick: onExport,
      color: 'from-purple-600 to-pink-600',
      hoverColor: 'from-purple-700 to-pink-700'
    },
    {
      icon: Upload,
      label: 'Import',
      onClick: onImport,
      color: 'from-orange-600 to-amber-600',
      hoverColor: 'from-orange-700 to-amber-700'
    }
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-20 right-0 space-y-3"
          >
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, x: 20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <motion.span
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-gray-900 whitespace-nowrap"
                  >
                    {action.label}
                  </motion.span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      action.onClick();
                      setIsOpen(false);
                    }}
                    className={`w-14 h-14 bg-gradient-to-r ${action.color} hover:${action.hoverColor} rounded-full shadow-xl flex items-center justify-center transition-all`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all relative ${
          isOpen
            ? 'bg-gray-900'
            : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-7 h-7 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <Zap className="w-7 h-7 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {!isOpen && (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full"
          />
        )}
      </motion.button>
    </div>
  );
}
