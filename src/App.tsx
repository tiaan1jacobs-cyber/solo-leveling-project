import { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Download, Upload, Settings as SettingsIcon } from 'lucide-react';
import { TimeBlock, ChecklistProgress } from './types';
import { supabase } from './lib/supabase';
import { useScheduleData } from './hooks/useScheduleData';
import { useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { PremiumSidebar } from './components/PremiumSidebar';
import { Dashboard } from './components/Dashboard';
import { AdvancedScheduleEditor } from './components/AdvancedScheduleEditor';
import { EnhancedProgressDashboard } from './components/EnhancedProgressDashboard';
import { AIInsightsTab } from './components/AIInsightsTab';
import { EnhancedDisciplineTracker } from './components/EnhancedDisciplineTracker';
import { ResourceLibrary } from './components/ResourceLibrary';
import { TaskDetailModal } from './components/TaskDetailModal';
import { TimeBlockEditor } from './components/TimeBlockEditor';
import { FloatingActionMenu } from './components/FloatingActionMenu';
import { CommandPalette, useCommandPalette } from './components/CommandPalette';
import { TemplateSelector } from './components/TemplateSelector';
import TemplarCommandCenter from './components/TemplarCommandCenter';
import SoloLevelingCombat from './components/SoloLevelingCombat';
import DailyAffirmations from './components/DailyAffirmations';
import DailyScheduleView from './components/DailyScheduleView';
import NotificationsView from './components/NotificationsView';
import { SettingsView } from './components/SettingsView';
import { exportAllData, downloadExport, importAllData } from './utils/fullExport';

type View = 'dashboard' | 'schedule' | 'progress' | 'ai-insights' | 'discipline' | 'resources' | 'notifications' | 'settings' | 'military' | 'combat' | 'affirmations' | 'daily';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { templates, blocks, instructions, allResources, loading, reload } = useScheduleData();
  const [activeTemplateId, setActiveTemplateId] = useState('');
  const [completedBlocks, setCompletedBlocks] = useState<Set<string>>(new Set());
  const [checklistProgress, setChecklistProgress] = useState<ChecklistProgress[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<TimeBlock | null>(null);
  const [editingBlock, setEditingBlock] = useState<TimeBlock | null>(null);
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [viewParams, setViewParams] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [streak, setStreak] = useState(5);
  const [autoSaveEnabled] = useState(true);

  useEffect(() => {
    if (templates.length > 0 && !activeTemplateId) {
      setActiveTemplateId(templates[0].id);
    }
  }, [templates, activeTemplateId]);

  useEffect(() => {
    loadProgress();
    const savedStreak = localStorage.getItem('streak');
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');

    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
    if (savedSidebarState) setSidebarCollapsed(JSON.parse(savedSidebarState));
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const loadProgress = async () => {
    const today = new Date().toISOString().split('T')[0];

    const { data: progressData } = await supabase
      .from('user_progress')
      .select('time_block_id')
      .eq('completion_date', today);

    const { data: checklistData } = await supabase
      .from('checklist_progress')
      .select('*')
      .eq('completion_date', today);

    if (progressData) {
      setCompletedBlocks(new Set(progressData.map(p => p.time_block_id)));
    }

    if (checklistData) {
      setChecklistProgress(checklistData.map(c => ({
        id: c.id,
        userId: 'default',
        instructionId: c.instruction_id,
        completionDate: c.completion_date,
        completed: c.completed,
        completedAt: c.completed_at
      })));
    }
  };

  const currentBlocks = blocks.filter(block => block.templateId === activeTemplateId);

  const handleBlockClick = (block: TimeBlock) => {
    setSelectedBlock(block);
  };

  const handleBlocksReorder = async (newBlocks: TimeBlock[]) => {
    const updates = newBlocks.map((block, index) => ({
      id: block.id,
      order_index: index
    }));

    for (const update of updates) {
      await supabase
        .from('time_blocks')
        .update({ order_index: update.order_index })
        .eq('id', update.id);
    }

    await reload();
    if (autoSaveEnabled) {
      toast.success('Schedule auto-saved', { icon: '💾' });
    }
  };

  const handleBlockAdd = () => {
    setIsAddingBlock(true);
  };

  const handleBlockEdit = (block: TimeBlock) => {
    setEditingBlock(block);
  };

  const handleBlockDelete = async (blockId: string) => {
    await supabase
      .from('time_blocks')
      .delete()
      .eq('id', blockId);

    await reload();
  };

  const handleBlockDuplicate = async (block: TimeBlock) => {
    const newBlock = {
      template_id: block.templateId,
      start_time: block.startTime,
      end_time: block.endTime,
      title: `${block.title} (Copy)`,
      activity_type: block.activityType,
      order_index: block.orderIndex + 1,
      color: block.color
    };

    await supabase
      .from('time_blocks')
      .insert(newBlock);

    await reload();
  };

  const handleChecklistToggle = async (instructionId: string, completed: boolean) => {
    const today = new Date().toISOString().split('T')[0];

    const existing = checklistProgress.find(
      p => p.instructionId === instructionId && p.completionDate === today
    );

    if (existing) {
      await supabase
        .from('checklist_progress')
        .update({
          completed,
          completed_at: completed ? new Date().toISOString() : null
        })
        .eq('instruction_id', instructionId)
        .eq('completion_date', today);
    } else {
      await supabase
        .from('checklist_progress')
        .insert({
          instruction_id: instructionId,
          completion_date: today,
          completed,
          completed_at: completed ? new Date().toISOString() : null
        });
    }

    await loadProgress();
  };

  const handleMarkComplete = async () => {
    if (selectedBlock) {
      const today = new Date().toISOString().split('T')[0];

      await supabase
        .from('user_progress')
        .upsert({
          time_block_id: selectedBlock.id,
          completion_date: today,
          completed_at: new Date().toISOString()
        });

      const blockInstructions = instructions.filter(
        inst => inst.timeBlockId === selectedBlock.id && inst.isChecklistItem
      );

      for (const inst of blockInstructions) {
        await handleChecklistToggle(inst.id, true);
      }

      await loadProgress();
      setSelectedBlock(null);

      if (completedBlocks.size + 1 === currentBlocks.length) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem('streak', newStreak.toString());
      }

      toast.success('Task completed!', {
        icon: '✅',
        duration: 3000,
      });
    }
  };

  const handleExport = async () => {
    const data = await exportAllData();
    if (data) {
      downloadExport(data);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      await importAllData(file);
    };
    input.click();
  };

  const handleQuickComplete = () => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const currentBlock = currentBlocks.find(block =>
      block.startTime <= currentTime && block.endTime > currentTime
    );

    if (currentBlock && !completedBlocks.has(currentBlock.id)) {
      setSelectedBlock(currentBlock);
      toast.success('Current task opened!', { icon: '⚡' });
    } else {
      toast.error('No active task found', { icon: '❌' });
    }
  };

  const commands = [
    {
      id: 'nav-dashboard',
      label: 'Go to Dashboard',
      icon: motion.div,
      action: () => setCurrentView('dashboard'),
      category: 'Navigation',
      shortcut: '⌘1'
    },
    {
      id: 'nav-schedule',
      label: 'Go to Schedule',
      icon: motion.div,
      action: () => setCurrentView('schedule'),
      category: 'Navigation',
      shortcut: '⌘2'
    },
    {
      id: 'add-block',
      label: 'Add Time Block',
      icon: motion.div,
      action: handleBlockAdd,
      category: 'Actions',
      shortcut: '⌘N'
    },
    {
      id: 'toggle-dark',
      label: darkMode ? 'Light Mode' : 'Dark Mode',
      icon: darkMode ? Sun : Moon,
      action: () => setDarkMode(!darkMode),
      category: 'Settings',
      shortcut: '⌘D'
    },
    {
      id: 'export',
      label: 'Export Schedule',
      icon: Download,
      action: handleExport,
      category: 'Actions',
      shortcut: '⌘E'
    },
    {
      id: 'import',
      label: 'Import Schedule',
      icon: Upload,
      action: handleImport,
      category: 'Actions',
      shortcut: '⌘I'
    }
  ];

  const { isOpen: isCommandPaletteOpen, setIsOpen: setCommandPaletteOpen } = useCommandPalette(commands);

  const selectedBlockInstructions = selectedBlock
    ? instructions.filter(inst => inst.timeBlockId === selectedBlock.id)
    : [];

  const selectedBlockResources = selectedBlock
    ? allResources.filter(res => res.timeBlockId === selectedBlock.id)
    : [];

  const today = new Date().toISOString().split('T')[0];
  const todayChecklistProgress = checklistProgress.filter(p => p.completionDate === today);

  const currentTemplate = templates.find(t => t.id === activeTemplateId);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative mb-8">
            <div className="absolute inset-0 animate-ping bg-blue-500 rounded-full opacity-20" />
            <div className="relative w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mx-auto flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
              />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Your Schedule</h2>
          <p className="text-blue-200">Preparing your transformation dashboard...</p>
        </motion.div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!user) {
    return <Login />;
  }

  const isSoloLevelingView = currentView === 'combat' || currentView === 'affirmations' || currentView === 'daily' || currentView === 'schedule' || currentView === 'resources';

  return (
    <div
      className={`min-h-screen transition-colors duration-300`}
      style={isSoloLevelingView ? {
        background: 'linear-gradient(135deg, #0a0e1a 0%, #111827 50%, #1a1f35 100%)'
      } : {
        background: darkMode ? '#1e293b' : 'linear-gradient(135deg, #f8fafc 0%, #dbeafe 50%, #cffafe 100%)'
      }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: darkMode ? '#1e293b' : '#fff',
            color: darkMode ? '#fff' : '#1f2937',
            padding: '16px',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: darkMode ? '1px solid #334155' : '1px solid #e5e7eb',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
        }}
      />

      <PremiumSidebar
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view as View)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        userEmail={user?.email}
      />

      <div
        className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-[280px]'}`}
        style={{ minHeight: '100vh' }}
      >
        <header className={`sticky top-0 z-30 backdrop-blur-lg border-b ${
          darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/80 border-gray-200'
        } shadow-lg`}>
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentView === 'dashboard' && 'Dashboard'}
                {currentView === 'schedule' && 'Schedule Manager'}
                {currentView === 'progress' && 'Performance Analytics'}
                {currentView === 'ai-insights' && 'AI Intelligence'}
                {currentView === 'discipline' && 'Discipline Tracker'}
                {currentView === 'resources' && 'Resource Library'}
                {currentView === 'military' && 'Military Command Center'}
                {currentView === 'combat' && 'Combat Mastery System'}
                {currentView === 'affirmations' && 'Daily Affirmations'}
                {currentView === 'daily' && 'Daily Schedule'}
                {currentView === 'settings' && 'Settings'}
              </h2>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                {currentTemplate?.name || 'Select a template'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCommandPaletteOpen(true)}
                className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 ${
                  darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                }`}
              >
                <span className="text-sm">Quick Actions</span>
                <kbd className="px-2 py-0.5 bg-slate-900/10 rounded text-xs font-mono">⌘K</kbd>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-xl transition-colors ${
                  darkMode ? 'bg-slate-700 text-yellow-400' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </header>

        <main className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentView === 'dashboard' && (
                <Dashboard
                  blocks={currentBlocks}
                  completedBlocks={completedBlocks}
                  streak={streak}
                  currentTemplate={currentTemplate?.name || ''}
                />
              )}

              {currentView === 'schedule' && (
                <div className="space-y-6">
                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-6 shadow-xl`}>
                    <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Schedule Template
                    </h3>
                    <TemplateSelector
                      templates={templates}
                      activeTemplateId={activeTemplateId}
                      onTemplateChange={setActiveTemplateId}
                    />
                  </div>

                  <AdvancedScheduleEditor
                    blocks={currentBlocks}
                    completedBlocks={completedBlocks}
                    onBlockClick={handleBlockClick}
                    onBlocksReorder={handleBlocksReorder}
                    onBlockAdd={handleBlockAdd}
                    onBlockEdit={handleBlockEdit}
                    onBlockDelete={handleBlockDelete}
                    onBlockDuplicate={handleBlockDuplicate}
                  />
                </div>
              )}

              {currentView === 'progress' && (
                <EnhancedProgressDashboard
                  blocks={currentBlocks}
                  completedBlocks={completedBlocks}
                  streak={streak}
                />
              )}

              {currentView === 'ai-insights' && <AIInsightsTab />}

              {currentView === 'discipline' && <EnhancedDisciplineTracker />}

              {currentView === 'resources' && <ResourceLibrary resources={allResources} />}

              {currentView === 'military' && <TemplarCommandCenter />}

              {currentView === 'combat' && <SoloLevelingCombat />}

              {currentView === 'affirmations' && <DailyAffirmations />}

              {currentView === 'daily' && <DailyScheduleView initialDay={viewParams?.day} initialBlockId={viewParams?.blockId} />}

              {currentView === 'notifications' && <NotificationsView onNavigate={(view, params) => {
                setCurrentView(view as View);
                setViewParams(params);
              }} />}

              {currentView === 'settings' && (
                <SettingsView
                  onExport={handleExport}
                  onImport={handleImport}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <FloatingActionMenu
        onAddBlock={handleBlockAdd}
        onQuickComplete={handleQuickComplete}
        onExport={handleExport}
        onImport={handleImport}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        commands={commands}
      />

      {selectedBlock && (
        <TaskDetailModal
          block={selectedBlock}
          instructions={selectedBlockInstructions}
          resources={selectedBlockResources}
          checklistProgress={todayChecklistProgress}
          onClose={() => setSelectedBlock(null)}
          onChecklistToggle={handleChecklistToggle}
          onMarkComplete={handleMarkComplete}
        />
      )}

      {(editingBlock || isAddingBlock) && (
        <TimeBlockEditor
          block={editingBlock}
          templateId={activeTemplateId}
          onClose={() => {
            setEditingBlock(null);
            setIsAddingBlock(false);
          }}
          onSave={() => {
            reload();
            setEditingBlock(null);
            setIsAddingBlock(false);
            toast.success('Block saved successfully!', { icon: '💾' });
          }}
        />
      )}
    </div>
  );
}

export default App;
