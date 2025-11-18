import { useState } from 'react';
import { Clock, ChevronRight, ChevronDown, Target } from 'lucide-react';
import { Card, CardBody } from './ui/Card';
import { Badge } from './ui/Badge';

interface TimeBlock {
  time: string;
  name: string;
  duration: string;
  category: 'morning' | 'work' | 'midday' | 'tennis' | 'evening' | 'night' | 'all-day';
  daySpecific: boolean;
}

const categoryColors = {
  morning: 'bg-orange-50 border-orange-200',
  work: 'bg-blue-50 border-blue-200',
  midday: 'bg-green-50 border-green-200',
  tennis: 'bg-purple-50 border-purple-200',
  evening: 'bg-red-50 border-red-200',
  night: 'bg-indigo-50 border-indigo-200',
  'all-day': 'bg-gray-50 border-gray-200'
};

const categoryBadgeColors = {
  morning: 'warning',
  work: 'info',
  midday: 'success',
  tennis: 'neutral',
  evening: 'danger',
  night: 'info',
  'all-day': 'neutral'
} as const;

const dailyTasks: TimeBlock[] = [
  {
    time: '6:30 AM',
    name: 'Wake Up Protocol',
    duration: '5 minutes',
    category: 'morning',
    daySpecific: false
  },
  {
    time: '6:30 AM',
    name: 'Cold Shower',
    duration: '3 minutes',
    category: 'morning',
    daySpecific: false
  },
  {
    time: '7:00 AM',
    name: 'Meditation + Cycling Mantras',
    duration: '20 minutes',
    category: 'morning',
    daySpecific: false
  },
  {
    time: '7:20 AM',
    name: 'Breakfast + Fuel Affirmations',
    duration: '20 minutes',
    category: 'morning',
    daySpecific: false
  },
  {
    time: '7:45 AM',
    name: 'Morning Skill Development',
    duration: '45 minutes',
    category: 'morning',
    daySpecific: true
  },
  {
    time: '8:30 AM',
    name: 'DA Job Start / Classes',
    duration: '3.5 hours',
    category: 'work',
    daySpecific: true
  },
  {
    time: '12:00 PM',
    name: 'Lunch + Performance Affirmations',
    duration: '30 minutes',
    category: 'midday',
    daySpecific: false
  },
  {
    time: '12:30 PM',
    name: 'Business Development Work',
    duration: '2 hours',
    category: 'midday',
    daySpecific: true
  },
  {
    time: '2:30 PM',
    name: 'Pre-Tennis Warrior Mantras',
    duration: '10 minutes',
    category: 'tennis',
    daySpecific: false
  },
  {
    time: '3:00 PM',
    name: 'Tennis Practice',
    duration: '2.5 hours',
    category: 'tennis',
    daySpecific: false
  },
  {
    time: '5:30 PM',
    name: 'Dinner + Recovery Affirmations',
    duration: '30 minutes',
    category: 'evening',
    daySpecific: false
  },
  {
    time: '6:30 PM',
    name: 'Combat Training',
    duration: '60-90 minutes',
    category: 'evening',
    daySpecific: true
  },
  {
    time: '7:00 PM / 8:00 PM',
    name: 'Evening Work Block',
    duration: '1-2 hours',
    category: 'evening',
    daySpecific: true
  },
  {
    time: '11:00 PM',
    name: 'Tomorrow Planning',
    duration: '15 minutes',
    category: 'night',
    daySpecific: false
  },
  {
    time: '11:30 PM',
    name: 'Evening Reflection + Stretching',
    duration: '15 minutes',
    category: 'night',
    daySpecific: false
  },
  {
    time: '11:45 PM',
    name: 'Bed Protocol',
    duration: '15 minutes',
    category: 'night',
    daySpecific: false
  },
  {
    time: 'ALL DAY',
    name: 'No Porn - Zero Tolerance',
    duration: 'Continuous',
    category: 'all-day',
    daySpecific: false
  },
  {
    time: 'ALL DAY',
    name: 'No Mindless Scrolling',
    duration: 'Continuous',
    category: 'all-day',
    daySpecific: false
  },
  {
    time: 'ALL DAY',
    name: 'Track Everything',
    duration: 'Continuous',
    category: 'all-day',
    daySpecific: false
  }
];

export function TasksView() {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('all');

  const days = ['all', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const toggleTask = (taskName: string) => {
    setExpandedTask(expandedTask === taskName ? null : taskName);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 text-white rounded-xl p-8 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur rounded-xl">
            <Target className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-1">Daily Tasks</h2>
            <p className="text-sm opacity-90">Complete chronological task list</p>
          </div>
        </div>
      </div>

      {/* Day Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              selectedDay === day
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
            }`}
          >
            {day.charAt(0).toUpperCase() + day.slice(1)}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {dailyTasks.map((task, index) => (
          <Card
            key={index}
            className={`border-2 ${categoryColors[task.category]} transition-all hover:shadow-md cursor-pointer`}
            onClick={() => toggleTask(task.name)}
          >
            <CardBody>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-blue-600">{task.time}</span>
                    <Badge variant={categoryBadgeColors[task.category]} size="sm">
                      {task.duration}
                    </Badge>
                    {task.daySpecific && (
                      <Badge variant="warning" size="sm">Day Specific</Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-blue-600 mb-1">{task.name}</h3>

                  {expandedTask === task.name && (
                    <div className="mt-4 space-y-3">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-900 font-medium mb-2">
                          📋 Full instructions available in your detailed schedule files
                        </p>
                        <p className="text-sm text-blue-800">
                          Click the task in the schedule to see step-by-step instructions, affirmations,
                          completion criteria, and harsh reality checks.
                        </p>
                      </div>

                      {task.daySpecific && (
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <p className="text-sm text-orange-900 font-medium mb-2">
                            ⚠️ This task varies by day of the week
                          </p>
                          <p className="text-sm text-orange-800">
                            Monday, Wednesday, Friday have different activities than Tuesday, Thursday.
                            Check your detailed schedule for day-specific variations.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {expandedTask === task.name ? (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Daily XP Info */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
        <CardBody>
          <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-green-600" />
            Daily XP Breakdown
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Morning Block</p>
              <p className="text-2xl font-bold text-green-600">60 XP</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Work Block</p>
              <p className="text-2xl font-bold text-blue-600">40 XP</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tennis Block</p>
              <p className="text-2xl font-bold text-purple-600">45 XP</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Evening Block</p>
              <p className="text-2xl font-bold text-red-600">60 XP</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Night Block</p>
              <p className="text-2xl font-bold text-indigo-600">40 XP</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">All-Day Tasks</p>
              <p className="text-2xl font-bold text-gray-600">25 XP</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600">Total Possible</p>
              <p className="text-3xl font-bold text-green-600">270+ XP</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
