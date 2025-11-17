import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Calendar,
  TrendingUp,
  Brain,
  Shield,
  BookOpen,
  Plus,
  Edit,
  Trash,
  Copy,
  Download,
  Settings,
  Moon,
  Sun,
  Zap
} from 'lucide-react';

interface Command {
  id: string;
  label: string;
  icon: any;
  action: () => void;
  category: string;
  shortcut?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: Command[];
}

export function CommandPalette({ isOpen, onClose, commands }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  let commandIndex = -1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-32"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Search commands..."
                className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400"
              />
              <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-mono text-gray-600">
                ESC
              </kbd>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto p-2">
            {Object.entries(groupedCommands).map(([category, cmds]) => (
              <div key={category} className="mb-4">
                <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {category}
                </div>
                <div className="space-y-1">
                  {cmds.map((cmd) => {
                    commandIndex++;
                    const isSelected = commandIndex === selectedIndex;
                    const Icon = cmd.icon;

                    return (
                      <motion.button
                        key={cmd.id}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => {
                          cmd.action();
                          onClose();
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                        <span className="flex-1 text-left font-medium">{cmd.label}</span>
                        {cmd.shortcut && (
                          <kbd
                            className={`px-2 py-1 rounded text-xs font-mono ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {cmd.shortcut}
                          </kbd>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}

            {filteredCommands.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600">No commands found</p>
                <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded font-mono">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded font-mono">↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded font-mono">Enter</kbd>
                Select
              </span>
            </div>
            <span className="flex items-center gap-1">
              Press
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded font-mono">⌘K</kbd>
              to open
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function useCommandPalette(commands: Command[]) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isOpen, setIsOpen, commands };
}
