import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  Target,
  Sparkles,
  Calendar,
  Zap
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { soloLevelingTheme } from '../styles/soloLevelingTokens';

interface ScheduleBlock {
  id: string;
  time: string;
  endTime: string;
  activity: string;
  type: string;
  xpReward: number;
  dayOfWeek?: string;
}

interface NotificationsViewProps {
  onNavigate?: (view: string, params?: { day?: string; blockId?: string }) => void;
}

export default function NotificationsView({ onNavigate }: NotificationsViewProps) {
  const [todayTasks, setTodayTasks] = useState<ScheduleBlock[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [currentTime] = useState(new Date());

  useEffect(() => {
    loadTodaySchedule();
  }, []);

  const loadTodaySchedule = async () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    try {
      const { data, error } = await supabase
        .from('daily_schedule_blocks')
        .select('*')
        .eq('day_of_week', today)
        .order('time', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const blocks: ScheduleBlock[] = data.map(block => ({
          id: block.block_id,
          time: block.time,
          endTime: block.end_time,
          activity: block.activity,
          type: block.type,
          xpReward: block.xp_reward,
          dayOfWeek: today
        }));
        setTodayTasks(blocks);
      } else {
        loadDefaultSchedule(today);
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
      loadDefaultSchedule(today);
    }
  };

  const loadDefaultSchedule = (day: string) => {
    const isWeekend = day === 'Saturday' || day === 'Sunday';

    const weekdaySchedule: ScheduleBlock[] = [
      { id: 'wake', time: '06:30', endTime: '07:00', activity: 'Wake Up + Core Declarations', type: 'affirmations', xpReward: 35, dayOfWeek: day },
      { id: 'meditation', time: '07:00', endTime: '07:20', activity: 'Meditation + Mental Mantras', type: 'affirmations', xpReward: 30, dayOfWeek: day },
      { id: 'breakfast', time: '07:20', endTime: '08:00', activity: 'Breakfast + Physical Affirmations', type: 'affirmations', xpReward: 25, dayOfWeek: day },
      { id: 'skill', time: '08:00', endTime: '08:45', activity: 'Morning Skill Training', type: 'training', xpReward: 10, dayOfWeek: day },
      { id: 'work', time: '09:00', endTime: '12:00', activity: 'Deep Work + Business Mantras', type: 'business', xpReward: 40, dayOfWeek: day },
      { id: 'lunch', time: '12:00', endTime: '13:00', activity: 'Lunch + Creatine', type: 'core', xpReward: 10, dayOfWeek: day },
      { id: 'work2', time: '13:00', endTime: '15:00', activity: 'Deep Work Block 2', type: 'work', xpReward: 20, dayOfWeek: day },
      { id: 'tennis', time: '15:00', endTime: '17:30', activity: 'Tennis Practice', type: 'training', xpReward: 30, dayOfWeek: day },
      { id: 'dinner', time: '17:30', endTime: '18:30', activity: 'Dinner + Recovery', type: 'core', xpReward: 10, dayOfWeek: day },
      { id: 'weapons1', time: '18:30', endTime: '19:00', activity: 'Weapons Training Pt.1', type: 'training', xpReward: 25, dayOfWeek: day },
      { id: 'da', time: '19:00', endTime: '20:00', activity: 'DA Job - AI Business', type: 'da', xpReward: 15, dayOfWeek: day },
      { id: 'weapons2', time: '20:00', endTime: '21:30', activity: 'Weapons Training Pt.2', type: 'training', xpReward: 25, dayOfWeek: day },
      { id: 'evening', time: '21:30', endTime: '23:30', activity: 'Evening Business + Wind Down', type: 'business', xpReward: 20, dayOfWeek: day },
      { id: 'reflection', time: '23:30', endTime: '00:00', activity: 'Evening Reflection', type: 'core', xpReward: 15, dayOfWeek: day },
    ];

    const weekendSchedule: ScheduleBlock[] = [
      { id: 'wake', time: '06:30', endTime: '07:00', activity: 'Wake Up + Core Declarations', type: 'affirmations', xpReward: 35, dayOfWeek: day },
      { id: 'meditation', time: '07:00', endTime: '07:20', activity: 'Meditation + Mental Mantras', type: 'affirmations', xpReward: 30, dayOfWeek: day },
      { id: 'breakfast', time: '07:20', endTime: '08:00', activity: 'Breakfast + Physical Affirmations', type: 'affirmations', xpReward: 25, dayOfWeek: day },
      { id: 'skill', time: '08:00', endTime: '08:45', activity: 'Morning Skill Training', type: 'training', xpReward: 10, dayOfWeek: day },
      { id: 'work', time: '09:00', endTime: '12:00', activity: 'Deep Work + Business Mantras', type: 'business', xpReward: 40, dayOfWeek: day },
      { id: 'lunch', time: '12:00', endTime: '13:00', activity: 'Lunch + Creatine', type: 'core', xpReward: 10, dayOfWeek: day },
      { id: 'work2', time: '13:00', endTime: '15:00', activity: 'Deep Work Block 2', type: 'work', xpReward: 20, dayOfWeek: day },
      { id: 'combat-intensive', time: '15:00', endTime: '17:30', activity: 'Combat Intensive Training', type: 'training', xpReward: 40, dayOfWeek: day },
      { id: 'dinner', time: '17:30', endTime: '18:30', activity: 'Dinner + Recovery', type: 'core', xpReward: 10, dayOfWeek: day },
      { id: 'weapons1', time: '18:30', endTime: '19:00', activity: 'Weapons Training Pt.1', type: 'training', xpReward: 25, dayOfWeek: day },
      { id: 'personal-dev', time: '19:00', endTime: '20:00', activity: 'Personal Development', type: 'core', xpReward: 20, dayOfWeek: day },
      { id: 'weapons2', time: '20:00', endTime: '21:30', activity: 'Weapons Training Pt.2', type: 'training', xpReward: 25, dayOfWeek: day },
      { id: 'evening', time: '21:30', endTime: '23:30', activity: 'Evening Business + Wind Down', type: 'business', xpReward: 20, dayOfWeek: day },
      { id: 'reflection', time: '23:30', endTime: '00:00', activity: 'Evening Reflection', type: 'core', xpReward: 15, dayOfWeek: day },
    ];

    setTodayTasks(isWeekend ? weekendSchedule : weekdaySchedule);
  };

  const toggleTask = (taskId: string) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };

  const handleTaskClick = (task: ScheduleBlock, event: React.MouseEvent) => {
    const clickedCheckbox = (event.target as HTMLElement).closest('.task-checkbox');

    if (clickedCheckbox) {
      toggleTask(task.id);
    } else if (task.dayOfWeek) {
      onNavigate?.('daily', { day: task.dayOfWeek, blockId: task.id });
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'affirmations': return <Sparkles className="w-5 h-5" />;
      case 'training': return <Target className="w-5 h-5" />;
      case 'business': return <Flame className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const isTaskCurrent = (task: ScheduleBlock) => {
    const now = currentTime;
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const [startHour, startMin] = task.time.split(':').map(Number);
    const [endHour, endMin] = task.endTime.split(':').map(Number);

    const currentMinutes = hours * 60 + minutes;
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  };

  const isTaskUpcoming = (task: ScheduleBlock) => {
    const now = currentTime;
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const [startHour, startMin] = task.time.split(':').map(Number);

    const currentMinutes = hours * 60 + minutes;
    const startMinutes = startHour * 60 + startMin;
    const timeDiff = startMinutes - currentMinutes;

    return timeDiff > 0 && timeDiff <= 60;
  };

  const completedTasksCount = completedTasks.size;
  const totalTasks = todayTasks.length;
  const progressPercentage = Math.round((completedTasksCount / totalTasks) * 100);
  const totalXP = todayTasks.reduce((sum, task) => sum + task.xpReward, 0);
  const earnedXP = todayTasks
    .filter(task => completedTasks.has(task.id))
    .reduce((sum, task) => sum + task.xpReward, 0);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="flex gap-6 h-full">
      {/* Left Sidebar - Daily Checklist */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-80 flex-shrink-0"
      >
        <div
          className="sticky top-0 rounded-2xl p-6 h-[calc(100vh-120px)] overflow-y-auto"
          style={{
            background: soloLevelingTheme.background.card,
            border: `1px solid ${soloLevelingTheme.border.default}`,
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="p-3 rounded-xl"
              style={{
                background: `${soloLevelingTheme.glow.primary}20`,
                border: `1px solid ${soloLevelingTheme.glow.primary}40`,
              }}
            >
              <Calendar className="w-6 h-6" style={{ color: soloLevelingTheme.glow.primary }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Today's Mission</h2>
              <p className="text-slate-400 text-sm">{today}</p>
            </div>
          </div>

          <div className="mb-6 p-4 rounded-xl" style={{
            background: `${soloLevelingTheme.glow.primary}10`,
            border: `1px solid ${soloLevelingTheme.glow.primary}40`,
          }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-400">Progress</span>
              <span className="text-sm font-bold text-white">{completedTasksCount}/{totalTasks}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${progressPercentage}%`,
                  background: `linear-gradient(90deg, ${soloLevelingTheme.glow.primary}, ${soloLevelingTheme.glow.secondary})`,
                }}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">XP Earned</span>
              <span className="text-sm font-bold" style={{ color: soloLevelingTheme.glow.secondary }}>
                {earnedXP}/{totalXP}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {todayTasks.map((task) => {
              const isCurrent = isTaskCurrent(task);
              const isCompleted = completedTasks.has(task.id);

              return (
                <motion.div
                  key={task.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-3 rounded-lg cursor-pointer transition-all"
                  style={{
                    background: isCurrent
                      ? `${soloLevelingTheme.glow.primary}20`
                      : isCompleted
                      ? soloLevelingTheme.background.secondary
                      : 'transparent',
                    border: `1px solid ${
                      isCurrent
                        ? soloLevelingTheme.glow.primary
                        : soloLevelingTheme.border.default
                    }`,
                    opacity: isCompleted ? 0.6 : 1,
                  }}
                  onClick={(e) => handleTaskClick(task, e)}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 task-checkbox" onClick={(e) => e.stopPropagation()}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isCompleted ? 'line-through text-slate-500' : 'text-white'}`}>
                        {task.activity}
                      </p>
                      <p className="text-xs text-slate-400">{task.time}</p>
                    </div>
                    {isCurrent && (
                      <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40">
                        NOW
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Right Content - Detailed View */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1"
      >
        <div
          className="rounded-2xl p-8"
          style={{
            background: soloLevelingTheme.background.card,
            border: `1px solid ${soloLevelingTheme.border.default}`,
          }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div
                className="p-4 rounded-xl"
                style={{
                  background: `${soloLevelingTheme.glow.primary}20`,
                  border: `2px solid ${soloLevelingTheme.glow.primary}`,
                  boxShadow: soloLevelingTheme.shadow.glow,
                }}
              >
                <Bell className="w-8 h-8" style={{ color: soloLevelingTheme.glow.primary }} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Daily Notifications</h1>
                <p className="text-slate-400">Tasks requiring your attention</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold text-white mb-1">{progressPercentage}%</div>
              <div className="text-sm text-slate-400">Complete</div>
            </div>
          </div>

          <div className="space-y-4">
            {todayTasks.map((task, index) => {
              const isCurrent = isTaskCurrent(task);
              const isUpcoming = isTaskUpcoming(task);
              const isCompleted = completedTasks.has(task.id);

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="p-5 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
                  style={{
                    background: isCurrent
                      ? `${soloLevelingTheme.glow.primary}20`
                      : isCompleted
                      ? soloLevelingTheme.background.secondary
                      : soloLevelingTheme.background.card,
                    border: `1px solid ${
                      isCurrent
                        ? soloLevelingTheme.glow.primary
                        : isUpcoming
                        ? soloLevelingTheme.stats.warning
                        : soloLevelingTheme.border.default
                    }`,
                    boxShadow: isCurrent ? soloLevelingTheme.shadow.glow : 'none',
                    opacity: isCompleted ? 0.7 : 1,
                  }}
                  onClick={(e) => handleTaskClick(task, e)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 task-checkbox" onClick={(e) => e.stopPropagation()}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-7 h-7 text-green-400" />
                      ) : (
                        <Circle className="w-7 h-7 text-slate-500" />
                      )}
                    </div>
                    <div className="flex-shrink-0" style={{ color: soloLevelingTheme.glow.cyan }}>
                      {getTaskIcon(task.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${isCompleted ? 'line-through text-slate-500' : 'text-white'}`}>
                        {task.activity}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-slate-400">{task.time} - {task.endTime}</span>
                        {isCurrent && (
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 font-semibold">
                            ACTIVE NOW
                          </span>
                        )}
                        {isUpcoming && !isCurrent && (
                          <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 font-semibold">
                            UPCOMING
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-base font-bold" style={{ color: soloLevelingTheme.glow.secondary }}>
                      <Zap className="w-5 h-5" />
                      <span>{task.xpReward} XP</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
