import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, subDays } from 'date-fns';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Award, TrendingUp, Target, Flame, Calendar as CalendarIcon, Trophy, Medal } from 'lucide-react';
import { TimeBlock } from '../types';
import { Card, CardBody } from './ui/Card';
import { ProgressRing } from './ui/ProgressRing';
import { mockDailyAnalytics, mockAchievements } from '../data/mockData';

interface EnhancedProgressDashboardProps {
  blocks: TimeBlock[];
  completedBlocks: Set<string>;
  streak: number;
}

export function EnhancedProgressDashboard({ blocks, completedBlocks, streak }: EnhancedProgressDashboardProps) {
  const todayAnalytics = mockDailyAnalytics[mockDailyAnalytics.length - 1];
  const weeklyAverage = Math.round(
    (mockDailyAnalytics.reduce((sum, day) => sum + day.completionRate, 0) / mockDailyAnalytics.length) * 100
  );

  const categoryScores = useMemo(() => {
    const categories: { [key: string]: { completed: number; total: number; color: string } } = {
      academic: { completed: 0, total: 0, color: '#F59E0B' },
      training: { completed: 0, total: 0, color: '#EF4444' },
      business: { completed: 0, total: 0, color: '#3B82F6' },
      meditation: { completed: 0, total: 0, color: '#8B5CF6' },
      personal: { completed: 0, total: 0, color: '#EC4899' },
      health: { completed: 0, total: 0, color: '#10B981' }
    };

    blocks.forEach(block => {
      const category = block.activityType;
      if (categories[category]) {
        categories[category].total++;
        if (completedBlocks.has(block.id)) {
          categories[category].completed++;
        }
      }
    });

    return [
      {
        category: 'Academic',
        value: Math.round((categories.academic.completed / Math.max(categories.academic.total, 1)) * 100),
        fullMark: 100
      },
      {
        category: 'Training',
        value: Math.round((categories.training.completed / Math.max(categories.training.total, 1)) * 100),
        fullMark: 100
      },
      {
        category: 'Business',
        value: Math.round((categories.business.completed / Math.max(categories.business.total, 1)) * 100),
        fullMark: 100
      },
      {
        category: 'Meditation',
        value: Math.round((categories.meditation.completed / Math.max(categories.meditation.total, 1)) * 100),
        fullMark: 100
      },
      {
        category: 'Personal',
        value: Math.round((categories.personal.completed / Math.max(categories.personal.total, 1)) * 100),
        fullMark: 100
      },
      {
        category: 'Health',
        value: Math.round((categories.health.completed / Math.max(categories.health.total, 1)) * 100),
        fullMark: 100
      }
    ];
  }, [blocks, completedBlocks]);

  const weeklyTrendData = mockDailyAnalytics.map(day => ({
    date: format(new Date(day.date), 'EEE'),
    completion: Math.round(day.completionRate * 100),
    score: day.score
  }));

  const unlockedAchievements = mockAchievements.filter(a => a.isUnlocked);
  const inProgressAchievements = mockAchievements.filter(a => !a.isUnlocked && a.progress > 0);

  const totalScore = todayAnalytics.score;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white rounded-xl p-8 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Award className="w-10 h-10" />
            <div>
              <h2 className="text-3xl font-bold">Performance Analytics</h2>
              <p className="text-sm opacity-90">Track your progress across all areas</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold">{totalScore}</div>
            <div className="text-sm opacity-90">Today's Score</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="text-3xl font-bold">{Math.round((completedBlocks.size / blocks.length) * 100)}%</div>
            <div className="text-sm opacity-90">Completion Rate</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="text-3xl font-bold">{weeklyAverage}%</div>
            <div className="text-sm opacity-90">Weekly Average</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="text-3xl font-bold">{streak}</div>
            <div className="text-sm opacity-90">Day Streak</div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Weekly Completion Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="completion"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Average: {weeklyAverage}% completion this week
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-green-600" />
              Category Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={categoryScores}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="category" stroke="#6b7280" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#6b7280" />
                <Radar
                  name="Performance"
                  dataKey="value"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Balanced performance across all categories
            </p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody>
          <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-purple-600" />
            Daily Score Comparison
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="score" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200">
          <CardBody>
            <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              Streak Progress
            </h3>
            <div className="flex items-center justify-center mb-6">
              <ProgressRing progress={(streak / 30) * 100} size={150} strokeWidth={12} color="#f97316" label={`${streak} days`} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Next milestone: 7 days</span>
                <span className="font-bold text-orange-600">{Math.max(0, 7 - streak)} days to go</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500"
                  style={{ width: `${Math.min((streak / 7) * 100, 100)}%` }}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200">
          <CardBody>
            <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Achievements
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {unlockedAchievements.map(achievement => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-yellow-200"
                >
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Medal className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{achievement.title}</p>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                  <div className="text-2xl">🏆</div>
                </motion.div>
              ))}
              {inProgressAchievements.slice(0, 3).map(achievement => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-700">{achievement.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500"
                          style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        {achievement.progress}/{achievement.target}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
