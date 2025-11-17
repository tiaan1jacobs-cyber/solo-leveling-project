import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  Target,
  Flame,
  TrendingUp,
  Award,
  Calendar as CalendarIcon,
  ArrowRight,
  Check,
  X,
  Zap
} from 'lucide-react';
import { Card, CardBody } from './ui/Card';
import { StatCard } from './ui/StatCard';
import { ProgressRing } from './ui/ProgressRing';
import { Badge } from './ui/Badge';
import { TimeBlock, AIAdaptation } from '../types';
import { GlowingStatsGrid } from './GlowingStatsGrid';
import {
  mockAIAdaptations,
  mockDailyAnalytics,
  mockAchievements,
  mockPatternDetections,
  getRandomQuote,
  calculateOptimizationScore
} from '../data/mockData';

interface DashboardProps {
  blocks: TimeBlock[];
  completedBlocks: Set<string>;
  streak: number;
  currentTemplate: string;
}

export function Dashboard({ blocks, completedBlocks, streak, currentTemplate }: DashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quote] = useState(getRandomQuote());
  const [adaptations, setAdaptations] = useState(mockAIAdaptations);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pendingAdaptations = adaptations.filter(a => a.status === 'pending');
  const acceptedAdaptations = adaptations.filter(a => a.status === 'accepted');
  const todayAnalytics = mockDailyAnalytics[mockDailyAnalytics.length - 1];
  const unlockedAchievements = mockAchievements.filter(a => a.isUnlocked);
  const optimizationScore = calculateOptimizationScore(mockDailyAnalytics, mockPatternDetections, adaptations);

  const currentBlock = useMemo(() => {
    const now = format(currentTime, 'HH:mm');
    return blocks.find(block => {
      return block.startTime <= now && block.endTime > now;
    });
  }, [blocks, currentTime]);

  const upcomingBlocks = useMemo(() => {
    const now = format(currentTime, 'HH:mm');
    return blocks.filter(block => block.startTime > now).slice(0, 3);
  }, [blocks, currentTime]);

  const handleAcceptAdaptation = (id: string) => {
    setAdaptations(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'accepted' as const } : a))
    );
  };

  const handleRejectAdaptation = (id: string) => {
    setAdaptations(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'rejected' as const } : a))
    );
  };

  const completionRate = blocks.length > 0 ? (completedBlocks.size / blocks.length) * 100 : 0;
  const tasksRemaining = blocks.length - completedBlocks.size;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-8 text-white relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
          border: '2px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 0 30px rgba(59, 130, 246, 0.3), 0 0 60px rgba(59, 130, 246, 0.1)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">Welcome Back, Champion!</h1>
            <p className="text-lg opacity-90 italic">"{quote.text}"</p>
            <p className="text-sm opacity-75 mt-1">— {quote.author}</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold tracking-tight">
              {format(currentTime, 'HH:mm:ss')}
            </div>
            <div className="text-lg opacity-90 mt-1">
              {format(currentTime, 'EEEE, MMMM d, yyyy')}
            </div>
            <Badge variant="info" className="mt-2 bg-white/20 text-white border-white/30">
              {currentTemplate}
            </Badge>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlowingStatsGrid />
      </motion.div>

      {pendingAdaptations.length > 0 && (
        <Card className="border-2" style={{
          borderColor: 'rgba(59, 130, 246, 0.5)',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
        }}>
          <CardBody>
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-lg" style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(6, 182, 212, 0.3))',
                border: '1px solid rgba(59, 130, 246, 0.5)'
              }}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">AI Schedule Adjustments</h3>
                <p className="text-sm text-slate-400">Your AI coach has detected patterns and suggests these optimizations</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{optimizationScore}</div>
                  <div className="text-xs text-gray-600">Optimization</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {pendingAdaptations.map((adaptation) => (
                <motion.div
                  key={adaptation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-lg p-4 transition-colors"
                  style={{
                    background: 'rgba(15, 20, 25, 0.5)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-blue-600" />
                        <h4 className="font-semibold text-white">{adaptation.title}</h4>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">{adaptation.reasoning}</p>
                      {adaptation.beforeValue && adaptation.afterValue && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-slate-500 line-through">{adaptation.beforeValue}</span>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                          <span className="text-blue-600 font-medium">{adaptation.afterValue}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAcceptAdaptation(adaptation.id)}
                        className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                        title="Accept"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRejectAdaptation(adaptation.id)}
                        className="p-2 rounded-lg transition-colors"
                        style={{ background: 'rgba(100, 116, 139, 0.2)', color: '#cbd5e1' }}
                        title="Dismiss"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {acceptedAdaptations.length > 0 && (
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <p className="text-sm text-slate-400">
                  <CheckCircle2 className="w-4 h-4 inline mr-1 text-green-500" />
                  {acceptedAdaptations.length} adaptation{acceptedAdaptations.length > 1 ? 's' : ''} applied this week
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tasks Completed"
          value={`${completedBlocks.size}/${blocks.length}`}
          icon={CheckCircle2}
          subtitle={`${tasksRemaining} remaining`}
          color="green"
          gradient="from-green-500 to-emerald-500"
        />
        <StatCard
          title="Completion Rate"
          value={`${Math.round(completionRate)}%`}
          icon={Target}
          subtitle="Today's progress"
          color="blue"
          gradient="from-blue-500 to-cyan-500"
        />
        <StatCard
          title="Current Streak"
          value={`${streak} days`}
          icon={Flame}
          subtitle="Keep it going!"
          color="orange"
          gradient="from-orange-500 to-amber-500"
        />
        <StatCard
          title="Rules Followed"
          value={`${todayAnalytics.rulesFollowed}/20`}
          icon={Award}
          subtitle="Perfect discipline"
          color="purple"
          gradient="from-purple-500 to-pink-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2">
          <CardBody>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-400" />
              Today at a Glance
            </h3>

            {currentBlock && (
              <div className="mb-6 p-4 rounded-lg" style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1))',
                border: '2px solid rgba(59, 130, 246, 0.3)'
              }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Badge variant="info" size="sm" className="mb-2">NOW</Badge>
                    <h4 className="font-bold text-white mb-1">{currentBlock.title}</h4>
                    <p className="text-sm text-slate-400">
                      {currentBlock.startTime} - {currentBlock.endTime}
                    </p>
                  </div>
                  <ProgressRing
                    progress={completedBlocks.has(currentBlock.id) ? 100 : 50}
                    size={60}
                    strokeWidth={6}
                    color="#3b82f6"
                    showLabel={false}
                  />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h4 className="font-semibold text-slate-400 text-sm uppercase tracking-wide">Up Next</h4>
              {upcomingBlocks.map((block, index) => (
                <div
                  key={block.id}
                  className="flex items-center gap-3 p-3 rounded-lg transition-colors"
                  style={{ background: 'rgba(100, 116, 139, 0.1)' }}
                >
                  <div
                    className="w-1 h-12 rounded-full"
                    style={{ backgroundColor: block.color }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-white">{block.title}</p>
                    <p className="text-sm text-slate-400">{block.startTime}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">in {index === 0 ? '30m' : index === 1 ? '2h' : '4h'}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card className="border-2">
          <CardBody>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-400" />
              Performance Overview
            </h3>

            <div className="flex justify-center mb-6">
              <ProgressRing
                progress={completionRate}
                size={140}
                strokeWidth={12}
                color="#10b981"
                label="Today"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                <div className="text-2xl font-bold text-blue-600">{todayAnalytics.score}</div>
                <div className="text-xs text-slate-400 mt-1">Today's Score</div>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(mockDailyAnalytics.reduce((sum, d) => sum + d.completionRate, 0) / mockDailyAnalytics.length * 100)}%
                </div>
                <div className="text-xs text-slate-400 mt-1">Weekly Avg</div>
              </div>
            </div>

            {unlockedAchievements.length > 0 && (
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <h4 className="font-semibold text-slate-400 text-sm uppercase tracking-wide mb-3">Recent Achievements</h4>
                <div className="space-y-2">
                  {unlockedAchievements.slice(0, 3).map(achievement => (
                    <div key={achievement.id} className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-white">{achievement.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
