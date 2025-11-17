import { useState, useEffect } from 'react';
import { Clock, Monitor, BookOpen, Dumbbell, Coffee, Moon, Edit2, Plus, Trash2, RotateCcw } from 'lucide-react';
import { weeklySchedule, DailyBlock } from '../data/militarySchedule';
import { ScheduleInstructionEditor } from './ScheduleInstructionEditor';
import { ScheduleBlockEditor } from './ScheduleBlockEditor';
import { EnhancedTaskModal } from './EnhancedTaskModal';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function MilitaryDailyView() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [editingBlock, setEditingBlock] = useState<DailyBlock | null>(null);
  const [editingScheduleBlock, setEditingScheduleBlock] = useState<any>(null);
  const [selectedBlock, setSelectedBlock] = useState<DailyBlock | null>(null);
  const [customBlocks, setCustomBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showManageMode, setShowManageMode] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = dayNames[currentTime.getDay()];

  useEffect(() => {
    loadCustomSchedule();
  }, [today]);

  const loadCustomSchedule = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('daily_schedule_blocks')
        .select('*')
        .eq('user_id', user.id)
        .eq('day_of_week', today)
        .order('time');

      if (error) throw error;

      if (data && data.length > 0) {
        setCustomBlocks(data);
      } else {
        setCustomBlocks([]);
      }
    } catch (error) {
      console.error('Error loading custom schedule:', error);
      toast.error('Failed to load custom schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm('Are you sure you want to delete this schedule block?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('daily_schedule_blocks')
        .delete()
        .eq('id', blockId);

      if (error) throw error;

      toast.success('Schedule block deleted');
      loadCustomSchedule();
    } catch (error) {
      console.error('Error deleting block:', error);
      toast.error('Failed to delete block');
    }
  };

  const handleResetToDefault = async () => {
    if (!confirm('Reset to default schedule? This will delete all your custom blocks for this day.')) {
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('daily_schedule_blocks')
        .delete()
        .eq('user_id', user.id)
        .eq('day_of_week', today);

      if (error) throw error;

      toast.success('Reset to default schedule');
      loadCustomSchedule();
    } catch (error) {
      console.error('Error resetting schedule:', error);
      toast.error('Failed to reset schedule');
    }
  };

  const todaySchedule = customBlocks.length > 0
    ? { day: today, blocks: customBlocks.map(block => ({
        id: block.block_id,
        time: block.time,
        endTime: block.end_time,
        activity: block.activity,
        description: block.description,
        type: block.type,
        isDA: block.is_da,
        dbId: block.id
      }))}
    : weeklySchedule.find(s => s.day === today);

  if (!todaySchedule) return null;

  const getBlockIcon = (type: string) => {
    if (type === 'da') return Monitor;
    if (type === 'training') return Dumbbell;
    if (type === 'class') return BookOpen;
    if (type === 'core') return Coffee;
    if (type === 'recovery') return Moon;
    return Clock;
  };

  const getBlockColor = (type: string) => {
    if (type === 'da') return 'bg-red-900/60 border-red-700';
    if (type === 'training') return 'bg-orange-900/50 border-orange-700';
    if (type === 'class') return 'bg-blue-900/50 border-blue-700';
    if (type === 'core') return 'bg-green-900/50 border-green-700';
    if (type === 'recovery') return 'bg-purple-900/50 border-purple-700';
    return 'bg-gray-800/80 border-gray-600';
  };

  const isCurrentBlock = (block: DailyBlock) => {
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const [startHour, startMin] = block.time.split(':').map(Number);
    const [endHour, endMin] = block.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  };

  const getTimeUntilNext = (block: DailyBlock) => {
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const [startHour, startMin] = block.time.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;

    if (currentMinutes < startMinutes) {
      const diff = startMinutes - currentMinutes;
      const hours = Math.floor(diff / 60);
      const mins = diff % 60;
      return `in ${hours}h ${mins}m`;
    }
    return null;
  };

  const isClassDay = today === 'Tuesday' || today === 'Thursday';
  const usingCustomSchedule = customBlocks.length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading schedule...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className={`p-6 rounded-lg border-2 relative overflow-hidden ${isClassDay ? 'border-blue-600' : 'border-red-600'}`}
        style={{
          backgroundImage: 'url(/schedule_header.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: isClassDay
              ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.85) 0%, rgba(17, 24, 39, 0.9) 100%)'
              : 'linear-gradient(135deg, rgba(127, 29, 29, 0.85) 0%, rgba(17, 24, 39, 0.9) 100%)',
          }}
        />
        <div className="relative z-10 text-center">
          <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Today Is</div>
          <div className="text-4xl font-bold text-white mb-2">{today}</div>
          {isClassDay && (
            <div className="inline-block px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-lg">
              CLASS DAY - Classes 8:30-12:00
            </div>
          )}
          {!isClassDay && (
            <div className="inline-block px-4 py-2 bg-red-600 text-white font-bold rounded-lg text-lg">
              NO CLASSES - MAXIMIZE OUTPUT
            </div>
          )}
          <div className="text-gray-400 mt-2">{currentTime.toLocaleTimeString()}</div>
          {usingCustomSchedule && (
            <div className="mt-2 text-green-400 text-sm font-bold">
              ✓ Custom Schedule Active
            </div>
          )}
        </div>
      </div>

      <div className="bg-black border-2 border-red-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white tracking-wider flex items-center gap-3">
            <Clock className="w-8 h-8 text-red-500" />
            DAILY SCHEDULE
          </h2>
          <div className="flex items-center gap-2">
            {usingCustomSchedule && (
              <button
                onClick={handleResetToDefault}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-bold rounded-lg transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Reset to Default
              </button>
            )}
            <button
              onClick={() => setShowManageMode(!showManageMode)}
              className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg transition-colors ${
                showManageMode
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
              }`}
            >
              <Edit2 className="w-4 h-4" />
              {showManageMode ? 'Done Editing' : 'Manage Schedule'}
            </button>
          </div>
        </div>

        {showManageMode && (
          <div className="mb-4 p-4 bg-red-950/30 border-2 border-red-900 rounded-lg">
            <p className="text-gray-300 mb-3">
              <strong className="text-white">Schedule Management Mode:</strong> Add, edit, or delete time blocks. Changes are saved to your personal schedule.
            </p>
            <button
              onClick={() => setEditingScheduleBlock({})}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Time Block
            </button>
          </div>
        )}

        <div className="space-y-2">
          {todaySchedule.blocks.map((block) => {
            const Icon = getBlockIcon(block.type);
            const isCurrent = isCurrentBlock(block);
            const timeUntil = getTimeUntilNext(block);

            return (
              <div
                key={block.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isCurrent
                    ? 'border-red-500 bg-red-950/50 shadow-lg shadow-red-900/50'
                    : getBlockColor(block.type)
                }`}
              >
                <div className="flex items-start gap-4">
                  <Icon className={`w-6 h-6 flex-shrink-0 ${isCurrent ? 'text-red-400' : 'text-gray-200'}`} />

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-3">
                        <span className={`font-bold text-base ${isCurrent ? 'text-red-400' : 'text-white'}`}>
                          {block.time} - {block.endTime}
                        </span>
                        {block.isDA && (
                          <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                            DA JOB
                          </span>
                        )}
                        {isCurrent && (
                          <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded animate-pulse">
                            NOW
                          </span>
                        )}
                        {timeUntil && (
                          <span className="text-gray-300 text-sm font-medium">{timeUntil}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {!showManageMode && (
                          <button
                            onClick={() => setSelectedBlock(block)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded transition-colors"
                          >
                            VIEW
                          </button>
                        )}
                        <button
                          onClick={() => setEditingBlock(block)}
                          className="text-gray-300 hover:text-blue-400 transition-colors"
                          title="Edit instructions"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {showManageMode && (
                          <>
                            <button
                              onClick={() => {
                                if (block.dbId) {
                                  const customBlock = customBlocks.find(b => b.id === block.dbId);
                                  setEditingScheduleBlock(customBlock);
                                } else {
                                  setEditingScheduleBlock({
                                    block_id: block.id,
                                    time: block.time,
                                    end_time: block.endTime,
                                    activity: block.activity,
                                    description: block.description,
                                    type: block.type,
                                    is_da: block.isDA,
                                    order_index: 0
                                  });
                                }
                              }}
                              className="text-gray-300 hover:text-yellow-400 transition-colors"
                              title="Edit schedule block"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                            {block.dbId && (
                              <button
                                onClick={() => handleDeleteBlock(block.dbId)}
                                className="text-gray-300 hover:text-red-400 transition-colors"
                                title="Delete block"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className={`text-lg font-bold ${isCurrent ? 'text-white' : 'text-gray-100'}`}>
                      {block.activity}
                    </div>

                    {block.description && (
                      <div className="text-gray-200 text-sm mt-1">
                        {block.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {editingBlock && (
        <ScheduleInstructionEditor
          dayOfWeek={today}
          blockId={editingBlock.id}
          onClose={() => setEditingBlock(null)}
          onSave={() => {
            setEditingBlock(null);
          }}
        />
      )}

      {editingScheduleBlock !== null && (
        <ScheduleBlockEditor
          dayOfWeek={today}
          block={editingScheduleBlock.id ? editingScheduleBlock : undefined}
          onClose={() => setEditingScheduleBlock(null)}
          onSave={() => {
            setEditingScheduleBlock(null);
            loadCustomSchedule();
          }}
        />
      )}

      {selectedBlock && (
        <EnhancedTaskModal
          dayOfWeek={today}
          blockId={selectedBlock.id}
          activity={selectedBlock.activity}
          time={selectedBlock.time}
          endTime={selectedBlock.endTime}
          onClose={() => setSelectedBlock(null)}
        />
      )}
    </div>
  );
}
