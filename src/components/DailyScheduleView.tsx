import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle2,
  Circle,
  Sparkles,
  Target,
  Flame,
  Zap,
  ChevronRight,
  Brain,
  Dumbbell,
  Coffee,
  Moon,
  Timer,
  AlertCircle,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Download,
  Upload,
  FileText,
  Calendar
} from 'lucide-react';
import { soloLevelingTheme } from '../styles/soloLevelingTokens';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { EnhancedTaskModal } from './EnhancedTaskModal';

interface ScheduleBlock {
  id: string;
  time: string;
  endTime: string;
  activity: string;
  type: 'core' | 'training' | 'work' | 'da' | 'business' | 'class' | 'recovery' | 'affirmations';
  description?: string;
  affirmationCategory?: string;
  combatType?: string;
  xpReward: number;
  checklist?: string[];
  notes?: string[];
}

export default function DailyScheduleView() {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>([]);
  const [completedBlocks, setCompletedBlocks] = useState<Set<string>>(new Set());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedBlock, setSelectedBlock] = useState<ScheduleBlock | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBlock, setEditedBlock] = useState<ScheduleBlock | null>(null);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    setSelectedDay(today);
  }, []);

  useEffect(() => {
    if (selectedDay) {
      loadDaySchedule(selectedDay);
    }
  }, [selectedDay]);

  const loadDaySchedule = async (day: string) => {
    try {
      const { data, error } = await supabase
        .from('daily_schedule_blocks')
        .select('*')
        .eq('day_of_week', day)
        .order('time', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const blocks: ScheduleBlock[] = data.map(block => ({
          id: block.block_id,
          time: block.time,
          endTime: block.end_time,
          activity: block.activity,
          type: block.type,
          description: block.description,
          affirmationCategory: block.affirmation_category,
          combatType: block.combat_type,
          xpReward: block.xp_reward,
          checklist: Array.isArray(block.checklist) ? block.checklist : [],
          notes: Array.isArray(block.notes) ? block.notes : []
        }));
        setScheduleBlocks(blocks);
      } else {
        loadDefaultSchedule(day);
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
      loadDefaultSchedule(day);
    }
  };

  const loadDefaultSchedule = (day: string) => {
    const weekdaySchedule: ScheduleBlock[] = [
      { id: 'wake', time: '06:30', endTime: '07:00', activity: 'Wake Up + Core Declarations', type: 'affirmations', affirmationCategory: 'Core Identity', xpReward: 35, description: '7 "I AM" statements + Cold shower' },
      { id: 'meditation', time: '07:00', endTime: '07:20', activity: 'Meditation + Mental Mantras', type: 'affirmations', affirmationCategory: 'Mental Discipline', xpReward: 30 },
      { id: 'breakfast', time: '07:20', endTime: '08:00', activity: 'Breakfast + Physical Affirmations', type: 'affirmations', affirmationCategory: 'Physical Excellence', xpReward: 25, description: 'Fireblood supplement' },
      { id: 'skill', time: '08:00', endTime: '08:45', activity: 'Morning Skill Training', type: 'training', xpReward: 10, description: 'OSINT/Spy Skills' },
      { id: 'work', time: '09:00', endTime: '12:00', activity: 'Deep Work + Business Mantras', type: 'business', affirmationCategory: 'Business Warrior', xpReward: 40, description: 'AI Business - hourly affirmations' },
      { id: 'lunch', time: '12:00', endTime: '13:00', activity: 'Lunch + Creatine', type: 'core', xpReward: 10 },
      { id: 'work2', time: '13:00', endTime: '15:00', activity: 'Deep Work Block 2', type: 'work', xpReward: 20 },
      { id: 'tennis', time: '15:00', endTime: '17:30', activity: 'Tennis Practice', type: 'training', xpReward: 30, description: 'Hydration protocol critical' },
      { id: 'dinner', time: '17:30', endTime: '18:30', activity: 'Dinner + Recovery', type: 'core', xpReward: 10 },
      { id: 'weapons1', time: '18:30', endTime: '19:00', activity: 'Weapons Training Pt.1', type: 'training', combatType: 'Weapons', affirmationCategory: 'Combat Mastery', xpReward: 25, description: 'HEMA/Kali + Pre-training affirmations' },
      { id: 'da', time: '19:00', endTime: '20:00', activity: 'DA Job - AI Business', type: 'da', xpReward: 15, description: 'Use productively' },
      { id: 'weapons2', time: '20:00', endTime: '21:30', activity: 'Weapons Training Pt.2', type: 'training', combatType: 'Weapons', xpReward: 25 },
      { id: 'evening', time: '21:30', endTime: '23:30', activity: 'Evening Business + Wind Down', type: 'business', xpReward: 20 },
      { id: 'reflection', time: '23:30', endTime: '00:00', activity: 'Evening Reflection', type: 'core', xpReward: 15, description: 'Daily review + prep tomorrow' },
    ];

    const weekendSchedule: ScheduleBlock[] = [
      { id: 'wake', time: '06:30', endTime: '07:00', activity: 'Wake Up + Core Declarations', type: 'affirmations', affirmationCategory: 'Core Identity', xpReward: 35, description: '7 "I AM" statements + Cold shower' },
      { id: 'meditation', time: '07:00', endTime: '07:20', activity: 'Meditation + Mental Mantras', type: 'affirmations', affirmationCategory: 'Mental Discipline', xpReward: 30 },
      { id: 'breakfast', time: '07:20', endTime: '08:00', activity: 'Breakfast + Physical Affirmations', type: 'affirmations', affirmationCategory: 'Physical Excellence', xpReward: 25, description: 'Fireblood supplement' },
      { id: 'skill', time: '08:00', endTime: '08:45', activity: 'Morning Skill Training', type: 'training', xpReward: 10, description: 'OSINT/Spy Skills' },
      { id: 'work', time: '09:00', endTime: '12:00', activity: 'Deep Work + Business Mantras', type: 'business', affirmationCategory: 'Business Warrior', xpReward: 40, description: 'AI Business - hourly affirmations' },
      { id: 'lunch', time: '12:00', endTime: '13:00', activity: 'Lunch + Creatine', type: 'core', xpReward: 10 },
      { id: 'work2', time: '13:00', endTime: '15:00', activity: 'Deep Work Block 2', type: 'work', xpReward: 20 },
      { id: 'combat-intensive', time: '15:00', endTime: '17:30', activity: 'Combat Intensive Training', type: 'training', xpReward: 40, description: 'Extended martial arts and weapons training' },
      { id: 'dinner', time: '17:30', endTime: '18:30', activity: 'Dinner + Recovery', type: 'core', xpReward: 10 },
      { id: 'weapons1', time: '18:30', endTime: '19:00', activity: 'Weapons Training Pt.1', type: 'training', combatType: 'Weapons', affirmationCategory: 'Combat Mastery', xpReward: 25, description: 'HEMA/Kali + Pre-training affirmations' },
      { id: 'personal-dev', time: '19:00', endTime: '20:00', activity: 'Personal Development', type: 'core', xpReward: 20, description: 'Reading, learning, growth' },
      { id: 'weapons2', time: '20:00', endTime: '21:30', activity: 'Weapons Training Pt.2', type: 'training', combatType: 'Weapons', xpReward: 25 },
      { id: 'evening', time: '21:30', endTime: '23:30', activity: 'Evening Business + Wind Down', type: 'business', xpReward: 20 },
      { id: 'reflection', time: '23:30', endTime: '00:00', activity: 'Evening Reflection', type: 'core', xpReward: 15, description: 'Daily review + prep tomorrow' },
    ];

    const schedules: { [key: string]: ScheduleBlock[] } = {
      'Monday': weekdaySchedule,
      'Tuesday': weekdaySchedule,
      'Wednesday': weekdaySchedule,
      'Thursday': weekdaySchedule,
      'Friday': weekdaySchedule,
      'Saturday': weekendSchedule,
      'Sunday': weekendSchedule,
    };

    setScheduleBlocks(schedules[day] || weekdaySchedule);
  };

  const toggleBlock = (blockId: string) => {
    const newCompleted = new Set(completedBlocks);
    if (newCompleted.has(blockId)) {
      newCompleted.delete(blockId);
    } else {
      newCompleted.add(blockId);
    }
    setCompletedBlocks(newCompleted);
  };

  const saveBlockChanges = async (block: ScheduleBlock) => {
    try {
      const { error } = await supabase
        .from('daily_schedule_blocks')
        .upsert({
          day_of_week: selectedDay,
          block_id: block.id,
          time: block.time,
          end_time: block.endTime,
          activity: block.activity,
          type: block.type,
          description: block.description || null,
          affirmation_category: block.affirmationCategory || null,
          combat_type: block.combatType || null,
          xp_reward: block.xpReward,
          checklist: block.checklist || [],
          notes: block.notes || [],
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'day_of_week,block_id'
        });

      if (error) throw error;

      toast.success('Changes saved!');
      await loadDaySchedule(selectedDay);
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Failed to save changes');
    }
  };

  const getTaskDetails = (block: ScheduleBlock): { checklist: string[], notes: string[] } => {
    if (block.checklist && block.checklist.length > 0) {
      return {
        checklist: block.checklist,
        notes: block.notes || []
      };
    }

    const taskDetailsMap: { [key: string]: { checklist: string[], notes: string[] } } = {
      'wake': {
        checklist: [
          'Say 7 Core "I AM" declarations',
          'Take cold shower (3-5 minutes)',
          'Put on day clothes',
          'Prepare mind for the day'
        ],
        notes: [
          'Stand tall, speak with conviction',
          'Cold shower activates alertness',
          'Set intention for dominating the day'
        ]
      },
      'meditation': {
        checklist: [
          'Find quiet space',
          'Sit in meditation posture',
          'Focus on breath for 10 minutes',
          'Recite mental discipline mantras',
          'Visualize successful day'
        ],
        notes: [
          'Clear your mind of distractions',
          'Build mental fortress',
          'Strengthen willpower and focus'
        ]
      },
      'breakfast': {
        checklist: [
          'Take Fireblood supplement',
          'Eat high-protein breakfast',
          'Drink 16oz water',
          'Say physical excellence affirmations',
          'Plan training for the day'
        ],
        notes: [
          'Fuel your body properly',
          'Hydration is critical',
          'Prepare physically for combat'
        ]
      },
      'skill': {
        checklist: [
          'Study OSINT techniques',
          'Practice surveillance detection',
          'Learn new intelligence gathering method',
          'Document progress'
        ],
        notes: [
          'Build operational awareness',
          'Master the art of information gathering',
          'Stay sharp, stay invisible'
        ]
      },
      'work': {
        checklist: [
          'Review daily AI business goals',
          'Deep focus - no distractions',
          'Hourly business warrior affirmations',
          'Track progress and results',
          'Update project boards'
        ],
        notes: [
          'Build your empire methodically',
          'Every hour counts',
          'Dominate the business battlefield'
        ]
      },
      'tennis': {
        checklist: [
          'Warm up properly (10 min)',
          'Drill footwork and positioning',
          'Practice serves',
          'Work on returns',
          'Hydrate every 20 minutes',
          'Cool down stretches'
        ],
        notes: [
          'CRITICAL: Stay hydrated',
          'Focus on form and technique',
          'Mental game is as important as physical'
        ]
      },
      'weapons1': {
        checklist: [
          'Say combat mastery affirmations',
          'Warm up with shadow work',
          'HEMA drills - guards and cuts',
          'Kali stick flow patterns',
          'Partner drills if available',
          'Cool down stretches'
        ],
        notes: [
          'Precision over speed initially',
          'Build muscle memory',
          'Visualize real combat scenarios',
          'Become one with the weapon'
        ]
      },
      'da': {
        checklist: [
          'Log into DA systems',
          'Use time for AI business development',
          'Research and planning',
          'Network and build connections',
          'Document opportunities'
        ],
        notes: [
          'Turn required time into productive gains',
          'Build your future while fulfilling obligations',
          'Strategic mindset always'
        ]
      },
      'weapons2': {
        checklist: [
          'Continue weapon mastery training',
          'Advanced combinations',
          'Sparring if possible',
          'Work on weak points',
          'Film technique for review',
          'Proper cool down'
        ],
        notes: [
          'Push past comfort zone',
          'Every rep builds deadliness',
          'Train like your life depends on it'
        ]
      },
      'evening': {
        checklist: [
          'Review business metrics',
          'Plan tomorrow\'s business strategy',
          'Respond to important messages',
          'Wind down screen time',
          'Prepare for sleep'
        ],
        notes: [
          'End the day with purpose',
          'Set yourself up for tomorrow\'s victory',
          'Rest is part of the mission'
        ]
      },
      'reflection': {
        checklist: [
          'Journal about the day',
          'Mark completed affirmations',
          'Review what worked and what didn\'t',
          'Set intentions for tomorrow',
          'Prepare schedule and gear'
        ],
        notes: [
          'Honest self-assessment',
          'Learn from every day',
          'Continuous improvement mindset'
        ]
      }
    };

    return taskDetailsMap[block.id] || {
      checklist: ['Complete this task according to schedule'],
      notes: ['Stay focused and execute with precision']
    };
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'affirmations': return <Sparkles className="w-5 h-5" />;
      case 'training': return <Target className="w-5 h-5" />;
      case 'core': return <Coffee className="w-5 h-5" />;
      case 'business': return <Flame className="w-5 h-5" />;
      case 'work': return <Brain className="w-5 h-5" />;
      case 'class': return <Brain className="w-5 h-5" />;
      case 'da': return <Dumbbell className="w-5 h-5" />;
      case 'recovery': return <Moon className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'affirmations': return soloLevelingTheme.glow.secondary;
      case 'training': return soloLevelingTheme.stats.strength;
      case 'core': return soloLevelingTheme.stats.wisdom;
      case 'business': return soloLevelingTheme.stats.luck;
      case 'work': return soloLevelingTheme.glow.cyan;
      case 'class': return soloLevelingTheme.glow.primary;
      case 'da': return soloLevelingTheme.stats.endurance;
      case 'recovery': return soloLevelingTheme.stats.agility;
      default: return soloLevelingTheme.glow.primary;
    }
  };

  const totalXP = scheduleBlocks.reduce((sum, block) => sum + block.xpReward, 0);
  const earnedXP = scheduleBlocks
    .filter(block => completedBlocks.has(block.id))
    .reduce((sum, block) => sum + block.xpReward, 0);
  const completionPercentage = scheduleBlocks.length > 0
    ? Math.round((completedBlocks.size / scheduleBlocks.length) * 100)
    : 0;

  const getNextDays = () => {
    const currentIndex = daysOfWeek.indexOf(selectedDay);
    const nextDays = [];
    for (let i = 1; i <= 3; i++) {
      const nextIndex = (currentIndex + i) % 7;
      nextDays.push(daysOfWeek[nextIndex]);
    }
    return nextDays;
  };

  const getCurrentBlock = () => {
    const now = currentTime;
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTimeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    return scheduleBlocks.find(block => {
      const [startHour, startMin] = block.time.split(':').map(Number);
      const [endHour, endMin] = block.endTime.split(':').map(Number);

      const currentMinutes = hours * 60 + minutes;
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    });
  };

  const getNextBlock = () => {
    const now = currentTime;
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentMinutes = hours * 60 + minutes;

    return scheduleBlocks.find(block => {
      const [startHour, startMin] = block.time.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      return currentMinutes < startMinutes;
    });
  };

  const getTimeUntilNext = () => {
    const nextBlock = getNextBlock();
    if (!nextBlock) return null;

    const now = currentTime;
    const [startHour, startMin] = nextBlock.time.split(':').map(Number);

    const targetTime = new Date(now);
    targetTime.setHours(startHour, startMin, 0, 0);

    const diff = targetTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds, block: nextBlock };
  };

  const currentBlock = getCurrentBlock();
  const timeUntilNext = getTimeUntilNext();

  const calculateDuration = (startTime: string, endTime: string) => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const exportSchedule = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      day: selectedDay,
      schedule: scheduleBlocks.map(block => ({
        ...block,
        checklist: getTaskDetails(block).checklist,
        notes: getTaskDetails(block).notes
      })),
      completedBlocks: Array.from(completedBlocks),
      stats: {
        totalBlocks: scheduleBlocks.length,
        completedCount: completedBlocks.size,
        completionPercentage,
        totalXP,
        earnedXP
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-schedule-${selectedDay}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Schedule exported successfully!');
  };

  const exportAllDays = async () => {
    const allDaysData: any = {
      exportDate: new Date().toISOString(),
      weeks: {}
    };

    for (const day of daysOfWeek) {
      try {
        const { data, error } = await supabase
          .from('daily_schedule_blocks')
          .select('*')
          .eq('day_of_week', day)
          .order('time', { ascending: true });

        if (!error && data && data.length > 0) {
          allDaysData.weeks[day] = data.map(block => ({
            id: block.block_id,
            time: block.time,
            endTime: block.end_time,
            activity: block.activity,
            type: block.type,
            description: block.description,
            affirmationCategory: block.affirmation_category,
            combatType: block.combat_type,
            xpReward: block.xp_reward,
            checklist: block.checklist,
            notes: block.notes
          }));
        }
      } catch (error) {
        console.error(`Error loading ${day}:`, error);
      }
    }

    const blob = new Blob([JSON.stringify(allDaysData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complete-weekly-schedule-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Complete weekly schedule exported!');
  };

  const exportAsPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${selectedDay}'s Schedule</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: #0a0e27;
            color: #e2e8f0;
          }
          h1 {
            color: #a78bfa;
            border-bottom: 2px solid #7c3aed;
            padding-bottom: 10px;
          }
          .block {
            margin: 20px 0;
            padding: 15px;
            background: #1e293b;
            border-left: 4px solid #7c3aed;
            page-break-inside: avoid;
          }
          .block-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .time {
            color: #60a5fa;
            font-weight: bold;
          }
          .activity {
            font-size: 18px;
            font-weight: bold;
            margin: 5px 0;
          }
          .description {
            color: #94a3b8;
            font-size: 14px;
            margin: 5px 0;
          }
          .checklist {
            margin: 10px 0;
            padding-left: 20px;
          }
          .checklist li {
            margin: 5px 0;
          }
          .notes {
            background: #fef3c7;
            color: #92400e;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
          }
          .xp {
            color: #fbbf24;
            font-weight: bold;
          }
          @media print {
            body { background: white; color: black; }
            .block { border-color: #666; }
          }
        </style>
      </head>
      <body>
        <h1>${selectedDay}'s Schedule</h1>
        <p>Generated: ${new Date().toLocaleDateString()}</p>
        <p>Total XP Available: <span class="xp">${totalXP} XP</span></p>
        ${scheduleBlocks.map(block => {
          const details = getTaskDetails(block);
          return `
            <div class="block">
              <div class="block-header">
                <span class="time">${block.time} - ${block.endTime}</span>
                <span class="xp">+${block.xpReward} XP</span>
              </div>
              <div class="activity">${block.activity}</div>
              ${block.description ? `<div class="description">${block.description}</div>` : ''}
              ${block.affirmationCategory ? `<div class="description">🌟 ${block.affirmationCategory}</div>` : ''}
              ${block.combatType ? `<div class="description">⚔️ ${block.combatType}</div>` : ''}
              ${details.checklist.length > 0 ? `
                <div class="checklist">
                  <strong>Checklist:</strong>
                  <ul>
                    ${details.checklist.map(item => `<li>${item}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
              ${details.notes.length > 0 ? `
                <div class="notes">
                  <strong>Important Notes:</strong>
                  <ul>
                    ${details.notes.map(note => `<li>${note}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="space-y-6">
      {/* Export Controls */}
      <div
        className="rounded-xl p-4"
        style={{
          background: soloLevelingTheme.background.card,
          border: `1px solid ${soloLevelingTheme.border.default}`,
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <span className="text-white font-medium">Export Options</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={exportSchedule}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2"
              style={{
                background: soloLevelingTheme.background.secondary,
                border: `1px solid ${soloLevelingTheme.border.default}`,
              }}
            >
              <Download className="w-4 h-4" />
              Export Current Day
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={exportAllDays}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2"
              style={{
                background: soloLevelingTheme.background.secondary,
                border: `1px solid ${soloLevelingTheme.border.default}`,
              }}
            >
              <Calendar className="w-4 h-4" />
              Export Full Week
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={exportAsPDF}
              className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${soloLevelingTheme.glow.primary}, ${soloLevelingTheme.glow.secondary})`,
                color: 'white',
              }}
            >
              <FileText className="w-4 h-4" />
              Print/PDF
            </motion.button>
          </div>
        </div>
      </div>
      {/* Time & Next Task Banner */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: soloLevelingTheme.gradient.card,
          border: `2px solid ${soloLevelingTheme.border.purple}`,
          boxShadow: soloLevelingTheme.shadow.purpleGlow,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />

        <div className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Time */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-slate-400">Current Time</span>
              </div>
              <div className="text-4xl font-bold text-white font-mono">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
              </div>
              {currentBlock && (
                <div className="mt-2 flex items-center gap-2">
                  <div
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      background: `${getTypeColor(currentBlock.type)}30`,
                      color: getTypeColor(currentBlock.type),
                    }}
                  >
                    Active Now: {currentBlock.activity}
                  </div>
                </div>
              )}
            </div>

            {/* Next Task Countdown */}
            {timeUntilNext && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Timer className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-slate-400">Next Task</span>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 font-mono">
                      {timeUntilNext.hours.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-slate-500">Hours</div>
                  </div>
                  <div className="text-2xl text-slate-500">:</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 font-mono">
                      {timeUntilNext.minutes.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-slate-500">Minutes</div>
                  </div>
                  <div className="text-2xl text-slate-500">:</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 font-mono">
                      {timeUntilNext.seconds.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-slate-500">Seconds</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-white">{timeUntilNext.block.activity}</span>
                  <span className="text-xs text-slate-400">at {timeUntilNext.block.time}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Current Day Header */}
      <div
        className="rounded-2xl p-8 relative overflow-hidden"
        style={{
          background: soloLevelingTheme.gradient.card,
          border: `2px solid ${soloLevelingTheme.border.default}`,
          boxShadow: soloLevelingTheme.shadow.glowStrong,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">{selectedDay}'s Schedule</h3>
              <p className="text-slate-400">Complete blocks to earn XP and level up</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-400">{completionPercentage}%</div>
              <div className="text-sm text-slate-400">Complete</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-slate-400 mb-1">Blocks Completed</div>
              <div className="text-2xl font-bold text-white">
                {completedBlocks.size} / {scheduleBlocks.length}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-1">XP Earned</div>
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                <span className="text-2xl font-bold text-yellow-400">
                  {earnedXP} / {totalXP}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div
              className="h-4 rounded-full overflow-hidden"
              style={{ background: soloLevelingTheme.progress.barBg }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(earnedXP / totalXP) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full relative"
                style={{
                  background: `linear-gradient(90deg, ${soloLevelingTheme.glow.primary}, ${soloLevelingTheme.glow.secondary})`,
                  boxShadow: `0 0 15px ${soloLevelingTheme.progress.glow}`,
                }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Blocks */}
      <div className="space-y-3">
        {scheduleBlocks.map((block, index) => {
          const isCompleted = completedBlocks.has(block.id);
          const color = getTypeColor(block.type);

          return (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ x: 4, scale: 1.01 }}
              onClick={() => setSelectedBlock(block)}
              className="rounded-xl p-4 cursor-pointer transition-all duration-300"
              style={{
                background: isCompleted
                  ? `${color}15`
                  : soloLevelingTheme.background.card,
                border: `1px solid ${isCompleted ? color + '60' : soloLevelingTheme.border.default}`,
                boxShadow: isCompleted
                  ? `0 0 20px ${color}30`
                  : soloLevelingTheme.shadow.card,
              }}
            >
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-8 h-8" style={{ color }} />
                  ) : (
                    <Circle className="w-8 h-8" style={{ color: soloLevelingTheme.border.default }} />
                  )}
                </motion.div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <div style={{ color }}>
                      {getTypeIcon(block.type)}
                    </div>
                    <span className="text-slate-400 text-sm font-mono">
                      {block.time} - {block.endTime}
                    </span>
                    <span className="text-slate-500 text-xs">
                      ({calculateDuration(block.time, block.endTime)})
                    </span>
                  </div>

                  <h4 className={`text-lg font-bold mb-1 ${isCompleted ? 'text-white' : 'text-slate-300'}`}>
                    {block.activity}
                  </h4>

                  {block.description && (
                    <p className="text-sm text-slate-400">{block.description}</p>
                  )}

                  {block.affirmationCategory && (
                    <div className="flex items-center gap-2 mt-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="text-xs text-purple-400 font-medium">
                        Includes: {block.affirmationCategory}
                      </span>
                    </div>
                  )}

                  {block.combatType && (
                    <div className="flex items-center gap-2 mt-2">
                      <Target className="w-4 h-4 text-red-400" />
                      <span className="text-xs text-red-400 font-medium">
                        Combat: {block.combatType}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-bold">+{block.xpReward}</span>
                    </div>
                    <div className="text-xs text-slate-500">XP</div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Upcoming Days */}
      <div
        className="rounded-xl p-6"
        style={{
          background: soloLevelingTheme.background.card,
          border: `1px solid ${soloLevelingTheme.border.default}`,
          boxShadow: soloLevelingTheme.shadow.card,
        }}
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          Coming Up
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {getNextDays().map((day, index) => (
            <motion.button
              key={day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedDay(day)}
              className="p-4 rounded-xl transition-all text-left"
              style={{
                background: soloLevelingTheme.background.secondary,
                border: `1px solid ${soloLevelingTheme.border.default}`,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-white">{day}</span>
                <ChevronRight className="w-5 h-5 text-slate-500" />
              </div>
              <div className="text-sm text-slate-400">
                {day === 'Monday' || day === 'Friday' ? 'Business Focus' :
                 day === 'Tuesday' || day === 'Thursday' ? 'Classes' :
                 day === 'Wednesday' ? 'Intel & Recovery' :
                 day === 'Saturday' ? 'MMA Integration' :
                 'Weekly Review'}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-yellow-400 font-bold">
                  ~{day === 'Saturday' ? '350' : day === 'Friday' ? '320' : '310'} XP
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedBlock && (
        <EnhancedTaskModal
          dayOfWeek={selectedDay}
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
